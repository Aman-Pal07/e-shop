import React from "react";
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import CollectionComponent from "../components/Route/ProductCard/CollectionComponent";

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <BestDeals />
      <CollectionComponent />

      <Footer />
    </div>
  );
};

export default HomePage;
