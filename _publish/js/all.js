var contentdiv;
var inlinePopupDiv=null;
var inlinePopupLinks=0;
var basePopupDiv=null;
var popupAnimation = null;
var popupProgress =0;
var inlinePopupNr=0;
var inlinePopupDestWidth=0;
var inlinePopupDestHeight=0;

function closeInlinePopupNOW(){
  document.body.removeChild(inlinePopupDiv);
  document.body.removeChild(basePopupDiv);
  inlinePopupDiv=null;
  window.clearInterval(popupAnimation);
  popupAnimation=null;
  document.getElementById("inlinePopup"+inlinePopupNr.toString()).style.color="";
  document.getElementById("inlinePopup"+inlinePopupNr.toString()).style.fontSize="100%";
  document.getElementById("inlinePopup"+inlinePopupNr.toString()).focus();
}
function closeInlinePopup(){
  basePopupDiv.onclick=null;
  if (popupAnimation!=null) window.clearInterval(popupAnimation);
  popupAnimation = window.setInterval("InlinePopupClosing()", 100);
}

function windowHS(){
  if (window.innerHeight) return window.innerHeight;
  if (document.body.clientHeight) return document.body.clientHeight;
  if (document.documentClient.clientHeight) return document.body.clientHeight;
  return 0;
}
function windowVS(){
  if (window.innerWidth) return window.innerWidth;
  if (document.body.clientWidth) return document.body.clientWidth;
  if (document.documentClient.clientWidth) return document.body.clientWidth;
  return 0;
}

function inlinePopupLeft(){
    return (windowVS()-inlinePopupWidth())*popupProgress / 200;
}
function inlinePopupTop(){
    return (windowHS()-inlinePopupHeight())*popupProgress / 200;
}
function inlinePopupWidth(){
    var size = windowVS();
    if (inlinePopupDestWidth==0) size = size*popupProgress/100/2;
    else size = Math.min(inlinePopupDestWidth, size-10)*popupProgress/100;
    return Math.max(12,size);
}
function inlinePopupHeight(){
    var size = windowHS();
    if (inlinePopupDestHeight==0) size = size*popupProgress/100/2;
    else size = Math.min(inlinePopupDestHeight, size-40)*popupProgress/100;
    return Math.max(12,size);
}

function windowResize(){
  if (inlinePopupDiv != null) {
    inlinePopupDiv.style.left=inlinePopupLeft().toString()+"px";
    inlinePopupDiv.style.top=inlinePopupTop().toString()+"px";
    inlinePopupDiv.style.width=inlinePopupWidth().toString()+"px";
    inlinePopupDiv.style.height=inlinePopupHeight().toString()+"px";
    if (document.compatMode == "BackCompat")  {
      inlinePopupDiv.firstChild.style.width=(inlinePopupWidth()-12).toString()+"px";
      inlinePopupDiv.firstChild.style.height=(inlinePopupHeight()-12).toString()+"px";
     } else {
      inlinePopupDiv.firstChild.style.width=(inlinePopupWidth()-8).toString()+"px";
      inlinePopupDiv.firstChild.style.height=(inlinePopupHeight()-8).toString()+"px";
    }
  }
}

function InlinePopupOpening(){
  if (inlinePopupDiv != null) {
    popupProgress +=5;
    
    windowResize();
    
    if (popupProgress>=100)  {
      window.clearInterval(popupAnimation);
      popupAnimation=null;
    }
  } else {
    window.clearInterval(popupAnimation);
    popupAnimation=null;
  }
}
function InlinePopupClosing(){
  if (inlinePopupDiv != null) {
    popupProgress -=7;
    
    windowResize();
    
    if (popupProgress<=0) 
      closeInlinePopupNOW();
  } else { 
    window.clearInterval(popupAnimation);
    popupAnimation=null;
  }
}

