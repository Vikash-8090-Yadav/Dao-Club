import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { marketplaceAddress } from "../config";
import {Web3} from 'web3';
import $, { error } from 'jquery'; 
import { useNavigate } from 'react-router-dom';
import ABI from "../SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GetClub from "../getclub";

import GetProposals from "../getProposals";

import axios from 'axios';
import Tg from "../components/toggle";

const web3 = new Web3(new Web3.providers.HttpProvider("https://api.calibration.node.glif.io/rpc/v1"));
var contractPublic = null;

var hash = null;
async function getContract(userAddress) {
    contractPublic = await new web3.eth.Contract(ABI.abi,marketplaceAddress);
    console.log(contractPublic)
    if(userAddress != null && userAddress != undefined) {
      contractPublic.defaultAccount = userAddress;
    }
  }


var DealId = null;
var podsi1 = null;

async function getdealId(){
  
  var walletAddress = localStorage.getItem("filWalletAddress");
  await getContract(walletAddress);
  var clubs = await contractPublic.methods.getMyClubs().call()
  // console.log(clubs[0].CID)

    const clubId =  localStorage.getItem("clubId");

    

    

  const cid1 = clubs[0].CID;

  console.log(cid1)

  const response1 = await axios.get(`https://api.lighthouse.storage/api/lighthouse/get_proof?network=testnet&cid=${cid1}`)
  // const { pieceCID, dealInfo } = poDSI;

  console.log(response1.data);



  const dealInfo = response1.data.dealInfo;

  

  
  const pieceCID= response1.data.pieceCID;

  if (!pieceCID || !dealInfo || dealInfo.length === 0 || !dealInfo.every(deal => deal.dealId && deal.storageProvider)) {
    console.error('Verification Failed');
    toast.error("Minning is in process!")
    return;
}

  DealId= response1.data.dealInfo[0].dealId;

 

  console.log(DealId);
  const dealStatusLink = document.getElementById("dealStatusLink");
  const polygonScanlink = `https://calibration.filfox.info/en/deal/${DealId}`
  toast.success(<a target="_blank" href={polygonScanlink}>Success Click to check status</a>, {
    position: "top-right",
    autoClose: 18000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });

if (dealStatusLink) {
  
  
}

}

async function verify(){
  var chk = false;
  toast.info('Verification intiated ...', {
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
  await getContract(walletAddress);
  var clubs = await contractPublic.methods.getMyClubs().call()
  // console.log(clubs[0].CID)

    const clubId =  localStorage.getItem("clubId");

    

  const cid1 = clubs[0].CID;
  console.log(cid1);

  const response1 = await axios.get(`https://api.lighthouse.storage/api/lighthouse/get_proof?network=testnet&cid=${cid1}`)
    // const { pieceCID, dealInfo } = poDSI;

    console.log(response1.data);

  

    const dealInfo = response1.data.dealInfo;
    const pieceCID= response1.data.pieceCID;
    podsi1 = response1.data.pieceCID;

    if (!pieceCID || !dealInfo || dealInfo.length === 0 || !dealInfo.every(deal => deal.dealId && deal.storageProvider)) {
      console.error('Verification Failed');

    localStorage.setItem("clubverification",0);
    toast.error("MInning is in process");
    chk = true;
     
      return;
  }

    DealId= response1.data.dealInfo[0].dealId;

    console.log(pieceCID)
    console.log('Document Verified:', pieceCID);

    var password = $('#verifdocs').val();
    if(password ==''){
     toast.error("Password is wrong!")

    localStorage.setItem("clubverification",0);
      return;
    }
    const my_wallet = await web3.eth.accounts.wallet.load(password);

    const query = await contractPublic.methods.verifiydocs(clubId);
    const encodedABI = query.encodeABI();
    var hash = null;

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

        hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // console.log('Transaction Receipt:', clubId.transactionHash);

      } catch (error) {
        toast.error(error);

      localStorage.setItem("clubverification",0);
        console.error('Error sending signed transaction:', error);
        const ans = localStorage.getItem("clubverification")
        
        return;
      }
    } else {
      toast.error('web3 instance is not properly initialized.');

      localStorage.setItem("clubverification",0);
      console.error('web3 instance is not properly initialized.');
      const ans = localStorage.getItem("clubverification")
      
      return;
    }
    if(chk){
      const polygonScanlink = `https://calibration.filfox.info/en/tx/${hash.transactionHash}`
    toast.success(<a target="_blank" href={polygonScanlink}>Verification Completed, Click to view transaction</a>, {
      position: "top-right",
      autoClose: 18000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      }); 
      const ans = localStorage.getItem("clubverification")
      if(ans){
        $('.clubveri').css("display","none");
        $('.clwr').text('Verification Completed-'+podsi1);
      }else{
        
        $('.clubveri').css("display","block");
      }
      localStorage.setItem("clubverification","a");
      localStorage.setItem("podsi",podsi1);

    }
    else{

    }
    
     
   
    return true;
}





