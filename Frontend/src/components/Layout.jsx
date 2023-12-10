import React from "react";
import { Outlet } from "react-router-dom";
import Base from "./base";

const Layout = () => {
  return (
    <div className="bg-gray-900">
      <Outlet />
    </div>
  );
};

export default Layout;