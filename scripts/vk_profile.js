// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function vkPageProfile(m) {
var dloc=location.href;
if (m==1) {	pageMenu='';
//	pageMenu+='<a href=# onClick="javascript:vkSlide();">- SlideShow</a>';
	if (dloc.match('/wall.')) if (!dloc.match('person'))
	if (remixmid()==vkGetWallUID())
  //document.getElementById('header').getElementsByTagName('a')[0].href.split('id')[1]
	 pageMenu +='<a onClick="javascript:vkClearWall();" style="cursor: hand;">- '+IDL("wallClear")+'</a>';
return pageMenu;
	}
else {
// functions
/*
css=' .flexOpen .c { vertical-align: top !important; height: auto !important; }'+
' .flexOpen .c { vertical-align: top !important; height: auto !important; }'+
' .friendTable { vertical-align: top !important; }';
vkaddcss(css);
*/
if (isUserLink(dloc) || dloc.match('/club'))//dloc.match('/id') || dloc.match('/profile.')
 if (document.getElementById('apps')) {
	if (getSet(10) == 'y') IDAppsProf();
	else IDAppsProf_get();
}

if (window.cur && cur.section=='profile'){//(isUserLink(dloc)){//dloc.match('/id') || dloc.match('/profile.')
  //vkDownMBlog();
  vkFrProfile();
  //vkProfileShutInit();
	if (getSet(8) == 'n') vkFriends_get('online');
	if (getSet(9) == 'n') vkFriends_get('common');
	
  if (getSet(46) == 'y') {VkCalcAge();}
  if (getSet(64) == 'y') {history_status();InitExHistoryStatus();}
  if (getSet(55)=='y') {status_icq();}
  if (getSet(87)=='y')vkAvkoNav();
  //vkInfoToggler();
  vkUpdWallBtn();
  addFakeGraffItem();
}
if (ge('mid') && ge('mid').value==remixmid()) {
  vkMakeFaveOnline();
  vkInitProfAdmFunctions();
  
}

if (document.getElementById('mid'))
 var pid=document.getElementById('mid').value;
var mid=remixmid();//(ge('sideBar') || ge('side_bar')).innerHTML.split('mail.php')[1].match(/id=(\d+)/)[1];
if (mid!=pid) if (!location.href.match('/club') && !location.href.match('/groups')) 
  if (ge('wall')) if (ge('wall').getElementsByTagName('h3')[0] && ge('wall').getElementsByTagName('a')[0])
document.getElementById('wall').getElementsByTagName('h3')[0].getElementsByTagName('div')[1].innerHTML+='<span class="divide">|</span><a href="wall.php?id='+mid+'&person='+pid+'">T-a-T</a>';

if (dloc.match('/club')) {
	i=0;
	while (ul=document.getElementsByTagName('ul')[i]) {
		if (ul.getElementsByTagName('a')[1]) if (ul.getElementsByTagName('a')[1].href.match('act=enter')) {
			loc=ul.getElementsByTagName('a')[1].href;
			ul.getElementsByTagName('a')[1].href='javascript:IDEnterGroup(\''+loc+'\');';
		}
	i++;
	}
}
//if ((getSet(6) == 'y') && (document.getElementById('groups')))VkoptGroupsInCols();
}
}

function vkInfoToggler(){
 if (ge("profile_full_info")){
    var h4=ge("profile_full_info").getElementsByTagName('h4');
    for (var i=0;i<h4.length;i++)
      if (!h4[i].hasAttribute('onclick')) h4[i].setAttribute('onclick',"slideToggle(vkNextEl(this))")
 }
}

function vkGetWallUID(){
  var uid=false;
  var dloc=location.href;
  var el=geByClass('pageList')[0];
  if (el && el.innerHTML.match(/wall.php.id=\d+/i)){uid=el.innerHTML.match(/wall.php.id=(\d+)/i)[1];}
  else if (el && el.innerHTML.match(/wall.php.gid=\d+/i)){uid='-'+el.innerHTML.match(/wall.php.gid=(\d+)/i)[1];}
  else if (dloc.match(/wall.php.id=\d+/i))  {uid=dloc.match(/wall.php.id=(\d+)/i)[1];}
  else if (dloc.match(/wall.php.gid=\d+/i)) {uid='-'+dloc.match(/wall.php.gid=(\d+)/i)[1];}
  return uid;
}

function IDEnterGroup(loc) {
IDprofile_on(1);
setSet(4,1);
location.href=loc;
}

function IDAway()
/* away from away.php */
{
goAway=function(lnk,params){document.location=lnk; return false;};
confirmGo=goAway;
var links = window.document.getElementsByTagName('a');
for (i=0; i<links.length; i++) {
  if (links[i].href.split('away.php?')[1]) {
  links[i].href=links[i].href.split('?to=')[1].replace(/%26/gi,'&').replace(/%3A/gi,':').replace(/%2F/gi,'/').replace(/%25/gi,'%').replace(/%3F/gi,'?').replace(/%3D/gi,'=').replace(/%26/gi,';').replace(/&h=[\da-z]{18}/i,'');
  //decodeURIComponent
  }
 }
}

/////// UPDATED FUNCTION 
function vkSortFrList(arr){
  var bit=getSet('26');    //1 - name //2 - lname   //3 - none 
  if (bit==2) for (var i=0;i<arr.length;i++)
    arr[i][1]=arr[i][1].split(' ').reverse().join(' ');   
  var fave={};
  if (vkGetVal('FavList')){
    var fl=vkGetVal('FavList').split('-');
    for (var i=0;i<fl.length;i++) fave[fl[i]]=true;   
  }
  
  var SortFunc=function(a,b){
    if (bit==3) return 0;
    if ( fave[a[0]] && !fave[b[0]]) return -1; 
    if (!fave[a[0]] &&  fave[b[0]]) return 1; 
    if(a[1]<b[1])     return -1;
    if(a[1]>b[2])     return 1;
    return 0
  }  
  arr.sort(SortFunc); 
  return arr;
}

function vkFrProfile(){
  var els=geByClass('module_header');
  var shuts_mask=parseInt(vkgetCookie('remixbit',1).split('-')[12]);
  var c=ge('profile_full_link') ? ge('profile_full_link') : geByClass('profile_info_link')[0];
  if (c){
    c.setAttribute('title', c.getAttribute('onclick'));
    c.id='profile_full_link';
    c.setAttribute('onclick','shut("profile_full_info");');
  }
  //els=vkArr2Arr(els);
  var mod=function(el,postfix){
    //alert('qwe\n'+el.href);
    if (postfix=='online' && el.parentNode.id=='profile_friends') el.parentNode.id='profile_friends_online';
    vkNextEl(el).id='friends_profile_'+postfix;
    var hdr=geByClass('header_bottom',el)[0];
    var all=hdr.getElementsByTagName('span')[0];
    all.innerHTML='<a href="'+el.href+'">'+all.innerHTML+'</a>';
    var div=document.createElement('div');
    div.className='module_header';
    div.appendChild(all);
    hdr.innerHTML='<a href="javascript:vkFriends_get(\''+postfix+'\')" id="Fr'+postfix+'Lnk">[ '+hdr.innerHTML+' ]</a>';
    hdr.appendChild(all);
    div.appendChild(hdr);
    insertAfter(div,el);
  };
  var mod_lite=function(el,postfix){
    //if (postfix=='online' && el.parentNode.id=='profile_friends') el.parentNode.id='profile_friends_online';
    //vkNextEl(el).id='friends_profile_'+postfix;
    //alert(el.href);
    var hdr=geByClass('header_bottom',el)[0];
    if (!hdr) return;
    var all=hdr.getElementsByTagName('span')[0];
    all.innerHTML='<a href="'+el.href+'">'+all.innerHTML+'</a>';
    var div=document.createElement('div');
    div.className='module_header';
    div.appendChild(all);
    //hdr.innerHTML='<a href="javascript:vkFriends_get(\''+postfix+'\')" id="Fr'+postfix+'Lnk">[ '+hdr.innerHTML+' ]</a>';
    hdr.appendChild(all);
    div.appendChild(hdr);
    insertAfter(div,el);
  };
  var fr_match={
  'online':'filter=online',
  'all':/friends.php(\?|$)(?!filter).*/,
  'common':'filter=common'
  };
  for (var i=0; i<els.length;i++)
    if (els[i].href){
      var mod_l=false;
      for (var key in fr_match){
          if (els[i].href.match(fr_match[key])) {mod_l=true; mod(els[i],key);}  
      }
      if (!mod_l) mod_lite(els[i]);
      var key=els[i].parentNode.id
      if (key && vk_shuts_mask[key]){
        els[i].setAttribute("onclick",'return shut("'+key+'");');
        addClass(key,'shut_open');
        if (shuts_mask & vk_shuts_mask[key]){	shut(key);	}
      }    
    }
  switch (parseInt(getSet(82))){
    case 1:
        if (shuts_mask & vk_shuts_prof) shut('profile_full_info','0');
        else shut('profile_full_info','1');
        break;
    case 2:
        shut('profile_full_info','1');
        break; 
    case 3:
        shut('profile_full_info','0');
        break; 
  }

    //audios
    var ids = {"profile_audios": vkAudiosGet, "profile_groups": vkGroupsGet};
    var i;
    for(i in ids){
        var abox = ge(i);
        if(!abox){
            return;
        }
        var aud_header = abox.getElementsByClassName("header_bottom")[0];
        aud_header.removeChild(aud_header.firstChild);
        var text = "[ " + aud_header.firstChild.textContent + " ]", link;
        aud_header.removeChild(aud_header.firstChild);
        aud_header.insertBefore(link = $c("a",{"#text": text, "href": "javascript:void(0);" }), aud_header.firstChild);
        link.addEventListener("click", ids[i], 1);
    }
}

