const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");

// Store verification codes and timestamps
const verificationCodes = new Map();

// Generate a random 4-digit code
const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Check if a minute has passed since the last code was sent
const canSendNewCode = (email) => {
  if (!verificationCodes.has(email)) {
    return true;
  }

  const lastSent = verificationCodes.get(email).timestamp;
  const currentTime = Date.now();
  const oneMinute = 60 * 1000; // in milliseconds

  return currentTime - lastSent >= oneMinute;
};
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Check if we can send a new code
    if (!canSendNewCode(email)) {
      return next(
        new ErrorHandler(
          "Please wait 1 minute before requesting another code",
          400
        )
      );
    }

    // Check if file exists
    let fileUrl = null;
    if (req.file) {
      fileUrl = req.file.path;
    } else {
      // Set a default avatar or handle no file case
      fileUrl = "default_avatar.jpg"; // Or whatever default you want to use
    }

    const userData = {
      name,
      email,
      password,
      avatar: fileUrl,
    };

    // Generate a 4-digit verification code
    const verificationCode = generateVerificationCode();

    // Store the code and user data with timestamp
    verificationCodes.set(email, {
      code: verificationCode,
      userData,
      timestamp: Date.now(),
    });

    try {
      await sendMail({
        email: userData.email,
        subject: "Verify your account",
        message: `Hello ${userData.name}, your verification code is: ${verificationCode}. This code expires in 5 minutes.`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${userData.email} for the verification code!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.post(
  "/resend-verification-code",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!verificationCodes.has(email)) {
        return next(
          new ErrorHandler("No pending registration found for this email", 400)
        );
      }

      // Check if a minute has passed
      if (!canSendNewCode(email)) {
        return next(
          new ErrorHandler(
            "Please wait 1 minute before requesting another code",
            400
          )
        );
      }

      const userData = verificationCodes.get(email).userData;

      // Generate a new verification code
      const verificationCode = generateVerificationCode();

      // Update the code and timestamp
      verificationCodes.set(email, {
        code: verificationCode,
        userData,
        timestamp: Date.now(),
      });

      await sendMail({
        email: userData.email,
        subject: "Verify your account",
        message: `Hello ${userData.name}, your new verification code is: ${verificationCode}. This code expires in 5 minutes.`,
      });

      res.status(200).json({
        success: true,
        message: `New verification code sent to ${email}`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Verify email with code
router.post(
  "/verify-email",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, code } = req.body;

      if (!verificationCodes.has(email)) {
        return next(
          new ErrorHandler("Verification code expired or not found", 400)
        );
      }

      const storedData = verificationCodes.get(email);

      // Check if code is correct
      if (storedData.code !== code) {
        return next(new ErrorHandler("Invalid verification code", 400));
      }

      // Check if code is expired (5 minutes)
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      const timeElapsed = Date.now() - storedData.timestamp;

      if (timeElapsed > fiveMinutes) {
        verificationCodes.delete(email);
        return next(
          new ErrorHandler(
            "Verification code expired. Please request a new one.",
            400
          )
        );
      }

      const { name, email: userEmail, password, avatar } = storedData.userData;

      // Create user in the database
      const user = await User.create({
        name,
        email: userEmail,
        avatar,
        password,
      });

      // Remove from verification codes map after successful registration
      verificationCodes.delete(email);

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      console.log(addressId);

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
