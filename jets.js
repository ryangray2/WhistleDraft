var activeRoster = [];
var teamFA = [];
var offeredArr = [];
var signedArr = [];
var cutArr = [];
var taken = [];
var jetsDrafted = [];
var leftOff = [0, 0];
var assetsOffered = [];
var draftOver = false;
var twoNav = 0;
var darnoldNav = 0;

var yourTeam = mia;

var broadFA = [];

var tradedFor = [];
var tradedAway = [];

var draftSummary = [];
var leftOffShow = 0;
var showAmount = 0;

var sumCap = "";
var broad = false;
var currKind = "all";


function checkTradeAssets(trade) {
  console.log(returnPickIndex(1, true, yourTeam))
  console.log(trade + "\n");
  if (trade.receiveIndex.length > 0) {
    for (let i = 0; i < trade.receiveIndex.length; i++) {
      var pickNum = trade.receiveIndex[i];
      console.log(trade.team.name + " " + pickNum);
      if (draftOrder[pickNum[0]][pickNum[1]] === yourTeam) {
        return false;
      }
    }
  }
  if (trade.giveIndex.length > 0) {
    for (let i = 0; i < trade.giveIndex.length; i++) {
      var pickNum = trade.giveIndex[i];
      if (draftOrder[pickNum[0]][pickNum[1]] !== yourTeam) {
        return false;
      }
    }
  }
  if (trade.receivePlayer.length > 0) {
    for (let i = 0; i < trade.receivePlayer.length; i++) {
      if (activeRoster.includes(trade.receivePlayer[i])) {
        return false;
      }
    }
  }
  if (trade.givePlayer.length > 0) {
    for (let i = 0; i < trade.givePlayer.length; i++) {
      if (!activeRoster.includes(trade.givePlayer[i])) {
        return false;
      }
    }
  }
  return true;

}

function load() {
    var tempArr = [leftOff[0], leftOff[1]];
    loadPicks(tempArr);
    rerank();
    for (let i = 0; i < draftPlayers.length; i++) {
      draftPlayers[i].rank = i + 1;
    }
    var place = 0;
    for (let i = 0; i < draftOrder.length; i++) {
      for (let j = 0; j < draftOrder[i].length; j++) {
        place += 1;
        if (draftOrder[i][j].name === yourTeam.name) {
          console.log('#' + place);
        }
      }
    }

    for (let i = 0; i < allFA.length; i++) {
      if (allFA[i].cTotal > 0) {
         broadFA.push(allFA[i]);
      }
    }

    var tempArray = [yourTeam, pit, chi, sf, no, atl, det, car, den, was];
    for (let i = 0; i < tempArray.length; i++) {
      var count = 0;
      // console.log(tempArray[i].name);
      for (let j = 0; j < draftOrder.length; j++) {
        for (let k = 0; k < draftOrder[j].length; k++) {
          count += 1;
          if (tempArray[i].name === draftOrder[j][k].name) {
            // console.log("[" + j + ", " + k + "] #" + count);
          }
        }
      }
    }

  // console.log("players: " + draftPlayers.length);
  // console.log(draftOrder);
  divideRoster();
  // console.log(getCapRoom());
  updateCapBar();
  // console.log(broadFA.length);

  var posList = [];
  for (i = 0; i < currRosterArr.length; i++) {
    if (!posList.includes(currRosterArr[i].pos)) {
      posList.push(currRosterArr[i].pos);
    }
  }
  for (i = 0; i < broadFA.length; i++) {
    if (!posList.includes(broadFA[i].pos)) {
      posList.push(broadFA[i].pos);
    }
  }
  // console.log(posList);
}

function rerank() {
  for (let i = 0; i < draftPlayers.length; i++) {
    draftPlayers[i].rank = i + 1;
    if (draftPlayers[i].pos === "QB") {
      console.log(draftPlayers[i].name + ": " + draftPlayers[i].rank)
    }
  }
}

function loadPicks(start) {
  console.log(start);
  for (let m = 0; m < teams.length; m++) {
    teams[m].picks = [];
  }
  yourTeam.picks = [];
  // var jay = start[1];
  // if (start[1] > 0) {
  //   jay -= 1;
  // }
  if (start[1] > 0) {
      start[1] = start[1] - 1;
  }
  var startstart = start[0];
  for (let i = start[0]; i < draftOrder.length; i++) {
    if (i > startstart) {
      start[1] = 0;
    }
    for (let j = start[1]; j < draftOrder[i].length; j++) {
      var temp = [i, j];
      // console.log(draftOrder[i][j].name + " " + i + ", " + j);
      draftOrder[i][j].picks.push(temp);
    }
  }
}

function startPressed() {
  document.getElementById("startCont").style.display = "none";

  document.getElementById("instCont").style.display = "block";
  generateTeamSelect();
}

function generateTeamSelect() {
  var root = document.getElementById("teamSelectCont");
  var logoRow = document.createElement("div");
  logoRow.classList.add("row");
  teams.sort(function(a, b) {
    var textA = a.city.toUpperCase();
    var textB = b.city.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});
  for (let i = 0; i < teams.length; i++) {
    var logoDiv = document.createElement("div");
    logoDiv.classList.add("col-6", "col-md-3");
    var logo = document.createElement("img");
    logo.classList.add("selectLogo");
    logo.setAttribute("src", teams[i].logo);
    logo.addEventListener('click', function() {
      yourTeam = teams[i];
      document.getElementById("yourTeamLogo").setAttribute("src", yourTeam.logo);
        document.getElementById("restartButt").style.backgroundColor = yourTeam.color;
          document.getElementById("restartButt").style.border = "white 5px solid";
        document.getElementById("summaryLogo").setAttribute("src", yourTeam.logo);
      document.getElementById("yourPicks").style.backgroundColor = yourTeam.color;
      // document.getElementById("yourPicks").innerHTML = yourTeam.name.toUpperCase() + " PICKS";
        document.getElementById("yourPicks").innerHTML = "YOUR PICKS";
        document.getElementById("summary").style.backgroundColor = yourTeam.color;
      instPressed();
    });

    logoDiv.appendChild(logo);
    logoRow.appendChild(logoDiv);
  }
  root.appendChild(logoRow);
}

function instPressed() {
  document.getElementById("instCont").style.display = "none";
    document.getElementById("trans2").style.display = "block";

    yesTwo();
  generateRoster();
  generateTeamFA();
  // skipTrade();
  doneFA();
}



function yesWatson() {
  document.getElementById("tradePrompt").style.display = "none";

  document.getElementById("watsonTradeAssets").style.display = "block";
  generateWatsonAssets();
}

function yesWilson() {
  document.getElementById("tradePrompt").style.display = "none";

  document.getElementById("wilsonTradeAssets").style.display = "block";
  generateWilsonAssets();
}

function yesDarnold() {
  document.getElementById("tradePrompt").style.display = "none";
  document.getElementById("darnoldTradeOffers").style.display = "block";
  generateDarnoldOffers(darnoldNav);
}

function yesTwo() {
  document.getElementById("tradePrompt").style.display = "none";
    document.getElementById("moreTradesCont").style.display = "none";
  document.getElementById("twoTradeOffers").style.display = "block";
  document.getElementById("tradeMenu").style.display = "block";
  var tempArr = [];
  for (let i = 0; i < twoTradeArr.length; i++) {
    if (checkTradeAssets(twoTradeArr[i])) {
      tempArr.push(twoTradeArr[i]);
    } else {
      continue;
    }
  }
  twoTradeArr = tempArr;
  twoNav = 0;
  generateTwoOffers(twoNav);
}

function noWatson() {
  document.getElementById("tradePrompt").style.display = "none";
  document.getElementById("faCont").style.display = "block";
  generateRoster();
  generateTeamFA();
}

function generateDarnoldOffers(num) {
  var root = document.getElementById("darnoldOffers");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  var buttonRow = document.createElement("div");
  buttonRow.classList.add("row", "text-center");
  var r1 = document.createElement("div");
  r1.classList.add("col-0", "col-md-3");
  var rbutcol = document.createElement("div");
  rbutcol.classList.add("col-6","col-md-3");
  var lbutcol = document.createElement("div");
  lbutcol.classList.add("col-6", "col-md-3");
  var r2 = document.createElement("div");
  r2.classList.add("col-0", "col-md-3");

  if (num != darnoldTradeArr.length - 1) {

    var rightButton = document.createElement("button");
    rightButton.setAttribute("onclick", "darnoldRight()");
    rightButton.classList.add('bttn-md', 'butt', 'tradeButts');
    rightButton.innerHTML = "NEXT";
    rightButton.style.paddingRight = "5px";
    rightButton.style.paddingLeft = "5px";

    rbutcol.appendChild(rightButton);

  }
  if (num != 0) {

    var leftButton = document.createElement("button");
    leftButton.setAttribute("onclick", "darnoldLeft()");
    leftButton.classList.add('bttn-md', 'butt', 'tradeButts');
    leftButton.innerHTML = "PREVIOUS";
    leftButton.style.paddingRight = "5px";
    leftButton.style.paddingLeft = "5px";

    lbutcol.appendChild(leftButton);

  }
  buttonRow.appendChild(r1);
    buttonRow.appendChild(lbutcol);
  buttonRow.appendChild(rbutcol);
    buttonRow.appendChild(r2);

  root.appendChild(buttonRow);
  var row = document.createElement("div");
  row.classList.add("row", "text-center");

  var col1 = document.createElement("div");
  col1.classList.add("col-6");

  var col2 = document.createElement("div");
  col2.classList.add("col-6");

  var img = document.createElement("img");
  img.setAttribute("src", yourTeam.logo);
  img.classList.add("tradeLogo");

  var img2 = document.createElement("img");
  img2.setAttribute("src", darnoldTradeArr[num].team.logo);
  // console.log(darnoldTradeArr[num].team.logo)
  img2.classList.add("tradeLogo");

  col1.appendChild(img);
  col2.appendChild(img2);

  for (let k = 0; k < darnoldTradeArr[num].receiveText.length; k++) {
    var p = document.createElement("p");
    p.innerHTML = darnoldTradeArr[num].receiveText[k];
    col1.appendChild(p);
  }
  for (let j = 0; j < darnoldTradeArr[num].giveText.length; j++) {
    var p = document.createElement("p");
    p.innerHTML = darnoldTradeArr[num].giveText[j];
    col2.appendChild(p);
  }
  row.appendChild(col1);
  row.appendChild(col2);
  root.appendChild(row);


}

function darnoldRight() {
  darnoldNav++;
  // console.log(darnoldNav);
  generateDarnoldOffers(darnoldNav);
}

function darnoldLeft() {
  darnoldNav--;
  generateDarnoldOffers(darnoldNav);
}

