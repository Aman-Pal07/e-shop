import React from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineArrowRight,
  AiOutlineMoneyCollect,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { MdInventory } from "react-icons/md";
import { useSelector } from "react-redux";

const DashboardHero = () => {
  const { orders = [] } = useSelector((state) => state.order);
  const { products = [] } = useSelector((state) => state.products);

  // Calculate metrics safely
  const deliveredOrders = orders.filter((item) => item.status === "Delivered");

  const totalEarningWithoutTax = deliveredOrders.reduce(
    (acc, item) =>
      acc +
      (typeof item.totalPrice === "number"
        ? item.totalPrice
        : parseFloat(item.totalPrice) || 0),
    0
  );

  const serviceCharge = totalEarningWithoutTax * 0.1;
  const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2);

  const StatCard = ({ icon: Icon, title, value, link, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center mb-4">
        <Icon className="text-gray-600 w-8 h-8" />
        <div className="ml-4">
          <h3 className="text-gray-700 text-lg font-medium">{title}</h3>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold text-gray-800">{value}</span>
        {link && (
          <Link
            to={link}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details →
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={AiOutlineMoneyCollect}
          title="Available Balance"
          subtitle="After 10% service charge"
          value={`$${availableBalance}`}
          link="/dashboard-withdraw-money"
        />
        <StatCard
          icon={AiOutlineShoppingCart}
          title="Total Orders"
          value={orders.length}
          link="/dashboard-orders"
        />
        <StatCard
          icon={MdInventory}
          title="Total Products"
          value={products.length}
          link="/dashboard-products"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
          <Link
            to="/dashboard-orders"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Orders →
          </Link>
        </div>

        {/* Tailwind Styled Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-700">
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Items</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 border">{item._id.$oid || item._id}</td>
                  <td className="p-3 border">
                    <span
                      className={`py-1 px-3 rounded-full text-sm font-medium ${
                        item.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {item.cart?.reduce(
                      (acc, cartItem) => acc + (cartItem.qty || 1),
                      0
                    ) || 0}
                  </td>
                  <td className="p-3 border font-semibold">
                    $
                    {typeof item.totalPrice === "number"
                      ? item.totalPrice.toFixed(2)
                      : parseFloat(item.totalPrice).toFixed(2) || "0.00"}
                  </td>
                  <td className="p-3 border">
                    <Link
                      to={`/dashboard/order/${item._id}`}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <AiOutlineArrowRight size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
