// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function vkPageVideo(m) {
if (m==1) {	pageMenu='';
//if (location.href.match('/video.'))	pageMenu+='<a href="javascript:IDVideoAlbum();">- '+IDL("LinksGet")+'</a>';
if (location.href.match('act=tagview') && (geByClass('videos').length==2))
	pageMenu+='<a href="javascript:IDVideoTagDelete();">- '+IDL("MyTagsDelete")+'</a>';

return pageMenu;
} else {
// functions
if (location.href.match('/video') && location.href.match('_') && (getSet(1) == 'y'))
	VkoptVideo();
if (location.href.match('_') && (getSet(7) == 'y'))
	IDNamesInColsV();
if (location.href.match('_') && getSet(15) == 'y')
	IDVideoSelect();
if (location.href.match('video.php.act=comments'))
  DubPagesToBottom();	
/*if (location.href.match('/video.') && getSet(13) == 'y')
	if (!location.href.match('act=delete') && !location.href.match('act=tagview'))
	 IDVideoAlbum(); */
//if ((location.href.split('?id=')[1] || location.href.match('&id=') || location.href.split('?gid=')[1] || location.href.match('&gid=') || location.href.match('act=tagview')))
//

if (location.href.match('act=tagview') && (geByClass('videos').length==2))
  vkVidDelTags();
DontCloseSelector();	 
}
}

function vkDelVideoTag(link){
//video16477717_140098791?tagged_id=13391307#removeTag
//        oid       vid
var link2=link.match(/\d+/g);
ge('deltag'+link2[1]).innerHTML=vkLdrImg;
AjGet(link,function(r,text){
  var tag_id=text.match(/removeTag.(\d+)/i)[1];
  AjPost('/video.php', {act: 'adeletetag', vid: link2[1], tag_id: tag_id, oid: link2[0]},function(r,text){
  //alert(text);
  ge('deltag'+link2[1]).innerHTML=IDL('DelTagOk');
  });

});

/*
vid = ge('video_id').value;//140098791
oid = ge('owner_id').value;//16477717

*/
}

function vkVidDelTags(){
  var el=geByClass('videos')[0].getElementsByTagName('div');
  var div,link2;
  for (var i=0;i<el.length;i++){
    div=el[i];
    if (div.id && div.id.match('videoInfo')){
      link=div.innerHTML.match(/video\d+_\d+/i)[0];
      link2=link.match(/\d+/g);
      div.innerHTML+=/*'<span class="divider">|</span>'*/'<span id="deltag'+link2[1]+'"><a href="javascript: vkDelVideoTag(\''+link+'\')">'+IDL('DelTag')+'</a></span>';
    }
  }
}

function DontCloseSelector(){
  hideTagSelector=function () {
	 if (ge('contentOverlay')) {
	 	 ge('content').removeChild(ge('contentOverlay'));
	 }
	 toggleTagOpOverlay(false);
	 return false;
  }
}

function vkDownLinkOnWall(){
  var elem=ge('wall');
  var nodes=elem.getElementsByTagName('input');
  for (var i=0;i<nodes.length;i++)
    if(nodes[i].id && nodes[i].id.match('wallvideo_vars')){
     var vk_fvv = eval('(' + nodes[i].value + ')');
     //alert(vkGetVidLink(vk_fvv));
     var vid=nodes[i].id.match(/wallvideo_vars(.+)/i)[1];
     ge('wallvideo_author'+vid).innerHTML+='<span class="divide">|</span><a href="'+vkGetVidLink(vk_fvv)+'">'+IDL('download')+'</a>';
     //nodes[i].parentNode.innerHTML+='<a href="'+vkGetVidLink(vk_fvv)+'">'+IDL('download')+"</a>";
  }
}

/*function vkGetVidLink(flash_vars){
var vidurl="";
var vk_fvv=flash_vars;
		   if (!vk_fvv.host.match(/\d.\d.\d.\d/i)){
		    vidurl = (vk_fvv.host.match("vkadre.ru"))?"http://"+vk_fvv.host+"/assets/videos/"+vk_fvv.vtag+vk_fvv.vkid+".vk.flv":"http://cs" + vk_fvv.host + ".vkontakte.ru/u" + vk_fvv.uid + "/video/" + vk_fvv.vtag + ".flv";
       }
       if (vk_fvv.host.match(/\d.\d.\d.\d/i)){
        vidurl='http://'+vk_fvv.host+'/assets/videos/'+vk_fvv.vtag+vk_fvv.vkid+'.vk.flv';
       }
return  vidurl;
}*/



