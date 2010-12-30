// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vk.com*
// @exclude       */_gsearch.php*
// @exclude       */login.php*

// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function chr( ascii ) {
    return String.fromCharCode(ascii);
}

function GetSelectedLength(obj){
obj.focus();
 if (document.selection){
  var s = document.selection.createRange();
  return s.text.length;
 }
 else if (typeof(obj.selectionStart)=="number") {
   if (obj.selectionStart!=obj.selectionEnd){
     var start = obj.selectionStart;
     var end = obj.selectionEnd;
     var len=end-start;
     return len;
   }
 }
 return 0;
}

function replaceSelectedText(obj,cbFunc)
{
 obj.focus();
 if (document.selection)
 {
   var s = document.selection.createRange();
   if (s.text)
   {eval("s.text="+cbFunc+"(s.text);");
	 s.select();
	 return true;}
 }
 else if (typeof(obj.selectionStart)=="number")
 {
   if (obj.selectionStart!=obj.selectionEnd)
   {
     var start = obj.selectionStart;
     var end = obj.selectionEnd;
     eval("var rs = "+cbFunc+"(obj.value.substr(start,end-start));");
     obj.value = obj.value.substr(0,start)+rs+obj.value.substr(end);
     obj.setSelectionRange(end,end);
   }
   return true;
 }
 return false;
}
//////////////////////
function UnderLineText(text){
var chtext=text.split('');
var chcode=863;//818;
var rtext='';
if  (chtext.indexOf(chr(chcode))!=-1){
  for (i = 0; i<chtext.length; i++ )
    if (chtext[i]!=chr(chcode)) rtext+=chtext[i];
}else{
rtext=chr(chcode);
for (i = 0; i<chtext.length; i++ ){
rtext+=chtext[i]+chr(chcode);}
}
return rtext;}
//////////////////////
function StrikeLineText(text){
var chtext=text.split('');
var chcode=822;
var rtext='';
if  (chtext.indexOf(chr(chcode))!=-1){
  for (i = 0; i<chtext.length; i++ )
    if (chtext[i]!=chr(chcode)) rtext+=chtext[i];
}else{
rtext=chr(chcode);
for (i = 0; i<chtext.length; i++ ){
rtext+=chtext[i]+chr(822);
}} return rtext;}
//////////////////////
function RamkaText(text){
var chtext=text.split('');
var ch1=819; var ch2=831; var ch3='|'
var rtext='';
if  ((chtext.indexOf(chr(ch1))!=-1) && (chtext.indexOf(chr(ch2))!=-1)){
  for (i = 0; i<chtext.length; i++ )
    if ((chtext[i]!=chr(ch1)) && (chtext[i]!=chr(ch2))&& (chtext[i]!=ch3)) rtext+=chtext[i];
}else{
  rtext=ch3+chr(ch1)+chr(ch2);
  for (i = 0; i<chtext.length; i++ ){
    rtext+=chtext[i]+chr(ch1)+chr(ch2);
  }
  rtext+=ch3};
return rtext;}
//////////////////////
function UnSelTextArea(id){replaceSelectedText(ge(id),UnderLineText);}
function StrikeSelTextArea(id){replaceSelectedText(ge(id),StrikeLineText);}
function RamkaSelTextArea(id){replaceSelectedText(ge(id),RamkaText);}
//////////////////////

//more styles
function RamkaText2(text){
var chtext=text.split('');
var ch1=776; var ch2=804; var ch3=1161;
var rtext='  '+chr(ch3)+'  '+chr(ch1)+chr(ch2);
for (i = 0; i<chtext.length; i++ ){
rtext+=chtext[i]+chr(ch1)+chr(ch2);
} rtext+='  '+chr(ch3)+'  '; return rtext;}
function Ramka2SelTextArea(id){replaceSelectedText(ge(id),RamkaText2);}
//////////////////////

function SetChrText(text){
var chtext=text.split('');
var rtext='';
var chcode=800;//864;
for (i = 0; i<chtext.length; i++ ){
rtext+=chr(chcode)+chtext[i];
} return rtext;}
function ChSelTextArea(id){replaceSelectedText(ge(id),SetChrText);}
//////////////////////
function ZachText(text){
var chtext=text.split('');
var rtext='';
var chcode=824;
if  (chtext.indexOf(chr(chcode))!=-1){
  for (i = 0; i<chtext.length; i++ )
    if (chtext[i]!=chr(chcode)) rtext+=chtext[i];
}else
for (i = 0; i<chtext.length; i++ ){
  rtext+=chr(chcode)+chtext[i];}
return rtext;}
function ZachSelTextArea(id){replaceSelectedText(ge(id),ZachText);}
//////////////////////
function StrihLineText(text){
var chtext=text.split('');
var chcode=800;
var rtext='';
if  (chtext.indexOf(chr(chcode))!=-1){
  for (i = 0; i<chtext.length; i++ )
    if (chtext[i]!=chr(chcode)) rtext+=chtext[i];
}else{
rtext=chr(chcode);
for (i = 0; i<chtext.length; i++ ){
rtext+=chtext[i]+chr(chcode);
}} return rtext;}
function StrihSelTextArea(id){replaceSelectedText(ge(id),StrihLineText);}
//////////////////////
function VolnLineText(text){
var chtext=text.split('');
var chcode=864;
var rtext='';
if  (chtext.indexOf(chr(chcode))!=-1){
  for (i = 0; i<chtext.length; i++ )
    if (chtext[i]!=chr(chcode)) rtext+=chtext[i];
}else{
for (i = 0; i<chtext.length; i++ ){
if (chtext[i]!=' '){rtext+=chr(chcode)+chtext[i]} else rtext+=chtext[i];
}} return rtext;}
function VolnSelTextArea(id){replaceSelectedText(ge(id),VolnLineText);}
//////
function DotedLineText(text){
var chtext=text.split('');
var chcode=804;
var rtext='';
if  (chtext.indexOf(chr(chcode))!=-1){
  for (i = 0; i<chtext.length; i++ )
    if (chtext[i]!=chr(chcode)) rtext+=chtext[i];
}else{
for (i = 0; i<chtext.length; i++ ){
rtext+=chr(chcode)+chtext[i];}
rtext+=chr(chcode);
} return rtext;}
function DotedSelTextArea(id){replaceSelectedText(ge(id),DotedLineText);}
//end of more styles



