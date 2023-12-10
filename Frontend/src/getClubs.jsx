import React from 'react'
import { marketplaceAddress } from './config';
import {Web3} from 'web3';
import $ from 'jquery'; 
import ABI from "./artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"


const web3 = new Web3(new Web3.providers.HttpProvider("https://celo-alfajores.infura.io/v3/b208399f926f487093f45debc86299bb"));

async function changeClub(clubId) {
  localStorage.setItem("clubId", clubId);
  window.location.href = "/club";
}

var contractPublic = null;


async function getContract(userAddress) {
  contractPublic = await new web3.eth.Contract(ABI.abi,marketplaceAddress);
  console.log(contractPublic)
  if(userAddress != null && userAddress != undefined) {
    contractPublic.defaultAccount = userAddress;
  }
}


async function GetClubs() {
  await getContract();
  if(contractPublic != undefined) {
    var clubs = await contractPublic.methods.listClubs().call()
    if(clubs.length > 0) {

      var list = document.querySelector('.available_clubs');
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        var theadTr = document.createElement('tr');
        var balanceHeader = document.createElement('th');
        balanceHeader.innerHTML = 'ID';
        theadTr.appendChild(balanceHeader);
        var contractNameHeader = document.createElement('th');
        contractNameHeader.innerHTML = 'Name';
        theadTr.appendChild(contractNameHeader);
        var contractTickerHeader = document.createElement('th');
        contractTickerHeader.innerHTML = 'Members';
        theadTr.appendChild(contractTickerHeader);
        
        var usdHeader = document.createElement('th');
        usdHeader.innerHTML = 'Proposals';
        theadTr.appendChild(usdHeader);

        thead.appendChild(theadTr)

        table.className = 'table';
        table.appendChild(thead);

      clubs.forEach((valor, clave) => {
        var tbodyTr = document.createElement('tr');
        var contractTd = document.createElement('td');
        contractTd.innerHTML = "<a class='btn btn-success' onclick='changeClub(" + valor.clubId + ")''>"+valor.clubId+"</a>";
        tbodyTr.appendChild(contractTd);
        var contractTickerTd = document.createElement('td');
        contractTickerTd.innerHTML = '<b>' + valor.name + '</b>';
        tbodyTr.appendChild(contractTickerTd);
        var balanceTd = document.createElement('td');
        balanceTd.innerHTML = '<b>' + valor.memberCount + '</b>';
        tbodyTr.appendChild(balanceTd);
        var balanceUSDTd = document.createElement('td');
        balanceUSDTd.innerHTML = '<b>' + valor.proposalCount+ '</b>';
        tbodyTr.appendChild(balanceUSDTd);
        tbody.appendChild(tbodyTr);
      });

      table.appendChild(tbody);

        list.appendChild(table);
    }
    $('.loading_message').css('display','none');
  }
}

export default GetClubs