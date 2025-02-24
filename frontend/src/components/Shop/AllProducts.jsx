import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
    dispatch(getAllProductsShop(seller._id)); // Refresh product list after deletion
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-4">All Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Stock</th>
              <th className="border p-2 text-left">Sold</th>
              <th className="border p-2 text-center">View</th>
              <th className="border p-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border p-2">{item._id.slice(0, 6)}...</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">US$ {item.discountPrice}</td>
                <td className="border p-2">{item.stock}</td>
                <td className="border p-2">{item?.sold_out || 0}</td>
                <td className="border p-2 text-center">
                  <Link to={`/product/${item._id}`}>
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <AiOutlineEye size={20} />
                    </button>
                  </Link>
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1 text-red-600 hover:text-red-800"
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

export default AllProducts;
