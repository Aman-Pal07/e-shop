import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${server}/shop/delete-seller/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      dispatch(getAllSellers());
    } catch (error) {
      toast.error("Error deleting seller");
    }
  };

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-semibold pb-2">All Sellers</h3>
        <div className="w-full min-h-[45vh] bg-white rounded shadow-md overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Seller ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Joined At</th>
                <th className="px-4 py-2 border">Preview</th>
                <th className="px-4 py-2 border">Delete</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-2 border">{item._id}</td>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.email}</td>
                  <td className="px-4 py-2 border">{item.address}</td>
                  <td className="px-4 py-2 border">
                    {item.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <Link
                      to={`/shop/preview/${item._id}`}
                      className="text-blue-500 hover:underline flex items-center justify-center"
                    >
                      <AiOutlineEye size={20} className="mr-1" /> View
                    </Link>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => {
                        setUserId(item._id);
                        setOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sellers.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No sellers found</p>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-[95%] md:w-[40%] rounded shadow-lg p-6">
              <div className="flex justify-end">
                <button onClick={() => setOpen(false)}>
                  <RxCross1
                    size={25}
                    className="text-gray-600 hover:text-gray-800"
                  />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-center py-5">
                Are you sure you want to delete this seller?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    handleDelete(userId);
                    setOpen(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