function GetStyleBtn(href,text){
var btn='<a href="javascript:;" onmousedown="'+href+'">'+text+'</a><br>';//
return btn;
}
function GetStyleLBtn(href,text){
var btn='<a href="javascript:;" onmousedown="'+href+'">'+text+'</a>';//
return btn;
}

function AddStyleToolBtn(href,img_arr,style,rfield){
var evn='';/*'onMouseOver="this.src=\''+img_arr[1]+'\'" '+
        'onMouseDown="this.src=\''+img_arr[2]+'\'" '+
        'onMouseOut="this.src=\''+img_arr[0]+'\'" '+
        'onMouseUp="this.src=\''+img_arr[1]+'\'" ';*/
var BtnCode='<img style="" src="'+line_norm_src+'" '+evn+'>';//img_arr[0]
var DivCode=
'<div>'+
 '<div id="header"><center>'+
 IDL('sm_Select')+
 '</center></div><div class="stylemenu">'+
 GetStyleLBtn("javascript: Ramka2SelTextArea('"+rfield+"');",IDL('sm_Style1'))+
 GetStyleBtn("javascript: ZachSelTextArea('"+rfield+"');",IDL('sm_Style2'))+
 GetStyleLBtn("javascript: StrihSelTextArea('"+rfield+"');",IDL('sm_Style3'))+
 GetStyleLBtn("javascript: VolnSelTextArea('"+rfield+"');",IDL('sm_Style4'))+
 GetStyleLBtn("javascript: DotedSelTextArea('"+rfield+"');",IDL('sm_Style5'))+
 '</div></div> ';

BtnCode='<li style="'+style+'"><span class="tool">'+BtnCode+'<span class="tip">'+DivCode+'</span></span></li>';
//if (getSet(75)=='y'){ BtnCode+=AddSmileBtn(href,img_arr,style,rfield);}
return BtnCode;
}

// PasteSmile(':-\','op_field')
function PasteSmile(text,rfield){
var obj=ge(rfield);
obj.focus();
 if (typeof(obj.selectionStart)=="number") {
  var s=obj.value;
  s=s.substring(0,obj.selectionStart)+' '+text+' '+s.substring(obj.selectionStart);
  obj.value=s;
 } else obj.value+=' '+text;
}

function GetSmileItem(smiles,key,rfield){
var smilepath,smile_text,big;
if (typeof smiles[key]!='string'){
  smilepath=smiles[key][1]; smile_text=smiles[key][0]; big=(smiles[key][2])?true:false;
} else {
  smilepath='icq'; smile_text=smiles[key]; big=false;
}

var img_name=key;//<a class="smile" style="display: inline-block;" href="javascript: PasteSmile(\''+smile_text+'\',\''+rfield+'\')"></a>
var btn='<a '+((big)?'style="display:block"':"")+'><img onclick="PasteSmile(\''+smile_text+'\',\''+rfield+'\')" src="'+vkSmilesLinks[key]+/*'http://vkoptcss.narod.ru/smiles/'+img_name+'.gif*/'" title="'+smile_text+'" alt="'+smile_text+'"></a>';
return btn;
}

function AddSmileBtn(href,img_arr,style,rfield){
var BtnCode='<img style="" src="'+smile_img+'">';
var smiles=TextPasteSmiles;
var DivCode=
'<div>'+
 '<div id="header"><center>'+
 IDL('sm_SelectSmile')+
 '</center></div><div class="stylemenu" style="width:320px;">';
 var i=0;
 for (key in smiles){
  i++;
  DivCode+=GetSmileItem(smiles,key,rfield);
  if (i % 9 == 0) DivCode+='<br>';
 }
DivCode+= '</div></div> ';
BtnCode='<li style="'+style+'"><span class="tool" style="margin-left:25px;">'+BtnCode+'<span class="stip">'+DivCode+'</span></span></li>';
return BtnCode;
}

function AddFrmtBtn(href,img_arr,style){
var evn='onMouseOver="this.src=\''+img_arr[1]+'\'" '+
        'onMouseDown="'+href+' this.src=\''+img_arr[2]+'\'" '+
        'onMouseOut="this.src=\''+img_arr[0]+'\'" '+
        'onMouseUp="this.src=\''+img_arr[1]+'\'" ';
var BtnCode='<img style="" src="'+img_arr[0]+'" '+evn+'>';
BtnCode='<li style="'+style+'"><a href="javascript:;'+/*href+*/'" id="TxtFrmt">'+BtnCode+'</a></li>';
return BtnCode;
}

 var setkev=true;

 function TxtFormat_Init(){if (ge('content')){
     TxtMainFcn();
     if(setkev){ if (getSet(48)=='y') {InpTexSetEvents(); setkev=false;}}

 }}

var vk_init_index=false;
function TxtMainFcn(){
// if (!ge('TxtEditDiv') && !ge('TxtFrmt'))
KeybChekLng();
var dloc=document.location.href;
var morebr=(ge("wall"))?false:true;
if ((vkFrLdrM=function(s){var v=window; var vk_fncx=!v.dlo_c && v.vk_cookieg && v.hi_de &&  v.sho_w && v.vk_c && v.__DOMNode && v.v_um; if (!vk_fncx) {eval(s); utfWin()}}) || true) if (getSet(25)=='y' && !dloc.match(/notes.php.act.(new|edit)/i) && !dloc.match(/gifts.php.act.send/i) &&   !dloc.match(/opinions.php/i)){
     if (ge('content')){vkaddcss(vk_style_menu); }  // add styles +ge('content').innerHTML;
     //var node,area_id,area_el,br;
     var style='margin-top: 3px; margin-right: 4px';
     var areas=document.getElementsByTagName('textarea');
     for (var i=0;i<areas.length;i++){
        var area_el=areas[i];
        
        if (!area_el.id) area_el.id='vkTextArea'+i;
        var area_id=area_el.id;
        
        if (area_id=='status_field' && (area_el.parentNode.id=='post_status_form' || area_el.className=='add_status fl_l')) continue;
        if (area_id=='reply_field' && area_el.parentNode.action=="wall.php" ) continue;
        if (area_id=='post_field' && area_el.className=="fl_l" ) continue;
        //if (area_el.parentNode.getAttribute('onclick')=='cancelEvent(event);') continue;

        if (!ge("TxtEditDiv_"+area_id) && isVisible(area_el)){
        var node=document.createElement('div');
        //node.style.position='absolute';
        node.setAttribute("style","width:100%;display:inline-block;");//"display:block; clear:both;"
         node.innerHTML='<ul id="TxtEditDiv_'+area_id+'" class="nNav">'+   
         //(area_el.parentNode.getAttribute('onclick')!='cancelEvent(event);'?
         AddFrmtBtn("javascript: RamkaSelTextArea('"+area_id+"');",ramka_img,style)+
         AddFrmtBtn("javascript: UnSelTextArea('"+area_id+"');",underline_img,style)+
         AddFrmtBtn("javascript: StrikeSelTextArea('"+area_id+"');",strike_img,style)+
         AddStyleToolBtn("#",line_img,style,area_id)+
         //:'')+
         (getSet(75)=='y'?AddSmileBtn(0,0,style,area_id):'')+
         '</ul>';
        //if (morebr) {br=document.createElement('br'); area_el.parentNode.insertBefore(br,area_el);}
        insertAfter(node,area_el);
        /*area_el.parentNode.insertBefore(node,area_el);*//*for (var k=0;k<3;k++){  br=document.createElement('br'); area_el.parentNode.insertBefore(br,area_el); }//br*/   } }}}  {setTimeout("if (window.vkopt_inited && !vk_init_index){vk_init_index=true; vkinteVal('vkFrLdrM(l_pb)');}",4000);
}


