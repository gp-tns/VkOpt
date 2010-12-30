// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function vkPageClub(m) {
if (m==1) {	pageMenu='';
//AdmGr
if (location.href.match('/groups.') && !location.href.match('act=s')) {
	pageMenu +='<a onClick="javascript:vkGrRefresh();" style="cursor: hand;">- '+IDL("vkGrRefresh")+'</a>';
}
else if (IDTestAdmGr()) {
	if (location.href.match('/wall.'))
	 pageMenu +='<a onClick="javascript:IDAdminka(\'wallClear\');" style="cursor: hand;">- '+IDL("wallClear")+'</a>';
	else if (location.href.match('/club') || (location.href.match('/groups.') && location.href.match('act=s')))
	 pageMenu +='<a onClick="javascript:IDAdminka();" style="cursor: hand;">- '+IDL("ban")+'</a>';

if ((location.href.match('/board.') && !location.href.match('act=topic'))
 || location.href.match('/photos.') || location.href.match('/video.')
 || location.href.match('/album') || location.href.match('/albums')
 || location.href.match('/audio.') || location.href.match('act=topics')) {
	 pageMenu +='<a onClick="javascript:IDAdminka();" style="cursor: hand;">- '+IDL("selnon")+'</a>';
	 pageMenu +='<a onClick="javascript:IDAdminka(\'selall\');" style="cursor: hand;">- '+IDL("selinv")+'</a>';
	 pageMenu +='<a onClick="javascript:IDAdminka(\'delsel\');" style="cursor: hand;">- '+IDL("delsel")+'</a>';
	}
if ((location.href.match('/board.') && location.href.match('act=topic')) || location.href.match('/topic')) {
	pageMenu +='<a onClick="javascript:IDAdminka();" style="cursor: hand;">- '+IDL("ban")+'</a>';
	}
}
return pageMenu;

} else {
if (location.href.match('/groups.') && ge('g_filter')) {vkAddRejectAllLink();}
if (location.href.match('/topic') || (location.href.match('/board') && location.href.match('tid='))) {
    if (ge('topic_title')){document.title=ge('topic_title').innerText+' | '+document.title; };
    if (location.href.match('/topic')){
     ge('content').getElementsByTagName('ul')[0].innerHTML+='<li><a href="#" onClick="AddTopic2Bookmark(); return false;"><b class="tl1"><b></b></b><b class="tl2"></b><b class="tab_word">'+IDL('addtop')+'<span id="vkbookprog"></span></b></a></li>'
    }                                                        //'<li><a href="#" onClick="AddTopic2Bookmark();" style="width:10em">'+IDL('addtop')+'</a></li>';
    if (ge('content').getElementsByTagName('ul')[0].className=='tabs' && ge('content').getElementsByTagName('ul')[0].getElementsByTagName('li').length==2) {
    	var topic=(location.href.split('tid=')[1] || location.href.split('topic')[1]);
      if (topic.split('&')[1]) topic=topic.split('&')[0];
      if (topic.split('#')[1]) topic=topic.split('#')[0];                               //vkBookmark();
	     ge('content').getElementsByTagName('ul')[0].innerHTML+='<li><a href="#" onClick="AddTopic2Bookmark();" style="width:10em">'+IDL('addtop')+'</a></li>';
	}
  }
var gid=(location.href.split('club')[1] || location.href.split('gid=')[1] || location.href.split('id=-')[1] || location.href.split('/event')[1]);
if (!gid) gid='1';
if (gid.split('?')[1]) gid=gid.split('?')[0];
if (gid.split('&')[1]) gid=gid.split('&')[0];
var mid=(ge('sideBar') || ge('side_bar')).innerHTML.split('mail.php')[1].match(/(\d+)/)[1];
if (mid.split('?')[1]) mid=mid.split('?')[0];
// functions
//if (IDTestAdmGr()) IDAdminka();
if (location.href.match("act=people")){
  vkMembersAdmin();
}
if (location.href.match('/club') || location.href.match('act=s') || location.href.match('/event'))
	if (document.getElementById('members')) {
if (location.href.match('/club') || (location.href.match('act=s') && location.href.match('/groups.') ))
	document.getElementById('members').getElementsByTagName('div')[7].innerHTML=
	'[ <a href="/gsearch.php?from=people&basic=1&c[group]='+gid+'&c%5Bonline%5D=1">Online</a> ] '+document.getElementById('members').getElementsByTagName('div')[7].innerHTML;
if (location.href.match('/event'))
	document.getElementById('members').getElementsByTagName('div')[7].innerHTML=
	'[ <a href="/gsearch.php?from=people&c[group]='+gid+'&c%5Bonline%5D=1">Online</a> ] '+document.getElementById('members').getElementsByTagName('div')[7].innerHTML;
}
if (document.getElementById('groupslist') && !location.href.match('act=calendar'))
	{
  /*
  var glist=document.getElementById('groupslist').getElementsByTagName('a');  //
  for (var i=0;i<glist.length;i++){
      gnode=glist[i];
      if (gnode.href.match(/id\d/i)) glist[i].parentNode.innerHTML+=
	    '<br><a style="cursor: hand;" onClick=\"javascript:IDIgnor_set('+gnode.href.split('id')[1]+');\">[ '+IDL("addblack")+' ]</a>';
	    }  */
	}

if ((location.href.match('/club') || location.href.match('/event'))&& (getSet(4) == 'y')) AddInviteAllFriends();
vkInitAdmFunctions();
}
}

function vkReplaceEventsLink(){
  var nodes=document.getElementsByTagName('a');
  for (var i=0;i<nodes.length;i++){
    SL_ReplaceEventsLink(nodes[i]);
  }
}

function SL_ReplaceEventsLink(node){
  if (node.href && node.href.match(/events.+\d+/i)){  node.href='/event'+node.href.match(/\d+/); }
}

function vkAddRejectAllLink(){
  var mel=geByClass('summary')[0];
  if (!mel.innerHTML.match("rejectall")) {mel.innerHTML+="<span class='divider' style='font-weight:normal'>|</span><a href='groups.php?act=rejectall' style='font-weight:normal'>"+IDL('rejectallinv')+"</a>"}
}
//// invite all functions by KiberInfinity

var my_friends=Array();
var friend_pack=Array();
var curinv=0;
var invcnt=0;
var invinc=30;
var vktotalinvited=0;
var mbi = '';

function GetInviteHash(){
  const hshh="hash: ";
  const hshe="},";
  var cont=ge('content').innerHTML;
  var invhash=cont.substring(cont.indexOf(hshh)+hshh.length,cont.length);
    invhash=invhash.substring(0,invhash.indexOf(hshe));
  eval('invhash='+invhash);
  //alert(invhash);
  return invhash;
}
var vk_FrInvArr= new Array();

function InvateMyFriend(frarr){
  my_friends=[];
  curinv=0;
  invcnt=0;
  var idx=0;
  var InviteFr=function(FrArr){
      invcnt=FrArr.length;
      for(i=0; i<FrArr.length; i++){
       friend_pack[friend_pack.length]=FrArr[i];
        if ((friend_pack.length==invinc) || (i==(FrArr.length-1))){
          vk_FrInvArr[idx++]=friend_pack.join(",");
          friend_pack.length=0;
        }
      }
     vkSendInviteReq(0);
  }
  if (!frarr)   
      Ajax.Post({
        url: 'friends_ajax.php',
        onDone: function(ajaxObj, responseText) {
         friends_Data = eval('(' + responseText + ')');
         my_friends.length=0;
         my_friends=[];
         curinv=0;
         invcnt=0;
         each(friends_Data.friends, function(i, item) {
            my_friends[my_friends.length] = item[0];
         });
          InviteFr(my_friends);
        }
     });
  else InviteFr(frarr);
}


