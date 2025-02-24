import React from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
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

  // Calculate metrics with safeguards for data issues
  const deliveredOrders = orders.filter((item) => item.status === "Delivered");

  // Ensure totalPrice is treated as a number for all calculations
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
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="text-gray-600 w-8 h-8" />
          <div className="ml-4">
            <h3 className="text-gray-600 text-lg font-medium">{title}</h3>
            {subtitle && (
              <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-800">{value}</span>
        {link && (
          <Link
            to={link}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            View Details →
          </Link>
        )}
      </div>
    </div>
  );

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <span className="font-medium text-gray-800">{params.value}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <div
          className={`py-1 px-3 rounded-full ${
            params.value === "Delivered"
              ? "bg-green-100 text-green-800"
              : params.value === "Processing"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value || "Pending"}
        </div>
      ),
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-medium">{params.value}</span>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span className="font-semibold">{params.value}</span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link
          to={`/dashboard/order/${params.row.id}`}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <AiOutlineArrowRight size={20} />
        </Link>
      ),
    },
  ];

  const rows = orders.map((item) => ({
    id: item._id.$oid || item._id, // Handle different ID formats
    itemsQty: Array.isArray(item.cart)
      ? item.cart.reduce((acc, cartItem) => acc + (cartItem.qty || 1), 0)
      : 0,
    total: `$${
      typeof item.totalPrice === "number"
        ? item.totalPrice.toFixed(2)
        : parseFloat(item.totalPrice).toFixed(2) || "0.00"
    }`,
    status: item.status || "Pending",
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
          <Link
            to="/dashboard-orders"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            View All Orders →
          </Link>
        </div>
        <div className="h-[500px] w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            disableSelectionOnClick
            autoHeight
            className="border-none"
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9fafb",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
