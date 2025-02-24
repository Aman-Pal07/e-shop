import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");

  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(`${server}/shop/update-shop-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      dispatch(loadSeller());
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${server}/shop/update-seller-info`,
        { name, address, zipCode, phoneNumber, description },
        { withCredentials: true }
      );
      toast.success("Shop info updated successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Shop Settings</h2>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={avatar ? avatar : `${seller.avatar?.url}`}
            alt="Shop Avatar"
            className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-sm"
          />
          <label
            htmlFor="image"
            className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition"
          >
            <AiOutlineCamera size={20} />
          </label>
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImage}
          />
        </div>
      </div>

      {/* Shop Form */}
      <form onSubmit={updateHandler} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Shop Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter shop name"
            className={`${styles.input}`}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Shop Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter shop description"
            className={`${styles.input}`}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Shop Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter shop address"
            className={`${styles.input}`}
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            className={`${styles.input}`}
            required
          />
        </div>

        {/* Zip Code */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Zip Code
          </label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="Enter zip code"
            className={`${styles.input}`}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-medium"
        >
          Update Shop
        </button>
      </form>
    </div>
  );
};

export default ShopSettings;
