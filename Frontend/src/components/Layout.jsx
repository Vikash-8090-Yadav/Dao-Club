import React from "react";
import { Outlet } from "react-router-dom";
import Base from "./base";
import { ToastContainer } from 'react-toastify';
const Layout = () => {
  return (
    <div className="bg-gray-900">
      <ToastContainer/>
      <Outlet />
    </div>
  );
};

export default Layout;