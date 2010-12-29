// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function vkPageApps(m) {
if (m==1) {	pageMenu='';

//if (!location.href.match('act=s') && !location.href.match(/\/app\d+/i)) if (getSet(11) == 'y') 	pageMenu+='<a href="javascript:IDAppsList_get();">- '+IDL("LinksGet")+'</a>';

if (location.href.split('act=s')[1] || location.href.match('/app') && !location.href.match('/apps')) if (getSet(2) == 'y')
	pageMenu+=IDApps(null,m);



return pageMenu;
} else {
// functions

if (location.href.split('act=s')[1] || location.href.match('/app') && !location.href.match('/apps')) if (getSet(2) == 'y')
	IDApps();

//if (!location.href.split('act=s')[1])	if (getSet(11) == 'n') IDAppsList_get();


if (location.href.split('act=s')[1] || location.href.match('/app') && !location.href.match('/apps')){
    if (ge("flash_player_container")){
      ReplaceAppLinksText();
      if (getSet(44)=='y') AddEmulLink();// emulate install link 
    }
    if (ge("app_container_outer")){
      AddRestAppLink(); SetAppDescId(); AddSwichLink();
      if (getSet(42)=='n') ge(app_desciption).style.display='none'; //hide description   
      if (getSet(43)=='y') AddInviteAllFriendsApp(); // add invite all friend link
    }
}   

}
}


/////////////// begin of KiberInfinity addon /////////
function vkAddAppMenu(menu){
  var header=ge("header").getElementsByTagName("h1")[0];
  var b=document.createElement("b");
  b.innerHTML='<a href="#" id="'+menu.id+'">'+menu.name+'</a><span class="divider"> | </span>';
  header.appendChild(b);
  var items=[];
  for (var i=0;i<menu.items.length;i++){
    var item={l:menu.items[i].name};
    if (menu.items[i].href) item.h=menu.items[i].href;
    if (menu.items[i].onclick) item.onClick=menu.items[i].onclick;
    items.push(item);
  }
  items.push(null);
  var ddown = new DropdownMenu(items, //window.dropDownAppSettings2 
      { target: ge(menu.id),
        showHover: false, offsetTop: -3,  containerClass: 'appSettings',  updateTarget: false,  align: 'left',
        onShow: function() {window.dropDownToggle = false; toggleFlash(0); },
        onHide: function() { if (!window.dropDownToggle) toggleFlash(1); }
      }
  );
}
/* EXAMPLE
javascript: vkAddAppMenu({name:"my",id:"vkapp",items:[
{name:"Download",href:"http://vkopt.net.ru/"},{name:"Alert",onclick:function(){alert('qwe')} }
]});
*/

function ReplaceAppLinksText(){
var node=document.getElementById("content").getElementsByTagName('div')[1];
var alinks=node.getElementsByTagName('a');
for(i = 0; i<alinks.length; i++ ){
  var alink=alinks[i];
  if (alink.href.indexOf('apps.php?act=join')!=-1) alink.innerHTML=IDL('AppAdd2Me')
  }
}
/* Instalation emulate */
function EmulateMyPageApp(){
ge('emdiv').style.display='none';
flashVars.user_id = flashVars.viewer_id;
flashVars.is_app_user='1';

var plid=(typeof attributes =='undefined') ? 'flash_player' :attributes.id;
var st=ge('content').innerHTML.split('swfobject.embedSWF(')[1];
if (st){
  st=st.split(');')[0];
  st=st.split('flash_player_container');
  st=st[0]+plid+st[1];
  eval("swfobject.embedSWF("+st+");");
} else {
  //st=ge('content').innerHTML.split('SWFObject(')[1].split(');')[0];
  so.variables=new Object();
  so.params=new Object();
  each(params, function(k,v){so.addParam(k, v);});
  each(flashVars, function(k,v){so.addVariable(k, v);});
  so.useExpressInstall('swf/expressinstall.swf');
  so.write('flash_player_container');
}

}

function AddEmulLink(){
if (flashVars.is_app_user=='0'){
    ge('searchResults').innerHTML='<div id="emdiv"><ol id="nav"><li><center>'+
    '<a href="javascript:EmulateMyPageApp();void(0);">'+IDL('AppInstEmul')+'</a>'+
    '</center></li></ol></div>'+
    ge('searchResults').innerHTML;}
var apmnu=document.getElementById("content").getElementsByTagName('div')[1];
if (!apmnu.innerHTML.match("showSettingsBox")){
apmnu.innerHTML+='<span class="divider">|</span><a href="javascript: showSettingsBox('+app_id+', 0, true);">['+IDL("Settings")+']</a>';
}
}
/* Invite Friends to App */
if  (!my_friends && !friend_pack){
var my_friends=Array();
var friend_pack=Array();}
var vk_FrInvArr= new Array();
var invincapp = 30;
var vkInvAppError='',vkAppTotalInv=0;

