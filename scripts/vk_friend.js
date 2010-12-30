// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function vkPageFriend(m) {
if (m==1) {	pageMenu='';
//blackList
//if (!location.href.split('act=add')[1])
//pageMenu += '<a href=# onClick="javascript:IDIgnorListF();">- '+IDL("blacklist")+'</a>';
//izbran
if (!location.href.split('act=add')[1])
pageMenu += '<a href=# onClick="javascript:best(\'frlist\');">- '+IDL("favorites")+'</a>';
//addrem
pageMenu += '<a href=# onClick="javascript:vkUpdTestFriends(\''+getSet('-',7)+'\');">- '+IDL("refreshList")+'</a>';

return pageMenu;
}
else {
  //	addfr
  if (location.href.match('act=add&')) if (getSet('-',1) == '2') {
  	add=document.getElementById('addFriend').getElementsByTagName('ul')[0].getElementsByTagName('a')[0];
  	add.href='javascript:IDAddFriend();';
  	}
  if (document.getElementById('message') && location.href.match('act=addFriend'))
  	IDprofile_off();

}
}

function vkFriendsInit(){
  if (listsEnabled){
      vkAddParseFriendsLink();
  }
}
/////////////////
// UPD FRIENDS //
function vkFriendsList_Create(){
  var NID_CFG=7;
  if (!window.FrUpdCreateBox || isNewLib()) FrUpdCreateBox = new MessageBox({title: IDL('FriendsListTest'),closeButton:false,width:"350px"});
  var box=FrUpdCreateBox;
  box.removeButtons();
  box.addButton({ 
    onClick: function(){ box.hide(200); }, style:'button_no',label:IDL('Hide') }); 
  box.content('<div class="box_loader"></div>').show();
  AjGet('/notes.php',function(r,t){
    var div=document.createElement('div');
    div.innerHTML=t;
    var nid=0;
    var note='';
    var nodes=geByClass('note_title',div);
    for (var i=0;i<nodes.length;i++)
      if (nodes[i].innerHTML.match(/friends_ok_\d+/)){
       var r=nodes[i].innerHTML.match(/note\d+_(\d+)/);
       if (r) {note=r[0]; nid=r[1]; break; }
      }
    var NewNote=function(){
      box.setOptions({title:IDL("NoteCreating")});
      box.removeButtons();
      box.addButton({ onClick: function(){ box.hide(200); }, style:'button_no',label:IDL('Hide') });
      box.content('<div class="box_loader"></div>');
      AjGet('/notes.php?act=new',function(r,t){
        var nhash = t.split('"hash" value="')[1].split('"')[0];
        params='act=add&preview=0&hash='+nhash+'&wysiwyg=1&title=friends_ok_note&Post=note_created&privacy_note=3&privacy_notecomm=3';
        box.setOptions({title:IDL("NoteCreating")+'...'});
        setTimeout(function(){AjGet('/notes.php?'+params,function(r,t){
           var nlink=t.match(/<a href="note\d+_(\d+)">friends_ok_note/i);
           if (nlink){
             nid=nlink[1];
             setSet('-',nid,NID_CFG);
             setTimeout(function(){vkUpdTestFriends(nid,true);},1500);
           } else {
            alert('Not found note "friends_ok_note"');
           }
        })},1500);
      });  
    }
    var UseOldNote=function(){
      setSet('-',nid,NID_CFG);
      vkUpdTestFriends(nid);
    }
    if (nid){
      box.removeButtons();
      box.addButton({ onClick: function(){ box.hide(200); }, style:'button_no',label:IDL('Cancel') });
      box.addButton({ onClick: NewNote, style:'button_no',label:IDL('No') }); 
      box.addButton({ onClick: UseOldNote, label:IDL('Yes') });   
       
      box.content(IDL('FrNoteFound').replace('{note}','<a href="'+note+'" target="blank">'+note+'</a>')).show();
    } else {
      setTimeout(NewNote,1500);
    }
  });
  
}
function vkUpdTestFriends(nid, create){
  //notes.php?act=edit&nid=10060156
  vkaddcss("\
      .vkfrupl span{}\
      .vkcheckbox_off{opacity: 0.5; margin: 3px 3px -3px 0; display:inline-block; height: 14px; width: 15px; overflow: hidden; background: transparent url(/images/icons/check.gif?1) 0px 0px no-repeat;}\
      .vkcheckbox_on{opacity: 0.5; margin: 3px 3px -3px 0; display:inline-block; height: 14px; width: 15px; overflow: hidden; background: transparent url(/images/icons/check.gif?1) 0px -14px no-repeat;}\
  ");
  var NID_CFG=7;
  var FUPD_CFG=2;
  if (getSet('-',NID_CFG) == 0) {vkFriendsList_Create(); return};
  if (!nid) nid=getSet('-',NID_CFG);
  if (FriendsNid[vkgetCookie('remixmid')]) nid=FriendsNid[vkgetCookie('remixmid')];
  //vkStatus('[FriendsList Refreshing]');
  
  if (!window.FrUpdBox || isNewLib()) FrUpdBox = new MessageBox({title: IDL('FriendsListTest'),closeButton:true,width:"350px"});
  var box=FrUpdBox;
  box.removeButtons();
  box.addButton(!isNewLib()?{
    onClick: function(){ box.hide(200); },
    style:'button_no',label:IDL('Hide')
  }:IDL('Hide'),function(){ box.hide(200); },'no');
    
  var html='\
    <div class="vkfrupl">\
    <div id="vkfrupdloader" class="box_loader"></div><br>\
    <div class="vkcheckbox_off" id="vkfrupdck1"></div><span>'+IDL('FrListLoading')+'</span><br>\
    <div class="vkcheckbox_off" id="vkfrupdck2"></div><span>'+IDL('FrListLoadingNote')+'</span><br>\
    <div class="vkcheckbox_off" id="vkfrupdck3"></div><span>'+IDL('FrListSaveNote')+'</span><br><br>\
    <div id="vkfrupdresult"></div>\
    </div>\
  ';
  box.content(html).show();

  AjGet('/friends_ajax.php',function(r,t){
    ge('vkfrupdck1').className='vkcheckbox_on';
    if (!t || !t.length) {alert(IDL('FrListError')); box.hide(200); return;}
    var res=eval('('+t+')');
    var fr=res.friends;
    var fids=[];
    for (var i=0;i<fr.length;i++)  fids.push(fr[i][0]);
    var PostData=fids.join('-');
    var FrCount=fids.length;
    AjGet('/notes.php?act=edit&nid='+nid,function(r,t){
       var note=t.match(/<textarea[^>]+>([\d-]+)\s*<\/textarea>/i);
       if (!create){
          ge('vkfrupdck2').className='vkcheckbox_on';
          if (!note) {alert(IDL('FrListNoteError')); box.hide(200); return;}
          var nfids=note[1].split('-');
          if (parseInt(nfids[0])==nfids.length-1) var ncount=nfids.shift();
          var i=0;
          while (i<nfids.length){
            for (var j=0;j<fids.length;j++)
              if(parseInt(fids[j])==parseInt(nfids[i])){
                fids.splice(j,1);
                nfids.splice(i,1);
                i--;
                break;
              }
            i++;
          }
      }

      var hash=t.match(/name="hash" value="(.+)">/i);
      if (hash) hash=hash[1]; else {alert('Hash Error'); return;}
      var params = {act:"update", nid:nid,hash:hash, title:"friends_ok_"+FrCount, Post:PostData,
                    privacy_note:3, privacy_notecomm:3, wysiwyg:"yes" };
      if (!create) {
        vksetCookie('IDFriendsUpd', nfids.join('-')+'_'+fids.join('+'), getSet('-',FUPD_CFG)); 
        vkShowFriendsUpd();
      } else {
        vksetCookie('IDFriendsUpd', '_', getSet('-',FUPD_CFG)); 
      }
      AjPost('/notes.php',params,function(r,t){    
        ge('vkfrupdck3').className='vkcheckbox_on';
        hide('vkfrupdloader');
        var remadd=vkShowFriendsUpd(true);
        if (!create){
          if (!remadd) ge('vkfrupdresult').innerHTML='<b>'+IDL('WithoutChanges')+'</b>';
          else {
              ge('vkfrupdresult').innerHTML='<table width="100%"><tr valign="top"><td>'+remadd.rem+'</td><td valign="top">'+remadd.add+'</td></tr></table>';
              AddExUserMenu(ge('vkfrupdresult'));
              doAPIRequest('method=getProfiles&uids='+fids.join(',')+','+nfids.join(','),function(r){
                //alert(print_r(r));
                for (var i=0;r.response && i<r.response.length;i++){
                  var user=r.response[i];
                  var elem=ge('vkfr'+user.uid);
                  if (elem) elem.innerHTML=user.first_name+' '+user.last_name;
                  
                }
                AddExUserMenu(ge('vkfrupdresult'));
              });
          }
        } else {
            ge('vkfrupdresult').innerHTML=IDL('NoteCreated');
        }
      });
    });
  });
}