async function contributeClub() {
 
  toast.info('Contribution intiated ...', {
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
  $('.successContributeClub').css('display','none');
  $('.errorContributeClub').css('display','none');
  var clubId = localStorage.getItem("clubId");
  var amountAE = $('#aeAmount').val();
  // alert(amountAE)
  var password = $('#passwordShowPVContribute').val();
  if(amountAE == '' || amountAE <= 0) {
    $('.successContributeClub').css('display','none');
    $('.errorContributeClub').css("display","block");
    $('.errorContributeClub').text("Amount must be more than 0.");
    return;
  }
  if(password == '') {
    $('.successContributeClub').css('display','none');
    $('.errorContributeClub').css("display","block");
    $('.errorContributeClub').text("Password is invalid");
    return;
  }
  // var my_wallet = web3.eth.accounts.wallet.load(password)[0];
  const my_wallet = await web3.eth.accounts.wallet.load(password);
 
  
  if(my_wallet !== undefined)
  {
    if(clubId != null) {
      $('.successContributeClub').css("display","block");
      $('.successContributeClub').text("Contributing to the club...");
      
      if(contractPublic != undefined) {
        amountAE  = web3.utils.toWei(amountAE.toString(), 'ether');

        
        // alert(amountAE)
        //await contractPublic.$call('contributeToClub', [clubId])
        try {
          // alert("Yes");
          const query = contractPublic.methods.contributeToClub(clubId);
          const encodedABI = query.encodeABI();
          const accounts1 = web3.eth.accounts;
          //  alert("Yes");
          // console.log(accounts1)

          


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
                    value:amountAE,
                   
                   
                  },
                  my_wallet[0]["privateKey"],
                  false,
                );

                hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                const polygonScanlink = `https://calibration.filfox.info/en/tx/${hash.transactionHash}`
            toast.success(<a target="_blank" href={polygonScanlink}>Verification Completed, Click to view transaction</a>, {
              position: "top-right",
              autoClose: 18000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
                
                console.log('Transaction Receipt:', clubId);
              } catch (error) {

          toast.error(error);
                console.error('Error sending signed transaction:', error);
              }
            } else {

          toast.error(error);
              console.error('web3 instance is not properly initialized.');
            }
          // var clubId = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          console.log('Transaction Receipt:', clubId);
          
        } catch(e) {
          console.log(e);
          toast.error(e);
          $('.successContributeClub').css('display','none');
          $('.errorContributeClub').css("display","block");
          $('.errorContributeClub').text(e.toString());
          return;
        }
        
        
      }
    }
    $('.errorContributeClub').css('display','none');
    $('.successContributeClub').css("display","block");
    $('.successContributeClub').text("You have contributed to the club successfully");
  } else {
    $('.successContributeClub').css('display','none');
    $('.errorContributeClub').css("display","block");
    $('.errorContributeClub').text("Password is invalid");
    return;
  }
  

}

