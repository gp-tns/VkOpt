// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


var VK_SELECT_PHOTOSTAG_TIMEOUT=100;

function vkPagePhotos(m) {
if (m==1) {pageMenu='';
if (location.href.split('act=')[1])
	if (location.href.split('act=')[1].split('&')[0] == 'album') {
//	pageMenu+='<a href=# onClick="javascript:vkSlide();">- SlideShow</a>';
	}
	if (location.href.match('/photos.') && location.href.match('act=added'))
	pageMenu+='<a href="javascript:IDPhotoTagDelete();">- '+IDL("MyTagsDelete")+'</a>';

	temp='';
	if(location.href.match('/photos')) {
		if (!location.href.match('id='))	temp=remixmid();
		else if (location.href.match(/\/photos(\d+)/))	temp=location.href.match(/\/photos(\d+)/)[1];
		else if (location.href.match(/gid=(\d+)/))	temp='-'+location.href.match(/gid=(\d+)/)[1];
		else if (location.href.match(/id=(\d+)/))	temp=location.href.match(/id=(\d+)/)[1];
		
	}
  else if (location.href.match('/albums')) temp = location.href.match(/\/albums(\d+)/)[1];
  else if (location.href.match(/\/album([\-0-9]+)/)) location.href.match(/\/album([\-0-9]+)/)[1];
	else if(ge('id').value.match(/([\-0-9]+)/))	temp=ge('id').value.match(/([\-0-9]+)/)[1];
	if (temp.length>0 && vkbrowser.opera) pageMenu+='<a onclick="idslideshow(\'start\',0,\''+temp+'\')">- '+vk_lang['mSlideShow']+'</a>';

return pageMenu;
} else {
// functions
if (location.href.split('act=add')[1]){
  IDPicLoad();
  //vkInitFakePhoto(); 
  vkInitPhotoZLdr();
}
	
if (location.href.match('photos.php.act=comments'))
  DubPagesToBottom();	
	
if (location.href.split('act=show')[1] || (location.href.match('/photo') && location.href.match('_'))) {
	if (getSet(7)  == 'y') IDNamesInColsP();
	if (getSet(14) == 'y') IDPhotoSelect();
	if (getSet(49) == 'y') AddBigPhotoArrow();
	vkScrollPhotos();
	vkQuickPreviews(0,true);
	vkAddShowPhotoLinkBtn();
	vkLoadAlbum();
	}
if (location.href.match('act=album') || location.href.match(/\/album-?\d+/)){
    if (getSet(38) != 'n' && getSet(38) != 0) vk100Photos();
  vkAddShowAllPhotoLinks();  
} 
  vkAddAlbumCommLinks();
//IDPhotoSelect_grs();
//idslideshow('start');
}
}

///////////////////
// KiberInfinity //
//   add-on's    //
///////////////////
function vkLoadImage(url, callback,fulllink) { //callback(url,width,heigth)
    temp_img = new Image();
    temp_img.src = url;
    var wait = function() {
        if ((temp_img.width != 0) && (temp_img.height != 0)) {
            callback(url, temp_img.width, temp_img.height,fulllink);
        } else {
            setTimeout(wait, 20);
        }
    }
    wait();
}

function vkShowPreview(url,width,height,FullLink){
  //alert(FullLink);
  if (!window.vkPreviewBox) vkPreviewBox = new MessageBox({title: IDL('Preview'),closeButton:true, width:"auto"});
  vkPreviewBox.setOptions({fullPageLink: (FullLink?FullLink:'')});
  vkHidePreview=function(){
    vkPreviewBox.hide();
    vkPreviewBox.content("");
  }
  vkPreviewBox.removeButtons();
  vkPreviewBox.addButton({
    onClick: function(){ vkPreviewBox.hide(200); },
    style:'button_no',label:IDL('Cancel')});
  vkPreviewBox.setOptions({onHide: vkHidePreview});
  vkPreviewBox.content('<img src="'+url+'" style="cursor:hand;" onclick="vkHidePreview();" height="'+height+'px">').show();
  return false;
}



function SL_ModPhotosLink(node) { //init in vk_altpofile: vkModLink();
    var hr = node.href;
    var html = node.innerHTML;
    if (hr && (hr.match(/photo-?\d+_\d+/) || hr.match(/photos.php.+act=show.+id=-?\d+_\d+/)) && html.match(/<img/i) && !html.match(/zoomphotobtn/) && !node.getAttribute("onclick")) {
       //vklog("link");
        var img = node.getElementsByTagName("IMG")[0];
        if (img.src.match(/\/images\/upload\.gif/)) return;
        var div = document.createElement('div');
        var outer = document.createElement('div');
        outer.className= "zoomouter";
        div.className = "zoomphotobtn";
        div.setAttribute("onclick", "vkPreviewPhoto('"+hr+"'); return false;");
        outer.appendChild(div);
        outer.appendChild(img);
        node.appendChild(outer); //insertBefore(div,node.firstChild);
    }
}

function vkPreviewPhoto(link){
  var url=link.match(/photo-?\d+_\d+/) || link.match(/photos.php.+act=show.+id=-?\d+_\d+/);
  if (url) url=url[0]; else vklog("wrong photo url:"+url);
  if (!window.vkPhotosLinkCache) vkPhotosLinkCache={};
  var ExtendCache=function(t){
    var arr=t.match(/ph=(\[\[.+\]\]);/);
    if (!arr) {alert('Photo not found');vkPreviewBox.hide(); vklog('failmake vkPhotosLinkCache',1); return;}
    arr=eval(arr[1]);
    for (var i=0;i<arr.length;i++)  vkPhotosLinkCache['photo'+arr[i][0]]=arr[i];
  };
  if (!window.vkPreviewBox) vkPreviewBox = new MessageBox({title: IDL('Preview'),fullPageLink: (link?link:''), closeButton:true,width:"auto"});
  vkPreviewBox.setOptions({fullPageLink: (link?link:'')});
  //vkPreviewBox.setOptions({title: 'qweqwe'});
  vkPreviewBox.content('<div class="box_loader" style="width:250px;"></div>').show();
  if (!vkPhotosLinkCache[url]){
      AjGet(url,function(r,t){
        ExtendCache(t);
        var img=t.match(/src="(http.+cs.+x_.+.jpg)"/)[1];
        vkLoadImage(img,vkShowPreview,link);
      });
  } else {
      vklog(url+ 'from vkPhotosLinkCache',3);
      vkLoadImage(vkPhotosLinkCache[url][2],vkShowPreview,link);
  }
}

function vkSetMouseScroll(el,next,back){
 addEvent(ge(el),'mousewheel DOMMouseScroll',function(e){//
      e = e ? e : window.event; 
      var wheelElem = e.target ? e.target : e.srcElement; 
      var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40; 
      if (Math.abs(wheelData)>100) { wheelData=Math.round(wheelData/100); }
      if (wheelData<0) next(); else back();
      return cancelEvent(e);
 });
}

function vkScrollPhotos(){
 if (getSet(78)=='n') return;
 vkSetMouseScroll(ge('photoarea'), nextPhoto, prevPhoto);
}

function DubPagesToBottom(){
var mainNode = ge('wall');
var numcon = document.createElement('div');
numcon.className='summaryBar';
numcon.innerHTML = geByClass('summaryBar')[0].innerHTML;
mainNode.parentNode.insertBefore(numcon, mainNode.nextSibling);
}

var vkPhotosList=false;
function vkLoadAlbum(aid,oid){
  if (!window.start_photo) return;
  if (location.href.match(/act=show&id=.+&uid=/)) return;
  var aoid=start_photo.split('_');
  var hm=ge('header').innerHTML.match(/album-?\d+_(\d+)/);
  aid=(aid)?aid:(ge('aid')?ge('aid').value:(hm?hm[1]:0));
  if (location.href.match(/act=show&id=/)) aid=0;
  oid=(oid)?oid:aoid[0];
  
  AjGet('photos.php?act=a_album&oid='+oid+(aid?'&aid='+aid:''),function(r,t){
     vkPhotosList=eval('('+t+')');
     vkPhotosMakeLink();
     vkQuickPreviews(0,true);
    
  });
}


function vkAddShowAllPhotoLinks(){
  geByClass('summary')[0].innerHTML+='<span class="divider">|</span><a class="notbold" href="#" onclick="show(\'vkPLinks\'); vkLoadPhotosLinks(); return false;">'+IDL('Links')+'</a>';
  var node=ge("album");
  var div=document.createElement('div');
  div.setAttribute("style","padding:10px; padding-left:50px; display:none;");
  div.id="vkPLinks";
  div.innerHTML='<div id="vkPhotosLinks"><div class="box_loader"></div></div><br><br><center><a href=# onclick="hide(\'vkPLinks\');">[ HIDE ]</a></center>';
  node.parentNode.insertBefore(div,node);
}

function vkLoadPhotosLinks(){
  aoid=location.href.match(/album(-?\d+)_(\d+)/i);
  aid=aoid[2];
  oid=aoid[1];
  var MakeLinksList=function(){
    var parr=[]; 
    var phot=(vkPhotosList)?vkPhotosList:ph;
    for (var i=0;i<phot.length;i++)
      parr.push('<a href="'+phot[i][phot[i].length-1]+'">'+phot[i][phot[i].length-1]+'</a>');
    return parr;
  }
  
  AjGet('photos.php?act=a_album&oid='+oid+'&aid='+aid,function(r,t){
     vkPhotosList=eval('('+t+')');
     ge('vkPhotosLinks').innerHTML=MakeLinksList().join('<br>');
  });
}