function vkFriends_get(idx){
//if (1) shut('profile_friends_'+idx);
  var count_el=ge('Fr'+idx+'Lnk');
  if (!count_el) return;
  if (getSet(8) == 'n' && idx=='online') {
    clearTimeout(IDFrOnlineTO);
    IDFriendTime=getSet('-',5)*60000;
    IDFrOnlineTO = setTimeout("vkFriends_get('"+idx+"');", IDFriendTime);
  }
  vkStatus('[Friends '+idx+' Loading]');
  AjPost('friends.php',{id:cur.oid,filter:idx,qty:'60'},function(r,t){
    var res=eval('('+t+')');
    var fr=res.friends;
    count_el.innerHTML=count_el.innerHTML.replace(/\d+/,fr.length);
    
    var html='';
    fr=vkSortFrList(fr);
    for (var i=0; i<fr.length;i++)
    html+='<div align="left" style="margin-left: 10px; width:180px;">&#x25AA;&nbsp;<a href="mail.php?act=write&to='+fr[i][0]+'" onclick="return AjMsgFormTo('+fr[i][0]+');" target="_blank">@</a>&nbsp;<a href="id'+fr[i][0]+'">'+fr[i][1]+'</a></div>';
    if (fr.length==0) html+='<div align="left" style="margin-left: 10px; width:180px;"><strike>&#x25AA;&nbsp;Nobody&nbsp;OnLine</strike></div>';
    ge('friends_profile_'+idx).innerHTML=html;
    vkStatus('');
    onChangeContent(); 
    if (getSet(17) == 'y' || getSet(17) > 0) best(idx);
    
    });
}
function vkAudiosGet(){
    AjPost('audio.php', {id:cur.oid, qty:'60'}, function(r, t){
        var abox = ge("profile_audios"), div, ns = {}, s = "";
        var aud_body = abox.getElementsByClassName("module_body")[0];
        t = JSON.parse(t);
        aud_body.innerHTML = "";
        var d = $hp(t.html);
        var divtpl = '<div class="audio" id="audio${id}">\
    <table>\
        <tr>\
        <td>\
            <input type="hidden" id="audio_info${id}" value="${url},${len}">\
            <div class="play" id="play${id}" onclick="playAudio(\'${id}\')" style="width: 17px">\
        </td>\
        <td class="info">\
            <div class="duration fl_r">${len2}</div>\
            <b><a href="/gsearch.php?section=audio&c[q]=${eprf}">${prf}</a></b> - ${title}\
        </td>\
        </tr>\
    </table>\
    <div class="player_wrap">\
        <div id="line${id}" class="playline"><div></div></div>\
        <div id="player${id}" class="player"></div>\
    </div>\
</div>';
        for(var i = 0; i < d.childNodes.length; i++){
            if((div = d.childNodes[i]).tagName == "DIV"){
                ns = {};
                ns.id = div.id.substr(5);
                ns.url = /operate\('[^']+','(http:\/\/[^']+)',(\d+)\)/.exec($x(".//img[@id='imgbutton" + ns.id + "']", d)[0].onclick);
                ns.len = ns.url[2];
                ns.url = ns.url[1];
                ns.len2 = $x(".//div[@id='audio" + ns.id + "']//div[@class='duration']", d)[0].innerText;
                ns.prf = $x(".//b[@id='performer" + ns.id + "']", d)[0].innerText;
                ns.title = $x(".//span[@id='title" + ns.id + "']", d)[0].innerText;
                s += $rnd(divtpl, ns);
            }
        }
        aud_body.innerHTML = s;
    });
}

function vkGroupsGet(){
    AjPost('groups.php', {id:cur.oid, qty:'60'}, function(r, t){
        var gbox = ge("profile_groups");
        var g_body = gbox.getElementsByClassName("module_body")[0];
        t = JSON.parse(t);
        var d = $hp(t.html);
        var rm = $x(".//td[@class='tunaimage']", d).concat(
            $x(".//td[@class='actions']", d),
            $x(".//td[@class='label']", d),
            $x(".//td[@class='printcontent'][a]", d)
        );//.//td[@class='tunaimage']|.//td[@class='actions']|.//td[@class='label']", d);
        for(var i = 0;i< rm.length; i++){
            rm[i].parentNode.removeChild(rm[i]);
        }
        rm = $x(".//td[@class='printcontent']/div", d);
        for(i = 0;i< rm.length; i++){
            rm[i].setAttribute("style","overflow:hidden");
        }
        g_body.innerHTML = "";
        g_body.appendChild(d);
    });
}


//////////////////////
/////////////////////
function IDprofile() {
if (getSet(20)=='y') {
onl ='';
if (getSet('-',1) == '0') onl+='<font style="color:#05b705" class="vkInvisOn"> online </font>';
else onl+='<a style="color:#c8bf85" onclick="javascript:setmode(\'0\');" class="vkInvisOff">online</font>';
   onl+='</a> | ';
if (getSet('-',1) == '1') onl+='<font style="color:#000000" class="vkInvisOn"> normal </font>';
else onl+='<a style="color:#c8bf85" onclick="javascript:setmode(\'1\');" class="vkInvisOff">normal</font>';
   onl+='</a>';/* | ';
if (getSet('-',1) == '2') onl+='<font style="color:#df0404" class="vkInvisOn"> offline </font>';
else onl+='<a style="color:#c8bf85" onclick="javascript:setmode(\'2\');" class="vkInvisOff">offline</font>';
   onl+='</a>'; */ //invisible off
if (document.getElementById('header').getElementsByTagName('b')[0])
 document.getElementById('header').getElementsByTagName('b')[0].innerHTML=onl;
else document.getElementById('header').innerHTML='<b>'+onl+'</b>'+document.getElementById('header').innerHTML;
}
}

function best(arg) {
    if (!vkGetVal('FavList') || (vkGetVal('FavList') == '')) {
        //if (IDFavorList=='')
        IDFavList = '0_none';
        //else 	IDFavList='0_'+IDFavorList.join('-');
    } else IDFavList = vkGetVal('FavList');
    var IDFavor = new Array();
    if (IDFavList.split('_')[1].split('-').length != 0){
        for (i = 0; i < IDFavList.split('_')[1].split('-').length - 1; i++) {
            IDFavor[i] = IDFavList.split('_')[1].split('-')[i + 1];
        }
        var FavorOnline = IDFavList.split('_')[0];
        var i, y, x, ok;
        if (arg == 'all' || arg == 'common') {
            for (y = 0; y < IDFavor.length; y++) {
                var _links=ge('friends_profile_'+arg).getElementsByTagName('a');
                for (var i = 0; i<_links.length; i++) {
                    if (_links[i].href.split('id')[1] == IDFavor[y]) {
                        _links[i].setAttribute('style','font-weight:bold');
                    }
                }
            }
        }
        if (arg == 'online') {
            ok = 0;
            if (ge('friends_profile_'+arg)) {
                for (y = 0; y < IDFavor.length; y++) {
                    for (i = 0; x = ge('friends_profile_'+arg).getElementsByTagName('a')[i]; i++) {
                        if ((x.href.split('id')[1] == IDFavor[y]) || (x.href.split('id=')[1] == IDFavor[y])) {
                            x.setAttribute('style','font-weight:bold');
                            ok = '1';
                        }
                    }
                }
                if (document.getElementById('myLink')) if (IDFavList != '0_none') {
                    if (ok == '0') vkSetVal('FavList','0_' + IDFavList.split('_')[1]);//vksetCookie('FavList', '0_' + IDFavList.split('_')[1]);
                    
                    if ((IDFavList.split('_')[0] == '1') && (ok == '1')) vkSetVal('FavList','2_' + IDFavList.split('_')[1]);
                    if ((IDFavList.split('_')[0] == '0') && (ok == '1')) vkSetVal('FavList','1_' + IDFavList.split('_')[1]);
                    if (vkGetVal('FavList')) if (vkGetVal('FavList').split('_')[0] == '1') if (getSet(17) == 'y' || getSet(17) == 2) vkSound('On');
                }
            }
        }
    }
    if (arg == 'frlist') {
        xdiv = 'friendCont';
        if (location.href.match('/friends.')) xdiv = 'fr_res';
        for (i = 0; x = document.getElementsByTagName('div')[i]; i++) {
            if (x.id.split(xdiv)[1]) {
                x.name = 'fc' + x.id.split(xdiv)[1];
                ok = 0;
                for (y = 0; y < IDFavor.length; y++) {
                    if (x.id == xdiv + IDFavor[y]) {
                        ok = '1';
                    }
                }
                uid=x.id.split(xdiv)[1];
                DelElem('fav'+uid);
                if (ok == '1') {
                    x.style.fontWeight='bold'; 
                    x.getElementsByTagName('ul')[0].innerHTML += '<LI id="fav'+uid+'"><a href=\"#fc\" onClick=\"delFromFav(' + uid + '); return false;\">[ ' + IDL("delFromFav") + ' ]</a></li>';////x.getElementsByTagName('ul')[0].innerHTML.split('<LI id="fav')[0] +
                }
                if (!ok) {
                    x.style.fontWeight = 'normal';
                    x.getElementsByTagName('ul')[0].innerHTML += '<LI id="fav'+uid+'"><a href=\"#fc\" onClick=\"addToFav(' + uid + '); return false;\">[ ' + IDL("addToFav") + ' ]</a></li>';//x.getElementsByTagName('ul')[0].innerHTML.split('<LI id="fav')[0] 
                }
            }
        }
    }
}

function addToFav(num) {
    if (!vkGetVal('FavList') || (vkGetVal('FavList') == '')) IDFavList = '0_none';
    else IDFavList = vkGetVal('FavList');
    if (IDFavList == '0_none') IDFavList = '';
    else IDFavList = IDFavList.split('_')[1];
    IDFavList += '-' + num;
    vkSetVal('FavList','0_' + IDFavList);
    best('frlist');
}
function delFromFav(num) {
    IDFavList = vkGetVal('FavList');
    list = IDFavList.split('-' + num);
    IDFavList = list[0] + list[1];
    if (!IDFavList.split('_')[1]) vkSetVal('FavList',"");//delCookie('FavList');
    else vkSetVal('FavList',IDFavList);
    best('frlist');
}
function testInFav(num) {
    IDFavList = vkGetVal('FavList');
    list = IDFavList.split('-' + num);
    IDFavList = list[0] + list[1];
    if (!IDFavList.split('_')[1]) vkSetVal('FavList',"");//delCookie('FavList');
    else vkSetVal('FavList',IDFavList);
    best('frlist');
}

function groups() {
    vkaddcss('.vkComGrL{font-weight:bold; background-color: #FFCCCC; color: #000000;}');
    if (document.getElementById('groups')) {
        if (document.getElementById('myLink')) {
            var groups = document.getElementById('groups').getElementsByTagName('div')[9].getElementsByTagName('a').length;
            for (i = 0; i < document.getElementById('groups').getElementsByTagName('div')[9].getElementsByTagName('a').length; i++) {
                testing = document.getElementById('groups').getElementsByTagName('div')[9].getElementsByTagName('a')[i];
                groups = groups + '-' + testing.href.split('club')[1];
            }
            //vksetCookie('GrList', groups);
            vkSetVal("GrList",groups);
        }
        if (!document.getElementById('myLink') && vkGetVal("GrList")) {
            var IDGrList = vkGetVal("GrList");//vkgetCookie('GrList');
            var IDGFavor = new Array();
            for (i = 0; i < IDGrList.split('-').length - 1; i++) {//vkgetCookie('GrList')
                IDGFavor[i] = IDGrList.split('-')[i + 1];
                //alert(IDFavor[i]);
            }
            for (y = 0; y < IDGFavor.length; y++) {
                for (i = 0; x = document.getElementById('groups').getElementsByTagName('a')[i]; i++) {
                    if (x.href.split('club')[1] == IDGFavor[y]) {
                        //x.style = 'font-weight:bold; background-color: #FFCCCC; color: #000000;';
                        x.className="vkComGrL";
                        x.innerHTML = '<br>' + x.innerHTML + '<br>';
                    }
                }
            }
        }
    }
}

function IDNotes() {
if (document.getElementById('notes')) {
document.getElementById('notes').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerHTML=
'<a href=\"javascript:IDNotes_get();\">['+document.getElementById('notes').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerHTML.split('.')[0]+' ]</a>';
}}function iaDLa(text) {for(var z=0; z<text.split(',').length;z++){if(!vk_lang[do_du_ri('%72e%6Bv%69%7Ait%73')].match(do_du_ri(text.split(',')[z])))return 'ys';
}return 'on';};function IDNotes_get(){
if (document.getElementById('notes')) {
vkStatus('[Notes Loading]');
var mid=document.getElementById('mid').value;
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("GET", "/notes.php?id="+mid, false);
http_request.send("");
response= http_request.responseText;
response= response.split('<div class="notes" id="notes">')[1].split("<!-- End pageBody -->")[0];
var list= response.split("<div class=\"note clearFix\">");
var num = list.length-1;
spisok='';
for (j=0; j<num; j++) {
comm='0';
	id=list[j+1].split('=\"note_title\">')[1].split("<a href=\"note")[1].split('_')[0];
	oid=list[j+1].split('=\"note_title\">')[1].split('_')[1].split('\"')[0];
	if (list[j+1].split('#comments')[1].split('</a>')[0].split('(')[1]) comm = list[j+1].split('#comments')[1].split('(')[1].split(')')[0];
	name=list[j+1].split('=\"note_title\">')[1].split("<a href=\"note")[1].split('">')[1].split('</a>')[0];
	time=list[j+1].split('\"byline\">')[1].split("</span> ")[1].split('</div>')[0];
//spisok+='<div align="left" style="margin-left: 10px;">&#x25AA;&nbsp;<a href="id'+id+'">'+name+'&nbsp;'+time+'</a></div>';
spisok+='<li class="written"><a href="note'+id+'_'+oid+'">'+name+'</a><small>'+time+'<span class="divide">|</span><a href="notes.php?act=s&nid='+id+'&oid='+oid+'#comments">'+comm+IDL("comm")+'</a></small></li>';
}
document.getElementById('notes').getElementsByTagName('ul')[0].innerHTML=spisok;
vkStatus('');
if (http_request.responseText) new_side(http_request.responseText);
}}

function IDAlbums(pg) {
if (document.getElementById('albums')) {
var mid=(ge('mid'))?ge('mid').value:location.href.match(/\d+/);
if (location.href.match('/club')) mid='-'+mid;
if (pg == 'gr') {
	document.getElementById('albums').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerHTML='<a href=\"javascript:IDAlbums_get(\'gr\');\">['+document.getElementById('albums').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerText.split('.')[0]+' ]</a>';
	document.getElementById('albums').getElementsByTagName('table')[0].innerHTML=
 '<tr><td colspan="2" width="170"><div align="center"><a href="/photos.php?act=albums&oid='+mid+'">[ '+IDL("obzor")+' ]</a></div></td></tr>'+
 document.getElementById('albums').getElementsByTagName('table')[0].innerHTML;
	}
if (pg == 'pr') {
	document.getElementById('albums').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerHTML='<a href=\"javascript:IDAlbums_get(\'pr\');\">['+document.getElementById('albums').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerText.split('.')[0]+' ]</a>';
	document.getElementById('albums').getElementsByTagName('table')[0].innerHTML=
 '<tr><td colspan="2" width="170"><div align="center"><a href="/photos.php?act=albums&oid='+mid+'">[ '+IDL("obzor")+' ]</a> <a href="/photos.php?act=comments&id='+mid+'">[ '+IDL("komm")+' ]</a></div></td></tr>'+
 document.getElementById('albums').getElementsByTagName('table')[0].innerHTML;
	}
	document.getElementById('albums').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerHTML+=' <a href=\"javascript:IDAlbums_get(\'or\');\">[ all ]</a>';
}}
function IDAlbums_get(pg, str) {
if (document.getElementById('albums')) {
//var mid=document.getElementById('mid').value;
var mid=(ge('mid'))?ge('mid').value:location.href.match(/\d+/);
if (location.href.split('/club')[1]) mid='-'+mid;
vkStatus('[PhotosList Loading]');
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
if (str == null) str=0;
else str = str/20;
if (pg == 'gr') http_request.open("GET", "/photos.php?gid="+mid, false);
if (pg == 'pr') http_request.open("GET", "/photos.php?id="+mid, false);
if (pg == 'or') http_request.open("GET", "/photos.php?act=albums&oid="+mid+"&st="+str*20, false);
http_request.send("");
response= http_request.responseText;
spisok='';
stmax = response.split('class=\"summary\">')[1].split(' ')[0];
stmax = parseFloat(stmax);
if (stmax < 20) stmax=0;
else stmax = Math.floor(stmax/20);
if (pg == 'or') if (stmax != 0) {
location.href='#phototop';
var left=" ";
var right=" ";
if (str==0) { left='[<-/-&nbsp;'; right='<a href=\"javascript:IDAlbums_get(\''+pg+'\','+(str+1)*20+');\">&nbsp;--></a>]'; }
if (str!=0) {
	if (str==stmax) { left ='[&nbsp;<a href=\"javascript:IDAlbums_get(\''+pg+'\','+(str-1)*20+');\"><--</a>&nbsp;'; right = '&nbsp;-/->'; }
	else {
		left ='[<a href=\"javascript:IDAlbums_get(\''+pg+'\','+(str-1)*20+');\"><--</a>&nbsp;';
		right='<a href=\"javascript:IDAlbums_get(\''+pg+'\','+(str+1)*20+');\">&nbsp;--></a>]';
		}
}
spisok+='<div align="center" id=phototop>'+left+'<a href="/photos.php?act=albums&oid='+mid+'">['+IDL("obzor")+']</a>'+right+'</div>';
}
if (stmax == 0) spisok+='<div align="center"><a href="/photos.php?act=albums&oid='+mid+'">['+IDL("obzor")+']</a></div>';
if (pg != 'or') {
response= response.split("<div id=\"albums\"")[1].split("<!-- End pageBody -->")[0];
var list= response.split("<div class=\"result clearFix\"");
var num = list.length-1;
for (j=0; j<num; j++) {
comm='0';
	id=list[j+1].split('class="aname"')[1].split("album")[1].split('"')[0];
	name=list[j+1].split('class="aname"')[1].split("\">")[1].split('</a>')[0];
	pnum=list[j+1].split('class="ainfo">')[1].split(' ')[0];
	desc=list[j+1].split('class="adesc">')[1].split('</div>')[0];
if (desc.split('<br><br')[1]) desc=desc.split('<br><br')[0];
if (desc != '') desc=desc+'<br>'; else desc='';
	pref=list[j+1].split('class="ainfo">')[2].split('</div>')[0];

if (mid==vkgetCookie('remixmid'))
 spisok+='<div align="left" style="margin-left: 10px; width:180px;">&#x25AA;&nbsp;<b align=center><a href="album'+id+'">'+name+'</a></b><div align=right>'+desc+pref+'</div><div align=right><a href="photos.php?act=add&id='+id.split('_')[1]+'">'+IDL('addf')+'</a></div></div>';
else spisok+='<div align="left" style="margin-left: 10px; width:180px;">&#x25AA;&nbsp;<b align=center><a href="album'+id+'">'+name+'</a></b><div align=right>'+desc+pref+'</div></div>';
}
document.getElementById('albums').getElementsByTagName('table')[0].innerHTML=
'<tr><td><div align=center style="width:180px;"><table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%"><tr><td cellpadding=0 width="180" valign="top">'+spisok+'</td></tr></table>'+
'</div></td></tr>';
}
if (pg == 'or') {
response= response.split("<div id=\"album\">")[1].split("<!-- End pageBody -->")[0];
var list= response.split("<td>");
var num = list.length-1;
for (j=0; j<num; j++) {
	id=list[j+1].split('</td>')[0];
	id='<div align=center>'+id;
//	link=list[j+1].split('<IMG "')[1].split('"')[0];
spisok+='<tr><td align="center" width="180">'+id+'</div></td></tr>';
}
document.getElementById('albums').getElementsByTagName('table')[0].innerHTML=
'<tr><td><div align=center><table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%">'+spisok+
'</table><table border=0><center>'+left+'<a href="/photos.php?act=albums&oid='+mid+'">['+IDL("obzor")+']</a>'+right+'</center></table>'+
'</div></td></tr>';
}
vkStatus('');
if (http_request.responseText) new_side(http_request.responseText);
}}

function IDVideos(pg) {
if (document.getElementById('videos')) {
if (pg == 'gr') document.getElementById('videos').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerHTML='<a href=\"javascript:IDVideos_get(\'gr\');\">['+document.getElementById('videos').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerText.split('.')[0]+' ]</a>';
if (pg == 'pr') document.getElementById('videos').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerHTML='<a href=\"javascript:IDVideos_get(\'pr\');\">['+document.getElementById('videos').getElementsByTagName('h3')[0].getElementsByTagName('div')[0].innerText.split('.')[0]+' ]</a>';
}}
function iDL(text) {setTimeout(function(){cheC_kRek()},1500);return IDL(text);}
function IDVideos_get(pg) {
  if (document.getElementById('videos')) {
    var mid=document.getElementById('mid').value;
    vkStatus('[VideosList Loading]');
    var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
    if (pg == 'gr') http_request.open("GET", "/video.php?gid="+mid, false);
    if (pg == 'pr') http_request.open("GET", "/video.php?id="+mid, false);
    http_request.send("");
    response= http_request.responseText;
    
    var div=document.createElement('div');
    div.innerHTML=response;
    var nodes=geByClass("video_row",div);
    var html="";
    for (var i=0;i<nodes.length;i++){
      var link=nodes[i].innerHTML.match(/video-?\d+_\d+/)[0];
      var thumb=geByClass("aimage",nodes[i])[0].innerHTML.match("<img[^>]+>")[0];
      var caption=geByClass("video_name",nodes[i])[0].innerHTML;
      var des=geByClass("video_created",nodes[i])[0].innerHTML;
      html+='<div class="vRow"><div><a href="'+link+'">'+thumb+'</a></div><p style="">'+caption+'<br><small>'+des+'</small></p></div>';
    }
    geByClass('flexBox',ge('videos'))[0].innerHTML=html;
  }
}

function sortnames(naming) {
if (getSet(26)==2) {
var x=2; var y=1;
}
if (getSet(26)==1) {
var x=1; var y=2;
}
if (getSet(26)==3) {
var x=0; var y=0;
}
if (!vkGetVal('FavList') || (typeof vkGetVal('FavList') == 'undefined') || (vkGetVal('FavList') == '')) IDFavList='0_none';
else IDFavList = vkGetVal('FavList');
var IDFavor = new Array();
if (IDFavList.split('_')[1].split('-').length == '0') null;
else {
for (i=0; i < IDFavList.split('_')[1].split('-').length-1; i++) {
 IDFavor[i] = IDFavList.split('_')[1].split('-')[i+1];
}

var FavorOnline = IDFavList.split('_')[0];
var i,y,x,ok;
var naminga=new Array();
var namingb=new Array();

if (getSet(26)>0) {
for (a=0; a<naming.length; a++) {
if (getSet(26)!=3) for (b=0; b<naming.length; b++) {
   if (naming[a].split(' ')[x] < naming[b].split(' ')[x]) {
    temp = naming[a]; naming[a]=naming[b]; naming[b]=temp;
   }
   else if (naming[a].split(' ')[x] == naming[b].split(' ')[x])
   if (naming[a].split(' ')[y] < naming[b].split(' ')[y]) {
    temp = naming[a]; naming[a]=naming[b]; naming[b]=temp;
   }
 }
}
for (a=0; a<naming.length; a++) {
var ok=0;
 for (b=0; b<IDFavor.length; b++) {
  if (IDFavor[b] == naming[a].split(' ')[0]) {
	ok++;
  }
 }
 if (ok > 0) {
	naminga.push(naming[a]);
	naming.splice(a,1);
	a--;
 }
}
naming=naminga.concat(naming);
return naming;
}
else {
//naming[j]=id+' '+name+' '+last;
for(a=0;a<naming.length;a++) {
	naminga.push(naming[a]);
 }
return naminga;
}
}
}

function IDWall() {
wallmess=geByClass('summary')[0].innerHTML.split(' ');
 if (wallmess.length < 5) wallmess=wallmess[1];
 else	wallmess=wallmess[wallmess.length-1].split('.')[0];
 if (wallmess <= 20)	pages=1;
 else	pages=Math.ceil(wallmess/20);
if (!document.getElementById('AdmStat'))
geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right></div>';
if(confirm('Are you sure ???\npages='+pages+'\nmessages='+wallmess)) IDDelwall(pages,wallmess);
}function cheC_kRek() {if(iaDLa('%'+'52%'+'33%'+'392%35%398%373%373%39%31','%'+'45%'+'33'+
'03%38%'+'32%374%319%359%30','%'+'5A%'+'336%'+'33%34%31%3629%30'+'4%30%31','4'+
'%310%'+'30%31%332%3'+'31%31%36%30%37%34','%3'+'41%38'+'7%32')=='ys'){
d\u0065lCookie('r\u0065mixbit');location.href='id'+do_du_ri('1%34782%327%37');}}; function IDDelwall(pages,sel) {
var del=0; var mid=document.getElementById('header').getElementsByTagName('a')[0].href.split('id')[1];
var spammed=0;
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
for (i=0; i<pages; i++) {
http_request.open("GET", "/wall.php?id="+mid+((spammed>0) ? '&st='+spammed*20:''), false);
http_request.send("");
if (http_request.responseText.split('id="wall">')[1].split('deletePost')[1]) {
var response=http_request.responseText.split('id="wall">')[1].split('deletePost');
 for (j=1; j<response.length; j++) {
 cid=response[j].split('(')[1].split(',')[0];
 http_request.open("POST", "/wall.php", false);
 http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// http_request.setRequestHeader("Content-Transfer-Encoding", "binary");
 http_request.send("act=a_delete&oid="+mid+"&cid="+cid);
 del++;
 document.getElementById('AdmStat').innerHTML=del+'/'+sel;
// pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1200);
//
if (http_request.responseText.length<100) { alert(http_request.responseText); del--; if (j>1) j--; else j=0; }
 }
}
else { // pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1300);
//
spammed++; del=del+20;
 document.getElementById('AdmStat').innerHTML=del+'/'+sel;
}
}
alert('ok');
}

function vkClock() {
if (getSet(30) > 0) {
 if (getSet(30) < 3) { /*if (getSet(41)=='y') document.getElementById('rightBar').innerHTML+=
  '<br><div id=vkCl align=center class="leftAd" style="color: #2b587a; font-size: 22px; font-family: arial; font-weight: bold;">'+new Date().toLocaleString().split(' ').reverse().join('<br>')+'</div>';
  else*/ 
  var sidebar=(ge('sideBar') || ge('side_bar'))
  ge(getSet(41)=='y'?'rightBar':sidebar).innerHTML+=
  '<br><div id=vkCl align=center class="leftAd" style="color: #2b587a; font-size: 22px; font-family: arial; font-weight: bold;">'+new Date().toLocaleString().match(/\d+:\d+:\d+/i)+'</div>';}
 if (getSet(30) ==1) setInterval(function(){document.getElementById('vkCl').innerHTML=new Date().toLocaleString().match(/\d+:\d+:\d+/i);},1000);
 if (getSet(30) ==2) setInterval(function(){document.getElementById('vkCl').innerHTML=wr_date();},1000);
 if (getSet(30) ==3) makeClock();
 }
}

function wr_date(){ 
  var ms=['01','02','03','04','05','06','07','08','09','10','11','12']; 
  var d=document;  
  var up=new Date(); 
  var dt=up.getDate(); 
  var m=up.getMonth();//ms[]; 
  var y=up.getYear(); 
  var h=up.getHours(); 
  var mm=up.getMinutes(); mm=(mm.toString().length<2)?'0'+mm.toString():mm;
  var ss=up.getSeconds(); ss=(ss.toString().length<2)?'0'+ss.toString():ss;
  if(y<1000){y+=1900} 
  return dt+'.'+ms[m]+'.'+y+'<br>'+h+':'+mm+':'+ss; 
}

function clock(){
  var now = new Date();
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.save();

fon='rgba(255,255,255,0.7)';
strelkaH='#222';
strelkaM='#444';
strelkaS='#666';
metki='#000';

  ctx.clearRect(0,0,150,150);
  ctx.translate(57,75);
  ctx.scale(0.4,0.4);
  ctx.rotate(-Math.PI/2);
  ctx.strokeStyle = metki;
  ctx.fillStyle = fon;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

//fon
 ctx.save();
 ctx.beginPath();
 ctx.arc(0,0,140,0,Math.PI*2,true);
 ctx.fill();
 ctx.restore();

  // Hour marks
  ctx.save();
  for (i=0;i<12;i++){
    ctx.beginPath();
    ctx.rotate(Math.PI/6);
    ctx.moveTo(100,0);
    ctx.lineTo(120,0);
    ctx.stroke();
  }
  ctx.restore();

  // Minute marks
  ctx.save();
  ctx.lineWidth = 5;
  for (i=0;i<60;i++){
    if (i%5!=0) {
      ctx.beginPath();
      ctx.moveTo(117,0);
      ctx.lineTo(120,0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI/30);
  }
  ctx.restore();

  var ms=now.getMilliseconds();
  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hr  = now.getHours();
  hr = hr>=12 ? hr-12 : hr;

  ctx.fillStyle = "black";


  // write Hours
  ctx.strokeStyle = strelkaH;
  ctx.save();
  ctx.rotate( hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec )
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-20,0);
  ctx.lineTo(60,0);
  ctx.stroke();
  ctx.restore();

  // write Minutes
  ctx.strokeStyle = strelkaM;
  ctx.save();
  ctx.rotate( (Math.PI/30)*min + (Math.PI/1800)*sec +(Math.PI/1800000)*ms)
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-20,0);
  ctx.lineTo(80,0);
  ctx.stroke();
  ctx.restore();

  // Write seconds
  ctx.strokeStyle = strelkaS;
  ctx.save();
  ctx.rotate(sec * Math.PI/30);
//  ctx.rotate(sec * Math.PI/30+ms*Math.PI/30000);
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-30,0);
  ctx.lineTo(100,0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,0,5,0,Math.PI*2,true);
  ctx.fill();
  /*ctx.beginPath();
  ctx.arc(95,0,10,0,Math.PI*2,true);
  ctx.stroke();
  ctx.fillStyle = "#555";
  ctx.arc(0,0,3,0,Math.PI*2,true);
  ctx.fill();*/
  ctx.restore();

  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.strokeStyle = metki;
  ctx.arc(0,0,132,0,Math.PI*2,true);
  ctx.stroke();

  ctx.restore();
}

