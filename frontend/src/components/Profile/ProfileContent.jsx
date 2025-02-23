import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Link } from "react-router-dom";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    const formData = new FormData();
    formData.append("image", file);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then((response) => {
        dispatch(loadUser());
        toast.success("Avatar updated successfully!");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to update avatar");
      });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      {/* Profile Section */}
      {active === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={user?.avatar}
                className="w-[150px] h-[150px] rounded-full object-cover border-4 border-teal-500 shadow-md transition-transform duration-300 hover:scale-105"
                alt="Avatar"
              />
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center cursor-pointer absolute bottom-2 right-2 shadow-md hover:bg-teal-200 transition-colors duration-200">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image" className="cursor-pointer">
                  <AiOutlineCamera size={20} className="text-teal-600" />
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-[250px] bg-teal-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-teal-700 hover:scale-105 transition-all duration-200"
            >
              Update
            </button>
          </form>
        </div>
      )}

      {/* Orders */}
      {active === 2 && (
        <div className="animate-slideIn">
          <AllOrders />
        </div>
      )}

      {/* Refunds */}
      {active === 3 && (
        <div className="animate-slideIn">
          <AllRefundOrders />
        </div>
      )}

      {/* Track Order */}
      {active === 5 && (
        <div className="animate-slideIn">
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div className="animate-slideIn">
          <ChangePassword />
        </div>
      )}

      {/* Address */}
      {active === 7 && (
        <div className="animate-slideIn">
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "text-green-600"
          : "text-red-600",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button className="hover:text-teal-600 transition-colors duration-200">
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows =
    orders?.map((item) => ({
      id: item._id,
      itemsQty: item.cart.length,
      total: "₹" + item.totalPrice,
      status: item.status,
    })) || [];

  return (
    <div className="pt-1 pl-0 md:pl-8">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        className="rounded-lg shadow-md"
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const eligibleOrders =
    orders?.filter((item) => item.status === "Processing refund") || [];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "text-green-600"
          : "text-red-600",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button className="hover:text-teal-600 transition-colors duration-200">
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = eligibleOrders.map((item) => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "₹" + item.totalPrice,
    status: item.status,
  }));

  return (
    <div className="pt-1 pl-0 md:pl-8">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
        className="rounded-lg shadow-md"
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "text-green-600"
          : "text-red-600",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <Button className="hover:text-teal-600 transition-colors duration-200">
            <MdTrackChanges size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows =
    orders?.map((item) => ({
      id: item._id,
      itemsQty: item.cart.length,
      total: "₹" + item.totalPrice,
      status: item.status,
    })) || [];

  return (
    <div className="pt-1 pl-0 md:pl-8">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        className="rounded-lg shadow-md"
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.success);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Password update failed");
      });
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
        Change Password
      </h1>
      <form
        onSubmit={passwordChangeHandler}
        className="flex flex-col items-center space-y-6 animate-fadeIn"
      >
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Old Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-[250px] bg-teal-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-teal-700 hover:scale-105 transition-all duration-200"
        >
          Update
        </button>
      </form>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updatUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode("");
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center transition-opacity duration-300">
          <div className="w-[90%] sm:w-[60%] md:w-[40%] max-w-lg bg-white rounded-xl shadow-2xl relative p-6 overflow-y-auto max-h-[90vh] animate-slideIn">
            <div className="flex justify-end p-3">
              <RxCross1
                size={24}
                className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Add New Address
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                >
                  <option value="">Choose your country</option>
                  {Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                >
                  <option value="">Choose your city</option>
                  {State.getStatesOfCountry(country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 1
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 2
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                >
                  <option value="">Choose your address type</option>
                  {addressTypeData.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-teal-700 hover:scale-105 transition-all duration-200"
              >
                Add Address
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Addresses</h1>
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-teal-700 hover:scale-105 transition-all duration-200"
          onClick={() => setOpen(true)}
        >
          Add New
        </button>
      </div>

      {user && user.addresses.length > 0 ? (
        <div className="space-y-4 animate-fadeIn">
          {user.addresses.map((item, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-md shadow-md p-4 flex items-center justify-between transition-all duration-200 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-3" />
                <h5 className="text-sm font-semibold text-gray-800">
                  {item.addressType}
                </h5>
              </div>
              <div className="flex-1 ml-4">
                <h6 className="text-sm text-gray-600">
                  {item.address1} {item.address2},{" "}
                  {
                    State.getStateByCodeAndCountry(item.city, item.country)
                      ?.name
                  }
                  , {Country.getCountryByCode(item.country)?.name},{" "}
                  {item.zipCode}
                </h6>
                <h6 className="text-sm text-gray-600 mt-1">
                  {user.phoneNumber}
                </h6>
              </div>
              <button
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
                onClick={() => handleDelete(item)}
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <h5 className="text-center pt-8 text-lg text-gray-600 animate-fadeIn">
          You don’t have any saved addresses!
        </h5>
      )}
    </div>
  );
};

export default ProfileContent;
