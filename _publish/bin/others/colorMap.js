//=====================Color map by Benito van der Zander==========================
//draws a grid of colors
//benito@benibela.de, www.benibela.de

//========include============
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string)
{
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }
	//function added by benibela
	this.hexMixedWith=function(alpha, other){
        var r = Math.round((1-alpha)*this.r+alpha*other.r).toString(16);
        var g = Math.round((1-alpha)*this.g+alpha*other.g).toString(16);
        var b = Math.round((1-alpha)*this.b+alpha*other.b).toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
	}

    // help, removed

}



//=========================Funktionsdefinition=====================================
  var boxes=new Array();
  var colors=new Array("red");
  var maxy,maxx=-1;
  var sizex,sizey=-1;
  var border;
  var colorSelect;
  var customFunc;
  var wasnumberdisplay=false;

  var colorMapColorInput;
  var colorMapAlgoInput;
  var colorMapMaxXInput=null;
  var colorMapMaxYInput;
  var colorMapSizeXInput;
  var colorMapSizeYInput;
  var colorMapBorderInput;
  var colorMapShuffleInput;
  var colorMapRangeInput;
  var colorMapNormalizeCoords;
  var colorMapNormalizeCoordsMin;
  var colorMapNormalizeCoordsMax;
  var colorMapShowNumbersInput;
  var colorMapOutput;

  function sqr(x){
    return x*x;
  }
  function remAll(){
    while (colorMapOutput.hasChildNodes()){
      var temp=colorMapOutput.firstChild;
      colorMapOutput.removeChild(temp);
    }
  }
  function genTable(){
    //var timing = new Date();
    maxx=parseInt(colorMapMaxXInput.value);
    maxy=parseInt(colorMapMaxYInput.value);
    sizex=colorMapSizeXInput.value;
    sizey=colorMapSizeYInput.value;
    border=colorMapBorderInput.value; 
    var nbsp="";//String.fromCharCode(160);
    
    var totalWidth=(parseInt(sizex)+parseInt(border))*maxx;
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
    }
    
    var tab=document.createElement("table");//empty-cells:show
    colorMapOutput.appendChild(tab);
    
    if (border!="0") {
      tab.style.borderCollapse="separate";
      tab.style.borderSpacing=border+"px";
      tab.cellSpacing=border; 
    } else tab.style.borderCollapse="collapse";
    //else  //setAttribute("style","margin-left:40px;");;
    boxes = new Array(maxy*maxx);
    for (var y=maxy-1;y>=0;y--){
      var line=tab.insertRow(maxy-y-1);
      line.height=sizey;
      line.style.height=sizey+"px";
      for (var x=0;x<maxx;x++){
        boxes[x*maxy+y]=document.createElement("td");
        line.appendChild(boxes[x*maxy+y]);
        if (y==0) boxes[x*maxy+y].width=sizex;
        boxes[x*maxy+y].appendChild(document.createTextNode(nbsp));//schneller aber nur im ie:innerText=nbsp;
      }
    }
   // var timing2 = new Date();    alert((timing2-timing));
   //alert("??");
  }
  function genAll(){
  if (colorMapMaxXInput==null) readInterfaceVars();

  if (maxx!=parseInt(colorMapMaxXInput.value)||maxy!=parseInt(colorMapMaxYInput.value)||
        sizex!=colorMapSizeXInput.value||sizey!=colorMapSizeYInput.value||border!=colorMapBorderInput.value) {
      remAll();
      genTable();
    }
    
    colors=colorMapColorInput.value.split(" ");
    if (colorMapShuffleInput.checked){
      var colors2=new Array(colors.length);
      for (var i=colors.length-1;i>=0;i--){ 
        j=Math.round(Math.random()*i);
        colors2[i]=colors[j];
        colors[j]=colors[i];
      }
      colors=colors2;
    }
    
    //var timing = new Date();
    if (colorMapAlgoInput.value.search(/\^/)!=-1) 
	  if (lang=="de") alert("Vorsicht: ^ bedeutet XOR, \nf\xFCr Potenzierung muss Math.pow(x,y) verwendet werden");
	  else alert("Warning: ^ means XOR, \nUse Math.pow(x,y) for power");
    if (colorMapAlgoInput.value.search(/\*\*/)!=-1) 
	  if (lang=="de") alert("Vorsicht: ** existiert nicht \n Für Potenzierung muss sqr(x) oder pow(x,y) verwendet werden");
	  else alert("Warning: ** doesn't work, \nUse sqr(x) for x^2 or pow(x,y) for x^y");
    var algo = colorMapAlgoInput.value;
    var functionDef= "function (x,y) { with(Math) {";
    if (colorMapNormalizeCoords.checked) {
	  var facx=(colorMapNormalizeCoordsMax.value-colorMapNormalizeCoordsMin.value)/(maxx-1);
	  var facy=(colorMapNormalizeCoordsMax.value-colorMapNormalizeCoordsMin.value)/(maxy-1);
      functionDef= "function (xn,yn) { var x="+facx+"*xn+"+colorMapNormalizeCoordsMin.value+
	               "; var y="+facy+"*yn+"+colorMapNormalizeCoordsMin.value+"; with(Math) {";
	}
	var rgbColors;
    if (algo.search(/return/)!=-1) {
      eval("colorSelect="+functionDef+algo+";}}");
      eval("customFunc="+functionDef+algo+";}}");
    } else {
      eval("colorSelect="+functionDef+" return "+algo+";}}");
      eval("customFunc="+functionDef+" return "+algo+";}}");
      if (!isNaN(colorSelect(0,0))||!isNaN(colorSelect(maxx,maxy))) 
	    if (colorMapRangeInput.value=="interpol") {
		  rgbColors=new Array(colors.length);
		  for (var i=0; i<colors.length;i++)
		    rgbColors[i]=new RGBColor(colors[i]);
		  eval("colorSelect="+functionDef+" var c="+algo+"; var bc=floor(c); if (bc<0 || bc+1>=colors.length) return 0; return rgbColors[bc].hexMixedWith(c-bc,rgbColors[bc+1]);}}");
        } else if (colorMapRangeInput.value=="modmov") 
		  eval("colorSelect="+functionDef+" return colors[Math.round(colors.length*99999+"+algo+")%colors.length];}}");
        else if (colorMapRangeInput.value=="modinv") 
		  eval("colorSelect="+functionDef+"return colors[Math.abs(Math.round("+algo+"))%colors.length];}}");
        else if (colorMapRangeInput.value=="minmax") 
		  eval("colorSelect="+functionDef+"return colors[Math.min(colors.length-1,Math.max(0,Math.round("+algo+")))];}}");
        else
		  eval("colorSelect="+functionDef+"return colors[Math.round("+algo+")];}}");
      
    }

    for (var y=0;y<maxy;y++)
      for (var x=0;x<maxx;x++) 
        boxes[x*maxy+y].bgColor=colorSelect(x,y); //faster than css
    
    if (colorMapShowNumbersInput.checked){ 
      for (var y=0;y<maxy;y++)
        for (var x=0;x<maxx;x++)
          boxes[x*maxy+y].innerHTML=customFunc(x,y);
      wasnumberdisplay=true;
    } else if (wasnumberdisplay) {
      wasnumberdisplay=false;
      for (var y=0;y<maxy;y++)
        for (var x=0;x<maxx;x++)
          boxes[x*maxy+y].innerHTML="&nbsp;";
    }
    //var timing2 = new Date();    alert((timing2-timing));
  }
  


  function readInterfaceVars(){
  //===============Interfacezugriffsvariablen setzen====================  
  var doc=document;
    colorMapColorInput=doc.getElementById("colorMapColorInputID"); 
    colorMapAlgoInput=doc.getElementById("colorMapAlgoInputID");
    colorMapMaxXInput=doc.getElementById("colorMapMaxXInputID");
    colorMapMaxYInput=doc.getElementById("colorMapMaxYInputID");
    colorMapSizeXInput=doc.getElementById("colorMapSizeXInputID");
    colorMapSizeYInput=doc.getElementById("colorMapSizeYInputID");
    colorMapBorderInput=doc.getElementById("colorMapBorderInputID");
    colorMapShuffleInput=doc.getElementById("colorMapShuffleInputID");
    colorMapRangeInput=doc.getElementById("colorMapRangeInputID");
    colorMapShowNumbersInput=doc.getElementById("colorMapShowNumbersInputID");
	colorMapNormalizeCoords=doc.getElementById("colorMapNormalizeCoordsID");
	colorMapNormalizeCoordsMin=doc.getElementById("colorMapNormalizeCoordsMinID");
	colorMapNormalizeCoordsMax=doc.getElementById("colorMapNormalizeCoordsMaxID");
    colorMapOutput=doc.getElementById("colorMapOutputID");;
    
  }
  
  
