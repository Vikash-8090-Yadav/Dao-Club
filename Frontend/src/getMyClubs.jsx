
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import club from "./pages/club";

window.changeClub = (clubId) => {
    localStorage.setItem('clubId', clubId);
    window.location.href = '/club';
  };


async function GetMyClubs() {
  var walletAddress = localStorage.getItem("filWalletAddress");
  await getContract(walletAddress);
  if(contractPublic != undefined) {
    var clubs = await contractPublic.methods.getMyClubs().call()
    if(clubs.length > 0) {

      var list = document.querySelector('.my_clubs');
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

        clubs.forEach((valor) => {
          if(valor.clubId != 0) {
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
          }
        
      });

      table.appendChild(tbody);

        list.appendChild(table);
    }
    $('.loading_message').css('display','none');
  }
}

  export default GetMyClubs;