function generateTwoOffers(num) {
  var root = document.getElementById("twoOffers");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  var buttonRow = document.createElement("div");
  buttonRow.classList.add("row", "text-center");
  var r1 = document.createElement("div");
  r1.classList.add("col-0", "col-md-3");
  var rbutcol = document.createElement("div");
  rbutcol.classList.add("col-6","col-md-3");
  var lbutcol = document.createElement("div");
  lbutcol.classList.add("col-6", "col-md-3");
  var r2 = document.createElement("div");
  r2.classList.add("col-0", "col-md-3");

  if (num != twoTradeArr.length - 1) {

    var rightButton = document.createElement("button");
    rightButton.setAttribute("onclick", "twoRight()");
    rightButton.classList.add('bttn-md', 'butt', 'tradeButts');
    rightButton.style.marginTop = "10px";
    rightButton.innerHTML = "NEXT";

    rbutcol.appendChild(rightButton);

  }
  if (num != 0) {

    var leftButton = document.createElement("button");
    leftButton.setAttribute("onclick", "twoLeft()");
    leftButton.innerHTML = "PREVIOUS";
    leftButton.style.marginTop = "10px";
    leftButton.classList.add( 'bttn-md', 'butt', 'tradeButts');

    lbutcol.appendChild(leftButton);

  }
    buttonRow.appendChild(r1);
    buttonRow.appendChild(lbutcol);
  buttonRow.appendChild(rbutcol);
    buttonRow.appendChild(r2);

      root.appendChild(buttonRow);

  var row = document.createElement("div");
  row.classList.add("row", "text-center");
  row.style.marginTop = "10px";

  var col1 = document.createElement("div");
  col1.classList.add("col-5", "tradecont");

  var dumcol = document.createElement("div");
  dumcol.classList.add("col-2");

  var col2 = document.createElement("div");
  col2.classList.add("col-5", "tradecont");

  var img = document.createElement("img");
  img.setAttribute("src", yourTeam.logo);
  img.classList.add("tradeLogo");

  var img2 = document.createElement("img");
  img2.setAttribute("src", twoTradeArr[num].team.logo);
  // console.log(twoTradeArr[num].team.logo)
  img2.classList.add("tradeLogo");

  col1.appendChild(img);
  col2.appendChild(img2);

  for (let k = 0; k < twoTradeArr[num].receiveText.length; k++) {
    var p = document.createElement("p");
    p.innerHTML = twoTradeArr[num].receiveText[k];
    p.classList.add("tradeP");
    col1.appendChild(p);
  }
  for (let j = 0; j < twoTradeArr[num].giveText.length; j++) {
    var p = document.createElement("p");
    p.innerHTML = twoTradeArr[num].giveText[j];
    p.classList.add("tradeP");
    col2.appendChild(p);
  }
  row.appendChild(col1);
    row.appendChild(dumcol);
  row.appendChild(col2);

  var row2 = document.createElement("div");
  row2.classList.add("row", "text-center");
  row2.style.marginTop = "10px";

  var col12 = document.createElement("div");
  col12.classList.add("col-12");

  var p = document.createElement("p");
  p.fontSize = "20px !important";

  if (getCapRamis() < 0) {
    p.innerHTML = "Cap Space Change: " + addCommas(getCapRamis());
    p.style.color ="#ffa2a2";
  } else {
    p.innerHTML = "Cap Space Change: +" + addCommas(getCapRamis());
  }


  col12.appendChild(p);
  row2.appendChild(col12);

  root.appendChild(row);
  root.appendChild(row2);



}

function twoRight() {
  twoNav++;
  generateTwoOffers(twoNav);
  console.log(getCapRamis());
}

function twoLeft() {
  twoNav--;
  generateTwoOffers(twoNav);
}

function skipTrade() {
  // document.getElementById("watsonResult").style.display = "none";
    document.getElementById("trans3").style.display = "block";
  document.getElementById("faCont").style.display = "block";
  // document.getElementById("tradePrompt").style.display = "none";
      document.getElementById("watsonTrade").style.display = "none";
          document.getElementById("wilsonTrade").style.display = "none";
            document.getElementById("twoTrade").style.display = "none";
                  // document.getElementById("darnoldTrade").style.display = "none";

  generateRoster();
  generateTeamFA();
  updateCapBar() // fix
  generateRoster();
}

function finishTrade(type) {
  if (type === "watson") {
    //// Trade rejected
    if (!checkTradeValue()) {
      document.getElementById("tradePrompt").style.display = "block";
      document.getElementById("watsonResult").style.display = "none";
    }
    //// traded 2 and Darnold successfully for Watson
    else if (assetsOffered.includes(SamDarnold)) {
      skipTrade();
    }
    //// Trade 2 successfully for Watson
    else {
      document.getElementById("tradePrompt").style.display = "block";
      document.getElementById("watsonTrade").style.display = "none";
      document.getElementById("wilsonTrade").style.display = "none";
      document.getElementById("twoTrade").style.display = "none";
      document.getElementById("watsonResult").style.display = "none";
    }
    generateRoster();
    generateTeamFA();
    updateCapBar() // fix
    generateRoster();
  }
  else if (type === "darnold") {
    for (var i = 0; i < darnoldTradeArr[darnoldNav].giveIndex.length; i++) {
      draftOrder[darnoldTradeArr[darnoldNav].giveIndex[i][0]][darnoldTradeArr[darnoldNav].giveIndex[i][1]] = darnoldTradeArr[darnoldNav].team;
    }
    for (var i = 0; i < darnoldTradeArr[darnoldNav].receiveIndex.length; i++) {
      draftOrder[darnoldTradeArr[darnoldNav].receiveIndex[i][0]][darnoldTradeArr[darnoldNav].receiveIndex[i][1]] = yourTeam;

    }
    for (var i = 0; i < darnoldTradeArr[darnoldNav].receiveText.length; i++) {
      tradedFor.push(darnoldTradeArr[darnoldNav].receiveText[i]);
    }
    for (var i = 0; i < darnoldTradeArr[darnoldNav].giveText.length; i++) {
      tradedAway.push(darnoldTradeArr[darnoldNav].giveText[i]);
    }
    for (var i = 0; i < darnoldTradeArr[darnoldNav].newWatsonAssets.length; i++) {
      watsonTradeAssets.push(darnoldTradeArr[darnoldNav].newWatsonAssets[i]);
    }
    const index =  watsonTradeAssets.indexOf(SamDarnold);
    watsonTradeAssets.splice(index, 1);

    const index2 =  activeRoster.indexOf(SamDarnold);
    activeRoster.splice(index2, 1);
    document.getElementById("tradePrompt").style.display = "block";
    document.getElementById("darnoldTrade").style.display = "none";
    document.getElementById("darnoldTradeOffers").style.display = "none";
  }
  else if (type === "two") {
    for (var i = 0; i < twoTradeArr[twoNav].giveIndex.length; i++) {
      draftOrder[twoTradeArr[twoNav].giveIndex[i][0]][twoTradeArr[twoNav].giveIndex[i][1]] = twoTradeArr[twoNav].team;

    }
    for (var i = 0; i < twoTradeArr[twoNav].receiveIndex.length; i++) {
      draftOrder[twoTradeArr[twoNav].receiveIndex[i][0]][twoTradeArr[twoNav].receiveIndex[i][1]] = yourTeam;

    }
    for (var i = 0; i < twoTradeArr[twoNav].receiveText.length; i++) {
      tradedFor.push(twoTradeArr[twoNav].receiveText[i]);
    }
    for (var i = 0; i < twoTradeArr[twoNav].giveText.length; i++) {
      tradedAway.push(twoTradeArr[twoNav].giveText[i]);
    }
    for (var i = 0; i < twoTradeArr[twoNav].givePlayer.length; i++) {
      const index2 =  activeRoster.indexOf(twoTradeArr[twoNav].givePlayer[i]);
      activeRoster.splice(index2, 1);
    }
    for (var i = 0; i < twoTradeArr[twoNav].receivePlayer.length; i++) {
      activeRoster.push(twoTradeArr[twoNav].receivePlayer[i]);
    }
    if (twoTradeArr[twoNav].givePlayer.includes(ZachWilson)) {
      deadCap += 17193099;
    }
    if (twoTradeArr[twoNav].givePlayer.includes(QuinnenWilliams)) {
      deadCap += 5419431;
    }
    if (twoTradeArr[twoNav].givePlayer.includes(CoreyDavis)) {
      deadCap += 1333334;
    }
    if (twoTradeArr[twoNav].givePlayer.includes(GeorgeFant)) {
      deadCap += 1000000;
    }
    if (twoTradeArr[twoNav].givePlayer.includes(MekhiBecton)) {
      deadCap += 5487654;
    }
    if (twoTradeArr[twoNav].givePlayer.includes(DenzelMims)) {
      deadCap += 755892;
    }

    document.getElementById("moreTradesCont").style.display = "block";
    document.getElementById("watsonTrade").style.display = "none";
        document.getElementById("wilsonTrade").style.display = "none";
          document.getElementById("twoTrade").style.display = "none";
            document.getElementById("tradeMenu").style.display = "none";


    // skipTrade();




    // document.getElementById("tradePrompt").style.display = "block";
    // document.getElementById("twoTrade").style.display = "none";
    // document.getElementById("watsonTrade").style.display = "none";
    // document.getElementById("wilsonTrade").style.display = "none";
    // document.getElementById("twoTradeOffers").style.display = "none";
  }
}

function getCapRamis() {
  var tempCapRoom = getCapRoom();
  var tempUpdateCapRoom = getCapRoom();
  for (var i = 0; i < twoTradeArr[twoNav].receivePlayer.length; i++) {
    tempUpdateCapRoom -= twoTradeArr[twoNav].receivePlayer[i].salary;
  }
  for (var i = 0; i < twoTradeArr[twoNav].givePlayer.length; i++) {
    tempUpdateCapRoom += twoTradeArr[twoNav].givePlayer[i].salary;
  }
  if (twoTradeArr[twoNav].givePlayer.includes(ZachWilson)) {
    tempUpdateCapRoom -= 17193099;
  }
  if (twoTradeArr[twoNav].givePlayer.includes(QuinnenWilliams)) {
    tempUpdateCapRoom -= 5419431;
  }
  if (twoTradeArr[twoNav].givePlayer.includes(CoreyDavis)) {
    tempUpdateCapRoom -= 1333334;
  }
  if (twoTradeArr[twoNav].givePlayer.includes(GeorgeFant)) {
    tempUpdateCapRoom -= 1000000;
  }
  if (twoTradeArr[twoNav].givePlayer.includes(MekhiBecton)) {
    tempUpdateCapRoom -= 5487654;
  }
  if (twoTradeArr[twoNav].givePlayer.includes(DenzelMims)) {
    tempUpdateCapRoom -= 755892;
  }
  return tempUpdateCapRoom - tempCapRoom;
}