function vkGetUid6(uid) { var s = "" + uid; while (s.length < 5) {s = "0" + s;}  return s; }
function vkGetVidLink(flash_vars) {
    if (flash_vars.sd_link != null && flash_vars.sd_link.length > 0) {return flash_vars.sd_link;}
    if (flash_vars.uid <= 0) {
        return "http://" + flash_vars.host + "/assets/videos/" + flash_vars.vtag + "" + flash_vars.vkid + ".vk.flv";
    }
    return flash_vars.host + "u" + vkGetUid6(flash_vars.uid) + "/video/" + flash_vars.vtag + ".flv";
}

function vkGetVidHDLink(flash_vars) {
    if (flash_vars.hd_link != null && flash_vars.hd_link.length > 0) {
        return flash_vars.hd_link;
    }
    if (!flash_vars.hd || flash_vars.uid <= 0) {
        return null;
    }
    return "http://cs" + flash_vars.host + ".vkontakte.ru/u" + vkGetUid6(flash_vars.uid) + "/video/" + flash_vars.vtag + ".360.mov";

}
function vkpathToHD(flash_vars,param1){
    if (flash_vars.hd_link    != null && flash_vars.hd_link.length    > 0 && param1 == 1){  return flash_vars.hd_link;    }
    if (flash_vars.hd480_link != null && flash_vars.hd480_link.length > 0 && param1 == 2){  return flash_vars.hd480_link; }
    if (flash_vars.hd720_link != null && flash_vars.hd720_link.length > 0 && param1 == 3){  return flash_vars.hd720_link; }
    if (flash_vars.uid <= 0 || param1 > parseInt(flash_vars.hd)){  return null; }
    var _loc_2 = "240";
    switch(param1){
        case 1:   {  _loc_2 = "360"; break;}
        case 2:   {  _loc_2 = "480"; break;}
        case 3:   {  _loc_2 = "720"; break;}
        default:  {  break; }
    }
    return flash_vars.host + "u" +  vkGetUid6(flash_vars.uid) + "/video/" + flash_vars.vtag + "." + _loc_2 + ".mp4";
   // return "http://cs" + flash_vars.host + ".vkontakte.ru/u" +  vkGetUid6(flash_vars.uid) + "/video/" + flash_vars.vtag + "." + _loc_2 + ".mp4";//mov
}

function vkGenerateHDLinks(flash_vars){
var s="";
var vidHDurl="";
if ( parseInt(flash_vars.hd)>0)
  for (var i=1;i<=parseInt(flash_vars.hd);i++){
    vidHDurl=vkpathToHD(flash_vars,i);
    var _loc_2 = "360";
    switch(i){case 2:{_loc_2 = "480"; break;}  case 3:{  _loc_2 = "720"; break;}}
    s += (vidHDurl)?'<span class="action_link"><a href="'+vidHDurl+'">'+IDL("downloadHD")+' '+_loc_2+'p</a></span>':"";   
  }
  return s;
}

function vkVideoDubRemove(){
    if (getSet(85)=='n') return;
    var node=ge('results');
    var divs=vkArr2Arr(node.childNodes);
    var Unique=[];
    var Deleted=0;
    for (var i=0; i<divs.length;i++){
      if (divs[i].tagName!='DIV') continue;
      var img=divs[i].getElementsByTagName('img')[0];
      if (img){
        if (inArr(Unique,img.src)) {node.removeChild(divs[i]); Deleted++;}
        else Unique.push(img.src);
      } 
    }
    //if (!bigSummary) 
    var bigSummary = document.getElementById("searchSummary");
    if (bigSummary && Deleted>0) {
      bigSummary.innerHTML += IDL('aDubDel') + Deleted + IDL('aDublic')+remDubflex(Deleted)+'.';
    }
    //alert('DubDeleted:'+Deleted);
}

