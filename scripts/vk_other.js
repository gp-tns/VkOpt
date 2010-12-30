// ==UserScript==
// @name          VKopt_Other_function
// @description   (by KiberInfinity id13391307)
// @include       http://*vkontakte.ru/*
// @include       http://*vk.com/*
// ==/UserScript==


function onGetMails(req){
var resp=req.responseText;
msgdiv=document.createElement('div');
msgdiv.id='MsgPageTemp';
msgdiv.innerHTML=resp;
vkMsgBox(msgdiv.innerHTML);
}

function PostIndexToReply(elem){
 ge('post').value+=elem.innerHTML;
 var puname=elem.parentNode.parentNode.parentNode.getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerText;//innerHTML;//innerHTML.match(/>(.+)<\w/i)
 //alert(puname);
 //puname=(puname)?' '+puname[1]:'';
 ge('post').value+=puname+',\n';
 window.scroll(0,getXY(ge('post'))[1]);
 ge('post').focus();
}

function SetClickPostIndex(){
 vkaddcss('.postIndex {cursor: hand;}');
 var nodes=geByClass("postIndex");
 for (var i=0;i<nodes.length;i++){
  if (!ge(nodes[i].id)){
    nodes[i].id='pind'+i;
    nodes[i].innerHTML='<a onclick="PostIndexToReply(this);">['+nodes[i].innerHTML+']</a>';
    }
 }
}

function AddHideCoins(){
if (ge('left_money_box'))
  ge('left_money_box').innerHTML+='<br><a style="cursor: hand;" onclick="hide(\'left_money_box\');">['+IDL('txHide')+']</a>';
}


// DATA SAVER
var VKFDS_SWF_LINK='http://cs4785.vkontakte.ru/u13391307/90ea533137b420.zip';
var VKTextToSave="QweQwe Test File"; var VKFNameToSave="vkontakte.txt";
function vkInitDataSaver(){
  if (!window.SWFObject) attachScript(12,'/js/lib/swfobject.js');
}
/*  vkSaveText();
  vkInitDataSaver();
*/
  
function vkOnSaveDebug(t,n){/*alert(n+"\n"+t)*/}
function vkOnResizeSaveBtn(w,h){
			ge("vkdatasaver").setAttribute("height",h);
			ge("vkdatasaver").setAttribute("width",w+2);
			/*
      ge("vkdatasaver").style.width=w+2;
			ge("vkdatasaver").style.height=h;
      */
			hide("vkdsldr"); show("vksavetext");
			return {text:VKTextToSave,name:VKFNameToSave};
}
function vkSaveText(text,fname){
  VKTextToSave=text; VKFNameToSave=fname;
  var html = '<div><span id="vkdsldr"><div class="box_loader"></div></span>'+
             '<span id="vksavetext" style="display:none">'+IDL("ClickForSave")+'</span>'+
             '<div id="dscontainer" style="display:inline-block;position:relative;top:8px;"></div>'+
             '</div>';
  if (!window.DataSaveBox) DataSaveBox = new MessageBox({title: IDL('SaveToFile')});
  var Box = DataSaveBox;
  //var Box = new MessageBox({title: IDL('SaveToFile')});
  vkOnSavedFile=function(){Box.hide(200);};
  Box.removeButtons();
  Box.addButton({
    onClick: function(){ Box.hide(200); Box.content(""); },
    style:'button_no',label:IDL('Cancel')});
  
  
  Box.content(html).show(); 
  
  var so = new SWFObject(VKFDS_SWF_LINK,'vkdatasaver',"100","20",'10');
  so.addParam("allowscriptaccess", "always");
  so.addParam("wmode", "transparent");
  so.addParam("preventhide", "1");
  so.addParam("scale", "noScale");
  so.write('dscontainer');    
}
function vkSaveTxt(text,file_name){
  vkInitDataSaver();
  vkWaitForFunc("SWFObject",function(){
    vkSaveText(text,file_name); 
  });
}
//END DATA SAVER

// DATA LOADER
var VKFDL_SWF_LINK='http://cs4788.vkontakte.ru/u13391307/27aa308ec116fa.zip';
function vkLoadTxt(callback,mask){
  if (!window.DataLoadBox) DataLoadBox = new MessageBox({title: IDL('LoadFromFile')});
  var Box = DataLoadBox;

  vkOnDataLoaded=function(text){
    Box.hide(200);
    callback(text);
  }
  vkOnInitDataLoader=function(w,h){
    	//alert(w+'\n'+h);
      ge("vkdataloader").style.width=w+2;
			ge("vkdataloader").style.height=h;
			hide("vkdlldr"); show("vkloadtext");
  }
  if (!window.SWFObject) attachScript(12,'/js/lib/swfobject.js');
  vkWaitForFunc("SWFObject",function(){
      var html = '<div><span id="vkdlldr"><div class="box_loader"></div></span>'+
             '<span id="vkloadtext" style="display:none">'+IDL("ClickForLoad")+'</span>'+
             '<div id="dlcontainer" style="display:inline-block;position:relative;top:8px;"></div>'+
             '</div>';
      Box.removeButtons();
      Box.addButton({
        onClick: function(){ Box.hide(200); Box.content(""); },
        style:'button_no',label:IDL('Cancel')}); 
      Box.content(html).show(); 
      var so = new SWFObject(VKFDL_SWF_LINK,'vkdataloader',"100","29",'10');
      so.addVariable('idl_browse', IDL('Browse'));
      if (mask){
          so.addVariable('mask_name', mask[0]);
          so.addVariable('mask_ext', mask[1]);
      }
      so.addParam("allowscriptaccess", "always");
      so.addParam("wmode", "transparent");
      so.addParam("preventhide", "1");
      so.addParam("scale", "noScale");
      so.write('dlcontainer');  
  });
}
//END DATA LOADER

