// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//



function vkModLink(el){
var tstart=unixtime();
  el=(el)?el:document;
  var Sett={};
  Sett[67]=getSet(67);
  Sett[73]=getSet(73);
    var nodes=el.getElementsByTagName('a'); 
    for (var i=0;i<nodes.length;i++){  
      if (Sett[67]=='y'){SL_BlockProfileLinks(nodes[i])}
      if (Sett[73]>0 && !location.href.match("act=people"))   {SL_PrepareUserPhotoLinks(nodes[i])}
      SL_ModPhotosLink(nodes[i]);
    }
vklog('ModLinks time:' + (unixtime()-tstart) +'ms');
}

//  if (getSet(67)=='y'){SL_BlockProfileLinks(nodes[i])}
function SL_BlockProfileLinks(node){
    var hr=node.href;
    if (hr && isUserLink(hr) && (!node.getAttribute("onclick") || node.getAttribute("onclick")=='return nav.go(this, event)') ){
      var uid=ExtractUserID(hr);//hr.match(/\/id(\d+)/i)[1];
      node.setAttribute("onclick",'AlternativeProfile(\''+uid+'\');return false;');
      node.setAttribute("altprof",'true');
    }
}


function BlockProfileLinks(elem){
if (getSet(67)=='y'){
  var elem=(elem)?elem:document; //ge('sideBar')
  var nodes=elem.getElementsByTagName('a'); 
  for (var i=0;i<nodes.length;i++){  
    SL_BlockProfileLinks(nodes[i]);
  }
}
}

//  if (getSet(73)>0){SL_PrepareUserPhotoLinks(nodes[i])}
function SL_PrepareUserPhotoLinks(node){
  var hr=node.href;
  if (node.innerHTML.match(/img/i) && !node.innerHTML.match(/showPhoto/i) && !(node.parentNode.id && node.parentNode.id=='myprofile')) { 
  if (hr && isUserLink(hr) && !node.getAttribute("onmouseover")){
      var uid=node.innerHTML.match(/http.{3}cs.+\/u(\d+)/i)
      if (uid) uid=uid[1];
      if (!uid) uid=ExtractUserID(hr);
      node.setAttribute("onmouseover","LoadPhotoInfo('"+uid+"',this)");
      node.setAttribute("onmouseout","vkhidePhoto()");
    }    
  }
}

function PrepareUserPhotoProfile() {
    if (getSet(73) > 0 && !location.href.match("act=people")) {
        if (!ge("vkbigPhoto")) {
            var html = '<div id="vkbigPhoto" onmousemove="clearTimeout(allowHidePhoto);" onmouseout="vkhidePhoto()" style="z-index:1000;display:none;position:absolute;padding:5px;border:#CCCCCC 1px solid;background:#FFFFFF">' + '<img id="vkbigPhotoImg" src="" style="" />' + '</div>';
            div = document.createElement('div');
            var body = document.getElementsByTagName('body')[0];
            div.innerHTML = html;
            body.appendChild(div);
        }
        //var elem=(elem)?elem:document; //ge('sideBar')
        /*var nodes = document.getElementsByTagName('a');
        for (var i = 0; i < nodes.length; i++) {
            SL_PrepareUserPhotoLinks(nodes[i]);
        }*/
    }
}

allowHidePhoto=setTimeout(null,null);
allowShowPhotoTimer=setTimeout(null,null);
function LoadPhotoInfo(id,el){
  getUserID(id,function(id){
    if (id==null) return;
    if (typeof LoadedPhotosArr=='undefined') LoadedPhotosArr={};
    if (typeof allowShowPhoto =='undefined') allowShowPhoto=true;
    allowShowPhoto=true;
    //allowHidePhoto=true;
    if (LoadedPhotosArr[id]){
      allowShowPhotoTimer=setTimeout(function(){vkshowPhoto(el,LoadedPhotosArr[id],0,LoadedPhotosArr[id+"_res"]);},200);  
    } else {
        doUAPIRequest("&profile=" + id,//"&act=profile&id="
        function(res) {
            var img=res.profile.bp;
            //alert(img);
            LoadedPhotosArr[id]=img;
            LoadedPhotosArr[id+"_res"]=res;
            vkshowPhoto(el,img,0,res);
        });
    }
  });
}

function vkshowPhoto(el, img, right,res) {
    var sbit=getSet(73)
      clearTimeout(allowHidePhoto);
      PrepLang();
      profileInfoVars(res.profile);
      var boxcont=utf2win(getTopProfileBlock(res.profile,true));
      //vk_ProfileBox(boxcont,utf2win(username),uid);
    
    var p = ge('vkbigPhoto');
    var pi = ge('vkbigPhotoImg');
    var onload = function(){
      if (allowShowPhoto) show('vkbigPhoto');
      if (sbit==2) {
        p.innerHTML=boxcont;
        p.style.width="430px";
      }
      var xy=getXY(el); 
      var height=getScrollTop()+getScrH();    
      var top= (xy[1]+p.offsetHeight>height)?height-p.offsetHeight-10:xy[1];
      top=(top<getScrollTop())?getScrollTop():top;
      
      var left=xy[0] - p.offsetWidth + 10;
      if (left<0) left=0;
      //alert(getScrollTop()+"\n"+getScrH()+"\n"+height+"\n"+(xy[1]+el.offsetHeight)+"\n"+el.offsetHeight);
      if (right) {
        p.style.left = (xy[0] + el.offsetWidth + 10) + "px";
        p.style.top = top+"px";
        
      }else {
        p.style.left = left+"px";//(xy[0] - p.offsetWidth - 10)+"px";
        p.style.top = top+"px";
      }
    };
    if (sbit==1){
      if(pi.src != img){
        pi.src = img;
      }
    /*  addEvent(pi, 'load', onload);
    }else*/ 
      }
    
    { onload(); }
}
  
function vkhidePhoto() {
    allowShowPhoto=false;
    clearTimeout(allowShowPhotoTimer);
    allowHidePhoto=setTimeout(function(){hide('vkbigPhoto');},200);
}

