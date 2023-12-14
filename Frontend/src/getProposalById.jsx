
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import $ from 'jquery'; 

import { marketplaceAddress } from "./config";
import {Web3} from 'web3';

import ABI from "./SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"


const web3 = new Web3(new Web3.providers.HttpProvider("https://api.calibration.node.glif.io/rpc/v1"));
var contractPublic = null;

var pieceCID = null;
var carsize = null;

async function getContract(userAddress) {
    contractPublic = await new web3.eth.Contract(ABI.abi,marketplaceAddress);
    console.log(contractPublic)
    if(userAddress != null && userAddress != undefined) {
      contractPublic.defaultAccount = userAddress;
    }
  }





async function getProposalById(){


var clubId = localStorage.getItem("clubId");
    var proposalId = localStorage.getItem("proposalId");

  var filWalletAddress = localStorage.getItem("filWalletAddress");
  await getContract(filWalletAddress);
  if(contractPublic != undefined) {
    var aeWalletAddress = localStorage.getItem("filWalletAddress");
    
    var clubs = await contractPublic.methods.getProposalById(clubId, proposalId).call();
    if(clubs != undefined) {

      // console.log(clubs.Cid,clubs.PieceCid,clubs.carsize,clubs.posdiverification,clubs.storageProvider,clubs.DealId)

      localStorage.setItem("AddressbyId",clubs.destination);

      $('.proposal_description').text(clubs.description);
      $('#proposal_creator').text(clubs.creator);
      $('#proposal_destination').text(clubs.destination);
      // web3.utils.toWei(proposal_amount.toString(), 'ether');
      $('#proposal_amount').text(web3.utils.fromWei(clubs.amount.toString(), 'ether'));
      $('#proposal_status').text(clubs.status);
      $('#votes_for').text(clubs.votesFor);
      $('#votes_against').text(clubs.votesAgainst);
      $('#CID').text(clubs.Cid);
      $('#PieceCid').text(clubs.PieceCid);
      $('#DealId').text(clubs.DealId);
      $('#storageProvider').text(clubs.storageProvider);
      
      if(clubs.status == 'Pending' && clubs.creator == aeWalletAddress) {
        $('.creator_options').css('display','block');
      }
      if(clubs.status != 'Pending') {
        $('.votes_available').css('display','none');
      }

      $('#proposalExpireAt').text(new Date(Number(clubs.proposalExpireAt) * 1000).toLocaleString());
      $('#proposedAt').text(new Date(Number(clubs.proposedAt) * 1000).toLocaleString());
      


    }
    $('.loading_message').css('display','none');
  }
}
export default getProposalById; 