var vk_FrInvArr= new Array();
function InvateMyFriend2App(){
      Ajax.Post({
        url: 'friends_ajax.php',
        onDone: function(ajaxObj, responseText) {
         friends_Data = eval('(' + responseText + ')');
         my_friends.length=0;
         curinv=0;
         invcnt=0;
         var idx=0;
         my_friends=[];
         each(friends_Data.friends, function(i, item) {
            my_friends[my_friends.length] = item[0];
         });
         //alert(my_friends);
          invcnt=my_friends.length;
          for(i=0; i<my_friends.length; i++){
           friend_pack[friend_pack.length]=my_friends[i];
            if ((friend_pack.length==invincapp) || (i==(my_friends.length-1))){
              vk_FrInvArr[idx++]=friend_pack.join(",");
              friend_pack.length=0;
            }
          }
        vkSendAppInviteReq(0);
        }
     });
}


function vkSendAppInviteReq(idx){
mbi.content(IDL('InvProgr')+(idx*100/vk_FrInvArr.length).toFixed(0)+"%<br>Invited:"+vkAppTotalInv+'<br><br>'+vkInvAppError);   //curinv+'/'+wcnt
if (idx>=vk_FrInvArr.length) {
  setTimeout("mbi.content(app_invited_text+'<br>'+vkInvAppError); vkInvAppError='';",1500);
  mbi.removeButtons();
  mbi.addButton({label:'OK',onClick:function(){mbi.hide();}})
}

var onDone=function(Obj,Text){ 
      r=eval('('+Text+')'); 
      if (r.error) vkInvAppError+=r.error+'<br>';
      if (r.result) vkAppTotalInv+=r.result;
      if (idx<vk_FrInvArr.length){ 
          setTimeout(function(){vkSendAppInviteReq(idx+1);},300);     
      }  
   }
var onFail=function(Obj,Text){ alert("Request error \n"+text);  setTimeout(function(){vkSendAppInviteReq(idx);},300);  }
var onCapHide=function(){  mbi.show(); }
var options = {onSuccess: onDone, onFail: onFail,onCaptchaHide : onCapHide};
if (vk_FrInvArr[idx].length>0)
  Ajax.postWithCaptcha("/apps.php?act=a_invite_friends", {friends: vk_FrInvArr[idx], app_id: app_id, app_hash: appHash}, options);
else
  onDone(null,'{ok:1}');
}


function SubminInvAllApp(){
  mbi = new MessageBox({title:IDL('InvBoxTtl')});
  var msgcontent=IDL('InvMsgApp');
  mbi.addButton({label:IDL('Cancel'), style:'button_no',
  onClick:function(){mbi.hide();}}).addButton({label:IDL('InvBtn'),
  onClick:function(){
      mbi.content(IDL('InvStart'));
      mbi.removeButtons();
      mbi.addButton({label:IDL('Cancel'), style:'button_no',onClick:function(){mbi.hide();}});
      InvateMyFriend2App();
  }}).content(msgcontent).show();
}

function SelectAppInviteType(){
  mbi = new MessageBox({title:IDL('InvBoxTtl')});
  var msgcontent='';
  msgcontent+='<div id="AppInvBar">';
  msgcontent+='<ol id="nav">';
  msgcontent+='<li><center><a href="javascript: showInviteBox();">'+IDL('InvNormalApp')+'</a></center></li>';
  msgcontent+='<li><center><a href="javascript: SubminInvAllApp();">'+IDL('InvAll2App')+'</a></center></li>';
  msgcontent+='</ol></div>';
  mbi.addButton({label:IDL('Cancel'), style:'button_no',onClick:function(){mbi.hide();}});
  mbi.content(msgcontent).show();
}

