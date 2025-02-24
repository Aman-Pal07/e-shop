import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import Loader from "../Layout/Loader";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    await dispatch(deleteEvent(id));
    dispatch(getAllEventsShop(seller._id)); // Refresh event list after deletion
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 mt-5">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">All Events</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Sold</th>
              <th className="p-2 border">View</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((item) => (
              <tr key={item._id} className="text-center border-b">
                <td className="p-2 border">{item._id}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">US$ {item.discountPrice}</td>
                <td className="p-2 border">{item.stock}</td>
                <td className="p-2 border">{item?.sold_out || 0}</td>
                <td className="p-2 border">
                  <Link to={`/product/${item._id}`} className="text-blue-500">
                    <AiOutlineEye size={20} />
                  </Link>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEvents;
