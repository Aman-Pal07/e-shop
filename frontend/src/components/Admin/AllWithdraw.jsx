import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white p-4 rounded shadow">
        <h2 className="text-[22px] font-semibold pb-3">
          All Withdraw Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Withdraw ID</th>
                <th className="border p-2">Shop Name</th>
                <th className="border p-2">Shop ID</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Requested At</th>
                <th className="border p-2">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="border p-2">{item._id}</td>
                  <td className="border p-2">{item.seller.name}</td>
                  <td className="border p-2">{item.seller._id}</td>
                  <td className="border p-2">US$ {item.amount}</td>
                  <td className="border p-2">{item.status}</td>
                  <td className="border p-2">{item.createdAt.slice(0, 10)}</td>
                  <td className="border p-2 text-center">
                    {item.status === "Processing" && (
                      <BsPencil
                        size={20}
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          setOpen(true);
                          setWithdrawData(item);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[90%] md:w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-[25px] text-center font-semibold">
              Update Withdraw Status
            </h1>
            <br />
            <div className="flex flex-col items-center">
              <select
                onChange={(e) => setWithdrawStatus(e.target.value)}
                className="w-[200px] h-[35px] border rounded p-1"
              >
                <option value={withdrawStatus}>{withdrawData.status}</option>
                <option value="Succeed">Succeed</option>
              </select>
              <button
                className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