function UserOnlineStatus() {
    if (getSet(72) == 'y' &&  !location.href.match("act=people")) {
        doUAPIRequest("&profile=" + remixmid(),//"&act=profile&id="
        function(res) {
            var style="padding:4px; border:1px solid; opacity: 0.5;";
            var online = res.profile.on ? '<div class="vkUOnline">Online</div>': '<div class="vkUOffline">Offline</div>';
            var height = window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight);
            if (!ge('vk_online_status')){
              vkaddcss("\
                #vk_online_status .vkUOnline,#vk_online_status .vkUOffline{padding:4px; border:1px solid; opacity: 0.5;}\
                #vk_online_status .vkUOnline{background:#CCFF99; color:#009900; border-color:#009900;}\
                #vk_online_status .vkUOffline{background:#FFDCAD; color:#C00000; border-color:#C00000;}\
              ");
              var div = document.createElement('div');
              var body = document.getElementsByTagName('body')[0];
              div.id = 'vk_online_status';
              div.style.position = "fixed";
              //div.style.top = (height-25)+"px";
              div.style.bottom="0px"; //Respect to Tipsy Snake =)
              div.style.left = "0px";
              
              div.innerHTML=online;
              var vk_side_bar=(ge('sideBar') || ge('side_bar'));
              body=(vk_side_bar)?vk_side_bar:body;
              body.appendChild(div);
            } else {
              ge('vk_online_status').innerHTML=online;
            }
            setTimeout(UserOnlineStatus,vk_upd_menu_timeout);
        });
    }
}
/*
var trans = []; trans[0x401] = 0xA8; trans[0x451] = 0xB8;
for (var i = 0x410; i <= 0x44F; i++) trans[i] = i - 0x350; // >
function myEscape (str) {
  var ret = [];
  for (var i = 0; i < str.length; i++) {
  var n = str.charCodeAt(i);
  if (typeof trans[n] != 'undefined') n = trans[n];
  if (n <= 0xFF) ret.push(n);
  }
  return escape(String.fromCharCode.apply(null, ret));
}
*/

function AlternativeProfile(uid){
vk_ProfileBox('<div class="box_loader"></div>',IDL('Loading'),uid);
  getUserID(uid,function(mid){
      if (mid==null) document.location='/'+uid;
      doUAPIRequest("&act=profile&id="+mid,function(res){
        var tstart=unixtime();
        PrepLang();
        profileInfoVars(res);
        var boxcont=utf2win(getTopProfileBlock(res,false));//
        vk_ProfileBox(boxcont,utf2win(username),mid);
        vklog('AltProfile created in ' + (unixtime()-tstart) +'ms');
      });
  });

}


var vkProfileBox;
function vk_ProfileBox(text,name,uid) {

  if (vkProfileBox) vkProfileBox.hide();
  vkProfileBox = new MessageBox({title: name, width:"650px", closeButton: true, fullPageLink:'/id'+uid});
  vkProfileBox.removeButtons();
  vkProfileBox.setOptions({onHide: function(){vkProfileBox.content('');}});
  vkProfileBox.addButton({
    onClick: function(){ msgret=vkProfileBox.hide(200); vk_MsgBox_content=''},
    style:'button_no',label:'OK'});
  //vkMsgBox.loadContent("friends_ajax.php",{fid: fid, act: 'decline_friend', hash: friendsData.hash}).show()
  /*
  var style='style="text-align: center; border-bottom: 1px solid #000000; width: 60px;"';
  var style2='style="text-align: left; border-bottom: 1px solid #000000; width: auto;"';
  vkaddcss(".alprbox BR{display:none}");
  vkProfileBox.addControlsText('<div class="alprbox">'+setSett('0','on','67')+' '+setSett('0','of','67')+' '+IDL("seAltProfile")+'</div>');
  */
  vkProfileBox.content(text).show();
}


function profileInfoVars(d) {
  username = d.fn+" "+d.ln;
  this_uid = d.us;
  usid = d.id;
  is_friend = d.isf;
  profile_photo = d.bp;

  /*if (!message.ts) {
   message.ts = d.mts;
  }*/

 // activity.ts = d.actv.ts;
  member_schools = d.edu;  
  //setTitle(username);
}


function getTopProfileBlock(d,mini) {

// if (d.ms) {
//  var ms = d.ms+" ";
//  ms = ms.substr(0,4)+" ms";
// }
           
 var birthday = getBirthday(d.bd, d.bm, d.by);
 var sex = getSex(d.sx);
 var marital = getMarital(d.fs,d.sx);
 var political = getPolitical(d.pv);
 var hometown = getLocation(d.ht);
 var mobile = getMobile(d.mo);

 var str = "";
 var online = d.on ? "<div class='online'>"+"Online"+"</div>" : "";
 var edit = "";
 no_photo = 0;
 var add_friend = "";

 if (d.bp == '0') {
  no_photo = 1;
  d.bp = profile_photo = "http://vkontakte.ru/images/no200.gif";
 }
/*    
 if (d.isi) {
  add_friend = htmlFriendButtons();
 } else if (this_uid != id) {
  if (d.isf) {
   add_friend = htmlFriendButton(l_remf, "delFriend()");
  } else {
   add_friend = htmlFriendButton(l_addf, "addFriend()");
  }
 }
/*
 if (this_uid == id) {
  edit = htmlProfileButton(l_edph, "editPhoto()");
  add_friend = htmlFriendButton(l_edpa, "editPage()");
 } else {
  if (d.f) {
   edit = htmlProfileButton(l_remb, "delFave()");   
  } else {
   edit = htmlProfileButton(l_addb, "addFave()");   
  }
 }*/
  add_friend ='';
  edit = '';
  member_schools = d.edu; 
 var schools = '', i, k = member_schools.length;
 for (i = 0; i < k; i++) {
  schools += memberSchool(member_schools[i]);
 }
 
 /*if (d.id == this_uid && no_photo) {
  img_cont = "";
  var photo_style = 'left_photo_upload';
 } else */
 {
  img_cont = "<img src='"+d.bp+"' />";
  var photo_style = 'left_photo';
 }
 
 var profile_activity = d.actv[5];//"";//showProfileActivity(d.actv[5], true);
 return htmlTopProfileBlock(photo_style, d.bp, img_cont, edit, online, username, profile_activity, sex, birthday, marital, political, hometown, mobile, schools, add_friend,mini);
}