function acceptTwoOffer() {
  finishTrade("two");
}

function acceptDarnoldOffer() {
  finishTrade("darnold");
}


function watsonContinue() {
  finishTrade("watson");
}

function generateWatsonAssets() {
  var root = document.getElementById("assets");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (let i = 0; i < watsonTradeAssets.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row", "watsonAssetRow");


    var nameCol = document.createElement("div");
    nameCol.classList.add("col-12", "col-md-8", "assetCol");
    nameCol.setAttribute("id", watsonTradeAssets[i].name.replace(/\s+/g, ''));
    nameCol.addEventListener('click', function() {
      addAsset(watsonTradeAssets[i]);
    });

    var nameP = document.createElement("p");
    nameP.innerHTML = watsonTradeAssets[i].name;

    nameCol.appendChild(nameP);
    row.appendChild(nameCol);
    root.appendChild(row);
  }
}

function generateWilsonAssets() {
  var root = document.getElementById("wilsonassets");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (let i = 0; i < watsonTradeAssets.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row", "watsonAssetRow");


    var nameCol = document.createElement("div");
    nameCol.classList.add("col-12", "col-md-8", "assetCol");
    nameCol.setAttribute("id", watsonTradeAssets[i].name.replace(/\s+/g, ''));
    nameCol.addEventListener('click', function() {
      addAsset(watsonTradeAssets[i]);
    });

    var nameP = document.createElement("p");
    nameP.innerHTML = watsonTradeAssets[i].name;

    nameCol.appendChild(nameP);
    row.appendChild(nameCol);
    root.appendChild(row);
  }
}


function addAsset(thing) {
  if (thing.included === false) {
    assetsOffered.push(thing);
    document.getElementById(thing.name.replace(/\s+/g, '')).style.backgroundColor = "gray";
    thing.included = true;
  } else {
    const index = assetsOffered.indexOf(thing);
    assetsOffered.splice(index, 1);
    document.getElementById(thing.name.replace(/\s+/g, '')).style.backgroundColor = "transparent";
    thing.included = false;
  }
}

function watsonBack() {
    document.getElementById("watsonTradeAssets").style.display = "none";
    document.getElementById("tradePrompt").style.display = "block";
}

function darnoldBack() {
    document.getElementById("darnoldTradeOffers").style.display = "none";
    document.getElementById("tradePrompt").style.display = "block";
}

function twoBack() {
    document.getElementById("twoTradeOffers").style.display = "none";
    document.getElementById("tradePrompt").style.display = "block";
}

function makeOffer() {
  var accepted = checkTradeValue();
  document.getElementById("watsonTradeAssets").style.display = "none";

  document.getElementById("watsonResult").style.display = "block";
  if (accepted) {
    document.getElementById("resultText").innerHTML = "Accepted";
    document.getElementById("resultImage").setAttribute("src", "watsonJets.png");
    activeRoster.push(DeshaunWatson);
    tradedFor.push(DeshaunWatson.name);
    for (var i = 0; i < assetsOffered.length; i++) {
      tradedAway.push(assetsOffered[i].name);
      if (assetsOffered[i].thisYear === true) {
        draftOrder[assetsOffered[i].index[0]][assetsOffered[i].index[1]] = hou;
      }
      if (assetsOffered[i] === SamDarnold) {
        const index = activeRoster.indexOf(SamDarnold);
        activeRoster.splice(index, 1);
      }
      if (assetsOffered[i] === QuinnenWilliams) {
        const index = activeRoster.indexOf(QuinnenWilliams);
        activeRoster.splice(index, 1);
      }
      if (assetsOffered[i] === MekhiBecton) {
        const index = activeRoster.indexOf(MekhiBecton);
        activeRoster.splice(index, 1);
      }
    }
    // console.log(draftOrder);
  } else {
    document.getElementById("resultText").innerHTML = "Rejected";
    document.getElementById("resultImage").setAttribute("src", "watsonTexans.png");
  }
}

function makeWilsonOffer() {
  var accepted = checkTradeValue();
  document.getElementById("wilsonTradeAssets").style.display = "none";
  document.getElementById("watsonResult").style.display = "block";
  if (accepted) {
    document.getElementById("resultText").innerHTML = "Accepted";
    // document.getElementById("resultImage").setAttribute("src", "watsonJets.png");
    activeRoster.push(RussellWilson);
    tradedFor.push(RussellWilson.name);
    for (var i = 0; i < assetsOffered.length; i++) {
      tradedAway.push(assetsOffered[i].name);
      if (assetsOffered[i].thisYear === true) {
        draftOrder[assetsOffered[i].index[0]][assetsOffered[i].index[1]] = hou;
      }
      if (assetsOffered[i] === SamDarnold) {
        const index = activeRoster.indexOf(SamDarnold);
        activeRoster.splice(index, 1);
      }
      if (assetsOffered[i] === QuinnenWilliams) {
        const index = activeRoster.indexOf(QuinnenWilliams);
        activeRoster.splice(index, 1);
      }
      if (assetsOffered[i] === MekhiBecton) {
        const index = activeRoster.indexOf(MekhiBecton);
        activeRoster.splice(index, 1);
      }
    }
    // console.log(draftOrder);
  } else {
    document.getElementById("resultText").innerHTML = "Rejected";
    // document.getElementById("resultImage").setAttribute("src", "watsonTexans.png");
  }
}



function checkTradeValue() {
  var value = 0;
  for (let i = 0; i < assetsOffered.length; i++) {
    value += assetsOffered[i].tradeValue;
  }
  return value >= 10200 ? true : false;

  // var two = [];
  // for (let j = 0; j < assetsOffered.length; j++) {
  //   two.push(assetsOffered[j].order);
  // }
  //
  // for (let i = 0; i < acceptableOffers.length; i++) {
  //   var one = [];
  //
  //   for (let k = 0; k < acceptableOffers[i].length; k++) {
  //     one.push(acceptableOffers[i][k].order);
  //   }
  //   one.sort(function(a, b){return a-b});
  //   two.sort(function(a, b){return a-b});
  //   console.log(one);
  //   console.log(two);
  //   if (one.toString() === two.toString()) {
  //     return true;
  //   }
  // }
  // return false;
}

// function checkTradeValue() {
//   for (let i = 0; i < acceptableOffers.length; i++) {
//     var target = 0;
//     for (let j = 0; j < assetsOffered.length; j++) {
//       if (acceptableOffers[i].includes(assetsOffered[j])) {
//         target++
//         if (target === acceptableOffers[i].length) {
//           return true;
//         }
//       }
//     }
//   }
//   return false;
// }



function generateTeamFA() {

  var root = document.getElementById("faNavCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (let i = 0; i < teamFA.length; i++) {
    var playerDiv = document.createElement("div");
    playerDiv.classList.add("playerDiv");

//// PICTURE
    var imgrow = document.createElement("div");
    imgrow.classList.add("row", "text-center");

    var imgcol = document.createElement("div");
    imgcol.classList.add("col-12");

    var img = document.createElement("img");
    img.setAttribute("src", teamFA[i].img);
    img.classList.add("faImg");

    imgcol.appendChild(img);
    imgrow.appendChild(imgcol);
    playerDiv.appendChild(imgrow);
    // root.appendChild(imgrow);
////
    var row = document.createElement("div");
    row.classList.add("row", "text-center");

    var nameCol = document.createElement("div");
    nameCol.classList.add("col-12");

    var nameP = document.createElement("p");
    nameP.classList.add("faName");
    nameP.innerHTML = teamFA[i].name.toUpperCase();
    nameCol.appendChild(nameP);
    row.appendChild(nameCol);


        // var dumCol = document.createElement("div");
        // dumCol.classList.add("col-3");
        //     row.appendChild(dumCol);

    var posCol = document.createElement("div");
    posCol.classList.add("col-12");

    var posP = document.createElement("p");
    posP.classList.add("faPos");
    posP.innerHTML = teamFA[i].pos + "  /  Age: " + teamFA[i].age;
    posCol.appendChild(posP);
    row.appendChild(posCol);

    // var ageCol = document.createElement("div");
    // ageCol.classList.add("col-3");
    //
    // var ageP = document.createElement("p");
    // ageP.classList.add("faAge");
    // ageP.innerHTML = teamFA[i].age;
    // ageCol.appendChild(ageP);
    // row.appendChild(ageCol);


    var priceCol = document.createElement("div");
    priceCol.classList.add("col-12");

    var priceP = document.createElement("p");
    priceP.classList.add("faPrice");
    priceP.innerHTML = teamFA[i].cYears + " yr./$" + teamFA[i].cTotal + "M";
    priceCol.appendChild(priceP);
    row.appendChild(priceCol);


    if (!offeredArr.includes(teamFA[i])) {
      var signCol = document.createElement("div");
      signCol.classList.add("col-12");

      var signButton = document.createElement("button");
      signButton.classList.add("signButton", "bttn-md", "bttn-success", "butt");
      signButton.innerHTML = "SIGN";
      signButton.addEventListener('click', function() {
        signTeamFA(teamFA[i]);
      });
      signCol.appendChild(signButton);
      row.appendChild(signCol);
    }

    if (offeredArr.includes(teamFA[i])) {
      row.style.opacity = ".5";
    }
    var hr = document.createElement("hr");
    playerDiv.appendChild(row);
    root.appendChild(playerDiv);
    // root.appendChild(hr);
  }
}

function signTeamFA(guy) {
  // alert(guy.name);
  guy.salary = Math.floor((guy.cTotal * 1000000) / guy.cYears);
  if (guy.salary <= getCapRoom()){
    // console.log(guy.salary);
    activeRoster.push(guy);
    signedArr.push(guy);
    offeredArr.push(guy);
    /// if you want to remove from list entirely
    // const index = teamFA.indexOf(5);
    // teamFA.splice(index, 1);
    updateCapBar() // fix
    generateTeamFA();
    generateRoster();
    // console.log(activeRoster);
  }
}

function popUp(guy, yes) {
  // var target = document.getElementById(guy.name.replace(/\s+/g, ''));
    // position: element(#Target);\

  var pop = document.getElementById("signPop");
  // pop.style.position = "element(#" + guy.name.replace(/\s+/g, '') + ")";
  pop.style.display = "block";
  if (yes) {
    pop.innerHTML = guy.name + " Accepts!";
  }
  else {
    pop.innerHTML = guy.name + " has decided to sign elsewhere";
  }
  setTimeout(function(){   pop.style.display = "none"; }, 1500);
}

