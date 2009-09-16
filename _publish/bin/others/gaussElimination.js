//=====================Gauss elimantion by Benito van der Zander==========================
//allows to perform gauss elimination
//benito@benibela.de, www.benibela.de


//shared

function removeAllChildren(element){
  while (element.hasChildNodes()){
    var temp=element.firstChild;
    element.removeChild(temp);
  }
}

function createCustomTable(parent, maxx, maxy, elementFunction){
	removeAllChildren(parent);
    var border=2;
/*    var totalWidth=(parseInt(sizex)+parseInt(border))*maxx;
    var maxWidth=parseInt(colorMapOutput.parentNode.offsetWidth);
//    colorMapOutput.style.width="50px";
    colorMapOutput.style.width=totalWidth+"px";
    if (totalWidth<maxWidth) {
      colorMapOutput.style.marginLeft=Math.round((maxWidth-totalWidth)/2)+"px";
      colorMapOutput.parentNode.style.overflow="visible";
    } else {
      colorMapOutput.style.marginLeft="0px";
      colorMapOutput.parentNode.style.overflow="scroll";
      colorMapOutput.parentNode.style.width=maxWidth+"px";
    }*/
    
    var tab=document.createElement("table");//empty-cells:show
    parent.appendChild(tab);
    /*
    if (border!="0") {
      tab.style.borderCollapse="separate";
      tab.style.borderSpacing=border+"px";
      tab.cellSpacing=border; 
    } else tab.style.borderCollapse="collapse";
    //else  //setAttribute("style","margin-left:40px;");;
*/
    for (var y=0;y<maxy;y++){
      var line=tab.insertRow(y);
      for (var x=0;x<maxx;x++){
		var newCell = document.createElement("td");
        line.appendChild(newCell);
		var sub = elementFunction(x,y);
		if (sub==null) sub=document.createTextNode("");
		newCell.appendChild(sub);
		newCell.style.padding=border+"px"; //use padding or ie won't show border around the button likes
      }
    }
	return tab;
}

function createTextInput(size,def){
	var newEdit = document.createElement("input");
	newEdit.type="text";
	newEdit.size=size;
	if (def) newEdit.value=def;
	return newEdit;
}
/*
function createButton(def,onclick){
	var newButton = document.createElement("input");
	newButton.type="button";
	newButton.value=def;
	newButton.onclick = onclick; 
	return newButton;
}*/


//=========================Funktionsdefinition=====================================
var gaussInputs=new Array();
var gaussMultiplyInputs=new Array();
var gaussDropReceivers;

var gaussSizeXInput;
var gaussSizeYInput;
var gaussOutput;
var gaussImportExport;  
var gaussTextArea;
var gaussNewColumnChars;
var gaussNewRowChars;
  
var gaussRows;
var gaussCols;


//matrix manipulating functions
function gaussMultiplyRow(row){
	var multiplyBy=gaussMultiplyInputs[row].value;
	if (isNaN(multiplyBy)) multiplyBy=eval(multiplyBy);
	if (isNaN(multiplyBy)) {alert(gaussTxtNoNumberGiven); return;}
	for (var i=0;i<gaussCols;i++)
		gaussInputs[row][i].value=gaussInputs[row][i].value*multiplyBy;
}

function gaussAddRows(from, to, multiplyBy){
	if (isNaN(multiplyBy)) multiplyBy=eval(multiplyBy);
	if (isNaN(multiplyBy)) {alert(gaussTxtNoNumberGiven); return;}
	for (var i=0;i<gaussCols;i++)
		gaussInputs[to][i].value=gaussInputs[to][i].value*1+gaussInputs[from][i].value*multiplyBy;
}

function gaussSwapRows(a,b){
	var temp;
	for (var i=0;i<gaussCols;i++) {
		temp=gaussInputs[a][i].value;
		gaussInputs[a][i].value=gaussInputs[b][i].value;
		gaussInputs[b][i].value=temp;
	}
}

function gaussKillRowColumn(row,col,pivotRow){
	if (row==pivotRow) return;
	if (gaussInputs[pivotRow][col].value==0) {
		alert(gaussTxtWrongPivotRow);
		return;
	}
	gaussAddRows(pivotRow, row,  -gaussInputs[row][col].value/gaussInputs[pivotRow][col].value);
}

