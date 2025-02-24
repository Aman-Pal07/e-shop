import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate prices
  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const shipping = subTotalPrice * 0.1;

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPrice).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  // Validate shipping details
  const validateShippingDetails = () => {
    if (!address1 || !address2 || !zipCode || !country || !city) {
      toast.error("Please fill in all shipping address fields");
      return false;
    }

    if (zipCode.length < 4) {
      toast.error("Please enter a valid ZIP code");
      return false;
    }

    return true;
  };

  // Handle payment submission
  const paymentSubmit = () => {
    if (!validateShippingDetails()) return;

    setIsLoading(true);

    try {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle coupon submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${server}/coupon/get-coupon-value/${couponCode}`
      );
      const { couponCode: couponData } = response.data;

      if (!couponData) {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
        return;
      }

      const shopId = couponData.shopId;
      const couponValue = couponData.value;

      // Check if coupon is valid for items in cart
      const eligibleItems = cart.filter((item) => item.shopId === shopId);

      if (eligibleItems.length === 0) {
        toast.error("Coupon code is not valid for items in your cart");
        setCouponCode("");
        return;
      }

      // Calculate discount
      const eligiblePrice = eligibleItems.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
      );

      const discount = (eligiblePrice * couponValue) / 100;
      setDiscountPrice(discount);
      setCouponCodeData(couponData);
      setCouponCode("");

      toast.success(`Coupon applied! You saved $${discount.toFixed(2)}`);
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Error applying coupon. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saved address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setAddress1(address.address1);
    setAddress2(address.address2);
    setZipCode(address.zipCode);
    setCountry(address.country);
    setCity(address.city);
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedAddress={selectedAddress}
            handleAddressSelect={handleAddressSelect}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            cart={cart}
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPrice={discountPrice}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={!isLoading ? paymentSubmit : undefined}
      >
        <h5 className="text-white">
          {isLoading ? "Processing..." : "Go to Payment"}
        </h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  selectedAddress,
  handleAddressSelect,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8 shadow-md">
      <h5 className="text-[18px] font-[500] border-b pb-2">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              readOnly
              className={`${styles.input} !w-[95%] bg-gray-100`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              readOnly
              className={`${styles.input} bg-gray-100`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">Phone Number</label>
            <input
              type="number"
              readOnly
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%] bg-gray-100`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">
              Zip Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              placeholder="Enter your ZIP code"
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px] px-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">
              State/City <span className="text-red-500">*</span>
            </label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px] px-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!country}
            >
              <option value="">Select state/city</option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="House number, street name"
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 font-medium">
              Address Line 2 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              placeholder="Apartment, suite, unit, etc."
              className={`${styles.input}`}
            />
          </div>
        </div>
      </form>

      {user && user.addresses && user.addresses.length > 0 && (
        <>
          <div
            className="flex items-center mt-6 cursor-pointer text-blue-600 font-medium"
            onClick={() => setUserInfo(!userInfo)}
          >
            <span className="mr-2">{userInfo ? "▼" : "▶"}</span>
            <h5 className="text-[16px]">Use a saved address</h5>
          </div>

          {userInfo && (
            <div className="mt-3 border p-3 rounded-md">
              {user.addresses.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border-b last:border-b-0 mb-2 cursor-pointer ${
                    selectedAddress === item
                      ? "bg-blue-50 border border-blue-300"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleAddressSelect(item)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="savedAddress"
                      className="mr-3 h-4 w-4 accent-blue-500"
                      checked={selectedAddress === item}
                      onChange={() => handleAddressSelect(item)}
                    />
                    <div>
                      <h2 className="font-semibold text-[16px]">
                        {item.addressType}
                      </h2>
                      <p className="text-gray-600 text-[14px]">
                        {item.address1}, {item.address2}
                      </p>
                      <p className="text-gray-600 text-[14px]">
                        {
                          State.getStateByCodeAndCountry(
                            item.city,
                            item.country
                          )?.name
                        }
                        , {Country.getCountryByCode(item.country)?.name} -{" "}
                        {item.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPrice,
  isLoading,
  cart,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8 shadow-md">
      <h4 className="text-[18px] font-[600] text-gray-800 border-b pb-2 mb-4">
        Order Summary
      </h4>

      <div className="flex justify-between my-2">
        <p className="text-[16px] font-[400] text-gray-700">Subtotal:</p>
        <p className="text-[16px] font-[500]">₹{subTotalPrice.toFixed(2)}</p>
      </div>

      <div className="flex justify-between my-2">
        <p className="text-[16px] font-[400] text-gray-700">Shipping:</p>
        <p className="text-[16px] font-[500]">₹{shipping.toFixed(2)}</p>
      </div>

      {discountPrice > 0 && (
        <div className="flex justify-between my-2 text-green-600">
          <p className="text-[16px] font-[400]">Discount:</p>
          <p className="text-[16px] font-[500]">
            - ₹{discountPrice.toFixed(2)}
          </p>
        </div>
      )}

      <div className="border-t border-dashed mt-4 pt-4">
        <div className="flex justify-between">
          <p className="text-[18px] font-[600]">Total:</p>
          <p className="text-[20px] font-[700] text-blue-600">₹{totalPrice}</p>
        </div>
      </div>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex">
            <input
              type="text"
              className={`${styles.input} h-[45px] pl-3 flex-grow rounded-r-none`}
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              className={`h-[45px] px-4 rounded-r-[3px] bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Applying..." : "Apply"}
            </button>
          </div>
        </form>
      </div>

      {/* Order details preview */}
      <div className="mt-6 pt-4 border-t">
        <h5 className="text-[16px] font-[500] mb-2">
          Your Cart ({cart.length} items)
        </h5>
        <div className="max-h-[200px] overflow-y-auto pr-2">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center py-2 border-b">
              <div className="w-[60px] h-[60px]">
                <img
                  src={item.images[0]?.url || "/placeholder.png"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1 pl-3">
                <h4 className="text-[14px] font-[500]">{item.name}</h4>
                <div className="flex justify-between mt-1">
                  <span className="text-[12px] text-gray-500">
                    Qty: {item.qty}
                  </span>
                  <span className="text-[14px] font-[500]">
                    ${(item.discountPrice * item.qty).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