function VkoptVideo()
/* knopki dlya:
   skachivaniya video (SD && HD)
*/
{
	//flvars=ge('content').innerHTML.split("var flashVars = {");
	flvars=ge('content').innerHTML.match(/{"uid".+}/ig);
	var vidurl=vidHDurl="";
  if (flvars){
    flvars=flvars[0];//.split("};")[0];
		//eval("var vk_fvv = {"+flvars+"};");
		eval("var vk_fvv = "+flvars+";");
    vidurl=(vk_fvv.no_flv=='1')?vkpathToHD(vk_fvv,0):vkGetVidLink(vk_fvv);
    vidHDurl=vkGetVidHDLink(vk_fvv);
		
	// knopka dlya skachivaniya video
    vidurl =  '<span class="action_link"><a href="'+vidurl+'">'+IDL("download")+'</a></span>';
    vidurl += vkGenerateHDLinks(vk_fvv);//(vidHDurl)?'<a href="'+vidHDurl+'">'+IDL("downloadHD")+'</a>':"";
    
    window.document.getElementById("videoactions").innerHTML+=vidurl;

}
}

function IDNamesInColsV(st) {
/* spisok ludey na video v stolbik */
vkaddcss("#tagsCont span:before{display:block;width:100%; font-size:0px; content:' ';}");
/*
if (document.getElementById('videotags') && document.getElementById('videotags').getElementsByTagName('span').length) {
  var names = document.getElementById('videotags').getElementsByTagName('span');
   for (j= 0; j< names.length; j++)
    {
	
	names[j].innerHTML=(names[j].innerHTML.match('pupShow') || getSet(50)=='n' || st)?'<br>- '+names[j].innerHTML:names[j].innerHTML;
    }
   }//*/
}



function IDVideoSelect() {
var mid=remixmid();//(ge('sideBar') || ge('side_bar')).innerHTML.split('mail.php')[1].match(/id=(\d+)/)[1];
//if (!ge('id')) return;
var vid = ge('video_id').value;//id
var mvid = ge('owner_id').value;//document.getElementById('videocaption').getElementsByTagName('div')[0].getElementsByTagName('a')[0].href.split('id')[1];

if (ge('videoactions').innerHTML.match('showTagSelector')){//if (mid == mvid) {
 document.getElementById("videoactions").innerHTML+='<span class="action_link"><a href=# onclick="javascript:IDVideoSelect_tag();">'+IDL("selall")+'</a></span>';
 IDVideoDelSelect();
 document.getElementById("videoactions").innerHTML+='<div id="FGr"><span class="action_link"><a href=# onclick="vkSelectFriendsFromCats(\'FGr\',IDVideoSelect_tag); return false;">'+IDL("selgrs")+'</a></span></div>';
 }
}

function IDVideoDelSelect(){
if (ge('tagsCont').getElementsByTagName('span').length && !ge("videoactions").innerHTML.match("IDVideoSelect_del")) ge("videoactions").innerHTML+='<span class="action_link"><a href=# onclick="javascript:IDVideoSelect_del();">'+IDL("remall")+'</a></span>';
}


function IDVideoSelect_tag(listfid) {
 //var mid  = remixmid();
  var vid  = ge('video_id').value;
  var tagel= ge('tagsCont');
  //var mvid = ge('videocaption').getElementsByTagName('div')[0].getElementsByTagName('a')[0].href.split('id')[1];
  var num=0;
  if (!listfid) num=friendsForTags.length;
  else num=listfid.length;
  var i=0;
  var vactin=ge('videoactions').innerHTML  
  var FinishSel=function(){ge('videoactions').innerHTML=vactin; IDVideoDelSelect();}
  var AddedTag=function(ajax, responseText) {
              tagel.innerHTML = responseText;
              if (i<num){
                if (!listfid) {
                    var fid=friendsForTags[i][0]; var text=friendsForTags[i][1];
                } else {
                    var fid=listfid[i]; var text=listfid[i];
                }
                var curnow = i+1;
                ge('videoactions').innerHTML=vkProgressBar(curnow,num,160,'<h1>'+curnow+'/'+num+'</h1>')+'<br><br><h1>'+fid+'</h1>';//'<h1>'+curnow+'/'+num+'</h1><br><br><h1>'+fid+'</h1>';
                setTimeout(function(){Ajax.postWithCaptcha('/video.php', {act: 'aaddtag', vid: vid, fid: fid, text: text, oid: ge('owner_id').value}, options);},300);
                i++;
              } else {FinishSel();}
           }
    var options = {onSuccess: AddedTag, onFail:function(r,t){i--; AddedTag(r,t);}, onCaptchaHide: function(success) { if (!success) FinishSel(); }};//onFail: hideTagSelector
   AddedTag(null,tagel.innerHTML);        
}



