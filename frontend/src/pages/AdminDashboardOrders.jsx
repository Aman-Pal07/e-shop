import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "status", label: "Status" },
    { key: "itemsQty", label: "Items Qty" },
    { key: "total", label: "Total" },
    { key: "createdAt", label: "Order Date" },
    { key: "action", label: "Action" },
  ];

  const rows =
    adminOrders?.map((item) => ({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
      total: `${item?.totalPrice} $`,
      status: item?.status,
      createdAt: item?.createdAt.slice(0, 10),
    })) || [];

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={2} />
        </div>

        <div className="w-full min-h-[45vh] pt-5 flex justify-center">
          <div className="w-[97%] overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Admin Orders
            </h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="border border-gray-200 px-4 py-2 text-left text-gray-700 font-medium"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <tr key={row.id} className="border border-gray-200">
                      <td className="px-4 py-2">{row.id}</td>
                      <td
                        className={`px-4 py-2 font-medium ${
                          row.status === "Delivered"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.status}
                      </td>
                      <td className="px-4 py-2">{row.itemsQty}</td>
                      <td className="px-4 py-2">{row.total}</td>
                      <td className="px-4 py-2">{row.createdAt}</td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/dashboard/order/${row.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <AiOutlineArrowRight size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-4 text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
