import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 mt-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Items Qty</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((item) => (
              <tr key={item._id} className="text-center border-b">
                <td className="p-2 border">{item._id}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 text-sm font-semibold rounded-md ${
                      item.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-2 border">{item.cart.length}</td>
                <td className="p-2 border">US$ {item.totalPrice}</td>
                <td className="p-2 border">
                  <Link
                    to={`/order/${item._id}`}
                    className="text-blue-500 hover:text-blue-700"
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
  );
};

export default AllOrders;
