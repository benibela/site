//=====================Vereinheitlichen des Ansprenchens von Eigenschaften =================
if  (document.getElementById) {
  var  teil1='document.getElementById("';
  var teil2='")';
} else {
  if (document.all){
    var  teil1='document.all["';
    var teil2='"]';
  } else {
    var  teil1='document["';
    var  teil2='"]';
  }
}

//==============================Informatonen über die Seite ermitteln=======================
function getHeight()
{
 if (window.innerHeight) return window.innerHeight;
 else if (document.body && document.body.offsetHeight) return document.body.offsetHeight;
 else return 0;
}

//================================Lesen und setzten von Eigenschaften =====================
function getObject(obj){
  return eval(teil1+obj+teil2);
}



var lang="de";
if (window.location.href.search(/lang=en/)!=-1) lang="en";
if (window.location.href.search(/_en/)!=-1) lang="en";
   