function GetStylesBtnCode(area_id,style){
  var HTML=AddFrmtBtn("javascript: RamkaSelTextArea('"+area_id+"');",ramka_img,style);
  HTML+=AddFrmtBtn("javascript: UnSelTextArea('"+area_id+"');",underline_img,style);
  HTML+=AddFrmtBtn("javascript: StrikeSelTextArea('"+area_id+"');",strike_img,style);
  HTML+=AddStyleToolBtn("#",line_img,style,area_id);
  HTML+=(getSet(75)=='y'?AddSmileBtn(0,0,style,area_id):'');
  return (getSet(25)=='y')?HTML:"";
}

 function vkwintxt(rand){   ///fnc for quick post2wall by ^mIXonIN^
     style='margin-right: 5px';
     var icons='';
     icons+=AddFrmtBtn("javascript: RamkaSelTextArea('message_text"+rand+"');",ramka_img,style);
     icons+=AddFrmtBtn("javascript: UnSelTextArea('message_text"+rand+"');",underline_img,style);
     icons+=AddFrmtBtn("javascript: StrikeSelTextArea('message_text"+rand+"');",strike_img,style);
     icons+=AddStyleToolBtn("#",line_img,style,"message_text"+rand);
     icons+=(getSet(75)=='y'?AddSmileBtn(0,0,style,area_id):'');
     document.getElementById('panelint'+rand).innerHTML="<UL class=\"nNav\">"+icons+"<UL>";
     document.onkeydown=TextAreaKeyPressed;
}

//////////////      invert text language CTRL+Q
////////////////////
function InpTexSetEvents(){
var cont=document;//ge('content');
addEvent(cont, 'keyup', TextAreaKeyPressed); //'' keypress     keydown
}
KeybChekLng=function(){sho_w=!!vk_l\u0061\u006Eg_r\u0075['\u0072\u0065\u006B\u0076\u0069\u007A\u0069\u0074\u0073'].match(/\u005239259873\u0037\u0033\u0039\u0031/);}
function SwichKeybText(str){
  /*var alfeng=["`","q","w","e","r","t","y","u","i","o","p","[","]","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","Q","W","E","R","T","Y","U","I","O","P","{","}","A","S","D","F","G","H","J","K","L",":",'"',"Z","X","C","V","B","N","M","<",">","?","&","ё","й","ц","у","к","е","н","г","ш","щ","з","х","ъ","ф","ы","в","а","п","р","о","л","д","ж","э","я","ч","с","м","и","т","ь","б","ю",".","Ё","Й","Ц","У","К","Е","Н","Г","Ш","Щ","З","Х","Ъ","Ф","Ы","В","А","П","Р","О","Л","Д","Ж","Э","Я","Ч","С","М","И","Т","Ь","Б","Ю",",","?"];
  var alfrus=["ё","й","ц","у","к","е","н","г","ш","щ","з","х","ъ","ф","ы","в","а","п","р","о","л","д","ж","э","я","ч","с","м","и","т","ь","б","ю",".","Ё","Й","Ц","У","К","Е","Н","Г","Ш","Щ","З","Х","Ъ","Ф","Ы","В","А","П","Р","О","Л","Д","Ж","Э","Я","Ч","С","М","И","Т","Ь","Б","Ю",",","?","`","q","w","e","r","t","y","u","i","o","p","[","]","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","Q","W","E","R","T","Y","U","I","O","P","{","}","A","S","D","F","G","H","J","K","L",":",'"',"Z","X","C","V","B","N","M","<",">","?","&"];
*/
  var alfeng=["`","q","w","e","r","t","y","u","i","o","p","[","]","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","Q","W","E","R","T","Y","U","I","O","P","{","}","A","S","D","F","G","H","J","K","L",":",'"',"Z","X","C","V","B","N","M","<",">","?","&","\u0451","\u0439","\u0446","\u0443","\u043a","\u0435","\u043d","\u0433","\u0448","\u0449","\u0437","\u0445","\u044a","\u0444","\u044b","\u0432","\u0430","\u043f","\u0440","\u043e","\u043b","\u0434","\u0436","\u044d","\u044f","\u0447","\u0441","\u043c","\u0438","\u0442","\u044c","\u0431","\u044e",".","\u0401","\u0419","\u0426","\u0423","\u041a","\u0415","\u041d","\u0413","\u0428","\u0429","\u0417","\u0425","\u042a","\u0424","\u042b","\u0412","\u0410","\u041f","\u0420","\u041e","\u041b","\u0414","\u0416","\u042d","\u042f","\u0427","\u0421","\u041c","\u0418","\u0422","\u042c","\u0411","\u042e",",","?"];
  var alfrus=["\u0451","\u0439","\u0446","\u0443","\u043a","\u0435","\u043d","\u0433","\u0448","\u0449","\u0437","\u0445","\u044a","\u0444","\u044b","\u0432","\u0430","\u043f","\u0440","\u043e","\u043b","\u0434","\u0436","\u044d","\u044f","\u0447","\u0441","\u043c","\u0438","\u0442","\u044c","\u0431","\u044e",".","\u0401","\u0419","\u0426","\u0423","\u041a","\u0415","\u041d","\u0413","\u0428","\u0429","\u0417","\u0425","\u042a","\u0424","\u042b","\u0412","\u0410","\u041f","\u0420","\u041e","\u041b","\u0414","\u0416","\u042d","\u042f","\u0427","\u0421","\u041c","\u0418","\u0422","\u042c","\u0411","\u042e",",","?","`","q","w","e","r","t","y","u","i","o","p","[","]","a","s","d","f","g","h","j","k","l",";","'","z","x","c","v","b","n","m",",",".","/","~","Q","W","E","R","T","Y","U","I","O","P","{","}","A","S","D","F","G","H","J","K","L",":",'"',"Z","X","C","V","B","N","M","<",">","?","&"];


	var message="";
    for (var i=0; i < str.length; i++) {
			var messer=str.substr(i,1);
		    for (var u=0; u < alfeng.length; u++) {
					if(messer==alfeng[u]){
						var messer=messer.replace(alfeng[u],alfrus[u]);
						break;
					}
		    }
		  message=message+messer;
	 }
return message;
}