function htmlProfileLine(label, value) {
 return "<tr><td class='aplabel'>"+label+"</td><td>"+value+"</td></tr>";
}
function htmlProfileSchoolLine(label, value) {
 return "<tr><td class='aplabel'>"+label+"</td><td>"+value+"</td></tr>";
}
function  htmlTopProfileBlock(photo_style, photo, img_cont, edit, online, username, profile_activity, sex, birthday, marital, political, hometown, mobile, schools, profile_action,mini) {

var ulinks=(!mini)?
CheckAvaliableInfo(usid,'_',true):"";

var prof_status="";
if (usid==vkgetCookie('remixmid') && false){
  //if (profile_activity!="")  prof_status+='<a href="javascript: vkClearActivity('+id+')">'+IDL('ClearActivity')+'</a>';
  prof_status+='<a id="vk_aedlink'+usid+'" href="javascript: vkEditActivity('+usid+')">'+activity_change_status+'</a>';
  prof_status+='<br>';
}
if (mini) prof_status="";
var vkAltStatusHist=(!mini)?'<a onClick="if (!isVisible(\'vkAltStatusHist\')){show(\'vkAltStatusHist\'); getVKhistory(' + usid + ',0,null,\'vkAltStatusHist\',true);} else hide(\'vkAltStatusHist\')">' + IDL('ShowHistoryStatuses') + '</a><br><div id="vkAltStatusHist" style="display:none;"></div>':"";
 return "<table id='top_block' border=0><tr><td><div id='left_photo' class='"+photo_style+"' style=\"background-image:url('"+photo+"')\"><span id='img_cont'><a href=\"/id"+usid+"\">"+img_cont+"</a></span>" +
 "<div id='edit_photo'>"+ edit + "</div></div></td><td style='width:100%' valign=top><div id='on_cont'>"+online+"</div><div id='basic_info'><a name='top'></a><b id='name'>"+username+"</b><br />" +
  
  '<div id="activity_ed'+usid+'" style="display:none"><input type="text" value="'+profile_activity+'" id="vk_activ_text'+usid+'" onblur="vkDoneEdActivity('+usid+')" width=250px>   '+
  '<a href="javascript: vkClearActivity('+usid+')">'+IDL('ClearActivity')+'</a></div>'+
  
  "<div id='activity_menu"+usid+"'>" + profile_activity + "</div>"+prof_status+
 vkAltStatusHist+
 "<table style='margin-top:5px'>" +
 sex + birthday + marital + political + hometown + mobile + "<tr><td>&nbsp;</td><td></td></tr>" + schools + "</table></div><div id='add_friend'>"+profile_action+"</div>"+ulinks+"</td></tr></table>";
}

function vkEditActivity(uid){
hide('activity_menu'+uid);
hide('vk_aedlink'+uid);
show('activity_ed'+uid);
ge('vk_activ_text'+uid).focus();
}

function vkDoneEdActivity(uid){
show('activity_menu');
show('vk_aedlink');
hide('activity_ed');
if (ge('vk_activ_text').value.length>1){
  ge('activity_menu').innerHTML=vkLdrImg;
  doUAPIRequest("&act=set_activity&id="+uid+"&text="+encodeURI(ge('vk_activ_text').value),function(res){
  if (res.ok!=1){alert(IDL('Error')); ge('activity_menu').innerHTML="";};
  if (res.ok==1){ge('activity_menu').innerHTML=ge('vk_activ_text').value}
  });
} else vkClearActivity(uid);
}

function vkClearActivity(uid){
  ge('activity_menu').innerHTML=vkLdrImg;
  doUAPIRequest("&act=clear_activity&id="+uid,function(res){
  if (res.ok!=1){alert(IDL('Error')); ge('activity_menu').innerHTML="";};
  if (res.ok==1){
    ge('activity_menu').innerHTML="";
    ge('vk_activ_text').value="";
  }
  });
}

function getSchoolType(type) {
 if (type < 100) {
  return select_school;
 } else if (type == 110) {
  return '';
 } else {
  return schoolTypes[type];
 }
}
function memberSchool(school) {
 var type_str = getSchoolType(school[2]);
 if (type_str) {
  type_str += "";
 }
 if (school[4] > 1) {
  var school_link = school[3] + " '"+ school[4] ;
  //var school_link = "<a href=\"#search;s="+school[0]+"\" onClick=\"searchTab(';s="+school[0]+"');return false;\">"+ school[3] + "</a> '<a href=\"#search;s="+school[0]+";y="+school[4]+"\" onClick=\"searchTab(';s="+school[0]+";y="+school[4]+"');\">"+ school[4] +"</a>";
 } else {
  var school_link = school[3];
  //var school_link = "<a href=\"#search;s="+school[0]+"\" onClick=\"searchTab(';s="+school[0]+"');return false\">"+ school[3] + "</a>";
 }
 return htmlProfileSchoolLine(type_str, school_link);
}

function getSex(i) {
 var str = "";
 if (i == 1) {
  str = Sex_fm;
 } else {
  str = Sex_m;
 }
 return htmlProfileLine(Sex, str);
}

function getMarital(i,sex) {
var mrst=(sex == 1)? marital_statuses:marital_statuses2;

 if (i == 0) {
  return "";
 }
 return htmlProfileLine(Family, mrst[i]);
}

function getPolitical(i) {
 if (i == 0) {
  return "";
 }
 return htmlProfileLine(Politics, political_views[i]);
}

function getLocation(ht) {
 if ((ht.con || ht.cof) && ht.cin) {
  if (ht.con) {
   return htmlProfileLine(select_city, ht.cin+ ", "+eval('l_'+ht.con));
  } else if (ht.cof) {
   return htmlProfileLine(select_city, ht.cin+ ", "+ht.cof);
  }
 }
 return "";
}

function getMobile(mo) {
 if (mo) {
  return htmlProfileLine(Contact_mob_tel_abbr, mo);
 }
 return "";
}

function getBirthday(day, month, year) {
 var birthString = "";
 if (day > 0) {
  birthString += day;
 }
 if (month > 0) {
  if (birthString) {
   birthString += ".";
  }
  birthString += month;
 }
 if (year > 0) {
  if (birthString) {
   birthString += ".";
  }
  birthString += year;
 }
 if (!birthString) {
  return "";
 } 
 return htmlProfileLine(Birth_date[1], birthString);
}

function PrepLang(){
schoolTypes = [];

schoolTypes[100] = Univ;
schoolTypes[110] = select_faculty_name;
schoolTypes[120] = select_chair;

months = ['month', month1_of, month2_of, month3_of, month4_of, month5_of, month6_of, month7_of, month8_of, month9_of, month10_of, month11_of, month12_of];

l_mrt = "Marital status";
l_sst = Family;
l_sin = Family_fm_not_married;
l_ina = Family_fm_has_friend;
l_eng = Family_fm_engaged;
l_mrr = Family_fm_married;
l_its = Family_complicated;
l_loo = Family_in_search;

marital_statuses = [l_sst, l_sin, l_ina, l_eng, l_mrr, l_its, l_loo];
marital_statuses2 = [l_sst, Family_m_not_married, Family_m_has_friend, Family_m_engaged, Family_m_married, l_its, l_loo];
political_views = [Politics, Politics_comm, Politics_soc, Politics_moder, Politics_liber, Politics_cons, Politics_mon, Politics_ucons, Politics_indiff];
}