//====================Interfacevariablendefinition============================
if (window.lang) {
} else {
  var lang="de";
  if (window.location.href.search(/_en\.html/)!=-1) lang="en";
  if (window.location.href.search(/html#en/)!=-1) lang="en";
}


if (lang=="en") {
  var colorMapTxtCount="Count:";  
  var colorMapTxtSize="Size:";  
  var colorMapTxtBorder="Border:";  
  var colorMapTxtCreate="Create pattern";  
  var colorMapTxtCreateWindow="Open new window";  
  var colorMapTxtColorMix="shuffle colors";  
  var colorMapTxtShowModMov="modulo limited (- moves)";
  var colorMapTxtShowModInv="modulo limited (- inverts)";
  var colorMapTxtShowMinMax="min/max limited";
  var colorMapTxtShowInterpol="interpolate";
  var colorMapTxtShowNoSavety="nothing";
  var colorMapTxtShowNumbers="show function values";
  var colorMapTxtNormalizeCoords="map coordinates to";
  var colorMapTxtColors="Colors:";
  var colorMapTxtAlgos="Function:";
  var colorMapColorNameList=new Array(
  "light-varicolored",
  "dark-varicolored",
  "both",
  "black/white",
  "gray"
  );
  var colorMapAlgoNameList=new Array(
  "random",
  "vertical",
  "horizontal",
  "diagonal",
  "rhombuses",
  "raster",
  "rays",
  "border",
  "power",
  "egde-circle",
  "egde-circle2",
  "egde-circle3",
  "alien"
  );
} else  {
  var colorMapTxtCount="Anzahl:";  
  var colorMapTxtSize="Gr\xF6\xDFe:";   //Achtung: nicht kodierte Zeichen verursachen Probleme bei neuem Fenster (falscher Zeichensatz???)
  var colorMapTxtBorder="Rand:";  
  var colorMapTxtCreate="Muster erzeugen";  
  var colorMapTxtCreateWindow="neues Fenster \xF6ffnen";  
  var colorMapTxtColorMix="Farben mischen";  
  var colorMapTxtShowModMov="Modulo begrenzt (- verschiebt)";
  var colorMapTxtShowModInv="Modulo begrenzt (- invertiert)";
  var colorMapTxtShowMinMax="min/max begrenzt";
  var colorMapTxtShowInterpol="interpolieren";
  var colorMapTxtShowNoSavety="nichts davon";
  var colorMapTxtShowNumbers="Funktionswerte anzeigen";
  var colorMapTxtNormalizeCoords="Koordinaten abbilden auf";
  var colorMapTxtColors="Farben:";
  var colorMapTxtAlgos="Funktion:";
  var colorMapColorNameList=new Array(
  "hell-bunt",
  "dunkel-bunt",
  "beides",
  "schwarz/wei\xDF",
  "grau"
  );
  var colorMapAlgoNameList=new Array(
  "Zufall",
  "Vertikalen",
  "Horizontalen",
  "Diagonalen",
  "Rauten",
  "Raster",
  "Strahlen",
  "Rahmen",
  "Potenz",
  "Eckkreise",
  "Eckkreise2",
  "Eckkreise3",
  "Alien"
  );
}
var colorMapColorList=new Array(
"red yellow lime blue aqua fuchsia ",
"maroon olive green navy teal purple ",
"red yellow lime blue aqua fuchsia maroon olive green navy teal purple",
"black white",
"#000000 #111111 #222222 #333333 #444444 #555555 #666666 #777777 #888888 #999999 #AAAAAA #BBBBBB #CCCCCC #DDDDDD #FFFFFF"
);
var colorMapAlgoList=new Array(
"Math.random()*(colors.length-1)",
"x",
"y",
"x+y",
"Math.abs((maxx-1)/2-x)+Math.abs((maxy-1)/2-y)",
"(x&1) + (y&1)",
"x/y",
"x*y",
"Math.pow(x,y)",
"Math.log(x)*Math.log(y)",
"Math.sqrt(x)*Math.sqrt(y)",
"maxx*maxy/(x+1)/(y+1)",
"max(0,min(2,floor(5/(x*x*50+sqr(y+7)+1))+floor(5/(sqr(x-2)+sqr(y+9)*80+1))+floor(1.4/(sqr(y+2.8)*0.1+x*x*0.04+0.01))-3/(x*x+sqr(y+1.0)*180)+floor(2/(sqr(y-3)*0.2+0.5*sqr(abs(x)-3.5)*2+0.1))+floor(2.8/(sqr(y+5)*1.5+0.5*sqr(abs(x)-5)*2.5+0.1))+floor(1.6/(sqr(y-4)*0.03+x*x*0.1+0.1))+floor(1.5/(sqr(y-10)+0.5*sqr(abs(x)-3)))+floor(2.8/(sqr(y+9)*1.5+0.5*sqr(x-4)*2.5+0.1))+1))/2 + min(1,floor(2/(sqr(y+3)*2.4+sqr(abs(x)-1.9)*2.4)))"
);
  
  
// <a onclick="javascript:colorMapColorInput.value='';" class="optionLink">hell-bunt</a>

//====================Interfaceerzeugung======================================


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
  fenster.document.close(); //nötig für FireFox, lässt aber IE abstürzen 
}


function createInterface(intfWin){
  var doc=intfWin.document;
  //read ? params
  var params=intfWin.location.search.slice(1).split('&');
  var paramsId=new Array(params.length);
  var paramsValue=new Array(params.length);
  for (var i=0; i< params.length; i++){
    var temp=params[i].split("=");
	if (temp.length<2) continue;
	paramsId[i]=temp[0].toLowerCase();
	paramsValue[i]=decodeURIComponent(temp[1]);
  }
  var get=function (id,def){
	id = "cm"+id.toLowerCase();
	for (var i=0;i<params.length;i++) {
		if (paramsId[i]==id) return paramsValue[i];	
	}
	return def;
  }


  doc.write('<div id="ColorMapBaseDiv" >');
  doc.write('<b>'+colorMapTxtCount+'</b>: <input type="text" id="colorMapMaxXInputID" value="'+get("countX",10)+'" size="3"><input type="text" id="colorMapMaxYInputID" value="'+get("countY",10)+'" size="3">');
  doc.write('<b>'+colorMapTxtSize+'</b>: <input type="text" id="colorMapSizeXInputID" value="'+get("sizeX",30)+'" size="3"><input type="text" id="colorMapSizeYInputID" value="'+get("sizeX",30)+'" size="3">');
  doc.write('<b>'+colorMapTxtBorder+'</b>: <input type="text" id="colorMapBorderInputID" value="'+get("border",0)+'" size="3">');
  doc.write('<br><b>'+colorMapTxtColors+' </b>');

  doc.write('<input type="text" id="colorMapColorInputID" value="'+get("colors","red lime yellow blue fuchsia aqua maroon green olive navy purple teal")+'" size="60"><br>');
  for (var i=0;i<colorMapColorList.length;i++)
    doc.write('<a onclick="javascript:colorMapColorInput.value=\''+colorMapColorList[i]+'\';" style="color:blue;text-decoration:underline;">'+colorMapColorNameList[i]+'</a> ');

  doc.write('<br><b>'+colorMapTxtAlgos+' </b>');
  doc.write('<input type="text" id="colorMapAlgoInputID" value="'+get("function",colorMapAlgoList[parseInt(get("functionNr","0"))])+'" size="60"><br>');
  for (var i=0;i<colorMapAlgoList.length;i++)
    doc.write('<a onclick="javascript:colorMapAlgoInput.value=\''+colorMapAlgoList[i]+'\';" style="color:blue;text-decoration:underline;">'+colorMapAlgoNameList[i]+'</a> ');
    

  doc.write('<br>');
  doc.write('  <input type="checkbox" id="colorMapShuffleInputID" '+get("shuffle","checked")+'/>'+colorMapTxtColorMix+'</input>');
    
  doc.write('  <select id="colorMapRangeInputID">');
  doc.write('    <option value="interpol">'+colorMapTxtShowInterpol+'</option>');
  doc.write('    <option value="modmov">'+colorMapTxtShowModMov+'</option>');
  doc.write('    <option value="modinv">'+colorMapTxtShowModInv+'</option>');
  doc.write('    <option value="minmax">'+colorMapTxtShowMinMax+'</option>');
  doc.write('    <option value="other">'+colorMapTxtShowNoSavety+'</option>');
  doc.write('</select><br>');

  doc.write('<input type="checkbox" id="colorMapShowNumbersInputID">'+colorMapTxtShowNumbers+'</input><br>');
  doc.write('<input type="checkbox" id="colorMapNormalizeCoordsID" '+get("normalize","")+' >'+colorMapTxtNormalizeCoords+'</input> [');
  doc.write('<input type="text" id="colorMapNormalizeCoordsMinID" value="'+get("normMin",0)+'" size="2"></input>,');
  doc.write('<input type="text" id="colorMapNormalizeCoordsMaxID" value="'+get("normMax",0)+'" size="2"></input>]<br>');


  doc.write('<button onclick="javascript:genAll();" type="button">'+colorMapTxtCreate+'</button>&nbsp;&nbsp;&nbsp;');


  if (doc==document && window.location.href.search(/www\.benibela\.de\/others/)!=-1) 
    doc.write('<button onclick="javascript:openNewWindow();" type="button">'+colorMapTxtCreateWindow+'</button>');
   else if (window.location.href.search(/www\.benibela\.de/)==-1) 
      doc.write('by <a href="http://www.benibela.de">Benito van der Zander</a>');

  doc.write('<br><br>');
  doc.write('<div><div id="colorMapOutputID">');
  doc.write('<table id="outtab">');
  doc.write('<tr><td>&nbsp;</td></tr>');
  doc.write('</table>');
  doc.write('</div></div>');

  doc.write('</div id="ColorMapBaseDiv">');

  if (get("generate","")=="true") {
	genAll();
  }
  
/*if (window.colorMapStandAlone==true){
  doc.write('<\/script></body></html>');
  doc.close();
}*/
  
}

  
if (window.functionOnly) ;
else createInterface(window);
  
  