function vk100Photos(page){
  var cfg=parseInt(getSet(38));
  if (!cfg) cfg=0;
  if (!page) page=0;
  var COL_COUNT=4;
  var PHOTOS_ON_PAGE=100;
  
  switch (cfg){
    case 0: return;
    case 1: PHOTOS_ON_PAGE=40; break;
    case 2: PHOTOS_ON_PAGE=60; break;
    case 3: PHOTOS_ON_PAGE=80; break;
    case 4: PHOTOS_ON_PAGE=100; break;
    case 5: PHOTOS_ON_PAGE=260; break;
    case 6: PHOTOS_ON_PAGE=510; break;
  }
  
  var params=location.href.match(/album(-?\d+)_(\d+)/i);
  if (!params) params=location.href.match(/act=albums&oid=(-?\d+)/);
  if (!params)return;
  var oid=params[1];
  var aid=params[2];
  if (aid==0) return;
  var MakeTable=function(){
     var from=PHOTOS_ON_PAGE*page;
     var to=Math.min(PHOTOS_ON_PAGE*(page+1),vkPhotosList.length);
     var page_count=Math.ceil(vkPhotosList.length/PHOTOS_ON_PAGE)-1;
     var html='<table border="0" cellspacing="0">';
     for (var i=from; i<to;i++){
          var href=aid?'/photo'+vkPhotosList[i][0]:'/photos.php?oid='+oid+'&act=show&id='+vkPhotosList[i][0];
          html += ((i == 0 || i % COL_COUNT == 0) ? '<tr>' : '') + 
                  '<td><a href="'+href+'"><img src="'+vkPhotosList[i][2]+'" style="max-width: 130px"></a></td>'+
                  ((i > 0 && (i + 1) % COL_COUNT == 0) ? '</tr>' : '');
     }      
     html+='</table>';
     ge('album').innerHTML=html;  
     
     var nodes=geByClass('pageList');
     for (var i=0;i<nodes.length;i++){
      nodes[i].innerHTML=vkMakePageList(page,page_count,'#',"return vk100Photos(%%)",false,true)
     }
     vkModLink(ge('album'));
  };
  if (vkPhotosList){ 
    MakeTable();
  } else {
   // alert();
    AjGet('photos.php?act=a_album&oid='+oid+(aid?'&aid='+aid:""),function(r,t){
      // alert();
       if (!t){
          var url=ge('album').innerHTML.match(/\/photo-?\d+_\d+/);
          AjGet(url,function(r,t){
            var pharr=t.match(/ph=(\[\[.+\]\]);/i);
            if (pharr) pharr=pharr[1]; else return;
            vkPhotosList=eval('('+pharr+')');
            MakeTable(); 
          });
       } else {
         vkPhotosList=eval('('+t+')');     
         MakeTable();
       }
    });
  }
  return false;
}

function vkQuickPreviews(page,init){
  var cfg=parseInt(getSet(77));
  if (!cfg || cfg=='n') return true;
  
  if (!page) page=0;
  var COL_COUNT=4;
  var PHOTOS_ON_PAGE=8;
  if (init && !ge('vkQuickPreview')){
    vkaddcss('\
      #vkQuickPreview{position:relative; z-index:10;}\
      #vkQPcontent{display:none; _position:absolute; \
                   width:625px; overflow:hidden; \
                   background:#F9F9F9; margin-top:1px; \
                   border: solid 1px #CCD3DA; border-radius:10px;}\
      #vkQPalbum{border-bottom:1px solid #CCC; border-top:1px solid #CCC; padding:5px;}\
      #vkQPalbum .thumbs DIV{vertical-align:middle;width: 140px; \
                  border: 1px solid #DDD; display:inline-block; \
                  max-height:130px; overflow:hidden;\
                  margin:8px 2px 0; text-align: center; padding:3px;} \
     #vkQPalbum .sthumbs DIV{vertical-align:middle;width: 90px; \
                  border: 1px solid #DDD; border-radius:5px; display:inline-block; \
                  max-height:80px; overflow:hidden;\
                  margin:8px 2px 0; text-align: center; padding:3px;} \
      #vkQPalbum .sthumbs IMG{max-width:75px; max-height:75px;}\
      #vkQPalbum DIV .current{background:#e9e9e9; border-color:#A88;}  \
      #vkQPtop,#vkQPbottom{height:20px;}\
      #vkQuickPreview .btn a {display: block;  clear: both;    padding: 3px; border: solid 1px #CCD3DA; border-top:0px; text-align:center;}\
      #vkQuickPreview .btn a:hover { text-decoration: none;   background-color: #DAE1E8;}\
    ');
    
    showQPcontent=function(i){
      slideUp((i)?'vkQPcontent':'vkPQBtn',300)
      slideDown((i)?'vkPQBtn':'vkQPcontent', 300);
    }
    var div=document.createElement('div');
    div.id='vkQuickPreview';
    div.innerHTML='\
              <div class="btn" id="vkPQBtn"><a href="#"  onclick="showQPcontent(); return false">'+IDL('ToggleQuickPreviews')+'</a></div>\
              <div id="vkQPcontent">\
                <div id="vkQPtop" class="summaryBar"></div>\
                <div id="vkQPalbum"></div>\
                <div id="vkQPbottom" class="footerBar"></div>\
              </div>\
              ';
    var node=(cfg==1)?ge('photoborder'):ge('photocaptionleft').parentNode;
    node.parentNode.insertBefore(div,node);
    
    
    Inject2Func("gotPhotoInfo","vkQPSwitch();",true);/*AjInj*/
  	if (!window.switchToFast && window.start_photo){
     ajaxHistory.prepare("photo", { url:'photos.php',done: gotPhotoInfo,	fail: failedPhotoInfo, 	before: showPhoto,
  		show: {	to: function(p) { return p.photo },	from: function(p) { return {act: 'photo_info', photo: p, uid: window.watched_uid }}},
	   	def: { act:'photo_info', photo: start_photo, uid: window.watched_uid }
     });
    }
     
  } else if(init){
      //nav to page
  }
  
  vkQPGotPhoto=function(id){
    getPhotoInfo(id);
    vkQPSwitch(id);
  }
  vkQPSwitch=function(id){
    if (!id) id=this_id;
    var nodes=geByClass('current',ge('vkQPalbum'));
    if (nodes[0]) nodes[0].className='';
    var cp=Math.ceil(id/PHOTOS_ON_PAGE)-1;
    if (page!=cp) vkQuickPreviews(cp);
    ge('vkqphoto'+id).className='current';
    //nextPhoto prevPhoto
  }
  var SMALL=true;
  COL_COUNT=(SMALL)?6:4;
  IMG_IDX=(SMALL)?1:2;
  if (!vkPhotosList)IMG_IDX=1;
  PHOTOS_ON_PAGE=(SMALL)?18:8;
  var photos=(vkPhotosList)?vkPhotosList:ph; /**/
  if (init) page=Math.ceil(this_id/PHOTOS_ON_PAGE)-1;
  
  var hlink='<a href="#" onclick="showQPcontent(true); return false;">&uarr;&darr; '+IDL('Hide')+'</a>';
  var MakeTable=function(){
     var from=PHOTOS_ON_PAGE*page;
     var to=Math.min(PHOTOS_ON_PAGE*(page+1),photos.length);
     var page_count=Math.ceil(photos.length/PHOTOS_ON_PAGE)-1;
     var html='';
     for (var i=from; i<to;i++){
          html += ((i == 0 || i % COL_COUNT == 0) ? '<div class="'+((SMALL)?'sthumbs':'thumbs')+'">' : '') + 
                  '<div '+(i==(this_id-1)?'class="current"':'')+' id="vkqphoto'+(i+1)+'"><a href="/photo'+photos[i][0]+'" onclick="vkQPGotPhoto('+(i+1)+'); return false;"><img src="'+photos[i][IMG_IDX]+'" style="max-width: 75px"></a></div>'+
                  ((i > 0 && (i + 1) % COL_COUNT == 0) ? '</div>' : '');
     }    
     html+='';
     ge('vkQPalbum').innerHTML=html;  
     
     var nodes=ge("vkQPtop","vkQPbottom");
     for (var i=0;i<nodes.length;i++){
      //alert(vkMakePageList(page,page_count,'#',"return vkQuickPreviews(%%)"));
      nodes[i].innerHTML=hlink+vkMakePageList(page,page_count,'#',"return vkQuickPreviews(%%)")
     }
  };  
  MakeTable();      
  if (!init) return false;
}

function vkPhotosMakeLink(){
var obj= ge('photoactions');
if (vkPhotosList)
  for (var i=0;i<vkPhotosList.length;i++)
   if (vkPhotosList[i][0]==cur_photo){
    if (vkPhotosList[i].length>4)
      for (var k=4;k<vkPhotosList[i].length;k++){
        //alert(vkPhotosList[i][k]);
        //var obj= ge('photoactions');
        obj.innerHTML+='<a href="'+vkPhotosList[i][k]+'">[ '+IDL('PhotoHD')+' '+(k-3)+' ]</a>';
      }
    break;
   } 
}

function vkAddAlbumCommLinks(){
 nodes=geByClass("aname");
 for(var i=0;i<nodes.length;i++){
  var aid=nodes[i].innerHTML.match(/album(.+)_(\d+)/i);
  var uid=aid[1];
  aid=aid[2];
  var link="<a href=\"photos.php?act=comments&aid="+aid+"&oid="+uid+"\">["+IDL('komm')+"]</a>"
  var elem=nodes[i].parentNode;
  elem.innerHTML+=(elem.innerHTML.match("divider"))?"<span class='divider'>|</span>"+link:link;
 }
}

