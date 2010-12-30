// ==UserScript==
// @name          Vkontakte Optimizer module (ExUserMenu && other users functions)
// @description   (by KiberInfinity id13391307)
// @include       http://*vkontakte.ru/*
// @include       http://*vk.com/*
// ==/UserScript==



//  functions for work with users
var vkUsersDomain={};
function isUserLink(url){
if ((!(url.match(/(club|event|photo|photos|album|albums|video|videos|note|notes|app|page|board|topic|write|graffiti\d)-?\d+/i) || 
       url.match(/javascript|#|\.mp3|\.flv|\.mov|http...www/i) || url.match(/\.php($|\?)/i) || 
       url.match(/\/$/i)
      ) || 
    url.match(/(id|profile.php=id)\d+/i)) && !url.match(/http.{3}\w+\.vk.*\/.?/i)){
  return true;
} else return false;
}
function getUserID(url,callback){
 url=String(url);
 if (url.match(/^\d+$/)){callback(url);  return;}
 if (vkUsersDomain[url]){callback(vkUsersDomain[url]);  return; }
 AjGet('groups_ajax.php?act=a_inv_by_link&page='+url,function(r){ // payments.php?act=votes_transfer_get_person&page=durov -captcha
    r=r.responseText;
    var uid=(r)?r.match(/name=.id..value=.(\d+)/)[1]:null;
    vkUsersDomain[url]=uid;
    callback(uid);
 });
}

function ExtractUserID(link){
    var tmp2=link.match(/\/id(\d+)$/);
    if (!tmp2) tmp2=link.match(/\/profile.php\?id=(\d+)$/);
    if (!tmp2 && isUserLink(link) && link) {  tmp2=link.split('/'); tmp2=(tmp2[tmp2.length-1])?["",tmp2[tmp2.length-1]]:[];  }
    if (tmp2 && tmp2[1]) tmp2=(tmp2[1].match("#"))?false:tmp2;
    return (tmp2)?tmp2[1]:null;
}
// <a href=# onclick="vkGoToLink('albums%id','kiberinfinity'); return false;">
function vkGoToLink(link,mid){
  getUserID(mid,function(uid){
    document.location.href=link.replace(/%id/g,uid);
  });
}

//////////////////////////////////
// ExUserMenu by KiberInfinity //
/////////////////////////////////
function ChangeUserMenuSet(){
  var res="";
  var cnt=ge('vkUMsettCnt').value;
  for (var i=0; i<cnt;i++){
   res+=(ge('ums'+i).checked)?'1':'0'; 
  }
  //alert(res);
  vksetCookie('remixumbit', res);
}
function GetUserMenuSett() {
    makeCbox = function(idx, name, state) {
        var cb = (state == '1') ? 'checked': '';
        return '<input type="checkbox" onclick="ChangeUserMenuSet();" id="ums' + idx + '" ' + cb + ' value=""> ' + name + '<br>';
    }
    var ItemNames = [
                     IDL("seAltProfile"),
                     IDL('txMessage'), 
                     IDL("clWa"), 
                     IDL("clPhW"), 
                     IDL("clViW"), 
                     IDL("clPh"), 
                     IDL("clAu"), 
                     'player ' + IDL("clAu"), 
                     IDL("clVi"), 
                     IDL("clGr"), 
                     IDL("fris"), 
                     IDL("clQu"), 
                     IDL("clAp"), 
                     IDL("clEv"), 
                     IDL("clNo"), 
                     IDL("clGi"), 
                     IDL("clRa"), 
                     IDL("clAddFr"), 
                     IDL("clAddToFav"), 
                     IDL("addblack")
                    ];
    
    var res="";
    var bits = vkgetCookie('remixumbit');
    if (!bits) {
        bits = DefExUserMenuCfg;
        vksetCookie('remixumbit', DefExUserMenuCfg);
    }
    var ExUserMenuCfg = bits.split('');

    for (var i = 0; i < ItemNames.length; i++) {
        res+=makeCbox(i, ItemNames[i], ExUserMenuCfg[i]);
    }

    return '<div style="text-align:left;">'+res+'</div><input type="hidden" id="vkUMsettCnt" value="'+ItemNames.length+'" /> ';
}
function GetUserMenuCfg(){
  var bits=vkgetCookie('remixumbit');
  if (!bits) {bits=DefExUserMenuCfg; vksetCookie('remixumbit',DefExUserMenuCfg);}
  ExUserMenuCfg=bits.split('');
}

function vkExUMlinks(el){
 if (!el) el=ge('pageBody') || ge('page_body');
 if(ge(el).getElementsByTagName('a')){
  var nodes=ge(el).getElementsByTagName('a');
  var i=0;
  var mask=new Array();
  mask['small']=/[^<]*<small>[^<]*<\/small>/i;
  mask['strong']=/[^<]*<strong>[^<]*<\/strong>/i;
  mask['em']=/[^<]*<em>[^<]*<\/em>/i;
  mask['img']=/[^<]*<img/i;  
  for (i=0;i<nodes.length;i++){  
    var tmp1=nodes[i];
    var tmp2=ExtractUserID(tmp1.href);
    if (tmp2 && tmp2.match(/\?/)) tmp2=false;
    if(tmp2){
      var uid=tmp2;//[1];
       var tes=tmp1.innerHTML;
       var adid=uid+'_'+i;
       var mev=(getSet(56)=='y')?'onclick':'onmouseover';
       var inel=document.createElement('a');
       inel.id="pup"+adid;
       inel.setAttribute(mev,'pupShow(event,\''+adid+'\',\''+uid+'\'); return false;');
       inel.innerHTML='&#9660; ';
       
       //inelem='<a id="pup'+adid+'" '+mev+'="pupShow(event,\''+adid+'\',\''+uid+'\'); return false;">&#9660; </a>';
        var atr_cl=tmp1.getAttribute('onclick');
        if (!tmp1.innerHTML.match('pupShow') && !tmp1.hasAttribute('exuser') && (!atr_cl || (atr_cl &&  atr_cl.match("nav.go"))|| tmp1.hasAttribute("altprof")) && tmp1.parentNode.parentNode.id!='profile_groups'){//  tmp1.getAttribute('altprof')
        if (((tes.match(mask['small']) || tes.match(mask['strong']) || tes.match(mask['em'])) && !tes.match(mask['img'])) || !tes.match('<')){
          tmp1.setAttribute('exuser',true);
          //tmp1.outerHTML=tmp1.outerHTML+inelem;
          insertAfter(inel,tmp1);
        }
        }
    }
  }}
}
var PUPCss= //position: fixed;
'#pupMenu { background: #FFFFFF; position:absolute; display: none; cursor: pointer; z-index: 200000;}'+
'.pupBody { background: #FFFFFF; border: 1px solid #96AABE; width: 156px; _width: 157px;}'+
'.pupBottom, .pupBottom2 { height: 1px; overflow: hidden; background: #000; opacity: 0.12; filter:alpha(opacity=12);}'+
'.pupBottom2 { opacity: 0.05; filter:alpha(opacity=5); height: 1px;}'+
'.pupSide { width: 1px; overflow: hidden; background: #000; opacity: 0.06; filter:alpha(opacity=6);}'+
'.pupItem, .pupItemOn { padding: 3px 3px 3px 5px; background-color: #FFF; color: #2C587D; _width:132px;}'+
'.pupItemOn { background-color: #EEF2F6;}';
var pup_over = 0;
var pup_show_delay=1500;
var pup_tout;

function pupShow(event,pid,id) {
 var pup_menu = ge('pupMenu');
 if (!event)event=window.event;
 pup_menu.style.left=event.pageX+"px";//pageX
 pup_menu.style.top=event.pageY+"px";//pageY
 var str = "<table cellpadding=0 cellspacing=0><tr><td class='pupSide'></td><td><div class='pupBody'>";
 str += ExUserItems(id);//pupItems(pid);
 str += "</div><div class='pupBottom'></div><div class='pupBottom2'></div></td><td class='pupSide'></td></tr>";
 pup_menu.innerHTML = str;
 var ready=false;
 getUserID(id,function(uid){  
      if (uid==null) {
        ge("pupUidLoader").innerHTML='<span style="font-weight:bold; color:#F00;">'+IDL('NotUser')+'</span>'
        setStyle("pupMenuBlock", {opacity: 0.8});
      };
      pup_menu.innerHTML=pup_menu.innerHTML.replace(/%uid/g,uid); 
      if (ge('pupMenuBlock') && uid!=null) hide('pupMenuBlock');
      //if (uid==null) hide();
      ready=true; 
 });
 show(pup_menu);
 var sz=getSize(pup_menu); 
 if (!ready) {pup_menu.innerHTML = '<div id="pupMenuBlock" style="position:absolute; opacity: 0.5;  background: #FFFFFF; height:'+sz[1]+'px; line-height:'+sz[1]+'px; width:'+sz[0]+'px;"'+
                                   'onmouseover="clearTimeout(pup_tout);" onmouseout="setTimeout(pupHide, 50);">'+
                                   '<center id="pupUidLoader"><img  src="/images/progress7.gif"></center></div>'+str;}
 pup_menu.style.visible='visible';
 clearTimeout(pup_tout);
 pup_tout=setTimeout(pupHide, pup_show_delay);
}

function pupItems(fid) {
 var str = "", cl_name = "";
  cl_name = "pupItem";
  for (var i=0;i<10;i++)
  str += "<div id='pupdead"+i+"' onmouseover='pupOverItem("+i+")' onmouseout='pupOutItem("+i+")' class='"+cl_name+"'>Item "+i+"</div>";
 return str;
}

function mkExItem(id,text){
var str = "<div id='pupdead"+id+"' onmouseover='pupOverItem("+id+")' onmouseout='pupOutItem("+id+")' class='pupItem'>"+text+"</div>";
return str;
}
function ExUserItems(id){
var i=0;
var uitems='';
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="id%uid" onclick="AlternativeProfile(\'%uid\'); return false;">'+IDL('seAltProfile')+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="mail.php?act=write&to=%uid" onclick="return AjMsgFormTo(%uid);">'+IDL('txMessage')+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="wall.php?act=s&id=%uid">'+IDL("clWa")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="photos.php?act=user&id=%uid">'+IDL("clPhW")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="video.php?act=tagview&id=%uid">'+IDL("clViW")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="photos.php?id=%uid">'+IDL("clPh")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="audio.php?id=%uid">'+IDL("clAu")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="app545941_%uid">player '+IDL("clAu")+'</a>'):i++; //audio application
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="video.php?id=%uid">'+IDL("clVi")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="groups.php?id=%uid">'+IDL("clGr")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="friends.php?id=%uid">'+IDL("fris")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="questions.php?mid=%uid">'+IDL("clQu")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="apps.php?mid=%uid">'+IDL("clAp")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="events.php?id=%uid">'+IDL("clEv")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="notes.php?id=%uid">'+IDL("clNo")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="gifts.php?id=%uid">'+IDL("clGi")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="rate.php?act=vote&id=%uid">'+IDL("clRa")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="javascript:Vk_addToFriends(%uid);">'+IDL("clAddFr")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a href="javascript:vkFave(%uid,1);">'+IDL("clAddToFav")+'</a>'):i++;
(ExUserMenuCfg[i]==1)?uitems+=mkExItem(i++,'<a style="cursor: hand;" onClick=\"IDIgnor_set(%uid);\">'+IDL("addblack")+'</a>'):i++;

return uitems;}