function gaussKillColumn(col,pivotRow){
	if (gaussInputs[pivotRow][col].value==0) {
		alert(gaussTxtWrongPivotRow);
		return;
	}
	for (var i=pivotRow+1;i<gaussRows;i++)
		gaussKillRowColumn(i,col,pivotRow);
}

//GUI
var gaussFloater; //div containing floating row
var gaussFloatingRow; //index of the floating row (0-based)

function gaussDragDropRow(e,row){
	if (gaussFloater!=null) {
		gaussFloater.parentNode.removeChild(gaussFloater);
		gaussFloater=null;
	}
	gaussFloatingRow=row;
	gaussFloater=document.createElement("div");
	var floaterTable=createCustomTable(gaussFloater,gaussCols+1,1, 
										function(x,y){
											if (x==0) {
												var temp=document.createElement("b"); 
												temp.appendChild(document.createTextNode(row+1));
												return temp; 
											} else return gaussInputs[row][x-1].cloneNode(true);
										});
	document.body.appendChild(gaussFloater);
	gaussFloater.style.zIndex=100;
	gaussFloater.style.position="absolute";
	gaussFloater.style.backgroundColor = "#EEEEFF";
	gaussFloater.style.opacity = "0.5";
	gaussFloater.style.filter = "alpha(opacity=50);";
	
    var posx = document.all ? window.event.clientX : e.pageX;
    var posy = document.all ? window.event.clientY : e.pageY;
	gaussFloater.style.left = (posx-gaussFloater.clientWidth-5)+"px";
	gaussFloater.style.top = (posy-Math.round(gaussFloater.clientHeight/2))+"px";
	for (var i=0;i<gaussDropReceivers.length;i++)
		gaussDropReceivers[i].style.border="2px solid blue";
	document.onmouseup=function(){
		window.setTimeout(function (){
			document.onmousemove=null;
			if (gaussFloater!=null) {
				gaussFloater.parentNode.removeChild(gaussFloater);
				gaussFloater=null;
				for (var i=0;i<gaussDropReceivers.length;i++)
					gaussDropReceivers[i].style.border="2px solid #FFFFDD";
			}},50);
		};
	document.onmousemove=function(f){ 
		if (gaussFloater) {
			var posx = document.all ? window.event.clientX : f.pageX;
			var posy = document.all ? window.event.clientY : f.pageY;
			gaussFloater.style.left = (posx-gaussFloater.clientWidth-5)+"px";
			gaussFloater.style.top = (posy-Math.round(gaussFloater.clientHeight/2))+"px";
		}
	};
}

function gaussCreateButtonLike(text,onmousedown,onmouseup){
	var temp=document.createElement("a");
	temp.appendChild(document.createTextNode(text));
	temp.style.border="2px solid blue";
	temp.style.cursor="pointer";
	temp.style.paddingLeft="3px";
	temp.style.paddingRight="3px";
	temp.onmousedown = onmousedown;
	temp.onmouseup = onmouseup;
	temp.onmouseover = function (){temp.style.backgroundColor="aqua";};
	temp.onmouseout = function (){temp.style.backgroundColor="";};
	temp.onselectstart = function(){return false;}
	return temp;
}  
  
