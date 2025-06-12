import React from "react";
import { useCategories } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import Footer from "../components/Footer/Footer";
import ShopByCategorySection from "../components/ShopByCategorySection";
import BestSellersSection from "../components/BestSellersSection";

const HomePage = () => {
  const { categories } = useCategories();
  const navigate = useNavigate();

  return (
    <div>
      <main className="homepage-main">
        <Slider />
        <ShopByCategorySection categories={categories} onCategoryClick={id => navigate(`/category/${id}`)} />
        <BestSellersSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
