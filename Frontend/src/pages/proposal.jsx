
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import $ from 'jquery'; 


import getProposalById from '../getProposalById';
import GetClub from '../getclub';
import Tg from "../components/toggle";


import { useAuth } from "../components/Auth";

async function runProposal() {
  await getContract();
  if(contractPublic != undefined) {
    var option_execution = $('#option_execution').val()
    var password = $('#passwordShowPVExecution').val();
    if(option_execution == '') {
      $('.errorExecution').css("display","block");
      $('.errorExecution').text("Option is required");
      return;
    }
    if(password == '') {
      $('.errorExecution').css("display","block");
      $('.errorExecution').text("Password is invalid");
      return;
    }
    var clubId = localStorage.getItem("clubId");
    var proposalId = localStorage.getItem("proposalId");
    try {
      const my_wallet = await web3.eth.accounts.wallet.load(password);
      // console.log( my_wallet.address)
    if(my_wallet !== undefined)
    {
      $('.errorExecution').css("display","none");
      $('.successExecution').css("display","block");
      $('.successExecution').text("Running...");
        try {
          if(option_execution == 'execute') {
            const query = contractPublic.methods.executeProposal(clubId,proposalId);
            const encodedABI = query.encodeABI();
            
            const signedTx = await this.web3.eth.accounts.signTransaction(
              {
                from: my_wallet[0].address,
        gasPrice: "20000000000",
        gas: "2000000",
        to: this.contractPublic.options.address,
        data: encodedABI,
                //value: amountAE
              },
              my_wallet[0].privateKey,
              false
            );
            var clubId = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          } else {
            if(option_execution == 'close') {
              const query = contractPublic.methods.closeProposal(clubId,proposalId);
              const encodedABI = query.encodeABI();
              
              const signedTx = await this.web3.eth.accounts.signTransaction(
                {
                  from: my_wallet[0].address,
                  gasPrice: "20000000000",
                  gas: "2000000",
                  to: this.contractPublic.options.address,
                  data: encodedABI,
                  //value: amountAE
                },
                my_wallet[0].privateKey,
                false
              );
              var clubId = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            }
          }
          
        } catch (error) {
          $('.successExecution').css("display","none");
          $('.errorExecution').css("display","block");
          $('.errorExecution').text("Error executing/closing the proposal");
          return;
        }
        
        $('#option_execution').val('');
        $('#passwordShowPVExecution').val('');
        $('.errorExecution').css("display","none");
        $('.successExecution').css("display","block");
        $('.successExecution').text("The execution was successful ");
        location.reload();
      } else {
        $('.valid-feedback').css('display','none');
          $('.invalid-feedback').css('display','block');
          $('.invalid-feedback').text('The password is invalid');
      }
    }
    catch {
      $('.valid-feedback').css('display','none');
          $('.invalid-feedback').css('display','block');
          $('.invalid-feedback').text('The password is invalid');
    }
    
    
  }
}