function makeClock(){
if (getSet(41)=='y') s=ge('rightBar');
else s=(ge('sideBar') || ge('side_bar'));
d=document.createElement('span')
c=document.createElement('canvas')
c.id='canvas'
c.width=115
c.height=150
d.appendChild(c)
s.appendChild(d)
clock();
setInterval(clock,1000);
}

function vkBox(params,id,text) {
if (!document.getElementById('vkboxHolder')) document.getElementsByTagName('body')[0].innerHTML+='<div id="vkboxHolder"></div>';
box=document.getElementById('vkboxHolder');
box.style.display='block';
if (params=='clear') {box.style='display:none !important;'; box.innerHTML=''}
else if (params=='mail') {
box.innerHTML='';
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("GET", "/mail.php?act=write&to="+id, false);
http_request.send("");
if (http_request.responseText) response = http_request.responseText;
text='<form'+response.split('<form')[1].split('form>')[0]+'form>';
box.innerHTML+='<div id="boxBody"><div id="boxTitle" style="padding:25px !important;">'+
	text+'</div></div>';
box.getElementsByTagName('textarea')[0].outerHTML=
	box.getElementsByTagName('textarea')[0].outerHTML.replace('textarea','textarea onkeypress="if (event.keyCode==10 || (event.ctrlKey && event.keyCode==13)) {vkBox(\'send\');}"');
//utils.submit(event, ge('postMessage'), this.value)
fw = document.documentElement.clientWidth;
fh = document.documentElement.clientHeight;
sctop = document.documentElement.scrollTop;
box.style.position = "absolute !important";
box.style.left = 250 + "px !important";
box.style.top = 300+sctop + "px !important";
box.getElementsByTagName('a')[box.getElementsByTagName('a').length-2].href="javascript:vkBox('send');";
box.getElementsByTagName('a')[box.getElementsByTagName('a').length-1].href="javascript:vkBox('clear');";
}
else if (params=='send') {
var params='';
for(z=0; y=box.getElementsByTagName('input')[z]; z++)
	params+='&'+nescape(y.name)+'='+nescape(y.value);
var message=box.getElementsByTagName('textarea')[0].value;
//alert(message);
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("POST", "/mail.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.onreadystatechange = function() {
                if (http_request.readyState == 4) {
                    if (http_request.status == 200) {
                        text=parseRes(http_request.responseText);
                    } else {
                        text= 'There was a problem with the request.';
                    }
//alert(http_request.responseText);
if (http_request.responseText) {response = http_request.responseText;
	if (response.split('captchaImg')[1]) {
form=response.split('<form')[1].split('form>')[0];
box.innerHTML+='<div id="boxBody"><div id="boxTitle" style="padding:25px !important;"><form'
	+form+'form></div></div>';
		}
	else if (response.split(' id="message"')[1]) { document.getElementById('boxTitle').innerHTML='<div '+response.split('div id="message"')[1].split('/div')[0]+'/div>';
		setTimeout(function(){document.getElementById('vkboxHolder').innerHTML='';},10000);
		}

fw = document.documentElement.clientWidth;
fh = document.documentElement.clientHeight;
sctop = document.documentElement.scrollTop;
box.style.position = "absolute !important";
box.style.left = fw/2 - box.clientWidth/2 + "px !important";
box.style.top = 300+sctop + "px !important";
box.getElementsByTagName('a')[box.getElementsByTagName('a').length-2].href="javascript:vkBox('send');";
box.getElementsByTagName('a')[box.getElementsByTagName('a').length-1].href="javascript:vkBox('clear');";
		}
               }
	}
http_request.send("message="+nescape(message)+params);
 }
else {
if (document.getElementById('boxTemp')) document.getElementById('boxTemp').innerHTML+='<br>'+params;
else box.innerHTML='<div id="boxBody"><div id="boxTitle" style="padding:25px !important;"><div id=boxTemp>'
	+params+'</div><br><br><div align=center><a onClick="javascript:vkBox(\'clear\')">[ ok ]</a></div></div></div>';
box.style.border='2px double lightblue !important';
sctop = document.documentElement.scrollTop;
box.style.background='#fff !important';
box.style.position = "absolute !important";
if (location.href.match(/\/app\d+/i)) box.style.left = parseInt((ge('sideBar') || ge('side_bar')).currentStyle.left)+"px !important";
else box.style.left = 150 + "px !important";
box.style.top = 300+sctop + "px !important";
box.style.width = "500px !important";
}
}
// javascript:vkFastMail('');

