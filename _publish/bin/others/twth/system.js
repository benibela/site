/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */


var cubes;
var detectors;
var markC, markR;
var preMarkC, preMarkR;
var blocked;

function init(){
  markR = -1;
  markC = -1;
  preMarkC = -1;
  preMarkR = -1;
  blocked = false;
  detectors = [20,10,0];
  var grid = document.getElementById("grid-holder");
  var i; var j;
  cubes = [];
  for (i=0;i<15;i++) {
    var r = [];
    for (j=0;j<15;j++)
      if (Math.random() < 0.7) r.push(1);
      else if (Math.random() < 0.7) r.push(2);
      else r.push(3);
    cubes.push(r);
  }
  var s = "<table id='grid' style='float: left; border-collapse: collapse; background-color: black;'>" + cubes.map(function(r,ri){ return "<tr>" + r.map(function(ct,ci){
    return "<td><img src='cube"+ct+".png' onclick='javascript:dig("+ri+", "+ci+","+ct+")'></td>";
  }).join("") + "</tr>" }).join("\n") + "</table>";
  s += "<table style='float:right; color:white'>"+ [1,2].map(function(ct){
    return "<tr><td><img src='cube"+ct+".png'> Current detectors: <span id='detcount"+ct+"'>"+detectors[ct-1]+"</span><br> " + 
                                               "Buy detectors: <input type='range' id='detbuy"+ct+"' value='15' max='99' min='1'> <input type='button' onclick='javascript:buy("+ct+")'> </td></tr>"
  }) + "</table>"
  grid.innerHTML = s;
   
};

function buy(ct){
  var range = document.getElementById("detbuy"+ct);
  detectors[ct-1] = Math.min(99, detectors[ct-1] * 1 + range.value * 1);
  document.getElementById("detcount"+ct).innerHTML = detectors[ct-1];
}

function getDir(dr, dc) {
  if (dr == 0) {
    if (dc < 0) return 3;
    if (dc > 0) return 1;
  }
  if (dc == 0) {
    if (dr < 0) return 0;
    if (dr > 0) return 2;
  }
  return -1;
}
function invertDir(d) {
  return ( d+ 2 ) % 4
}
function moveInDir(coord, d){
  switch (d) {
    case 0: coord.r --; break;
    case 1: coord.c ++; break;
    case 2: coord.r ++; break;
    case 3: coord.c --; break;
  }
}

function coordValid(coord) {
  return  coord && coord.r >= 0 && coord.r < 15 && coord.c >= 0 && coord.c < 15;
}

function moveTillClickable(coord, d){
  moveInDir(coord, d);
  while (coordValid(coord) && cubes[coord.r][coord.c] <= 0) 
    moveInDir(coord, d);
}

function reachable(r,c,skipd,a){
  for (var i=0;i<4;i++)
    if (i != skipd) {
      var coord = {"r": r, "c": c};
      moveTillClickable(coord, i);
      if (coordValid(coord)) {
        a[i] = coord;
      }
    }
}
function highlight(r,c,skipd,color){
  var a = [null,null,null,null];
  reachable(r, c, skipd, a);
  var ok = false;
  for (var i=0;i<a.length;i++)
    if (a[i])
      document.getElementById("grid").rows[a[i].r].cells[a[i].c].style.backgroundColor = color;
}

function dig(r,c,ct){
  if (blocked) return;
  if (detectors[ct - 1] <= 0) { alert("You do not have the necessary detectors"); return; }
  if (markR >= 0)  
    {
      var oldDir = preMarkR >= 0 ?  invertDir( getDir(markR - preMarkR, markC - preMarkC ) ) : -1;
      var a = [null,null,null,null];
      reachable(markR, markC, oldDir, a);
      var ok = false;
      for (var i=0;i<a.length;i++)
        if (a[i] && r == a[i].r && c == a[i].c) ok = true;
      if (!ok) return;
   
  }
  document.getElementById("grid").rows[r].cells[c].innerHTML = "<img src='digging.gif'>";
  detectors[ct-1] --;
  document.getElementById("detcount"+ct).innerHTML = detectors[ct-1];
  blocked = true;
  setTimeout(function(){
    blocked = false;
    highlight( markR, markC,  preMarkR >= 0 ? invertDir( getDir(markR - preMarkR, markC - preMarkC ) ) : -1, "black" ) ;
    highlight( r, c,   markR >= 0 ?  invertDir( getDir(r - markR, c - markC )) : -1 , "red" ) ;
    if (Math.random() < 0.9) reward = Math.floor(Math.random() * 7);
    else if (Math.random() < 0.99 || ct <= 1) reward = 8;
    else reward = 7;
    cubes[r][c] = -1;
    document.getElementById("grid").rows[r].cells[c].innerHTML = '<div style="background-image: url(rewards.png); background-position: '+(-34*reward)+'px 0; width: 34px; height: 33px;"></div>';
    preMarkC = markC;
    preMarkR = markR;
    markR = r;
    markC = c;
  }          ,500)
}

init();  
