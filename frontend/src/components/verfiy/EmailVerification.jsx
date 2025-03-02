import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { useNavigate, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state or local storage
    const storedEmail = localStorage.getItem("verificationEmail");
    const stateEmail = location.state?.email;

    if (stateEmail) {
      setEmail(stateEmail);
      // Store in localStorage as fallback
      localStorage.setItem("verificationEmail", stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email found, redirect to signup
      toast.error("Session expired. Please sign up again.");
      navigate("/signup");
    }
  }, [location, navigate]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/signup");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${server}/user/verify-email`, {
        email,
        code: verificationCode,
      });
      toast.success("Account verified successfully!");
      // Clear stored email after successful verification
      localStorage.removeItem("verificationEmail");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/signup");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${server}/user/resend-verification-code`, { email });
      toast.success("New verification code sent!");
      setResendTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 4-digit code to{" "}
          <span className="font-medium text-blue-600">{email}</span>
        </p>
        <p className="text-center text-sm text-gray-500 mt-1">
          The code will expire in 5 minutes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleVerifyCode}>
            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  id="verificationCode"
                  type="text"
                  maxLength="4"
                  required
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/[^0-9]/g, "").substring(0, 4)
                    )
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter 4-digit code"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || verificationCode.length !== 4}
                className={`group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isSubmitting || verificationCode.length !== 4
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || isSubmitting}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : "Resend verification code"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