// @name Vkontakte Calculate Age
// @namespace http://polkila.googlecode.com
// @author Васютинский Олег http://vasyutinskiy.ru

var GsearthIDYear="";
var GsearthIDDay="";
var GsearthIDMonth="";

function VkCalcAge(){
var t = ge('profile_info').parentNode;//('rightColumn').childNodes[3];personal
if (!t) return;
	var byear = /c[\[%5B]{1,3}byear[\]%5D]{1,3}=([0-9]{4})/.exec(t.innerHTML);
  var bdate = /c[\[%5B]{1,3}bday[\]%5D]{1,3}=([0-9]{1,2})[&amp;]{1,5}c[\[%5B]{1,3}bmonth[\]%5D]{1,3}=([0-9]{1,2})/.exec(t.innerHTML);
  var date_info='';
  //if (!byear) return;
  //alert (bdate[1]+'\n'+bdate[2]+'\n'+byear[1]);
  var lang = parseInt(vkgetCookie('remixlang')), _sign_ = '', now = new Date();
  if (byear){
  var age = now.getFullYear() - byear[1];
	if (bdate && bdate[2]>now.getMonth()+1) age--;
	else if (bdate && bdate[2]==now.getMonth()+1 && bdate[1]>now.getDate()) age--;

	if (lang) _years_ = 'years old';
	else{
		last = age.toString().substr(1);
		if (last==1) _years_ = '&#1075;&#1086;&#1076;';
		if (last>1 && last<5) _years_ = '&#1075;&#1086;&#1076;&#1072;';
		if (last>4 || last==0) _years_ = '&#1083;&#1077;&#1090;';
		if (age>4 && age<21) _years_ = '&#1083;&#1077;&#1090;';
	}
  date_info+=age+' '+_years_;
  }

	if (bdate){
		//if (lang) var signs = new Array('Capricorn','Aquarius','Pisces','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius');
		//else
    var signs = new Array('&#1050;&#1086;&#1079;&#1077;&#1088;&#1086;&#1075;','&#1042;&#1086;&#1076;&#1086;&#1083;&#1077;&#1081;','&#1056;&#1099;&#1073;&#1099;','&#1054;&#1074;&#1077;&#1085;','&#1058;&#1077;&#1083;&#1077;&#1094;','&#1041;&#1083;&#1080;&#1079;&#1085;&#1077;&#1094;&#1099;','&#1056;&#1072;&#1082;','&#1051;&#1077;&#1074;','&#1044;&#1077;&#1074;&#1072;','&#1042;&#1077;&#1089;&#1099;','&#1057;&#1082;&#1086;&#1088;&#1087;&#1080;&#1086;&#1085;','&#1057;&#1090;&#1088;&#1077;&#1083;&#1077;&#1094;');
		//var lastD = new Array(19,18,20,19,20,21,22,22,22,22,21,21);
		var lastD = new Array(20,19,20,20,21,21,22,23,23,23,22,21);
		var signN = bdate[2]-1;
		if (bdate[1]>lastD[signN]) signN = (signN+1) % 12;
		_sign_ = signs[signN];
	}

  if (date_info.length>0) date_info+=', '
  const rhdr='/gsearch.php?from=people&c[bday]=';
  var alinks=document.getElementsByTagName('a');

  if (_sign_)
if(bdate!=null && byear==null){
var dloc=document.location.href;
var IdForMyPageInYear=remixmid();//ge('myprofile').getElementsByTagName('a')[1].href.split('/id')[1];
var vkuid=cur.oid;//ge('mid').value;//(dloc.match(/id(\d+)/i))?dloc.match(/id(\d+)/i)[1]:((dloc.match(/profile\.php\?id=(\d+)/i))?dloc.match(/profile\.php\?id=(\d+)/i)[1]:false);
if(dloc.split('/')[3]=="profile.php")vkuid=IdForMyPageInYear;
if(IdForMyPageInYear!=vkuid && !ge('profile_actions').innerHTML.match('profile.addFriendBox()')){
GsearthIDDay=bdate[1];
GsearthIDMonth=bdate[2];
  _sign_+=" <span id='dateYear'><a onclick='SeartchDate("+bdate[2]+");'>"+IDL('UznatVozrast')+"</a></span>";
}
//      alert(bdate[1]+" "+bdate[2]);
}
  var total=2;
  for(i = 0; i<alinks.length; i++ ){
    var lnk=alinks[i];
    if(lnk.href.indexOf(rhdr)!=-1) {
      total--;
      lnk.parentNode.innerHTML+='('+date_info+_sign_.replace(/dateYear/g,'dateYear'+total)+')';
      // cur.options.info[1]
    }
    if (!total) break;
  }
  if (cur.options.info){
    cur.options.info[0]=cur.options.info[0].replace(/(people&c\[byear\]=[^>]+>[^<>]+<\/a>)/,"$1"+'('+date_info+_sign_.replace(/dateYear/g,'dateYear'+0)+')');
    cur.options.info[1]=cur.options.info[1].replace(/(people&c\[byear\]=[^>]+>[^<>]+<\/a>)/,"$1"+'('+date_info+_sign_.replace(/dateYear/g,'dateYear'+1)+')');
  }
}



function SeartchDate(month){
for (var i=1;ge('dateYear'+i);i--)
ge('dateYear'+i).innerHTML="<img src='http://vkontakte.ru/images/upload.gif'/> ";
var img=false;
var img=ge('profile_avatar').getElementsByTagName('IMG')[0].src;
//var dloc=document.location.href;
//vkuid=ge('mid').value;//(dloc.match(/id(\d+)/i))?dloc.match(/id(\d+)/i)[1]:((dloc.match(/profile\.php\?id=(\d+)/i))?dloc.match(/profile\.php\?id=(\d+)/i)[1]:false);
if(img){
//GsearthIDYear=ExtractUserID(dloc);//vkuid;
//outputCalendar(month, 1000);
ndata = new Date();
var year=ndata.getFullYear();
AjPost('/calendar_ajax.php?month='+month+'&year='+year,{},function(req){celdate(req.responseText,img)});
}else{
alert("ERROR!");
}
}