function signBroadFA(guy) {
  // alert(guy.name);
  guy.salary = Math.floor((guy.cTotal * 1000000) / guy.cYears);


  var sal = guy.salary;
  var cap =  getCapRoom();
  if (sal < cap) {

    var num = (Math.floor(Math.random() * 100));
    if (guy.interest >= num) {
      popUp(guy, true);
      console.log(guy.name);
      console.log("Salary: " + guy.salary);
      console.log("Cap Before: " + getCapRoom());
      console.log("Roster Size Before: " + activeRoster.length);

      activeRoster.push(guy);
      signedArr.push(guy);
      offeredArr.push(guy);
      /// if you want to remove from list entirely
      // const index = teamFA.indexOf(5);
      // teamFA.splice(index, 1);

      console.log("Cap After: " + getCapRoom());
      console.log("Roster Size After: " + activeRoster.length);

      updateCapBar() // fix
      generateBroadFA(currKind);
      generateRoster();
      console.log("Cap After Generation: " + getCapRoom());
        console.log("----------------------");

    } else {
      popUp(guy, false);

      offeredArr.push(guy);
      generateBroadFA(currKind);
    }

  }
}

function generateRoster() {
  var root = document.getElementById("rosterNavCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  activeRoster.sort(function(a,b) {
    var aNum;
    switch(a.pos) {
      case "QB":
        aNum = 26;
        break;
      case "RB":
        aNum = 25;
        break;
      case "FB":
        aNum = 24;
        break;
      case "WR":
        aNum = 23;
        break;
      case "TE":
        aNum = 22;
        break;
      case "OL":
        aNum = 21;
        break;
      case "T":
        aNum = 20;
        break;
      case "OG":
        aNum = 19;
        break;
      case "OT":
        aNum = 18;
        break;
      case "IOL":
        aNum = 17;
        break;
      case "C":
        aNum = 16;
        break;
      case "LT":
        aNum = 15;
        break;
      case "DE":
        aNum = 14;
        break;
      case "DL":
        aNum = 13;
        break;
      case "IDL":
        aNum = 12;
        break;
      case "DT":
        aNum = 11;
        break;
      case "EDGE":
        aNum = 10;
        break;
      case "ILB":
        aNum = 9;
        break;
      case "LB":
        aNum = 8;
        break;
      case "ROLB":
        aNum = 7;
        break;
      case "MLB":
        aNum = 6;
        break;
      case "CB":
        aNum = 5;
        break;
      case "DB":
        aNum = 4;
        break;
      case "FS":
        aNum = 3;
        break;
      case "S":
        aNum = 2;
        break;
      default:
        aNum = 1;
    }
    var bNum;
    switch(b.pos) {
      case "QB":
        bNum = 26;
        break;
      case "RB":
        bNum = 25;
        break;
      case "FB":
        bNum = 24;
        break;
      case "WR":
        bNum = 23;
        break;
      case "TE":
        bNum = 22;
        break;
      case "OL":
        bNum = 21;
        break;
      case "T":
        bNum = 20;
        break;
      case "OG":
        bNum = 19;
        break;
      case "OT":
        bNum = 18;
        break;
      case "IOL":
        bNum = 17;
        break;
      case "C":
        bNum = 16;
        break;
      case "LT":
        bNum = 15;
        break;
      case "DE":
        bNum = 14;
        break;
      case "DL":
        bNum = 13;
        break;
      case "IDL":
        bNum = 12;
        break;
      case "DT":
        bNum = 11;
        break;
      case "EDGE":
        bNum = 10;
        break;
      case "ILB":
        bNum = 9;
        break;
      case "LB":
        bNum = 8;
        break;
      case "ROLB":
        bNum = 7;
        break;
      case "MLB":
        bNum = 6;
        break;
      case "CB":
        bNum = 5;
        break;
      case "DB":
        bNum = 4;
        break;
      case "FS":
        bNum = 3;
        break;
      case "S":
        bNum = 2;
        break;
      default:
        bNum = 1;
    }
    return bNum - aNum;
  });

  var noterow = document.createElement("div");
  noterow.classList.add("row", "text-center");

  var noteCol = document.createElement("div");
  noteCol.classList.add("col-12");

  var noteP = document.createElement("p");
  noteP.innerHTML = "(Max of 6 players can be cut.)";

  noteCol.appendChild(noteP);
  noterow.appendChild(noteCol);
  root.appendChild(noterow);


  var row = document.createElement("div");
  row.classList.add("row");

  var posCol = document.createElement("div");
  posCol.classList.add("col-2");

  var posP = document.createElement("p");
  posP.classList.add("rosterHead");
  posP.innerHTML = "POS";
  posCol.appendChild(posP);
  row.appendChild(posCol);

  var nameCol = document.createElement("div");
  nameCol.classList.add("col-4", "col-md-4");

  var nameP = document.createElement("p");
  nameP.classList.add("rosterHead");
  nameP.innerHTML = "NAME";
  nameCol.appendChild(nameP);
  row.appendChild(nameCol);

  var saveCol = document.createElement("div");
  saveCol.classList.add("col-3", "col-md-3");

  var saveP = document.createElement("p");
  saveP.classList.add("rosterHead");
  saveP.innerHTML = "POTENTIAL SAVINGS";
  saveCol.appendChild(saveP);
  row.appendChild(saveCol);

  var chCol = document.createElement("div");
  chCol.classList.add("col-3", "col-md-3");

  var chP = document.createElement("p");
  chP.classList.add("rosterHead");
  chP.innerHTML = "CUT";
  chCol.appendChild(chP);
  row.appendChild(chCol);

  row.style.borderBottom = "1px solid #125740";

  root.appendChild(row);

  for (let i = 0; i < activeRoster.length; i++) {
    var row2 = document.createElement("div");
    row2.classList.add("row");

    var posCol2 = document.createElement("div");
    posCol2.classList.add("col-2");

    var posP2 = document.createElement("p");
    posP2.classList.add("rosterPos");
    posP2.innerHTML = activeRoster[i].pos;
    posCol2.appendChild(posP2);
    row2.appendChild(posCol2);

    var nameCol2 = document.createElement("div");
    nameCol2.classList.add("col-4", "col-md-4");

    var nameP2 = document.createElement("p");
    nameP2.classList.add("rosterName");
    nameP2.innerHTML = activeRoster[i].name;
    nameCol2.appendChild(nameP2);
    row2.appendChild(nameCol2);


    if (!signedArr.includes(activeRoster[i]) && cutArr.length < 6) {

      var penCol = document.createElement("div");
      penCol.classList.add("col-3", "col-md-3");

      var penP = document.createElement("p");
      penP.classList.add("rosterName");
      var num = activeRoster[i].salary - activeRoster[i].capPenalty;
      if (num < 0) {
        penP.style.color = "#ca5656";
      }
      penP.innerHTML = "$" + addCommas(num);
      penCol.appendChild(penP);
      row2.appendChild(penCol);


      var cutCol = document.createElement("div");
      cutCol.classList.add("col-3");
 ///<i class="fa fa-minus-circle" aria-hidden="true"></i>
      var cutButton = document.createElement("button");
      cutButton.classList.add("rosterCut", "btn");

      cutButton.addEventListener('click', function() {
        cutPlayer(activeRoster[i]);
      });

      var icon = document.createElement("i");
      icon.classList.add("fa", "fa-minus-circle", "fa-lg");
      icon.setAttribute("aria-hidden", "true");

      cutButton.appendChild(icon);
      cutCol.appendChild(cutButton);
      row2.appendChild(cutCol);
    }
    root.appendChild(row2);
  }
}

function cutPlayer(guy) {
  cutArr.push(guy);
  const index = activeRoster.indexOf(guy);
  activeRoster.splice(index, 1);
  updateCapBar(); // fix
  generateRoster();
  if (broad) {
      generateBroadFA(currKind);
  } else {
    generateTeamFA();
  }
}


function playersPressed() {
  document.getElementById("draftPoolHeader").style.display = "flex";
  document.getElementById("draftPoolCont").style.display = "block";
  document.getElementById("pickHistoryHeader").style.display = "none";
  document.getElementById("pickHistoryCont").style.display = "none";
  document.getElementById("yourpickHistoryHeader").style.display = "none";
  document.getElementById("yourpickHistoryCont").style.display = "none";
  generateDraftPool("fifty");
}

function pickHistoryPressed() {
  document.getElementById("draftPoolHeader").style.display = "none";
  document.getElementById("draftPoolCont").style.display = "none";
  document.getElementById("pickHistoryHeader").style.display = "flex";
  document.getElementById("pickHistoryCont").style.display = "block";
  document.getElementById("yourpickHistoryHeader").style.display = "none";
  document.getElementById("yourpickHistoryCont").style.display = "none";
  generatePickHistory();
}

function yourpickHistoryPressed() {
  document.getElementById("draftPoolHeader").style.display = "none";
  document.getElementById("draftPoolCont").style.display = "none";
  document.getElementById("yourpickHistoryHeader").style.display = "flex";
    document.getElementById("pickHistoryHeader").style.display = "none";
    document.getElementById("pickHistoryCont").style.display = "none";
  document.getElementById("yourpickHistoryCont").style.display = "block";
  generateYourPickHistory();
}

function generateYourPickHistory() {
  var root = document.getElementById("yourpickHistoryCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (let i = (jetsDrafted.length - 1); i >= 0; i--) {
    var row = document.createElement("div");
    row.classList.add("row");
    row.style.borderBottom = "1px solid #282520";

    var teamCol = document.createElement("div");
    teamCol.classList.add("col-md-1", "col-2");

    var teamP = document.createElement("img");
    teamP.classList.add("phLogo");
    teamP.setAttribute("src", yourTeam.logo);
    teamCol.appendChild(teamP);
    row.appendChild(teamCol);


    var pickCol = document.createElement("div");
    pickCol.classList.add("col-md-1", "col-2");

    var pickP = document.createElement("p");
    pickP.classList.add("phPick");
    pickNum = jetsDrafted[i].pickNum;
    pickP.innerHTML = pickNum;
    pickCol.appendChild(pickP);
    row.appendChild(pickCol);

    var posCol = document.createElement("div");
    posCol.classList.add("col-md-1", "col-2");

    var posP = document.createElement("p");
    posP.classList.add("phPos");

    posP.innerHTML = jetsDrafted[i].pos;
    console.log(jetsDrafted[i].pos)
    posCol.appendChild(posP);
    row.appendChild(posCol);

    var nameCol = document.createElement("div");
    nameCol.classList.add("col-md-4", "col-6");

    var nameP = document.createElement("p");
    nameP.classList.add("phName", "myauto");
    nameP.innerHTML = jetsDrafted[i].name;
    nameCol.appendChild(nameP);
    row.appendChild(nameCol);

    var schoolCol = document.createElement("div");
    schoolCol.classList.add("col-md-4", "col-0", "d-none", "d-md-block");

    var schoolP = document.createElement("p");
    schoolP.classList.add("phSchool");
    schoolP.innerHTML = jetsDrafted[i].school;
    schoolCol.appendChild(schoolP);
    row.appendChild(schoolCol);

    // }
    root.appendChild(row);
  }
}