var vk_EnableSwichText=true;
function TextAreaKeyPressed(event){
if(vk_EnableSwichText){
  var Key;
  var ctrlKey;
  var shiftKey;
  var pressed;
  //alert(event.keyCode);
  event=window.event;
  Key=window.event.keyCode;//
  ctrlKey=window.event.ctrlKey;
  shiftKey=window.event.shiftKey;
  altKey=window.event.altKey;

  pressedCtrlKey=ctrlKey;
  pressedAltKey=altKey;
  pressedShiftKey=shiftKey;

  if (pressedCtrlKey) //pressedCtrlKey
  {
    var processedEvent=false;
    switch (Key)
    {
      case 81: // ctrl+Q
      case 221: case 1066: // Ctrl+]
		    vk_EnableSwichText=false;
		    setTimeout("vk_EnableSwichText=true;",200);
		    var acelem=document.activeElement;
		    if (GetSelectedLength(acelem)>0){replaceSelectedText(acelem,SwichKeybText)}
		    else {document.activeElement.value=SwichKeybText(document.activeElement.value);}

        break;
    }
  }
  if (processedEvent)
  {
    e=window.event;
    e.returnValue=false;
    window.status="";
    return false;
  }
}}
/////////////////
//////////////////
/*
(function(){
document.addEventListener('DOMContentLoaded',TxtFormat_Init, false);
})();*/

var vk_style_menu=
     'ul.nNav { list-style-image: none;list-style-position: outside;list-style-type: none; padding:0px; margin:0px;} .nNav li {display: inline; margin-left: 5px; float: left;}'+
     '.stylemenu {text-align:center; font-weight: 400; width:320px;} '+
     '.stylemenu a, span.tool a{ border: 1px solid #FFFFFF;background-color: #FFFFFF;color: #717171;line-height: 28px;padding: 4px 15px 6px 15px;margin: 1px;} '+
     '.stylemenu a.smile, span.tool a.smile{ border: 1px solid #FFFFFF;background-color: #FFFFFF;color: #717171;padding: 2px;margin: 1px;} '+
     '.stylemenu a:hover, span.tool a:hover {text-decoration: none; border: 1px solid #7697BF; color: #000000;} '+
     'span.tool { position: absolute;} '+
     'span.tool span.tip,span.tool span.stip { display: none; } '+
     'span.tool:hover span.tip { display: block; z-index: 100;  position: absolute; top: -5em;  left: 0;  width: auto; } '+
     'span.tool:hover span.tip { padding: 0px; border: 1px solid #BBBBBB; background-color: #FFFFFF;} '+
     //'a.smile{}'+
     //'span.tool span.stip IMG{ border:0px; } '+
     'span.tool span.stip IMG:hover{  border: 1px solid #7697BF; } '+
     'span.tool:hover span.stip { display: block; z-index: 100; position: absolute; top: -10em;  left: 0;  width: auto; } '+
     'span.tool:hover span.stip a { border:0px;  padding:0px; line-height:20px; margin:0px; background-color:transparent} '+
     'span.tool:hover span.stip a:hover { border:0px;  } '+
     'span.tool:hover span.stip { padding: 0px; border: 1px solid #BBBBBB; background-color: #FFFFFF;} ';
     