function vkShowFriendsUpd(ret,names){
  var el=ge('remadd');
  var idfrupd=vkgetCookie('IDFriendsUpd');
  var html={rem:"",add:""};
  if (!idfrupd || vkgetCookie('IDFriendsUpd') == '_') {if (el) el.parentNode.removeChild(el); return;}
  idfrupd=vkgetCookie('IDFriendsUpd').split('_');
  var onclick="vkShowFriendsUpd(false,["+idfrupd.join(',').replace(/\+|\-/g,",")+"])";
  if (idfrupd[0].length){
    var rem=idfrupd[0].split('-');
    html.rem+='<div class="leftAd" style="margin-bottom:10px"><h4 onclick="'+onclick+'"><span class="linkover">'+IDL("delby")+'</span></h4><p><div style="text-align: center">';
    for (var i=0;i<rem.length;i++)   html.rem+='<a id="'+(ret?'vkfr':'vkfrsb')+rem[i]+'" href="id'+rem[i]+'">'+rem[i]+'</a><br>';
	  html.rem += '</div></p></div>';
  }
  if (idfrupd[1].length){
    var add=idfrupd[1].split('+');
    html.add+='<div class="leftAd" style="margin-bottom:10px"><h4 onclick="'+onclick+'"><span class="linkover">'+IDL("addby")+'</span></h4><p><div style="text-align: center">';
    for (var i=0;i<add.length;i++)   html.add+='<a id="'+(ret?'vkfr':'vkfrsb')+add[i]+'" href="id'+add[i]+'">'+add[i]+'</a><br>';
	  html.add += '</div></p></div>';
  }
  
  if (ret) return html;
  if (!el){
      var el=document.createElement('div');
			el.id="remadd";
			(ge('sideBar') || ge('side_bar')).appendChild(el);
  }
  el.innerHTML=html.rem+html.add;
  AddExUserMenu(el);
  if (names) doAPIRequest('method=getProfiles&uids='+names.join(','),function(r){
    for (var i=0;r.response && i<r.response.length;i++){
            var user=r.response[i];
            var elem=ge('vkfrsb'+user.uid);
            if (elem) elem.innerHTML=user.first_name+' '+user.last_name;
    }
    AddExUserMenu(el);
  });
}
//  UPD_END  //
//////////////