function openInlinePopup(destWidth, destHeight, href,idnr){
  if (inlinePopupDiv!=null) closeInlinePopupNOW();
    
  inlinePopupDestWidth = destWidth;
  inlinePopupDestHeight = destHeight;

  var newpage = document.createElement("iframe");
  newpage.style.border="2px solid blue";
  newpage.style.position="relative";
  newpage.style.left="2px";
  newpage.style.top="2px";
              
  var closediv = document.createElement("a");
  closediv.style.fontWeight="bold";
  closediv.style.position="absolute";
  closediv.style.right="2em";
  closediv.style.bottom="-1em";
  closediv.style.marginBottom="-5px";
  closediv.style.border="1px solid blue";
  closediv.style.color="red";
  closediv.style.backgroundColor="#FFFFFF";
  closediv.href="javascript:closeInlinePopup()";
  closediv.appendChild(document.createTextNode("schließen"));
  
  var classicdiv = document.createElement("a");
  //classicdiv.style.fontWeight="bold";
  classicdiv.style.position="absolute";
  classicdiv.style.left="2em";
  classicdiv.style.bottom="-1em";
  classicdiv.style.marginBottom="-5px";
  classicdiv.style.border="1px solid blue";
  classicdiv.style.color="red";
  classicdiv.style.backgroundColor="#FFFFFF";
  classicdiv.href=href;
  classicdiv.appendChild(document.createTextNode("vergrößern"));
  
  
  var newdiv = document.createElement("div");
  newdiv.style.overflow="visible";
  newdiv.style.position="absolute";
  newdiv.style.border="2px solid blue";
  newdiv.style.backgroundColor="#FFFFCC";
  newdiv.style.zIndex=30;
  newdiv.style.opacity="1.0";
  
  var basediv = document.createElement("div");
  basediv.style.position="absolute";
  basediv.style.left="0";
  basediv.style.top="0";
  basediv.style.width="100%";
  basediv.style.height="100%";
  basediv.style.backgroundColor="#DDDDDD";
  basediv.style.opacity="0.80";
  basediv.style.filter="Alpha(style=3, opacity=30, finishopacity=100)";
  basediv.style.zIndex=20;
  basediv.onclick=closeInlinePopup;
  
  newdiv.appendChild(newpage);//document.createTextNode(href));
  newdiv.appendChild(closediv);//document.createTextNode(href));
  newdiv.appendChild(classicdiv);//document.createTextNode(href));
  var body=document.body;
  if (!body) body = document.documentElement;
  body.appendChild(basediv);
  body.appendChild(newdiv);
  inlinePopupDiv=newdiv;
  basePopupDiv=basediv;
  
  
  window.onresize=windowResize;  
  popupProgress=0;
  windowResize(); //set size
  popupAnimation = window.setInterval("InlinePopupOpening()", 100);

  newpage.src=href;

  inlinePopupNr=idnr;
  document.getElementById("inlinePopup"+idnr.toString()).style.color="red";
  document.getElementById("inlinePopup"+idnr.toString()).style.fontSize="200%";

}

function pageFocus(){
  contentdiv=document.getElementById("content");
  if (!contentdiv) return;
  if (window.location.href.indexOf("#") <= -1) 
    for(var i=0; i<contentdiv.childNodes.length; i++){
      var link = contentdiv.childNodes[i];
      if(link.nodeName=='A'){
          link.focus();
          break;
      }  
    }
  for (var i=0;i<document.links.length;i++) {    
    if (document.links[i].className=="inline-popup")  {
      inlinePopupLinks+=1;
      document.links[i].href='javascript:openInlinePopup(0,0,"'+document.links[i].href+'",'+inlinePopupLinks.toString()+')';
      document.links[i].id="inlinePopup"+inlinePopupLinks.toString();
    } else if (document.links[i].className=="inline-popup-large")  {
      inlinePopupLinks+=1;
      document.links[i].href='javascript:openInlinePopup(640,700,"'+document.links[i].href+'",'+inlinePopupLinks.toString()+')';
      document.links[i].id="inlinePopup"+inlinePopupLinks.toString();
    }

  }
}  


var lang="de"; //needed for guestbook
if (window.location.href.search(/lang=en/)!=-1) lang="en";
if (window.location.href.search(/_en/)!=-1) lang="en";

 