function generatePickHistory() {
  var root = document.getElementById("pickHistoryCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (let i = (draftSummary.length - 1); i >= 0; i--) {
    var row = document.createElement("div");
    row.classList.add("row");
    row.style.borderBottom = "1px solid #282520";

    var teamCol = document.createElement("div");
    teamCol.classList.add("col-md-1", "col-2");

    var teamP = document.createElement("img");
    teamP.classList.add("phLogo");
    teamP.setAttribute("src", draftSummary[i][0].logo);
    teamCol.appendChild(teamP);
    row.appendChild(teamCol);


    var pickCol = document.createElement("div");
    pickCol.classList.add("col-md-1", "col-2");

    var pickP = document.createElement("p");
    pickP.classList.add("phPick");
    pickP.innerHTML = i + 1;
    pickCol.appendChild(pickP);
    row.appendChild(pickCol);

    var posCol = document.createElement("div");
    posCol.classList.add("col-md-1", "col-2");

    var posP = document.createElement("p");
    posP.classList.add("phPos");
    posP.innerHTML = draftSummary[i][1].pos
    posCol.appendChild(posP);
    row.appendChild(posCol);

    var nameCol = document.createElement("div");
    nameCol.classList.add("col-md-4", "col-6");

    var nameP = document.createElement("p");
    nameP.classList.add("phName", "myauto");
    nameP.innerHTML = draftSummary[i][1].name;
    nameCol.appendChild(nameP);
    row.appendChild(nameCol);

    var schoolCol = document.createElement("div");
    schoolCol.classList.add("col-md-4", "col-0", "d-none", "d-md-block");

    var schoolP = document.createElement("p");
    schoolP.classList.add("phSchool");
    schoolP.innerHTML = draftSummary[i][1].school;
    schoolCol.appendChild(schoolP);
    row.appendChild(schoolCol);

    // }
    root.appendChild(row);
  }
}

function generateDraftPool(kind) {
  console.log(jetsDrafted);
  var amount = 50;
  var tempArray = [];
  if (draftPlayers.length < 50) {
    amount = draftPlayers.length;
  }
  if (kind === "QB") {
    var count = 0;
    while (tempArray.length < amount && draftPlayers[count + 1] != null) {
      if (draftPlayers[count].pos === "QB") {
        tempArray.push(draftPlayers[count]);
      }
      count++;
    }
    amount = tempArray.length;
  } else if (kind === "RB") {
      var count = 0;
      while (tempArray.length < amount && draftPlayers[count + 1] != null) {
        if (draftPlayers[count].pos === "RB") {
          tempArray.push(draftPlayers[count]);
        }
        count++;
      }
      amount = tempArray.length;
    }
    else if (kind === "FB") {
       var count = 0;
       while (tempArray.length < amount && draftPlayers[count + 1] != null) {
         if (draftPlayers[count].pos === "FB") {
           tempArray.push(draftPlayers[count]);
         }
         count++;
       }
       amount = tempArray.length;
     }
    else if (kind === "WR") {
       var count = 0;
       while (tempArray.length < amount && draftPlayers[count + 1] != null) {
         if (draftPlayers[count].pos === "WR") {
           tempArray.push(draftPlayers[count]);
         }
         count++;
       }
       amount = tempArray.length;
     }
     else if (kind === "TE") {
        var count = 0;
        while (tempArray.length < amount && draftPlayers[count + 1] != null) {
          if (draftPlayers[count].pos === "TE") {
            tempArray.push(draftPlayers[count]);
          }
          count++;
        }
        amount = tempArray.length;
      }
      else if (kind === "OT") {
         var count = 0;
         while (tempArray.length < amount && draftPlayers[count + 1] != null) {
           if (draftPlayers[count].pos === "OT") {
             tempArray.push(draftPlayers[count]);
           }
           count++;
         }
         amount = tempArray.length;
       }
       else if (kind === "IOL") {
          var count = 0;
          while (tempArray.length < amount && draftPlayers[count + 1] != null) {
            if (draftPlayers[count].pos === "IOL") {
              tempArray.push(draftPlayers[count]);
            }
            count++;
          }
          amount = tempArray.length;
        }
       else if (kind === "IDL") {
          var count = 0;
          while (tempArray.length < amount && draftPlayers[count + 1] != null) {
            if (draftPlayers[count].pos === "IDL") {
              tempArray.push(draftPlayers[count]);
            }
            count++;
          }
          amount = tempArray.length;
        }
        else if (kind === "EDGE") {
           var count = 0;
           while (tempArray.length < amount && draftPlayers[count + 1] != null) {
             if (draftPlayers[count].pos === "EDGE") {
               tempArray.push(draftPlayers[count]);
             }
             count++;
           }
           amount = tempArray.length;
         }
        else if (kind === "LB") {
           var count = 0;
           while (tempArray.length < amount && draftPlayers[count + 1] != null) {
             if (draftPlayers[count].pos === "LB") {
               tempArray.push(draftPlayers[count]);
             }
             count++;
           }
           amount = tempArray.length;
         }
         else if (kind === "CB") {
            var count = 0;
            while (tempArray.length < amount && draftPlayers[count + 1] != null) {
              if (draftPlayers[count].pos === "CB") {
                tempArray.push(draftPlayers[count]);
              }
              count++;
            }
            amount = tempArray.length;
          }
          else if (kind === "S") {
             var count = 0;
             while (tempArray.length < amount && draftPlayers[count + 1] != null) {
               if (draftPlayers[count].pos === "S") {
                 tempArray.push(draftPlayers[count]);
               }
               count++;
             }
             amount = tempArray.length;
           }else {
    tempArray = draftPlayers;
  }

  var root = document.getElementById("draftPoolCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (let i = 0; i < amount; i++) {
    var row = document.createElement("div");
    row.classList.add("row");
    row.style.borderBottom = "1px solid #282520";

    var rankCol = document.createElement("div");
    rankCol.classList.add("col-md-1", "col-2");

    var rankP = document.createElement("p");
    rankP.classList.add("draftPos");
    rankP.innerHTML = tempArray[i].rank;
    rankCol.appendChild(rankP);
    row.appendChild(rankCol);


    var posCol = document.createElement("div");
    posCol.classList.add("col-md-1", "col-2");

    var posP = document.createElement("p");
    posP.classList.add("draftPos");
    posP.innerHTML = tempArray[i].pos;
    posCol.appendChild(posP);
    row.appendChild(posCol);

    var nameCol = document.createElement("div");
    nameCol.classList.add("col-md-4", "col-6");

    var nameP = document.createElement("p");
    nameP.classList.add("draftName", "myauto");
    nameP.innerHTML = tempArray[i].name;
    nameCol.appendChild(nameP);
    row.appendChild(nameCol);

    var schoolCol = document.createElement("div");
    schoolCol.classList.add("col-md-4", "col-0", "d-none", "d-md-block");

    var schoolP = document.createElement("p");
    schoolP.classList.add("draftSchool");
    schoolP.innerHTML = tempArray[i].school;
    schoolCol.appendChild(schoolP);
    row.appendChild(schoolCol);
    // if (!signedArr.includes(draftPlayers[i])) {
      var cutCol = document.createElement("div");
      cutCol.classList.add("col-2", "col-md-2");

      var cutButton = document.createElement("button");
      cutButton.classList.add("draftPlayerButton", "btn");
      // cutButton.innerHTML = "Draft";
      cutButton.addEventListener('click', function() {
        draftPlayer(tempArray[i]);
      });

      var icon = document.createElement("i");
      icon.classList.add("fa", "fa-plus-circle", "fa-lg");
      icon.setAttribute("aria-hidden", "true");
      icon.style.color = "green";

      cutButton.appendChild(icon);
      cutCol.appendChild(cutButton);
      row.appendChild(cutCol);
    // }
    root.appendChild(row);
  }
}

function advanceFA() {
  faNav();
  broad = true;
  generateBroadFA(currKind);
  window.scrollTo(0, 0);
  document.getElementById("advanceButton").setAttribute("onclick", "doneFA()");
  document.getElementById("advanceButton").innerHTML = "GO TO DRAFT";
  document.getElementById("advanceButton").blur();
  document.getElementById("faHead").innerHTML = "FREE AGENCY";
  document.getElementById("broadSort").style.display = "block";
}

function addCommas(num) {
  var neg = false;
  if (num < 0) {
    neg = true;
  }
  var n = num.toFixed(0);
  var str = n.toString();
  if (neg) {
    str = str.substr(1);
  }
  var count = 0;
  var newStr = "";
  for (var i = str.length - 1; i > -1; i--) {
    if (count == 2) {
      var additive = "," + str[i];
      newStr = additive.concat(newStr);
      count = 0;
      continue;
    } else {
      newStr = str[i].concat(newStr);
    }
    count++;
  }
  if (newStr[0] == ",") {
    newStr = newStr.substring(1);
  }
  if (neg) {
    newStr = "-" + newStr;
  }
  return newStr;
}

function doneFA() {
  document.getElementById("twoTradeOffers").style.display = "none";
  document.getElementById("faCont").style.display = "none";
  document.getElementById("green").style.display = "block";
      document.getElementById("trans2").style.display = "none";
    document.getElementById("tradePrompt").style.display = "none";
    document.getElementById("trans3").style.display = "none";
  document.getElementById("trans4").style.display = "block";
    document.getElementById("draftStartScreen").style.display = "block";
    document.body.style.backgroundColor = "rgb(227 227 227)";
    console.log(draftOrder);
}

function draftPressed() {

  document.getElementById("draftStartScreen").style.display = "none";
  startDraft(leftOff); ///// move to button
  document.getElementById("draftCont").style.display = "block";
  document.getElementById("trans4").style.background =  "#e4e4e4";

}

// function continueDraft() {
//   startDraft(leftOff);
// }

function draftsOver() {
  document.body.setAttribute("style", "background-color: #00734d");
  document.getElementById("draftCont").style.display = "none";
  document.getElementById("summary").style.display = "block";
  generateSummary();
  // console.log("\nSIGNED\n")
  for (var i = 0; i < signedArr.length; i++) {
    // console.log(signedArr[i].name);
  }
  // console.log("\nDRAFTED\n")
  for (var i = 0; i < jetsDrafted.length; i++) {
    // console.log(jetsDrafted[i].name);
  }
}

function sMoves() {
  document.getElementById("sMoves").style.display = "flex";
  document.getElementById("sRoster").style.display = "none";
}