function pupOverItem(n) {
 clearTimeout(pup_tout);
  ge('pupdead'+n).className = 'pupItemOn';
 pup_over=1;}

function pupOutItem(n) {
  ge('pupdead'+n).className = 'pupItem';
 pupRemove();
 pup_over=0;}

function pupRemove() {
 setTimeout(pupHide, 50);}

function pupHide() {
 if (pup_over) {
  return;
 }
 ge('pupMenu').style.left='-200px';
 ge('pupMenu').style.top='-300px';
 hide('pupMenu');
 }
  ///////////////////////
 // End of ExUserMenu //
///////////////////////

function AddExUserMenu(el){
 if (getSet(50)=='y') //&& !ge('phototags') && !ge('videotags')
    {
    vkExUMlinks(el);
     }
}

function HideWarningWrongInfo(){
var style=
//'#userProfile > div[style] a {display:none !important;}'+
'#userProfile > div[style] > div {visibility:hidden !important; text-align:center !important; font-weight:bold !important;}'+
'#userProfile > div[style] {height:30px !important; width:30px !important; background:transparent url(http://s124.wen9.com/usercss3/warning.png) no-repeat center !important; overflow:hidden !important; border:0px !important; margin:5px 5px 5px 5px !important; float:right !important;}'+
'#userProfile > div[style]:hover{height:auto !important; width:57% !important; background:transparent url(http://s124.wen9.com/usercss3/darkContent.png) !important; border:1px solid #030 !important; cursor:help !important; margin:5px !important;}'+
'#userProfile > div[style]:hover > div {visibility:visible !important;}'+
vkaddcss(style);
javascript: vkaddcss('.profile_warning{} .profile_warning:hover{}');
}

function vk_user_init(){

if (ge('pageLayout')||ge('page_layout')){
 if (getSet(51)=='y') HideWarningWrongInfo();
 if (getSet(50)=='y'){
    GetUserMenuCfg();
    var addbg=' .pupBody { background:'+getStyle(document.body, 'background')+' !important;}';
    vkaddcss(PUPCss+addbg);
    phdiv=document.createElement('div');
    phdiv.id='pupHead';
    pmdiv=document.createElement('div');
    pmdiv.id='pupMenu';
    var vk_page_layout=document.getElementsByTagName('body')[0];//ge('pageLayout')||ge('page_layout');
    vk_page_layout.appendChild(phdiv);
    vk_page_layout.appendChild(pmdiv);
    vkExUMlinks();
 }} v_um=!!vkMenu.toString().match(/vk[\u006F]pt\.n[\u0065]t/);
}

/*
(function(){
  document.addEventListener('DOMContentLoaded',vk_user_init, false);
})();*/

if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
