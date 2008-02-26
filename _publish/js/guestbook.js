function boldClicked(){
  var box=getObject('entryBox');
  var button=getObject('boldBtn');
  if (button.value=="b") {
    box.value+="[b]";
    button.value="/b";
  } else {
    box.value+="[/b]";
    button.value="b";
  }
  box.focus();
}
function italicClicked(){
  var box=getObject('entryBox');
  var button=getObject('italicBtn');
  if (button.value=="i") {
    box.value+="[i]";
    button.value="/i";
  } else {
    box.value+="[/i]";
    button.value="i";
  }
  box.focus();
}
function underlinedClicked(){
  var box=getObject('entryBox');
  var button=getObject('underlineBtn');
  if (button.value=="u") {
    box.value+="[u]";
    button.value="/u";
  } else {
    box.value+="[/u]";
    button.value="u";
  }
  box.focus();
}
function httpClicked(){
  var box=getObject('entryBox');
//  var button=getObject('Btn');
  if (lang=="de") {
    var site=prompt("Bitte geben sie die Adresse der Seite ein","http://");
    var sitetitle=prompt("Bitte geben sie den Titel der Seite ein","");
  } else {
    var site=prompt("Please input the URL of your homepage","http://");
    var sitetitle=prompt("Please input the title of your homepage","");
  }
  box.value+='<a href="'+site+'">'+sitetitle+'</a>';
  box.focus();
}
function mailClicked(){
  var box=getObject('entryBox');
  if (lang=="de") {
    var mail=prompt("Bitte geben sie Ihre Mailadresse ein","");
  } else {
    var mail=prompt("Please input your mail addy","");
  }
  box.value+='<a href="mailto:'+mail+'">'+mail+'</a>';
  box.focus();
}
function imgClicked(){
  var box=getObject('entryBox');
  if (lang=="de") {
    var img=prompt("Bitte geben sie die Adresse des Bildes ein","http://");
  } else {
    var img=prompt("Please input the URL of the image","http://");
  }
  box.value+='<img src="'+img+'">';
  box.focus();
}