function PrewNextLinkPhoto(lp){
var prev_node=ge('prevp');
var next_node=ge('nextp');
var rlink = next_node.getAttribute('onclick'); 
var llink = prev_node.getAttribute('onclick');

//if (prev_node.href.match("#")) {llink="prevPhoto();return false;"} else llink="document.location.href='"+prev_node.href+"'";
//if (next_node.href.match("#")) {rlink="nextPhoto();return false;"} else rlink="document.location.href='"+next_node.href+"'";
return lp==0?llink:rlink;

}


function AddBigPhotoArrow(){
  var node=ge('photoareaouter');
  if(node){
    var nh=30;
    var arrp_style=
    ".arr,.arr_l        { height: "+nh+"px; line-height:"+nh+"px; border: 1px solid #d0d7e2; color: #d0d7e2;font-size: 30px; vertical-align: middle; text-align: center;cursor: pointer;font-family: Arial;background-color: #ffffff;}"+
    ".arr_on, .arr_l_on { height: "+nh+"px; line-height:"+nh+"px;  color: #ffffff;font-size: 30px; vertical-align: middle; text-align: center;cursor: pointer;font-family: Arial;background-color: #3b567f;}"+
    ".arr_l   {margin-left:-32px}"+
    ".arr_l_on{margin-left:-32px}";
    vkaddcss(arrp_style);
    var toleft= '<td width=50% valign=middle id="updates_activity_right" class="arr_l" onclick="'+PrewNextLinkPhoto(0)+'" onmouseover="this.className=\'arr_l_on\'" onmouseout="this.className=\'arr_l\'">&#9668;</td>';
    var toright='<td width=50% valign=middle id="updates_activity_right" class="arr" onclick="'+PrewNextLinkPhoto(1)+'" onmouseover="this.className=\'arr_on\'" onmouseout="this.className=\'arr\'">&#9658;</td>'
    
    var div1=document.createElement("div");
    div1.id="photos_arrows";
    div1.innerHTML='<center><table width=100% border="0" valign=middle cellpadding="0" cellspacing="0">'+
                  '<tr>'+toleft+toright+'</tr>'+
                  '</table></center>';
    var div2=div1.cloneNode(true);
    node.parentNode.insertBefore(div1,node);
    node.parentNode.insertBefore(div2,node.nextSibling);
  }
}

/* Show All Photos Link (sample for Download Master)*/
function vkAddShowPhotoLinkBtn(){  geByClass("summary")[0].innerHTML+='<span class="divider">|</span><a class="notbold" href="#" onclick="vkShowAllPhotoLinks();">'+IDL('PhotoLinks')+'</a>';}
function vkShowAllPhotoLinks(){
  show("photomsgwrap");
  ge("photomsgwrap").innerHTML='<div style="padding:10px; padding-left:50px;">'+vkGetPhotosLinks().join('<br>')+
                               '<br><br><center><a href=# onclick="hide(\'photomsgwrap\');">[ HIDE ]</a></center></div>';
}
function vkGetPhotosLinks(){
  var parr=[]; 
  var phot=(vkPhotosList)?vkPhotosList:ph;
  for (var i=0;i<phot.length;i++)
    parr[parr.length]=phot[i][phot[i].length-1];
  return parr;
}
/* End of Show All Photos Link*/
function vkInitFakePhoto(){
var upUrl=ge('content').innerHTML.match(/'upload_url'..'(.+)',/i); 
upUrl=unescape(upUrl[1]).replace('flash','java');
ge('bigForm').innerHTML=
'<div id="fphoto"><ol id="nav"><li><center><a href="#" onclick="javascript:hide(\'normal_upload\'); hide(\'flash_upload\'); hide(\'fphoto\');show(\'fake_upload\');">'+IDL('LoadFakePhoto')+'</a></center></li></ol></div>'+
'<div id="fake_upload" style="display:none"><div style="width:450px; text-align:center; margin:0px auto"><form id="fakeupload" name="upload" action="'+
upUrl+'" method="POST" enctype="multipart/form-data"><table class="formTable" border="0" cellspacing="0"><tbody><tr class="tallRow"><td class="label" style="text-align:right">'+
IDL('UpPhoto')+'</td><td>'+
              '<span class="label">'+IDL('UpPhoto1')+'</span><br>'+
              '<input type="file" class="upload" size="22" id="file1" name="Thumbnail1_0">'+
              '<br><span class="label">'+IDL('UpPhoto2')+'</span><br>'+
              '<input type="file" class="upload" size="22" id="file2" name="Thumbnail2_0">'+
              '<br><span class="label">'+IDL('UpPhoto3')+'</span><br>'+
              '<input type="file" class="upload" size="22" id="file3" name="Thumbnail3_0">'+
              '<br><span class="label">'+IDL('UpPhoto4')+'</span><br>'+
              '<input type="file" class="upload" size="22" id="file4" name="Thumbnail4_0">'+
              '<br><span class="label">'+IDL('UpPhoto5')+'</span><br>'+
              '<input type="file" class="upload" size="22" id="file5" name="Thumbnail5_0">'+
'</td></tr><tr><td></td><td><div style="height:30px"><ul class="nNav"><li style="margin-left:0px"><b class="nc"><b class="nc1"><b></b></b><b class="nc2"><b></b></b></b><span class="ncc"><a href="'+
"javascript:this.disabled=true; hide('bigForm'); hide('bigTabs'); showText('uploading', 2); document.getElementById('fakeupload').submit();"+'">'+
IDL('UploadPhoto')+
'</a></span><b class="nc"><b class="nc2"><b></b></b><b class="nc1"><b></b></b></b></li></ul></div></td></tr></tbody></table></form></div></div>'+ge('bigForm').innerHTML;
}
////////////////////
//  End KI addon  //
////////////////////
function IDPicLoad() {
if (!ge('file3')) return;
	var el=ge('file3');
	var div=document.createElement('input');
	div.type="file";
	div.className="upload";
	div.size="22";
	div.id="file4";
  div.name="file4";
  el.parentNode.appendChild(div);
  div=div.cloneNode(true); div.id="file5";  div.name="file5";
  el.parentNode.appendChild(div);
  div=div.cloneNode(true); div.id="file6";  div.name="file6";
  el.parentNode.appendChild(div);
}

function IDNamesInColsP() {
/* spisok ludey na photo v stolbik */
vkaddcss("#phototags span{display:inline-block; clear:both;}");
}

function IDPhotoSelect() {
if (ge('photoactions') && ge('photoactions').innerHTML.match(/beginTagging/i)) {//(mid == mpid)
 var maxptag=((typeof maxTagCount!='undefined') && (maxTagCount>0))?'  <small>max:'+maxTagCount+' </small>':'';          //
 document.getElementById("photoactions").innerHTML+='<a href=# onclick="IDPhotoSelect_tag(); return false;">'+IDL("selall")+maxptag+'</a>';
 if (document.getElementById('phototags'))
  if (document.getElementById('phototags').getElementsByTagName('span')[0]) document.getElementById("photoactions").innerHTML+='<a href=# onclick="javascript:IDPhotoSelect_del();">'+IDL("remall")+'</a>';
 document.getElementById("photoactions").innerHTML+='<div id="FGr"><a href=# onclick="javascript:vkSelectFriendsFromCats(\'FGr\',IDPhotoSelect_tag); return false;">'+IDL("selgrs")+'</a><div>';//IDPhotoSelect_grs();
 }
}

function IDPhotoSelect_del() {
var pid = document.getElementById('id').value;
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) {        alert('XMLHTTP Error'); return false; 	return http_request;     }
var listall=document.getElementById('phototags').getElementsByTagName('span');
var num = listall.length;
for (j= 0; j < num; j++) {
if (listall[j].innerHTML.match('removeTag')){
sid = listall[j].innerHTML.split('removeTag(')[1].split(',')[0];
curnow = j+1;
document.getElementById('photoactions').innerHTML='<h1>'+curnow+'/'+num+'</h1>';
http_request.open("POST", "/photos.php?act=put", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.setRequestHeader("Content-Transfer-Encoding", "binary");
http_request.send("tag_id="+sid+"&pid="+pid);
}}
if (http_request.responseText) new_side(http_request.responseText);
location.href=location.href.split('#')[0];
}

function IDPhotoSelect_tag(listnames) {
  var mid=vkgetCookie('remixmid');
  var pid = ge('id').value;
  var id  = pid.split('_')[0];
  var pactin=ge('photoactions').innerHTML  
  var list,listall,i=0;
  RunSel=function(){
  spisok='';
  //alert(num);
  var params;
  var FinishSel=function(){ge('photoactions').innerHTML=pactin; /*IDVideoDelSelect();*/ }
  var AddedTag=function(ajax, responseText) {
 				var new_tag_id = responseText.split('!')[0];
				responseText = responseText.substr(new_tag_id.length + 1);
				ge('phototags_wrap').innerHTML = '<div id="phototags">'+responseText+'</div>';
         
              if (i<num){
                text='';
                if (!listnames) {sid=listall[i].split('[')[1].split(',')[0];}  
                else sid=listall[i];
                  
                var curnow = i+1;
                ge('photoactions').innerHTML='<h1>'+curnow+'/'+num+'</h1><br><h2>'+sid+'</h2>';
                params = {'pid': pid, 'subject': sid, 'name': '%D0%AF', 'add': 1, 'x': '0', 'y': '0', 'x2': '100', 'y2': '100'};
                setTimeout(function(){Ajax.postWithCaptcha('/photos.php?act=put', params, options);},VK_SELECT_PHOTOSTAG_TIMEOUT);
                i++;
              } else {FinishSel();}
           }
  var options = {onSuccess: AddedTag, onFail: FinishSel, onCaptchaHide: function(success) { if (!success) FinishSel(); }};//
  AddedTag(null,""); } 
  
  if (!listnames) {
  AjGet("/friends.php",function(req){
    response = req.responseText;
    if (response.split('friendsData = ')[1].split('filter')[0]
     && response.split('friendsData = ')[1].split('filter')[0].split("'friends':[[")[1]) {
    response=response.split('friendsData = ')[1].split('filter')[0];
    list= '['+response.split('[[')[1].split(']],')[0]+'],';
    listall = list.split('],');
    num = listall.length-1; 
    } 
  RunSel();},true);} else {listall=listnames;num=listall.length; RunSel();}
}