//functions by UnStoppable ( http://vkontakte.ru/id795251 )
function whbutton() { //add button for invite 20 people from search
  if(location.href.match('people&')&&(location.href.match('&ginv') || location.href.match('&gedit')) ) {
    if (!document.getElementById('usallinvite'))                                            //allinvite()
      searchSummary.innerHTML+='<span style="padding-left: 59px;"></span><a href="javascript:vkGStartInv();" id="usallinvite">  '+IDL("InvAll")+'</a>';
    setTimeout(function(){whbutton();},2000);
  }
}

function allinvite() { //function for button 'invite people on page of search'
  var b=0; var c=new Array();
  var t,a,i;
  a=document.getElementsByTagName('a');
  for(i=0;i<a.length-1;i++)
    if(a[i].href.match('#invite')) {
	  t=a[i].onclick+"";
      t=t.slice(17,-1);
      t=t.substr(0,t.indexOf(';')+1).replace(/ /,'');
	  if(t.match('invite')) c[++b]=t;
	}
  for(i=1;i<c.length;i++)
    setTimeout(c[i],i*1000);
}


function status_icq() { //add image-link 'check status in ICQ'
var t,a,i,icq;
for(i=0;i<geByClass('label').length;i++)
  if(geByClass('label')[i].innerHTML=='ICQ:')
    { a=i; icq=geByClass('label')[i]; break; }
if(a) {	
  var el=icq.parentNode.getElementsByTagName('div')[1];//geByClass('dataWrap')[a];
  t=el.innerHTML;
  t=t.replace(/\D+/g,'');
  if(t.length)                                                                                                                                                   // http://kanicq.ru/invisible/favicon.ico
    el.innerHTML+=' <a href="http://kanicq.ru/invisible/'+t+'" title="'+IDL("CheckStatus")+'" target=new><img src="http://status.icq.com/online.gif?img=26&icq='+t+'&'+Math.floor(Math.random()*(100000))+'" alt="'+IDL("CheckStatus")+'"></a>';
    //'http://status.icq.com/online.gif?img=26&icq='+t//252297701
} }



function vkgetActivityHistory(user_id) {
  if (isVisible('history')) {hide('history'); return;}
	show('historyProgress');
	show('history');
  AjPost('/profile.php', {'activityhistory':'1', 'id': user_id},function(r,t){
	   hide('historyProgress'); 
	   show('historyContainer');
	   ge('historyContainer').innerHTML=t;
  });	
}

function history_status() { //add link 'history of status' if current status equals nothing. Not work on your page.
  var html='<span id="activity_time"><!--<a href="#" onClick="vkgetActivityHistory(cur.oid); return false;">'+IDL("HisStatus")+'</a>--></span>'+
          '<div id="history" style="display: none; background-color: white">'+
          '<div id="historyProgress" style="display: none"><img src="/images/upload.gif"></div>'+
          '<div id="historyContainer" class="history_container" style="display: none"></div></div>';
  if ((!document.getElementById('activity_text'))&&(geByClass('profileName')[0])) {
    geByClass('profileName')[0].innerHTML+=html;
  } 
  if (ge('profile_short')){
    var div=document.createElement('div');
    div.innerHTML=html;
    div.className="clear";
    var ref_node=ge('profile_short');
    var next = ref_node;//.nextSibling;
	  if (next) next.parentNode.insertBefore(div, next);
	  else ref_node.parentNode.appendChild(div);
    //ge('current_info_wrap').appendChild(div);
  }
}

function check_usfr() {
  var t=location.href;
  if(t.indexOf('friends.php?usfr')>-1) //loadFriends('all', t.substr(t.indexOf('usfr')+4));
    location.href="javascript: loadFriends(\"all\", "+t.substr(t.indexOf('usfr')+4)+");";
}
///// END OF functions by UnStoppable

function vk_other_init(){
if ((ge('pageLayout')||ge('page_layout'))){
if(document.location.href.match('/topic-')) SetClickPostIndex();
AddHideCoins();
//if (getSet(51)=='y')
}}
/*
(function(){
document.addEventListener('DOMContentLoaded',vk_other_init, false);
})();*/
if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
