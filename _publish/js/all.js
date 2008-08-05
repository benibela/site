var contentdiv;
var inlinePopupDiv=null;
var basePopupDiv=null;

function closeInlinePopup(){
  document.body.removeChild(inlinePopupDiv);
  document.body.removeChild(basePopupDiv);
  inlinePopupDiv=null;
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

function windowResize(){
  if (inlinePopupDiv != null) {
    inlinePopupDiv.style.left=(windowVS()/4).toString()+"px";
    inlinePopupDiv.style.top=(windowHS()/4).toString()+"px";
    inlinePopupDiv.style.width=(windowVS()/2).toString()+"px";
    inlinePopupDiv.style.height=(windowHS()/2).toString()+"px";
    if (document.compatMode == "BackCompat")  {
      inlinePopupDiv.firstChild.style.width=(windowVS()/2-12).toString()+"px";
      inlinePopupDiv.firstChild.style.height=(windowHS()/2-12).toString()+"px";
     } else {
      inlinePopupDiv.firstChild.style.width=(windowVS()/2-8).toString()+"px";
      inlinePopupDiv.firstChild.style.height=(windowHS()/2-8).toString()+"px";
    }
  }
}

function openInlinePopup(href){
  if (inlinePopupDiv!=null) closeInlinePopup();
    
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
  closediv.appendChild(document.createTextNode("schlieﬂen"));
  
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
  basediv.style.filter="Alpha(style=3, opacity=100, finishopacity=50)";
  basediv.style.zIndex=20;
  basediv.onclick=closeInlinePopup;
  
  newdiv.appendChild(newpage);//document.createTextNode(href));
  newdiv.appendChild(closediv);//document.createTextNode(href));
  var body=document.body;
  if (!body) body = document.documentElement;
  body.appendChild(basediv);
  body.appendChild(newdiv);
  inlinePopupDiv=newdiv;
  basePopupDiv=basediv;

  window.onresize=windowResize;  
  windowResize(); //set size

  newpage.src=href;
}

function pageFocus(){
  contentdiv=document.getElementById("content");
  if (!contentdiv) return;
  for(var i=0; i<contentdiv.childNodes.length; i++){
    var link = contentdiv.childNodes[i];
    if(link.nodeName=='A'){
        link.focus();
        break;
    }
  }
  for (var i=0;i<document.links.length;i++) {    
    if (document.links[i].className=="inline-popup")  
      document.links[i].href='javascript:openInlinePopup("'+document.links[i].href+'")';
  }
}  