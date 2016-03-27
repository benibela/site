/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */

var SIZE = 15;
var pathR = [];
var pathC = [];
var realPathLen = 0;
var bestPathR = [];
var bestPathC = [];
var nextCache = [];
var bestPathLen = 0;
var bestPathAdvancedCount = 0;
var openTiles = 0;
var steps;

function findPath(r,c,forbiddenD,advanced) {
  if (realPathLen > 80 || realPathLen > openTiles - 10) return true;
  step++;
  if (step > 1000000) return false;
  var preferredDir = [0,1,3,2,  0, 1, 3, 2];
  var depth = realPathLen;
  while (depth >= nextCache.length) nextCache.push([null,null,null,null]);
  var next = nextCache[depth];
  reachable(r,c,forbiddenD, next);
  var i;
  var j=0;
  for (j;j<preferredDir.length;j++) {
    i = preferredDir[j];
    if (i != forbiddenD && coordValid(next[i])) {
      r = next[i].r;
      c = next[i].c;
      if ((j < next.length && cubes[r][c] != 2) || cubes[r][c] >= 3) continue;
      if (realPathLen >= pathR.length) {
        pathR.push(r);
        pathC.push(c);
      } else {
        pathR[realPathLen] = r;
        pathC[realPathLen] = c;
      }
      realPathLen++;
      if (realPathLen > bestPathLen || advanced > bestPathAdvancedCount) {
        bestPathLen = realPathLen;
        bestPathAdvancedCount = advanced;
        if (bestPathLen > bestPathR.length) {
          bestPathR = new Array(bestPathLen);
          bestPathC = new Array(bestPathLen);
        }
        for (var k=0;k<bestPathLen;k++) {
          bestPathR[k] = pathR[k];
          bestPathC[k] = pathC[k];
        }
      }
      var temp = cubes[r][c];
      cubes[r][c] = -1;
      if (findPath(r,c, invertDir(i), (temp == 2 ? 1 : 0 ) + advanced )) {
        cubes[r][c] = temp;
        return true;
      }
      cubes[r][c] = temp;
      realPathLen--;
    }
  }
  return false;
}

function reallyReachable(r,c,d,temp){
  var res = 0;
  reachable(r,c,d,temp);
  for (var i=0;i<4;i++)
    if (temp[i] && temp[i].r >= 0 && cubes[temp[i].r][temp[i].c] <= 2)
      res ++;
  return res;
}

function findNow(){  
  if (markR >= 0) {
    realPathLen = 0;
    bestPathLen = 0;
    step = 0;
    findPath(markR, markC, preMarkR >= 0 ?  invertDir( getDir(markR - preMarkR, markC - preMarkC ) ) : -1, 0);
    return;
  } 
  var temp = [null,null,null,null];
  pathR = [0];
  pathC = [0];
  var temp2;
  var ok = false;
  for (var r=0;r<5;r++)
    for (var c=0;c<SIZE;c++)
      if (cubes[r][c] == 2 && reallyReachable(r,c,-1,temp) == 1) {
        realPathLen = 1;
        pathR[0] = r;
        pathC[0] = c;
        bestPathLen = 0;
        step = 0;
        temp2 = cubes[r][c];
        cubes[r][c] = -1;
        ok = findPath(r, c, -1, 0);
        cubes[r][c] = temp2;
        if (ok) return;
      }
  for (var r=0;r<5;r++)
    for (var c=0;c<SIZE;c++) 
      if (cubes[r][c] >= 1 && cubes[r][c] <= 2) {
        realPathLen = 1;
        pathR[0] = r;
        pathC[0] = c;
        bestPathLen = 0;
        step = 0;
        temp2 = cubes[r][c];
        cubes[r][c] = -1;
        ok = findPath(r, c, -1, 0);
        cubes[r][c] = temp2;
        if (ok) return;
      }
}

function aigo(){  
  var r;
  var c;
  openTiles = 0;
  var temp = [null,null,null,null];
  for (r = 0; r < SIZE; r++)
    for (c = 0; c < SIZE; c++)
      if (cubes[r][c] >= 1 && cubes[r][c] <= 2 && reachable(r,c,-1,temp) >= 2) openTiles++;
  findNow();
  
  //alert(step);
  if (bestPathLen > 0) {
    pathUsed = 0;
    //alert(bestPathR);
    ainext();
  } else alert("failed");
}

var pathUsed;
function ainext(){
  if (pathUsed >= bestPathLen) return;
  dig(bestPathR[pathUsed], bestPathC[pathUsed], cubes[bestPathR[pathUsed]][bestPathC[pathUsed]]);
  pathUsed++;
  setTimeout(ainext, 700);
}

document.getElementById("more").innerHTML = "<input type='button' onclick='javascript:aigo()' value='AI'>";  