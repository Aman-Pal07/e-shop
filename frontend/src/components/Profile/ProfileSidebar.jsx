import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const menuItems = [
    { id: 1, icon: <RxPerson size={20} />, title: "Profile" },
    { id: 2, icon: <HiOutlineShoppingBag size={20} />, title: "Orders" },
    { id: 3, icon: <HiOutlineReceiptRefund size={20} />, title: "Refunds" },
    {
      id: 4,
      icon: <AiOutlineMessage size={20} />,
      title: "Inbox",
      navigateTo: "/inbox",
    },
    { id: 5, icon: <MdOutlineTrackChanges size={20} />, title: "Track Order" },
    { id: 6, icon: <RiLockPasswordLine size={20} />, title: "Change Password" },
    { id: 7, icon: <TbAddressBook size={20} />, title: "Address" },
    {
      id: 8,
      icon: <AiOutlineLogin size={20} />,
      title: "Log out",
      action: logoutHandler,
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`flex items-center cursor-pointer w-full mb-4 py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 hover:bg-teal-50 ${
            active === item.id ? "bg-teal-50 text-teal-600" : "text-gray-700"
          }`}
          onClick={() => {
            if (item.navigateTo) {
              navigate(item.navigateTo);
              setActive(item.id);
            } else if (item.action) {
              item.action();
            } else {
              setActive(item.id);
            }
          }}
        >
          {React.cloneElement(item.icon, {
            className: `${
              active === item.id ? "text-teal-600" : "text-gray-600"
            }`,
          })}
          <span
            className={`pl-3 text-sm font-medium tracking-wide ${
              active === item.id ? "text-teal-600" : "text-gray-700"
            }`}
          >
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfileSidebar;