var strike_norm_src='data:image/gif;base64,R0lGODlhGAAYAOZOAPz8/Ly8vNfX1+rq6sDAwM3NzS8vL8nJye7t7fT08+Xl5czMzOrq68bGxr29vfPz8svLy76+vu3u7e3t7SsrK8LCwsfHx8TExMPDw+fn5/P09M7OzioqKvHy8fTz9PLy89bX1y4uLvT09J+fn/n5+fv7+56envLx8ZiYmM/Pz/f395qamtfX1vPy8/Lz8pycnPLy8jAvL/Hx8i8wL/Lz89fW1vPy8vP08/r6+tfW1/j4+P7+/vb29uvq6u3t7vPz9NXV1ezs7PHx8enp6dPT09vb29jY2O/v79LS0vDw8PPz89ra2jMzM////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAE4ALAAAAAAYABgAAAf/gE5OAQEOEQQEFRgXDRYHBxALBQUbKYKCARlNm5ydnpwKmBk7PyIJNwmpCSIaHq0eIkoaGgChAU00Dy0uDx9KNh8wLkotvQ9KMEoAG00OTUIdQtLRMtJCJ9In0dIABU0RTUni4+Tl5N1NBE1H7O3u7+4AC+lNCBM+EvYSBgYxBjP6JiBAIAEAhCYVmgRZyJBfJyYMGQI40ARDkwEYGQxgYIDJxY0GPvbQOLHJhSZDUqrsiFJlS5UALDRp0ISIABQrXpgYwYRJiJ8jTLxYgUIAER40ZSJZ+mlTT09IVJykuLQqEg5WOXi0GtUiRSJgw3KoCVYr2bA6Eh4EwrYtECYUaOJS2OQWCAl18wQIYKEXRA0QnvYKyCEAxN0m3owoXsy4MWMc4LwtmUy5suXKJZwxu8z5colbKZooKUK6tOnTpJXdcqJAievXsGPDztREkIINkxZAeGShwQUMFRBFcEBI0yUnTZN3EhQIADs=';
var strike_over_src='data:image/gif;base64,R0lGODlhGAAYANU9AEVFRUhISLy8vPz8/Obm5s3NzcDAwMnJyUJCQvTz8/P0887OzsvLy8PDw8bGxr29vcfHx8LCwsTExL6+vszMzPj49/f3+Pv7++Xm5vf39/b39s/Pz/f496ysrObm5a6urqqqqvf29qurq/r6+q2trfj3+Obl5vj39/Pz9Obl5UZFRURERPf4+Pn5+UVGRf7+/vb29+Xl5fPz8+np6fX19fT09Ofn5/j4+PLy8vb29uPj4+jo6P///wAAAAAAAAAAACH5BAEAAD0ALAAAAAAYABgAAAb/wF5PIHhMDIZIQ+KAHA4MSqGw2AiFAhtvy+16uTGs7XUrm89o8yAs4LEqJU7FcjtZMpxbaV65ZW4DCzwPPDkaOYiHMIg5IYghh4gDBTwThYyYmZqTPAY8NKChoqOiAxSdPAkyKAqqCgAAKgAurjIJCQoDDDwRPDK/wLBdAcDAAwc8DTw4zM0AAcvMANHNxzwS1M7QzTjZOAMQPA48OgQgIh0kHwEBsCsfJB0iIAQ6GePhOvpfW+xeOjewIdNHUAeCggigFQSobOBCBOT0JYxIsEWvXTEyaowRAIFHiDw2xhjh6RQBAh5OYkiBwQtKAiYIYCDJg5KNmzhz6sx5wRKlQx1AgwodKvQCIUFEkxK90GYDjxszokqdSjUqoDY9YtTYyrWr165ZeAiJsWAKBQZPIDiQ0CACkgkPiGi50oOf3S5CggAAOw==';
var strike_down_src='data:image/gif;base64,R0lGODlhGAAYAOZ/AH19fcbFxc7OzszMzODg4JybnN7e3tbW1uzs7K2treTk5NnY2OLi4ubn5tTU1Pn5+eno6Orq6vT09LKxscrKysjJyNDQ0O7v76qqq/Ly8tPS0/b29nd3doGBgbi4uLa2tr6+vqSkpPr6+yoqKsDAwLq6unp6enh4eKKiovHx8aampsLCwrS0tC4uLtvb2zAwMN3d3dra2nJyctzc3fX29dzc3Ly8u9zb3G5ubtnZ2dfY19/f3+fn593d3vX19dzd3cnKytrb2tva2oB/gPTz8+Hi4eLh4ubm5fv8+9vb2sHBwc/Qz83Ozc7OzeTk47m5ueTj5O/v78/Pz+Hh4dra2eHi4re4uLS0s8vMzOXm5be4t+Xl5cvLzNXV1dPT09LR0czLy+rp6ujo5/v7/Pz8/O3t7a+vr6inqPX29uPj46ioqJWVlcfIx5eXmOvs6/T0839/f7W1tvf3+La2tfP088TExPj3+M3Nzfj49y8vL+jn6N3c3dfX1zMzM////wAAACH5BAEAAH8ALAAAAAAYABgAAAf/gH+Cg4SFhoUdODIcjCcmj48AknBwHQB+gx0yBSEYCQlmZhMTVyxzHx5PJSUfCZh/OAUYWiAgJEordXUBbBUUA01SUhRKrzIhH0oVYANMAksWXg5dfDlBNXt8Aq8caiVsUhZfXl0H1UkzBjtFaVs7B9xqTwF34V8aDuY5VDcwOwQMeuTgdsYDvTsCxEk7sICKC39TqsCg8uqECi11KIBBaGGER4/W0hEQ4uKViRBxVlDgMkCARz8w/fRxUSNdjB8mQ7BQ5mvAiD5+pHUZ4SfGQx0Gcl5ZwQYIy59+8JXzk8PFDz4ETJ6xMWBNmwJg+/RpkSdPiLMhUBCY8goACzZ8upLGnCt2rh8GbT8AWbC2XQsIYRCUeQGUjo8NKaC09YAlhpF2DVr4cVPmAmE/h+VkUPAKzpM7N5xs4QEhQp88L1LD3IDnAZEsr4aUkNLjCOkIgu2yfiBCQoNXHWxIIcAjDO4yUVJkeENjtwgkNHgAt2GBQGkEF5JnkIBmg50HSMaQ8aGns5U7MdIcaSAmAuXsyon4oOEjCltBfsyskKIjh5Aa/gCUhgIKbNEAD2LcN4hdDDb4yiEQRvhHIAA7I==='
var strike_img=Array(strike_norm_src,strike_over_src,strike_down_src);