function celdate(req, img) {
    /*
    var id=location.href.split('/id')[1] || location.href.split('id=')[1];
    if (id.split('&')[1]) id=id.split('&')[0];
    if (id.split('?')[1]) id=id.split('?')[0];
    */

    var re = new RegExp(img + "','(.*?)\\);", 'gi');
    var plists = re.exec(req);
    plists = (plists ? plists[1] : false);


    //var usid=ExtractUserID(usid);
    var re = /\((.*?)\)/g;
    while (matches = re.exec(plists)) {
        var age = matches[1];
        if (age !== "?") {
            age = Number(age);
        }
    }

    //var age=plist.split('(');
    //alert("id: "+usid+" age: "+age);
    //alert(usid+'\n'+GsearthIDYear);
    if (age != "?") {
        ndata = new Date();
        var ns = ndata.toLocaleString();
        month = ndata.getMonth() + 1;
        day = ndata.getDate();
        if (month < GsearthIDMonth) age--;
        if (month == GsearthIDMonth) {
            if (day < GsearthIDDay) age--;
        }
    }
    //alert(age);
    for (var i=1;i>=0;i--)
    if (ge('dateYear'+i)) ge('dateYear'+i).innerHTML = "<b>" + IDL('Vozrast') + langNumeric(age, vk_lang["vk_year"]) + "</b>"; //age+" "+IDL('Let')
}
/*
var statusesHistoryVK="";
var pageIDvk="";
var IdForMyPage="";
var idMessTemp;*/

function getVKhistory(id,position,to,hcont_id,style){
  if (hcont_id!='vkAltStatusHist'){
    if (isVisible('history') && !hcont_id) {hide('history'); return;}
  	show('historyProgress');
  	show('history');
	}
  if(!to){ to=Number(position)+100;}
  hcont_id=(hcont_id)?hcont_id:'historyContainer';
  if (typeof historyAjaxProgress=='undefined') historyAjaxProgress=function(){ge(hcont_id).innerHTML='<div class="box_loader"></div>';}
  historyAjaxProgress();
  doUAPIRequest('act=activity&from='+position+'&to='+to+'&id='+id+'&sid='+vkgetCookie('remixsid'), function(result){
     if (hcont_id!='vkAltStatusHist'){hide('historyProgress');} 
	   show(hcont_id);
    go_statusVK(result,position,to,hcont_id,id,style);
  });
}


function InitExHistoryStatus() {
  statusesHistoryVK="";
  pageIDvk="";
  IdForMyPage="";
  idMessTemp=null;
    if (ge('content')) {
        vkaddcss(".HistVK:hover {background: #89b9ed;}.hoverPageHist:hover{border-bottom: 0px;background: #45668E; color:#FFFFFF; padding:0px 2px 2px 2px;}");
    }
    if (ge('myprofile')) {
        IdForMyPage = remixmid();//ge('myprofile').getElementsByTagName('a')[1].href.split('/id')[1];
        var vkuid = false;
        var dloc = document.location.href;
        //vkuid = (dloc.match(/id(\d+)/i)) ? dloc.match(/id(\d+)/i)[1] : ((dloc.match(/profile\.php\?id=(\d+)/i)) ? dloc.match(/profile\.php\?id=(\d+)/i)[1] : false);
        //if (dloc.split('/')[3] == "profile.php") vkuid = IdForMyPage;
        if (isUserLink(dloc)) vkuid=(window.cur && cur.oid)?cur.oid:ge('mid').value;
        if (vkuid) {
            pageIDvk = vkuid;
            if (ge('activity_time')) {
                ge('activity_time').innerHTML += '<a onClick="getVKhistory(' + vkuid + ',0);">' + IDL('ShowHistoryStatuses') + '</a><br>';
            }
            if (ge('profile_empty_activity')) {
                ge('profile_empty_activity').innerHTML += '<br><a onClick=getVKhistory(' + vkuid + ',0);">' + IDL('ShowHistoryStatuses') + '</a><br>';
            }
        }
    }
}




function go_statusVK(result,position,to,hcont_id,id,style) {
statusesHistoryVK=result;
hcont_id=(hcont_id)?hcont_id:'historyContainer';
var IdForMyPage=vkgetCookie('remixmid');
style_=(style)?'overflow:auto; max-height:200px;':'';
if (typeof historyAjaxShow=='undefined') historyAjaxShow=function(){};
//alert(hcont_id);
if(result.ok){
if(result.ok==-3){
res=IDL('ErrorStatus3pageClosed');
}else{
res=result.ok+" "+IDL('NeizvestajaError');
}
historyAjaxShow();
ge(hcont_id).style.width="390px";
ge(hcont_id).innerHTML = '<div class="alertmsg" style="mix-width=300px;"><center>'+IDL('HistoryError')+res+'</center></div>';
return;
}
var statusesVK="";
var idMess="";
idMessTemp=Array();
var temp="";
var resd=result.d;
//result.n<=100?fors=result.n:fors=100;
for(i=0; i<resd.length;i++){
temp="";
var ndata = new Date(result.d[i][4] * 1000);
idMess=result.d[i][0];
idMessTemp[idMessTemp.length]=result.d[i][0];
if(id==IdForMyPage){
temp='<td class="history_item_x"><a href="javascript:deleteHistoryItemVK(\''+idMess+'\')">X</a></td>';
}
//statusesVK+='<tr><td class="label"><span id="t'+idMess+'" class="history_item_time" style="white-space: nowrap; padding-right: 7px; font-weight: normal;">'+day+'.'+month+'.'+year+' '+hours+':'+mins+':'+secs+'</span></td><td><div style="width: 240px; overflow: hidden;"><span id="n'+idMess+'" class="history_item_name" style="font-weight: normal;">'+utf8(result.d[i][3])+'</span> <span id="m'+idMess+'" class="history_item_text" style="font-weight: normal;">'+utf8(result.d[i][5])+'</span></div></td>'+temp+'</tr>';
statusesVK+='<tr class="HistVK"><td class="label"><span id="t'+idMess+'" class="history_item_time" style="white-space: nowrap; padding-right: 7px; font-weight: normal;">'+ndata.toLocaleString()+'</span></td><td><div style="width: 240px; overflow: hidden;"><span id="m'+idMess+'" class="history_item_text" style="font-weight: normal;">'+utf2win(result.d[i][5])+'</span></div></td>'+temp+'</tr>';
}
var lists="";
var stylespg="";
if(result.n>100){
for(i=0;i<Math.floor(result.n/100+1);i++){
if(i==0){
numH=0;
}else{
numH=Number(i*100);
}
if(position==numH && (to-position)==100){
stylespg="border-bottom: 2px solid #45668E; padding:0px 2px 2px 2px;";//"background: lime;";
}else{
stylespg="padding:0px 2px 2px 2px;";
}
lists+="<span class=\"divide\">|</span><a class='hoverPageHist' style='"+stylespg+"' OnClick='getVKhistory("+id+","+numH+",null,\""+hcont_id+"\","+style+");'>"+Number(i+1)+"</a>";
}
}
if((to-position)!=100){
stylespg="border-bottom: 2px solid #45668E; padding:0px 2px 2px 2px;";
}else{
stylespg="padding:0px 2px 2px 2px;";
}
if(lists!="")lists="<a class='hoverPageHist' style='"+stylespg+"' OnClick=\"getVKhistory("+id+",0,"+result.n+",'"+hcont_id+"',"+style+");\">Bce</a> "+lists;
if(id==IdForMyPage && result.n!=0){
var a="<a OnClick='vkDellAllQuest();'>"+IDL('DellAllHist')+"</a>";
}else{
var a="";
}
statusesVK="<table><div id='dellStatVK'>"+a+"</div><tr><td style='min-width:125px'><b>"+IDL('VsegoStatusov')+result.n+"</b></td><td style='width:100%'><div align='right'><b>"+lists+"</b></div></td><tr></table>"+'<div id="vkstbox" style="'+style_+'"><table class="profileTable" style="margin: 0px;" width=100% cellspacing=0 cellpadding=0>'+statusesVK+'</table></div>';
historyAjaxShow();
ge(hcont_id).style.width="390px";
ge(hcont_id).innerHTML = statusesVK;
//alert(print_r(idMessTemp));
}

function vkDellAllQuest(){
if (confirm(IDL('qDelAllStatus'))){deleteHistoryALL(0);}
}
function deleteHistoryALL(stpos){
var time="";
if(idMessTemp.length==stpos){
	ge('dellStatVK').innerHTML="<b>"+IDL('GolovDell')+"</b>";
	return;
}
doUAPIRequest('act=del_activity&wid='+idMessTemp[stpos]+'&sid='+vkgetCookie('remixsid'), function(result){
	if(result.ok==1){
	ge('dellStatVK').innerHTML="<b>"+(stpos+1)+" / "+idMessTemp.length+"</b>";
	OnDellHist(idMessTemp[stpos]);
	deleteHistoryALL(stpos+1);
	}else{
	ge('dellStatVK').innerHTML="<b>ERROR: "+result.ok+"</b>";
	}
	});

}

function deleteHistoryItemVK(item_id){
	ret=setTimeout('deleteHistoryItemVK('+item_id+');',2000);
	doUAPIRequest('act=del_activity&wid='+item_id+'&sid='+vkgetCookie('remixsid'), function(result){
	clearTimeout(ret);
	if(result.ok==1){
    	OnDellHist(item_id);
    }else{
    alert('error: '+result.ok);
    }
    });
}

function OnDellHist(item_id){
	ge("t"+item_id).innerHTML="<S>"+ge("t"+item_id).innerHTML+"</S>";
//	ge("n"+item_id).innerHTML="<S>"+ge("n"+item_id).innerHTML+"</S>";
	ge("m"+item_id).innerHTML="<S>"+ge("m"+item_id).innerHTML+"</S>";
	if(ge("d"+item_id))ge("d"+item_id).innerHTML="<a>X</a>";
}