async function leaveClub() {
  $('.successJoinLeaveClub').css('display','none');
  $('.errorJoinLeaveClub').css('display','none');
  var clubId = localStorage.getItem("clubId");
  var password = $('#passwordShowPVLeave').val();
  if(password == '') {
    $('.successJoinLeaveClub').css('display','none');
    $('.errorJoinLeaveClub').css("display","block");
    $('.errorJoinLeaveClub').text("Password is invalid");
    return;
  }
  const my_wallet = await web3.eth.accounts.wallet.load(password);
  if(my_wallet !== undefined)
  {
    
    if(clubId != null) {
      $('.successJoinLeaveClub').css("display","block");
      $('.successJoinLeaveClub').text("Leaving the club...");
      await getContract();
      if(contractPublic != undefined) {
        
        const query = contractPublic.methods.leaveClub(clubId);
        const encodedABI = query.encodeABI();
        const signedTx = await web3.eth.accounts.signTransaction(
          {
            from: my_wallet[0].address,
            gasLimit: "21000000",
            maxFeePerGas: "300000000",
            maxPriorityFeePerGas: "100000000",
    to: contractPublic.options.address,
    data: encodedABI,
            //value: amountAE 
          },
          my_wallet[0].privateKey,
          false
        );
        var clubId = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        const polygonScanlink = `https://calibration.filfox.info/en/tx/${clubId.transactionHash}`
            toast.success(<a target="_blank" href={polygonScanlink}>Removed from Club, Click to view transaction</a>, {
              position: "top-right",
              autoClose: 18000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
        }
      }
    $('.errorJoinLeaveClub').css('display','none');
    $('.successJoinLeaveClub').css("display","block");
    $('.successJoinLeaveClub').text("You have left the club successfully");
  } else {
    $('.successJoinLeaveClub').css('display','none');
    $('.errorJoinLeaveClub').css("display","block");
    $('.errorJoinLeaveClub').text("Password is invalid");
    return;
  }
}



async function verifyUserInClub() {
  var clubId = localStorage.getItem("clubId");
  var filWalletAddress = localStorage.getItem("filWalletAddress");
  if(clubId != null) {
    await getContract();
    if(contractPublic != undefined) {
      var user = await contractPublic.methods.isMemberOfClub(filWalletAddress,clubId).call();
      if(user) {
        $('.join_club').css('display','none');
        $('.leave_club').css('display','block');
      } else {
        $('.join_club').css('display','block');
        $('.leave_club').css('display','none');
      }
    }
  }
}



function Club() {

  // getdealId();

  
  const [password, setPassword] = useState('');


  async function joinClub() {
    $('.successJoinLeaveClub').css('display','none');
    $('.errorJoinLeaveClub').css('display','none');
    var clubId = localStorage.getItem("clubId");
    var password = $('#passwordShowPVJoin').val();
    if(password == '') {
      $('.successJoinLeaveClub').css('display','none');
      $('.errorJoinLeaveClub').css("display","block");
      $('.errorJoinLeaveClub').text("Password is invalid");
      return;
    }
    const my_wallet = await web3.eth.accounts.wallet.load(password);
    
    if(my_wallet !== undefined)
    {
      if(clubId != null) {
        $('.successJoinLeaveClub').css("display","block");
          $('.successJoinLeaveClub').text("Joining the club...");
        await getContract();
        if(contractPublic != undefined) {
          
          const query = contractPublic.methods.joinClub(clubId);
          const encodedABI = query.encodeABI();
  
  
  
          const nonce = await web3.eth.getTransactionCount(my_wallet[0].address);
            if (web3 && web3.eth) {
              try {
                const signedTx = await web3.eth.accounts.signTransaction(
                  {
                    from: my_wallet[0].address,
                    gasLimit: "21000000",
                    maxFeePerGas: "300000000",
                    maxPriorityFeePerGas: "100000000",
            to: contractPublic.options.address,
            data: encodedABI,
                    //value: amountAE 
                  },
                  my_wallet[0].privateKey,
                  false
                );
        //
            
                const clubId = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                console.log('Transaction ReccreateProposaleipt:', clubId);
              } catch (error) {
                console.error('Error sending signed transaction:', error);
              }
            } else {
              console.error('web3 instance is not properly initialized.');
            }
  
            
  
  
  
          // const signedTx = await this.web3.eth.accounts.signTransaction(
          //   {
          //     from: my_wallet[0].address,
          //     gasPrice: "20000000000",
          //     gas: "2000000",
          //     to: this.contractPublic.options.address,
          //     data: encodedABI,
          //   },
          //   my_wallet[0].privateKey,
          //   false
          // );
          // var clubId = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          }
      }
      $('.errorJoinLeaveClub').css('display','none');
      $('.successJoinLeaveClub').css("display","block");
      $('.successJoinLeaveClub').text("You have joined the club successfully");
      window.location.reload()
    } else {
      $('.successJoinLeaveClub').css('display','none');
      $('.errorJoinLeaveClub').css("display","block");
      $('.errorJoinLeaveClub').text("Password is invalid");
    }
  }
  


    useEffect(() => {
        {
          const ans  = localStorage.getItem("clubverification")
          const pod = localStorage.getItem("podsi");
          if(ans == "a"){
            $('.clubveri').css("display","none");
            $('.clwr').text('Verification Completed-'+pod);
          }else{  
            $('.clubveri').css("display","block");
          }
            GetClub();verifyUserInClub();GetProposals();
        }
      }, []);


      const navigate = useNavigate();
  function Logout(){
    web3.eth.accounts.wallet.clear();
    localStorage.clear();
    navigate('/login');
  
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
          <div className="sidebar-brand-text mx-3">DAO CLUB</div>
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
                <span className="club_name" />
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
              <div className="col-xl-2 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Proposals
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800 club_proposals">
                          -
                        </div>
                        <Link  className="btn btn-secondary btn-sm mt-2" to="/createproposal">
                       
                          Create
                          </Link>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-calendar fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Members
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800 club_members">
                          -
                        </div>
                        {/* <a href="members.html" class="btn btn-primary btn-sm mt-2">View</a> */}
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-calendar fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                         VERIFY YOUR DOCUMENTS (PODSI)
                        </div>
                       

                        <div className="h5 mb-0  font-weight-bold text-gray-800 ">
                          
                        <input
                        type="password"
                        id="verifdocs"
                        className="form-control form-control-user"
                        placeholder="Password"
                      />{" "}
                        <div  className="btn btn-secondary btn-sm mt-2" onClick={verify}>
                       
                          DOCS VERIFICATION
                          </div>
                          </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                         VERIFY YOUR DOCUMENTS (PODSI)
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800 ">
                          
                        </div>
                        <div onClick={getdealId}>
                        
                        <div id="dealStatusLink" className="btn btn-secondary btn-sm mt-2">
    DAO DEAL STATUS
  </div>
                    
                          </div>
                          
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-calendar fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Content Row */}
            <div className="row">
              {/* Area Chart */}
              <div className="col-xl-8 col-lg-7">
                <div className="card shadow mb-4">
                  {/* Card Header - Dropdown */}
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Proposals
                    </h6>
                  </div>
                  {/* Card Body */}
                  <div className="card-body">
                    <div className="row available_proposals">
                      <span className="loading_message">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Pie Chart */}
              <div className="col-xl-4 col-lg-5">
                <div
                  className="card shadow mb-4 join_club"  style={{display: "none"}}
                  
                >
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Join the club
                    </h6>
                  </div>
                  <div className="card-body">
                    <p>
                      Enter your password: <br />
                      <input
                        type="password"
                        id="passwordShowPVJoin"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />{" "}
                      <br />
                      <div id="btnJoinClub" onClick={() => {
                        joinClub();
                      }} className="btn btn-success">
                        Confirm
                      </div>{" "}
                      <br />
                    </p>
                    <div
                      className="successJoinLeaveClub valid-feedback"
                      style={{ display: "none" }}
                    />
                    <div
                      className="errorJoinLeaveClub invalid-feedback"
                      style={{ display: "none" }}
                    />
                    <p />
                  </div>
                </div>
                <div
                  className="card shadow mb-4 leave_club"
                  style={{ display: "none" }}
                >
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Contribute to the club
                    </h6>
                  </div>
                  <div className="card-body">
                    <p>
                      Amount of calibration: <br />
                      <input
                        type="number"
                        id="aeAmount"
                        className="form-control"
                      />{" "}
                      <br />
                      Enter your password: <br />
                      <input
                        type="password"
                        id="passwordShowPVContribute"
                        className="form-control"
                      />{" "}
                      <br />
                      <a
                        href="#"
                        id="btnContributeClub"
                        onClick={() => {
                          contributeClub();
                        }}
                        className="btn btn-success"
                      >
                        Confirm
                      </a>{" "}
                      <br />
                    </p>
                    <div
                      className="successContributeClub valid-feedback"
                      style={{ display: "none" }}
                    />
                    <div
                      className="errorContributeClub invalid-feedback"
                      style={{ display: "none" }}
                    />
                    <p />
                  </div>
                </div>
                <div
                  className="card shadow mb-4 leave_club"
                  style={{ display: "none" }}
                >
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Leave the club
                    </h6>
                  </div>
                  <div className="card-body">
                    <p>
                      Enter your password: <br />
                      <input
                        type="password"
                        id="passwordShowPVLeave"
                        className="form-control"
                      />{" "}
                      <br />
                      <div  id="btnLeaveClub"  onClick={() => {
                        leaveClub();
                      }} className="btn btn-success">
                        Confirm
                      </div >{" "}
                      <br />
                    </p>
                    <div
                      className="successJoinLeaveClub valid-feedback"
                      style={{ display: "none" }}
                    />
                    <div
                      className="errorJoinLeaveClub invalid-feedback"
                      style={{ display: "none" }}
                    />
                    <p />
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

export default Club