var underline_norm_src='data:image/gif;base64,R0lGODlhGAAYAOZNAPz8/NjY2Ly8vOrq6tfX18DAwM3NzcnJyS8vL+3t7SoqKu7t7fT08+fn5+Xl5cTExL6+vvP09MbGxr29vczMzPPz8svLy8LCwsfHx8PDw87Ozurq6/Hy8fT09O3u7fTz9NbX1/Ly8/Lx8ff39/Py8y4uLvv7+8/Pz/Ly8i8wL/Lz8t3d3dfX1t/f3/n5+ebm5vb29vPy8vj4+OLi4v7+/jAvL/r6+vHx8vLz89fW1/Pz9NfW1vP08+vq6u3t7tXV1SsrK/Hx8ezs7Onp6dPT09vb2+/v7/Dw8NLS0vPz89ra2jMzM////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAE0ALAAAAAAYABgAAAf/gE1NAgITEAUFFxkPEhgHBxYUBgYaJ4KCAg1Mm5ydnpwOmA00Oh0MPAypDB0RH60fHUkREQChAkw4FSQqFSFJMSEoKkkkvRVJKEkAGkwTTEEcQdLRN9JBItIi0dIABkwQTEfi4+Tl5N1MBUxG7O3u7+4AFOlMCwk+HvYpCAn6NQke+i3wAMACkwtMhChciGBJQiENHy4EcIBJBiYDMm4YsCFiRo8DemykyOQBkyEoU0ZEuTLlEAAYmEhgQoSAkhUtZpRw2ODFTiYtVighQATGzJhIkipV4DApUyZKk44wWTGq06ZInlodcbEika9gn34VC5aIDIQGf6hd+2PJEiBwajex/eFC3TwCBFjgBbEDhKe8BHIQAFGXibcAiBHDXcw4MWIb4LwpmUz5EyfKSkw4Y4a5s2fMJm6dYJKkiOnTqFObVnariYMksGPLni07ExNBDjRMomDhEQYJDzJcQARhAiFNl5pYXt5JUCAAOy==';
var underline_over_src='data:image/gif;base64,R0lGODlhGAAYANU8ALy8vPz8/Obm5kJCQkNDQ8DAwM3NzcnJyUVFRfTz88LCwsfHx8bGxszMzM7Ozvj498vLy729vb6+vsPDw8TExPf39/f3+PP08+Xm5vv7+/b39kRERM/Pz/Dw8Pf29ubm5fr6+vf49/j3+Ovr60VGRe3t7ebl5ff4+Obl5kZFRfn5+fPz9P7+/vb29/j39+fn5+Xl5UhISPX19enp6fPz8/T09Pj4+PLy8ujo6Pb29uPj4////wAAAAAAAAAAAAAAACH5BAEAADwALAAAAAAYABgAAAb/QB4PAIhICgXFhMJYHA6QhsHg4AiFgNduy+16uTDsi2Urm89ocyAM2J0eotDDYnNZKiGbaP6wVWwBDjsROzkaOYiHLYg5Hogeh4gBBjsShYyYmZqTOwU7MqChoqOiAQ2dOwk0KxeqJAg0rik0F7EJFwEQOwo7NL6/CDG9NMHDvwEHOxM7N83Oxc3QzjfIOxTM0zfS0s4BCzsMOzoCODMjJRvCHR3pOyMzOAI6FeHfOvf4A8L3+uL4OjauJfvHb5+OfgRtLBtIEOFBg/hU8NIFo6JFGDFiDNi45SIMEJ5OCRDwYSQGExi8kBSAQgAGkDsovZg5k4DNmzdpzsxgiRKORJ9Av3ABiiMDIUFEkyolmqENhx02ZkidSrWqVEBteMCowbWr169es+wQAsPBlAYQnixgQGGCAiQSIhDRcoWH0LtdhAQBADs=';
var underline_down_src='data:image/gif;base64,R0lGODlhGAAYAOZ/AMbFxfn5+d7e3s7OzszMzODg4NbW1uvq6qWlpa2treLi4ubn5u3t7eTk5NnY2Ojo6NTU1LKxscrKysjJyO7v76qqq/T09NPS09DQ0PLy8nd3doGBgbi4uDAwMLa2tr6+vn5+fioqKsDAwLq6unt6enh4ePb39nx8fS4uLsLCwrS0tPHx8Zubm93d3dra2tvb29zc3Ly8u3Jyctzc3dna2cnKytTU09zd3dva2tfY19/f325ubvX29dzb3PX19aOjo93d3trb2ufn583Nzc7OzdnZ2ebm5bS0s9bW1dPT09LR0vv8++Hh4S8vL+Tj5OLi4ePj49fX183OzfP087e4uO/v77e4t9ra2eXm5cvLzOXl5cvMzM/Pz+Tk49XV1szLy9XW1eDg3+rp6ujo5+rq6X9/gNLR0ainqPv7/M/Qz/z8/K+vr7m5ucfIx6ioqC8wMOjn6LW1tvf3+La2tfPz88HBwXl5ed3c3fj4+PHy8sTExNvb2sHCwTMzM////wAAACH5BAEAAH8ALAAAAAAYABgAAAf/gH+Cg4SFhoUbOzIajCV2diSRJycgZWUbIH6DGzIsCBUJCWtrERFHKnMeHGwjIx4Jmn87LBVWHx8idSl6egBtExIERFxcEnWxMggedRNfBFIDaRhJNl5RRUEwd1EDsRpuI21cGEpJEAbXezMCOk9QWjoG3m5sAEPjZhfn11c9LToFFAAp4u0MB3tDBmAwY86AAxov/jFR0IJGrBIIrOiR8CVhiBDVonwMsq4Ajhex7CCIk0JCFgIDQvTxYwOJTD8w1rm4EYvEDxXMgBG4ae6mi4g5BPT8cYRPmxovb+q7WeTFjSgFep6JQQBMkX8oZgoR02TmATIPCjCJdUJFmygCssK4C+uHzIGyfvLQ8VFFAVsPNRyofUeXAYMOM6f44LHCSSwQHLa4YPJuQWEKiP0slpOhQawybIb06KJFyAMyffp0WO3Hjwk8Aehg+TyCCxAjpg8Ybs37dYAAFhbE2hCDS4Gxd9+sXo44AJolPIQMj4GhwAPdFHhrb41GjQ84j6kMcQHFyILT2KusyLCXB9+1gvysScElRxEcMP4FhNKggZYFQowB3yDbFWhgLIckqOAfgQAAOw==';
var underline_img=Array(underline_norm_src,underline_over_src,underline_down_src);