function IDVideoSelect_del() {
var vid = document.getElementById('id').value;
var mvid = ge('owner_id').value;//document.getElementById('videocaption').getElementsByTagName('div')[0].getElementsByTagName('a')[0].href.split('id')[1];
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
var listall=document.getElementById('tagsCont').getElementsByTagName('span');
var num = listall.length;
  var tagel= ge('tagsCont');
  var vactin=ge('videoactions').innerHTML  
  var FinishSel=function(){ge('videoactions').innerHTML=vactin;}
  
var a=0;
for (j= 0; j < num; j++) {
if (listall[j].innerHTML.match('removeTag')){
sid = listall[j].innerHTML.split('removeTag(')[1].split(')')[0];
curnow = j+1;
document.getElementById('videoactions').innerHTML=vkProgressBar(curnow,num,160,'<h1>'+curnow+'/'+num+'</h1>');//'<h1>'+curnow+'/'+num+'</h1>';
http_request.open("POST", "/video.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.send("act=adeletetag&vid="+vid+"&tag_id="+sid+"&oid="+mvid);
}}
FinishSel();
tagel.innerHTML = http_request.responseText;
//if (http_request.responseText) new_side(http_request.responseText);
//location.href='/video'+mvid+'_'+vid;
}

function IDVideoTagDelete() {
dellist=new Array();
for (deltags=0; deltags<geByClass('videos')[0].getElementsByTagName('table').length; deltags++)
{dellist[deltags]=geByClass('videos')[0].getElementsByTagName('table')[deltags].getElementsByTagName('a')[0].href;}
IDVideoTagDelete_del(dellist,0);}function IDVideoTagDelete_del(dellist,deltags) {
if (dellist[deltags]) {vkStatus('[ '+deltags+' / '+dellist.length+' ]');var http_request = false; http_request = new XMLHttpRequest();
if (http_request.overrideMimeType) { }
if (!http_request) { alert('errorXMLHTTP'); return false;return http_request; }
http_request.open("GET", dellist[deltags], false);
http_request.send("");
if (http_request.responseText.split('confirmTag('))remove=http_request.responseText.split('confirmTag(')[1].split(')')[0];
var http_request = false; http_request = new XMLHttpRequest();
if (http_request.overrideMimeType) { }
if (!http_request) { alert('errorXMLHTTP'); return false;return http_request; }
http_request.open("POST", "/video.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.send("act=adeletetag&vid="+dellist[deltags].split('_')[1].split('?')[0]+"&tag_id="+remove+"&oid="+dellist[deltags].split('video')[1].split('_')[0]);
deltags++;
vkStatus('[ '+deltags+' / '+dellist.length+' ]');
setTimeout(function(){IDVideoTagDelete_del(dellist,deltags)},500);
}
else {vkStatus('');location.reload();}
}


///ADMIN FUNCTIONS
//<a href="#" style="float:right" onclick="cancelEvent(event); this.innerHTML='D'; return false">Del</a>

var vidListDelDelay=1500;
function DeleteAlbums(idx,array){
if (idx<array.length){
  var albid=array[idx].match(/\d+/i)[0];
  ge('header').innerHTML=idx+'/'+array.length+' album_id:'+albid;
  idx++;
  Ajax.Post({ url: 'video.php',query: {act: 'a_delete_album', album_id: albid, hash: videoEditHash, gid:videoData.gid},
          onDone: function(res, text){
            var menuItem = ge("list_item" + albid);
            menuItem.parentNode.removeChild(menuItem);
            ge('video_summary').innerHTML=text;
            setTimeout(function(){DeleteAlbums(idx,array)},vidListDelDelay);
          }
  });
}}
function  vkDelAllVidLists(){
var _albums=ge('side_filters').innerHTML.match(/list_item(\d+)/ig);
var idx=1;
DeleteAlbums(1,_albums);
}


if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
