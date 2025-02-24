import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { VscNewFile } from "react-icons/vsc"; // Importing for Create Event

const DashboardSidebar = ({ active }) => {
  const sidebarItems = [
    { path: "/dashboard", label: "Dashboard", icon: <RxDashboard />, id: 1 },
    {
      path: "/dashboard-orders",
      label: "All Orders",
      icon: <FiShoppingBag />,
      id: 2,
    },
    {
      path: "/dashboard-products",
      label: "All Products",
      icon: <FiPackage />,
      id: 3,
    },
    {
      path: "/dashboard-create-product",
      label: "Create Product",
      icon: <AiOutlineFolderAdd />,
      id: 4,
    },
    {
      path: "/dashboard-events",
      label: "All Events",
      icon: <MdOutlineLocalOffer />,
      id: 5,
    },
    {
      path: "/dashboard-create-event",
      label: "Create Event",
      icon: <VscNewFile />,
      id: 6,
    }, // New Create Event option
    {
      path: "/dashboard-withdraw-money",
      label: "Withdraw Money",
      icon: <CiMoneyBill />,
      id: 7,
    },
    {
      path: "/dashboard-messages",
      label: "Shop Inbox",
      icon: <BiMessageSquareDetail />,
      id: 8,
    },
    {
      path: "/dashboard-coupons",
      label: "Discount Codes",
      icon: <AiOutlineGift />,
      id: 9,
    },
    {
      path: "/dashboard-refunds",
      label: "Refunds",
      icon: <HiOutlineReceiptRefund />,
      id: 10,
    },
    { path: "/settings", label: "Settings", icon: <CiSettings />, id: 11 },
  ];

  return (
    <div className="w-[250px] h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {sidebarItems.map((item) => (
        <div key={item.id} className="w-full flex items-center p-4">
          <Link to={item.path} className="w-full flex items-center">
            <span
              className={`text-[25px] ${
                active === item.id ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              {item.icon}
            </span>
            <h5
              className={`pl-2 text-[16px] font-[400] ${
                active === item.id ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              {item.label}
            </h5>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DashboardSidebar;