function IDAllAlbums() {
pmode=0; st=0; tid=''; id='';
if (location.href.match('album') && location.href.match('to_id')) { pmode=4;  //obzor
 if (location.href.match('_')) id=location.href.split('/album')[1]; else alert('album id error');
 if (location.href.split('to_id=')[1]) tid=location.href.split('to_id=')[1]; else alert('to_id error');
 }
else if (location.href.match('act=albums')) { pmode=1;  //obzor
 if (location.href.match('&oid=')) id=location.href.split('oid=')[1]; else id='';
 }
else if (location.href.match('/albums')) { pmode=0;  //list of albums
 }
else if (location.href.match('act=album')) { pmode=2; //1album
 if (location.href.match('&id=')) id=location.href.split('&id=')[1]; else alert('album id error');
}
else if (location.href.match('/album')) { pmode=3; //1albumNew
 if (location.href.match('_')) id=location.href.split('/album')[1]; else alert('album id error');
}
//alert(pmode+' '+id);
if (location.href.match('&st=')) st=parseInt(location.href.split('st=')[1]);
else if (location.href.split('?st=')[1]) st=parseInt(location.href.split('st=')[1]);
else st=0;
var str=st/20;
if (id.split('?')[1]) id=id.split('?')[0]; if (id.split('&')[1]) id=id.split('&')[0];
if (tid.split('&')[1]) tid=tid.split('&')[0];

if (pmode>0) {
if (pmode!=4) all=parseFloat(geByClass('summary')[0].innerHTML.split(' ')[0]);
else {all=geByClass('pageList')[0].getElementsByTagName('a').length-1;
all=parseFloat(geByClass('pageList')[0].getElementsByTagName('a')[all].innerHTML)*20;
}
if (all < 20) all=0;
else all= Math.ceil(all/20);
for(a=0;b=geByClass('pageList')[a];a++){
links='';
 for (c=0;c<all/5;c++){
//alert(c*100+' '+st+' '+(c+1)*100);
links+=((st/100==c)?'<li class=\'current\'><a href=\'#\'>'+(c+1)+'</a></li>':'<li><a href=\''+
((pmode==1)?'photos.php?act=albums&oid='+id:((pmode==2)?'photos.php?act=album&id='+id:((pmode==4)?'/album'+id+'?to_id='+tid:'album'+id)))+((pmode==3)?'?st=':'&st=')+c*100+'\' >'+(c+1)+'</a></li>');
  }
b.innerHTML=links;
 }
IDAllAlbumsLoad(++str,20+st,id,pmode,all);
}
}
function IDAllAlbumsLoad(str,st,id,pmode,all) {
//alert(str+' '+st+' '+id+' '+pmode+' '+all);
if ((str<(st/20)+4) && (str<all)) {
var http_request = false;        http_request = new XMLHttpRequest();     if (http_request.overrideMimeType)        {                     }     if (!http_request) { alert('XMLHTTP Error'); return false; return http_request;}
if (pmode==1) http_request.open("GET", "/photos.php?act=albums"+(id ? '&oid='+id : '')+((st>0) ? '&st='+str*20 : ''), false);
if (pmode==2) http_request.open("GET", "/photos.php?act=album"+(id ? '&id='+id : '')+((st>0) ? '&st='+str*20 : ''), false);
if (pmode==3) http_request.open("GET", "/album"+id+((st>0) ? '?st='+str*20 : ''), false);
if (pmode==4) http_request.open("GET", "/album"+id+'?to_id='+tid+((st>0) ? '&st='+str*20 : ''), false);
http_request.send("");
response=http_request.responseText;
table='<br><hr><br><table border="0"'+response.split('table border="0"')[1].split('</table>')[0]+'</table>';
//alert(table);
ge('album').innerHTML+=table; str++;
setTimeout(function(){IDAllAlbumsLoad(str,st,id,pmode,all);},1200);
}
else {if (!ge('boxBody')) setTimeout('vkBox("clear")',2000); }
}

//javascript:IDAllAlbums();

