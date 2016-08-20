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
    
    var tab=document.createElement("table");//empty-cells:show
    parent.appendChild(tab);

    for (var y=0;y<maxy;y++){
      var line=tab.insertRow(y);
      for (var x=0;x<maxx;x++){
		var newCell = document.createElement("td");
        line.appendChild(newCell);
		var sub = elementFunction(x,y);
		if (sub==null) sub=document.createTextNode("");
		newCell.appendChild(sub);
		//styles 
		newCell.style.padding=border+"px"; //use padding or ie won't show border around the button likes
		newCell.style.textAlign="center";
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


//=========================Funktionsdefinition=====================================
var gaussInputs=new Array();
var gaussInverseInputs=new Array();
var gaussMultiplyInputs=new Array();
var gaussDropReceivers; //moving row
var gaussDropReceivers2; //moving column

var gaussSizeXInput;
var gaussSizeYInput;
var gaussOutput;
var gaussImportExport;  
var gaussChangeLog;
var gaussLog;
var gaussLogTextArea;
var gaussChangeInverse;
var gaussInverseOutput;
var gaussTextArea;
var gaussNewColumnChars;
var gaussNewRowChars;
  
var gaussRows;
var gaussCols;


//matrix manipulating functions
function gaussMatMultiplyRow(mat, row, multiplyBy){
	for (var i=0;i<mat[0].length;i++)
		mat[row][i].value=mat[row][i].value*multiplyBy;
}
function gaussMatMultiplyCol(mat, col, multiplyBy){
	for (var i=0;i<mat.length;i++)
		mat[i][col].value=mat[i][col].value*multiplyBy;
}

function gaussMatAddRows(mat, from, to, multiplyBy){ 
	for (var i=0;i<mat[0].length;i++)
		mat[to][i].value=mat[to][i].value*1+mat[from][i].value*multiplyBy;
}
function gaussMatAddCols(mat, from, to, multiplyBy){ 
	for (var i=0;i<mat.length;i++)
		mat[i][to].value=mat[i][to].value*1+mat[i][from].value*multiplyBy;
}

function gaussMatSwapRows(mat,a,b){ 
	var temp;
	for (var i=0;i<mat[0].length;i++) {
		temp=mat[a][i].value;
		mat[a][i].value=mat[b][i].value;
		mat[b][i].value=temp;
	}
}

function gaussMatSwapCols(mat,a,b){ 
	var temp;
	for (var i=0;i<mat.length;i++) {
		temp=mat[i][a].value;
		mat[i][a].value=mat[i][b].value;
		mat[i][b].value=temp;
	}
}

//extended gauss functions
function gaussMultiplyRow(row){ //elementary
	var multiplyBy=gaussMultiplyInputs[row].value;
	if (isNaN(multiplyBy)) multiplyBy=eval(multiplyBy);
	if (isNaN(multiplyBy)) {alert(gaussTxtNoNumberGiven); return;}
	if (multiplyBy == 0) 
		if (!confirm(gaussTxtReallyRemove))
			return;
	gaussMatMultiplyRow(gaussInputs, row, multiplyBy);
	if (gaussChangeInverse.checked)
		gaussMatMultiplyCol(gaussInverseInputs, row, 1/multiplyBy);
}

function gaussAddRows(from, to, multiplyBy){ //elementary
	if (isNaN(multiplyBy)) multiplyBy=eval(multiplyBy);
	if (isNaN(multiplyBy)) {alert(gaussTxtNoNumberGiven); return;}
	if (from==to && multiplyBy == -1) 
		if (!confirm(gaussTxtReallyRemove))
			return;

	gaussMatAddRows(gaussInputs, from, to, multiplyBy);
	if (gaussChangeInverse.checked)
		gaussMatAddCols(gaussInverseInputs, to, from, -multiplyBy);
}

function gaussSwapRows(a,b){ //elementary
	gaussMatSwapRows(gaussInputs,a,b);
	if (gaussChangeInverse.checked)
		gaussMatSwapCols(gaussInverseInputs,a,b);
}

function gaussSwapCols(a,b){ //elementary
	gaussMatSwapCols(gaussInputs,a,b);
	if (gaussChangeInverse.checked)
		gaussMatSwapRows(gaussInverseInputs,a,b);
}

function gaussKillRowColumn(row,col,pivotRow){ //not-elementary
	if (row==pivotRow) return;
	if (gaussInputs[pivotRow][col].value==0) {
		alert(gaussTxtWrongPivotRow);
		return;
	}
	//gaussAddRows(pivotRow, row,  -gaussInputs[row][col].value/gaussInputs[pivotRow][col].value);
	//describe what we are doing
	gaussAddRowsLog(pivotRow, row,  -gaussInputs[row][col].value/gaussInputs[pivotRow][col].value);
}

function gaussKillColumn(col,pivotRow){//not-elementary
	if (gaussInputs[pivotRow][col].value==0) {
		alert(gaussTxtWrongPivotRow);
		return;
	}
	for (var i=pivotRow+1;i<gaussRows;i++)
		gaussKillRowColumn(i,col,pivotRow);
}

//operations with logging
function gaussAddToLog(value){
	gaussLogTextArea.value=gaussLogTextArea.value+"\n"+value+"\n";
	gaussLogTextArea.scrollTop = gaussLogTextArea.scrollHeight;
}
function gaussLogOperation(desc){
	if (!gaussChangeLog.checked) return;
	gaussExport();
	gaussAddToLog(desc+"\n\n"+gaussTextArea.value);
}

function gaussMultiplyRowLog(row){
	gaussMultiplyRow(row);
	gaussLogOperation(gaussTxtLogMultiplyBy.replace("%1",row+1).replace("%2",gaussMultiplyInputs[row].value));
}

function gaussAddRowsLog(from, to, multiplyBy){
	gaussAddRows(from,to,multiplyBy);
	gaussLogOperation(gaussTxtLogAddRows.replace("%1",from+1).replace("%2",to+1).replace("%3",multiplyBy));
}


function gaussSwapRowsLog(a,b){
	gaussSwapRows(a,b);
	gaussLogOperation(gaussTxtLogSwapRows.replace("%1",a+1).replace("%2",b+1));
}

function gaussSwapColsLog(a,b){
	gaussSwapCols(a,b);
	gaussLogOperation(gaussTxtLogSwapCols.replace("%1",a+1).replace("%2",b+1));
}

function gaussKillRowColumnLog(row,col,pivotRow){
	gaussAddToLog(gaussTxtLogKillRowColumn.replace("%1",row+1).replace("%2",col+1).replace("%3",pivotRow+1)+"\n");
	gaussLogTextArea.scrollTop = gaussLogTextArea.scrollHeight;
	gaussKillRowColumn(row,col,pivotRow);
	//gaussLogOperation(gaussTxtLogKillRowColumn.replace("%1",row+1).replace("%2",col+1).replace("%3",pivotRow+1));
}

function gaussKillColumnLog(col,pivotRow){
	gaussAddToLog(gaussTxtLogKillColumn.replace("%1",col+1).replace("%2",pivotRow+1)+"\n");
	gaussKillColumn(col,pivotRow);
	//gaussLogOperation(gaussTxtLogKillColumn.replace("%1",col+1).replace("%2",pivotRow+1));
}


//GUI
var gaussFloater; //div containing floating row
var gaussFloatingRow; //index of the floating row (0-based)
var gaussFloatingCol; //index of the floating row (0-based)

function gaussDragDrop(e, newFloater, dx, dy){
	if (gaussFloater!=null) {
		gaussFloater.parentNode.removeChild(gaussFloater);
		gaussFloater=null;
	}

	gaussFloater=newFloater;
	gaussFloater.style.zIndex=100;
	gaussFloater.style.backgroundColor = "#EEEEFF";
	gaussFloater.style.opacity = "0.5";
	gaussFloater.style.filter = "alpha(opacity=50);";
	
    var posx = document.all ? window.event.clientX : e.pageX;
    var posy = document.all ? window.event.clientY : e.pageY;
	gaussFloater.style.left = (posx+dx)+"px";
	gaussFloater.style.top = (posy+dy)+"px";

	document.onmouseup=function(){
		document.onselectstart=null;
		window.setTimeout(function (){
			document.onmousemove=null;
			if (gaussFloater!=null) {
				gaussFloater.parentNode.removeChild(gaussFloater);
				gaussFloater=null;
				for (var i=0;i<gaussDropReceivers.length;i++)
					gaussDropReceivers[i].style.border="2px solid #FFFFDD";
				for (var i=0;i<gaussDropReceivers2.length;i++)
					gaussDropReceivers2[i].style.border="2px solid #FFFFDD";
			}},50);
		};
	document.onmousemove=function(f){ 
		if (gaussFloater) {
			var posx = document.all ? window.event.clientX : f.pageX;
			var posy = document.all ? window.event.clientY : f.pageY;
			gaussFloater.style.left = (posx+dx)+"px";
			gaussFloater.style.top = (posy+dy)+"px";
		}
	};
}

function gaussDragDropRow(e,row){
	gaussFloatingRow=row;
	gaussFloatingCol=-1;
	for (var i=0;i<gaussDropReceivers.length;i++)
		gaussDropReceivers[i].style.border="2px solid blue";
	
	var newFloater=document.createElement("div");
	newFloater.style.position="absolute";
	var floaterTable=createCustomTable(newFloater,gaussCols+1,1, 
										function(x,y){
											if (x==0) {
												var temp=document.createElement("b"); 
												temp.appendChild(document.createTextNode(row+1));
												return temp; 
											} else return gaussInputs[row][x-1].cloneNode(true);
										});
	document.body.appendChild(newFloater);
	var dx=0-newFloater.clientWidth-5;
	var dy=0-Math.round(newFloater.clientHeight/2);
	gaussDragDrop(e,newFloater,dx,dy);
}

function gaussDragDropCol(e,col){
	gaussFloatingRow=-1;
	gaussFloatingCol=col;
	for (var i=0;i<gaussDropReceivers2.length;i++)
		gaussDropReceivers2[i].style.border="2px solid blue";
	
	var newFloater=document.createElement("div");
	newFloater.style.position="absolute";
	var floaterTable=createCustomTable(newFloater,1,gaussRows+1, 
										function(x,y){
											if (y==0) {
												var temp=document.createElement("b"); 
												temp.appendChild(document.createTextNode(col+1));
												return temp; 
											} else return gaussInputs[y-1][col].cloneNode(true);
										});
	document.body.appendChild(newFloater);
	var dx=0-Math.round(newFloater.clientWidth/2);-5;
	var dy=0-newFloater.clientHeight;
	gaussDragDrop(e,newFloater,dx,dy);
}

function gaussCreateButtonLike(text,onmousedown,onmouseup){
	var temp=document.createElement("a");
	temp.appendChild(document.createTextNode(text));
	temp.style.border="2px solid blue";
	temp.style.cursor="pointer";
	temp.style.paddingLeft="3px";
	temp.style.paddingRight="3px";
	if (document.all){ //internet explorer
	//document.onselectstart = function(){return false;}
		temp.onmousedown = function(){document.onselectstart=function(){return false}; if (onmousedown) onmousedown();};
		temp.onmouseup =  function(){document.onselectstart=null; if (onmouseup) onmouseup();};
	} else {
		temp.onmousedown = onmousedown;
		temp.onmouseup = onmouseup;
	}
	temp.onmouseover = function (){temp.style.backgroundColor="aqua";};
	temp.onmouseout = function (){temp.style.backgroundColor="";};
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
	gaussDropReceivers2=new Array();
	createCustomTable(gaussOutput,gaussCols+6, gaussRows+3,
		function (x,y) {
			if (x>=1 && x <= gaussCols) {
				if (y==0) {//return document.createTextNode(x);
					var temp=gaussCreateButtonLike(x,null,function () {
						if (gaussFloater && gaussFloatingRow!=-1) 
							gaussKillColumnLog(x-1, gaussFloatingRow);});
					temp.onmouseover = function (){temp.style.backgroundColor=(gaussFloater&& gaussFloatingRow!=-1)?"aqua":""};
					temp.style.border="2px solid #FFFFDD";
					gaussDropReceivers.push(temp);
					return temp;
				} else if (y>=1 && y<=gaussRows) {
					gaussInputs[y-1][x-1]=createTextInput(gaussRows<10?"6":"2",""+(multiply*(x==y?1:0)));
					gaussInputs[y-1][x-1].onmouseout = function (){gaussInputs[y-1][x-1].style.backgroundColor="";};
					gaussInputs[y-1][x-1].onmouseover = function (){
							if (gaussFloater && gaussFloatingRow!=-1) 
								gaussInputs[y-1][x-1].style.backgroundColor="aqua";};
					gaussInputs[y-1][x-1].onmouseup = function (){
							document.onselectstart=null; 
							if (gaussFloater  && gaussFloatingRow!=-1) 
								gaussKillRowColumnLog(y-1, x-1, gaussFloatingRow);};
					return gaussInputs[y-1][x-1];
				} else if (y==gaussRows+1) {
					//column move start and swap end
					return gaussCreateButtonLike("move",
												function(e){
													gaussDragDropCol(e,x-1);
													return false;},
												function () {
													if (gaussFloater && gaussFloatingCol!=-1) 
														gaussSwapColsLog(x-1,gaussFloatingCol);});
				}
			} else if (y>=1 && y <= gaussRows) {
				if (x==0) return document.createTextNode(y);
				else if (x==gaussCols+1) return gaussCreateButtonLike("<-*",function(){return false;},
					function () {
						if (gaussFloater  && gaussFloatingRow!=-1) 
							gaussAddRowsLog(gaussFloatingRow, y-1, gaussMultiplyInputs[y-1].value);
						else gaussMultiplyRowLog(y-1);
					});
				else if (x==gaussCols+2) {
					gaussMultiplyInputs[y-1]=createTextInput("3","1");
					return gaussMultiplyInputs[y-1];
				} else if (x==gaussCols+3) 
					return gaussCreateButtonLike("move |->",
												function(e){
													gaussDragDropRow(e,y-1);
													return false;},
												function () {
													if (gaussFloater && gaussFloatingRow!=-1) 
														gaussSwapRowsLog(gaussFloatingRow, y-1);});
					/*var newSpan = document.createElement("span");
					newSpan.appendChild(document.createTextNode("*="text";
					newEdit.size=size;
					if (def) newEdit.value=def;
					return newEdit;
					varr temp=createButton("*",function () {gaussMultiplyRow(y-1);});*/
				else if (x==gaussCols+4) {
					var temp=gaussCreateButtonLike("+",null,function () {
						if (gaussFloater && gaussFloatingRow!=-1) 
							gaussAddRowsLog(gaussFloatingRow, y-1, 1);
					});
					temp.onmouseover = function (){
						temp.style.backgroundColor=(gaussFloater&& gaussFloatingRow!=-1)?"aqua":""
					};
					temp.style.border="2px solid #FFFFDD";
					gaussDropReceivers.push(temp);
					return temp;
				} else if (x==gaussCols+5) {
					var temp=gaussCreateButtonLike("-",null,function () {
						if (gaussFloater && gaussFloatingRow!=-1) 
							gaussAddRowsLog(gaussFloatingRow, y-1, -1);
					});
					temp.onmouseover = function (){
						temp.style.backgroundColor=(gaussFloater&& gaussFloatingRow!=-1)?"aqua":""
					};
					temp.style.border="2px solid #FFFFDD";
					gaussDropReceivers.push(temp);
					return temp;
				}

//				} else if (x==gaussCols+5) return createButtonLike("*",function () {gaussMultiplyRow(y-1);});
			}
			return null;
		});
		gaussUpdateInverse();
  }

//imports a matrix
//use regexp to split the text in rows and each of them in cols, create a matrix and set the values
function gaussParseImport(){
	if (gaussTextArea==null) gaussReadInterfaceVars();
	var rowSplit = new RegExp("[^"+gaussNewRowChars.value+"]+["+gaussNewRowChars.value+"]","g");
	var colSplit = new RegExp("[^"+gaussNewColumnChars.value+"]+["+gaussNewColumnChars.value+"]","g");
	var number = /-?[ ]*[0-9]+(.[0-9]+)?([eE][0-9]+)?/;
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
			
			//alert(textCols[j]+" -> "+	newNumber);
			if (newNumber !=null&& newNumber.length>0) {
				var nn = newNumber[0].replace(/ */g, "");
				if (!isNaN(1*nn))
					newNumbers.push(nn);
			}
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
        var res=document.getElementById("gaussExportStartID").value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
	var newCol = document.getElementById("gaussExportNewColumnCharsID").value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
	var newRow = document.getElementById("gaussExportNewRowCharsID").value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");  
	for (var i=0; i < gaussRows;i++){
		if (i!=0) res+=newRow;
		res+=gaussInputs[i][0].value;
		for (var j=1; j < gaussCols; j++){
			res+=newCol+gaussInputs[i][j].value;
		}
	}	
	gaussTextArea.value=res+document.getElementById("gaussExportEndID").value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}
  /*for (var y=0;y<maxy;y++)
        for (var x=0;x<maxx;x++)
          boxes[x*maxy+y].innerHTML="&nbsp;";*/
    //var timing2 = new Date();    alert((timing2-timing));
  
  
function gaussChangeImportExport(){
	if (document.getElementById("gaussChangeImportExportID").checked)
		gaussImportExport.style.display="block";
	else
		gaussImportExport.style.display="none";
}

function gaussUpdateLog(){
	if (gaussChangeLog.checked) 
		gaussLog.style.display="block";
	 else
		gaussLog.style.display="none";
	gaussExport();
	gaussLogTextArea.value=gaussTextArea.value+"\n";
}


function gaussUpdateInverse(){
	if (gaussChangeInverse.checked) {
		gaussInverseOutput.style.display="block";
		for (var i=0;i<gaussRows;i++) 
			gaussInverseInputs[i]=new Array(gaussCols);
		createCustomTable(gaussInverseOutput,gaussCols+1, gaussRows+1,
			function (x,y) {
				if (x>=1 && x <= gaussCols) {
					if (y==0) return document.createTextNode(x);
					else if (y>=1 && y<=gaussRows) {
						gaussInverseInputs[y-1][x-1]=createTextInput("6",""+(x==y?1:0));
						//gaussInverseInputs[y-1][x-1].readOnly=true;
						return gaussInverseInputs[y-1][x-1];
					} 
				} else if (x==0 && y>=1 && y <= gaussRows) 
					return document.createTextNode(y);
		});
			
	} else
		gaussInverseOutput.style.display="none";
}


//some customization
function gaussOptionSet(){
	var size=document.getElementById('gaussOptionEditSizeId').value;
	for (var i=0;i<gaussInputs.length;i++)
		for (var j=0;j<gaussInputs[i].length;j++)
			gaussInputs[i][j].size=size;
	for (var i=0;i<gaussInverseInputs.length;i++)
		for (var j=0;j<gaussInverseInputs[i].length;j++)
			gaussInverseInputs[i][j].size=size;
}

//===============Interfacezugriffsvariablen setzen====================  
function gaussReadInterfaceVars(){
  var doc=document;
    gaussSizeXInput=doc.getElementById("gaussSizeXInputID");
    gaussSizeYInput=doc.getElementById("gaussSizeYInputID");
    gaussOutput=doc.getElementById("gaussOutputID");;  
	gaussImportExport=doc.getElementById("gaussImportExportID");
	gaussTextArea=doc.getElementById("gaussTextAreaID");
	gaussNewColumnChars=doc.getElementById("gaussNewColumnCharsID");
	gaussNewRowChars=doc.getElementById("gaussNewRowCharsID");
	gaussLog=doc.getElementById("gaussLogID");
	gaussLogTextArea=doc.getElementById("gaussLogTextAreaID");
	gaussChangeLog=doc.getElementById("gaussChangeLogID")
	gaussChangeInverse=doc.getElementById("gaussChangeInverseID")
	gaussInverseOutput=doc.getElementById("gaussInverseOutputID")
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
  var gaussTxtCreateWindow="Open new window";  
  var gaussTxtImportExport="import/export";  
  var gaussTxtImport="parse import";  
  var gaussTxtExport="export";  
  var gaussTxtMultiply=" multiply ";
  var gaussTxtNoNumberGiven="No number given";
  var gaussTxtWrongPivotRow="The dragged row can't be used to eliminate this column.";
  var gaussTxtDescription="<b>How to use it:</b><br><br>"+
						  'Short description: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Everything blue reacts to  the mouse. <br><br>'+
						  'Long description:<br>'+
						  '1. To multiply a row with a given value, enter this value in the box after "<-*" and click on "<-*"<br>'+
						  '2. To add/subtract rows from each other, click and hold on the "move" button  and drag the row on the "+"/"-" buttons after the row which should be modified.<br>'+
						  '3. To swap rows, drag a row using its "move" button on the   "move" button of the other row.<br>'+
						  '4. To swap columns, drag a column using its "move" button on the   "move" button of the other column.<br>'+
						  '5. To eliminate a cell, drag the pivot row on the edit box of this cell.<br>'+
						  '6. To eliminate a column below a pivot row, drag the pivot row on the number above the column.<br>';
  var gaussTxtParsingOptions="<b>Options:</b>";
  var gaussTxtNewColumnChars="New column characters:";
  var gaussTxtNewRowChars="New row characters:";
  var gaussTxtShowLog="Keep log";
  var gaussTxtShowInverse="Show inverse operations for LU decomposition";
  //var gaussTxtShowInverse="Mirror operations to calculate inverse";

	var gaussTxtLogMultiplyBy = "multiply row %1 by %2"
	var gaussTxtLogAddRows = "add row %1 to %2 multiplied by %3"
	var gaussTxtLogSwapRows = "swap rows %1 and %2"
	var gaussTxtLogSwapCols = "swap cols %1 and %2"
	var gaussTxtLogKillRowColumn = "eliminate column %2 in row %1 using row %3"
	var gaussTxtLogKillColumn = "eliminate column %1 using row %2"

   var gaussTxtReallyRemove="Sorry, but do you know what you're doing?\nThis will completely remove this row and lead to information loss.\nAre you sure you don't need it anymore? (OK means yes)";
  } else  {
  var gaussTxtSize="Größe:";  
  var gaussTxtCreateIDMatrix="Einheitsmatrix";  
  var gaussTxtCreateEmptyMatrix="Leere Matrix";  
  var gaussTxtCreateWindow="neues Fenster \xF6ffnen";  
  var gaussTxtImportExport="Import/Export";  
  var gaussTxtImport="import";  
  var gaussTxtExport="export";  
  var gaussTxtMultiply=" multipliziere ";
  var gaussTxtNoNumberGiven="Keine Zahl gegeben";
  var gaussTxtWrongPivotRow="Die gezogene Matrixzeile kann die ausgewählte Spalte nicht eliminieren.";
  var gaussTxtDescription="<b>Anleitung:</b><br><br>"+
						  'Zusammenfassung: <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alles Blaue  reagiert auf die Maus. <br><br>'+
						  'Ausführlich:<br>'+
						  '1. Um eine Zeile mit einer Zahl zu multiplizieren, gebe diese Zahl in die Box nach dem "<-*" ein und klicke auf "<-*"<br>'+
						  '2. Um eine Zeile zu einer anderen zu addieren oder davon abzuziehen, schiebe die Zeile ausgehend von dem "move"-Button auf das +/- Symbole hinter der zu modifizierenden Zeile.<br>'+
						  '3. Um Zeilen zu tauschen, schiebe eine Zeile auf den "move"-Button der jeweils anderen.<br>'+
						  '4. Um Spalten zu tauschen, schiebe eine Spalte ausgehend von ihrem "move"-Button auf den "move"-Button der jeweils anderen.<br>'+
						  '5. Um eine Matrixzelle  zu eliminieren, schiebe eine Pivotzeile auf das dazugehörige Editfeld.<br>'+
						  '6. Um eine Matrixspalte unter einer Pivotzeile zu eliminieren, schiebe diese Zeile auf die Zahl über der Spalte.<br>';
  var gaussTxtParsingOptions="<b>Optionen:</b>";
  var gaussTxtNewColumnChars="Zeichen für neue Spalte:";
  var gaussTxtNewRowChars="Zeichen für neue Zeile:";
  var gaussTxtShowLog="Ablauf speichern";
  //var gaussTxtShowInverse="Operationen spiegeln zur Berechnung der Inversen";
  var gaussTxtShowInverse="Inverse Operationen für LR-Zerlegung durchführen";
	var gaussTxtLogMultiplyBy = "multipliziere Zeile %1 mit %2"
	var gaussTxtLogAddRows = "addiere Zeile %1 zu %2 multipliziert mit %3"
	var gaussTxtLogSwapRows = "vertausche Zeilen %1 und %2"
	var gaussTxtLogSwapCols = "vertausche Spalten %1 und %2"
	var gaussTxtLogKillRowColumn = "eliminiere Spalte %2 in Zeile %1 mit Zeile %3"
	var gaussTxtLogKillColumn = "eliminate Spalte %1 mit Zeile %2"
	var gaussTxtReallyRemove="Sorry, aber weißt du, was du tust?\nDamit wird diese Zeile vollständig und für immer entfernt.\nKlicke auf OK, falls sie wirklich gelöscht werden soll.";
}

//====================Interfaceerzeugung======================================


function gaussOpenNewWindow(){
  var fenster=window.open("", "_blank");//, "scrollbars");
  fenster.document.writeln("<html><head><title>")
  if (lang=="en") fenster.document.writeln("Gauss Elimination - BeniBela online");
  else fenster.document.writeln("Gaußsches Eliminationsverfahren - BeniBela online");
  fenster.document.writeln('</title><script type="text/javascript">var lang="'+lang+'";var functionOnly=true;</script>');
  fenster.document.writeln('</head><body>');
  createInterfaceGauss(fenster);
  fenster.document.writeln('<script type="text/javascript" src="bin/others/gaussElimination.js"></script>');
  fenster.document.writeln('</body></html>');
//  if (navigator.userAgent.search(/MSIE/)==-1)
  fenster.document.close(); //nötig für FireFox, lässt aber IE abstürzen 
}


function createInterfaceGauss(intfWin){
  var doc=intfWin.document;

  doc.write('<div id="GaussBaseDiv" >');
  doc.write('<b>'+gaussTxtSize+'</b>: <input type="text" id="gaussSizeXInputID" value="3" size="5"><input type="text" id="gaussSizeYInputID" value="3" size="5">');
  doc.write('<button onclick="javascript:gaussCreateMatrix(1);" type="button">'+gaussTxtCreateIDMatrix+'</button> ');
  doc.write('<button onclick="javascript:gaussCreateMatrix(0);" type="button">'+gaussTxtCreateEmptyMatrix+'</button> ');
  doc.write('<input  onclick="javascript:gaussChangeImportExport();" id="gaussChangeImportExportID" type="checkbox"/>&nbsp;'+gaussTxtImportExport+'&nbsp;&nbsp;');

  //if (doc==document && window.location.href.search(/www\.benibela\.de\/others/)!=-1) 
    doc.write('<button onclick="javascript:gaussOpenNewWindow();" type="button">'+gaussTxtCreateWindow+'</button>');
   if (window.location.href.search(/www\.benibela\.de/)==-1) 
      doc.write('by <a href="http://www.benibela.de">Benito van der Zander</a>');

  doc.write('<br><br>');
  doc.write('<div><div id="gaussImportExportID" style="display:none">');
  doc.write('<textarea rows="15" cols="80" id="gaussTextAreaID"></textarea><br>');
  doc.write('<button onclick="javascript:gaussParseImport();" type="button">'+gaussTxtImport+'</button> '); 
  doc.write(gaussTxtParsingOptions+" "+gaussTxtNewColumnChars+' <input type="text" id="gaussNewColumnCharsID" value=", |\\t=" size="5"/> '); 
  doc.write(gaussTxtNewRowChars+' <input type="text" id="gaussNewRowCharsID" value="\\n\\r;" size="5"/><br> ');
  doc.write('<button onclick="javascript:gaussExport();" type="button">'+gaussTxtExport+'</button>'); 
  doc.write('<input type="text" id="gaussExportStartID" value="[" size="5"/>'); 
  doc.write('<input type="text" id="gaussExportNewColumnCharsID" value=", " size="5"/>');
  doc.write('<input type="text" id="gaussExportNewRowCharsID" value=";  \\n" size="5"/> <input type="text" id="gaussExportEndID" value="]\\n" size="5"/>'); 
  //gaussExport
  doc.write('<br><br></div>');
  
  
  doc.write('<div id="gaussOutputID">');
  doc.write('<table id="gaussouttab">');
  doc.write('<tr><td>&nbsp;</td></tr>');
  doc.write('</table>');
  doc.write('</div></div>');
  
  doc.write('<br><input  onclick="javascript:gaussUpdateInverse();" id="gaussChangeInverseID" type="checkbox" />&nbsp;'+gaussTxtShowInverse);
  doc.write('<div id="gaussInverseOutputID" style="display:none">');
  doc.write('</div>');

  doc.write('<br><input  onclick="javascript:gaussUpdateLog();" id="gaussChangeLogID" type="checkbox" />&nbsp;'+gaussTxtShowLog);
  doc.write('<div id="gaussLogID" style="display:none">');
  doc.write('<textarea rows="15" cols="80" id="gaussLogTextAreaID"></textarea><br>');
  doc.write('</div>');

  var gaussTxtEditWidth="edit width:";
  var gaussTxtUpdate="update";
  var gaussTxtShowOptions="show options";

  doc.write('<br><input  onclick="javascript:document.getElementById(\'gaussOptionsID\').style.display=(document.getElementById(\'gaussChangeOptionsID\').checked?\'block\':\'none\');" id="gaussChangeOptionsID" type="checkbox" />&nbsp;'+gaussTxtShowOptions);
  doc.write('<div id="gaussOptionsID" style="display:none">');
  doc.write(gaussTxtEditWidth+' <input type="text" id="gaussOptionEditSizeId" value="6"> <button onclick="javascript:gaussOptionSet();" type="button">'+gaussTxtUpdate+'</button><br>');
  doc.write('</div>');
  
  doc.write('<br><br>');
  doc.write(gaussTxtDescription);
  
  doc.write('</div>');

  gaussCreateMatrix(1)
  gaussChangeImportExport();
  gaussUpdateLog();
  
/*if (window.colorMapStandAlone==true){
  doc.write('<\/script></body></html>');
  doc.close();
}*/
  
}

  
if (window.functionOnly) ;
else createInterfaceGauss(window);
  
  