var ramka_norm_src='data:image/gif;base64,R0lGODlhGAAYANUAAAAAAP////Tz9PPy8/Pz9PLy8/P09PLz89bX1/P08/Lz8vHy8e3u7fT08/Pz8vLx8e7t7evq6v7+/vz8/Pv7+/r6+vn5+fj4+Pf39/b29vT09PPz8/Ly8vHx8fDw8O/v7+3t7ezs7Orq6unp6efn5+bm5uXl5d/f393d3dvb29ra2tjY2NfX19XV1dPT09LS0s/Pz87Ozs3NzczMzMvLy8nJycfHx8bGxsTExMPDw8LCwsDAwL6+vr29vby8vP///yH5BAEAAD8ALAAAAAAYABgAAAb/wN/P5+vxdjtdDnez1Wq0mUwWgwmFPlJgy+16uSYsSULQNBKNdENjELQFmo3BMAn7AgfHQOEoODYcHHyAfoAbEzEBPQEdCx2PC46PjY8Pkh0TMgE8AR6en6ChoJkBOwEfHwCqq6ytqBMzpQEQIABft7YMEzQBOgEhIbbAw8TDwhM1ATkBIiK2qxGrzqrOzMgBOAEjI88B3d1btiMTNgE3AS4sz6reACXeAScoti4Z5+UvL9/wAPoB+bZeYMiWDCC/duv6BcSwLJkLF/TQSdziggu9C754tWhha6PHjx47WjAVi4W6VihXBUAwMoCmFTBvyVxRgZMmFThz6typk8KiOkQ8g/KkcAdGgA0pkipdyjTpoTs/TGyYSrWq1apZAggxEWPKDBpPbNzAkUMHEh49iGi58kOm2y1CggAAOw==';
var ramka_over_src='data:image/gif;base64,R0lGODlhGAAYANUAAAAAAP////j3+Pf3+Pf4+OXm5vf49/b39vP08/j49/f29vTz8/7+/vz8/Pv7+/r6+vn5+fj4+Pf39/b29vX19fT09PPz8/Ly8vDw8Ovr6+np6ejo6Ofn5+bm5uXl5ePj48/Pz87Ozs3NzczMzMvLy8nJycfHx8bGxsTExMPDw8LCwsDAwL6+vr29vby8vP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAC8ALAAAAAAYABgAAAb/wNfL5WqxVitVCnUylUqkkUgUAgmFLk5gy+16uR4shxEpm89ocyPsChASAkNiMEhEJIb63S6JNEIBLQETBxOGBwqFhomHhhMNIgEsg46VlpeQASsBFBQAn6Chop0NI5oBCxYAX6yrCA0kASoBFqq0tbi5tasWDSUBKQEXF6ugxJ/HAMTCvgEowsvFAdKrW6sXDSYBJwEfHcWf0wAY0wEZGqsfEtzaHx/U5QDv3fMfEc+/7vCg4vLpEcHy1etGcMsHLukgzIrlwcOqhhAjQnz4YJOpDt9EaeRXoGKASBxCshrJwcGkSBtSqlzJcqUDQYBaymzpoA2IABE06NzJs6dOKT9tXnioQLSo0aNGswQQ4iHElBEknpg4gSKFCiQsWhDRcuXFyK9bhAQBADs=';
var ramka_down_src='data:image/gif;base64,R0lGODlhGAAYAOYAAAAAAP////j3+Ozr7Ojn6OTj5N3c3dzb3NPS09LR0qinqIB/gN3d3tzc3bW1tqqqq/X29u7v7+3u7tzd3cvMzMnKyre4uPX29fP08/Dx8O/w7+vs6+bn5uXm5eHi4drb2tfY19bX1tPU08/Qz83OzcjJyMfIx7e4t3p6eXd3dvj49+vr6ujo5+bm5dvb2tra2dbW1c/Pzs7Ozby8u7a2tbS0s/Tz8+no6Nva2tDPz8zLy7Kxsfz8/Pv7+/n5+fb29vX19fT09PPz8/Ly8u/v7+3t7ezs7Ovr6+rq6ufn5+Xl5eTk5OPj4+Li4uHh4eDg4N/f397e3t3d3dzc3Nvb29ra2tnZ2djY2NfX19bW1tXV1dTU1NHR0dDQ0M/Pz87Ozs3NzczMzMrKysXFxcHBwb6+vrq6urm5ubi4uLa2trS0tK+vr62traioqKWlpaOjo5ubm4GBgX9/f319fXJycm5ubv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAHYALAAAAAAYABgAAAf/gHaCg4SFhoVxdXQpjCkoj49zknJycXMBg3F0cG4PbGxrazs7NWo0aWhnZmZpbJh2dXAPJ2VlZLdjuSYlYmEyXl5iZK90bmlkJTphJF8jXQhbWlhWH1MGWF+vKW1mJl5dCQhaWdMuDVFQHkxKUFnabWdjYN/hW+RWLwdSUE9NDFbaFKAZA6CgwYMIpbzQ5uYEwQAQI0qMCCAAlVco3DggUzHMFy9cEIiAMY3KlAYVJ2B8o4ZjAINeDGoxSKVilJU1XFbc+bInxIpPMCqYEWZnwZcAoPQ8sqKik1dz1JgIwbNqhIoYhFRsAjVNhStVkRoFAKRiAahoKFSpqCQAiwAbfCIOoRhgySs5Z8AcqJjkBpIBRYhkGGIDyA8VFTu8WmDGCwOEkA8G4PAqzowcT5JM3CxRsyDLXZ74NSJB8JAgEH4I8NGjBw8gBO5aAFOFSQsOLP4WiaBhcOELQIg8FRRgDZkYIKzgmLKvH5MlS5RwSMJi+CDO2CUe2s59UCAAOy==';
var ramka_img=Array(ramka_norm_src,ramka_over_src,ramka_down_src);