function IDPhotoTagDelete() {
dellist=new Array();
if (ge('album') && ge('album').getElementsByTagName('td')[0]) {
for (deltags=0; deltags<ge('album').getElementsByTagName('td').length; deltags++)
{dellist[deltags]=ge('album').getElementsByTagName('td')[deltags].getElementsByTagName('a')[0].href;};
IDPhotoTagDelete_del(dellist,0);}else vkBox('there is no photos..');} function IDPhotoTagDelete_del(dellist,deltags) {
if (dellist[deltags]) {var http_request = false; http_request = new XMLHttpRequest();
if (http_request.overrideMimeType) { }
if (!http_request) { alert('errorXMLHTTP'); return false;return http_request; }
http_request.open("GET", dellist[deltags], false);
http_request.send("");
if (http_request.responseText.split('confirmTag('))remove=http_request.responseText.split('removeTag(')[1].split(',')[0];
var http_request = false; http_request = new XMLHttpRequest();
if (http_request.overrideMimeType) { }
if (!http_request) { alert('errorXMLHTTP'); return false;return http_request; }
http_request.open("POST", "/photos.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
http_request.send("act=put&pid="+dellist[deltags].match(/\d+_\d+/)+"&tag_id="+remove);
deltags++;
vkStatus('[ '+deltags+' / '+dellist.length+' ]');
setTimeout(function(){IDPhotoTagDelete_del(dellist,deltags)},1200);
}
else {vkStatus('');location.reload();}
}

function idslideshow(state,param,vkslid) {
switch (state) {
 case 'start':
if (!param) param=0;
param=parseInt(param);
	if (vkslid) vkoid=vkslid; else vkoid=remixmid();
	s=document.createElement('script');
	s.id='temp';
	if (param) { slnum=param; slfrom=200*param; slto=(1+param)*200; slback="vkphotoslides"+param+"=eval"
  } else { slnum=0; slfrom=0; slto=200; slback="vkphotoslides=eval"}
  doUAPIRequest("act=photos&from="+slfrom+"&to="+slto+"&id="+vkoid,function(r){
    vkphotoslides=r;
    if (param) eval('vkphotoslides=vkphotoslides.concat(vkphotoslides'+param+');setTimeout(function(){idslideshow(\'change\',0)},500);');
    else 	   {idslideshow("create");}
  });
	//s.src="http://userapi.com/data?act=photos&from="+slfrom+"&to="+slto+"&id="+vkoid+"&sid="+vkgetCookie('remixsid')+"&back="+slback;
	//if (param) s.onload='vkphotoslides=vkphotoslides.concat(vkphotoslides'+param+');setTimeout(function(){idslideshow(\'change\',0)},500);';
	//else 	   s.onload='idslideshow("create")';
	//document.getElementsByTagName('body')[0].appendChild(s);
	vkslidetime=10;
	vkslidenum=0;
	vkslidestate='stop';
	vkslideloading=1;
	vkalbumsloading=1;
	vkalbums=[];
	worktimeouts=[];
if(vkslideloading==0) idslideshow('loadalbums');
	break;
 case 'loadalbums':
	if (param) offset=param; else offset=0;
	var http_request = false; http_request = new XMLHttpRequest();if (http_request.overrideMimeType){}     if (!http_request) {alert('XMLHTTP Error'); return false;return http_request;}
	if (vkoid.split('')[0]=='-') http_request.open("GET", "/photos"+vkoid.split('-')[1]+(param?"&act=getpages&offset="+offset:''),false);
	else http_request.open("GET", "/photos.php?id="+vkoid+(param?"&act=getpages&offset="+offset:''),false);//+"", false);
	http_request.send("");
	response= http_request.responseText;
	if (!param) { stmax=response.split('class=\"summary\">')[1].split('<')[0].match(/(\d+)/)[1];
//	alert(stmax);
		stmax = parseFloat(stmax); stop=stmax;
		if (stmax < 20) stmax=0; 
		else stmax = Math.floor(stmax/50);
		}
	response= response.split("<div id=\"albums\"")[1].split("<!-- End pageBody -->")[0];
	var list= response.split("<div class=\"result clearFix\"");
	var num = list.length-1;
	for (j=0; j<num; j++) {
		id=list[j+1].split('class="aname"')[1].split("album")[1].split('"')[0];
		name=list[j+1].split('class="aname"')[1].split("\">")[1].split('</a>')[0];
		pnum=list[j+1].split('class="ainfo">')[1].split(' ')[0];
	vkalbums.push('['+id+','+name+','+pnum+']');
	}
	if (vkalbums.length >= stop) vkalbumsloading=0;
	setTimeout(function(){if (vkalbumsloading) {idslideshow('loadalbums',(offset+50))} else idslideshow('change',0)},1000);
	break;
 case 'create':
	albums=[];
        if (location.pathname.match('newsfeed') || vkphotoslides.length<(param+1)*200) vkslideloading=0;
	else setTimeout(idslideshow('start',1,vkoid),100);
	for(i in vkphotoslides) {albums[i]=vkphotoslides[i][2].split('/')[4];}
//	alert(vkphotoslides.join('\n'));
	s=document.createElement('div');
	fw = document.documentElement.clientWidth;
	fh = document.documentElement.clientHeight;
	sctop = document.documentElement.scrollTop;	
	s.id='vkslides';
	s.setAttribute("style","width: 750px !important; text-align: center; border: black 1px solid !important; height: auto; !important; background: black !important; display: block !important; position: absolute !important; z-index: 99 !important; background: white !important;");
	s.style.left = fw/2 - 400 + "px !important";
	s.style.top = fh/2 - 285 + sctop + "px !important";
 vkaddcss('.vkslidepreview {height: 105px !important; text-align: center !important;} .vkslidepreview img {padding-top: 10px; max-width: 90px !important; max-height: 90px !important;}'+
 ' .vkslidenow {padding: 2px !important; max-width: 100px !important; border: 4px solid gray !important;}'+
 ' .vkslideimg {min-height: 500px !important;} #vkslideimg {padding: 5px !important; margin: 5px; !important}'+
 ' #vkslidenum {width: 100%;}'+
 ' #vkslidecntrl {color: #bbb !important; width: 600px; padding: 2px !important; margin: 5px !important; border: 0px !important; text-align: center !important;"}'+
 ' #vkslidecntrl a {cursor: hand !important; color: #00F !important;}');
	document.getElementsByTagName('body')[0].appendChild(s);
 case 'timeout':
	if (param) clearTimeout(param);
	if (state=='timeout') {state='change'; param=1;}
 case 'go':
 case 'change':
	if(slnum*200 > vkphotoslides.length) vkslideloading=0;
	if (state=='change' && param==0) if (vkslideloading) setTimeout(function(){idslideshow('start',slnum+1,vkoid)},1000);
 case 'state':
 case 'time':
	clearTimeout(worktimeouts[vkslidenum]);
	if (state=='change')	vkslidenum+=parseInt(param);
	else if (state=='time') vkslidetime=param;
	else if (state=='go')	vkslidenum=param;
	else if (state=='state') vkslidestate=param;
	ge('vkslides').innerHTML=
'<div style="float: right !important; width: 120px; height: auto; text-align: center; vertical-align: middle;">'+
'<div align=right style="padding-top: 5px; padding-right: 20px;"><a onclick="idslideshow(\'close\')">[ X ]</a></div>'+
'<div class=vkslidepreview onclick="idslideshow(\'change\',-2)">'+(vkphotoslides[vkslidenum-2]?'<img src='+vkphotoslides[vkslidenum-2][1]+'>':"")+'</div>'+
'<div class=vkslidepreview onclick="idslideshow(\'change\',-1)">'+(vkphotoslides[vkslidenum-1]?'<img src='+vkphotoslides[vkslidenum-1][1]+'>':"")+'</div>'+
'<div class=vkslidepreview><img class=vkslidenow src='+vkphotoslides[vkslidenum][1]+'></div>'+
'<div class=vkslidepreview onclick="idslideshow(\'change\',1)">'+(vkphotoslides[vkslidenum+1]?'<img src='+vkphotoslides[vkslidenum+1][1]+'>':"")+'</div>'+
'<div class=vkslidepreview onclick="idslideshow(\'change\',2)">'+(vkphotoslides[vkslidenum+2]?'<img style="vertical-align: middle !important;" src='+vkphotoslides[vkslidenum+2][1]+'>':"")+'</div>'+
'</div>'+
'<div style="font-family: courier; font-size: -2; padding: 2px; margin: 4px;" id="vkslidenum">'+(vkslidenum+1)+' / '+vkphotoslides.length +(vkslideloading?'(wait)':'')+' --- time='+vkslidetime+' sec. --- state='+vkslidestate+'</div>'+
'<div id="vkslidecntrl">[&nbsp;'+
// home
(vkslidenum!=0?'<a onclick="idslideshow(\'go\',0)"> << HOME </a>':' << HOME ')+
'&nbsp;] [&nbsp;'+
((vkslidenum)>0?'<a onclick="idslideshow(\'change\',-1)"> < PREV </a>':' < PREV ')+
//'<a onclick="idslideshow(\'change\',-1)">  </a> '+
'&nbsp;] [&nbsp;'+
(vkslidestate=='stop'?'<a onclick="idslideshow(\'state\',\'work\')"> START </a> ':' <a onclick="idslideshow(\'state\',\'stop\')"> STOP </a> ')+
//'<a onclick="idslideshow(\'state\',\'work\');"> START </a> '+
'&nbsp;] [&nbsp;'+
((vkslidenum+1)<vkphotoslides.length?'<a onclick="idslideshow(\'change\',1)"> NEXT > </a>':' NEXT > ')+
'&nbsp;] [&nbsp;'+
((vkslidenum+1)!=vkphotoslides.length?'<a onclick="idslideshow(\'go\','+(vkphotoslides.length-1)+')"> END >> </a>':' END >> ')+
//'<a onclick="idslideshow(\'go\','+(vkphotoslides.length-1)+')"> END >> </a> '+
'&nbsp;] [ <select id=vktimes style="display: inline; border: 0px;">'+
'</select> ] </div><div class="vkslideimg"><a href="/photo'+vkphotoslides[vkslidenum][0]+'" target="_blank"><img id="vkslideimg"></a></div>';

for(z in tim=[1,2,3,4,5,10,15,20,30,50]) {
ge('vktimes').innerHTML+=
'<option '+(vkslidetime==tim[z]?'selected':'')+' onclick="idslideshow(\'time\','+tim[z]+')">-'+tim[z]+'-</option>';
}

/*''+(vkalbumsloading==0?'<div style="width: 100%; vertical-align: middle;" id="vkalbumsselect">'+
'<div style="width: 100%; font-size: 9px !important;">'+vkalbums[1]+'</div>'+
'<div style="font-weight: bold; width: 100%; font-size: -1 !important;">'+vkalbums[2]+'</div>'+
'<div style="width: 100%; font-size: 9px !important;">'+vkalbums[3]+'</div>'+
'</div>':'');*/
ge('vkslideimg').src=vkphotoslides[vkslidenum][2];
/*ge('vkalbumsselect').innerHTML='<select>';
for(z in vkalbums) ge('vkalbumsselect').innerHTML+='<option>'+vkalbums[z].split(',')[1]+' kolv='+vkalbums[z].split(',')[2]+'</option>';
ge('vkalbumsselect').innerHTML+='</select>';*/
 case 'slide':
	if (vkslidestate=='work') {
	if (ge('vkslideimg').complete) {
		if (vkslidenum+1==vkphotoslides.length)
			worktimeouts[vkslidenum]=setTimeout(function(){idslideshow('go',0)},vkslidetime*1000);
		else worktimeouts[vkslidenum]=setTimeout(function(){idslideshow('timeout',worktimeouts[vkslidenum])},vkslidetime*1000);
		}
	else worktimeouts[vkslidenum]=setTimeout(function(){idslideshow('slide')},200);
	}
	break;
 case 'close':
	var el=ge('vkslides');
	el.parentNode.removeChild(el);
	el=ge('temp');
	el.parentNode.removeChild(el);
}

}

/////////// GRAFFITY /////////////
function vkOnGetGraffitiSig(imgsig){ge('GrafSig').value=imgsig;}
function vkInitFakeGraffiti(){
  var upUrl=ge('content').innerHTML.match(/'postTo','(.+)'/i); 
  upUrl=unescape(upUrl[1]);
  /*alert(vkGetFakeGraffitiForm(upUrl));*/
  var bef=ge('content').firstChild;
  var div=document.createElement('div');
  div.innerHTML=vkGetFakeGraffitiForm(upUrl);
  ge('content').insertBefore(div,bef);
  //ge('content').innerHTML=vkGetFakeGraffitiForm(upUrl)+ge('content').innerHTML;
  
  
  vkMakeGrafSidGen();
}
var VKGSC_SWF_LINK='http://cs4287.vkontakte.ru/u13391307/4804adefa66494.zip';
function vkMakeGrafSidGen(){
  var so = new SWFObject(VKGSC_SWF_LINK,'player',"84","24",'10');
  so.addParam("allowscriptaccess", "always");
  so.addParam("preventhide", "1");
  so.addVariable('idl_browse', IDL('GrafSidCalc'));
  so.write('SigCalc');
}

function vkGraffUpForm(upUrl){
return '<form id="fakeupload" name="upload" action="'+
  upUrl+'" method="POST" enctype="multipart/form-data"><center>'+
  '<table class="formTable" border="0" cellspacing="0"><tbody><tr class="tallRow"><td class="label" style="text-align:right; vertical-align: top;">'+
  IDL('UpGraffiti')+'</td><td>'+
              '<span class="label">'+IDL('GraffitiFile')+'</span><br>'+
              '<input type="file" style="width:280px;" size="22" id="file2" name="Filedata">'+
              '<br><span class="label">'+IDL('GraffitiSignature')+'</span><br>'+
              '<div style="display:inline;"><INPUT type="text" size="32" name="Signature" id="GrafSig"></div><div id="SigCalc"  style="width:84px; display:inline; position:relative;top:7px;" ></div> <BR>'+
              
  '</td></tr><tr><td></td><td><div style="height:30px; margin-top:10px;"><center><ul class="nNav"><li style="margin-left:0px"><b class="nc"><b class="nc1"><b></b></b><b class="nc2"><b></b></b></b><span class="ncc"><a href="'+
  "javascript:this.disabled=true; document.getElementById('fakeupload').submit();"+'">'+
  IDL('UploadFraffiti')+
  '</a></span><b class="nc"><b class="nc2"><b></b></b><b class="nc1"><b></b></b></b></li></ul></center></div></td></tr></tbody></table></center></form>'+
  '<div style="margin_: 10px 20px; border:1px solid #b1bdd6; padding:5px; line-height: 15px; background-color:#f7f7f;"><small>'+
   IDL('GraffHelp')+ 
  '</small></div>';
}
function vkGetFakeGraffitiForm(upUrl){
return  '<div id="fgraff"><ol id="nav"><li><center><a href="#" onclick="hide(\'fgraff\'); show(\'fake_graffiti\'); hide(\'flash_player_container\'); return false;">'+IDL('LoadFakeGraffiti')+'</a></center></li></ol></div>'+
  '<div id="fake_graffiti" style="display:none"><div style="width:450px; text-align:center; margin:0px auto; padding:20px;">'+vkGraffUpForm(upUrl)+'</div></div>';

}

function vkShowFakeGraffLoader(mid){
  var Box = new MessageBox({title: IDL('LoadFakeGraffiti')});
  Box.removeButtons();
  Box.addButton({
    onClick: function(){ msgret=Box.hide(200);Box.content("") },
    style:'button_no',label:IDL('Cancel')});
  Box.content(vkGraffUpForm('/graffiti.php?'+((location.href.match(/club\d+/))?"group_id=":"to_id=")+mid)).show(); 
  //vk_MsgBox(vkGraffUpForm('/graffiti.php?to_id='+mid+'&group_id=0'),IDL('LoadFakeGraffiti'));
  vkMakeGrafSidGen();
}

function addFakeGraffItem() {
 /*if (wall_post_types.length && ge('mid')){
  var url = base_domain + 'graffiti.php?act=draw&'+((location.href.match(/club\d+/))?"group_id=":"to_id=")+ ge('mid').value;
  var std = wall_post_types.shift()
  wall_post_types.unshift(std,{
    url: url,
    icon: wall_icons,
    bgpos: [0, 0],
    label: IDL('LoadGraffiti'),
    onClick: function() { vkShowFakeGraffLoader(ge('mid').value);return false; }
  });
  }*/
  var AddGraffItem=function(bef){
    var mid=ge('mid')?ge('mid').value:(window.cur && window.cur.oid?cur.oid:0);
    if (bef && mid){
    vkAddScript('/js/lib/swfobject.js');
    var a=document.createElement('a');
    a.setAttribute("onfocus","this.blur()");
    a.setAttribute("id","vk_wall_post_type0");
    a.setAttribute("style","background-image: url(/images/icons/wall_icons.gif); background-position: 0px 0px;");
    a.setAttribute("href","/graffiti.php?act=draw&"+((location.href.match(/club\d+/))?"group_id=":"to_id=")+mid);
    a.setAttribute("onclick","vkShowFakeGraffLoader("+mid+");return false;");
    a.innerHTML=IDL('LoadGraffiti');
    bef.parentNode.insertBefore(a,bef.nextSibling);
    //alert(bef.parentNode.innerHTML);
    }   
  }
  
  if (ge('add_wall_media_link_status'))
    vkWaitForFunc("ge('add_wall_media_link_status_post_type0')",AddGraffItem);
  if (ge('add_wall_media_link'))  
    vkWaitForFunc("ge('add_wall_media_link_post_type0')",AddGraffItem);
  if (ge('page_add_media'))
    vkWaitForFunc("ge('add_media_type_1_0')",AddGraffItem); 
  
   

}
//vkInitFakeGraffiti();

var VKPZL_SWF_LINK="http://cs4989.vkontakte.ru/u13391307/3372bbc37d9b76.zip";//"http://cs4785.vkontakte.ru/u13391307/b494215f53bae0.zip";


function vkInitPhotoZLdr(){
ge('bigForm').innerHTML=
'<div id="fphotoz"><ol id="nav"><li><center>'+
'<a href="#" onclick="javascript:hide(\'normal_upload\'); hide(\'flash_upload\'); hide(\'fphoto\');hide(\'fphotoz\'); show(\'photoz_upload\'); vkPZ();">'+
IDL('LoadFakePhotoZ')+
'</a></center></li></ol></div>'+
'<div id="photoz_upload" style="display:none">'+
'</div>'+ge('bigForm').innerHTML;
attachScript(12,'/js/lib/swfobject.js');
}

function vkPZ(url){
  url=(url)?url:VKPZL_SWF_LINK;
  var div=document.createElement('div');
  div.id='vkpzl_flash';
  ge('photoz_upload').appendChild(div);
    var cont=ge('flash_upload').innerHTML
    var upload_url=cont.match(/'upload_url':.'(.+)',/)[1];//.replace('flash','java');
    var redirect_url=cont.match(/'redirect_url':.'(.+)',/)[1];//.replace('flash','java');
    
    var so = new SWFObject(url,'vkpzl_pl',"627","100",'10');
    so.addParam("allowscriptaccess", "always");
    so.addParam("preventhide", "1");
    so.addVariable('idl_browse', IDL('Browse'));
    so.addVariable('idl_upload', IDL('Upload'));
    so.addVariable('upload_url', upload_url);
    so.addVariable('redirect_url', redirect_url);
    so.write('vkpzl_flash');  
}

function vkOnFlashResize(new_height){ 
  var h=parseInt(new_height);
  if (h>0)  
  ge('vkpzl_pl').setAttribute("height",h+10);
}


///////////////////////////////////
//////// ADMIN FUNCTIONS //////////
function vkAdmAlbumInit(){
  vkAlbumAdmPanel();
  vkInj2PhotoFunc();
}

function vkAlbumAdmPanel(){
  var dloc=location.href;
  if (vk_c=vk_l\u0061\u006Eg_r\u0075['I\u004E\u0043D'].match(/vk[\u006F]pt\.n[\u0065]t/)){};
  if (!ge("vkAlbAdmPanel") && dloc.match(/album-?\d+_\d+/)){
    if (geByClass("summary")[0].innerHTML.match(/photos.php.act.edit&amp;id=\d+&amp;oid=-\d+/i))
    {
      var ref=ge("searchResults");
      var div=document.createElement('div');
      div.className="bar clearFix";
      div.id="vkAlbAdmPanel";
      div.setAttribute("style","border-bottom:1px solid #dae2e8; padding-bottom:2px; padding-left:10px;");
      div.innerHTML='<span class="divider">[</span>'+
                    '<a href="#" onclick="return vkAlbumCheckDublicatUser()">'+IDL('paCheckUnik')+'</a>'+
                    '<span class="divider">|</span>'+
                    '<a href="#" onclick="return vkGetPhotoByUserBox()">'+IDL('paGetPByUser')+'</a>'+
                    '<span class="divider">|</span>'+
                    '<a href="#" onclick="return vkOldPhotos()">'+IDL('paDelOld')+'</a>'+
                    '<span class="divider">]</span>'+
                    '<span class="divider htitle" style="float:right;font-size:10px;">[ ? ] <span class="hider">'+IDL('paDevSpecialFor')+'</span></span>'+
                    '<span id="vkphloader" style="display:none"><img src="/images/upload.gif"><span>';
      ref.parentNode.insertBefore(div,ref);
    }
  }
  if (dloc.match(/photo-\d+_\d+/)){
    var panel=ge("photoactions");
    if (panel){
      /*var a=document.createElement('a');
      a.href='#';
      a.setAttribute('onclick','vkOthersUserPhotosFromAlbum(); return false;');
      a.innerHTML=IDL('paAllUserPhotos')+'<span id="vkphloader" style="display:none"><img src="/images/upload.gif"></span>';*/
      panel.innerHTML+='<a href="#" onclick="vkOthersUserPhotosFromAlbum(); return false;">'+IDL('paAllUserPhotos')+'<span id="vkphloader" style="display:none"><img src="/images/upload.gif"></span></a>';
      if (ge('OthesUserPhoto')) ge('OthesUserPhoto').innerHTML="";
    }
  }
}
function vkInj2PhotoFunc(){
  if (!location.href.match(/photo-\d+_\d+/)) return;
    
    Inject2Func("gotPhotoInfo","vkAlbumAdmPanel();",true);

  	if (typeof switchToFast=='undefined' && typeof start_photo!="undefined"){
     ajaxHistory.prepare("photo", {
		  url:'photos.php',
  		done: gotPhotoInfo,
  		fail: failedPhotoInfo,
	   	before: showPhoto,
  		show: {
	   		to: function(p) { return p.photo },
		  	from: function(p) { return {act: 'photo_info', photo: p, uid: window.watched_uid }}
  		},
	   	def: { act:'photo_info', photo: start_photo, uid: window.watched_uid }
     });
   }
}
function vkOthersUserPhotosFromAlbum(){
  if (ge('photocomment')) hide('photocomment');
  if (ge('bottompages')) hide('bottompages');
  if (ge('photoaddcomment')) hide('photoaddcomment');
  if (ge('comment')) hide('comment'); 
  if (!ge('OthesUserPhoto')){
      var div=document.createElement("div");
      div.id="OthesUserPhoto";
      node=ge("photoinfo");
      node.parentNode.insertBefore(div, node.nextSibling);
  }
  var user=ge("author_in").innerHTML.match(/href="(.+)"/)[1];
  var oid=cur_photo.match(/(-?\d+)_(\d+)/)[1];
  vkGetPhotoByUser(user,oid,ge('aid').value,ge("OthesUserPhoto"));
}


function vkGetPhotoByUserBox() {
  var vkMsgBox = new MessageBox({title: IDL('paSearchUserPhotos'),width:"250px"});
  vkMsgBox.removeButtons();
  vkMsgBox.addButton({
    onClick: function(){ msgret=vkMsgBox.hide(200);  vkMsgBox.content('');},
    style:'button_no',label:IDL('Cancel')});
  var onQ=function(){ 
        var q=ge('byuserlink').value;
        if (trim(q)=='') {
         alert(IDL('paEnterUser'));
        } else {
          vkGetPhotoByUser(trim(q));
          vkMsgBox.hide(200); 
          vkMsgBox.content('');
        }
    };
  vkMsgBox.addButton({
    onClick: onQ,
    style:'button_yes',label:IDL('Search')});
  vkMsgBox.content(IDL('paEnterUserLink')+'<br><input type="text" style="width:200px" id="byuserlink"/>').show();
  ge('byuserlink').onkeydown=function(){if(event.keyCode==13){onQ()}};
  ge('byuserlink').focus();
  return false;
}

function vkOldPhotos(){
  var aoid=location.href.match(/album(-?\d+)_(\d+)/);
  var aid=aoid[2];
  var oid=aoid[1]; 
  vkHideListsPages();
  var photoSort=function (a, b){
    var p1=a[0].match(/_(\d+)/)[1];
    var p2=b[0].match(/_(\d+)/)[1];
    if(p1<p2) return -1;
    if(p1>p2) return 1;
    return 0;
  } 
  AjGet('photos.php?act=a_album&oid='+oid+'&aid='+aid,function(r,t){
    var list=eval('('+t+')');
    list=list.sort(photoSort);
    var html="";
    var photos_id=[];
    var count=parseInt(prompt(IDL('paDelCount')));
    if (count){
      for (var i=0;i<count;i++){
        html+='<td><div id="ph'+list[i][0]+'"><a href="/photo'+list[i][0]+'"><img src="'+list[i][2]+'" style="max-width: 130px"></a></div></td>'+/*((i % 5 == 0)?'<tr>':'')+*/
             (( (i+1) % 4 == 0)?'</tr><tr>':'');
        photos_id[photos_id.length]=list[i][0];
      }
      ge("searchResults").innerHTML=vkSubmDelPhotosBox(count,photos_id.join(','))+
                                    '<h4>'+IDL('paChkOldPhotos')+'</h4>'+
                                    '<div id="album"><table border="0" cellspacing="0"><tbody><tr>'+
                                    html+'</tr></tbody></table></div>'+
                                    '<br><br><h4>'+IDL('paIDCheckedPhotos')+'</h4><br>'+photos_id.join(', ');
    } else {
      alert(IDL('paNullCount'));
    }
    
  });
}

function vkSubmDelPhotosBox(count,photos_list,uid){
if (!uid) uid=0;
return '<div style="margin:10px auto;"><table id="dialog" border="0" cellspacing="0"><tbody><tr><td class="dialog" style="width:390px" id="DelPhotosDialog'+uid+'">'+
    '<h4>'+IDL('paDelPhotos')+'</h4>'+
    '<p>'+IDL('paSureDelPhoto').replace("{count}",count)+'</p>'+
    '<ul class="nNav"><li style="margin-left:0px"><b class="nc"><b class="nc1"><b></b></b><b class="nc2"><b></b></b></b><span class="ncc">'+
          '<a href="#" onclick="vkRunDelPhotosList(this.getAttribute(\'photos_ids\'),\''+uid+'\'); return false;" photos_ids="'+photos_list+'">'+IDL('phDel')+'</a>'+
    '</span><b class="nc"><b class="nc2"><b></b></b><b class="nc1"><b></b></b></b></li></ul>'+
'</td></tr></tbody></table><div id="shadowLine" style="width:412px"></div></div>';
}


function vkRunDelPhotosList(list,uid){
  var plist=list.split(',');
  ge("DelPhotosDialog"+uid).innerHTML="<h4>"+IDL('paDelStarted')+"</h4>";
  vkDeletePhotosList(plist,0,uid);
}
function vkDeletePhotosList(list,idx,uid){
  vkDelOnePhoto(list[idx],function(t){  
    if (idx<list.length){
      if (t!='FAIL') {
          //setTimeout(function(){fadeOut(ge('ph'+list[idx]))},500);
          fadeTo(ge('ph'+list[idx]), 100, 0.1, function(){
              ge('ph'+list[idx]).innerHTML=t;
              fadeTo(ge('ph'+list[idx]), 500, 1, function(){
                  setTimeout(function(){fadeOut(ge('ph'+list[idx]))},500);
              });
          });
      } else {
        ge('ph'+list[idx]).setAttribute("style","border:2px solid #A00;");
      }
      ge("DelPhotosDialog"+uid).innerHTML="<h4>"+IDL('paDelProc')+(idx+1)+"/"+list.length+"</h4>";
      setTimeout(function(){vkDeletePhotosList(list,idx+1,uid)},2000);
    } else { alert(IDL('paDelSuc'))}
  });
}

function vkDelOnePhoto(pid, callback) {
	var q = {act:'a_delete_photo', pid:pid, sure:1};
	Ajax.Post({url: 'photos.php', query:q, 
            onDone:function(res, text){ if (callback) callback(text);}, 
            onFail:function(res, text){ if (callback) callback('FAIL');}
  });
}

function vkHideListsPages(){
  var pages=geByClass("pageList");
  if (pages){hide(pages[0]); hide(pages[1]);}
}
function vkGetPhotoByUser(u,oid,aid,toel){
getUserID(u,function(userid){
  show("vkphloader");
  vkHideListsPages();
  var ResultElem=(toel)?toel: ge("searchResults");
  var aoid=location.href.match(/album(-?\d+)_(\d+)/);
  aid=(aid)?aid:aoid[2];
  oid=(oid)?oid:aoid[1];
  AjGet('photos.php?act=a_album&oid='+oid+'&aid='+aid,function(r,t){
    var list=eval('('+t+')');
    var uids={};
    var uid;
    ResultElem.innerHTML="<br>";
    for (var i=0; i<list.length; i++){
      uid=list[i][1].match(/u(\d+)/)[1];
      if (uids[uid]) {
        uids[uid].count++;
        uids[uid].ph[uids[uid].ph.length]=list[i];
      } else {
        uids[uid]={};
        uids[uid].count=1;
        uids[uid].ph=[list[i]];
      }
    }
    var uid_list=[];
     if (uids[userid]){
       var del_list=[];
       uid=userid;
       uid_list[uid_list.length]=uid;

       var html="";
       var html_="";
       
       html+='<table id="album">';
       for (var i=0;i<uids[uid].ph.length;i++){
         del_list.push(uids[uid].ph[i][0]);
         html+='<td><div id="ph'+uids[uid].ph[i][0]+'">'+
               '<input type="checkbox" class="vkphcheck" vkphoto="'+uids[uid].ph[i][0]+'" style="position:absolute;">'+
               '<a href="/photo'+uids[uid].ph[i][0]+'"><img src="'+uids[uid].ph[i][2]+'" style="max-width: 130px"></a>'+
               '</div></td>'+
               (( (i+1) % 4 == 0)?'</tr><tr>':'');
         html_+='<a href="/photo'+uids[uid].ph[i][0]+'">http://vkontakte.ru/photo'+uids[uid].ph[i][0]+'</a><br>';
       }
       html+='</table>';
       html='<div style="padding:0px; border:1px solid #808080;" id="searchResults"><b><u><span id="vkusername'+uid+'">Loading...</span></u></b> '+
                '<a id="ban'+uid+'" style="cursor: hand;" onClick="javascript:vkBanUser(\''+uid+'\',\''+oid.match(/\d+/)[0]+'\')">[ '+IDL('banit')+' ]</a>'+
                '<a id="delBtn'+uid+'" style="cursor: hand;" onClick="ge(\'vkDelUBox'+uid+'\').innerHTML=vkSubmDelPhotosBox('+del_list.length+',\''+del_list.join(',')+'\',\''+uid+'\'); return false;">'+IDL('paDelAllUserPhotos')+'</a>'+
                '<a id="delchecked" style="cursor: hand;" onClick="vkRunDelCheckedPhotosList(); return false;">'+IDL('paDelChecked')+'</a>'+
                ':<br>'+'<div id="vkDelUBox'+uid+'"></div>'+html;
       html+='<br><br></div>';
       html+='<div><a href="/id'+uid+'">http://vkontakte.ru/id'+uid+'</a> :<br>'+html_+'</div>'
       ResultElem.innerHTML+=html;
       
     }
     
      
    doAPIRequest("method=getProfiles&uids="+userid+"&fields=uid,first_name,last_name",function(r){
      hide("vkphloader");
      if (r.response && r.response.length){
       var us=r.response;
       for (var i=0;i<us.length;i++)
         ge('vkusername'+us[i].uid).innerHTML='<a href="/id'+us[i].uid+'">'+us[i].first_name+' '+us[i].last_name+'</a>';
      }
    });
  });  
  
});
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


function vkRunAllBanAndDelPhotos(el,gid){
  var ch=geByClass("vkphcheck");
  var list=[];
  for (var i=0;i<ch.length;i++){
    list.push(ch[i].getAttribute("vkphoto"));
  }
  var photos=[];
  for (var i=0;i<list.length;i++){
   photos.push(ge('ph'+list[i]).parentNode.innerHTML);
  }
    vkaddcss(".nocheckp input{display:none}");
    var html='<table id="album" class="nocheckp">';
    for (var i=0;i<photos.length;i++){
       html+='<td>'+photos[i]+'</td>'+(( (i+1) % 4 == 0)?'</tr><tr>':'');
    }
    html+='</table>';   
   
  var idss=ge("banallusers").getAttribute("id_list");
  if (idss){
    var ids=idss.split(',');
    var  users="";
    for (var i=0;i<ids.length;i++){
        users+=ge('vkusername'+ids[i]).innerHTML+'<br>';
    }
     ge("searchResults").innerHTML=vkSubmBanPhotosBox(ids.length,idss,0,gid,users)+
                                   vkSubmDelPhotosBox(list.length,list.join(','))+html;
  }
}


function vkRunDelCheckedPhotosList(){
  var ch=geByClass("vkphcheck");
  var list=[];
  for (var i=0;i<ch.length;i++){
    if (ch[i].checked) list.push(ch[i].getAttribute("vkphoto"));
  }
  //alert(list.join("\n"));
  var photos=[];
  for (var i=0;i<list.length;i++){
   photos.push(ge('ph'+list[i]).parentNode.innerHTML);
  }
  //alert(photos[0]);
    vkaddcss(".nocheckp input{display:none}");
    var html='<table id="album" class="nocheckp">';
    for (var i=0;i<photos.length;i++){
       html+='<td>'+photos[i]+'</td>'+(( (i+1) % 4 == 0)?'</tr><tr>':'');
    }
    html+='</table>';
    ge("searchResults").innerHTML=vkSubmDelPhotosBox(list.length,list.join(','))+html;
}


function vkSubmBanPhotosBox(count,user_list,uid,gid,users){
if (!uid) uid=0;
return '<div style="margin:10px auto;"><table id="dialog" border="0" cellspacing="0"><tbody><tr><td class="dialog" style="width:390px" id="BanDialog'+uid+'">'+
    '<h4>'+IDL('paBanUsers')+'</h4>'+
    '<p>'+IDL('paSureBanAll').replace("{count}",count)+"<br>"+users+"</p>"+
    '<ul class="nNav"><li style="margin-left:0px"><b class="nc"><b class="nc1"><b></b></b><b class="nc2"><b></b></b></b><span class="ncc">'+
          '<a href="#" onclick="vkBanUserList(this.getAttribute(\'user_list\'),\''+gid+'\',\'BanDialog'+uid+'\'); return false;" user_list="'+user_list+'">'+IDL('banit')+'</a>'+
    '</span><b class="nc"><b class="nc2"><b></b></b><b class="nc1"><b></b></b></b></li></ul>'+
'</td></tr></tbody></table><div id="shadowLine" style="width:412px"></div></div>';
}
function vkRunBanAll(el,gid){
  var idss=ge("banallusers").getAttribute("id_list");
  //alert(idss);
  if (idss){
    var ids=idss.split(',');
    var  users="";
    for (var i=0;i<ids.length;i++){
        users+=ge('vkusername'+ids[i]).innerHTML+'<br>';
    }
     ge("searchResults").innerHTML=vkSubmBanPhotosBox(ids.length,idss,0,gid,users);
     //users+'<div id="banProc"></div>';
    // vkBanUserList(idss,gid,ge("BanDialog0"),users);
  }
}
function vkBanUserList(users,gid,info_el){
  var idx=0;
  users=users.split(',');
  info_el=ge(info_el);
  var BanUser=function(id,gid,callback){
    info_el.innerHTML="<h4>"+IDL('paBanUsers')+": "+(idx+1)+"/"+users.length+"</h4>";
    AjGet("/groups_ajax.php?act=a_inv_by_link&b=1&page="+id+"&gid="+gid,function(req){
      req=req.responseText;
      req=req.replace('id="invForm"','class="invForm"');
      var hash = req.match(/"hash".value="(.+)"/i)[1];
      req=req.replace(hash,decodehash(hash));
      div = document.createElement('div');
      div.innerHTML=req;
      var form = geByClass('invForm', div)[0];
      var url="/groups_ajax.php?"+ajx2q(serializeForm(form));  
      AjGet(url,callback);
    }); 
  }
  var onDone=function(){
    if (idx<users.length){
      BanUser(users[idx],gid,onDone);
    } else {alert('Done');}
    idx++;
  }
  onDone();
}

function vkAlbumCheckDublicatUser(oid,aid){
  show("vkphloader");
  vkHideListsPages();
  var aoid=location.href.match(/album(-?\d+)_(\d+)/);
  aid=(aid)?aid:aoid[2];
  oid=(oid)?oid:aoid[1];
  var Allow_Count=prompt(IDL('EnterAllowPhotoCount'),'1');
  if (!Allow_Count) Allow_Count=1;
  AjGet('photos.php?act=a_album&oid='+oid+'&aid='+aid,function(r,t){
    var list=eval('('+t+')');
    var uids={};
    var uid;
    ge("searchResults").innerHTML='<br>'+
                                  '<a id="delchecked" style="cursor: hand;" onClick="vkRunDelCheckedPhotosList(); return false;">'+IDL('paDelChecked')+'</a>'+
                                  '<span class="divider">|</span>'+
                                  '<a style="cursor: hand;" onClick="vkDoCheck(1,\'vkphcheck\'); return false;">'+IDL('CheckAll')+'</a>'+
                                  '<span class="divider">|</span>'+
                                  '<a style="cursor: hand;" onClick="vkDoCheck(0,\'vkphcheck\'); return false;">'+IDL('UncheckAll')+'</a>'+
                                  '<span class="divider">|</span>'+
                                  '<a id="banallusers" style="cursor: hand;" onClick="vkRunBanAll(this,'+oid.match(/\d+/)[0]+'); return false;">'+IDL('paBanAll')+'</a>'+
                                  '<span class="divider">|</span>'+
                                  '<a id="bandelallusers" style="cursor: hand;" onClick="vkRunAllBanAndDelPhotos(this,'+oid.match(/\d+/)[0]+'); return false;">'+IDL('paBanAllAndDelPhotos')+'</a>'+
                                  '<br><br>';
                       
    for (var i=0; i<list.length; i++){
      uid=list[i][1].match(/u(\d+)/)[1];
      if (uids[uid]) {
        uids[uid].count++;
        uids[uid].ph[uids[uid].ph.length]=list[i];
      } else {
        uids[uid]={};
        uids[uid].count=1;
        uids[uid].ph=[list[i]];
      }
    }
    var uid_list=[];
    for (uid in uids)
     if (uids[uid].count>Allow_Count){
       uid_list[uid_list.length]=uid;
       var html="";
       
       var del_list=[];
       html+='<table id="album">';
       for (var i=0;i<uids[uid].ph.length;i++){
       del_list.push(uids[uid].ph[i][0]);
       html+='<td><div id="ph'+uids[uid].ph[i][0]+'">'+
             '<input type="checkbox" class="vkphcheck" vkphoto="'+uids[uid].ph[i][0]+'" style="position:absolute;">'+
             '<a href="/photo'+uids[uid].ph[i][0]+'"><img src="'+uids[uid].ph[i][2]+'" style="max-width: 130px"></a>'+
             '</div></td>'+
             (( (i+1) % 4 == 0)?'</tr><tr>':'');
       }
        html+='</table>';
        
        html='<div style="padding:0px; border:1px solid #808080;"><b><u><span style="padding:5px;" id="vkusername'+uid.replace(/^0+/,"")+'">Loading...</span></u></b>'+
             '<a id="ban'+uid+'" style="cursor: hand;" onClick="javascript:vkBanUser(\''+uid+'\',\''+oid.match(/\d+/)[0]+'\'); return false;">[ '+IDL('banit')+' ]</a>'+
             '<a id="delBtn'+uid+'" style="cursor: hand;" onClick="ge(\'vkDelUBox'+uid+'\').innerHTML=vkSubmDelPhotosBox('+del_list.length+',\''+del_list.join(',')+'\',\''+uid+'\'); return false;">'+IDL('paDelAllUserPhotos')+'</a>'+
             ':<br>'+
             '<div id="vkDelUBox'+uid+'"></div>'+html;//vkSubmDelPhotosBox(del_list.length,del_list.join(','));
        
       
       //for (var i=0;i<uids[uid].ph.length;i++){html+='<a href="/photo'+uids[uid].ph[i][0]+'"><img src="'+uids[uid].ph[i][2]+'"></a>  '; }
       html+='<br><br>';
       ge("searchResults").innerHTML+=html+'</div>';
     } 
    ge("banallusers").setAttribute("id_list",uid_list.join(','));
    doAPIRequest("method=getProfiles&uids="+uid_list.join(',')+"&fields=uid,first_name,last_name",function(r){
      hide("vkphloader");
      if (r.response && r.response.length){
       var us=r.response;
       for (var i=0;i<us.length;i++)
         ge('vkusername'+us[i].uid).innerHTML='<a href="/id'+us[i].uid+'">'+us[i].first_name+' '+us[i].last_name+'</a>';
      }
    });
  });
return false;
}
/*
(function(){
document.addEventListener('DOMContentLoaded',vkAdmAlbumInit, false);
})();*/
if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