function gaussCreateMatrix(multiply){
	if (gaussOutput==null) gaussReadInterfaceVars();
	gaussRows=gaussSizeXInput.value*1;
	gaussCols=gaussSizeYInput.value*1; //*1: str->number
	gaussMultiplyInputs=new Array(gaussRows);
	gaussInputs=new Array(gaussRows);
	for (var i=0;i<gaussRows;i++) {
		gaussInputs[i]=new Array(gaussCols);
	}
	gaussDropReceivers=new Array();
	createCustomTable(gaussOutput,gaussCols+6, gaussRows+1,
		function (x,y) {
			if (x>=1 && x <= gaussCols) {
				if (y==0) {//return document.createTextNode(x);
					var temp=gaussCreateButtonLike(x,null,function () {if (gaussFloater) gaussKillColumn(x-1, gaussFloatingRow);});
					temp.onmouseover = function (){temp.style.backgroundColor=gaussFloater?"aqua":""};
					temp.style.border="2px solid #FFFFDD";
					gaussDropReceivers.push(temp);
					return temp;
				} else if (y>=1 && y<=gaussRows) {
					gaussInputs[y-1][x-1]=createTextInput("6",""+(multiply*(x==y?1:0)));
					gaussInputs[y-1][x-1].onmouseout = function (){gaussInputs[y-1][x-1].style.backgroundColor="";};
					gaussInputs[y-1][x-1].onmouseover = function (){if (gaussFloater) gaussInputs[y-1][x-1].style.backgroundColor="aqua";};
					gaussInputs[y-1][x-1].onmouseup = function (){if (gaussFloater) gaussKillRowColumn(y-1, x-1, gaussFloatingRow);};
					return gaussInputs[y-1][x-1];
				}
			} else if (y>=1 && y <= gaussRows) {
				if (x==0) return document.createTextNode(y);
				else if (x==gaussCols+1) return gaussCreateButtonLike("<-*",function(){return false;},
					function () {
						if (gaussFloater) gaussAddRows(gaussFloatingRow, y-1, gaussMultiplyInputs[y-1].value);
						else gaussMultiplyRow(y-1);
					});
				else if (x==gaussCols+2) {
					gaussMultiplyInputs[y-1]=createTextInput("3","1");
					return gaussMultiplyInputs[y-1];
				} else if (x==gaussCols+3) 
					return gaussCreateButtonLike("move |->",
												function(e){gaussDragDropRow(e,y-1);return false;},
												function () {if (gaussFloater) gaussSwapRows(gaussFloatingRow, y-1);});
					/*var newSpan = document.createElement("span");
					newSpan.appendChild(document.createTextNode("*="text";
					newEdit.size=size;
					if (def) newEdit.value=def;
					return newEdit;
					varr temp=createButton("*",function () {gaussMultiplyRow(y-1);});*/
				else if (x==gaussCols+4) {
					var temp=gaussCreateButtonLike("+",null,function () {if (gaussFloater) gaussAddRows(gaussFloatingRow, y-1, 1);});
					temp.onmouseover = function (){temp.style.backgroundColor=gaussFloater?"aqua":""};
					temp.style.border="2px solid #FFFFDD";
					gaussDropReceivers.push(temp);
					return temp;
				} else if (x==gaussCols+5) {
					var temp=gaussCreateButtonLike("-",null,function () {if (gaussFloater) gaussAddRows(gaussFloatingRow, y-1, -1);});
					temp.onmouseover = function (){temp.style.backgroundColor=gaussFloater?"aqua":""};
					temp.style.border="2px solid #FFFFDD";
					gaussDropReceivers.push(temp);
					return temp;
				}

//				} else if (x==gaussCols+5) return createButtonLike("*",function () {gaussMultiplyRow(y-1);});
			}
			return null;
		});
  }

//imports a matrix
//use regexp to split the text in rows and each of them in cols, create a matrix and set the values
function gaussParseImport(){
	if (gaussTextArea==null) gaussReadInterfaceVars();
	var rowSplit = new RegExp("[^"+gaussNewRowChars.value+"]+["+gaussNewRowChars.value+"]","g");
	var colSplit = new RegExp("[^"+gaussNewColumnChars.value+"]+["+gaussNewColumnChars.value+"]","g");
	var number = /[0-9]+(.[0-9]+)?([eE][0-9]+)?/;
	var textRows = (gaussTextArea.value+gaussNewRowChars.value).match(rowSplit);
	if (textRows.length==0) {
		alert("no rows");
		return;
	}
	var numbers = new Array(0);
	var cols = -1;
	
	for (var i=0;i<textRows.length;i++) {
		var textCols=(textRows[i]+gaussNewColumnChars.value).match(colSplit);
		
		/*if (cols==-1) cols=textCols.length;
		else if (cols!=textCols.length) {
			alert("row "+i+" has the wrong size");
			return;
		}*/
		var newNumbers=new Array();
		//alert(textCols+ " " +textCols.length);
		for (var j=0;j<textCols.length;j++){
			var newNumber=textCols[j].match(number);
			
		//	alert(textCols[j]+" -> "+	numbers[i][j]);
			if (newNumber !=null&& newNumber.length>0 && !isNaN(1*newNumber[0]))
				newNumbers.push(newNumber[0]);
		}
		if (newNumbers.length!=0) {
			if (cols==-1) cols=newNumbers.length;
			else if (cols!=newNumbers.length){
				alert("row "+i+" has the wrong size");
				return;
			}
			numbers.push(newNumbers);
		}
	}
	gaussSizeYInput.value=cols;
	gaussSizeXInput.value=numbers.length;
	gaussCreateMatrix(0);
	
	for (var i=0;i<textRows.length;i++) 
		for (var j=0;j<cols;j++)
			gaussInputs[i][j].value=numbers[i][j];
		
}
function gaussExport(){
	if (gaussTextArea==null) gaussReadInterfaceVars();
	var res = "";
	for (var i=0; i < gaussRows;i++){
		if (i!=0) res+=";\n";
		res+=gaussInputs[i][0].value;
		for (var j=1; j < gaussCols; j++){
			res+=", "+gaussInputs[i][j].value;
		}
	}	
	gaussTextArea.value=res;
}
  /*for (var y=0;y<maxy;y++)
        for (var x=0;x<maxx;x++)
          boxes[x*maxy+y].innerHTML="&nbsp;";*/
    //var timing2 = new Date();    alert((timing2-timing));
  
  