function AddInviteAllFriendsApp(){
const rhdr='javascript: showInviteBox();';
/*var slink2='javascript: SubminInvAllApp();';
if (ge('content').innerHTML.indexOf(rhdr)!=-1){
document.getElementById("content").getElementsByTagName('div')[1].innerHTML+=
'<span class="divider">|</span><a style="font-weight:normal" href="'+ slink2+ '">'+IDL('InvAll')+'</a>';}
*/
var alinks=document.getElementsByTagName('a');
for(i = 0; i<alinks.length; i++ ){
  var lnk=alinks[i];
  if(lnk.href==rhdr) {
  lnk.href='javascript: SelectAppInviteType();';
  lnk.innerHTML='['+lnk.innerHTML+']';
  break;
  }
}

}
/* End Of Invite Friends to App */

/* Application description tool */
function SetAppDescId(){ge('app_container_outer').nextSibling.nextSibling.id='app_desciption';}

function SwichDescrVis(){
  var disp=ge('app_desciption').style.display;
  if (disp=='none'){ disp=''; setCfg('42','y');
  }else{  disp='none';  setCfg('42','n');  } ;
  ge('app_desciption').style.display=disp;
}

function AddSwichLink(){
  var swlink='javascript: SwichDescrVis();';
  ge('bottomlinks').innerHTML='<a href="'+swlink+'">'+IDL("SwichAppDescr")+'</a><span class="divider">|</span>'+ge('bottomlinks').innerHTML;
}
/* End of app descr tool */

function RestApp(){
var el=(ge('app_wrapper_outer'))?'app_wrapper_outer':'app_container_outer';
ge(el).style.display='none';
setTimeout("ge('"+el+"').style.display=''",700);
}

function AddRestAppLink(){
var slink2='javascript: RestApp();';
var html='<a style="font-weight:normal" href="'+ slink2+ '">'+IDL("ResetApp")+'</a>';
vkAppAddOptLink(html);
}
/////////////// end of KiberInfinity addon /////////

function vkAppAddOptLink(html){
if (ge('dropDownSettings')){
      vkAppAddBToHeader(html);
  } else { 
    document.getElementById("content").getElementsByTagName('div')[1].innerHTML+='<span class="divider">|</span>'+html;
  }
}
function vkAppAddBToHeader(html){
      var header=ge("header").getElementsByTagName("h1")[0];
      var b=document.createElement("b");
      b.innerHTML=html+'<span class="divider"> | </span>';
      header.appendChild(b);
}
function IDApps(domain,m) {
/* applications */
friends_select_all='Выделить всех';
var el=(ge('app_wrapper_outer'))?'app_wrapper_outer':'app_container_outer';
if (domain == null && ge(el)) {
if (ge(el).innerHTML.match(/iframe/i)) return;

if (flashVars && flashVars.swf_url){
  var st=flashVars.swf_url;
} else {
  var st=ge('content').innerHTML.split('embedSWF')[1];
  if (st) {
  st=st.split(';')[0];
  st=st.split('"')[1];
  if (st.match('api_wrapper.swf')) {st=unescape(flashVars.swf_url);}
  } else {
    st=ge('content').innerHTML.split('so = new SWFObject');
    st=st[1].split(';')[0];
    st=st.split("'")[1];
  }
}
var slink=st;
if (m!=1) {
  var html='<a style="font-weight:normal" href="'+ slink+ '">'+IDL("download")+'</a>';
  vkAppAddOptLink(html);
}
vksetCookie('remixmid',vkgetCookie('remixmid'),365);
return '<a href="'+slink+'"> - '+IDL("download")+'</a>';}
else vksetCookie('remixmid',vkgetCookie('remixmid'),365);
}

function IDAppsProf() {
if (document.getElementById('apps'))
document.getElementById('apps').getElementsByTagName('div')[6].innerHTML='<a href="javascript:IDAppsProf_get();">[ '+document.getElementById('apps').getElementsByTagName('div')[6].innerText.split('.')[0]+' ]</a>';
}

