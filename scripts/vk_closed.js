// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function vkClosed(m) {
if (m==1) {	pageMenu='';
//blackList
pageMenu +='<a href=# onClick="javascript:vkClosed();">- '+IDL("vkLinks")+'</a>';
return pageMenu;
} else if (location.href.split('/fave.')[1]) { if (getSet(35)=='y') {
var names=geByClass('name');
 for (i=0; i<names.length; i++) names[i].innerHTML=
  names[i].innerHTML+'<br>[ <a href="mail.php?act=write&to='+ExtractUserID(names[i].getElementsByTagName('a')[0].href)+'" target="_blank"> @ </a>'+
  ' <a href="javascript:vkFave(\''+ExtractUserID(names[i].getElementsByTagName('a')[0].href)+'\',0);"> X </a> ]';
}if (getSet(40)=='y') vkFaved();
} else if (getSet(34)=='y') {
if (isUserLink(location.href) || (window.cur && cur.section=='profile') ){// location.href.match('/id') || location.href.match('/profile.')
 
 if (geByClass('closed_profile')[0]/* && geByClass('closed_profile')[0].innerHTML.match('profile.addFriendBox')*/)//|| (geByClass('alertmsg')[0] && geByClass('alertmsg')[0].innerHTML.match(decodeURI('%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B8%D0%BB')))
	{
	//alert('closed');
          id=ge('mid')?ge('mid').value:cur.oid;
          ExtendClosed(id);
          CheckAvaliableInfo(id);
          //vkGetRating(id);
          vkMakeMatch(id);
          vkAvkoNav(id);
          /*temp=
          '<div align="center" class="vkLinksList">'+
          '<a href="photos.php?act=user&id='+id+'">'+IDL("clPhW")+'</a>'+
          '<a href="video.php?act=tagview&id='+id+'">'+IDL("clViW")+'</a>'+
          '<a href="photos.php?id='+id+'">'+IDL("clPh")+'</a>'+
          '<a href="video.php?id='+id+'">'+IDL("clVi")+'</a>'+
            '<a href="app545941_'+id+'">'+IDL("clAu")+'</a>'+
          '<a href="groups.php?id='+id+'">'+IDL("clGr")+'</a>'+
          '<a href="questions.php?mid='+id+'">'+IDL("clQu")+'</a>'+
          '<a href="apps.php?mid='+id+'">'+IDL("clAp")+'</a>'+
            '<a href="events.php?id='+id+'">'+IDL("clEv")+'</a>'+
          '<a href="notes.php?id='+id+'">'+IDL("clNo")+'</a>'+
          '<a href="wall.php?id='+id+'">'+IDL("clWa")+'</a>'+
          '<a href="gifts.php?id='+id+'">'+IDL("clGi")+'</a>'+
            '<a href="rate.php?act=vote&id='+id+'">'+IDL("clRa")+'</a>'+
          '<a href="javascript:IDpostMatch('+id+',1);">'+IDL("clMa")+'</a>'+
          '<a href="javascript:vkFave('+id+');">'+IDL("clFav")+'</a>';
          temp+='</div>';
          document.getElementById('rightColumn').innerHTML+=temp;*/
  }
 vkClosedWall(ge('mid')?ge('mid').value:cur.oid);
}
}

}

