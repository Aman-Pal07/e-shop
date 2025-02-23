import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CollectionGrid from "../ProductCard/CollectionGrid";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (allProducts) {
      const sortedData = [...allProducts].sort(
        (a, b) => b.sold_out - a.sold_out
      );
      const firstFive = sortedData.slice(0, 5);
      setData(firstFive);
    }
  }, [allProducts]);

  return (
    <div className=" ">
      <CollectionGrid />
    </div>
  ); // Pass the whole array instead of individual items
};

export default BestDeals;