function sRoster() {
  document.getElementById("sMoves").style.display = "none";
  document.getElementById("sRoster").style.display = "block";
  // generateSRoster();
}

function generateSRoster() {
  // var root = document.getElementById("sRoster");
  // while (root.firstChild) {
  //   root.removeChild(root.firstChild);
  // }
  console.log(activeRoster);
  activeRoster.sort(function(a,b) {
    var aNum;
    switch(a.pos) {
      case "QB":
        aNum = 26;
        break;
      case "RB":
        aNum = 25;
        break;
      case "FB":
        aNum = 24;
        break;
      case "WR":
        aNum = 23;
        break;
      case "TE":
        aNum = 22;
        break;
      case "OL":
        aNum = 21;
        break;
      case "T":
        aNum = 20;
        break;
      case "OG":
        aNum = 19;
        break;
      case "OT":
        aNum = 18;
        break;
      case "IOL":
        aNum = 17;
        break;
      case "C":
        aNum = 16;
        break;
      case "LT":
        aNum = 15;
        break;
      case "DE":
        aNum = 14;
        break;
      case "DL":
        aNum = 13;
        break;
      case "IDL":
        aNum = 12;
        break;
      case "DT":
        aNum = 11;
        break;
      case "EDGE":
        aNum = 10;
        break;
      case "ILB":
        aNum = 9;
        break;
      case "LB":
        aNum = 8;
        break;
      case "ROLB":
        aNum = 7;
        break;
      case "MLB":
        aNum = 6;
        break;
      case "CB":
        aNum = 5;
        break;
      case "DB":
        aNum = 4;
        break;
      case "FS":
        aNum = 3;
        break;
      case "S":
        aNum = 2;
        break;
      default:
        aNum = 1;
    }
    var bNum;
    switch(b.pos) {
      case "QB":
        bNum = 26;
        break;
      case "RB":
        bNum = 25;
        break;
      case "FB":
        bNum = 24;
        break;
      case "WR":
        bNum = 23;
        break;
      case "TE":
        bNum = 22;
        break;
      case "OL":
        bNum = 21;
        break;
      case "T":
        bNum = 20;
        break;
      case "OG":
        bNum = 19;
        break;
      case "OT":
        bNum = 18;
        break;
      case "IOL":
        bNum = 17;
        break;
      case "C":
        bNum = 16;
        break;
      case "LT":
        bNum = 15;
        break;
      case "DE":
        bNum = 14;
        break;
      case "DL":
        bNum = 13;
        break;
      case "IDL":
        bNum = 12;
        break;
      case "DT":
        bNum = 11;
        break;
      case "EDGE":
        bNum = 10;
        break;
      case "ILB":
        bNum = 9;
        break;
      case "LB":
        bNum = 8;
        break;
      case "ROLB":
        bNum = 7;
        break;
      case "MLB":
        bNum = 6;
        break;
      case "CB":
        bNum = 5;
        break;
      case "DB":
        bNum = 4;
        break;
      case "FS":
        bNum = 3;
        break;
      case "S":
        bNum = 2;
        break;
      default:
        bNum = 1;
    }
    return bNum - aNum;
  });


  var test = document.getElementById("sOffense");

  // console.log(test);
  // var row = document.createElement("div");
  // row.classList.add("row");
  //
  // var posCol = document.createElement("div");
  // posCol.classList.add("col-2");
  //
  // var posP = document.createElement("p");
  // posP.classList.add("rosterHead");
  // posP.innerHTML = "<b>POS</b>";
  // posCol.appendChild(posP);
  // row.appendChild(posCol);
  //
  // var nameCol = document.createElement("div");
  // nameCol.classList.add("col-4", "col-md-4");
  //
  // var nameP = document.createElement("p");
  // nameP.classList.add("rosterHead");
  // nameP.innerHTML = "<b>NAME</b>";
  // nameCol.appendChild(nameP);
  // row.appendChild(nameCol);
  //
  //
  // row.style.borderBottom = "1px solid #125740";
  //
  // root.appendChild(row);

  for (let i = 0; i < activeRoster.length; i++) {
    // console.log(i);
    if (activeRoster[i].pos === "IDL") {
      test = document.getElementById("sDefense");
    }
    var row2 = document.createElement("div");
    row2.classList.add("row");

    var posCol2 = document.createElement("div");
    posCol2.classList.add("col-3", "col-md-2");

    var posP2 = document.createElement("p");
    posP2.classList.add("rosterPos");
    posP2.style.marginBottom = "0px";
    posP2.innerHTML = activeRoster[i].pos;
    posCol2.appendChild(posP2);
    row2.appendChild(posCol2);

    var nameCol2 = document.createElement("div");
    nameCol2.classList.add("col-9", "col-md-8");

    var nameP2 = document.createElement("p");
    nameP2.classList.add("rosterName");
    nameP2.style.marginBottom = "0px";
    nameP2.innerHTML = activeRoster[i].name;
    nameCol2.appendChild(nameP2);
    row2.appendChild(nameCol2);



    test.appendChild(row2);
  }
}

function generateSummary() {
  // document.getElementById("sCap").innerHTML = "CAP SPACE: $" + sumCap;
  generateSRoster();
  var root = document.getElementById("cutList");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  if (cutArr.length != 0) {
    for (var i = 0; i < cutArr.length; i++) {
      var row = document.createElement("div");
      row.classList.add("row");
      var col = document.createElement("div");
      col.classList.add("col-12");
      var p = document.createElement("div");
      p.classList.add("sumP");
      p.innerHTML = cutArr[i].name;

      col.appendChild(p);
      row.appendChild(col);
      root.appendChild(row);
    }
  } else {
    document.getElementById("cutHead").style.display = "none";
    var root3 = document.getElementById("cutSection");
    root3.classList.remove("col-6", "col-lg-3");
    root3.classList.add("col-0");
  }
  var root = document.getElementById("tradedFor");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  if (tradedFor.length != 0) {
    for (var i = 0; i < tradedFor.length; i++) {
      var row = document.createElement("div");
      row.classList.add("row");
      var col = document.createElement("div");
      col.classList.add("col-12");
      var p = document.createElement("div");
      p.classList.add("sumP");
      p.innerHTML = tradedFor[i];

      col.appendChild(p);
      row.appendChild(col);
      root.appendChild(row);
    }
  } else {
    document.getElementById("tfHead").style.display = "none";
    var root3 = document.getElementById("tradedForSection");
    root3.classList.remove("col-6", "col-lg-3");
    root3.classList.add("col-0");
  }
  var root2 = document.getElementById("tradedAway");
  while (root2.firstChild) {
    root2.removeChild(root2.firstChild);
  }
  if (tradedAway.length != 0) {
    for (var i = 0; i < tradedAway.length; i++) {
      var row = document.createElement("div");
      row.classList.add("row");
      var col = document.createElement("div");
      col.classList.add("col-12");
      var p = document.createElement("div");
      p.classList.add("sumP");
      p.innerHTML = tradedAway[i];

      col.appendChild(p);
      row.appendChild(col);
      root2.appendChild(row);
    }
  } else {
    document.getElementById("taHead").style.display = "none";
    var root3 = document.getElementById("tradedAwaySection");
    root3.classList.remove("col-6", "col-lg-3");
    root3.classList.add("col-0");
  }
  var root3 = document.getElementById("signed");
  while (root3.firstChild) {
    root3.removeChild(root3.firstChild);
  }
  if (signedArr.length != 0) {
    for (var i = 0; i < signedArr.length; i++) {
      var row = document.createElement("div");
      row.classList.add("row");
      var col = document.createElement("div");
      col.classList.add("col-12");
      var p = document.createElement("div");
      p.classList.add("sumP");
      p.innerHTML = "<b>" + signedArr[i].name + "</b><br /> (" + signedArr[i].cYears + " yr./$" + signedArr[i].cTotal + " mil)";

      col.appendChild(p);
      row.appendChild(col);
      root3.appendChild(row);
    }
  } else{
    document.getElementById("sHead").style.display = "none";
    var root3 = document.getElementById("signedSection");
    root3.classList.remove("col-6", "col-lg-3");
    root3.classList.add("col-0");
  }
  var root4 = document.getElementById("drafted");
  while (root4.firstChild) {
    root4.removeChild(root4.firstChild);
  }
  if (jetsDrafted.length != 0) {
    for (var i = 0; i < draftSummary.length; i++) {
      if (draftSummary[i][0].name === yourTeam.name) {
        var row = document.createElement("div");
        row.classList.add("row");
        var col = document.createElement("div");
        col.classList.add("col-12");
        var p = document.createElement("div");
        p.classList.add("sumP");
        p.innerHTML = "<b>#" + (i + 1) + "</b><br />" + draftSummary[i][1].pos + " " + draftSummary[i][1].name;

        col.appendChild(p);
        row.appendChild(col);
        root4.appendChild(row);
      }
    }
  }

}