async function voteOnProposal() {
  await getContract();
  if(contractPublic != undefined) {
    var option_vote = $('#option_vote').val()
    var password = $('#passwordShowPVVote').val();
    if(option_vote == '') {
      $('#errorCreateProposal').css("display","block");
      $('#errorCreateProposal').text("Vote is required");
      return;
    }
    if(password == '') {
      $('#errorCreateProposal').css("display","block");
      $('#errorCreateProposal').text("Password is invalid");
      return;
    }
    var clubId = localStorage.getItem("clubId");
    var proposalId = localStorage.getItem("proposalId");
    const my_wallet = await web3.eth.accounts.wallet.load(password);
    if(my_wallet !== undefined)
    {
      $('.successVote').css("display","block");
      $('.successVote').text("Voting...");
      var optionBool = option_vote == '1' ? true : false;
      try {
        const query = contractPublic.methods.voteOnProposal(clubId,proposalId, optionBool);
        const encodedABI = query.encodeABI();


        const nonce = await web3.eth.getTransactionCount(my_wallet[0].address);
        if (web3 && web3.eth) {
          try {
            const signedTx = await web3.eth.accounts.signTransaction({
              from: my_wallet[0].address,
      gasPrice: "20000000000",
      gas: "2000000",
      to: this.contractPublic.options.address,
      data: encodedABI,
      nonce: nonce,
        // value: amountAE
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
        
      //   const signedTx = await this.web3.eth.accounts.signTransaction(
      //     {
      //       from: my_wallet[0].address,
      //   gasPrice: "20000000000",
      //   gas: "2000000",
      //   to: this.contractPublic.options.address,
      //   data: encodedABI,
      //       //value: amountAE
      //     },
      //     my_wallet[0].privateKey,
      //     false
      //   );
      //   var clubId = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      } catch (error) {
        console.log(error)
        $('.successVote').css("display","none");
        $('.errorVote').css("display","block");
        $('.errorVote').text("You already voted on this proposal");
        return;
      }
      
      $('#option_vote').val('');
      $('#passwordShowPVVote').val('');
      $('#errorVote').css("display","none");
      $('#successVote').css("display","block");
      $('#successVote').text("Your vote was successful ");
      location.reload();
    } else {
      $('.valid-feedback').css('display','none');
        $('.invalid-feedback').css('display','block');
        $('.invalid-feedback').text('The password is invalid');
    }
    
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

function Proposal() {

  const { logout } = useAuth();


    useEffect(() => {
        {
            GetClub();verifyUserInClub();getProposalById();
        }
      }, []);



  return (
    <div id="page-top">
        <>
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
        <div className="sidebar-brand-text mx-3">INTERNET COMPUTER Club</div>
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
        <Link  className=" nav-link" to="j/oinclub">
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
                        Club Balance (CYCLE)
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
                      <a
                        href="/createproposal"
                        className="btn btn-secondary btn-sm mt-2"
                      >
                        Create
                      </a>
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
                        Proposals{" "}
                      </div>
                      <a className="btn btn-secondary" href="/club">
                        See all proposals
                      </a>
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
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow mb-4">
                {/* Card Header - Dropdown */}
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Proposal
                  </h6>
                </div>
                {/* Card Body */}
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      Description:{" "}
                      <b>
                        <span className="proposal_description" />
                      </b>{" "}
                      <br />
                      Creator:{" "}
                      <b>
                        <span id="proposal_creator" />
                      </b>{" "}
                      <br />
                      Destination:{" "}
                      <b>
                        <span id="proposal_destination" />
                      </b>{" "}
                      <br />
                      Amount (in CYCLE):{" "}
                      <b>
                        <span id="proposal_amount" />
                      </b>{" "}
                      <br />
                    </div>
                  </div>
                  <div className="row my_votes">
                    <span className="loading_message">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Pie Chart */}
            <div className="col-xl-4 col-lg-5">
              <div
                className="card shadow mb-4 leave_club"
                style={{ display: "none" }}
              >
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Status: <span id="proposal_status" />
                  </h6>
                </div>
                <div className="card-body">
                  <p>
                    Votes for:{" "}
                    <b>
                      <span id="votes_for" />
                    </b>{" "}
                    <br />
                    Votes against:{" "}
                    <b>
                      <span id="votes_against" />
                    </b>{" "}
                    <br />
                  </p>
                  <p className="votes_available">
                    Option: <br />
                    <select id="option_vote" className="form-control">
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>{" "}
                    <br />
                    Enter your password: <br />
                    <input
                      type="password"
                      id="passwordShowPVVote"
                      className="form-control"
                    />{" "}
                    <br />
                    <a href="#" 
                     onClick={() => {
                        voteOnProposal();
                      }}id="btnVote" className="btn btn-success">
                      Confirm
                    </a>{" "}
                    <br />
                  </p>
                  <div
                    className="successVote valid-feedback"
                    style={{ display: "none" }}
                  />
                  <div
                    className="errorVote invalid-feedback"
                    style={{ display: "none" }}
                  />
                  <p />
                </div>
              </div>
              <div
                className="card shadow mb-4 creator_options"
                style={{ display: "none" }}
              >
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Options</h6>
                </div>
                <div className="card-body">
                  <p>
                    Select an option: <br />
                    <select id="option_execution" className="form-control">
                      <option value="execute">Execute proposal</option>
                      <option value="close">Close proposal</option>
                    </select>{" "}
                    <br />
                    Enter your password: <br />
                    <input
                      type="password"
                      id="passwordShowPVExecution"
                      className="form-control"
                    />{" "}
                    <br />
                    <a href="" id="btnExecution" onClick={() => {
                        runProposal();
                      }} className="btn btn-success">
                      Confirm
                    </a>{" "}
                    <br />
                  </p>
                  <div
                    className="successExecution valid-feedback"
                    style={{ display: "none" }}
                  />
                  <div
                    className="errorExecution invalid-feedback"
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
          <a className="btn btn-primary" onClick={logout} id="btnLogout">
            Logout
          </a>
        </div>
      </div>
    </div>
  </div>
</>

    </div>
  )
}

// getClub();
//             verifyUserInClub();
//             getProposalById();

export default Proposal