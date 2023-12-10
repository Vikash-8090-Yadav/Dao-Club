import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState,useEffect } from "react";
import Layout from "./components/Layout";
import JoinClub from "./pages/joinclub";
import Base from "./components/base";
import CreateClub from "./pages/createclub";

import DotLoader from "react-spinners/HashLoader";
import CreateProposal from "./pages/createproposal";
import Club from "./pages/club";
import Proposal from "./pages/proposal";

// import "./components/Auth.css"
export const App = () => {
  const [loading , setLoading] = useState()  
  return (
    <div >  
  
      
        <Routes>
        <Route element={<Layout />}>
        <Route index element={<Base />} />
         
          <Route path="/joinclub" element={<JoinClub />} /> {/* Assuming JoinClub is the correct component */}
          <Route path="/createclub" element={<CreateClub />} />
          <Route path="/club" element={<Club />} />
          <Route path="/createproposal" element={<CreateProposal />} />
          <Route path="/Proposal" element={<Proposal />} />
          

          </Route>  
        </Routes>
      

    </div>
  );
};