function vkFaved(x) {
vkaddcss('.people_table td {word-wrap: break-word;}');
fav_ava_style="height: 50px; display: inline-block; overflow: hidden;";
    doUAPIRequest("&act=faved&from=0&to=10000",function(res) {
        faved=res;
        favedn = faved.n;
        var to = 5;
        f1 = new Array();
        f2 = new Array();
        f1l = 0;
        f2l = 0;
        for (i = 0; i < favedn; i++) {
            if (faved.d[i][3] == 1) {
                f1[f1l] = faved.d[i];
                f1l++;
            } else if (faved.d[i][3] == 0) {
                f2[f2l] = faved.d[i];
                f2l++;
            } else alert('o_O figase..');
        };
        if (f1.length + f2.length != favedn) alert('O_o figase...'); //online
        whofaved = '<div class="flexOpen" id="Information2"><div class="bOpen"><div class="flexHeader clearFix"><div><h2>' + IDL('whofavedonline') + ' [ ' + f1.length + ' ]</h2></div></div></div><div class="c"><div class="flexBox clearFix"><table height="100%" cellspacing="0" class="people_table"><tbody>';
        for (i = 0; i < f1.length; i++) {
            favedid = f1[i][0];
            favedfname = f1[i][1].split(' ')[0];
            favedsname = f1[i][1].split(' ')[1];
            favedava = (f1[i][2] != '0') ? f1[i][2] : 'http://vkontakte.ru/images/question_c.gif';
            favedon = f1[i][3];
            whofaved += ((i == 0 || i % to == 0) ? '<tr>' : '') + '<td align=center><br><table height="100%" width=65px style="overflow: hidden;"><tbody><tr><td height="100%" class="image"><div align=center><a href="/id' + favedid + '"><div style="'+fav_ava_style+'"><img width="50px" alt="" src="' + favedava + '"/></div></a></div></td></tr>' + '<tr><td><a href="/id' + favedid + '">' + favedfname + '<br><small>' + favedsname + '</small></a></td></tr></tbody></table></td>' + ((i > 0 && (i + 1) % to == 0) ? '</tr>' : '');
        }
        whofaved += '</tbody></table></div></div></div>';
        (ge('leftColumn') || geByClass('narrow_column')[0]).innerHTML += '<br>' + whofaved; //offline
        whofaved = '<div class="flexOpen" id="Information3"><div class="bOpen"><div class="flexHeader clearFix"><div><h2>' + IDL('whofavedofline') + ' [ ' + f2.length + ' ]</h2></div></div></div><div class="c"><div class="flexBox clearFix"><table height="100%" cellspacing="0" class="people_table"><tbody>';
        for (i = 0; i < f2.length; i++) {
            favedid = f2[i][0];
            favedfname = f2[i][1].split(' ')[0];
            favedsname = f2[i][1].split(' ')[1];
            favedava = f2[i][2];
            favedava = (favedava.length < 3) ? '/images/question_c.gif' : favedava;
            favedon = f2[i][3];
            whofaved += ((i == 0 || i % to == 0) ? '<tr>' : '') + '<td align=center><br><table height="100%" width=65px style="overflow: hidden;"><tbody><tr><td height="100%" class="image"><div align=center><a href="/id' + favedid + '"><div style="'+fav_ava_style+'"><img width="50px" alt="" src="' + favedava + '"/></div></a></div></td></tr>' + '<tr><td><a href="/id' + favedid + '">' + favedfname + '<br><small>' + favedsname + '</small></a></td></tr></tbody></table></td>' + ((i > 0 && (i + 1) % to == 0) ? '</tr>' : '');
        }
        whofaved += '</tbody></table></div></div></div>';
        (ge('leftColumn') || geByClass('narrow_column')[0]).innerHTML += '<br>' + whofaved;
        onChangeContent(); //*/
    });
    
}

function vkFave(id, add) {
    if (id == 'list') {
        for (i = 0; td = (ge('leftColumn') || geByClass('narrow_column')[0]).getElementsByTagName('td')[i]; i++) {
            if (td.className == 'name') td.innerHTML += '<br><a href="javascript:vkFave(\'' + ExtractUserID(td.getElementsByTagName('a')[0].href) + '\',0);">[ X ]</a>';
        }
   } else if (id) {
      getUserID(id,function(id){
        if (!add || add == 1) temp = 'add_fave';
        if (add == 0) temp = 'del_fave';
        doRequest("&act="+temp+"&id="+id,function(faveres) {
                if (faveres.ok == 1) alert(faveres.id + ' added');
                else if (faveres.ok == 0) alert(faveres.id + ' deleted');
        });
     });
  }
}

function testReport(id) {
var http_request = false;
http_request = new XMLHttpRequest();
if (http_request.overrideMimeType)
{       }
if (!http_request) {alert('XMLHTTPError'); return false;return http_request;}
http_request.open("GET", "/id"+id, false);
http_request.send("");
response=http_request.responseText;
if (response.match('profileActions')) {
var btn=response.split('id="profileActions"')[1].split('percent')[0].replace(/<\/a>/gi,'</a>').split('</a>').reverse()[1];
if (btn.match('admin.php')) return btn.replace(/<\/div>/gi,'')+'</a>';
else return 'no_report';
}
else return '<a href="admin.php?act=report&id='+id+'">closed_page</a>';
}




var vkCloseWallPosts=50;
function vkClosedWall(id){
if (!ge('wall') && !ge('profile_wall')){
    var div = document.createElement('div');
    div.innerHTML=
          '<div id="wall" class="module_header"><div class="header_top clear_fix">'+
          '<div class="flexHeader clearFix" onclick="return collapseBox(\'wall\', this, 0.5, 0.25, false)" onfocus="blur()">'+
          '<div>[ '+IDL('wall')+' ]<span id="wall_psto_count"></span></div><img id="progr2" style="float:right; display:none; margin-top:3px" src="/images/upload.gif"></div></div>'+
          '<div class="c" ><div class="fSub clearFix"><div class="fSub_left" id="wall_shown"></div></div>'+
          '<div class="flexBox clearFix" id="fBox2"></div>'+
          '</div></div>';
    (ge('rightColumn') || geByClass('wide_column')[0]).appendChild(div);
show('progr2');
doUAPIRequest("act=wall&from=0&to="+vkCloseWallPosts+"&id="+id,function(r){GenWall(r,id,0)});
}
}

