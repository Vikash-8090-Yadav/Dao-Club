
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import $ from 'jquery'; 

import { marketplaceAddress } from "./config";
import {Web3} from 'web3';

import ABI from "./SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"


const web3 = new Web3(new Web3.providers.HttpProvider("https://api.calibration.node.glif.io/rpc/v1"));
var contractPublic = null;



async function getContract(userAddress) {
    contractPublic = await new web3.eth.Contract(ABI.abi,marketplaceAddress);
    console.log(contractPublic)
    if(userAddress != null && userAddress != undefined) {
      contractPublic.defaultAccount = userAddress;
    }
  }




async function getProposalById(){
  var filWalletAddress = localStorage.getItem("filWalletAddress");
  await getContract(filWalletAddress);
  if(contractPublic != undefined) {
    var aeWalletAddress = localStorage.getItem("filWalletAddress");
    var clubId = localStorage.getItem("clubId");
    var proposalId = localStorage.getItem("proposalId");
    var clubs = await contractPublic.methods.getProposalById(clubId, proposalId).call();
    if(clubs != undefined) {

      $('.proposal_description').text(clubs.description);
      $('#proposal_creator').text(clubs.creator);
      $('#proposal_destination').text(clubs.destination);
      // web3.utils.toWei(proposal_amount.toString(), 'ether');
      $('#proposal_amount').text(web3.utils.fromWei(clubs.amount.toString(), 'ether'));
      $('#proposal_status').text(clubs.status);
      $('#votes_for').text(clubs.votesFor);
      $('#votes_against').text(clubs.votesAgainst);
      
      if(clubs.status == 'Pending' && clubs.creator == aeWalletAddress) {
        $('.creator_options').css('display','block');
      }
      if(clubs.status != 'Pending') {
        $('.votes_available').css('display','none');
      }


    }
    $('.loading_message').css('display','none');
  }
}
export default getProposalById; 