function IDAddFriend() {
IDprofile_on(1);
setSet(4,1);
document.getElementById("addFriend").submit();
}

function IDIgnorListF() {
for(i=0;x=document.getElementsByTagName('div')[i];i++) {
if (x.id.split('friendCont')[1]) {
x.getElementsByTagName('ul')[0].innerHTML=
x.getElementsByTagName('ul')[0].innerHTML.split('<LI id="fav')[0]+
'<li id=fav><a href=\"#fc\" onClick=\"javascript:IDIgnor_set('+x.id.split('friendCont')[1]+');\">[ '+IDL("addblack")+' ]</a></li>';
}}
}

/////Light Firends Functions
var friend_style="font-weight:bold; color: #34A235;"; //default; dal'she pepezapisano

var my_friends = {};
function GetMyFriend(){ 
      AjGet('friends_ajax.php',function(ajaxObj, responseText){
         var mid,dom;
         friends_Data = eval('(' + responseText + ')');
         each(friends_Data.friends, function(i, item) {
            mid=String(item[0]);
            dom=item[4];
            //my_friends[mid] = [true,dom];
            my_friends[mid] = true;
            if (dom) my_friends[dom] = true;
            //if (my_friends[String(item[0])])
            //alert(my_friends[String(item[0])]+'\n'+item[0]);
         });
         mark_friends();
        });
      /*Ajax.Post({
        url: 'friends_ajax.php',
        onDone: function(ajaxObj, responseText) {
         var mid,dom;
         friends_Data = eval('(' + responseText + ')');
         each(friends_Data.friends, function(i, item) {
            mid=String(item[0]);
            dom=item[4];
            //my_friends[mid] = [true,dom];
            my_friends[mid] = true;
            if (dom) my_friends[dom] = true;
            //if (my_friends[String(item[0])])
            //alert(my_friends[String(item[0])]+'\n'+item[0]);
         });
         mark_friends();
        }
     });*/
}

function mark_friends(){
var dloc=document.location.href;
if (ge('content')){
  var nodes = ge('content');
  if (isUserLink(dloc)){nodes = (ge('wall'))?ge('wall'):false;}
  if (!nodes){return};
  nodes =nodes.getElementsByTagName('a');

for(var i in nodes)
{
var node = nodes[i];
var ahref = '' + node.href;

var mid=ExtractUserID(ahref);

if (mid && my_friends[mid]) node.setAttribute("style",friend_style);
/*
if (ahref.indexOf('?')==-1 && ahref.indexOf('#')==-1 && ahref.indexOf('/id')!=-1)
    if (ahref.match(/\/id([\-0-9]+)/i))
        if (my_friends[ahref.match(/\/id([\-0-9]+)/i)[1]]) {node.style=friend_style};
        //node.innerHTML = '<FONT color=#34A235>' + node.innerHTML + '</FONT>';
*/
}
}}
 
