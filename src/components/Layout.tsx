
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container max-w-4xl pt-16 pb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