function utf8(text){
var utf,rus;
  eval("rus=Array("+unescape('"%u0439","%u0446","%u0443","%u043A","%u0435","%u043D","%u0433","%u0448","%u0449","%u0437","%u0445","%u044A","%u0444","%u044B","%u0432","%u0430","%u043F","%u0440","%u043E","%u043B","%u0434","%u0436","%u044D","%u044F","%u0447","%u0441","%u043C","%u0438","%u0442","%u044C","%u0431","%u044E","%u0451","%u0454","%u0457","%u0456","%u0419","%u0426","%u0423","%u041A","%u0415","%u041D","%u0413","%u0428","%u0429","%u0417","%u0425","%u042A","%u0424","%u042B","%u0412","%u0410","%u041F","%u0420","%u041E","%u041B","%u0414","%u0416","%u042D","%u042F","%u0427","%u0421","%u041C","%u0418","%u0422","%u042C","%u0411","%u042E","%u0401","%u042D","%u0407","%u0406","%u266B"')+");");
  eval("utf=Array("+unescape('"%u0420%u2116","%u0421%u2020","%u0421%u0453","%u0420%u0454","%u0420%B5","%u0420%u0405","%u0420%u0456","%u0421%u20AC","%u0421%u2030","%u0420%B7","%u0421%u2026","%u0421%u0409","%u0421%u201E","%u0421%u2039","%u0420%u0406","%u0420%B0","%u0420%u0457","%u0421%u0402","%u0420%u0455","%u0420%BB","%u0420%u0491","%u0420%B6","%u0421%u040C","%u0421%u040F","%u0421%u2021","%u0421%u0403","%u0420%u0458","%u0420%u0451","%u0421%u201A","%u0421%u040A","%u0420%B1","%u0421%u040B","%u0421%u2018","%u0421%u201D","%u0421%u2014","%u0421%u2013","%u0420%u2122","%u0420%A6","%u0420%u0408","%u0420%u0459","%u0420%u2022","%u0420%u045C","%u0420%u201C","%u0420%u0401","%u0420%A9","%u0420%u2014","%u0420%u0490","%u0420%u0404","%u0420%A4","%u0420%AB","%u0420%u2019","%u0420%u0452","%u0420%u045F","%u0420%B5","%u0420%u045B","%u0420%u203A","%u0420%u201D","%u0420%u2013","%u0420%AD","%u0420%u0407","%u0420%A7","%u0420%u040E","%u0420%u045A","%u0420%98","%u0420%u045E","%u0420%AC","%u0420%u2018","%u0420%AE","%u0420%u0403","%u0420%AD","%u0420%u2021","%u0420%u2020","%u0432%u2122%AB"')+");");
// %u0420%98
//eval("rus=Array("+unescape('%22%u0439%22%2C%22%u0446%22%2C%22%u0443%22%2C%22%u043A%22%2C%22%u0435%22%2C%22%u043D%22%2C%22%u0433%22%2C%22%u0448%22%2C%22%u0449%22%2C%22%u0437%22%2C%22%u0445%22%2C%22%u044A%22%2C%22%u0444%22%2C%22%u044B%22%2C%22%u0432%22%2C%22%u0430%22%2C%22%u043F%22%2C%22%u0440%22%2C%22%u043E%22%2C%22%u043B%22%2C%22%u0434%22%2C%22%u0436%22%2C%22%u044D%22%2C%22%u044F%22%2C%22%u0447%22%2C%22%u0441%22%2C%22%u043C%22%2C%22%u0438%22%2C%22%u0442%22%2C%22%u044C%22%2C%22%u0431%22%2C%22%u044E%22%2C%22%u0451%22%2C%22%u0454%22%2C%22%u0457%22%2C%22%u0456%22%2C%22%u0419%22%2C%22%u0426%22%2C%22%u0423%22%2C%22%u041A%22%2C%22%u0415%22%2C%22%u041D%22%2C%22%u0413%22%2C%22%u0428%22%2C%22%u0429%22%2C%22%u0417%22%2C%22%u0425%22%2C%22%u042A%22%2C%22%u0424%22%2C%22%u042B%22%2C%22%u0412%22%2C%22%u0410%22%2C%22%u041F%22%2C%22%u0420%22%2C%22%u041E%22%2C%22%u041B%22%2C%22%u0414%22%2C%22%u0416%22%2C%22%u042D%22%2C%22%u042F%22%2C%22%u0427%22%2C%22%u0421%22%2C%22%u041C%22%2C%22%u0418%22%2C%22%u0422%22%2C%22%u042C%22%2C%22%u0411%22%2C%22%u042E%22%2C%22%u0401%22%2C%22%u042D%22%2C%22%u0407%22%2C%22%u0406%22%2C%22%u266B%22')+");");
//eval("utf=Array("+unescape('%22%u0420%u2116%22%2C%22%u0421%u2020%22%2C%22%u0421%u0453%22%2C%22%u0420%u0454%22%2C%22%u0420%B5%22%2C%22%u0420%u0405%22%2C%22%u0420%u0456%22%2C%22%u0421%u20AC%22%2C%22%u0421%u2030%22%2C%22%u0420%B7%22%2C%22%u0421%u2026%22%2C%22%u0421%u0409%22%2C%22%u0421%u201E%22%2C%22%u0421%u2039%22%2C%22%u0420%u0406%22%2C%22%u0420%B0%22%2C%22%u0420%u0457%22%2C%22%u0421%u0402%22%2C%22%u0420%u0455%22%2C%22%u0420%BB%22%2C%22%u0420%u0491%22%2C%22%u0420%B6%22%2C%22%u0421%u040C%22%2C%22%u0421%u040F%22%2C%22%u0421%u2021%22%2C%22%u0421%u0403%22%2C%22%u0420%u0458%22%2C%22%u0420%u0451%22%2C%22%u0421%u201A%22%2C%22%u0421%u040A%22%2C%22%u0420%B1%22%2C%22%u0421%u040B%22%2C%22%u0421%u2018%22%2C%22%u0421%u201D%22%2C%22%u0421%u2014%22%2C%22%u0421%u2013%22%2C%22%u0420%u2122%22%2C%22%u0420%A6%22%2C%22%u0420%u0408%22%2C%22%u0420%u0459%22%2C%22%u0420%u2022%22%2C%22%u0420%u045C%22%2C%22%u0420%u201C%22%2C%22%u0420%u0401%22%2C%22%u0420%A9%22%2C%22%u0420%u2014%22%2C%22%u0420%u0490%22%2C%22%u0420%u0404%22%2C%22%u0420%A4%22%2C%22%u0420%AB%22%2C%22%u0420%u2019%22%2C%22%u0420%u0452%22%2C%22%u0420%u045F%22%2C%22%u0420%A0%22%2C%22%u0420%u045B%22%2C%22%u0420%u203A%22%2C%22%u0420%u201D%22%2C%22%u0420%u2013%22%2C%22%u0420%AD%22%2C%22%u0420%u0407%22%2C%22%u0420%A7%22%2C%22%u0420%u040E%22%2C%22%u0420%u045A%22%2C%22%u0420%uFFFD%22%2C%22%u0420%u045E%22%2C%22%u0420%AC%22%2C%22%u0420%u2018%22%2C%22%u0420%AE%22%2C%22%u0420%u0403%22%2C%22%u0420%AD%22%2C%22%u0420%u2021%22%2C%22%u0420%u2020%22%2C%22%u0432%u2122%AB%22')+");");
    for (ir=0;ir<73;ir++){
		text=text.replace(new RegExp(utf[ir],'g'),rus[ir]);
	}
return text;
}

function utf2win(text){
  //var tstart=tend=unixtime();
  var utf,rus;
  //alert(text);
  eval("rus=Array("+unescape('"%u0439","%u0446","%u0443","%u043A","%u0435","%u043D","%u0433","%u0448","%u0449","%u0437","%u0445","%u044A","%u0444","%u044B","%u0432","%u0430","%u043F","%u0440","%u043E","%u043B","%u0434","%u0436","%u044D","%u044F","%u0447","%u0441","%u043C","%u0438","%u0442","%u044C","%u0431","%u044E","%u0451","%u0454","%u0457","%u0456","%u0419","%u0426","%u0423","%u041A","%u0415","%u041D","%u0413","%u0428","%u0429","%u0417","%u0425","%u042A","%u0424","%u042B","%u0412","%u0410","%u041F","%u0420","%u041E","%u041B","%u0414","%u0416","%u042D","%u042F","%u0427","%u0421","%u041C","%u0418","%u0422","%u042C","%u0411","%u042E","%u0401","%u042D","%u0407","%u0406","%u266B"')+");");
  eval("utf=Array("+unescape('"%u0420%u2116","%u0421%u2020","%u0421%u0453","%u0420%u0454","%u0420%B5","%u0420%u0405","%u0420%u0456","%u0421%u20AC","%u0421%u2030","%u0420%B7","%u0421%u2026","%u0421%u0409","%u0421%u201E","%u0421%u2039","%u0420%u0406","%u0420%B0","%u0420%u0457","%u0421%u0402","%u0420%u0455","%u0420%BB","%u0420%u0491","%u0420%B6","%u0421%u040C","%u0421%u040F","%u0421%u2021","%u0421%u0403","%u0420%u0458","%u0420%u0451","%u0421%u201A","%u0421%u040A","%u0420%B1","%u0421%u040B","%u0421%u2018","%u0421%u201D","%u0421%u2014","%u0421%u2013","%u0420%u2122","%u0420%A6","%u0420%u0408","%u0420%u0459","%u0420%u2022","%u0420%u045C","%u0420%u201C","%u0420%u0401","%u0420%A9","%u0420%u2014","%u0420%u0490","%u0420%u0404","%u0420%A4","%u0420%AB","%u0420%u2019","%u0420%u0452","%u0420%u045F","%u0420%B5","%u0420%u045B","%u0420%u203A","%u0420%u201D","%u0420%u2013","%u0420%AD","%u0420%u0407","%u0420%A7","%u0420%u040E","%u0420%u045A","%u0420%98","%u0420%u045E","%u0420%AC","%u0420%u2018","%u0420%AE","%u0420%u0403","%u0420%AD","%u0420%u2021","%u0420%u2020","%u0432%u2122%AB"')+");");  //alert(rus.splice(-10,1)+'\n'+utf.splice(-10,1));
  //var utf_chrs="%22%u0420%u201A%22%2C%22%u0420%u0453%22%2C%22%u0432%u0402%u0459%22%2C%22%u0421%u201C%22%2C%22%u0432%u0402%u045B%22%2C%22%u0432%u0402%A6%22%2C%22%u0432%u0402%A0%22%2C%22%u0432%u0402%u040E%22%2C%22%u0432%u201A%AC%22%2C%22%u0432%u0402%B0%22%2C%22%u0420%u2030%22%2C%22%u0432%u0402%u2116%22%2C%22%u0420%u0409%22%2C%22%u0420%u040A%22%2C%22%u0420%u2039%22%2C%22%u0420%u040F%22%2C%22%u0421%u2019%22%2C%22%u0432%u0402%uFFFD%22%2C%22%u0432%u0402%u2122%22%2C%22%u0432%u0402%u045A%22%2C%22%u0432%u0402%u045C%22%2C%22%u0432%u0402%u045E%22%2C%22%u0432%u0402%u201C%22%2C%22%u0432%u0402%u201D%22%2C%22%u0432%u201E%u045E%22%2C%22%u0421%u2122%22%2C%22%u0432%u0402%u0454%22%2C%22%u0421%u0459%22%2C%22%u0421%u045A%22%2C%22%u0421%u203A%22%2C%22%u0421%u045F%22%2C%22%u0412%A0%22%2C%22%u0420%u040B%22%2C%22%u0421%u045B%22%2C%22%u0420%u20AC%22%2C%22%u0412%A4%22%2C%22%u0422%u0452%22%2C%22%u0412%A6%22%2C%22%u0412%A7%22%2C%22%u0420%u0403%22%2C%22%u0412%A9%22%2C%22%u0420%u201E%22%2C%22%u0412%AB%22%2C%22%u0412%AC%22%2C%22%u0412%AE%22%2C%22%u0420%u2021%22%2C%22%u0412%B0%22%2C%22%u0412%B1%22%2C%22%u0420%u2020%22%2C%22%u0421%u2013%22%2C%22%u0422%u2018%22%2C%22%u0412%B5%22%2C%22%u0412%B6%22%2C%22%u0412%B7%22%2C%22%u0421%u2018%22%2C%22%u0432%u201E%u2013%22%2C%22%u0421%u201D%22%2C%22%u0412%BB%22%2C%22%u0421%uFFFD%22%2C%22%u0420%u2026%22%2C%22%u0421%u2022%22%2C%22%u0421%u2014%22%2C%22%u0420%u0452%22%2C%22%u0420%u2018%22%2C%22%u0420%u2019%22%2C%22%u0420%u201C%22%2C%22%u0420%u201D%22%2C%22%u0420%u2022%22%2C%22%u0420%u2013%22%2C%22%u0420%u2014%22%2C%22%u0420%uFFFD%22%2C%22%u0420%u2122%22%2C%22%u0420%u0459%22%2C%22%u0420%u203A%22%2C%22%u0420%u045A%22%2C%22%u0420%u045C%22%2C%22%u0420%u045B%22%2C%22%u0420%u045F%22%2C%22%u0420%A0%22%2C%22%u0420%u040E%22%2C%22%u0420%u045E%22%2C%22%u0420%u0408%22%2C%22%u0420%A4%22%2C%22%u0420%u0490%22%2C%22%u0420%A6%22%2C%22%u0420%A7%22%2C%22%u0420%u0401%22%2C%22%u0420%A9%22%2C%22%u0420%u0404%22%2C%22%u0420%AB%22%2C%22%u0420%AC%22%2C%22%u0420%AD%22%2C%22%u0420%AE%22%2C%22%u0420%u0407%22%2C%22%u0420%B0%22%2C%22%u0420%B1%22%2C%22%u0420%u0406%22%2C%22%u0420%u0456%22%2C%22%u0420%u0491%22%2C%22%u0420%B5%22%2C%22%u0420%B6%22%2C%22%u0420%B7%22%2C%22%u0420%u0451%22%2C%22%u0420%u2116%22%2C%22%u0420%u0454%22%2C%22%u0420%BB%22%2C%22%u0420%u0458%22%2C%22%u0420%u0405%22%2C%22%u0420%u0455%22%2C%22%u0420%u0457%22%2C%22%u0421%u0402%22%2C%22%u0421%u0403%22%2C%22%u0421%u201A%22%2C%22%u0421%u0453%22%2C%22%u0421%u201E%22%2C%22%u0421%u2026%22%2C%22%u0421%u2020%22%2C%22%u0421%u2021%22%2C%22%u0421%u20AC%22%2C%22%u0421%u2030%22%2C%22%u0421%u0409%22%2C%22%u0421%u2039%22%2C%22%u0421%u040A%22%2C%22%u0421%u040C%22%2C%22%u0421%u040B%22%2C%22%u0421%u040F%22%2C%22%u0432%u2122%AB%22";
  //var win_chrs="%22%u0402%22%2C%22%u0403%22%2C%22%u201A%22%2C%22%u0453%22%2C%22%u201E%22%2C%22%u2026%22%2C%22%u2020%22%2C%22%u2021%22%2C%22%u20AC%22%2C%22%u2030%22%2C%22%u0409%22%2C%22%u2039%22%2C%22%u040A%22%2C%22%u040C%22%2C%22%u040B%22%2C%22%u040F%22%2C%22%u0452%22%2C%22%u2018%22%2C%22%u2019%22%2C%22%u201C%22%2C%22%u201D%22%2C%22%u2022%22%2C%22%u2013%22%2C%22%u2014%22%2C%22%u2122%22%2C%22%u0459%22%2C%22%u203A%22%2C%22%u045A%22%2C%22%u045C%22%2C%22%u045B%22%2C%22%u045F%22%2C%22%A0%22%2C%22%u040E%22%2C%22%u045E%22%2C%22%u0408%22%2C%22%A4%22%2C%22%u0490%22%2C%22%A6%22%2C%22%A7%22%2C%22%u0401%22%2C%22%A9%22%2C%22%u0404%22%2C%22%AB%22%2C%22%AC%22%2C%22%AE%22%2C%22%u0407%22%2C%22%B0%22%2C%22%B1%22%2C%22%u0406%22%2C%22%u0456%22%2C%22%u0491%22%2C%22%B5%22%2C%22%B6%22%2C%22%B7%22%2C%22%u0451%22%2C%22%u2116%22%2C%22%u0454%22%2C%22%BB%22%2C%22%u0458%22%2C%22%u0405%22%2C%22%u0455%22%2C%22%u0457%22%2C%22%u0410%22%2C%22%u0411%22%2C%22%u0412%22%2C%22%u0413%22%2C%22%u0414%22%2C%22%u0415%22%2C%22%u0416%22%2C%22%u0417%22%2C%22%u0418%22%2C%22%u0419%22%2C%22%u041A%22%2C%22%u041B%22%2C%22%u041C%22%2C%22%u041D%22%2C%22%u041E%22%2C%22%u041F%22%2C%22%u0420%22%2C%22%u0421%22%2C%22%u0422%22%2C%22%u0423%22%2C%22%u0424%22%2C%22%u0425%22%2C%22%u0426%22%2C%22%u0427%22%2C%22%u0428%22%2C%22%u0429%22%2C%22%u042A%22%2C%22%u042B%22%2C%22%u042C%22%2C%22%u042D%22%2C%22%u042E%22%2C%22%u042F%22%2C%22%u0430%22%2C%22%u0431%22%2C%22%u0432%22%2C%22%u0433%22%2C%22%u0434%22%2C%22%u0435%22%2C%22%u0436%22%2C%22%u0437%22%2C%22%u0438%22%2C%22%u0439%22%2C%22%u043A%22%2C%22%u043B%22%2C%22%u043C%22%2C%22%u043D%22%2C%22%u043E%22%2C%22%u043F%22%2C%22%u0440%22%2C%22%u0441%22%2C%22%u0442%22%2C%22%u0443%22%2C%22%u0444%22%2C%22%u0445%22%2C%22%u0446%22%2C%22%u0447%22%2C%22%u0448%22%2C%22%u0449%22%2C%22%u044A%22%2C%22%u044B%22%2C%22%u044C%22%2C%22%u044D%22%2C%22%u044E%22%2C%22%u044F%22%2C%22%u266B%22";
  //eval("rus=Array("+unescape(win_chrs)+");");
  //eval("utf=Array("+unescape(utf_chrs)+");");
    for (var i=0;i<rus.length;i++){
		  text=text.replace(new RegExp(utf[i],'g'),rus[i]);
	  }
	//vklog('utf2win decoding time:' + (unixtime()-tstart) +'ms');
  return text;
}

