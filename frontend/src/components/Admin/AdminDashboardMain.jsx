import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { getAllSellers } from "../../redux/actions/sellers";
import Loader from "../Layout/Loader";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);
  const adminBalance = adminEarning?.toFixed(2);

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          <h3 className="text-[22px] font-semibold pb-2">Overview</h3>
          <div className="w-full flex flex-wrap gap-4">
            {/* Total Earnings Card */}
            <div className="w-full sm:w-[30%] bg-white shadow-md rounded-lg p-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2 text-gray-600"
                />
                <h3 className="text-lg font-medium text-gray-600">
                  Total Earning
                </h3>
              </div>
              <h5 className="pt-2 text-2xl font-semibold pl-9">
                ${adminBalance}
              </h5>
            </div>

            {/* All Sellers Card */}
            <div className="w-full sm:w-[30%] bg-white shadow-md rounded-lg p-5">
              <div className="flex items-center">
                <MdBorderClear size={30} className="mr-2 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-600">
                  All Sellers
                </h3>
              </div>
              <h5 className="pt-2 text-2xl font-semibold pl-9">
                {sellers?.length}
              </h5>
              <Link to="/admin-sellers" className="text-blue-600 pt-2 block">
                View Sellers
              </Link>
            </div>

            {/* All Orders Card */}
            <div className="w-full sm:w-[30%] bg-white shadow-md rounded-lg p-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2 text-gray-600"
                />
                <h3 className="text-lg font-medium text-gray-600">
                  All Orders
                </h3>
              </div>
              <h5 className="pt-2 text-2xl font-semibold pl-9">
                {adminOrders?.length}
              </h5>
              <Link to="/admin-orders" className="text-blue-600 pt-2 block">
                View Orders
              </Link>
            </div>
          </div>

          <br />
          <h3 className="text-[22px] font-semibold pb-2">Latest Orders</h3>
          {/* Orders Table */}
          <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Items Qty</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders?.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">{order._id}</td>
                    <td
                      className={`p-3 ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="p-3">
                      {order?.cart?.reduce((acc, item) => acc + item.qty, 0)}
                    </td>
                    <td className="p-3">${order?.totalPrice}</td>
                    <td className="p-3">{order?.createdAt.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