function gaussChangeImportExport(){
	if (gaussImportExport.style.display=="none") gaussImportExport.style.display="block";
	else gaussImportExport.style.display="none";
}

function gaussReadInterfaceVars(){
  //===============Interfacezugriffsvariablen setzen====================  
  var doc=document;
    gaussSizeXInput=doc.getElementById("gaussSizeXInputID");
    gaussSizeYInput=doc.getElementById("gaussSizeYInputID");
    gaussOutput=doc.getElementById("gaussOutputID");;  
	gaussImportExport=doc.getElementById("gaussImportExportID");
	gaussTextArea=doc.getElementById("gaussTextAreaID");
	gaussNewColumnChars=doc.getElementById("gaussNewColumnCharsID");
	gaussNewRowChars=doc.getElementById("gaussNewRowCharsID");
  }
  
  
//====================Interfacevariablendefinition============================
if (window.lang) {
} else {
  var lang="de";
  if (window.location.href.search(/_en\.html/)!=-1) lang="en";
  if (window.location.href.search(/html#en/)!=-1) lang="en";
}


if (lang=="en") {
  var gaussTxtSize="Size:";  
  var gaussTxtCreateIDMatrix="id matrix";  
  var gaussTxtCreateEmptyMatrix="empty matrix";  
  var gaussTxtImportExport="import/export";  
  var gaussTxtImport="parse import";  
  var gaussTxtExport="export";  
  var gaussTxtMultiply=" multiply ";
  var gaussTxtNoNumberGiven="No number given";
  var gaussTxtWrongPivotRow="The dragged row can't be used to eliminate this column.";
  var gaussTxtDescription="<br><br><b>How to use it:</b><br><br>"+
						  'Short description: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Everything blue reacts to  the mouse. <br><br>'+
						  'Long description:<br>'+
						  '1. To multiply a row with a given value, enter this value in the box after "<-*" and click on "<-*"<br>'+
						  '2. To add/subtract rows from each other, click and hold on the "move" button  and drag the row on the "+"/"-" buttons after the row which should be modified.<br>'+
						  '3. To swap rows move, drag the row from with its "move" button on the   "move" button of the other row.<br>'+
						  '4. To eliminate a cell, drag the pivot row on the edit box of this cell.<br>'+
						  '5. To eliminate a column below a pivot row, drag the pivot row on the number above the column.<br>';
  var gaussTxtParsingOptions="<b>Parsing options:</b>";
  var gaussTxtNewColumnChars="New column characters:";
  var gaussTxtNewRowChars="New row characters:";
} else  {
  var gaussTxtSize="Gr��e:";  
  var gaussTxtCreateIDMatrix="Einheitsmatrix";  
  var gaussTxtCreateEmptyMatrix="Leere Matrix";  
  var gaussTxtImportExport="Import/Export";  
  var gaussTxtImport="import";  
  var gaussTxtExport="export";  
  var gaussTxtMultiply=" multipliziere ";
  var gaussTxtNoNumberGiven="Keine Zahl gegeben";
  var gaussTxtWrongPivotRow="Die gezogene Matrixzeile kann die ausgew�hlte Spalte nicht eliminieren.";
  var gaussTxtDescription="<br><br><b>Anleitung:</b><br><br>"+
						  'Zusammenfassung: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alles Blaue  reagiert auf die Maus. <br><br>'+
						  'Ausf�hrlich:<br>'+
						  '1. Um eine Zeile mit einer Zahl zu multiplizieren, gebe diese Zahl in die Box nach dem "<-*" ein und klicke auf "<-*"<br>'+
						  '2. Um eine Zeile zu einer anderen zu addieren oder davon abzuziehen, schiebe die Zeile ausgehend von dem "move"-Button auf das +/- Symbole hinter der zu modifizierenden Zeile.<br>'+
						  '3. Um Zeilen zu tauschen, schiebe eine Zeile auf den "move"-Button der jeweils anderen.<br>'+
						  '4. Um eine Matrixzelle  zu eliminieren, schiebe eine Pivotzeile auf das dazugeh�rige Editfeld.<br>'+
						  '5. Um eine Matrixspalte unter einer Pivotzeile zu eliminieren, schiebe diese Zeile auf die Zahl �ber der Spalte.<br>';
  var gaussTxtParsingOptions="<b>Importoptionen:</b>";
  var gaussTxtNewColumnChars="Zeichen f�r neue Spalte:";
  var gaussTxtNewRowChars="Zeichen f�r neue Zeile:";
}

//====================Interfaceerzeugung======================================

/*
function openNewWindow(){
  var fenster=window.open("", "_blank");//, "scrollbars");
  fenster.document.writeln("<html><head><title>")
  if (lang=="en") fenster.document.writeln("color pattern generator - BeniBela online");
  else fenster.document.writeln("Farbmustergenerator - BeniBela online");
  fenster.document.writeln('</title><script type="text/javascript">var lang="'+lang+'";var functionOnly=true;</script>');
  fenster.document.writeln('</head><body>');
  createInterface(fenster);
  fenster.document.writeln('<script type="text/javascript" src="bin/others/colorMap.js"></script>');
  fenster.document.writeln('</body></html>');
//  if (navigator.userAgent.search(/MSIE/)==-1)
  fenster.document.close(); //n�tig f�r FireFox, l�sst aber IE abst�rzen 
}*/


function createInterface(intfWin){
  var doc=intfWin.document;

  doc.write('<div id="GaussBaseDiv" >');
  doc.write('<b>'+gaussTxtSize+'</b>: <input type="text" id="gaussSizeXInputID" value="3" size="5"><input type="text" id="gaussSizeYInputID" value="3" size="5">');
  doc.write('<button onclick="javascript:gaussCreateMatrix(1);" type="button">'+gaussTxtCreateIDMatrix+'</button> ');
  doc.write('<button onclick="javascript:gaussCreateMatrix(0);" type="button">'+gaussTxtCreateEmptyMatrix+'</button> ');
  doc.write('<button onclick="javascript:gaussChangeImportExport();" type="button">'+gaussTxtImportExport+'</button>&nbsp;&nbsp;&nbsp;');

  if (doc==document && window.location.href.search(/www\.benibela\.de\/others/)!=-1) 
    doc.write('<button onclick="javascript:openNewWindow();" type="button">'+colorMapTxtCreateWindow+'</button>');
   else if (window.location.href.search(/www\.benibela\.de/)==-1) 
      doc.write('by <a href="http://www.benibela.de">Benito van der Zander</a>');

  doc.write('<br><br>');
  doc.write('<div><div id="gaussImportExportID" style="display:none">');
  doc.write('<textarea rows="15" cols="80" id="gaussTextAreaID"></textarea><br>');
  doc.write('<button onclick="javascript:gaussExport();" type="button">'+gaussTxtExport+'</button> '); 
  doc.write(gaussTxtParsingOptions+" "+gaussTxtNewColumnChars+' <input type="text" id="gaussNewColumnCharsID" value=", |\\t" size="5"/> '); 
  doc.write(gaussTxtNewRowChars+' <input type="text" id="gaussNewRowCharsID" value="\\n\\r;" size="5"/> '); 
  doc.write('<button onclick="javascript:gaussParseImport();" type="button">'+gaussTxtImport+'</button>'); 
  gaussExport
  doc.write('<br><br></div>');
  
  
  doc.write('<div id="gaussOutputID">');
  doc.write('<table id="gaussouttab">');
  doc.write('<tr><td>&nbsp;</td></tr>');
  doc.write('</table>');
  doc.write('</div></div>');

  doc.write(gaussTxtDescription);
  
  doc.write('</div>');

  gaussCreateMatrix(1)
  
/*if (window.colorMapStandAlone==true){
  doc.write('<\/script></body></html>');
  doc.close();
}*/
  
}

  
if (window.functionOnly) ;
else createInterface(window);
  
  