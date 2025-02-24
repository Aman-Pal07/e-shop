import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 140 },
    { field: "price", headerName: "Price", width: 90 },
    { field: "stock", headerName: "Stock", type: "number", width: 80 },
    { field: "sold", headerName: "Sold", type: "number", width: 80 },
    {
      field: "preview",
      headerName: "View",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "delete",
      headerName: "Del",
      width: 70,
      sortable: false,
      renderCell: ({ id }) => (
        <Button onClick={() => handleDelete(id)}>
          <AiOutlineDelete size={16} className="text-red-600" />
        </Button>
      ),
    },
  ];

  const rows =
    products?.map((item) => ({
      id: item._id,
      name: item.name,
      price: `US$ ${item.discountPrice}`,
      stock: item.stock,
      sold: item?.sold_out || 0,
    })) || [];

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-[800px] mx-auto  bg-white shadow-md rounded-lg p-3">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        pagination
        autoHeight
        disableSelectionOnClick
        className="text-sm"
      />
    </div>
  );
};

export default AllProducts;