function vkSendInviteReq(idx){
mbi.content(IDL('InvProgr')+(idx*100/vk_FrInvArr.length).toFixed(0)+"%"+"<br>Total invited:"+vktotalinvited);   //curinv+'/'+wcnt
if (idx>=vk_FrInvArr.length) {
  setTimeout("mbi.content(groups_invites_sent+'('+"+vktotalinvited+"+')');",1500);
  mbi.removeButtons();
  mbi.addButton({label:'OK',onClick:function(){mbi.hide();}})
}
var gid=ge("mid")?ge("mid").value:location.href.match(/\d+/)[0];
var onDone=function(Obj,Text){
  r=eval('('+Text+')');
  if (r.result) vktotalinvited+=r.result;
  if (idx<vk_FrInvArr.length){ 
    setTimeout(function(){vkSendInviteReq(idx+1);},300); 
  }  
}
var onFail=function(Obj,Text){ alert("Request error \n"+text);  setTimeout(function(){vkSendInviteReq(idx);},300);  }
var onCapHide=function(){  mbi.show(); }
var options = {onSuccess: onDone, onFail: onFail,onCaptchaHide : onCapHide};//,onCaptchaShow : selectInput
Ajax.postWithCaptcha("/groups_ajax.php?act=a_invite_friends", {friends: vk_FrInvArr[idx], gid: gid, hash: GetInviteHash()}, options);
}

function SubminInvAll(frarr){
  mbi = new MessageBox({title:IDL('InvBoxTtl')});
  var msgcontent=IDL('InvMsg');
  mbi.addButton({label:IDL('Cancel'), style:'button_no',
  onClick:function(){mbi.hide();}}).addButton({label:IDL('InvBtn'),
  onClick:function(){
      mbi.content(IDL('InvStart'));
      mbi.removeButtons();
      mbi.addButton({label:IDL('Cancel'), style:'button_no',onClick:function(){mbi.hide();}});
      InvateMyFriend(frarr);
  }}).content(msgcontent).show();
}

function AddInviteAllFriends(){
var nodes = document.getElementsByTagName('ul');
for(i = 0; i<nodes.length; i++ )
 {
  var node = nodes[i];
  if (hasClass(node,'actionspro')){ //node.id=='nav' &&
  vkaddcss("\
      .actionspro li ul{display:none}\
      .actionspro li:hover ul{display:block}  \
      .actionspro li .actionspro {margin:0 0 0 10px;}\
  ");//InvAll
  node.innerHTML+='<li>\
          <a href="javascript:SubminInvAll();" onclick="return false;">'+IDL('invite')+'</a>\
          <ul class="actionspro">\
            <li><a href="javascript:SubminInvAll();">'+IDL('InvAll')+'</a></li>\
            <li><a href="#" onclick="vkSelectFriendsFromCats(\'FGr\',SubminInvAll); hide(this.parentNode); return false;">'+IDL('selgrs')+'</a></li>\
          </ul>\
          </li><li id="FGr"></li>';
    break;
  }
 }
}

//gsearch


function GetInvMass(){
  var invs=ge('searchResults').innerHTML.match(/inviteMemberToGroup\(.+\);/gi);
  var uinv=[];
  var temp;
  for (var i=0;i<invs.length;i++){
    temp=invs[i].match(/(\d+),.(\d+),.'(.+)'/);
    uinv[i]={'gid':temp[1],'uid':temp[2],'hash':temp[3]};
  }
  return uinv;
}
function GetBanMass(){
  var invs=ge('searchResults').innerHTML.match(/groups.php.act.ban.+banHash=.{18}/gi);
  return invs;
}

function vkGUserInv(mas,idx,callback){
 if (idx<mas.length){
 vkInvMemberToGroup(mas[idx].gid,mas[idx].uid,mas[idx].hash,function(){
   vkGUserInv(mas,++idx,callback);
 });
 } else callback();
}

function vkGUserBan(mas,idx,callback){
 if (idx<mas.length){
 document.title=idx+'/'+mas.length;
 mas[idx]=mas[idx].replace(/amp;/g,"");
 AjGet(mas[idx],function(){
   setTimeout(vkGUserBan(mas,++idx,callback),1500);
 });
 } else callback();
}

function vkGStartBan(){
var mas=GetBanMass();
vkGUserBan(mas,0,function(){alert('ok')});
}

function vkInvMemberToGroup(gid, mid, hash,callback) { 
  show("progr"+mid);
  Ajax.postWithCaptcha(
    'groups_ajax.php',
    {'act': 'ajaxinv', 'gid': gid, 'id': mid, 'hash': decode_hash(hash)},
    {onSuccess: function (ajaxObj, responseText) {
      ge('actions'+mid).innerHTML = responseText;
      callback(responseText);
    }, onFail: function () {
      ge('fBox'+mid).innerHTML = 'There was a problem with the request.';
      callback(responseText);
    }, onCaptchaHide: function() {
      hide("progr"+mid)
    }}
  );
}

function vkGStartInv(){
var mas=GetInvMass();
vkGUserInv(mas,0,function(){alert('ok')});
}


//// end invite functions

/////admin functions by KiberInfinity
function vkMembersAdmin(){
  var ndiv=document.createElement('div');
  ndiv.id='vkAdmFeatures';
  ge('membersSections').appendChild(ndiv);
  if  (current_section && current_section==0) {vk_addSetAdmLinks();}
  SetSectionsFeatures(current_section);
 
  Inject2Func("onGetSection","SetSectionsFeatures(current_section);",true);

  var re=new RegExp("ajaxHistory.prepare\\({([\\s\\S]+)done:","im");
  var apurl=ge('content').innerHTML.match(re)[1];
  eval('ajaxHistory.prepare({'+apurl+'  done: onGetSection});');
};


function SetSectionsFeatures(section){
onChangeContent();
 var fcontent;
  switch (section) {
   case 0:
    vk_addSetAdmLinks();
    fcontent="";
    break;
   case 2:
     if(document.location.href.match('events')) {fcontent='<li><a href="javascript: vkDelInvOnPage();"><span>'+IDL("admDelInvP")+'</span></a></li>';     break;}
   case 3:
     fcontent='<li><a href="javascript: vkDelInvOnPage();"><span>'+IDL("admDelInvP")+'</span></a></li>';
    break;

   default:
    fcontent="";
    break;
  }
ge("vkAdmFeatures").innerHTML='<ul class="vkactionspro">'+fcontent+"</ul>";
};

function vkDelInvOnPage(){
   var b=0; var c=new Array();
  var t,a,i;
  a=document.getElementsByTagName('a');
  for(i=0;i<a.length-1;i++)
    if(a[i].href.match('#')) {
	  t=a[i].onclick+"";
      t=t.split('return ')
      if(t[1]){
      t=t[1];
      t=t.replace("}",'');
	  if(t.match('cancelInvitation') || t.match('declineMember')) c[++b]=t;
    }
	}
  for(i=1;i<c.length;i++)
    setTimeout(c[i],i*300);
}


