import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";

const AllEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/event/admin-all-events`, { withCredentials: true })
      .then((res) => {
        setEvents(res.data.events);
      });
  }, []);

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Events</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border">Product Id</th>
              <th className="px-4 py-2 text-left border">Name</th>
              <th className="px-4 py-2 text-left border">Price</th>
              <th className="px-4 py-2 text-left border">Stock</th>
              <th className="px-4 py-2 text-left border">Sold Out</th>
              <th className="px-4 py-2 text-left border">Preview</th>
            </tr>
          </thead>
          <tbody>
            {events.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="px-4 py-2 border">{item._id}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">US$ {item.discountPrice}</td>
                <td className="px-4 py-2 border">{item.stock}</td>
                <td className="px-4 py-2 border">{item.sold_out}</td>
                <td className="px-4 py-2 border">
                  <Link
                    to={`/product/${item._id}?isEvent=true`}
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <AiOutlineEye size={20} className="mr-1" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No events found</p>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
