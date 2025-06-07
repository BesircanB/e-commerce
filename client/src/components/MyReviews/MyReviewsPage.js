import React from "react";
import Header from "../Header/Header";
import UserReviewList from "./UserReviewList";

const MyReviewsPage = () => {
  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Yorumlarım</h2>
        <UserReviewList />
      </div>
    </div>
  );
};

export default MyReviewsPage;