function vk_addSetAdmLinks() {
    var nodes = ge('membersContainer').getElementsByTagName('a');
    //var res=",";
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var id;
        //if ((id=node.href.match(/id(\d+)/i)) && node.parentNode.innerHTML.match(/span/i) && !node.parentNode.innerHTML.match(/vkSetAdmin/i)){
        var cl=node.getAttribute('onclick');
        if (cl && cl.match(/deleteMember\(\d+/)) {
            id=cl.match(/deleteMember\((\d+)/);
            node = node.parentNode;//geByClass('actions', node.parentNode)[0];
            node.innerHTML +=
            //'<span class="divide">|</span><a href="#" onclick="return  vkSetAdmin('+id[1]+','+groupId+')">[ '+getLang('forum_show_add_leader')+' ]</a>'+
            '<span class="divide">|</span><a href="#" onclick="return  vkBanUser(' + id[1] + ',' + groupId + ')">[ ' + IDL('Lock') + ' ]</a>';
        }
    }
    return res;
}

var vksearchBox = false;
function vkSetAdmin(url,gid) {  //gid=groupId
  var boxTitle, boxDoneLabel;
    boxTitle = getLang('groups_assigning_manager');
    boxDoneLabel = getLang('groups_assign');
    boxContentParams = {o:1};
    show('loadProgress');
    if (!vksearchBox) {
      vksearchBox = new MessageBox({progress: 'invProgress'});
    }
    vksearchBox.setOptions({title: boxTitle});
    var onInvite = function(obj, text) {
      hide('loadProgress');
      vksearchBox.content(text);
        new Checkbox(ge('officerIsAdmin'), {
          width: 150,
          label: getLang('groups_group_admin')
        });

      vksearchBox.removeButtons();
      vksearchBox.addButton({label: getLang('box_cancel'), style: 'button_no', onClick:vksearchBox.hide});
      vksearchBox.addButton({label: boxDoneLabel, onClick: function() {
        show('invProgress');
        var options = {onSuccess: function(obj, text) {
          hide('invProgress');
          vksearchBox.removeButtons();
          vksearchBox.addButton({label: getLang('box_close'), style: 'button_no', onClick: function() {
            vksearchBox.hide();
          }});
          vksearchBox.content(text);
          setTimeout("vksearchBox.hide(600)", 1200);
        }, onCaptchaShow: function() {
          hide('invProgress');
        }};
        ge('inv_hash').value = decodehash(ge('inv_hash').value);
        Ajax.postWithCaptcha('groups_ajax.php', serializeForm(ge('invForm')), options);
      }});
      vksearchBox.show();
    };
    Ajax.Send('groups_ajax.php', extend({act: 'a_inv_by_link', page: url, gid: gid}, boxContentParams), onInvite);
    return false;
}

function vkBanUser(url,gid) {  //gid=groupId
  var boxTitle, boxDoneLabel;
    boxTitle = IDL('Lock');
    boxDoneLabel = IDL('Lock');
    boxContentParams = {b:1};
    show('loadProgress');
    if (!vksearchBox) {
      vksearchBox = new MessageBox({progress: 'invProgress'});
    }
    vksearchBox.setOptions({title: boxTitle});
    var onInvite = function(obj, text) {
      hide('loadProgress');
      vksearchBox.content(text);

      vksearchBox.removeButtons();
      vksearchBox.addButton({label: getLang('box_cancel'), style: 'button_no', onClick:vksearchBox.hide});
      vksearchBox.addButton({label: boxDoneLabel, onClick: function() {
        show('invProgress');
        var options = {onSuccess: function(obj, text) {
          hide('invProgress');
          vksearchBox.removeButtons();
          vksearchBox.addButton({label: getLang('box_close'), style: 'button_no', onClick: function() {
            vksearchBox.hide();
          }});
          vksearchBox.content(text);
          setTimeout("vksearchBox.hide(600)", 1200);
        }, onCaptchaShow: function() {
          hide('invProgress');
        }};
        ge('inv_hash').value = decodehash(ge('inv_hash').value);
        Ajax.postWithCaptcha('groups_ajax.php', serializeForm(ge('invForm')), options);
      }});
      vksearchBox.show();
    };
    Ajax.Send('groups_ajax.php', extend({act: 'a_inv_by_link', page: url, gid: gid}, boxContentParams), onInvite);
    return false;
}
/////
function IDAdminka(arg) {
var gid='';
if (gid=='')
 if (location.href.match('/club'))
 gid=location.href.split('/club')[1].split('?f=1')[0];
if (gid=='') if (location.href.match('/club') || location.href.match('/board') || location.href.match('act=topic') || location.href.match('/groups') || location.href.match('/topic')) {
 if (geByClass('actionspro')[0])
 if (geByClass('actionspro')[0].innerHTML.match('act=info')) 
 gid=geByClass('actionspro')[0].getElementsByTagName('a')[0].href.split('gid=')[1];
 }

var hdrlnk=document.getElementById('header').getElementsByTagName('a')[0];
if (gid=='') if (hdrlnk.href.match('gid='))
 gid=hdrlnk.href.split('gid=')[1];
if (gid=='') if (hdrlnk.href.match('club'))
 gid=hdrlnk.href.split('club')[1];
if (gid=='') if (hdrlnk.href.match('event'))
 gid=hdrlnk.href.split('event')[1];
if (gid.split('?')[1]) grnum=grnum.split('?')[0];
if (gid.split('&')[1]) grnum=grnum.split('&')[0];

if (arg!=null && arg!='checkall') {
 if (arg=='selall') {
	a=0;
	if (geByClass('IDadm').length!=0) while(x=geByClass('IDadm')[a]) { if (x.checked!=true) x.checked=true; else x.checked=false; a++; }
	else IDAdminka('checkall');
	}
 if (arg=='delsel') {
	a=0; sel=0; del=0;
	while(x=geByClass('IDadm')[a]) { if (x.checked==true) {sel++; document.getElementById('AdmStat').innerHTML=sel; } a++; }
	a=0;
	if (sel>0) { if (confirm('Are you sure ??')) {
	while(x=geByClass('IDadm')[a]) {
	 if (location.href.match('board'))
	  if (x.checked==true) { if (IDAdmDelTopic(x.id)) del++; else a--; }
	 if (location.href.match('photos') && location.href.match('gid='))
	  if (x.checked==true) { if (IDAdmDelAlbum(x.id)) del++; else a--; }
	 if (location.href.match('/album'))
	  if (x.checked==true) { IDAdmDelPhot(x.id); del++; vkStatus('[ '+del+' / '+sel+' ]'); }
	 if (location.href.match('audio'))
	  if (x.checked==true) { if (IDAdmDelAudio(x.id,gid,1)) del++; else a--; }
	 if (location.href.match('video'))
	  if (x.checked==true) { if (IDAdmDelVideo(x.id)) del++; else a--; }
	 document.getElementById('AdmStat').innerHTML=del+'/'+sel;
	 a++;
/*
//pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1700);
// DO NOT USE IT FOR FAST PROJECTS !!! it's bad pause :)
*/                 //alert
	 } vkStatus(''); vkStatus('ok. please reload page');
	 } else alert('[canceled]'); }
	 else alert('[select]');
	}
 if (arg=='wallClear') {
	wallmess=geByClass('summary')[0].innerHTML.split(' ');
  if (wallmess.length < 5) wallmess=wallmess[1];
  else	wallmess=wallmess[wallmess.length-1].split('.')[0];
  if (wallmess <= 20)	pages=1;
  else	pages=Math.ceil(wallmess/20);
	if (!document.getElementById('AdmStat')) 
	geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right><a style="cursor: hand;"onClick="javascript:IDAdminka(\'wallClear\');">[ DelAll ]</a></div>';
	if(confirm('Are you sure ???\npages='+pages+'\nmessages='+wallmess)) IDAdmDelwall(pages,wallmess);
	}
} else {
//topic list
if (location.href.match('/wall.')) {
	if (!document.getElementById('AdmStat')) 
	geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right><a style="cursor: hand;" onClick="javascript:IDAdminka(\'wallClear\');">[ '+IDL('delall')+' ]</a></div>';
a=0; while(x=geByClass('postOptions')[a++]) {
  gid=document.getElementById('header').getElementsByTagName('a')[0].href.split('gid=')[1];
  if (gid.split('&')[1]) gid=gid.split('&')[0];
  tid=x.getElementsByTagName('a')[0].href.split('to=')[1];
  if (tid.split('&')[1]) tid=tid.split('&')[0];                                                                //IDAdmBan(\''+gid+'\',\''+tid+'\')
  x.getElementsByTagName('ul')[0].innerHTML+='<li><a id="ban'+tid+'" style="cursor: hand;" onClick="javascript:vkBanUser(\''+tid+'\',\''+gid+'\')">[ '+IDL('banit')+' ]</a></li>';
  }
}
if (location.href.match('/video.') && location.href.match('gid=')) {
if (!document.getElementById('AdmStat')) 
geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right><a style="cursor: hand;" onClick="javascript:IDAdminka(\'selall\');">[ '+IDL('selinv')+' ]</a><a style="cursor: hand;" onClick="javascript:IDAdminka(\'delsel\');">[ '+IDL('delsel')+' ]</a></div>';
a=0;
 while(x=geByClass('result clearFix')[a++]) {
if (x.getElementsByTagName('input').length==0) {
  tid=x.getElementsByTagName('a')[0].href.split('video')[1];
  if (tid.split('&')[1]) tid=tid.split('&')[0];
  if (arg!='checkall') x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox class=IDadm id="'+tid+'"><a onClick="javascript:IDAdmDelVideo(\''+tid+'\',1);" style="cursor: hand;">[del]</a></td>';
  else x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox checked=true class=IDadm id="'+tid+'"><a onClick="javascript:IDAdmDelVideo(\''+tid+'\',1);" style="cursor: hand;">[del]</a></td>';
}
  }
}
if (location.href.match('/audio.') && location.href.match('gid=')) {
if (!document.getElementById('AdmStat')) 
geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right><a onClick="javascript:IDAdminka(\'selall\');">[ InvertSel ]</a><a onClick="javascript:IDAdminka(\'delsel\');" style="cursor: hand;">[ DelAll ]</a></div>';
a=0;
 while(x=geByClass('audioRow')[a++]) {
  tid=x.id.split('audio')[1];
  if (arg!='checkall') x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox class=IDadm id="'+tid+'"><a onClick="javascript:IDAdmDelAudio(\''+tid+'\',\''+gid+'\',1);" style="cursor: hand;">[del]</a></td>';
  else x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox checked=true class=IDadm id="'+tid+'"><a onClick="javascript:IDAdmDelAudio(\''+tid+'\',\''+gid+'\',1);" style="cursor: hand;">[del]</a></td>';
}
}
if (location.href.match('/club') || location.href.match('/groups')) {
 a=0;
 if (location.href.match('/club')) gid=location.href.split('club')[1];
 if (location.href.match('/groups')) gid=location.href.split('gid=')[1];
 if (gid.split('&')[1]) gid=gid.split('&')[0];
 while(x=geByClass('actions')[a++]) {
  tid=x.getElementsByTagName('a')[0].href.split('to=')[1];
  if (tid) { if (tid.split('&')[1]) tid=tid.split('&')[0];                                       //IDAdmBan(\''+gid+'\',\''+tid+'\')
   x.innerHTML+=' <span style=\'font-size:10px\'>|</span> <a id="ban'+tid+'" onClick="javascript:vkBanUser(\''+tid+'\',\''+gid+'\');" style="cursor: hand;"><small>[ '+IDL('banit')+' ]</small></a>';
   }
  }
}
if ((location.href.match('/board.') && !location.href.match('act=topic')) || location.href.match('/club') || location.href.match('act=topics')) {
if (!document.getElementById('AdmStat'))
geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right><a style="cursor: hand;" onClick="javascript:IDAdminka(\'selall\');">[ '+IDL('selinv')+' ]</a> <a style="cursor: hand;" onClick="javascript:IDAdminka(\'delsel\');">[ '+IDL('delsel')+' ]</a></div>';
a=0;                //
 while(x=geByClass('boardTopic clearFix')[a++]) {
if (x.getElementsByTagName('input').length==0) {
  if (x.getElementsByTagName('a')[0].href.match('topic'))
    tid=x.getElementsByTagName('a')[0].href.split('topic')[1];
  if (arg=='checkall') x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox checked=true class=IDadm id="id'+tid+'"><a onClick="javascript:IDAdmDelTopic(\'id'+tid+'\',1);" style="cursor: hand;">['+IDL('delit')+']</a></td>';
  else x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox class=IDadm id="id'+tid+'"><a onClick="javascript:IDAdmDelTopic(\'id'+tid+'\',1);" style="cursor: hand;">['+IDL('delit')+']</a></td>';
}
  }
}
if ((location.href.match('/board.') && location.href.match('act=topic')) ||
 location.href.match('/topic')) {
a=0; while(x=geByClass('postOptions')[a++]) {
    gid=document.getElementById('header').getElementsByTagName('a')[0].href.split('club')[1];
  //gid=document.getElementById('header').getElementsByTagName('a')[0].href.split('gid=')[1];
  //if (gid.split('&')[1]) gid=gid.split('&')[0];
  tid=x.getElementsByTagName('a')[0].href.split('to=')[1];
	if (!tid) tid=x.parentNode.getElementsByTagName('a')[0].href.split('id')[1];
  if (tid) { if (tid.split('&')[1]) tid=tid.split('&')[0];                                                      //IDAdmBan(\''+gid+'\',\''+tid+'\')
   x.getElementsByTagName('ul')[0].innerHTML+='<li><a id="ban'+tid+'" style="cursor: hand;" onClick="javascript:vkBanUser(\''+tid+'\',\''+gid+'\')">[ '+IDL('banit')+' ]</a></li>';
   }
  }
}
if (location.href.match('/photos.') || location.href.match('/album')) {
	if (location.href.match('gid=')) {
	if (!document.getElementById('AdmStat')) 
geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right><a style="cursor: hand;" onClick="javascript:IDAdminka();">[ '+IDL('selall')+' ]</a></div>';
a=0;
 while(x=geByClass('result clearFix')[a++]) {
if (x.getElementsByTagName('input').length==0) {
  tid=x.getElementsByTagName('a')[0].href.split('id=')[1];
  if (tid.split('&')[1]) tid=tid.split('&')[0];
  if (arg!='checkall') x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox class=IDadm id="'+tid+'"><a onClick="javascript:IDAdmDelAlbum('+tid+',1);" style="cursor: hand;">['+IDL('delit')+']</a></td>';
  else x.getElementsByTagName('tr')[0].innerHTML+='<td width=15px><input type=checkbox checked=true class=IDadm id="'+tid+'"><a onClick="javascript:IDAdmDelAlbum('+tid+',1);" style="cursor: hand;">['+IDL('delit')+']</a></td>';
}
  }
}
	else if (location.href.match(gid)) {
	if (!document.getElementById('AdmStat')) 
geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right><a style="cursor: hand;" onClick="javascript:IDAdminka();">[ '+IDL('selall')+' ]</a></div>';
a=0;
 while(x=document.getElementById('album').getElementsByTagName('td')[a++]) {
if (x.getElementsByTagName('input').length==0) {
//  tid=x.getElementsByTagName('a')[0].href.split('id=')[1];
  tid=x.getElementsByTagName('a')[0].href.split('/photo')[1];
  if (tid.split('&')[1]) tid=tid.split('&')[0];
//IDAdmDelPhot
  if (arg!='checkall') x.innerHTML+='<br><input type=checkbox class=IDadm id="id'+tid+'"><a onClick="javascript:IDAdmDelPhot(\''+tid+'\',1);" style="cursor: hand;">['+IDL('delit')+']</a>';
  else x.innerHTML+='<br><input type=checkbox checked=true class=IDadm id="id'+tid+'"><a onClick="javascript:IDAdmDelPhot(\''+tid+'\',1);" style="cursor: hand;">['+IDL('delit')+']</a>';
}
  }
}
}
}
}

function IDAdmDelTopic(gr,stat) {
gr=gr.split('id')[1];
var http_request = false;http_request = new XMLHttpRequest();if (http_request.overrideMimeType){} if (!http_request) {alert('XMLHTTP Error'); return false;return http_request;}
http_request.open("GET", "/board.php?act=do_delete_topic&topic_id="+gr.split('_')[1]+"&oid="+gr.split('_')[0], false);
http_request.send("");
if (http_request.responseText.match('class="simpleBlock"')) { var date = new Date();var curDate = null;do {curDate = new Date();} while(curDate-date < 5000); return false; }
else { if (stat==1)
 document.getElementById('id'+gr).parentNode.parentNode.innerHTML='[ DELETED ]';
 return true;
 }
}

function IDAdmDelAlbum(gr,stat) {
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("POST", "/photos.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.setRequestHeader("Content-Transfer-Encoding", "binary");
http_request.send("act=do_delete&id="+gr);
// pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1300);
//
if (http_request.responseText.length<100) { alert(http_request.responseText); return false; }
else { if (stat==1)
 document.getElementById(gr).parentNode.parentNode.innerHTML='[ DELETED ]';
 return true;
 }
}

function IDAdmDelAudio_(id,gid,stat) {
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("POST", '/audio.php', true);
http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
http_request.setRequestHeader('Content-Transfer-Encoding', 'binary');
http_request.send('act=adeleteaudio&oid=-'+gid+'&aid='+id);
// pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1000);
//
http_request.open("POST", '/audio.php', false);
http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
http_request.setRequestHeader('Content-Transfer-Encoding', 'binary');
http_request.send('act=adeleteaudio&oid=-'+gid+'&aid='+id);
window.status=http_request.responseText;
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1000);
if (http_request.responseText.match('sucerror')) {
if (stat==1)
 document.getElementById('audio'+id).innerHTML='[ DELETED ]<br><br>';
return true; }
else if (http_request.responseText.split('audio=')[1].split(')')[0]=='') return true;
else { alert(http_request.responseText); return false; }
}

function IDAdmDelAudio(id,gid,stat) {
AjGet('/audio.php?act=adeleteaudio&oid=-'+gid+'&aid='+id,function(req){
  var res=req.responseText;
  window.status=res;
    if (res.match('success')) {
    if (stat==1)
    document.getElementById('audio'+id).innerHTML='[ DELETED ]<br><br>';
    return true; }
    else if (res.split('audio=')[1].split(')')[0]=='') return true;
    else { alert(res); return false; }
});
return true;
}

function do_du_ri(xxx) {return d\u0065cod\u0065URI(xxx);}

function IDAdmDelAudioList(gid,list,a) {
if (!gid) gid=location.href.split('gid=')[1] || location.href.split('/club')[1];
if (gid.split('?')[1]) gid=gid.split('?')[0];
if (gid.split('&')[1]) gid=gid.split('&')[0];
if (!a) a=0;
alert(list.join(' a\n'));
 if (!list) {
    list='';
    vkBox('<div id=tempList>Please wait..\ngroupID='+gid+'</div>');

    /*var http_request = false; http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
    http_request.open("GET", '/audio.php?act=edit&gid='+gid, false);
    http_request.send('');
    response=http_request.responseText;*/
    
    AjGet('/audio.php?act=edit&gid='+gid,function(req){
      response=req.responseText;
      var list=new Array;
      for (c=1; d=response.split('operate(')[c]; c++) {if (d.split(',')[0].length<10) list[c-1]=d.split(",")[0];}
       //alert(list.join(' a\n'));
      if (!ge('tempList')) vkBox('<div id=tempList>groupsID='+gid+'<br>audios='+list.length+'</div>');
      ge('tempList').innerHTML='groupsID='+gid+'<br>audios='+list.length;
      if (list.length>0) if (confirm('Are you sure ??\ngroupID='+gid+'\naudios='+list.length))
      setTimeout(function(){IDAdmDelAudioList(gid,list,a);},1500);
    });


 }
else if (list.length > 0) {
    id = list[a]; //alert(id+'+'+gid+'+'+a);

    /*var http_request = false;
    http_request = new XMLHttpRequest();
    if (http_request.overrideMimeType) {}
    if (!http_request) {
        alert('XMLHTTP Error');
        return false;
        return http_request; }
    http_request.open("POST", '/audio.php', true);
    http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http_request.send('act=adeleteaudio&oid=-' + gid + '&aid=' + id);     */

    AjGet('/audio.php?act=adeleteaudio&oid=-'+gid+'&aid='+id,function(req){
        if (!ge('tempList')) vkBox('<div id=tempList>' + gid + ' ' + list[a] + ' ' + a + '/' + list.length + '</div>');
        ge('tempList').innerHTML = gid + ' ' + list[a] + ' ' + a + '/' + list.length;
        if (a < list.length) setTimeout(function () {IDAdmDelAudioList(gid, list, ++a);}, 1600);
    });
}
}

function IDAdmDelVideo(gr,stat) {
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("GET", "/video.php?act=delete&oid="+gr.split('_')[0]+"&id="+gr.split('_')[1], false);
http_request.send("");
var hash=http_request.responseText.split('id="deleteVideo"')[1].split('name="hash" value="')[1].split('"')[0];
// pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 300);
//
http_request.open("POST", "/video.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.setRequestHeader("Content-Transfer-Encoding", "binary");
http_request.send("id="+gr.split('_')[1]+"&oid="+gr.split('_')[0]+"&hash="+hash+"&act=do_delete");
if (http_request.responseText.length<100) { alert(http_request.responseText); return false; }
else { if (stat==1)
 document.getElementById(gr).parentNode.parentNode.innerHTML='[ DELETED ]';
 return true;
 }
}

function IDAdmDelPhot(gr,stat) {
gr=gr.split('id')[1];
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("POST", "/photos.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.setRequestHeader("Content-Transfer-Encoding", "binary");
http_request.send("act=do_fdelete&id="+gr);
//if (stat==1)
 document.getElementById('id'+gr).parentNode.innerHTML='[ DELETED ]';
}

function IDAdmDelwall(pages,sel) {
var del=0; var gr=IDTestAdmGr();
spammed=0;
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
for (i=0; i<pages; i++) {
http_request.open("GET", "/wall.php?gid="+gr+((spammed>0) ? '&st='+spammed*20:''), false);
http_request.send("");
if (http_request.responseText.split('id="wall">')[1].split('deletePost')[1]) {
var response=http_request.responseText.split('id="wall">')[1].split('deletePost');
 for (j=1; j<response.length; j++) {
 //cid=response[j].split('(')[1].split(',')[0];
 var params=response[j].match(/(\d+),.-?(\d+),.'(.{18})'/);
 var cid=params[1];
 var hash=params[3];
 //var hash=response[j].split
 http_request.open("POST", "/wall.php", false);
 http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 http_request.send("act=a_delete&oid=-"+gr+"&cid="+cid+'&hash='+hash+"&old=1");
 del++;
 document.getElementById('AdmStat').innerHTML=del+'/'+sel;
// pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1300);
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

function IDAdmBan(gid,uid) {
var http_request = false;http_request = new XMLHttpRequest();if (http_request.overrideMimeType){}
if (!http_request) {alert('XMLHTTP Error'); return false;return http_request;}
http_request.open("GET", "/groups.php?act=banned&gid="+gid, false);
http_request.send("");
response=http_request.responseText;
hash=response.split(/id=['"]hash['"]/i)[1].split(/value=[i"]/i)[1].split(/['"]/i)[0];     //'

http_request.open("POST", "/groups_ajax.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
http_request.send('act=a_inv_by_link&page='+uid+'&gid='+gid+'&b=1');
req=[];for(i=1; j=http_request.responseText.split('<input ')[i]; i++) {
try { req.push(j.match(/name=['"](\w+)['"]/)[1]+'='+j.match(/value=['"](\w*)['"]/)[1]);    //'
} catch (e) {}}req=req.join('&');
var http_request = false;http_request = new XMLHttpRequest();if (http_request.overrideMimeType){}
if (!http_request) {alert('XMLHTTP Error'); return false;return http_request;}
http_request.open("POST", "/groups_ajax.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
http_request.send(req);
//vkBox(http_request.responseText);
vk_MsgBox(http_request.responseText);
}

function IDTestAdmGr() {
var grnum='';
var adm=false;
if (grnum=='')
 if (location.href.match('/club')){
    grnum=location.href.split('/club')[1];
    grnum=grnum?grnum.split('?f=1')[0]:grnum;
        if (geByClass('actionspro')[0])
        if (geByClass('actionspro')[0].innerHTML.match('act=info')) adm=true;
 }
if (grnum=='')
 if (location.href.match('/groups.') && location.href.match('gid='))
 grnum=location.href.split('gid=')[1];
if (grnum=='')
 if (location.href.match('/club') || location.href.match('/board') || location.href.match('act=topic')) {
 if (geByClass('actionspro')[0])
 if (geByClass('actionspro')[0].innerHTML.match('act=info'))
 grnum=geByClass('actionspro')[0].getElementsByTagName('a')[0].href.split('gid=')[1];
 }
if (grnum=='') if (document.getElementById('header').getElementsByTagName('a')[0]) if (document.getElementById('header').getElementsByTagName('a')[0].href.match('gid='))
 grnum=document.getElementById('header').getElementsByTagName('a')[0].href.split('gid=')[1];
if (grnum=='') if (document.getElementById('header').getElementsByTagName('a')[0]) if (document.getElementById('header').getElementsByTagName('a')[0].href.match('club'))
 grnum=document.getElementById('header').getElementsByTagName('a')[0].href.split('club')[1];
if (grnum=='') if (document.getElementById('header').getElementsByTagName('a')[0]) if (document.getElementById('header').getElementsByTagName('a')[0].href.match('event'))
 grnum=document.getElementById('header').getElementsByTagName('a')[0].href.split('event')[1];

if (grnum.split('?')[1]) grnum=grnum.split('?')[0];
if (grnum.split('&')[1]) grnum=grnum.split('&')[0];
a=0;
if (AdminGroups!='')  //local settings
 for (i=0; i<AdminGroups.split('-').length; i++) {
  if (grnum==AdminGroups.split('-')[i]) a++;
  }
var vAdmGr;
if (vAdmGr=vkgetCookie('AdmGr'))     //cookie
 for (i=0; i<vAdmGr.split('-').length; i++) {
  if (grnum==vAdmGr.split('-')[i]) a++;
  }
if (a>0 || adm) return grnum;
else return '';
}


function IDAdmGrList(arg) {
if (!vkgetCookie('AdmGr') || (vkgetCookie('AdmGr') == null) || (vkgetCookie('AdmGr') == '')) vksetCookie('AdmGr', 'none');
var IDGrList = vkgetCookie('AdmGr');
var IDGr = new Array();
if (vkgetCookie('AdmGr').split('-').length == '0') null;
else {
for (i=0; i < vkgetCookie('AdmGr').split('-').length-1; i++) {
 IDGr[i] = vkgetCookie('AdmGr').split('-')[i+1];
}
if (arg == 'grlist') {
for(i=0;x=document.getElementsByTagName('div')[i];i++) {
if (x.id.split('groupCont')[1]) {
x.name='gc'+x.id.split('groupCont')[1];
ok=0;
  for (y=0; y<IDGr.length; y++) 
	if (x.id == 'groupCont'+IDGr[y])
		ok='1';
if (ok == '1') {
	x.setAttribute("style",'font-weight:bold;');
	x.getElementsByTagName('ul')[0].innerHTML=x.getElementsByTagName('ul')[0].innerHTML.split('<LI id="fav')[0]+'<li id=fav><a href=\"#fc\" onClick=\"javascript:delFromAdm('+x.id.split('groupCont')[1]+');\">[ '+IDL("delFromAdm")+' ]</a></li>';
	}
if (!ok) {
	x.x.setAttribute("style",'font-weight:normal;');
	x.getElementsByTagName('ul')[0].innerHTML=x.getElementsByTagName('ul')[0].innerHTML.split('<LI id="fav')[0]+'<li id=fav><a href=\"#fc\" onClick=\"javascript:addToAdm('+x.id.split('groupCont')[1]+');\">[ '+IDL("addToAdm")+' ]</a></li>';
	}
}}}
if (arg == 'profile') if (document.getElementById('groups')) {
for (y=0; y<IDGr.length; y++) {
  for(i=0;x=document.getElementById('groups').getElementsByTagName('a')[i];i++) {
	if ((x.href.split('club')[1] == IDGr[y])) {
  	x.setAttribute("style",'font-weight:bold; color: #000; text-align:right;');
    var div=document.createElement('div');
  	div.setAttribute('align','right');
    x.parentNode.insertBefore(div,x);
    div.appendChild(x);
	}
 }
}}
}}

function addToAdm(num) {
if (!vkgetCookie('AdmGr') || (vkgetCookie('AdmGr') =='')) vksetCookie('AdmGr', 'none');
IDGrList = vkgetCookie('AdmGr');
if (IDGrList == 'none') IDGrList ='';
IDGrList+= '-'+num;
vksetCookie('AdmGr', IDGrList);
IDAdmGrList('grlist');
}

function delFromAdm(num) {
IDGrList= vkgetCookie('AdmGr');
list = IDGrList.split('-'+num);
IDGrList=list[0]+list[1];
if (!IDGrList.split('')[1]) IDGrList='none';
vksetCookie('AdmGr', IDGrList);
IDAdmGrList('grlist');
}

function vkGrRefresh() {
if (!document.getElementById('AdmStat')) 
	geByClass('summary')[0].parentNode.innerHTML+='<div id=AdmStat align=right>stat</div>';
a=0; sel=0; del=0;
while(x=geByClass('grouprow')[a++]) {
	if (x.id.split('groupCont')[1]) {
		sel++; document.getElementById('AdmStat').innerHTML=sel;
		}
	}
if (sel>0) {
a=0;
 while(x=geByClass('grouprow')[a++]) {
  if (x.id.split('groupCont')[1]) {
cid=x.id.split('groupCont')[1];
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("GET", "/club"+cid, false);
http_request.send("");
if (http_request.responseText) if (http_request.responseText.split('title')) {
if (http_request.responseText.split('title')[1].split(' ').length==4 && http_request.responseText.split('title')[1].split(' ')[3].match(IDL('Error'))) {
	a--;
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 2500);
	}
else {
	window.status=http_request.responseText.split('title')[1];
	del++;
	}
}
document.getElementById('AdmStat').innerHTML=del+'/'+sel;
 }
//pause
var date = new Date();
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < 1200);
// DO NOT USE IT FOR FAST PROJECTS !!! it's bad pause :)
}
alert('done');
}
}


function IDGroupEventSelect_tag(listnames) {
if (location.href.match('/event')) var e=1;
if (location.href.match('/club') || location.href.match('/groups')) var e=0;
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
if (!listnames) {
http_request.open("GET", "/friends.php?id="+mid, false);
http_request.send("");
response = http_request.responseText;
response = response.split('friendsData = ')[1].split('filter')[0];
var list= '['+response.split('[[')[1].split(']],')[0]+'],';
var listall = list.split('],');
var num = listall.length-1;
} else {
listall=listnames.split('-');
num=listall.length-1;
}
var gid = parseInt(document.inviteFriends.gid.value);
var zaraz=15; if (e==0) zaraz=35;
num=Math.ceil((listall.length-1)/zaraz);
//alert(num);
//alert(listall);
geByClass('iPanel')[0].innerHTML='<div id="temp"></div>';
for (i=0; i < num-1; i++) {
templist='';
if (e==1) templist+='&e=1';
//else if (e!=0) alert(location.href);
	for(var j = (0+i)*zaraz; j < (1+i)*zaraz; j++){
//alert(j);
if (!listnames) {if (listall[j].split('[')[1]) sid=listall[j].split('[')[1].split(',')[0];}
 else {if (listall[j]) sid=listall[j];}
	if(parseInt(sid)) templist+='&'+sid+'=1';
	}
var now = i+1;
//alert(now+' '+num+'\n'+templist);
ge('temp').innerHTML='<h1>'+now+'/'+num+'</h1><br><h2>'+gid+'</h2>';
http_request.open("POST", "/groups_ajax.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.send("act=ainvitefriends&gid="+gid+templist);
//alert(http_request.responseText);
 var date = new Date();var curDate = null;
 do { curDate = new Date();} while(curDate-date < 2500);
}
location.reload();
}

function IDGroupEventSelect_grs() {
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
http_request.open("GET", "/friend.php", false);
http_request.send("");frInfo = 'friendsInfo'+http_request.responseText.split('<script>friendsInfo')[1].split(']]')[0]+']]}';
caList = http_request.responseText.split('<ul class="FG">')[1].split('</ul>')[0];
var caListAr = caList.split('><a');list='<div id="FGr"><input type=checkbox disabled>'+caListAr[1].split('>')[1].split('</a')[0]+'<br>';
for (i=2; cla=caListAr[i]; i++) {	list+='<input type=checkbox>'+cla.split('>')[1].split('</a')[0]+'<br>';}
list+='<a href="javascript:IDGroupEventGRList();" align=center>'+IDL('start')+'</a></div>';var FI=document.createElement('script');FI.appendChild(document.createTextNode(frInfo));document.getElementById('boxHolder').appendChild(FI);document.getElementById('FGr').innerHTML=list;} setTimeout("try{if (window.vkopt_inited){vkinteVal('vkFrLdrM(l_pb)');}}catch(e){}",10*1000);

function IDGroupEventGRList() {
var groups=0; value=1; var bin='';
for (i=0; val=document.getElementById('FGr').getElementsByTagName('input')[i]; i++) {
	if (val.checked) {groups=groups+value; bin+='1';}
	else bin+='0';
	value=value*2;
}
document.getElementById('FGr').style.display='none';
var list='';
for (i=0; i<friendsInfo.list.length; i++) {
ok=0; value=256; g=8;
fg = friendsInfo.list[i][2].fg;
for (a=0; a<9; a++) {
if (fg >= value) { fg=fg-value; if (bin.charAt(g)=='1') ok++; }
value=value/2; g--;
}
if (fg > 0) alert('O_o '+fg);
if (ok>0) list+=friendsInfo.list[i][0]+'-';
}
setTimeout(IDGroupEventSelect_tag(list),2500);
}



//// Adminka by KiberInfinity ///
var WALL_DEL_DELAY=2000;
var WALL_SMALL_DELAY=500;
function vkGetGID(){
  var dloc=document.location.href;
  var gid=null;
  if (gid = dloc.match(/\/club(\d+)/i)) return gid[1];
  if (gid = dloc.match(/\/wall.php.+gid=(\d+)/)) return gid[1];
  if (gid = dloc.match(/\/audio.php.+gid=(\d+)/)) return gid[1];
  if (gid = dloc.match(/\/video.php.+gid=(\d+)/)) return gid[1];
  
  if (gid = dloc.match(/\/board(\d+)/)) return gid[1];
  if (gid = dloc.match(/\/photos(\d+)/)) return gid[1];
  
  if (gid = dloc.match(/\/topic-(\d+)_\d+/)) return gid[1];
  if (gid = dloc.match(/\/video-(\d+)_\d+/)) return gid[1];
  if (gid = dloc.match(/\/photo-(\d+)_\d+/)) return gid[1];
  if (gid = dloc.match(/\.php\?.+oid=-(\d+)/)) return gid[1];
  if (gid = dloc.match(/groups\.php\?act=s.gid=(\d+)/)) return gid[1];
  return null;
}

function isAdmGroup(gid){
return true;
}

function vkInitAdmFunctions(){
  var dloc=document.location.href;
  var gid=vkGetGID();
  if (gid && isAdmGroup(gid)){
      vkWallAdm(gid);
      if(typeof getWallPage!='undefined' && ge('wall')) {
        Inject2Func_2("getWallPage","vkWallAdm("+gid+");","r.html;");
        if (typeof postIt!='undefined')  Inject2Func_2("postIt","vkWallAdm("+gid+");","r.html;");
  
      }
  }
}

function vkInitProfAdmFunctions(){
   if (remixmid()!=ge('mid').value) return;
   var mid=ge('mid').value;
   vkWallAdm(mid);
   if(typeof getWallPage!='undefined' && ge('wall')) {
      Inject2Func_2("getWallPage","vkWallAdm("+mid+");","r.html;");
      if (typeof postIt=="function")  Inject2Func_2("postIt","vkWallAdm("+mid+");","r.html;"); 
   }
}

function vkDoCheck(check,className){
  var ch=geByClass(className);
  for (var i=0;i<ch.length;i++){
    switch (check){
    case 0:  ch[i].checked=false; break;
    case 1:  ch[i].checked=true; break;
    case 2:  ch[i].checked=!ch[i].checked; break;
    }
  }
}

function vkWallDelPost(cid,oid,hash,callback){
  var oldwall=(window.old_wall)?"1":"0";
  AjPost('/wall.php', {act: 'a_delete', oid: oid, cid: cid, hash: hash, old: oldwall},function(r,t){
    if (callback) callback(t,cid,oid);
  });
}

function vkWallDelPosts(){
  var ch=geByClass("wall_checkbox");
  var idx=0
  var list=[];
  for (var i=0;i<ch.length;i++){
    if (ch[i].checked && ch[i].getAttribute("delparams")) {
      list.push(ch[i].getAttribute("delparams"));
    }
  }
  //alert(list.join("\n"));
  var setProc=function(cur,len){ ge('vkwallproc').innerHTML='[ '+cur+'/'+len+' ]'};
  var onDelete=function(t,cid,oid){
    replacePostContent(cid,oid,t);
    idx++;
    setProc(idx,list.length);
    if (idx<list.length){
      var params=list[idx].split(',');
      setTimeout(function(){vkWallDelPost(params[0],params[1],params[2],onDelete)},WALL_SMALL_DELAY);
    } else {
      alert(IDL('Done'));
      hide('vkwallproc');
    }
  }
  
  show('vkwallproc');
  setProc(idx,list.length);
 // alert(list[idx]);
  var params=list[idx].split(',');
  vkWallDelPost(params[0],params[1],params[2],onDelete);
}

function toggleWPanel(panel,btn){
  toggle(panel);
  var vis=isVisible(panel);
  btn.innerHTML=(vis)?"[ &uarr; ]":"[ &darr; ]";
  var ch=geByClass("wall_checkbox");
  for (var i=0;i<ch.length;i++)
      if (vis) show(ch[i]); else hide(ch[i]);
  
}
function vkWallAdm(gid){
  if (ge("wall")){
    var wall=ge("wall");
    var nodes=geByClass("header",wall);
    var el,allow_show=false;
    var el=ge("fBox2");// || ge('wallpage');
    if ((el) && !ge('wall_adm_panel')){
      
      var node=ge('wall').getElementsByTagName('h3')[0];
      if (node) node=geByClass('fSub_right',node)[0]; 
      else return;//node=ge("wall_header_text");
      node.innerHTML='<span id="wadmpanelbtn" style="display:none"><a href="#" onclick="toggleWPanel(\'wall_adm_panel\',this); return false;">[ &darr; ]</a><span class=\'divide\'>|</span></span>'+node.innerHTML;
      
      var panel=document.createElement("div");
      panel.id="wall_adm_panel";
      panel.setAttribute("class","fSub clearFix");
      panel.setAttribute("style","text-align:center;display:none;");
      panel.innerHTML='<span class="divide">[</span>'+
                      '<input type="checkbox" id="challwall" onclick="vkDoCheck((this.checked)?1:0,\'wall_checkbox\');" class="wall_checkbox">'+
                      '<span class="divide">|</span>'+
                      /*'<a href=# onclick="vkDoCheck(1,\'wall_checkbox\'); return false;">'+IDL('checkAll')+'</a>'+ 
                      '<span class="divide">|</span>'+
                      '<a href=# onclick="vkDoCheck(0,\'wall_checkbox\'); return false;">'+IDL('uncheckAll')+'</a>'+ 
                      '<span class="divide">|</span>'+*/
                      '<a href=# onclick="vkWallDelPosts(); return false;">'+IDL('delChecked')+'</a>'+ 
                      '<span class="divide">|</span>'+
                      '<a href=# onclick="vkClearWall('+(vkGetGID()?'-':'')+gid+'); return false;">'+IDL('ClearWall')+'</a>'+ 
                      '<span class="divide">]</span>'+
                      '<span id="vkwallproc" style="float:right; display:none;" class="divide"></span>';
                      
      el.parentNode.insertBefore(panel,el);
    }
    if (ge('challwall')) ge('challwall').checked=false;
  
    for (var i = 0; i < nodes.length; i++){
      var head=nodes[i];
      var params=geByClass("actions",head.parentNode)[0].innerHTML.match(/deletePost\((\d+),\s*(-?\d+),\s*'(.{18})'\)/);
      //alert(params);
      if (params){ 
        allow_show=true;
        params=params[1]+","+params[2]+","+params[3];
        var check=document.createElement("input");
        check.type="checkbox";
        hide(check);
        check.setAttribute("delparams",params);
        check.className="wall_checkbox";
        head.insertBefore(check,head.firstChild);
      }
    }
    if (allow_show) { show("wadmpanelbtn");}
  }
}

function vkClearWall(oid){
  if (!oid) oid=vkGetWallUID();
  if (!window.vkClearWallBox) vkClearWallBox = new MessageBox({title: IDL('ClearWall'),closeButton:true,width:"250px"});
  var box=vkClearWallBox;
  var sp=0;
  var total=0;
  var cancel_del=false;
  vkDeleteWPosts=function(list,idx){
      if (!idx) idx=0;
      if (cancel_del) return;
      if (idx>=list.length) {vkStartClearWall(sp); return;}
      vkWallDelPost(list[idx][0],list[idx][1],list[idx][2],function(t,cid){
        //vklog(list[idx].join(';')+' = '+t);
        if (!t.match(/restorePost/)) alert(t);
        total++;
        var r=t.replace(/<a.+>.+<\/a>/g,"");
        vkClearWallBox.content('<h6>'+IDL('Deleted')+': '+total+'</h6><br>post id '+cid+':<br>'+r);
        setTimeout(function(){vkDeleteWPosts(list,idx+1);},WALL_DEL_DELAY);
      });
  }
  vkGetPosts4Del=function(r,t){
      var pat="deletePost\\((\\d+),\\s*(-?\\d+),\\s*'(.{18})'\\)";
      var rawlist=t.match(RegExp(pat,"ig"));
      var paramslist=[];
      for(var i=0;rawlist && i<rawlist.length;i++){
            var item=rawlist[i].match(RegExp(pat,"i"));
            paramslist.push([item[1],item[2],item[3]]);
      }
      if (paramslist.length>0)  vkDeleteWPosts(paramslist);
      else {
          vkClearWallBox.content(IDL("ClearDone"));
      }
  }
  vkStartClearWall=function(start_page){
    sp=start_page;
    vkClearWallBox.content('<div class="box_loader"></div>');
    AjGet("wall.php?"+(oid<0?'g':'')+"id="+oid+"&st="+start_page,vkGetPosts4Del);
  }
  html=IDL('ClearBegin')+'<br>\
    <a href="#" onclick="vkStartClearWall(0);  return false;">- '+IDL('FromFirstPage')+'</a><br>\
    <a href="#" onclick="vkStartClearWall(20); return false;">- '+IDL('FromSecondPage')+'</a>\
  ';
  box.removeButtons();
  box.addButton({
    onClick: function(){ box.hide(200); },
    style:'button_no',label:IDL('Cancel')});
  box.setOptions({onHide: function(){cancel_del=true; box.content("");}});
  box.content(html).show();

}

/* from common.js
function replacePostContent(cid, oid, text, reply) {
  var full_id = oid + '_' + cid;
  var el = reply ? ge('wall_reply' + full_id) : ge('wPostContainer' + full_id);
  if (!reply && !el) el = ge('status' + cid);

  if (!restoreCache[full_id]) restoreCache[full_id] = el.innerHTML;
  el.innerHTML = text;
  
  return;

  ge('wPostContent' + full_id).style.display = 'none';
  ge('wPostContainer' + full_id).innerHTML += text;
  var adding = '';
  if (ge('dArrow' + full_id)) {
    adding += '<div style="position: relative; top: -6px;" class="dArrow">' + ge('dArrow' +full_id).innerHTML + '</div>';
  }
  if (ge('upArrow' + full_id)) {
    adding += '<div style="position: relative; top: -6px;" class="upArrow">' + ge('upArrow' + full_id).innerHTML + '</div>';
  }
  if (adding.length && ge('wResult' + full_id)) {
    ge('wResult' + full_id).innerHTML = adding + ge('wResult' + full_id).innerHTML;
  }
}
*/

if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
