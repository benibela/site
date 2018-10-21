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

function createElement(name, props){
  var e = document.createElement(name);
  for (var p in props) e[p] = props[p];
  return e;
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

function isBrowserIE(){
  var ua = window.navigator.userAgent;
  return (ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1) ? true : false;
}

function pageFocus(){
  contentdiv=document.getElementById("content");
  if (!contentdiv) return;
  if (window.location.href.indexOf("#") <= -1 && document.getElementsByName) {
    var t = document.getElementsByName("top");
    if (t && t[0]) t[0].focus(); //need to focus on something on the scrollable div, so keyboard scrolling works 
  }
  var isIE = isBrowserIE();
  
  for (var i=0;i<document.links.length;i++) {
    var link = document.links[i];
    if (link.className=="inline-popup")  {
      inlinePopupLinks+=1;
      link.href='javascript:openInlinePopup(0,0,"'+link.href+'",'+inlinePopupLinks.toString()+')';
      link.id="inlinePopup"+inlinePopupLinks.toString();
    } else if (link.className=="inline-popup-large")  {
      inlinePopupLinks+=1;
      link.href='javascript:openInlinePopup(640,700,"'+link.href+'",'+inlinePopupLinks.toString()+')';
      link.id="inlinePopup"+inlinePopupLinks.toString();
    } 
    if (isIE) 
      link.onclick = function() { setTimeout(function(){document.body.scrollTop = 0;}, 10); }
  }
  if (isIE) document.body.scrollTop = 0;
}  

function togglenavigation(){
  var menu = document.getElementById("menu");

  if (menu.style.display == "block") {
    menu.style.display = "none";
    
  } else {
    menu.style.display = "block";
  }
  document.getElementById("border_navi_top").style.display = menu.style.display;
}

function checkmovedids(ids){
  for (var i=0;i<ids.length;i++) 
    if ("#" + ids[i].id == location.hash) {
      location = ids[i].to + "_" + lang + ".html"+location.hash;
      return;
    }
}

var lang="de"; //needed for guestbook
if (window.location.href.search(/lang=en/)!=-1) lang="en";
if (window.location.href.search(/_en/)!=-1) lang="en";

function insertAfter(parent, child, after){
  if (after == parent.lastChild || !after) parent.appendChild(child);
  else parent.insertBefore(child, after.nextSibling);
}

var shared = false;
//var hascenterstyle = false;
function jsinit(){
  pageFocus();
  //make share/discuss links
  function makelinks(parent, target, previous, center){
    var box = document.createElement("div");
    var link = createElement("a", {"textContent": lang == "de" ? "kommentieren" : "discuss", "href": "#"});
    var slash = document.createTextNode(" / ");
    var linkshare = createElement("a", {"textContent": lang == "de" ? "teilen" : "share", "href": "#"});
    function openBox(clicked, insert){
      clicked.style.display = "none";
      if (slash.parentNode) slash.parentNode.removeChild(slash);
      var after = box;
      while (after.nextElementSibling && after.nextElementSibling.tagName == "BR") after = after.nextElementSibling;
      insertAfter(parent, insert, after);
    }
    link.onclick = function(){
      var iframe = createElement("iframe", {
        "onload": function () {iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";},
        "src": (window.location.href.search(/benibela\.de/) != -1 ? "" : "http://benibela.de") + "/koobtseug_api.php?lang="+lang+"&thread=" + target.id
      });
      iframe.style.width = "100%";
      iframe.style.maxHeight = "30em";
      openBox(link,iframe);
    }
    linkshare.onclick = function(){
      var temp = document.createElement("div");
      temp.style.width = "100%";
      temp.style.maxHeight = "30em";
      var url;
      var headLinks = document.getElementsByTagName("link");
      for (var i=0;i<headLinks.length;i++) if (headLinks[i].rel == "canonical") url = headLinks[i].href;
      if (!url) url = location.href.toString();
      url = url.replace( /#.*$/,"");
      url += "#" + target.id;
      var title = (target.textContent != "\xA0" ? target : target.nextSibling ).textContent + " - " + (document.title.toString().replace( /-? *https?:.*$/, "") );
      temp.innerHTML = '<div class="shariff" data-lang="'+lang+'" data-url="'+url+'" data-title="'+title+'"  data-services=\'["twitter", "facebook", "googleplus", "linkedin", "pinterest", "xing", "whatsapp",  "addthis", "tumblr",  "diaspora", "reddit", "stumbleupon", "threema", "weibo", "tencent-weibo", "qzone"]\'></div>';
      //    [&quot;addthis&quot;,&quot;whatsapp&quot;,&quot;facebook&quot;,&quot;xing&quot;,&quot;pinterest&quot;,&quot;linkedin&quot;,&quot;tumblr&quot;,&quot;flattr&quot;,&quot;diaspora&quot;,&quot;reddit&quot;,&quot;stumbleupon&quot;,&quot;threema&quot;]
      openBox(linkshare,temp);
      if (!shared) {
        shared = true;
        document.head.appendChild(createElement("link", {"href": "/css/shariff.complete.css", "rel": "stylesheet" }));
        document.body.appendChild(createElement("script", {"src": "/js/shariff.complete.js"}));
      } else temp.firstChild.shariff = new Shariff(temp.firstChild );
    }
    box.appendChild(link); box.appendChild(slash); box.appendChild(linkshare); 
    insertAfter(parent, box, previous);
    if (center) {
      /*if (!hascenterstyle) {
        hascenterstyle = true;
        var as = parent.getElementsByClassName("uplink");
        var rightfloat = 0;
        if (as.length) rightfloat = as[as.length - 1].clientWidth;
        document.head.appendChild(createElement("style", {"textContent": (
          ".socialboxcenter { float: right; margin-right: "+Math.floor(parent.clientWidth / 2 -  box.clientWidth - rightfloat) + "px }")
        }));
      }*/
      box.className = "socialbox socialboxcenter";
    } else box.className = "socialbox";
  }
  
  var newsdiv=document.getElementById("newslist");
  if (newsdiv) {
    var news = newsdiv.getElementsByTagName("h3");
    var lastnew = null;
    for (var i=0;i<news.length;i++) {
      if (lastnew) makelinks(newsdiv, lastnew, news[i].previousSibling);
      lastnew = news[i];
    }
    if (lastnew) makelinks(newsdiv, lastnew, newsdiv.lastChild)
  }
  if(!document.getElementsByClassName && document.querySelectorAll) {
      document.getElementsByClassName = function(className) {
          return this.querySelectorAll("." + className);
      };
      Element.prototype.getElementsByClassName = document.getElementsByClassName;
  }
  if (document.getElementsByClassName) {
    var entry = document.getElementsByClassName("long_desc_entry");
    for (var i=0;i<entry.length;i++) {
      var desc = entry[i].getElementsByClassName("long_desc_desc")[0];
      nobr = desc.lastElementChild;
      while (nobr.tagName == "BR") nobr = nobr.previousElementSibling;
      makelinks(desc, entry[i].getElementsByTagName("a")[0], nobr, true)//float: right;    margin-right: 206px;
    }
  }
}