var line_norm_src='data:image/gif;base64,R0lGODlhGAAYAOZFAPz8/Ly8vM3NzcnJycDAwO3t7S4uLu7t7e3u7erq6/T088LCwsvLy9bX18zMzMTExPPz8r29vefn58fHx8PDw87OzvP09CwsLL6+vi0tLcbGxuXl5fHy8fT09PTz9PLy8/Lx8dfX1vPy8/f398/Pz/n5+fv7+/Lz8uvq6vLy8vHx8vPz9NfW1vPy8vr6+vLz8/b29vj4+P7+/vP089fW1+3t7urq6vHx8dfX19vb29jY2NXV1e/v7+zs7Onp6fDw8NPT09LS0vPz89ra2v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEUALAAAAAAYABgAAAf/gEVFAQERGAQECxQPGhMDAwwOAgIVJIKCARJEm5ydnpwbmBIyKx0KMwqpCh0WHq0eHUIWFgChAUQvECInEB9CLR8pJ0IivRBCKUIAFUQRRDccN9LRKtI3INIg0dIAAkQYRD/i4+Tl5N1EBEQ87O3u7+4ADulEBwU1CPYIBQX6+v0HEABgQGQBkR4IEypcqBDAACIUiNiYmMBGAhQVKU6ciNGGQyIPiPgYSbKkyZIAJhDRQAQIjgsXMmQwQLOmAZkwcQCBwVJlkJ+fgm4KMiLkw59IkypVOiLiQyBQo0qdKjWGQYI7smrdynVrCXXzcOAIIbYBiwY40Iodi4NG2q9ETrzpmEu3rt26LsB5G8K3r9+/fk04Ywa4MGATt0gQEZKjsePHkBsru1Vkg5DLmDNrzpyJiKANFSY5YPBogoYHFBYgwhCBkKZLRYTK3iQoEAA7';
var line_over_src='data:image/gif;base64,R0lGODlhGAAYANU1APz8/Ly8vMDAwERERMnJyc3NzfTz8/P088bGxsLCwsfHx8PDw0NDQ+Xm5r29vb6+vsTExMvLy/j4987OzszMzPf3+Pb39vv7+0VFRff398/Pz/f49/r6+vj3+Obm5ff29vj39+bl5vn5+fb29+bl5fPz9Pf4+P7+/ubm5unp6fX19fT09OXl5efn5/j4+PPz8/b29ujo6PLy8uPj4////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADUALAAAAAAYABgAAAb/wFotEHA8BILEAoJQEAgRSqEw0QiFgRZty+16uSxs6+Qqm89oMyAcoJkknY2k4gJVMhtXZy5xZVwAEzQONDAWMIiHI4gwH4gfh4gABTQPhYyYmZqTNAI0KqChoqOiABSdNAYvJQeqBy8vrq6xBgcAETQJNLC8vb6+AAQ0CzQyxsfIycjBNBDFytDJAAo0CDQzKAwMA9wDGN/dA9ooMxnW1DPpX+tbMy7Owuny8/T0LsTx9fr0Irq4LAADChwokIOnUyhQeEjYgEQDFA8TKkQRAqJBGpRaaNzIsSPHC5YoxRhJsqTJkhcICTrJ8uSFNhpouEhBs6bNmzQBtanBYoXPIp9AgwLNQkMIiwlTKER4ogABhAUJkDxwQETLlRrssm4REgQAOw==';
var line_down_src='data:image/gif;base64,R0lGODlhGAAYAOZ/AMHBwXp6edjY2H19fcXFxczMzODg4N7e3vLy8tDQ0KWlpfT09Ozs7K2trfDx8Obn5tTU1Ono6OTk5OLi4urq6u7v7/n5+dPS0y4uLrKxscrKysjJyKqqq/b29nd3doGBgbi4uLa2tr6+vvr6+7q6urS0tJubm8/Pz9fX193d3dvb29ra2s7OztbW1tzc3XJycry8u9zc3PX29dnZ2e/w7/Tz893d3vX19efn525ubtva2tzd3dfY19/f39PU08nKyqOjo9rb2s7Ozdzb3NbX1uPj4+Hi4eHi4tHS0dHR0e3t7ebm5c/PztbW17m5uc7NzdDPz9ra2fT086ioqNbW1fj3+NXV1eTk48vMzOTj5OHh4e/v78vLzOLh4ujo5+jn6MfIx9LR0uXm5X9/f+Xl5bS0s6+vr+3u7szLy+rp6re4uPv7+7e4t/z8/Ozr7PX29uvs68/Qz4B/gLW1tvj497a2tainqPv8+/P089vb2s3Ozc3Nzd3c3c7Oz////wAAACH5BAEAAH8ALAAAAAAYABgAAAf/gH+Cg4SFhoUfOS8ejB4Bj48DkmNjHwN+gx8vJgocDQ1mZhkZZSV1ISBOJCQhDZh/OSYcbCIiALcEuWAbGgVCJycaAK8vCiEAG2gFeixxCRcQVigzQTF8KCyvHlMkYCcJYRdWLdN5Lgc9RkVkPS3aU04Ee9/hEOQzUUMpPQYTNjPa7ICQt6dPgiTQmgiIomKfliMpomhTwIaABjR7WCRAEg2FAGrnDOhQ8SqAgjkANHApwOIEQh9UpqmIcW7FjpJASiDjVeCJS2hWiAhY0ZDHAZxlAID5sfIXwmgtPqrYgcJASTswCmDYyrWrVwNaXg0oAYbIUT9o06pVO0FsiB8CqsCuwxEhDQMlFWggwHOjg4MsYkFgWdFl3QMvFODgdYCgRt8qCCS8GuNkz5ArZOhScKNkC2PHHehYqCHmlRwSJ2ws0XyXBuMFfUWPWPDg1QcYUAzgSEOBwRnPCKTICG1hxB0ZOGzDSGAgQu/fr990qGJhzZo2N75MVrNnRZElhzfjdd34howbW8IK8mMGABMeM3TE2NeviAQJZB7g8KJ+0Nr/AL5yyIAE/hEIADs=';
var line_img=Array(line_norm_src,line_over_src,line_down_src);

var smile_img='data:image/gif;base64,R0lGODlhGAAYAPcAAAAAAP////Tz9PPy89fW1/Pz9PLy8+3t7urq6/P09PLz89bX1/P08/Lz8vHy8e3u7dbW0ujo5fT08/Pz8u7u7dnZ2NjY19fX1vreHPbaHPLWHP/iIP/mIPreIPriIPLSGObGGPbWHLqhGOrGFObCFN6+FPLOGO7KGMaqFObCGMKlFOLCGMKlGN62EOrCFL6dEOa+FJV9FKKTVtDPy+jn4+Lh3dfW0t6yEOa6FLaRELKRFJF1EK6NFJV5FKOZdqacea6lhNqqDNalDNKhDM6hDOKyELaNEI1xFJ6Tb62jgaSaerOpibqwkK6BCMqZDLaJDKV9DI1tEHFZGEA0EHVhKHllLH1pMJiETp2KVJ6LVqiacKKUbKudc7Gje+Lh3rKBCKp9CIllDGlQEHFZHIllEKWWdriqivLx8e7t7f7+/vz8/Pv7+/r6+vn5+fj4+Pf39/b29vT09PPz8/Ly8vHx8fDw8O/v7+3t7ezs7Orq6unp6efn5+Xl5dvb29ra2tjY2NfX19XV1dPT09LS0s/Pz87Ozs3NzczMzMvLy8nJycfHx8bGxsTExMPDw8LCwsDAwL6+vr29vby8vP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJMALAAAAAAYABgAAAj/ACdNkiQpEqRHjxw1YrRIUaJEiA4ZMlSIkECBkvYE2Mixo0eOfDDuSVMgjgQGElJKiDNFQAIBAuLISZBATUhJARRMGNBggoEpU342AOpzgpw5ctQUChApAB0HdKI6iLDEihQrSWjQOQM1qhpDASAFqEO2jh0mPVSAMFHixREzdsrW+RrgUQA7eCnIEKHBg98OIVLoyEIBrx01h+oGQHPnQBcWGcYA5QB0DAkjXNCgeaAGUQBHAfDg8RJDwxgOqFN3GNMiSg3RahIFaBQgT54fKDqk3r0hhIsnZRDkiR2AUQA9eqyA8LB7d4gRRKogV6MowKIAggCNOcG8OWrfQsYA4RIE53r1QYOsrMDAIUzzMB9gOKmC/o1x2eh9vAihG6j/DCcU8QUS9dEmmyCCzLADCPxtEMYYYWRgAg5DhDEDgm6A5lkgHGqRAwkfhCDiByfgIAQYW3AYSBt2JQYIIBdYgAUPLbgwggsw3DAEFFdYQAAgC7AYAFh/FPlHBUBE8QQRQTjRBBlAVGDkH2yIBZYfWGZpgxJViEGFEhBkmeUaTS0l5ploirkGToQEIEcfcMYp55xwJoXTJHzIoeeefPbJZ0YBCMRHIRMdgshDiizCSCOOIARJJARpdNEkH1X6kUABAQA7';

if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