function generateTradeOptions() {
  var root = document.getElementById("faNavCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
}

function showDraft() {
  // console.log(draftSummary);
  // console.log(leftOffShow);
  // console.log(showAmount);
  document.getElementById("showDraft").style.display = "block";
  var i = leftOffShow;
  var j = 0;
  while (i < showAmount) {
   (function (i, j) {
     setTimeout(function() {
       if (i == showAmount - 1) {
          document.getElementById("showDraft").style.display = "none";
       } else {
         // console.log(draftSummary);
         // console.log(draftSummary[i][0]);
         // console.log(draftSummary[i][1]);
         document.getElementById("showLogo").setAttribute("src", draftSummary[i][0].logo);
         document.getElementById("showPick").innerHTML = draftSummary[i][1].pos + " - " + draftSummary[i][1].name;
       }
     }, 250 * j)
   }) (i++, j++)
  }
  leftOffShow = showAmount - 1;
}

function startDraft(n) {
  var stop = false;
  generateDraftPool("fifty");
  for (var i = n[0]; i < draftOrder.length; i++) {
    if (stop === true) {
      showDraft();
      break;
    }
    var round  = i + 1;

    for (var k = n[1]; k < draftOrder[i].length; k++) {
      showAmount++;
      document.getElementById("roundpicktext").innerHTML = "Round " + (i + 1) + " Pick " + (k + 1);
      if (i === 6 && k === draftOrder[i].length - 1) {
        draftOver = true;
      }
      if (k === 0) {
        // console.log("Round " + round);
      }
      if (draftOrder[i][k] != yourTeam) {
        var teamPicking = draftOrder[i][k];
        var playerTaken = getPick(teamPicking); /// edit to make more random
        draftSummary.push([teamPicking, playerTaken]);
        taken.push(playerTaken);
        const index = draftPlayers.indexOf(playerTaken);
        if (index > -1) {
          draftPlayers.splice(index, 1);
        }
        // console.log((k + 1) + " " + teamPicking.name + ": " + playerTaken.name)
      } else {
        generateDraftPool("fifty");
        ///////////////// change
        // var teamPicking = draftOrder[i][k];
        // var playerTaken = draftPlayers[0]; /// edit to make more random
        // taken.push(playerTaken);
        // const index = draftPlayers.indexOf(playerTaken);
        // if (index > -1) {
        //   draftPlayers.splice(index, 1);
        // }
        // console.log((k + 1) + " " + teamPicking.name + ": " + playerTaken.name)
        /////////////////
        leftOff = [i, k + 1];

        stop = true;
        break;
      }
    }
    if (draftOver === true) {
      draftsOver();
      break;
    }
    if (stop == false) {
          leftOff[1] = 0;
    }
  }
}


function getPick(team) {
  var amount = team.needs.length;
  var possiblePicks = [];
  var qb;
  if (draftSummary.length < 1) {
    var temp = [AidanHutchinson, KayvonThibodeaux];
    var num = Math.floor(Math.random() * 2);
    var ind = draftPlayers.indexOf(temp[num]);
    console.log("if 1: " + ind);
    return draftPlayers[ind];
  }
  if (draftSummary.length == 1) {
    return draftPlayers[0];
  }
  if (draftSummary.length == 2) {
    var temp = [MattCorral, KennyPickett, EvanNeal, DerekStingleyJr, KyleHamilton, IkemEkwonu];
    var temp2 = [];
    for (let i = 0; i < temp.length; i++) {
      console.log(draftSummary.indexOf(temp[i]));
      if (draftSummary.indexOf(temp[i]) >= 0) {
        continue;
      } else {
        temp2.push(temp[i]);
      }
    }
    var num = Math.floor(Math.random() * temp2.length);
    var ind = draftPlayers.indexOf(temp2[num]);
    console.log("if 3: " + ind);
    return draftPlayers[ind];
  }
  if (draftPlayers[0].rank <= (draftSummary.length - 2) && draftSummary.length < 23) {
    return draftPlayers[0];
  }
  if (draftPlayers[0].rank <= (draftSummary.length - 15)) {
    return draftPlayers[0];
  } else if (amount > 0) {
    for (var i = 0; i < amount; i++) {
      var positionNeed = team.needs[i];
      if (positionNeed == "RB" && draftSummary.length < 20) {
        continue;
      }
      for (var j = 0; j < draftPlayers.length; j++) {
        if (draftPlayers[j].pos == positionNeed) {     ////// you can make a decreasing var for random
          possiblePicks.push(draftPlayers[j]);
          if (draftPlayers[j].pos === "QB") {
            qb = draftPlayers[j];
          }
          break;
        }
      }
    }

    if (draftSummary.length < 1) {
      var pick = draftPlayers[0];
      // var index2;
      // for (var  i = 0 ; i < draftPlayers.length; i++) {
      //   if (draftPlayers[i].name == "Zach Wilson") {
      //     index2 = i;
      //     break;
      //   }
      // }
      // console.log(index2);
      // var pick = draftPlayers[index2];
    }
    else {
      if (draftSummary.length < 15 && team.needs.includes("QB")) {
        possiblePicks.push(qb);
        possiblePicks.push(qb);
        possiblePicks.push(qb);
      }
      var rand = Math.floor(Math.random() * (possiblePicks.length - 1));
      var pick = possiblePicks[rand];
      if (draftSummary.length < 10) {
        if (pick.rank - 10 > draftSummary.length && draftSummary.length < 10 && pick.pos != 'QB') {
          pick = draftPlayers[0];
        }
      }
    }
    if (possiblePicks.length === 0) {
      return draftPlayers[0];
    }
    // console.log(possiblePicks.length + " " + team.name);
    // console.log(pick);
    const index = team.needs.indexOf(pick.pos);
    if (index > -1) {
      team.needs.splice(index, 1);
    }
    return pick;
  } else {
    return draftPlayers[0];
  }
}

function draftPlayer(guy) {
  // var teamPicking = draftOrder[i][k];
  // var playerTaken = draftPlayers[0]; /// edit to make more random
  taken.push(guy);
  const index = draftPlayers.indexOf(guy);
  if (index > -1) {
    draftPlayers.splice(index, 1);
  }
  // console.log(" Jets: " + guy.name);
  activeRoster.push(guy);
  guy.pickNum = draftSummary.length + 1;
  jetsDrafted.push(guy);
  draftSummary.push([yourTeam, guy]);
    window.scrollTo(0, 0);
  startDraft(leftOff);
    window.scrollTo(0, 0);
}

function generateBroadFA(kind) {
  currKind = kind;
  var tempArray = [];
  var amount = broadFA.length;
  if (kind === "QB") {
    var count = 0;
    while (count < amount) {
      if (broadFA[count].pos === "QB") {
        tempArray.push(broadFA[count]);
      }
      count++;
    }
    amount = tempArray.length;
  } else if (kind === "RB") {
      var count = 0;
      while (count < amount) {
        if (broadFA[count].pos === "RB") {
          tempArray.push(broadFA[count]);
        }
        count++;
      }
      amount = tempArray.length;
    }
    else if (kind === "FB") {
        var count = 0;
        while (count < amount) {
          if (broadFA[count].pos === "FB") {
            tempArray.push(broadFA[count]);
          }
          count++;
        }
        amount = tempArray.length;
      }
    else if (kind === "WR") {
       var count = 0;
       while (count < amount) {
         if (broadFA[count].pos === "WR") {
           tempArray.push(broadFA[count]);
         }
         count++;
       }
       amount = tempArray.length;
     }
     else if (kind === "TE") {
        var count = 0;
        while (count < amount) {
          if (broadFA[count].pos === "TE") {
            tempArray.push(broadFA[count]);
          }
          count++;
        }
        amount = tempArray.length;
      }
      // else if (kind === "OL") {
      //    var count = 0;
      //    while (count < amount) {
      //      if (broadFA[count].pos === "IOL" || broadFA[count].pos === "OT") {
      //        tempArray.push(broadFA[count]);
      //      }
      //      count++;
      //    }
      //    amount = tempArray.length;
      //  }
      else if (kind === "OT") {
         var count = 0;
         while (count < amount) {
           if (broadFA[count].pos === "OT") {
             tempArray.push(broadFA[count]);
           }
           count++;
         }
         amount = tempArray.length;
       }
       else if (kind === "IOL") {
          var count = 0;
          while (count < amount) {
            if (broadFA[count].pos === "IOL") {
              tempArray.push(broadFA[count]);
            }
            count++;
          }
          amount = tempArray.length;
        }
       else if (kind === "IDL") {
          var count = 0;
          while (count < amount) {
            if (broadFA[count].pos === "IDL") {
              tempArray.push(broadFA[count]);
            }
            count++;
          }
          amount = tempArray.length;
        }
        else if (kind === "EDGE") {
           var count = 0;
           while (count < amount) {
             if (broadFA[count].pos === "EDGE") {
               tempArray.push(broadFA[count]);
             }
             count++;
           }
           amount = tempArray.length;
         }
        else if (kind === "LB") {
           var count = 0;
           while (count < amount) {
             if (broadFA[count].pos === "LB") {
               tempArray.push(broadFA[count]);
             }
             count++;
           }
           amount = tempArray.length;
         }
         else if (kind === "CB") {
            var count = 0;
            while (count < amount) {
              if (broadFA[count].pos === "CB") {
                tempArray.push(broadFA[count]);
              }
              count++;
            }
            amount = tempArray.length;
          }
          else if (kind === "S") {
             var count = 0;
             while (count < amount) {
               if (broadFA[count].pos === "S") {
                 tempArray.push(broadFA[count]);
               }
               count++;
             }
             amount = tempArray.length;
           }
           else if (kind === "K") {
              var count = 0;
              while (count < amount) {
                if (broadFA[count].pos === "K") {
                  tempArray.push(broadFA[count]);
                }
                count++;
              }
              amount = tempArray.length;
            }
            else if (kind === "P") {
               var count = 0;
               while (count < amount) {
                 if (broadFA[count].pos === "P") {
                   tempArray.push(broadFA[count]);
                 }
                 count++;
               }
               amount = tempArray.length;
             }else {
    tempArray = broadFA;
  }

  var root = document.getElementById("faNavCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (let i = 0; i < tempArray.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row");

    var nameCol = document.createElement("div");
    nameCol.classList.add("col-12");
    nameCol.setAttribute("id", tempArray[i].name.replace(/\s+/g, ''));

    var nameP = document.createElement("p");
    nameP.classList.add("faName");
    nameP.innerHTML = tempArray[i].name.toUpperCase();
    nameCol.appendChild(nameP);
    row.appendChild(nameCol);



    var posCol = document.createElement("div");
    posCol.classList.add("col-6", "col-md-5");

    var posP = document.createElement("p");
    posP.classList.add("faPos");
    posP.innerHTML = tempArray[i].pos;
    posCol.appendChild(posP);
    row.appendChild(posCol);

    // var ageCol = document.createElement("div");
    // ageCol.classList.add("col-3");
    //
    // var ageP = document.createElement("p");
    // ageP.classList.add("faAge");
    // ageP.innerHTML = broadFA[i].age;
    // ageCol.appendChild(ageP);
    // row.appendChild(ageCol);

    var priceCol = document.createElement("div");
    priceCol.classList.add("col-6", "col-md-3");

    var priceP = document.createElement("p");
    priceP.classList.add("faPrice");
    priceP.innerHTML = tempArray[i].cYears + " yr./$" + tempArray[i].cTotal + "M";
    priceCol.appendChild(priceP);
    row.appendChild(priceCol);

    // var dumCol = document.createElement("div");
    // dumCol.classList.add("col-3");
    // row.appendChild(dumCol);
    if (!offeredArr.includes(tempArray[i])) {
      var signCol = document.createElement("div");
      signCol.classList.add("col-12", "col-md-4");


      var sal = tempArray[i].salary = (tempArray[i].cTotal * 1000000) / tempArray[i].cYears;
      if (getCapRoom() - sal < 0) {
        var signButton = document.createElement("p");
        signButton.style.backgroundColor = "#ca5656";
        signButton.style.paddingLeft = "15px";
        signButton.innerHTML = "NOT ENOUGH SPACE";
      } else {
        var signButton = document.createElement("button");
        signButton.classList.add("signButton", "bttn-md", "bttn-success", "butt");

        signButton.innerHTML = "SIGN";
        signButton.addEventListener('click', function() {
          signBroadFA(tempArray[i]);
        });
      }
      signCol.appendChild(signButton);
      row.appendChild(signCol);
    }

    if (offeredArr.includes(tempArray[i])) {
      row.style.opacity = ".5";
    }
    var sal = (tempArray[i].cTotal * 1000000) / tempArray[i].cYears;
    if (getCapRoom() - sal < 0) {
      row.style.opacity = ".5";
    }
    root.appendChild(row);
    var hr = document.createElement("hr");
    root.appendChild(row);
    root.appendChild(hr);
  }
}