function vkCloseWallPage(id,page){
show('progr2');
doUAPIRequest("act=wall&from="+(page*vkCloseWallPosts)+"&to="+(vkCloseWallPosts*(page+1))+"&id="+id,function(r){GenWall(r,id,page)});

}

function GenWall(req,id,page) {
hide('progr2');
    if (req && req.ok != -3) {
        var temp = '';
        ge('wall_shown').innerHTML = 'показаны записи '+(page*vkCloseWallPosts)+'-' + (req.n >= page*vkCloseWallPosts+vkCloseWallPosts ? page*vkCloseWallPosts+vkCloseWallPosts: req.n) + ' из ' + req.n;
        for (i = 0; i < req.d.length; i++) {
            var ndata = new Date(req.d[i][1] * 1000);
            ndata = ndata.toLocaleString();

            temp += '<div><div><table class="wallpost" border="0" cellspacing="0" width="100%"><tr><td class="image">' + 
                    '<a href="/id' + req.d[i][3][0] + '">' + 
                    '<img border="0" src="' + req.d[i][3][2] + '">' + 
                    '</a></td><td class="info"><div class="header"><div class="fl_r" style="color: #777; margin: 0px 5px; display: none">Добавлено</div>' + 
                    '<a class="memLink" href="/id' + req.d[i][3][0] + '">' + 
                    req.d[i][3][1] + '</a> написал<br />' + 
                    '<small>' + ndata + '</small>' + '</div><div class="text" style="width: 315px; overflow: hidden;"><div class="audioRowWall">' + 
                    /*htmlspecialchars(*/req.d[i][2][0]/*)*/ + '</div><div class="actions"></div></td></tr></table></div></div>';
        }
        temp=utf2win(temp);
        ge('fBox2').innerHTML = temp;
    } else {
        ge('wall_shown').innerHTML = 'N/A <a href="http://m.vkontakte.ru/id'+id+'">'+IDL('SearchOnPda')+'</a>';
        //ge('fBox').innerHTML='<br><center><b>Недоступно</b><center><br>';
    }
    var nodes=geByClass('header',ge('fBox2'));
    if (page>0) nodes[0].innerHTML='<div class="upArrow"><a href="javascript: vkCloseWallPage('+id+', '+(page-1)+')">&larr;</a></div>'+nodes[0].innerHTML;
    if ((page*vkCloseWallPosts+vkCloseWallPosts)<req.n) nodes[0].innerHTML='<div class="dArrow"><a href="javascript: vkCloseWallPage('+id+','+(page+1)+')">&rarr;</a></div>'+nodes[0].innerHTML;
    
    onChangeContent();
}

function CheckPageAccess(uid,InfoLinks,idx){
  show('vkcloader'+idx+'_'+uid);
  AjGet(InfoLinks[idx][0].replace(/%id/g,uid),function(r){
     r=r.responseText;
     hide('vkcloader'+idx+'_'+uid);
     if (r.match('simpleHeader')) ge('vkclosedlink'+idx+'_'+uid).style.color='#F00';
     else {ge('vkclosedlink'+idx+'_'+uid).style.color='green'; ge('vkclosedlink'+idx+'_'+uid).style.fontWeight='bold'; }
  });
}