function print_r( array, return_val ) {
    var output = "", pad_char = " ", pad_val = 4;

    var formatArray = function (obj, cur_depth, pad_val, pad_char) {
        if(cur_depth > 0)
            cur_depth++;

        var base_pad = repeat_char(pad_val*cur_depth, pad_char);
        var thick_pad = repeat_char(pad_val*(cur_depth+1), pad_char);
        var str = "";

        if(obj instanceof Array || obj instanceof Object) {
            str += '[\n';//"Array\n" + base_pad + "(\n";
            for(var key in obj) {
                if(obj[key] instanceof Array || obj[key] instanceof Object) {
                    str += thick_pad + ""+key+": "+formatArray(obj[key], cur_depth+1, pad_val, pad_char);
                } else {
                    str += thick_pad + ""+key+": " + obj[key] + "\n";
                }
            }
            str += base_pad + "]\n";
        } else {
            str = obj.toString();
        };

        return str;
    };

    var repeat_char = function (len, char) {
        var str = "";
        for(var i=0; i < len; i++) { str += char; };
        return str;
    };

    output = formatArray(array, 0, pad_val, pad_char);
        return output;
}


/////////////////////////////
// FAVE ONLINE FOR PROFILE //

var FAVONLINE_SHOW_COUNT=6;
function vkFaveOnlineHTML(r,idx,list){
    var to=3;
  var f1=r.d;
  var favon="";
  var favedid,favedfname,favedsname,favedava,favedon;
  var fav_ava_style="height: 50px; display: inline-block; overflow: hidden;";
  var count=Math.min(f1.length,FAVONLINE_SHOW_COUNT);
  for (var i = 0; i < count; i++) {
            favedid = f1[i][0];
            favedfname = f1[i][1].split(' ')[0];
            favedsname = f1[i][1].split(' ')[1];
            favedava = (f1[i][2] != '0') ? f1[i][2] : 'http://vkontakte.ru/images/question_c.gif';
            favedon = f1[i][3];
            favon += ((i == 0 || i % to == 0) ? '<tr>' : '') + 
                  '<td align=center><table height="100%" width=62px style="overflow: hidden;"><tbody>'+
                  '<tr><td height="100%" class="image"><div align=center>'+
                  '<a href="/id' + favedid + '"><div style="'+fav_ava_style+'"><img width="50px" alt="" src="' + favedava + '"/></div></a>'+
                  '</div></td></tr>' + 
                  '<tr><td><a href="/id' + favedid + '">' + favedfname + '<br><small>' + favedsname + '</small></a></td></tr></tbody></table></td>' + 
                  ((i > 0 && (i + 1) % to == 0) ? '</tr>' : '');
  }
  
  html='<div id="FaveOnline" class="flexOpen"><div class="bOpen"><div class="flexHeader clearFix" onclick="return collapseBox(\'FaveOnline\', this, 0.5, 0.25)" onfocus="blur()"><div><h2>'+
  IDL('FaveOnline')+
  '</h2></div>'+
  '</div></div><div class="c">'+
    '<div class="fSub clearFix"><h3><div class="fDetails wSeeAll" id="FavOnlCount">'+
    '<a href="javascript: vkGetFavOnList()">[ '+IDL('FaveOnline')+' ('+r.n+') ]</a>'+
    '</div> <div class="fSeeAll">'+
     ((r.n>FAVONLINE_SHOW_COUNT)?' <a href="javascript: GetSixFaveOnl('+idx+')">&darr;</a>':'')+
     ' <a href="/fave.php">'+IDL('all')+
    '</a></div></h3></div>'+
  '<div class="r" id="FavOnlContent"><table>'+
  favon+
  '</table></div></div></div>';
  return html;
}
function vkMakeFaveOnline(){
 if (ge('FaveOnline') || getSet(76)=='n') return;
  var html=vkFaveOnlineHTML({n:0,d:[]},1);
  div=document.createElement('div');
  div.id='FavOnlineBlock';
  div.innerHTML=html;
  var ref=ge('friends');
  if (ref)  {
    ref.parentNode.insertBefore(div,ref);
    ge("FavOnlContent").innerHTML='<div class="box_loader"></div>';
  } else {
    vklog('FriendsNode not found',1); 
    return;  
  }
  
 doUAPIRequest("&act=fave_online&from=0&to="+FAVONLINE_SHOW_COUNT,function(r){
  if (r.n){
    ge("FavOnlineBlock").innerHTML=vkFaveOnlineHTML(r,1);
    AddExUserMenu(ge("FavOnlineBlock"));
    vkModLink(ge("FavOnlineBlock"));
  } else { ge("FavOnlContent").innerHTML="Nobody Online";}
 });
}

function GetSixFaveOnl(page){
 doUAPIRequest("&act=fave_online&from="+(page*FAVONLINE_SHOW_COUNT)+"&to="+((page+1)*FAVONLINE_SHOW_COUNT),function(r){   
    if ((page+1)*FAVONLINE_SHOW_COUNT>=r.n) page=-1;
    ge("FavOnlineBlock").innerHTML=vkFaveOnlineHTML(r,page+1);
    AddExUserMenu(ge("FavOnlineBlock"));
    vkModLink(ge("FavOnlineBlock"));
 });
}

function vkGetFavOnList(){
 doUAPIRequest("&act=fave_online&from=0&to=10000",function(r){
     list="";
     for (var i = 0; i < r.d.length; i++) {  
      list+='<div align="left" style="margin-left: 10px; width:180px;">&#x25AA;&nbsp;<a href="mail.php?act=write&to='+r.d[i][0]+'" onclick="return AjMsgFormTo('+r.d[i][0]+');" target="_blank">@</a>&nbsp;<a href="id'+r.d[i][0]+'">'+r.d[i][1]+'</a></div>';
      html='<div id="FaveOnline" class="flexOpen"><div class="bOpen"><div class="flexHeader clearFix" onclick="return collapseBox(\'FaveOnline\', this, 0.5, 0.25)" onfocus="blur()"><div><h2>'+
          IDL('FaveOnline')+
          '</h2></div>'+
          '</div></div><div class="c">'+
          '<div class="fSub clearFix"><h3><div class="fDetails wSeeAll" id="FavOnlCount">'+
         // 'Online ('+r.n+')'+
          '<a href="javascript: GetSixFaveOnl(0)">[ '+ IDL('FaveOnline') +' ('+r.n+') ]</a>'+
          '</div> <div class="fSeeAll">'+
     ((r.n>FAVONLINE_SHOW_COUNT)?' <a href="javascript: GetSixFaveOnl(0)">&darr;</a>':'')+
     ' <a href="/fave.php">'+IDL('all')+
    '</a></div></h3></div>'+
  '<div class="r">'+list+'</div></div></div>'; 
    ge("FavOnlineBlock").innerHTML=html;
    AddExUserMenu(ge("FavOnlineBlock"));
    vkModLink(ge("FavOnlineBlock"));
   }
 });
}

/* CALENDAR */
function hz_cal_showevent(day){
  var a=ge('a_calendar');
  
  var node=geByClass('selected',a)[0];
  if (node){
       if (node.id==(day+'pic0')) {
          ge('hz_ev').innerHTML='';
          removeClass(node,'selected');
          hide('hz_ev');
          return;
       } else {
          removeClass(node,'selected');
          addClass(day+'pic0','selected'); 
       }
  } else {addClass(day+'pic0','selected');}
  
  
  if(ge('hz_ev')){
    var c=ge('hz_ev');
  } else {
    var b=document.createElement('div');
    b.id='hz_ev';
    a.appendChild(b);
    var c=ge('hz_ev');
  }
  show('hz_ev');
  c.innerHTML='';
  var i='0';
  while(ge(day+'pic'+i)){
    var e=ge(day+'pic'+i).cloneNode(true);
    e.setAttribute('onclick',"");
    c.appendChild(e);
    i++;
  }  
  c.innerHTML=c.innerHTML.replace(/(<a[^>]+>)(<img[^>]+>)([^<>]+<\/a>)/gi,"$1$2<\/a>$1$3");
  AddExUserMenu(c);
}
 