function vk_LightFriends_init() {
var dloc=document.location.href;
if (!dloc.match('/friends'))
if(ge('content') && getSet(54)=='y'){
friend_style="color: "+getFrColor()+";";//font-weight:bold; 
if (my_friends.length>2) {mark_friends()} else GetMyFriend();
}}
///end of Light Friends

var vk_friendBox;

function Vk_addToFriends(id, obj) {
  if (typeof friendBox == 'undefined') {
    friendBox = new MessageBox({title: add_box_title, width: 400});
    if (!window.Dropdown) {
      attachScript('uiControls', 'js/lib/ui_controls.js');
      addCss('css/ui_controls.css');
    }
  }
  var url, act;
  url = 'friends_ajax.php';
  act = 'request_form';

  friendBox.removeButtons();
  friendBox.addButton({label: friends_cancel, style: 'button_no', onClick: function(){friendBox.hide();}});
  friendBox.addButton({label: Add_to_friends, onClick: function(){
    var form = ge('addFriendForm');
    if (!form) return;
    var params = serializeForm(form);
    Ajax.postWithCaptcha(url, params, {onSuccess: function(ajax, responseText){
      try {
        var response = eval('(' + responseText + ')');
        responseText = response.result || response.error || response.text;
      } catch (e) {}
      friendBox.content(responseText).removeButtons();
      friendBox.addButton({label: box_close, onClick: function(){friendBox.hide();}});
      friendBox.show();
      hide(obj);
      setTimeout("friendBox.hide(600)", 1200);
    }});
  }});
  friendBox.content('<div class="box_loader"></div>').show();
  Ajax.postWithCaptcha(url, {act: act, fid: id}, {json: 1, onSuccess: function(ajaxObj, response) {
    if (response.error) {
      friendBox.removeButtons().addButton({label: box_close, style: 'button_no', onClick: function(){friendBox.hide();}});
    }
    friendBox.content(response.text).show();
    if (response.script) {
      var script = response.script.replace(/^[\s\\n]+/g, '');
      eval(script);
    }
  }});
  //return false;
}

//javascript: vkFriendsBySex(function(r){alert(print_r(r))});
function vkFriendsBySex(callback){
  var fr=[];
  var frm=friendsData.friends;
  for (var i=0;i<frm.length;i++) fr.push(frm[i][0]);
  doAPIRequest('method=getProfiles&uids='+fr.join(',')+'&fields=uid,sex',
    function(r){
      if (r.response){
          var res=r.response;
          var m=[];
          var f=[];
          var o=[];
          var move=function(){
              switch(parseInt(res[i].sex)){
                case 0: o.push(res[i].uid); break; 
                case 1: f.push(res[i].uid); break;
                case 2: m.push(res[i].uid); break;
              }          
          }
          for (var i=0;i<res.length;i++)  move();
          //alert(m);
          if (callback) callback([o,f,m]);
      } else {alert(r.error.error_msg)};
    }
  );
}

