import React from "react";
import { Outlet, Link } from "react-router-dom";

import "../Layouts/MainLayout.css";
import NAVBAR from "../Components/nav.jsx";

const MainLayout = () => {
  

  return (
    <div>

      {/* STICKY NAVBAR */}
       
        <NAVBAR />
      

      {/* PAGE CONTENT */}
      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