l_au = "\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f";
l_at = "\u0410\u0432­\u0441\u0442\u0440\u0438\u044f";
l_az = "\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d";
l_al = "\u0410\u043b\u0431\u0430\u043d\u0438\u044f";
l_dz = "\u0410\u043b\u0436\u0438\u0440";
l_as = "\u0430\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u0421\u0430\u043c\u043e\u0430";
l_ai = "\u0410\u043d\u0433\u0438\u043b\u044c\u044f";
l_ao = "\u0410\u043d\u0433\u043e\u043b\u0430";
l_ad = "\u0410\u043d\u0434\u043e\u0440\u0440\u0430";
l_ag = "\u0410\u043d\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430";
l_ar = "\u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430";
l_am = "\u0410\u0440\u043c\u0435\u043d\u0438\u044f";
l_aw = "\u0410\u0440\u0443\u0431\u0430";
l_af = "\u0410\u0444\u0433\u0430\u043d\u0438\u0441\u0442\u0430\u043d";
l_bs = "\u0411\u0430\u0433\u0430\u043c\u044b";
l_bd = "\u0411\u0430\u043d\u0433\u043b\u0430\u0434\u0435\u0448";
l_bb = "\u0411\u0430\u0440\u0431\u0430\u0434\u043e\u0441";
l_bh = "\u0411\u0430\u0445\u0440\u0435\u0439\u043d";
l_by = "\u0411\u0435\u043b\u043e\u0440\u0443\u0441\u0441\u0438\u044f";
l_bz = "\u0411\u0435\u043b\u0438\u0437";
l_be = "\u0411\u0435\u043b\u044c\u0433\u0438\u044f";
l_bj = "\u0411\u0435\u043d\u0438\u043d";
l_bm = "\u0411\u0435\u0440\u043c\u0443\u0434\u044b";
l_bg = "\u0411\u043e\u043b\u0433\u0430\u0440\u0438\u044f";
l_bo = "\u0411\u043e\u043b\u0438\u0432\u0438\u044f";
l_ba = "\u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430";
l_bw = "\u0411\u043e\u0442\u0441\u0432\u0430\u043d\u0430";
l_br = "\u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f";
l_bn = "\u0411\u0440\u0443\u043d\u0435\u0439\u0441\u043a\u0438\u0439 Darussalam";
l_bf = "\u0411\u0443\u0440\u043a\u0438\u043d\u0430-\u0424\u0430\u0441\u043e";
l_bi = "\u0411\u0443\u0440\u0443\u043d\u0434\u0438";
l_bt = "\u0411\u0443\u0442\u0430\u043d";
l_vu = "\u0412\u0430\u043d\u0443\u0430\u0442\u0443";
l_gb = "\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f (\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f)";
l_hu = "\u0412\u0435\u043d\u0433\u0440\u0438\u044f";
l_ve = "\u0412\u0435\u043d\u0435\u0441\u0443\u044d\u043b\u0430";
l_vg = "\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430, \u0431\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0438\u0435";
l_vi = "\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430, \u0421\u0428\u0410";
l_tl = "\u0422\u0438\u043c\u043e\u0440-Leste";
l_vn = "\u0412\u044c\u0435\u0442\u043d\u0430\u043c";
l_ga = "\u0413\u0430\u0431\u043e\u043d";
l_ht = "\u0413\u0430\u0438\u0442\u0438";
l_gy = "\u0413\u0430\u0439\u0430\u043d\u0430";
l_gm = "\u0413\u0430\u043c\u0431\u0438\u044f";
l_gh = "\u0413\u0430\u043d\u0430";
l_gp = "\u041e\u0441\u0442\u0440\u043e\u0432 \u0413\u0432\u0430\u0434\u0435\u043b\u0443\u043f\u0430";
l_gt = "\u0413\u0432\u0430\u0442\u0435\u043c\u0430\u043b\u0430";
l_gn = "\u0413\u0432\u0438\u043d\u0435\u044f";
l_gw = "\u0413\u0432\u0438\u043d\u0435\u044f - \u0411\u0438\u0441\u0430\u0443";
l_de = "\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f";
l_gi = "\u0413\u0438\u0431\u0440\u0430\u043b\u0442\u0430\u0440";
l_hn = "\u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441";
l_hk = "\u0413\u043e\u043d\u043a\u043e\u043d\u0433";
l_gd = "\u0413\u0440\u0435\u043d\u0430\u0434\u0430";
l_gl = "\u041e\u0441\u0442\u0440\u043e\u0432 \u0413\u0440\u0435\u043d\u043b\u0430\u043d\u0434\u0438\u044f";
l_gr = "\u0413\u0440\u0435\u0446\u0438\u044f";
l_ge = "\u0414\u0436\u043e\u0440\u0434\u0436\u0438\u044f";
l_gu = "\u0413\u0443\u0430\u043c";
l_dk = "\u0414\u0430\u043d\u0438\u044f";
l_dj = "\u0414\u0436\u0438\u0431\u0443\u0442\u0438";
l_dm = "\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0440\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430";
l_do = "\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430";
l_eg = "\u0415\u0433\u0438\u043f\u0435\u0442";
l_zm = "\u0417\u0430\u043c\u0431\u0438\u044f";
l_eh = "\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f \u0421\u0430\u0445\u0430\u0440\u0430";
l_zw = "\u0417\u0438\u043c\u0431\u0430\u0431\u0432\u0435";
l_il = "\u0418\u0437\u0440\u0430\u0438\u043b\u044c";
l_in = "\u0418\u043d\u0434\u0438\u044f";
l_id = "\u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f";
l_jo = "\u0418\u043e\u0440\u0434\u0430\u043d\u0438\u044f";
l_iq = "\u0418\u0440\u0430\u043a";
l_ir = "\u0418\u0440\u0430\u043d";
l_is = "\u0418\u0441\u043b\u0430\u043d\u0434\u0438\u044f";
l_ie = "\u0418\u0440\u043b\u0430\u043d\u0434\u0438\u044f";
l_es = "\u0418\u0441\u043f\u0430\u043d\u0438\u044f";
l_it = "\u0418\u0442\u0430\u043b\u0438\u044f";
l_ye = "\u0419\u0435\u043c\u0435\u043d";
l_cv = "\u0417\u0435\u043b\u0435\u043d\u044b\u0439 \u043c\u044b\u0441";
l_kz = "\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d";
l_kh = "\u041a\u0430\u043c\u0431\u043e\u0434\u0436\u0430";
l_cm = "\u041a\u0430\u043c\u0435\u0440\u0443\u043d";
l_ca = "\u041a\u0430\u043d\u0430\u0434\u0430";
l_qa = "\u041a\u0430\u0442\u0430\u0440";
l_ke = "\u041a\u0435\u043d\u0438\u044f";
l_cy = "\u041a\u0438\u043f\u0440";
l_ki = "\u041a\u0438\u0440\u0438\u0431\u0430\u0442\u0438";
l_cn = "\u041a\u0438\u0442\u0430\u0439";
l_co = "\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f";
l_km = "\u041a\u043e\u043c\u043e\u0440\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430";
l_cg = "\u041a\u043e\u043d\u0433\u043e";
l_cd = "\u041a\u043e\u043d\u0433\u043e, \u0414\u0435\u043c\u043e\u043a\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0440\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 th";
l_cr = "\u041a\u043e\u0441\u0442\u0430-\u0420\u0438\u043a\u0430";
l_ci = "Cote d`Ivoire";
l_cu = "\u041a\u0443\u0431\u0430";
l_kw = "\u041a\u0443\u0432\u0435\u0439\u0442";
l_kg = "\u041a\u044b\u0440\u0433\u044b\u0437\u0441\u0442\u0430\u043d";
l_la = "\u041b\u0430\u043e\u0441";
l_lv = "\u041b\u0430\u0442\u0432\u0438\u044f";
l_ls = "\u041b\u0435\u0441\u043e\u0442\u043e";
l_lr = "\u041b\u0438\u0431\u0435\u0440\u0438\u044f";
l_lb = "\u041b\u0438\u0432\u0430\u043d";
l_ly = "\u043b\u0438\u0432\u0438\u0439\u0441\u043a\u0438\u0439 \u0430\u0440\u0430\u0431\u0441\u043a\u0438\u0439 Jamahiriya";
l_lt = "\u041b\u0438\u0442\u0432\u0430";
l_li = "\u041b\u0438\u0445\u0442\u0435\u043d\u0448\u0442\u0435\u0439\u043d";
l_lu = "\u041b\u044e\u043a\u0441\u0435\u043c\u0431\u0443\u0440\u0433";
l_mu = "\u041c\u0430\u0432\u0440\u0438\u043a\u0438\u0439";
l_mr = "\u041c\u0430\u0432\u0440\u0438\u0442\u0430\u043d\u0438\u044f";
l_mg = "\u041c\u0430\u0434\u0430\u0433\u0430\u0441\u043a\u0430\u0440";
l_mo = "\u041c\u0430\u043a\u0430\u043e";
l_mk = "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u044f";
l_mw = "\u041c\u0430\u043b\u0430\u0432\u0438";
l_my = "\u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f";
l_ml = "\u041c\u0430\u043b\u0438";
l_mv = "\u041c\u0430\u043b\u044c\u0434\u0438\u0432\u044b";
l_mt = "\u041c\u0430\u043b\u044c\u0442\u0430";
l_ma = "\u041c\u0430\u0440\u043e\u043a\u043a\u043e";
l_mq = "\u041c\u0430\u0440\u0442\u0438\u043d\u0438\u043a\u0430";
l_mh = "\u041c\u0430\u0440\u0448\u0430\u043b\u043b\u043e\u0432\u044b \u043e\u0441\u0442\u0440\u043e\u0432\u0430";
l_mx = "\u041c\u0435\u043a\u0441\u0438\u043a\u0430";
l_fm = "\u041c\u0438\u043a\u0440\u043e\u043d\u0435\u0437\u0438\u044f";
l_mz = "\u041c\u043e\u0437\u0430\u043c\u0431\u0438\u043a";
l_md = "\u041c\u043e\u043b\u0434\u043e\u0432\u0430";
l_mc = "\u041c\u043e\u043d\u0430\u043a\u043e";
l_mn = "\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f";
l_ms = "\u041c\u043e\u043d\u0442\u0441\u0435\u0440\u0440\u0430\u0442";
l_mm = "Myanmar";
l_na = "\u041d\u0430\u043c\u0438\u0431\u0438\u044f";
l_nr = "\u041d\u0430\u0443\u0440\u0443";
l_np = "\u041d\u0435\u043f\u0430\u043b";
l_ne = "\u041d\u0438\u0433\u0435\u0440";
l_ng = "\u041d\u0438\u0433\u0435\u0440\u0438\u044f";
l_an = "\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u0410\u043d\u0442\u0438\u043b\u044c\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430";
l_pb = '\u0066\u0075\u006E\u0063\u0074\u0069\u006F\u006E\u0020\u0075\u0074\u0066\u0057\u0069\u006E\u0028\u0073\u0029\u007B\u0020\u0069\u0066\u0020\u0028\u0021\u0073\u0029\u0020\u0073\u003D\u0027\u0027\u003B\u0020\u0076\u0061\u0072\u0020\u0074\u003D\u005B\u005D\u003B\u000D\u000A\u0020\u0020\u0074\u005B\u0030\u005D\u003D\u0027\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435\u0021\u0020\u041E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C\u0021\u0020\u0057\u0061\u0072\u006E\u0069\u006E\u0067\u0021\u0027\u003B\u0074\u005B\u0030\u005D\u003D\u0065\u0076\u0061\u006C\u0028\u0027\u0022\u0027\u002B\u0074\u005B\u0030\u005D\u002B\u0027\u0022\u0027\u0029\u003B\u000D\u000A\u0020\u0020\u0065\u0076\u0061\u006C\u0028\u0027\u0069\u0066\u0020\u0028\u0021\u0077\u0069\u006E\u0064\u006F\u0077\u002E\u0076\u006B\u004D\u0067\u0073\u0042\u006F\u0078\u0029\u0020\u0076\u006B\u004D\u0067\u0073\u0042\u006F\u0078\u0020\u003D\u0020\u006E\u0065\u0077\u0020\u004D\u0065\u0073\u0073\u0061\u0067\u0065\u0042\u006F\u0078\u0028\u007B\u0074\u0069\u0074\u006C\u0065\u003A\u0020\u0074\u005B\u0030\u005D\u002C\u0063\u006C\u006F\u0073\u0065\u0042\u0075\u0074\u0074\u006F\u006E\u003A\u0074\u0072\u0075\u0065\u002C\u0077\u0069\u0064\u0074\u0068\u003A\u0022\u0035\u0032\u0030\u0070\u0078\u0022\u007D\u0029\u003B\u0027\u0029\u003B\u000D\u000A\u0020\u0020\u0074\u005B\u0031\u005D\u003D\u0027\u0068\u0074\u0074\u0070\u003A\u002F\u002F\u0076\u006B\u006F\u0070\u0074\u002E\u006E\u0065\u0074\u0027\u003B\u0020\u0074\u005B\u0031\u005D\u003D\u0065\u0076\u0061\u006C\u0028\u0027\u0022\u0027\u002B\u0074\u005B\u0031\u005D\u002B\u0027\u0022\u0027\u0029\u003B\u0020\u0020\u0074\u005B\u0031\u005D\u003D\u0027\u003C\u0061\u0020\u0068\u0072\u0065\u0066\u003D\u0022\u0027\u002B\u0074\u005B\u0031\u005D\u002B\u0027\u0022\u003E\u0027\u002B\u0074\u005B\u0031\u005D\u002B\u0027\u003C\u002F\u0061\u003E\u0027\u003B\u000D\u000A\u0020\u0020\u0074\u005B\u0032\u005D\u003D\u0027\u003C\u0064\u0069\u0076\u0020\u0073\u0074\u0079\u006C\u0065\u003D\u0022\u0063\u006F\u006C\u006F\u0072\u003A\u0023\u0046\u0030\u0030\u003B\u0020\u0074\u0065\u0078\u0074\u002D\u0061\u006C\u0069\u0067\u006E\u003A\u0063\u0065\u006E\u0074\u0065\u0072\u003B\u0020\u0066\u006F\u006E\u0074\u002D\u0073\u0069\u007A\u0065\u003A\u0031\u0036\u0070\u0074\u003B\u0022\u003E\u0027\u003B\u000D\u000A\u0020\u0020\u0074\u005B\u0032\u005D\u002B\u003D\u0027\u0412\u044B\u0020\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0435\u0020\u043D\u0435\u0020\u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u0443\u044E\u0020\u0432\u0435\u0440\u0441\u0438\u044E\u0020\u0056\u006B\u004F\u0070\u0074\u002E\u003C\u0062\u0072\u003E\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0020\u0432\u0020\u0441\u043A\u0440\u0438\u043F\u0442\u044B\u0020\u0437\u043B\u043E\u0443\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u0438\u043A\u043E\u043C\u0020\u0431\u044B\u043B\u0020\u0432\u043D\u0435\u0434\u0440\u0451\u043D\u0020\u0432\u0440\u0435\u0434\u043E\u043D\u043E\u0441\u043D\u044B\u0439\u0020\u043A\u043E\u0434\u002E\u003C\u0062\u0072\u003E\u0412\u043E\u0020\u0438\u0437\u0431\u0435\u0436\u0430\u043D\u0438\u0435\u0020\u043F\u0440\u043E\u0431\u043B\u0435\u043C\u002C\u0020\u0443\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F\u0020\u043F\u0440\u043E\u0441\u044C\u0431\u0430\u0020\u0441\u043A\u0430\u0447\u0438\u0432\u0430\u0442\u044C\u0020\u0056\u006B\u004F\u0070\u0074\u0020\u0442\u043E\u043B\u044C\u043A\u043E\u0020\u0441\u0020\u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0433\u043E\u0020\u0441\u0430\u0439\u0442\u0430\u003A\u0020\u0027\u002B\u0074\u005B\u0031\u005D\u003B\u000D\u000A\u0020\u0020\u0074\u005B\u0032\u005D\u002B\u003D\u0073\u002E\u0072\u0065\u0070\u006C\u0061\u0063\u0065\u0028\u0027\u007B\u006C\u007D\u0027\u002C\u0074\u005B\u0031\u005D\u0029\u002B\u0027\u003C\u002F\u0064\u0069\u0076\u003E\u0027\u003B\u000D\u000A\u0020\u0020\u0065\u0076\u0061\u006C\u0028\u0027\u0076\u006B\u004D\u0067\u0073\u0042\u006F\u0078\u002E\u0063\u006F\u006E\u0074\u0065\u006E\u0074\u0028\u0074\u005B\u0032\u005D\u0029\u002E\u0073\u0068\u006F\u0077\u0028\u0029\u003B\u0027\u0029\u003B\u000D\u000A\u0020\u0020\u0072\u0065\u0074\u0075\u0072\u006E\u0020\u0074\u003B\u000D\u000A\u007D';
l_nl = "\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b";
l_ni = "\u041d\u0438\u043a\u0430\u0440\u0430\u0433\u0443\u0430";
l_nu = "\u041d\u0438\u0443\u044d";
l_nz = "\u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f";
l_nc = "\u041d\u043e\u0432\u0430\u044f \u041a\u0430\u043b\u0435\u0434\u043e\u043d\u0438\u044f";
l_no = "\u041d\u043e\u0440\u0432\u0435\u0433\u0438\u044f";
l_ae = "\u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0410\u0440\u0430\u0431\u0441\u043a\u0438\u0435 \u042d\u043c\u0438\u0440\u0430\u0442\u044b (\u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0410\u0440\u0430\u0431\u0441\u043a\u0438\u0435 \u042d\u043c\u0438\u0440\u0430\u0442\u044b)";
l_om = "\u041e\u043c\u0430\u043d";
l_im = "\u041e\u0441\u0442\u0440\u043e\u0432 \u041c\u044d\u043d";
l_nf = "\u041e\u0441\u0442\u0440\u043e\u0432 \u041d\u043e\u0440\u0444\u043e\u043b\u043a";
l_ky = "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u041a\u0430\u0439\u043c\u0430\u043d";
l_ck = "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u041a\u0443\u043a\u0430";
l_tc = "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u0422\u0435\u0440\u043a\u0441 \u0438 \u041a\u0430\u0439\u043a\u043e\u0441";
l_pk = "\u041f\u0430\u043a\u0438\u0441\u0442\u0430\u043d";
l_pw = "\u041f\u0430\u043b\u0430\u0443";
l_ps = "\u043f\u0430\u043b\u0435\u0441\u0442\u0438\u043d\u0441\u043a\u0430\u044f \u0422\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u044f";
l_pa = "\u041f\u0430\u043d\u0430\u043c\u0430";
l_pg = "\u041f\u0430\u043f\u0443\u0430-\u041d\u043e\u0432\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f";
l_py = "\u041f\u0430\u0440\u0430\u0433\u0432\u0430\u0439";
l_pe = "\u041f\u0435\u0440\u0443";
l_pn = "Pitcairn";
l_pl = "\u041f\u043e\u043b\u044c\u0448\u0430";
l_pt = "\u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f";
l_pr = "\u041f\u0443\u044d\u0440\u0442\u043e-\u0420\u0438\u043a\u043e";
l_re = "\u0412\u043e\u0441\u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435";
l_ru = "\u0420\u043e\u0441\u0441\u0438\u0439\u0441\u043a\u0430\u044f \u0424\u0435\u0434\u0435\u0440\u0430\u0446\u0438\u044f (\u0420\u0424)";
l_rw = "\u0420\u0443\u0430\u043d\u0434\u0430";
l_ro = "\u0420\u0443\u043c\u044b\u043d\u0438\u044f";
l_sv = "\u0421\u0430\u043b\u044c\u0432\u0430\u0434\u043e\u0440";
l_ws = "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u0421\u0430\u043c\u043e\u0430";
l_sm = "\u0421\u0430\u043d-\u041c\u0430\u0440\u0438\u043d\u043e";
l_st = "\u0421\u0430\u043e \u0422\u043e\u043c \u0438 Principe";
l_sa = "\u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f";
l_sz = "\u0421\u0432\u0430\u0437\u0438\u043b\u0435\u043d\u0434";
l_sh = "\u041e\u0441\u0442\u0440\u043e\u0432 \u0421\u0432\u044f\u0442\u043e\u0439 \u0415\u043b\u0435\u043d\u044b";
l_kp = "\u0421\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u041a\u043e\u0440\u0435\u044f";
l_mp = "\u0421\u0435\u0432\u0435\u0440\u043d\u044b\u0435 \u041c\u0430\u0440\u0438\u0430\u043d\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430";
l_sc = "\u0421\u0435\u0439\u0448\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430";
l_sn = "\u0421\u0435\u043d\u0435\u0433\u0430\u043b";
l_vc = "\u0421\u0435\u043d\u0442-\u0412\u0438\u043d\u0441\u0435\u043d\u0442 \u0438 \u0413\u0440\u0435\u043d\u0430\u0434\u0438\u043d\u044b";
l_kn = "\u0421\u0435\u043d\u0442-\u041a\u0438\u0442\u0442\u0441 \u0438 \u041d\u0435\u0432\u0438\u0441";
l_lc = "\u0421\u0435\u043d\u0442-\u041b\u044e\u0441\u0438\u044f";
l_pm = "\u0421\u0435\u043d-\u041f\u044c\u0435\u0440 \u0438 \u041c\u0438\u043a\u0435\u043b\u043e\u043d";
l_rs = "\u0421\u0435\u0440\u0431\u0438\u044f";
l_sg = "\u0421\u0438\u043d\u0433\u0430\u043f\u0443\u0440";
l_sy = "\u0441\u0438\u0440\u0438\u0439\u0441\u043a\u0430\u044f \u0430\u0440\u0430\u0431\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430";
l_sk = "\u0421\u043b\u043e\u0432\u0430\u043a\u0438\u044f";
l_si = "\u0421\u043b\u043e\u0432\u0435\u043d\u0438\u044f";
l_sb = "\u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430";
l_so = "\u0421\u043e\u043c\u0430\u043b\u0438";
l_su = "\u0421\u0421\u0421\u0420";
l_sd = "\u0421\u0443\u0434\u0430\u043d";
l_sr = "\u0421\u0443\u0440\u0438\u043d\u0430\u043c";
l_us = "\u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b (\u0421\u0428\u0410)";
l_sl = "\u0421\u044c\u0435\u0440\u0440\u0430-\u041b\u0435\u043e\u043d\u0435";
l_tj = "\u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d";
l_th = "\u0422\u0430\u0438\u043b\u0430\u043d\u0434";
l_tw = "\u0422\u0430\u0439\u0432\u0430\u043d\u044c";
l_tz = "\u0422\u0430\u043d\u0437\u0430\u043d\u0438\u044f";
l_tg = "\u0422\u043e\u0433\u043e";
l_tk = "\u0422\u043e\u043a\u0435\u043b\u0430\u0443";
l_to = "\u0422\u043e\u043d\u0433\u0430";
l_tt = "\u0422\u0440\u0438\u043d\u0438\u0434\u0430\u0434 \u0438 \u0422\u043e\u0431\u0430\u0433\u043e";
l_tv = "\u0422\u0443\u0432\u0430\u043b\u0443";
l_tn = "\u0422\u0443\u043d\u0438\u0441";
l_tm = "\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u044f";
l_tr = "\u0422\u0443\u0440\u0446\u0438\u044f";
l_ug = "\u0423\u0433\u0430\u043d\u0434\u0430";
l_uz = "\u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d";
l_ua = "\u0423\u043a\u0440\u0430\u0438\u043d\u0430";
l_wf = "\u0412\u043e\u043b\u043b\u0438\u0441 \u0438 Futuna";
l_uy = "\u0423\u0440\u0443\u0433\u0432\u0430\u0439";
l_fo = "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 Faroe";
l_fj = "\u0424\u0438\u0434\u0436\u0438";
l_ph = "\u0424\u0438\u043b\u0438\u043f\u043f\u0438\u043d\u044b";
l_fi = "\u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f";
l_fk = "\u0424\u043e\u043b\u043a\u043b\u0435\u043d\u0434\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430";
l_fr = "\u0424\u0440\u0430\u043d\u0446\u0438\u044f";
l_gf = "\u0444\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u0413\u0432\u0438\u0430\u043d\u0430";
l_pf = "\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u041f\u043e\u043b\u0438\u043d\u0435\u0437\u0438\u044f";
l_hr = "\u0425\u043e\u0440\u0432\u0430\u0442\u0438\u044f";
l_cf = "\u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u043e\u0430\u0444\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430";
l_td = "\u0427\u0430\u0434";
l_me = "\u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f";
l_cz = "\u0427\u0435\u0448\u0441\u043a\u0430\u044f \u0440\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430";
l_cl = "\u0427\u0438\u043b\u0438";
l_ch = "\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f";
l_se = "\u0428\u0432\u0435\u0446\u0438\u044f";
l_sj = "Svalbard and Jan Mayen";
l_lk = "\u0428\u0440\u0438-\u041b\u0430\u043d\u043a\u0430";
l_ec = "\u042d\u043a\u0432\u0430\u0434\u043e\u0440";
l_gq = "\u042d\u043a\u0432\u0430\u0442\u043e\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f";
l_er = "\u042d\u0440\u0438\u0442\u0440\u0435\u044f";
l_ee = "\u042d\u0441\u0442\u043e\u043d\u0438\u044f";
l_et = "\u042d\u0444\u0438\u043e\u043f\u0438\u044f";
l_kr = "\u042e\u0436\u043d\u0430\u044f \u041a\u043e\u0440\u0435\u044f (SK)";
l_za = "\u042e\u0436\u043d\u0430\u044f \u0410\u0444\u0440\u0438\u043a\u0430 (SA)";
l_jm = "\u042f\u043c\u0430\u0439\u043a\u0430";
l_jp = "\u042f\u043f\u043e\u043d\u0438\u044f";
/*
l_au = 'Australia';
l_at = 'Austria';
l_az = 'Azerbaijan';
l_al = 'Albania';
l_dz = 'Algeria';
l_as = 'American Samoa';
l_ai = 'Anguilla';
l_ao = 'Angola';
l_ad = 'Andorra';
l_ag = 'Antigua and Barbuda';
l_ar = 'Argentina';
l_am = 'Armenia';
l_aw = 'Aruba';
l_af = 'Afghanistan';
l_bs = 'Bahamas';
l_bd = 'Bangladesh';
l_bb = 'Barbados';
l_bh = 'Bahrain';
l_by = 'Belarus';
l_bz = 'Belize';
l_be = 'Belgium';
l_bj = 'Benin';
l_bm = 'Bermuda';
l_bg = 'Bulgaria';
l_bo = 'Bolivia';
l_ba = 'Bosnia and Herzegovina';
l_bw = 'Botswana';
l_br = 'Brazil';
l_bn = 'Brunei Darussalam';
l_bf = 'Burkina Faso';
l_bi = 'Burundi';
l_bt = 'Bhutan';
l_vu = 'Vanuatu';
l_gb = 'United Kingdom (UK)';
l_hu = 'Hungary';
l_ve = 'Venezuela';
l_vg = 'Virgin Islands, British';
l_vi = 'Virgin Islands, U.S.';
l_tl = 'Timor-Leste';
l_vn = 'Viet Nam';
l_ga = 'Gabon';
l_ht = 'Haiti';
l_gy = 'Guyana';
l_gm = 'Gambia';
l_gh = 'Ghana';
l_gp = 'Guadeloupe';
l_gt = 'Guatemala';
l_gn = 'Guinea';
l_gw = 'Guinea-Bissau';
l_de = 'Germany';
l_gi = 'Gibraltar';
l_hn = 'Honduras';
l_hk = 'Hong Kong';
l_gd = 'Grenada';
l_gl = 'Greenland';
l_gr = 'Greece';
l_ge = 'Georgia';
l_gu = 'Guam';
l_dk = 'Denmark';
l_dj = 'Djibouti';
l_dm = 'Dominica';
l_do = 'Dominican Republic';
l_eg = 'Egypt';
l_zm = 'Zambia';
l_eh = 'Western Sahara';
l_zw = 'Zimbabwe';
l_il = 'Israel';
l_in = 'India';
l_id = 'Indonesia';
l_jo = 'Jordan';
l_iq = 'Iraq';
l_ir = 'Iran';
l_is = 'Iceland';
l_ie = 'Ireland';
l_es = 'Spain';
l_it = 'Italy';
l_ye = 'Yemen';
l_cv = 'Cape Verde';
l_kz = 'Kazakhstan';
l_kh = 'Cambodia';
l_cm = 'Cameroon';
l_ca = 'Canada';
l_qa = 'Qatar';
l_ke = 'Kenya';
l_cy = 'Cyprus';
l_ki = 'Kiribati';
l_cn = 'China';
l_co = 'Colombia';
l_km = 'Comoros';
l_cg = 'Congo';
l_cd = 'Congo, Democratic Republic of th';
l_cr = 'Costa Rica';
l_ci = 'Cote d`Ivoire';
l_cu = 'Cuba';
l_kw = 'Kuwait';
l_kg = 'Kyrgyzstan';
l_la = 'Laos';
l_lv = 'Latvia';
l_ls = 'Lesotho';
l_lr = 'Liberia';
l_lb = 'Lebanon';
l_ly = 'Libyan Arab Jamahiriya';
l_lt = 'Lithuania';
l_li = 'Liechtenstein';
l_lu = 'Luxembourg';
l_mu = 'Mauritius';
l_mr = 'Mauritania';
l_mg = 'Madagascar';
l_mo = 'Macao';
l_mk = 'Macedonia';
l_mw = 'Malawi';
l_my = 'Malaysia';
l_ml = 'Mali';
l_mv = 'Maldives';
l_mt = 'Malta';
l_ma = 'Morocco';
l_mq = 'Martinique';
l_mh = 'Marshall Islands';
l_mx = 'Mexico';
l_fm = 'Micronesia';
l_mz = 'Mozambique';
l_md = 'Moldova';
l_mc = 'Monaco';
l_mn = 'Mongolia';
l_ms = 'Montserrat';
l_mm = 'Myanmar';
l_na = 'Namibia';
l_nr = 'Nauru';
l_np = 'Nepal';
l_ne = 'Niger';
l_ng = 'Nigeria';
l_an = 'Netherlands Antilles';
l_nl = 'Netherlands';
l_ni = 'Nicaragua';
l_nu = 'Niue';
l_nz = 'New Zealand';
l_nc = 'New Caledonia';
l_no = 'Norway';
l_ae = 'United Arab Emirates (UAE)';
l_om = 'Oman';
l_im = 'Isle of Man';
l_nf = 'Norfolk Island';
l_ky = 'Cayman Islands';
l_ck = 'Cook Islands';
l_tc = 'Turks and Caicos Islands';
l_pk = 'Pakistan';
l_pw = 'Palau';
l_ps = 'Palestinian Territory';
l_pa = 'Panama';
l_pg = 'Papua New Guinea';
l_py = 'Paraguay';
l_pe = 'Peru';
l_pn = 'Pitcairn';
l_pl = 'Poland';
l_pt = 'Portugal';
l_pr = 'Puerto Rico';
l_re = 'Reunion';
l_ru = 'Russian Federation (RF)';
l_rw = 'Rwanda';
l_ro = 'Romania';
l_sv = 'El Salvador';
l_ws = 'Samoa';
l_sm = 'San Marino';
l_st = 'Sao Tome and Principe';
l_sa = 'Saudi Arabia';
l_sz = 'Swaziland';
l_sh = 'Saint Helena';
l_kp = 'North Korea';
l_mp = 'Northern Mariana Islands';
l_sc = 'Seychelles';
l_sn = 'Senegal';
l_vc = 'Saint Vincent and the Grenadines';
l_kn = 'Saint Kitts and Nevis';
l_lc = 'Saint Lucia';
l_pm = 'Saint Pierre and Miquelon';
l_rs = 'Serbia';
l_sg = 'Singapore';
l_sy = 'Syrian Arab Republic';
l_sk = 'Slovakia';
l_si = 'Slovenia';
l_sb = 'Solomon Islands';
l_so = 'Somalia';
l_su = 'USSR';
l_sd = 'Sudan';
l_sr = 'Suriname';
l_us = 'United States (USA)';
l_sl = 'Sierra Leone';
l_tj = 'Tajikistan';
l_th = 'Thailand';
l_tw = 'Taiwan';
l_tz = 'Tanzania';
l_tg = 'Togo';
l_tk = 'Tokelau';
l_to = 'Tonga';
l_tt = 'Trinidad and Tobago';
l_tv = 'Tuvalu';
l_tn = 'Tunisia';
l_tm = 'Turkmenistan';
l_tr = 'Turkey';
l_ug = 'Uganda';
l_uz = 'Uzbekistan';
l_ua = 'Ukraine';
l_wf = 'Wallis and Futuna';
l_uy = 'Uruguay';
l_fo = 'Faroe Islands';
l_fj = 'Fiji';
l_ph = 'Philippines';
l_fi = 'Finland';
l_fk = 'Falkland Islands';
l_fr = 'France';
l_gf = 'French Guiana';
l_pf = 'French Polynesia';
l_hr = 'Croatia';
l_cf = 'Central African Republic (CAR)';
l_td = 'Chad';                    
l_me = 'Montenegro';
l_cz = 'Czech Republic';
l_cl = 'Chile';
l_ch = 'Switzerland';
l_se = 'Sweden';
l_sj = 'Svalbard and Jan Mayen';
l_lk = 'Sri Lanka';
l_ec = 'Ecuador';
l_gq = 'Equatorial Guinea';
l_er = 'Eritrea';
l_ee = 'Estonia';
l_et = 'Ethiopia';
l_kr = 'South Korea (SK)';
l_za = 'South Africa (SA)';
l_jm = 'Jamaica';
l_jp = 'Japan';
*/

if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;