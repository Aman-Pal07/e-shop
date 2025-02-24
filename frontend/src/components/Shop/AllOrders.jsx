import { Button, Chip, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 180, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Delivered" ? "success" : "warning"}
          sx={{ fontWeight: "bold" }}
        />
      ),
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button variant="contained" color="primary" size="small">
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Paper elevation={3} sx={{ padding: 3, margin: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            All Orders
          </Typography>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            sx={{
              "& .MuiDataGrid-root": {
                borderRadius: "8px",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
          />
        </Paper>
      )}
    </>
  );
};

export default AllOrders;