function IDAppsProf_get() {
mid = document.getElementById('mid').value;
if (document.getElementById('apps'))
document.getElementById('apps').getElementsByTagName('div')[6].innerHTML='<a href="#">'+document.getElementById('apps').getElementsByTagName('div')[6].innerText.split('.')[0]+'</a>';
/* [DownloadSwf] na stranice */
if (document.getElementById('apps')) {
vkStatus('[AppsList Loading]');
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
if (location.href.split('club')[1]) mid='-'+mid;
http_request.open("GET", "/apps.php?mid="+mid, false);
http_request.send("");
var response = http_request.responseText;
var mass=response.match(/<A href=".+class="appLink">.+<\/a>/img);
if (ge('mid').value==remixmid()) mass.splice(0,1);
mass=mass.join('</li><li class="app" style="font-size:+1;">')
var list='<li class="app" style="font-size:+1;">'+mass+'</li>';
/*var apps = response.split('<div class="appRow">');
var list='';
appslength=((apps.length>20) ? 20 : apps.length);
for (i=1; i<appslength; i++) {
if (apps[i].split('.vkontakte.ru').length>2) {
 for (k=0; k<10; k++) if (apps[i].split('http://')[k].match('dataWrap')) {
  list+='<li class="app" style="font-size:+1;"><a href="http://'+apps[i].split('http://')[k].split('</a>')[0].replace(/&amp;/gi,'&')+'</a><br>';
  break;
 }
}
else list+='<li class="app"> <a href="/app'+apps[i].split('/app')[2].split('</a>')[0].replace(/&amp;/gi,'&')+'</a><br>';

if (document.getElementById('myLink'))
 list+='<small><a align=right onClick="javascript:vkremoveApp('+apps[i].split('removeApp(')[1].split(')')[0]+');">'+IDL("delete")+'</a></small>';
 list+='  <small><a class="dapp" id="dap'+apps[i].split('id=\'remove')[1].split('\'')[0]+'"></a></small>';
list+='</li>';
}*/
document.getElementById('apps').getElementsByTagName('div')[8].innerHTML=list;
/* [download] application - na stranice profilya */
if (document.getElementById('apps')) {
var names = geByClass('dapp');//.getElementsByTagName('a')[0];
for (j= 0; j< names.length; j++){
 var apid = names[j].id.split('dap')[1];
http_request.open("GET", "/app"+apid, false);
http_request.send("");
var response = http_request.responseText;
var slink = response.split("<embed")[1];
if  (slink){
slink = 'http'+slink.split('http')[1].split('"')[0];
names[j].href=slink;
names[j].innerHTML=IDL("download");
IDApps(slink);
} else {

var st=response.split('embedSWF')[1].split(';')[0];
st=st.split('"')[1];
if (st.match('api_wrapper.swf')) {
    st=unescape(response.split('swf_url: escape("')[1].split('")')[0]);
    }
var slink=st;
    names[j].href=slink;
    names[j].innerHTML=IDL("download");
    IDApps(slink);
    
/*  var slink = response.split("escape(")[1];
  if  (slink){
    slink = 'http'+slink.split('http')[1].split('"')[0];
    names[j].href=slink;
    names[j].innerHTML=IDL("download");
    IDApps(slink);
    } */
  }
}
}
vkStatus('');
}
if (http_request.responseText) new_side(http_request.responseText);
}

function IDAppsList_get() {
if (location.href.split('mid')[1] || !location.href.split('apps.php')[1]) {
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
var names = document.getElementById('searchResults').getElementsByTagName('ul');
for (j= 0; j< names.length; j++) {
var apid = names[j].getElementsByTagName('a')[0].href.split('app')[1]; if (apid.split('_')) apid=apid.split('_')[0];
http_request.open("GET", "/apps.php?act=s&id="+apid, false);
http_request.send("");
var response = http_request.responseText;
if (response.split(' id="noApps"')[1]) {
names[j].innerHTML+='<li><br>'+ response.split(' id="noApps">')[1].split('</div>')[0]+'</li>';
}
else {
var slink = response.split("<embed")[1].split(">")[0];
slink = slink.split('src="')[1].split('"')[0];
names[j].innerHTML+='<li><a href="'+ slink+ '">'+IDL("download")+' appID='+apid+'</a></li>';
//names[j].innerHTML+='<li><a href="apps.php?act=quit&id='+apid+'">'+IDL("delete")+'</a></li>';
IDApps(slink);
}
var date = new Date();var curDate = null;do {curDate = new Date();}while(curDate-date < 1500);
}}
else if (location.href.split('=all')[0]) {
var names = document.getElementById('searchResults').getElementsByTagName('div')[0].getElementsByTagName('div');
for (j= 0; j< names.length; j++) {
if (names[j].getElementsByTagName('div')[2]) {
var apid = names[j].getElementsByTagName('div')[2].innerHTML.split('app')[1]; if (apid.split('_')) apid=apid.split('&')[0];
http_request.open("GET", "/apps.php?act=s&id="+apid, false);
http_request.send("");
var response = http_request.responseText;
var slink = response.split("<embed")[1].split(">")[0];
slink = slink.split('src="')[1].split('"')[0];
names[j].getElementsByTagName('div')[2].innerHTML+='<br><a href="'+ slink+ '">'+IDL("download")+'</a>';
IDApps(slink);
}}}
if (http_request.responseText) new_side(http_request.responseText);
}

function vkremoveApp(id, gid, hash) {	
var http_request = false; http_request = new XMLHttpRequest();
if (http_request.overrideMimeType){}
if (!http_request) {alert('XMLHTTP Error'); return false; return http_request; }
http_request.open('POST', 'apps.php?act=a_remove', false);
http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
http_request.send('id='+id+'&gid='+gid+'&hash='+hash);
if (http_request.responseText.match('joinApp')) ge('app'+id).innerHTML='[DELETED]';
}

function vkinviteFriendsBox() {
//<INPUT TYPE="hidden"  NAME="inv_friends"  ID="inv_friends"  value="3789334,3451864,3476823" >
//Ajax.Post({url: "apps.php?act=a_invite_friends",
// query: {friends: ge('inv_friends').value,app_id:app_id,app_hash:app_hash}, onDone:friendsInvited});
var http_request = false; http_request = new XMLHttpRequest();
if (http_request.overrideMimeType){}
if (!http_request) {alert('XMLHTTP Error'); return false; return http_request; }
http_request.open('POST', 'apps.php?act=a_invite_friends', false);
http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
http_request.send('friends=3789334&app_id=162813&app_hash=4494b418e0b22679ba');
alert(http_request.responseText);
}

function vkAppsSel() {
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("GET", "/apps.php?act=a_friends&app_id="+app_id, false);
http_request.send("");
var tdata = eval('(' + http_request.responseText + ')');
 if (tdata.script != undefined) {
  eval(tdata.script);
 } var list=new Array();
for(i=0;i<defFriends.length;i++) list[i]=defFriends[i][0];
/*caList = http_request.responseText.split('<ul class="FG">')[1].split('</ul>')[0];
var caListAr = caList.split('><a');
list='<div id="FGr"><input type=hidden>'+IDL('selall')+'<br><br>';
for (i=2; cla=caListAr[i]; i++) {
	list+='<input type=checkbox>'+cla.split('>')[1].split('</a')[0]+'<br>';
}
list+='<a href="javascript:IDAppsGRList();" align=center>'+IDL('selgrs')+'</a></div>';
*/
/*var FI=document.createElement('script');
FI.appendChild(document.createTextNode(frInfo));
document.getElementsByTagName('body')[0].appendChild(FI);
vkBox('clear');
vkBox(list); */
setTimeout(IDAppsSelect_tag(list,0),1200);
}
function IDAppsGRList() {
var groups=0; value=1; var bin='';
for (i=0; val=document.getElementById('FGr').getElementsByTagName('input')[i]; i++) {
	if (val.checked) {groups=groups+value; bin+='1';}
	else bin+='0';
	value=value*2;
}
document.getElementById('FGr').style.display='none';
list=new Array(); var j=0;
for (i=0; i<friendsInfo.list.length; i++) {
ok=0; value=256; g=8;
fg = friendsInfo.list[i][2].fg;
for (a=0; a<9; a++) {
if (fg >= value) { fg=fg-value; if (bin.charAt(g)=='1') ok++; }
value=value/2; g--;
}
if (fg > 0) alert('O_o '+fg);
if (ok>0) list[j++]=friendsInfo.list[i][0];
}
vkBox('clear');
setTimeout(IDAppsSelect_tag(list,0),1200);
}
function IDAppsSelect_tag(list,sel) {
if (list[sel]) { num=20;
ids=''; j=0; idd=new Array();
for (i=sel;(i<sel+num)||(i<list.length-1);i++){
idd[j++]=list[i];
if (list[i].length>1) idd[j]=list[i][0];
} ids=encodeURIComponent(idd.join(','));
var http_request = false; http_request = new XMLHttpRequest();
if (http_request.overrideMimeType) { }
if (!http_request) { alert('errorXMLHTTP'); return false;return http_request; }
http_request.open('POST', 'apps.php?act=a_invite_friends', false);
http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
http_request.send('friends='+ids+'&app_id='+app_id+'&app_hash='+app_hash);
sel=sel+num;
vkStatus('');
vkStatus('[ '+sel+' / '+list.length+' ]');
setTimeout(function(){IDAppsSelect_tag(list,sel)},1500);
}
else vkStatus('finished');
}

if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;