function CheckAvaliableInfo(id,toEl,ret){
  if (!id) id=ge('mid').value;
  if (!toEl) toEl=ge('rightColumn') || geByClass('wide_column')[0]; else toEl=ge(toEl);  
  ClosedInfoLinks=[
      ["photos.php?act=user&id=%id",  IDL("clPhW")],
      ["video.php?act=tagview&id=%id",IDL("clViW")],
      ["photos.php?id=%id",           IDL("clPh")],
      ["video.php?id=%id",            IDL("clVi")],
      ["audio.php?id=%id",            IDL("clAu")],
      ["friends.php?id=%id",          IDL("fris")],
      ["groups.php?id=%id",           IDL("clGr")],
      ["questions.php?mid=%id",       IDL("clQu")],
      ["apps.php?mid=%id",            IDL("clAp")],
      //["events.php?id=%id",           IDL("clEv")],
      ["notes.php?id=%id",            IDL("clNo")],
      ["wall.php?id=%id",             IDL("clWa")],
      ["gifts.php?id=%id",            IDL("clGi")]/*,
      ["rate.php?act=vote&id=%id",IDL("clRa")],
      ["javascript:IDpostMatch(%id,1);",IDL("clMa")],
      ["javascript:vkFave(%id);",IDL("clFav")]*/
  ];
          
   var html='<div align="center" class="vkLinksList">';
   html+= ((ret)?'<a href="javascript:Vk_addToFriends('+id+');" style="width:183px;">'+IDL("clAddFr")+'</a>'+
          '<a href="javascript:vkFave('+id+',1);" style="width:183px;">'+IDL("clAddToFav")+'</a>':"")+
          '<a href="javascript:;" onClick="IDIgnor_set('+id+');" style="width:183px;">'+IDL("addblack")+'</a>'+
          //'<a href="javascript:IDpostMatch('+id+',1);" style="width:183px;">'+IDL("clMa")+'</a>'+
          ((ret)?  '<a href="mail.php?act=write&to='+id+'" onclick="return AjMsgFormTo('+usid+');">'+IDL('txMessage')+'</a>'+
          '<a href="rate.php?act=vote&id='+id+'">'+IDL("clRa")+'</a>':"")+
          //'<a href="javascript:vkFave('+id+');">'+IDL("clFav")+'</a>'+
          '<a href="app545941_'+id+'">'+IDL("clAu")+'</a>'+
          '<a href="#" onclick="RunCheckAccess('+id+'); return false;" style="width:300px;"><b>&darr; '+IDL("CheckPageAccess")+' &darr;</b></a>';
   for (var i=0; i<ClosedInfoLinks.length;i++){
      html+= '<a id="vkclosedlink'+i+'_'+id+'" href="'+ClosedInfoLinks[i][0].replace(/%id/g,id)+'">'+ClosedInfoLinks[i][1]+'<img id="vkcloader'+i+'_'+id+'" style="display:none" src="/images/upload.gif"></a>';
   }
   //ge('vkclosedlink'+idx);
   html+= '</div>';      
  if (ret) return html;
  toEl.innerHTML+=html;
  
  //for (var i=0; i<InfoLinks.length;i++){CheckPageAccess(id,InfoLinks,i)}  
  
}
function RunCheckAccess(id){
  if (!id) id=ge('mid').value;
  for (var i=0; i<ClosedInfoLinks.length;i++){CheckPageAccess(id,ClosedInfoLinks,i)}  
}

function vkGetRating(id){
  vkaddcss('.vkpercent {margin:2px; font-size:11px; color: #8BA1BC;} .vkpercentGold {margin:2px; font-size:11px; color: #AAA26C;}');
  css10000='#rateLeftGold { border-top: 1px solid #B29F4E; background: #CBB464;} #rateRightGold { border-top: 1px solid #C5B565; background: #E1CC7E;}.vkpercentGold { color: #948239;}';
  css1000='.vkpercentGold { font-size: 11px; color: #FFF2C8; font-weight: bold;} #rateLeftGold { border-top: 1px solid #8D7A38; background: #B19A52;}#rateRightGold { border-top: 1px solid #A59250; background: #C9B36E;}';  
  doAPIRequest('method=getProfiles&uids='+id+'&fields=rate',function(req){    
      var fullwidth=200;
      var rate=req.response[0].rate;  
      //var (rate/100).toFixed(1)
      var k=0.01;
      if (rate>100) k=0.001;
      if (rate>1000 && rate<10000){k=0.0001;  vkaddcss(css1000);};
      if (rate>10000){k=0.00001; vkaddcss(css10000);}
      var percentwidth=rate*k*fullwidth;
      var gold=(rate>100)?'Gold':'';
      (ge('leftColumn') || geByClass('narrow_column')[0]).innerHTML+=      
      '<div id="rate'+gold+'" style="margin:0px 0px 30px 0px;">'+
        '<div id="rateLeft'+gold+'" style="position:absolute; z-index:2;width:'+percentwidth+'px;">  </div>'+
        '<div id="rateRight'+gold+'" style="position:relative; z-index:1; width:200px;"> </div>'+
        '<div class="vkpercent'+gold+'" style="text-align:center;position:absolute; z-index:3; width:200px;">'+rate+((rate<=100)?'%':'')+'</div>'+
      '</div>';  
  });
}