function divideRoster() {
  for (let i = 0; i < currRosterArr.length; i++) {
    if (currRosterArr[i].salary === 0) {
      teamFA.push(currRosterArr[i]);
    } else {
      activeRoster.push(currRosterArr[i]);
    }
  }
}

function getSalaryHit() {
  var totalSalary = 0;
  for (let i = 0; i < activeRoster.length; i++) {
    totalSalary += activeRoster[i].salary;
  }
  return totalSalary;
}

function getCapRoom() {
  var salaryNum = getSalaryHit();
  // console.log(salaryNum);
  var cutPenalties = 0;
  for (let i = 0; i < cutArr.length; i++) {
    cutPenalties += cutArr[i].capPenalty;
  }
  // console.log(salaryNum + deadCap);
  var capRoom = Math.floor(salaryCap - (salaryNum + deadCap + cutPenalties));
  return capRoom;
}

function updateCapBar() {
  sumCap = addCommas(getCapRoom());
  document.getElementById("capSpaceText").innerHTML = "Cap Space: $" + addCommas(getCapRoom());
}


function countPlayers() {
  currRosterArr.sort(function(a, b){return b.salary-a.salary});
  var count = 0;
  for (let i = 0; i < currRosterArr.length; i++) {
    if (currRosterArr[i].salary != 0) {
      // console.log(currRosterArr[i].name + ": " + currRosterArr[i].salary);
      count++;
    }
  }
  return count;
}

function faNav() {
  document.getElementById("faNavCont").style.display = "block";
  if (broad) {
    document.getElementById("broadSort").style.display = "block";
  }

  document.getElementById("rosterNavCont").style.display = "none";
}

function rosterNav() {
  document.getElementById("faNavCont").style.display = "none";
  if (broad) {
    document.getElementById("broadSort").style.display = "none";
  }
  document.getElementById("rosterNavCont").style.display = "block";
}




///// Draft Pick Trading

var pickTradeOn = false;
var picksSend = [];
var picksGet = [];
var currTeam;
var currPickTrade = false;

function pickTradeScreen() {
  if (pickTradeOn === false) {
    pickTradeOn = true;
  } else {
    pickTradeOn = false;
  }
  var draftPool = document.getElementById("draftPool");
  var draftPoolCont = document.getElementById("draftPoolCont");
  var tradeButton = document.getElementById("tradeButton");
  var pickTradeTeamsCont = document.getElementById("pickTradeTeamsCont");
  if (pickTradeOn === true) {
    draftPool.style.display = "none";
    draftPoolCont.style.display = "none";
    pickTradeTeamsCont.style.display = "block";
    tradeButton.innerHTML = "BACK";
    tradeButton.style.backgroundColor = "darkred";
    generateTeams();
  } else {
    draftPool.style.display = "block";
    draftPoolCont.style.display = "block";
    pickTradeTeamsCont.style.display = "none";
    tradeButton.innerHTML = "TRADE";
    tradeButton.style.backgroundColor = "#0080ca";
    // leftOff = [leftOff[0], (leftOff[1] - 1)];
    // if (currPickTrade) {
    //   startDraft(leftOff);
    // }
  }
}

function generateTeams() {
  var root = document.getElementById("pickTradeTeamsCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  teams.sort(function(a, b) {
    var textA = a.name.toUpperCase();
    var textB = b.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});
  for (let i = 0; i < teams.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row", "text-center", "pickTeam");


    var col = document.createElement("div");
    col.classList.add("col-12");
    col.addEventListener('click', function() {
      generateTeamPicks(teams[i]);
    });

    var p = document.createElement("p");
    p.innerHTML = teams[i].name;
    p.style.marginBottom = "0px";
    p.style.padding = "5px";

    col.appendChild(p);
    row.appendChild(col);
    root.appendChild(row);
  }
}

function generateTeamPicks(team) {
  currTeam = team;
  var tempArr = [leftOff[0], leftOff[1]];
  loadPicks(tempArr);
  var root = document.getElementById("pickTradeTeamsCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  var row = document.createElement("div");
  row.classList.add("row", "text-center");

  var col1 = document.createElement("div");
  col1.classList.add("col-6");

  var col2 = document.createElement("div");
  col2.classList.add("col-6");

  var img = document.createElement("img");
  img.setAttribute("src", yourTeam.logo);
  img.classList.add("tradeLogo");

  var img2 = document.createElement("img");
  img2.setAttribute("src", team.logo);
  img2.classList.add("tradeLogo");

  col1.appendChild(img);
  col2.appendChild(img2);

  for (let k = 0; k < yourTeam.picks.length; k++) {
    var p = document.createElement("p");
    p.classList.add("teamPick");
    var round = yourTeam.picks[k][0] + 1;
    var pick = yourTeam.picks[k][1] + 1;
    p.innerHTML =  "R" + round + " P" + pick;
    p.setAttribute("id", "r" + yourTeam.picks[k][0] + "p" + yourTeam.picks[k][1])
    p.addEventListener('click', function() {
      addSend(yourTeam.picks[k]);
    });
    col1.appendChild(p);
  }
  for (let j = 0; j < team.picks.length; j++) {
    var p = document.createElement("p");
    p.classList.add("teamPick");
    var round = team.picks[j][0] + 1;
    var pick = team.picks[j][1] + 1;
    p.innerHTML =  "R" + round + " P" + pick;
    p.setAttribute("id", "r" + team.picks[j][0] + "p" + team.picks[j][1])
    p.addEventListener('click', function() {
      addGet(team.picks[j]);
    });
    col2.appendChild(p);
  }
  row.appendChild(col1);
  row.appendChild(col2);
  root.appendChild(row);
}

function addSend(pick) {
  var p = document.getElementById("r" + pick[0] + "p" + pick[1]);
  console.log(p.style.backgroundColor);

  if (p.classList.contains("checked")) {
    p.style.backgroundColor = "white";
    p.style.color = "#16366a !important";
    p.classList.remove("checked");
    const index =  picksSend.indexOf(pick);
    picksSend.splice(index, 1);
    console.log(picksSend);
  } else {
    console.log("not ok");
    p.style.backgroundColor = "#0080ca";
    p.style.color = "white !important";
    p.classList.add("checked");
    picksSend.push(pick);
    console.log(picksSend);
  }

  if (picksSend.length > 0 && picksGet.length > 0) {
    document.getElementById("pickOfferButton").style.display = "block";
  } else {
    document.getElementById("pickOfferButton").style.display = "none";
  }
}

function addGet(pick) {
  var p = document.getElementById("r" + pick[0] + "p" + pick[1]);

  if (p.classList.contains("checked")) {
    p.style.backgroundColor = "white";
    p.classList.remove("checked");
    const index =  picksGet.indexOf(pick);
    picksGet.splice(index, 1);
    console.log(picksGet);
  } else {
    console.log("not ok");
    p.style.backgroundColor = "#0080ca";
    p.classList.add("checked");
    picksGet.push(pick);
    console.log(picksGet);
  }

  if (picksSend.length > 0 && picksGet.length > 0) {
    document.getElementById("pickOfferButton").style.display = "block";
  } else {
    document.getElementById("pickOfferButton").style.display = "none";
  }
}

function pickOffer() {
  var result = evaluatePickTrade();

  if (result) {

    console.log(currPickTrade);
    for (var i = 0; i < picksSend.length; i++) {
      draftOrder[picksSend[i][0]][picksSend[i][1]] = currTeam;
      tradedAway.push("2022 Round " + (picksSend[i][0] + 1) + " (#" + (picksSend[i][1] + 1) + ")");
      // if (leftOff[0] === picksSend[i][0] && (leftOff[1] - 1) === picksSend[i][1]) {
      //   currPickTrade = true;
      // }
      if (leftOff[0] === picksSend[0][0] && leftOff[1] === picksSend[0][1] + 1) {
        console.log("hmm .... interesting");

      }
      console.log(draftOrder);
    }
    for (var i = 0; i < picksGet.length; i++) {
      draftOrder[picksGet[i][0]][picksGet[i][1]] = yourTeam;
      tradedFor.push("2022 Round " + (picksGet[i][0] + 1) + " (#" + (picksGet[i][1] + 1) + ")");
    }
    finishPickTrade("yes");
  } else {
    finishPickTrade("no");
  }
    // console.log(currPickTrade);
  console.log(draftOrder);
  picksSend = [];
  picksGet = [];
}

function finishPickTrade(hmm) {

  var root = document.getElementById("pickTradeTeamsCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  document.getElementById("pickOfferButton").style.display = "none";
  var row = document.createElement("div");
  row.classList.add("row", "text-center");
  var col = document.createElement("div");
  col.classList.add("col-12");
  var p = document.createElement("p");
  p.classList.add("pickResult");
  if (hmm === "yes") {
    p.innerHTML = "ACCEPTED";
    console.log(leftOff);
    if (leftOff[0] === picksSend[0][0] && leftOff[1] === picksSend[0][1] + 1) {
      p.innerHTML = "ACCEPTED"
      leftOff = [leftOff[0], leftOff[1] - 1];
      document.getElementById("draftCont").style.display = "none";
      document.getElementById("currPickResult").style.display = "block";
      // startDraft(leftOff);
      // pickTradeScreen();

    }
  } else {
    p.innerHTML = "REJECTED";
    console.log(picksSend);
    console.log(picksGet);
  }
  col.appendChild(p);
  row.appendChild(col);
  root.appendChild(row);
}

function tradePickContinue() {
  document.getElementById("draftCont").style.display = "block";
  document.getElementById("currPickResult").style.display = "none";
  startDraft(leftOff);
  pickTradeScreen();
}

function evaluatePickTrade() {
  var sendValue = 0;
  var getValue = 0;
  console.log("send");
  for (let i = 0; i < picksSend.length; i++) {
    var value = draftValue[picksSend[i][0]][picksSend[i][1]];
    console.log(value);
    sendValue += value;
  }
  console.log("get");
  for (let j = 0; j < picksGet.length; j++) {
    var value = draftValue[picksGet[j][0]][picksGet[j][1]];
    console.log(value);
    getValue += value;
  }
  if (sendValue >= getValue) {
    return true;
  } else {
    return false;
  }
}

function restartPressed() {
  location.reload();
}

function jetsXHomePressed() {
  window.location.href = 'http://www.jetsxfactor.com';
}