function vkFrMakeNewCat(name,friends_list,hash,callback){
    AjPost('friends_ajax.php',{act:'save_list',cat_id:0,name:name,friends:friends_list.join(','),hash:hash},function(r,t){
      if (callback) callback(t);
    });
}
// javascript: vkAddParseFriendsLink();
function vkAddParseFriendsLink(){
  vkFrSummaryLinks = function(x){
    if (x==0 && friendsData.filter=='all')  show('vkfrctrl'); else hide('vkfrctrl');
    //alert(x+'\n'+friendsData.filter); 
  }
  var div=document.createElement('span');
  div.id='vkfrctrl';
  div.innerHTML='<span class="divide">|</span><a style="font-weight:normal" href="#" onclick="vkFriendsToSexCats(); return false;">'+IDL('FrSexToLists')+'</a>';
  if (selected_list>0 || friendsData.filter!='all') hide(div);
  var ref=ge('listControls');
  ref.parentNode.insertBefore(div,ref);
  
  //Inject2Func_2("loadFriends","+vkFrSummaryLinks(filter)","ge('summary').innerHTML = friends.summary");
  Inject2Func_2("onListRender","vkFrSummaryLinks(selected_list);","ge('summary').innerHTML = summary;");
  friendsFilter = new FriendsFilter(friendsData, ge('friend_lookup'), {pageSize: 50, onDataReady: onListRender});
}
function vkFriendsToSexCats(){
  var make=function(idx,r,nds,pnds){
          if (r[idx]) {
            vkFrMakeNewCat(nds[idx].value,r[idx],friendsData.hash,function(t){
              var result = eval('(' + t + ')');
              if (result.error) {
                alert(result.error);
              } else {
                  var listId=result.cat_id;
                  var listName=result.cat_name;
                  ge('side_filters').innerHTML += '<div id="list_item'+listId+'" class="side_filter" onclick="loadFriends(\'all\', '+listId+')" onmouseout="listOut(this)" onmouseover="listOver(this)">'+listName+'</div>';
                    friendsLists[listId] = listName;
                    for (i in friendCats) friendCats[i] &= ~(1 << listId);
                    for (i in r[idx])    friendCats[r[idx][i]] |= (1 << listId);
                
              }              
              pnds[idx].innerHTML="<b>OK</b>"
            });
            pnds[idx].innerHTML=vkLdrImg;
          }  
  }
  var RunMake=function(){
    box.removeButtons();
    box.addButton({  onClick: function(){ box.hide(200); },  style:'button_no',label:IDL('OK')});
    vkFriendsBySex(function(r){
        var nodes=ge('frcato','frcatfm','frcatm');
        var pnodes=[nodes[0].parentNode,nodes[1].parentNode,nodes[2].parentNode];
        for (var i=0;i<3;i++){
          make(i,r,nodes,pnodes);
        }    
    });
  }
  
  if (!window.vkFriendsSexBox) {
    vkFriendsSexBox = new MessageBox({title: IDL('ParseFriends'),closeButton:true,width:"350px"});
    vkaddcss("\
        .vkfrbx input{width:150px; margin-right:5px; margin-top:3px;}\
    ");
  }
  var box=vkFriendsSexBox;
  box.removeButtons();
  box.addButton({
    onClick: function(){ box.hide(200); },
    style:'button_no',label:IDL('Cancel')});
  box.addButton({
    onClick: RunMake,
    label:IDL('OK')});
  box.setOptions({onHide: function(){ box.content("");}});
  var html='<div class="vkfrbx">'+IDL('FrToCatsBySex')+':<br>'+
          '<span><input type="text" id="frcatfm" value=">_<"></span> -'+Sex_fm+'<br>'+
          '<span><input type="text" id="frcatm"  value="^_^"></span> -'+Sex_m+'<br>'+
          '<span><input type="text" id="frcato"  value="WTF?"></span> -'+IDL('Sex_other')+
          '</div>';
  box.content(html).show();
}



// FUNCTION FOR TAG SELECTORS & INVITERS
function vkFriendsByCats(cats,full_result,friendsdata){
  var raw={};
  var friends=(!friendsdata)?vkfriendsData.friends:friendsdata;
  for (var i=0;i<friends.length;i++)
    for (var k=0;k<cats.length;k++)
      if (friends[i][3] & (1 << cats[k])) raw[friends[i][0]]=friends[i];
  var result=[];
  for(key in raw) result.push(full_result?raw[key]:key);
  return result;
}

function vkSelectFriendsFromCats(target,callback,full_result){
  if (!full_result) full_result=0;
  target=ge(target);
  target.innerHTML=vkLdrImg;
  vkSubmitFrCat=function(el,full_result){
    var cats=[];
    var ch=el.parentNode.getElementsByTagName("input");
    for (var i=0;i<ch.length; i++) if (ch[i].checked) parseInt(cats.push(ch[i].value));
    var result=vkFriendsByCats(cats,full_result);
    if (result.length==0) alert("Friends not found"); 
    else  callback(result);
  }
  var MakeCats=function(){
      var html="";
      for (var key in vkfriendsCats) html+='<input type="checkbox" value="'+key+'">'+vkfriendsCats[key]+'<br>';
      html+='<a href="#" onclick="vkSubmitFrCat(this,'+full_result+'); return false;">[ OK ]</a>'
      target.innerHTML=html;    
  };
  
  if (!(window.vkfriendsData && window.vkfriendsCats)){
    AjGet('friends.php',function(r,t){
      var rawfr=t.match(/friendsData.=.({.+});/i);
      var rawcat=t.match(/friendsLists.=.({.+});/i);
      if (rawfr && rawcat){
        vkfriendsData=eval('('+rawfr[1]+')');
        vkfriendsCats=eval('('+rawcat[1]+')');
        MakeCats();
      }
    });
   } else MakeCats();
}
if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