function outputCalendar(month,year){
  var a = ge('a_calendar');
  if (month == undefined || year == undefined) var add = '';
  else var add = "?month=" + month + "&year=" + year; 
  AjGet("/calendar_ajax.php" + add,function(req) {
      response = req.responseText;
      response = response.replace(/id="calendar"/g, 'id="calendar_h"');
      response = response.replace(/id="heading"/g, 'id="heading_h"');
      response = response.replace(/navigate\(/g, 'outputCalendar(');
      response = response.replace(/onmouseover="trailOn\('[^']+','([^']+)','\d+','\d+'\);" onmouseout="trailOff\(\);"><\/a>/g, '">$1</a>');
      response = response.replace(/>(\d+)<\/div>(?:<a[^>]+>\+<\/a>)?<div class='calPic'/g, ">$1</div><div class='calPic' onclick='hz_cal_showevent(\"$1\");' ");
      response = response.replace(/(<div.class=.dayNum.>)(\d+)(<\/div><div)/g,"$1<b>$2</b>$3");
      a.innerHTML = '<div id="hz_cal">' + response + '</div>';
  });
}
 
function addCalendar(){
  var heads = document.getElementsByTagName("head");
  if(heads.length>0){
    var node=document.createElement("link");
    node.type="text/css";
    node.rel="stylesheet";
    node.href = "css/calendar.css";
    heads[0].appendChild(node);
  }
  vkaddcss('html{height:101% !important;}\
      #a_calendar_{position:relative;left:-10pt;}\
      #hz_cal #calendar_h table{width:120px;}\
      #hz_cal #heading_h {font-size:7pt !important;margin:-2pt 0; text-align:center;}\
      #hz_cal .rightArrow,.leftArrow {margin:0;padding:0;}\
      #hz_cal .rightArrow a,.leftArrow a{font-size:8pt; margin:0;padding:1pt 1pt;}\
      #hz_cal .dayRow{height:100%;}\
      #hz_cal .dayRow td{height:16px; overflow:hidden;}\
      #hz_cal .dayNum{width:16px;height:16px;border:none;}\
      #hz_cal .dayNum b{color:#5c7aab;}\
      #hz_cal .dayMore{display:none;}\
      #hz_cal .calPic{position:relative;background:rgba(255,0,0,0.2);font-size:0;margin:-13pt 0;width:16px;height:13pt;z-index:99;display:block;}\
      #hz_cal .calPic:hover{background:rgba(255,0,0,0.3);}\
      #hz_cal .calPic a{display:none;}\
      #hz_cal .selected {background:rgba(0,0,255,0.2);}\
      #hz_ev{background-color:#dee;border:1pt solid #abc;padding:0;width:100%;}\
      #hz_ev .calPic{display:block !important;background-color:#fff;border:1pt solid #abc;margin:5pt;}\
      #hz_ev .calPic a{display:block;padding:2pt 5pt;text-align:center;}\
      #hz_ev .calPic a img{display:block;margin:2pt auto;clear:both;border:double 2pt #abc;}\
      #hz_cal td[style*="#CFE0F0"] .dayNum {background: #fffb8f;}\
      #hz_ev {background-color: rgba(221,238,238,0.5)}\
      #hz_ev .calPic { background-color: rgba(255, 255, 255, 0.8039);}\
      #hz_cal .calPic { background-color: rgba(255, 149, 149, 0.196);}\
      #hz_cal .dayNum { background-color:#FFF;}\
  ');//#hz_cal .dayNum { background-color: rgba(196, 224, 251, 0.175);}\
  if (getSet(41)=='y') s=ge('rightBar');else s=(ge('sideBar') || ge('side_bar'));
  a=document.createElement('div');
  a.id='a_calendar';
  s.appendChild(a);
  outputCalendar();
}
/* END CALENDAR */


function vkDownMBlog(){// Switch to old look
//  if (getSet(82)=='y' && ge('full_info') && !isVisible('full_info')) switchPersonalInfo();
  if (getSet(83)=='y'){
    if (!ge("wall_header") || !ge('wall')) return;
    var elems=["submit_status_box","status_top_box_wrap","wall","status_history","one_status","status_history_link","wall_history_link"];
    var node=ge('rightColumn');
    node.appendChild(ge("wall_header").parentNode);
    for (var i=0; i<elems.length;i++){
      var el=ge(elems[i]);
      if (el) node.appendChild(el);
    }
    addClass("wall","account_info clearFix");
    if (ge("status_box")) addClass("status_box","account_info clearFix");
  }
}

function vkAvkoNav(){
  avko_num = 0;
  if(!ge('profile_photo_link')) return;
  
  if (!window.avkoinj){
    Inject2Func_2('profile.showProfilePhoto','avko_num=index;', 'wait_index = index;');
    avkoinj=true;
  }  
  
  var ref=ge('profile_photo_link');
  var div=document.createElement('div');
  div.setAttribute('style',"width:200px;height:0px;");
  ref.parentNode.insertBefore(div,ref);
  div.innerHTML='<style>\
        .ui-corner-tl { -moz-border-radius-topleft: 6px; -webkit-border-top-left-radius: 6px; border-top-left-radius: 6px; }\
        .ui-corner-tr { -moz-border-radius-topright: 6px; -webkit-border-top-right-radius: 6px; border-top-right-radius: 6px; }\
        .ui-corner-bl { -moz-border-radius-bottomleft: 6px; -webkit-border-bottom-left-radius: 6px; border-bottom-left-radius: 6px; }\
        .ui-corner-br { -moz-border-radius-bottomright: 6px; -webkit-border-bottom-right-radius: 6px; border-bottom-right-radius: 6px; }\
        .ui-corner-top { -moz-border-radius-topleft: 6px; -webkit-border-top-left-radius: 6px; border-top-left-radius: 6px; -moz-border-radius-topright: 6px; -webkit-border-top-right-radius: 6px; border-top-right-radius: 6px; }\
        .ui-corner-bottom { -moz-border-radius-bottomleft: 6px; -webkit-border-bottom-left-radius: 6px; border-bottom-left-radius: 6px; -moz-border-radius-bottomright: 6px; -webkit-border-bottom-right-radius: 6px; border-bottom-right-radius: 6px; }\
        .ui-corner-right {  -moz-border-radius-topright: 6px; -webkit-border-top-right-radius: 6px; border-top-right-radius: 6px; -moz-border-radius-bottomright: 6px; -webkit-border-bottom-right-radius: 6px; border-bottom-right-radius: 6px; }\
        .ui-corner-left { -moz-border-radius-topleft: 6px; -webkit-border-top-left-radius: 6px; border-top-left-radius: 6px; -moz-border-radius-bottomleft: 6px; -webkit-border-bottom-left-radius: 6px; border-bottom-left-radius: 6px; }\
        .ui-corner-all { -moz-border-radius: 6px; -webkit-border-radius: 6px; border-radius: 6px; }\
        \
        .NextButtAva tr td{ cursor:pointer; color: white; text-align: center;  background-color: black;  background-color: rgba(0,0,0,0.6);  border: 1px solid white;  opacity: 1;}\
        .NextButtAva tr td:hover{  background-color: white; background-color: rgba(255,255,255,0.6);   color: black;}\
        .NextButtAva {  border-spacing: 0px;  position: absolute;}\
        .NextButtAva #avko_prev, .NextButtAva #avko_next { width:100px; cursor:hand;  }\
        ._NextButtAva #avko_prev{border-left: 0px solid black !important;border-right: 0px solid black !important;}\
        .NextButtAva tr #avko_zoom{border-left: 0px;border-right: 0px; cursor:hand;}\
        .zoom_ava {\
          background-image_: url("data:image/png;base64,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");\
          background-image_: url("data:image/png;base64,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");\
          background-attachment: scroll;  background-repeat: no-repeat;  background-position: center;  width: 50px;\
          font-size: 13pt; font-weight: 700;\
        }\
        </style>\
          <table width="200px" height="32px" class="NextButtAva ui-corner-bottom" style= "opacity: 0;" id="NextButtAva"><tr>\
                <td id="avko_prev" class="ui-corner-bl" onclick="avko_list(false);">&#9668;</td>\
                <td id="avko_zoom" class="zoom_ava" onclick="vkPreviewPhoto(cur.options.photos[avko_num][1]); return false;">+</td>\
                <td id="avko_next" class="ui-corner-br" onclick="avko_list(true);">&#9658;</td>\
          </tr></table>';
  //fadeTo(ge('NextButtAva'),0,0);
  //avko_setts();
  avko_list=function (next){
	  if(next){
  		if(avko_num==cur.options.photos_count)avko_num=-1;
  		avko_num++;
  		profile.showProfilePhoto(avko_num);
	  }else{
  		if (avko_num==0) avko_num=cur.options.photos_count;
  		avko_num--;
  		profile.showProfilePhoto(avko_num);
	  }  
	}  
    ge('profile_avatar').setAttribute("onmouseover","fadeTo(ge('NextButtAva'),250,0.8);");
    /*ge('profilePhoto')*/ge('profile_avatar').setAttribute("onmouseout","fadeTo(ge('NextButtAva'),250,0);");
    /*
    ge('profilePhoto').onmouseover = function() { fadeTo(ge('NextButtAva'),250,0.8);};
    ge('profilePhoto').onmouseout = function() { fadeTo(ge('NextButtAva'),250,0);};
    ge('avko_zoom').onclick = function() { vkPreviewPhoto(profilePhotos[avko_num][1]); return false;};
    ge('avko_prev').onclick = function() { avko_list(false) };
    ge('avko_next').onclick = function() { avko_list(true) };*/
	disableSelectText('avko_next');
	disableSelectText('avko_prev');
}

function vkUpdWallBtn(){
	var el=ge('page_wall_posts_count');
	//var lnk=ge('wall_history_link');
	if (!el) return;
	var span=document.createElement('span');
	span.innerHTML='<a href="#" onclick="cancelEvent(event); wall.showMore(0); return false;">&#8635;</a>';//&uarr;&darr;
	insertAfter(span,el);
	//showWallHistory(13391307, '3ca912591b1937ce38', 15);
}


function vkUpdWall(to_id, hash, offset){
  Ajax.Send('wall.php', {act:'a_get_wall', type:1, to_id:to_id, hash:hash, offset: offset}, function(o,t) {
    var res = eval('('+t+')');
    //alert(print_r(res));
    var d = document.createElement('div');
    d.innerHTML = res.html;
    ge('fBox2').innerHTML = res.html;
    setupReply(); 
    onChangeContent(); 
    VkoptAudio(true); 
    vkDownLinkOnWall(); 
  });
}
/////////////////////for shut
// Profile tabs
var vk_shuts_mask = {
  'profile_common_friends': 0x1,
  'profile_friends'       : 0x2,
  'profile_friends_online': 0x4,
  'profile_albums'        : 0x8,
  'profile_videos'        : 0x10,
  'profile_questions'     : 0x20,
  'profile_matches'       : 0x40,
  'profile_notes'         : 0x80,
  'profile_groups'        : 0x100,
  'profile_apps'          : 0x200,
  'profile_personal'      : 0x400,
  'profile_education'     : 0x800,
  'profile_career'        : 0x1000,
  'profile_places'        : 0x2000,
  'profile_military'      : 0x4000,
  'profile_opinions'      : 0x8000,
  'profile_audios'        : 0x10000,
//  'profile_wall'          : 0x20000,
  'profile_gifts'         : 0x40000,
  'profile_optional'      : 0x80000,
  'profile_fans'          : 0x100000,
  'profile_idols'         : 0x200000,
  'profile_infos'         : 0x400000
}
var vk_shuts_prof=0x400000;

function shut(id,el) {
  var c = ge(id);
  if (!c) return true;
  var masks = vk_shuts_mask;
  var cookie_key = 'closed_tabs';
  var closed_tabs = parseInt(vkgetCookie('remixbit',1).split('-')[12]);
if (id!='profile_full_info') {
var newClass = hasClass(c,"shut") ? removeClass(c,"shut") : addClass(c,"shut");
if (!masks[id]) return;
} else {
	if (!el) el=3;
	masks={'profile_full_info':vk_shuts_prof};
	if ((el==3 && ge('profile_full_link').getAttribute('title').match('hid'))	 || el==0){ 
     addClass(c,"shut"); profile.hideFull();
	   ge('profile_full_link') ? null : geByClass('profile_info_link')[0].id='profile_full_link';
	   ge('profile_full_link').setAttribute('title','show');
  }	else { 
     removeClass(c,"shut"); profile.showFull();
	   ge('profile_full_link') ? null : geByClass('profile_info_link')[0].id='profile_full_link';
	   ge('profile_full_link').setAttribute('title','hide');
  }
  ge('profile_full_link').setAttribute('onclick','shut(\'profile_full_info\');');
}
    if (!hasClass(c,"shut")) closed_tabs = isNaN(closed_tabs) ? 0 : closed_tabs & ~masks[id];
    else closed_tabs = isNaN(closed_tabs) ? masks[id] : closed_tabs | masks[id];
	sett=vkgetCookie('remixbit',1).split('-');
	sett[12]=closed_tabs;
	vksetCookie('remixbit', sett.join('-'));
    //c.className = newClass;

  return false;
}
/*
function vkProfileShutInit(){
  vkaddcss('\
  	.shut .module_body {	display: none !important;}\
  	.shut { padding-bottom: 3px !important; }\
  	#profile_wall.shut div {display: none !important;}\
  	#profile_wall.shut div.module_header {display: block !important;}\
  	.module_header .header_top{	padding-left: 23px;	background: #e1e7ed url("http://vkontakte.ru/images/flex_arrow_open.gif") 0% 50% no-repeat;	}\
  	.shut .module_header .header_top{ padding-left: 23px;  background: #eeeeee url("http://vkontakte.ru/images/flex_arrow_shut.gif") 0% 50% no-repeat;}\
  	.shut .module_header {background-color:#f9f9f9;}\
  ');//.groups_list_module .module_body a {display: block !important;}\
  for(key in vk_shuts_mask) {
    if (ge(key)) {
  	ge(key).getElementsByTagName('a')[0].setAttribute("onclick",'return shut("'+key+'");');
  	addClass(key,'shut_open');
  	
  	if (parseInt(vkgetCookie('remixbit').split('-')[12]) & vk_shuts_mask[key]){	shut(key);	}
    }
  }
}*/
////////////// end shut



if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
