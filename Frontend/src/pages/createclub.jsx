import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Tg from '../components/toggle';

import { marketplaceAddress } from "../config";
import {Web3} from 'web3';
import $ from 'jquery'; 
import ABI from "../SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"

const web3 = new Web3(new Web3.providers.HttpProvider("https://api.calibration.node.glif.io/rpc/v1"));


var contractPublic = null;


function CreateClub() {

  
  
 
  const [clubName, setClubName] = useState('');
  const [password, setPassword] = useState('');



  
  async function createClub() {
    async function getContract(userAddress) {
      contractPublic =  new web3.eth.Contract(ABI.abi,marketplaceAddress);
      console.log(contractPublic)
      if(userAddress != null && userAddress != undefined) {
        // alert("inside")
        contractPublic.defaultAccount = userAddress;
      }
    }

    var walletAddress = localStorage.getItem("filWalletAddress");
    alert(walletAddress)
    var password = $('#trx_password').val();
    await getContract(walletAddress);
    // alert("password showing sucessfull") //
    if(contractPublic != null) {
      var clubName = $('#club_name').val();
      // alert("clubName showing sucessfully") //
      if(clubName == '') {
        $('#errorCreateClub').css("display","block");
        $('#errorCreateClub').text("Club name is invalid");
        return;
      }
      if(password == '') {
        $('#errorCreateClub').css("display","block");
        $('#errorCreateClub').text("Password is invalid");
        return;
      }
      const my_wallet = await web3.eth.accounts.wallet.load(password);
      // alert(my_wallet)
      
      if(my_wallet !== undefined)
      {
        // alert("my_wallet is doing great")
        // alert(await web3.eth.gasPrice)
      try
      {
        
        $('.loading_message_creating').css("display","block");
        console.log("The contractPublic is ",contractPublic)
        const query = contractPublic.methods.createClub(clubName);
 
        const encodedABI = query.encodeABI();
        // alert(this.contractPublic.options.address)
       
        const signedTx = await web3.eth.accounts.signTransaction(
        {
          
          from: my_wallet[0].address,
          gasLimit: "210000000",
  maxFeePerGas: "3000000000",
  maxPriorityFeePerGas: "10000000",
          to: contractPublic.options.address,
          data: encodedABI,
         
         
        },
        my_wallet[0]["privateKey"],
        false,
      );
      
        var clubId = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        alert("SUCESS")
        $('#club_name').val('');
        $('#errorCreateClub').css("display","none");
        $('.loading_message_creating').css("display","none");
        $('#successCreateClub').css("display","block");
        $('#successCreateClub').text("Club created successfully with the name: " + clubName);
      } catch(e) {
        // alert("error")
        $('.valid-feedback').css('display','none');
          $('.invalid-feedback').css('display','block');
          $('.loading_message_creating').css("display","none");
          $('.invalid-feedback').text(e);
      }
      
      }
    } else {
      $('.valid-feedback').css('display','none');
            $('.invalid-feedback').css('display','block');
            $('.loading_message_creating').css("display","none");
            $('.invalid-feedback').text('The password is invalid');
      }
  }

  

  return (
    <div id="page-top">
          <div id="wrapper">
    {/* Sidebar */}
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="/"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink" />
        </div>
        <div className="sidebar-brand-text mx-3">INTERNET COMPUTER CLUB</div>
      </a>
      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <li className="nav-item active">
      <Link  className="nav-link" to="/">
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link  className="nav-link" to="/joinclub">
          <i className="fas fa-fw fa-file-image-o" />
          <span>Available clubs</span>
          </Link>
        
      </li>
      <li className="nav-item">
      <Link  className="nav-link" to="/createclub">
          <i className="fas fa-fw fa-file-image-o" />
          <span>Create club</span>
        </Link>
      </li>
      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block" />
      {/* Sidebar Toggler (Sidebar) */}
      <div className="text-center d-none d-md-inline">
        <button  onClick={Tg} className="rounded-circle border-0" id="sidebarToggle" />
      </div>
    </ul>
    {/* End of Sidebar */}
    {/* Content Wrapper */}
    <div id="content-wrapper" className="d-flex flex-column">
      {/* Main Content */}
      <div id="content">
        {/* Topbar */}
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          {/* Sidebar Toggle (Topbar) */}
          <button
            id="sidebarToggleTop"
            className="btn btn-link d-md-none rounded-circle mr-3"
            onClick={Tg}
          >
            <i className="fa fa-bars" />
          </button>
          {/* Topbar Navbar */}
          <ul className="navbar-nav ml-auto">
            {/* Nav Item - Search Dropdown (Visible Only XS) */}
            <li className="nav-item dropdown no-arrow d-sm-none">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="searchDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-search fa-fw" />
              </a>
              {/* Dropdown - Messages */}
              <div
                className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                aria-labelledby="searchDropdown"
              >
                <form className="form-inline mr-auto w-100 navbar-search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-light border-0 small"
                      placeholder="Search for..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        <i className="fas fa-search fa-sm" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            <div className="topbar-divider d-none d-sm-block" />
            {/* Nav Item - User Information */}
            <li className="nav-item dropdown no-arrow">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  className="img-profile rounded-circle"
                  src="img/undraw_profile.svg"
                />
              </a>
              {/* Dropdown - User Information */}
              <div
                className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown"
              >
                <div className="dropdown-divider" />
                <a
                  className="dropdown-item"
                  href="#"
                  data-toggle="modal"
                  data-target="#logoutModal"
                >
                  <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                  Logout and clear data from browser
                </a>
              </div>
            </li>
          </ul>
        </nav>
        {/* End of Topbar */}
        {/* Begin Page Content */}
        <div className="container-fluid">
          {/* Page Heading */}
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">
              Create a new investment club
            </h1>
          </div>
          {/* Content Row */}
          <div className="row">
            {/* Earnings (Monthly) Card Example */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Balance (CYCLE)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800 view_balance_address">
                        -
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        Dashboard
                      </div>
                      
                      <Link  className="btn btn-primary" to="/">
                        Go to Dashboard
                      </Link>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        Clubs{" "}
                      </div>
                      <Link  className="btn btn-secondary" to="/joinclub">
                        See available clubs
                      </Link>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Content Row */}
          <div className="row">
            {/* Area Chart */}
            <div className="col-xl-12 col-lg-9">
              <div className="card shadow mb-4">
                {/* Card Header - Dropdown */}
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Create your own investment club
                  </h6>
                </div>
                {/* Card Body */}
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      Club Name:{" "}
                      <input
                        type="text"
                        id="club_name"
                        className="form-control form-control-user"
                        placeholder="Give a name for this Investment Club"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                      />{" "}
                      <br />
                      Your password:{" "}
                      <input
                        type="password"
                        id="trx_password"
                        className="form-control form-control-user"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />{" "}
                      <br />
                      <br />
                      <br />
                      <input
                      onClick={() => {
                        createClub();
                      }}
                        type="button"
                        id="createClubButton"
                        defaultValue="Create"
                        className="btn btn-primary btn-block"
                      />
                      <span
                        className="loading_message_creating"
                        style={{ display: "none" }}
                      >
                        Creating the club...
                      </span>
                      <p
                        className="valid-feedback"
                        id="successCreateClub"
                        style={{ display: "none" }}
                      />
                      <p
                        className="invalid-feedback"
                        id="errorCreateClub"
                        style={{ display: "none" }}
                      >
                        Error
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Content Row */}
          <div className="row">
            <div className="col-lg-6 mb-4"></div>
          </div>
        </div>
        {/* /.container-fluid */}
      </div>
      {/* End of Main Content */}
      {/* Footer */}
      <footer className="sticky-footer bg-white"></footer>
      {/* End of Footer */}
    </div>
    {/* End of Content Wrapper */}
  </div>
  {/* End of Page Wrapper */}
  {/* Scroll to Top Button*/}
  <a className="scroll-to-top rounded" href="#page-top">
    <i className="fas fa-angle-up" />
  </a>
  {/* Logout Modal*/}
  <div
    className="modal fade"
    id="seeAccountModal"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Account
          </h5>
          <button
            className="close"
            type="button"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          Address: <br /> <div className="current_account" />
          <br />
          <span
            style={{ fontSize: "x-small" }}
            className="current_account_text"
          />
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  </div>
  {/* Logout Modal*/}
  <div
    className="modal fade"
    id="logoutModal"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Ready to Leave?
          </h5>
          <button
            className="close"
            type="button"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          Select "Logout" below if you are ready to end your current session in
          this browser.
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            type="button"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <a className="btn btn-primary" id="btnLogout">
            Logout
          </a>
        </div>
      </div>
    </div>
  </div>
    </div>
  )
}

export default CreateClub