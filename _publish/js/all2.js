
function clickOnUntranslated(event){
  alert("ja");
}

if (getObject("newslist")) {
  var list = getObject("newslist");
  var current = list.firstChild;
  var foundUntranslated=false;
  while (current) {
    if (current.nodeName=="H3") {
      if ((current.childNodes.length>=2) && (current.childNodes[1].getAttribute("class")=="untranslated"))  {
        foundUntranslated=true;
        current.childNodes[1].addEventListener("click", clickOnUntranslated, false);
      }
    } else if (current.nodeName=="P" && foundUntranslated) {
      current.style.display="none";
      foundUntranslated=false;
    }
    current = current.nextSibling;
  }
}