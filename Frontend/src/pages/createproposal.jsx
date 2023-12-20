import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tg from "../components/toggle";
import $ from 'jquery'; 
import { marketplaceAddress } from "../config";
import {Web3} from 'web3';
import ABI from "../SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import lighthouse from '@lighthouse-web3/sdk'
import axios from 'axios';
const web3 = new Web3(new Web3.providers.HttpProvider("https://api.calibration.node.glif.io/rpc/v1"));
const apiKey = "207e0c12.0ca654f5c03a4be18a3185ea63c31f81"
var contractPublic = null;
var cid = null;

async function getContract(userAddress) {
  contractPublic =  new web3.eth.Contract(ABI.abi,marketplaceAddress);
  console.log(contractPublic)
  if(userAddress != null && userAddress != undefined) {
    contractPublic.defaultAccount = userAddress;
  }
}


async function Registerjob(){

  const formData = new FormData();
  const requestReceivedTime = new Date()
  
  const endDate = requestReceivedTime.setMonth(requestReceivedTime.getMonth() + 1)
  const replicationTarget = 2
  const epochs = 4 // how many epochs before deal end should deal be renewed
  formData.append('cid', cid)
  formData.append('endDate', endDate)
  formData.append('replicationTarget', replicationTarget)
  formData.append('epochs', epochs)

  const response = await axios.post(
      `https://calibration.lighthouse.storage/api/register_job`,
      formData
  )
  console.log(response.data)
  toast.success('RAAS JOB Registered Sucessfully', {
    position: "top-right",
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });
}
function CreateProposal() {


  const [Password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  
  async function createProposal() {
    toast.info('Prposal Creation intiated ...', {
      position: "top-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
    var walletAddress = localStorage.getItem("filWalletAddress");
    // alert(walletAddress) /// /////
    await getContract(walletAddress);
    if(contractPublic != null) {
      var proposal_description = $('#proposal_description').val();
      var proposal_address = $('#proposal_address').val();
      var proposal_amount = $('#proposal_amount').val();
      var password = $('#trx_password').val();
      if(proposal_description == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Description is required");
        return;
      }
      if(proposal_address == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Destination address is required");
        return;
      }
      if(proposal_amount == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Amount is required");
        return;
      }
      if(password == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Password is invalid");
        return;
      }
      var clubId = localStorage.getItem("clubId");
      const my_wallet = await web3.eth.accounts.wallet.load(password);
      if(my_wallet !== undefined)
      {
        $('.loading_message_creating').css("display","block");
        proposal_amount = web3.utils.toWei(proposal_amount.toString(), 'ether');

        toast.success("Proposal Uploaded to LightHouse")
        const data = JSON.stringify({
          clubId,proposal_amount, proposal_address, proposal_description,description

        });
        const dealParams = {
          num_copies: 1,
          repair_threshold: 28800,
          renew_threshold: 240,
          miner: ["t017840"],
          network: 'calibration',
          add_mock_data: 2
        };

        const response = await lighthouse.uploadText(data, apiKey, proposal_description)

        console.log("The cid is ",response.data.Hash);

        cid = response.data.Hash;
        
        

        const query = contractPublic.methods.createProposal(clubId,proposal_amount, proposal_address, proposal_description,cid);
        const encodedABI = query.encodeABI();
        // const account1s = web3.eth.accounts;
            //  alert("Yes");
            // console.log(account1s)
            // const transactionObject = {
            //   from: my_wallet[0].address,
            //   gasPrice: '20000000000',
            //   gas: '2000000',
            //   to: this.contractPublic.options.address,
            //   data: encodedABI,
            //   // value: amountAE
            // };
            // var signedTx;
            // try {
            //    signedTx = await this.web3.eth.accounts.signTransaction(
            //     transactionObject,
            //     my_wallet[0].privateKey
            //   );
            //   console.log(signedTx);
            // } catch (error) {
            //   console.error(error);
            // }
            const nonce = await web3.eth.getTransactionCount(my_wallet[0].address);
            if (web3 && web3.eth) {
              try {
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
            
                const clubId = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                console.log('Transaction ReccreateProposaleipt:', clubId);
              } catch (error) {
                toast.error(error)
                
                console.error('Error sending signed transaction:', error);
              }
            } else {
              console.error('web3 instance is not properly initialized.');
            }
  
  
  
  
  
        
        // const signedTx = await this.account1s.signTransaction(
        //   {
        //     from: my_wallet[0].address,
        //   gasPrice: "20000000000",
        //   gas: "2000000",
        //   to: this.contractPublic.options.address,
        //   data: encodedABI,
        //     // value: amountAE
        //   },
        //   my_wallet[0].privateKey,
        //   false
        // );
        // // var clubId = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // if (web3 && web3.eth) {
        //   try {
        //     const clubId = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        //     console.log('Transaction Receipt:', clubId);
        //   } catch (error) {
        //     console.error('Error sending signed transaction:', error);
        //   }
        // } else {
        //   console.error('web3 instance is not properly initialized.');
        // }
        $('#proposal_description').val('');
        $('#proposal_address').val('');
        $('#proposal_amount').val('');

        $('#trx_password').val('');
        $('#errorCreateProposal').css("display","none");
        $('.loading_message_creating').css("display","none");
        $('#successCreateProposal').css("display","block");
        toast.success('Prposal Creation Sucessfull ...', {
          position: "top-right",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        $('#successCreateProposal').text("Proposal created successfully with description: " + proposal_description);
      } else {
        $('.valid-feedback').css('display','none');
        $('.loading_message_creating').css("display","none");
          $('.invalid-feedback').css('display','block');
          toast.error('The password is invalid')
          $('.invalid-feedback').text('The password is invalid');
      }
      
    }
   
  }

  const navigate = useNavigate();
  function Logout(){
    web3.eth.accounts.wallet.clear();
    localStorage.clear();
    navigate('/login');
  
  }
  


  return (
    <div id="page-top">
  {/* Page Wrapper */}
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
        <div className="sidebar-brand-text mx-3">DAO CLUB</div>
      </a>
      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <li className="nav-item active">
        <a className="nav-link" href="/">
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/joinclub">
          <i className="fas fa-fw fa-file-image-o" />
          <span>Available clubs</span>
        </a>
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
            <h1 className="h3 mb-0 text-gray-800">Create a new proposal</h1>
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
                        Club Balance (calibration)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800 club_balance">
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
                      <a className="btn btn-primary" href="/">
                        Go to Dashboard
                      </a>
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
                        Proposals{" "}
                      </div>
                      <Link  className="btn btn-secondary" to="/club">
                      
                        See all proposals
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
                    Create your own proposal
                  </h6>
                </div>
                {/* Card Body */}
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                    Title:{" "}
                      <input
                        type="text"
                        id="proposal_description"
                        className="form-control form-control-user"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give a description for this proposal"
                      />{" "}
                      <br />
                      Description:{" "}
                      <input
                        type="text"
                        id="proposal_description"
                        className="form-control form-control-user"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Give a description for this proposal"
                      />{" "}
                      <br />
                      Destination address:{" "}
                      <input
                        type="text"
                        id="proposal_address"
                        className="form-control form-control-user"
                        value={destination}
onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter the calibration destination address: 0x....."
                      />{" "}
                      <br />
                      Amount (in calibration):{" "}
                      <input
                        type="number"
                        id="proposal_amount"
                        className="form-control form-control-user"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter the amount"
                      />{" "}
                      <br />
                      Your password:{" "}
                      <input
                        type="text"
                        id="trx_password"
                        className="form-control form-control-user"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                      />{" "}
                      <br />
                      <br />
                      <br />
                      <input
                        type="button"
                        id="createProposalButton"
                        defaultValue="Create and Upload to LightHouse"
                        onClick={() => {
                          createProposal();
                        }}
                        className="btn btn-primary btn-block"
                      />
                      <span
                        className="loading_message_creating"
                        style={{ display: "none" }}
                      >
                        Creating the proposal...
                      </span>{" "}
                      <br />

                      
                      <p
                        className="valid-feedback"
                        id="successCreateProposal"
                        style={{ display: "none" }}
                      />
                      <p
                        className="invalid-feedback"
                        id="errorCreateProposal"
                        style={{ display: "none" }}
                      >
                        Error
                      </p>
            
                      <input
                        type="button"
                        id="createProposalButton"
                        defaultValue="Regsiter JOB(RAAS)"
                        onClick={() => {
                          Registerjob();
                        }}
                        className="btn btn-primary btn-block"
                      />
                      
                      <br />
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
          <div className="btn btn-primary" onClick={Logout} id="btnLogout">
            Logout
          </div>
        </div>
      </div>
    </div>
   
  </div>

  
  
        
 
</div>

  )
}

export default CreateProposal