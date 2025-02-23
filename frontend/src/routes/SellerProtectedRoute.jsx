import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller, seller, error } = useSelector(
    (state) => state.seller
  );
  console.log("Seller State:", { isLoading, isSeller, seller, error });

  if (isLoading) return <Loader />; // Show loader while checking authentication
  if (!isSeller) return <Navigate to="/shop-login" replace />; // Redirect if not a seller

  return children; // Render the protected component
};

export default SellerProtectedRoute;