function IDpostMatch(id,dec) {
 doAPIRequest("method="+(dec?'offers.accept':'offers.refuse')+"&uid="+id,function(r){
  if (!r.response){
    vkFullAccessAppInstall(0,function(){
      doAPIRequest("method="+(dec?'offers.accept':'offers.refuse')+"&uid="+id,function(r){
        alert(r.response?IDL('Done'):(r.error?r.error.error_msg:'Error'));
      });
    });
  } else  alert(IDL('Done'));
 })
}


function vkMakeMatch(uid){
 if (ge('matches')) return;
 uid=(!uid)?ge('mid').value:uid;
 doAPIRequest("method=offers.get&uids="+uid,function(r){
  if (r.response[0]){
  //alert(r.response[0].message);
  html='<div id="matches" class="flexOpen"><div class="bOpen"><div class="flexHeader clearFix" onclick="return collapseBox(\'matches\', this, 0.5, 0.25)" onfocus="blur()"><div><h2>'+
  decodeURI('%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5')+
  '</h2></div><div class="flexEdit" style=\'display:none\'></div><style>.matchtext b {color: #36638E;}</style>'+
  '</div></div><div class="c"><div class="r"><div style="padding: 10px 10px;"><div id="m_msg" class="msg" style=\'margin:2px 4px 6px 0px; display:none\'></div><div class="matchtext"><b>'+decodeURI('%D0%A5%D0%BE%D1%82%D0%B5%D0%BB%D0%B8%20%D0%B1%D1%8B%20%D0%92%D1%8B')+'</b> '+ 
  r.response[0].message+
  '?</div><div>'+
  (r.response[0].active?
  '<ul class=\'nNav\' style="padding:15px 0px 0px 25px; height:25px;"><li><b class="nc"><b class="nc1"><b></b></b><b class="nc2"><b></b></b></b>'+
  '<span class="ncc"><a href="javascript: IDpostMatch(ge(\'mid\').value,0)">'+decodeURI('%D0%9D%D0%B5%D1%82')+'</a></span>'+
  '<b class="nc"><b class="nc2"><b></b></b><b class="nc1"><b></b></b></b></li><li><b class="nc"><b class="nc1"><b></b></b><b class="nc2"><b></b></b></b>'+
  '<span class="ncc"><a href="javascript: IDpostMatch(ge(\'mid\').value,1)">'+decodeURI('%3Cb%3E%D0%94%D0%B0%3C/b%3E,%20%D0%BA%D0%BE%D0%BD%D0%B5%D1%87%D0%BD%D0%BE')+'</a></span>'+
  '<b class="nc"><b class="nc2"><b></b></b><b class="nc1"><b></b></b></b></li></ul>':
  '<center><ul class="nNav"><h6 style="opacity: 0.4;">'+matches_closed+'</h6></ul></center>')+
  
  '</div></div></div></div></div>';
  (ge('leftColumn') || geByClass('narrow_column')[0]).innerHTML+=html; 
  }
 });
}

function ExtendClosed(id){
       var el=ge('rightColumn') || geByClass('wide_column')[0];
       el.innerHTML+='<div id="AlternativeInfo" class=""><div class="module_header"><div class="header_top clear_fix" onclick="return collapseBox(\'AlternativeInfo\', this, 0.5, 0.25)" onfocus="blur()"><div>'+
                                    IDL('AltInfo')+'</div></div></div><div class="c"><div class="r" id="AltInfoContent">'+
                                    '<div class="box_loader"></div>'+
                                    '</div></div></div>'; 
        
        doUAPIRequest("&act=profile&id=" + id,
        function(res) {
            var style="padding:4px; border:1px solid; opacity: 0.5;";
            //var online = res.on ? '<b style="color:#0A0;">Online</b>': '<b style="color:#A00;">Offline</b>';
            //ge('header').getElementsByTagName('H1')[0].innerHTML+=online;
            
             var d=res;
             PrepLang();
             var birthday = getBirthday(d.bd, d.bm, d.by);
             var sex = getSex(d.sx);
             var marital = getMarital(d.fs,d.sx);
             var political = getPolitical(d.pv);
             var hometown = getLocation(d.ht);
             var mobile = getMobile(d.mo);
             var member_schools = d.edu; 
             var schools = '', i, k = member_schools.length;
             for (i = 0; i < k; i++) { schools += memberSchool(member_schools[i]); }            
            ge('AltInfoContent').innerHTML=utf2win("<table style='margin-top:5px'>"+
                                          sex + birthday + marital + political + hometown + mobile + 
                                          "<tr><td>&nbsp;</td><td></td></tr>" + schools + "</table>");
        });
}
//javascript: doAPIRequest("method=offers.get&uids=4",function(r){alert(r.response[0].message)}
if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
