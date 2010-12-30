// ==UserScript==
// @description   Vkontakte Optimizer 1.6.5
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.




////////////////////////////////////////////////////////////////////////////
// remove duplicate. src from http://userscripts.org/scripts/review/49878 //
////////////////////////////////////////////////////////////////////////////
function isDuplicate(id, all) {

  var title = trim(document.getElementById("title"+id).textContent.toLowerCase());
  var artist = trim(document.getElementById("performer"+id).textContent.toLowerCase());
  var duration = document.getElementById("title"+id).parentNode.nextSibling.textContent;
  var str = document.getElementById("imgbutton"+id).getAttribute("onclick");
  var re = /operate\((\d+)[^0-9]+(\d+)[^0-9]+(\d+),[^0-9a-zA-Z]+([0-9a-zA-Z]+)/;
  var arr = re.exec(str);
  var track_id = arr[4];

  for (var i=0; i<all.length; i++)
  {
    var item = all[i];
    if ((trim(item.title.toLowerCase())==title && trim(item.artist.toLowerCase())==artist && item.duration==duration) || item.track_id==track_id) return true;
  }

  all.push({"artist":artist, "title":title, "duration":duration, "track_id":track_id});

  return false;
}



function removeDuplicates() {
  var allSongs = [];

  var parent = document.getElementById("audios");
  if (!parent) {
    parent = document.getElementById("bigResult");
  }
  if (!parent) {
    parent = document.getElementById("searchResults");
  }
  if(parent){
    var audios = parent.getElementsByTagName("div");
    re=/audio(\d+)/;
    var duplicates = [];
    for (var i=0;i<audios.length;i++) {
      var m = audios[i].id.match(re);
      if (!m) continue;
      var id = m[1];
      if (isDuplicate(id, allSongs)) {
        duplicates.push(id);
        continue;
      }
    }
    var duplicatesCount = 0;
    for(var i in duplicates){
      var audioDiv = document.getElementById("audio"+duplicates[i]);
      if(audioDiv){
        audioDiv.parentNode.removeChild(audioDiv);
        duplicatesCount++;
      }
    }
    var bigSummary = document.getElementById("bigSummary");

    if (bigSummary) {
      bigSummary.childNodes[1].innerHTML += IDL('aDubDel') + duplicatesCount + IDL('aDublic');
    }

    if (!bigSummary) bigSummary = document.getElementById("searchSummary");
    if (bigSummary && duplicatesCount>0) {
      bigSummary.innerHTML += IDL('aDubDel') + duplicatesCount + IDL('aDublic')+remDubflex(duplicatesCount)+'.';
    }
  }
}

function remDubflex(integ) {
 var r = integ % 10
  if (integ > 4 && integ < 20) {
  return decodeURI("%D0%BE%D0%B2");
 } else {
 switch (r) {
  case 1: return ''; break;
  case 2: return 'a'; break;
  case 3: return 'a'; break;
  case 4: return 'a'; break;
  default: return decodeURI('%D0%BE%D0%B2');
 }}
}

function trim(string) {
  return string.replace(/(^\s+)|(\s+$)/g, "");
}

function RemDuplMain(){
if (getSet(52) == 'y'){
var allowrem=false;
var node=ge('section');
if (node && node.value && node.value=='audio') allowrem=true;
//if(ge('audiosWrap')) allowrem=true;

if (allowrem) removeDuplicates();
}}

function VkoptAudio() {
  var smartlink=(getSet(65) == 'y')?true:false;
  var download=(getSet(0) == 'y')?1:0;
  var SearchLink=true;
  var trim=function(text) { return (text || "").replace(/^\s+|\s+$/g, ""); }
  InitAudiosMenu();
  var icon_src='data:image/gif;base64,R0lGODdhEAARALMAAF99nf///+7u7pqxxv///8nW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAEAARAAAEJpCUQaulRd5dJ/9gKI5hYJ7mh6LgGojsmJJ0PXq3JmaE4P9AICECADs=';
  var qreg=/'|"/g;
  var sreg=/\s*,\s*/;
 
  var makedownload=function(url,el){
    var table=document.createElement('table');
    table.className="vkaudio_down";
    var tr=document.createElement('tr');
    table.appendChild(tr);
    el.parentNode.appendChild(table);
    
    var td=document.createElement('td');
    tr.appendChild(td);  
    td.appendChild(el); 
    td=document.createElement('td');
    td.setAttribute('style',"vertical-align: top;");
    td.innerHTML='<a href="'+url+'"><img src="'+icon_src+'"></a>';
    tr.appendChild(td);  
    el.setAttribute('vk_ok','1');  
  }
  var imgs = document.getElementsByTagName('img');
  if (imgs){
    imgs=vkArr2Arr(imgs);
    for (var i=0; i<imgs.length; i++){
      var onclk=imgs[i].getAttribute('onclick');
      if (!onclk || imgs[i].hasAttribute('vk_ok')) continue;
      if (onclk.split('operate(')[1]){
        params = onclk.split('operate(')[1].split(')')[0];
        params = params.split(sreg);
        var aid = params[0].replace(qreg, "");
        if (params.length == 3) 
          var url=params[1].replace(qreg, "");
        else {
          var id = params[0];
          var user = params[2];
          var url='http://cs' + params[1] + '.vkontakte.ru/u' + (user.length<5?('00000'+user).substr(-5):user) + '/audio/' + params[3].replace(qreg, "") + '.mp3';
        } 
        if (smartlink) {url+='?/'+(ge('performer'+aid).innerText+'-'+ge('title'+aid).innerText)+'.mp3';};//normal name
        var el=ge('performer'+aid).parentNode.parentNode;
		    el=geByClass("duration",el)[0];
		    if (SearchLink && el){el.innerHTML="<a href='gsearch.php?section=audio&c[q]="+(ge('performer'+aid).innerText+'-'+ge('title'+aid).innerText)+"'>"+el.innerText+"</a>";}
        imgs[i].setAttribute('vk_ok','1');  
        if (download)  makedownload(url,imgs[i]); 
         
      }
    }
  }
  var divs = geByClass('play');
  for (var i=0; i<divs.length; i++){
     var onclk=divs[i].getAttribute('onclick');
     if (!onclk || divs[i].hasAttribute('vk_ok')) continue;
     if (onclk.match('playAudio')[0]){
         var id=divs[i].id.split('play')[1];
         var data = ge('audio_info' + id).value.split(',');
         var url=data[0];
		     el=geByClass("duration",ge('audio'+id))[0];
		     var name=el.parentNode.getElementsByTagName('b')[0].innerText+' - '+el.parentNode.getElementsByTagName('span')[0].innerText;
		     if (smartlink) {url+='?/'+name+'.mp3';};//normal name
		     if (SearchLink && el){el.innerHTML="<a href='gsearch.php?section=audio&c[q]="+name+"'>"+el.innerText+"</a>";}
         if (download){ 
            divs[i].setAttribute('style','width:17px;'); 
            makedownload(url,divs[i]);
         }    
      }  
  }  
}

function VkoptAudio_(vatemp) {
return;
var smartlink=(getSet(65) == 'y')?true:false;
var SearchLink=true;
var trim=function(text) { return (text || "").replace(/^\s+|\s+$/g, ""); }
InitAudiosMenu();
var icon_src='data:image/gif;base64,R0lGODdhEAARALMAAF99nf///+7u7pqxxv///8nW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAEAARAAAEJpCUQaulRd5dJ/9gKI5hYJ7mh6LgGojsmJJ0PXq3JmaE4P9AICECADs=';
if (!document.getElementById('vkopthidden') || vatemp) {
if (document.getElementsByTagName('img')) {
var imgs = document.getElementsByTagName('img');
if (vatemp && vatemp=='wall') imgs = document.getElementById('wall').getElementsByTagName('img');
var i=0;
	while (imgs[i]) { if (imgs[i].className.match('vkwllds')) {i++; continue;}
  if (imgs[i].getAttribute("onclick") && imgs[i].getAttribute("onclick").split('operate')[1]) {
	if (imgs[i].getAttribute("onclick").split('operate(')[1])
		params = imgs[i].getAttribute("onclick").split('operate(')[1].split(')')[0];
	if (imgs[i].getAttribute("onclick").split('operateWall(')[1])
		params = imgs[i].getAttribute("onclick").split('operateWall(')[1].split(')')[0];

		params = params.split(',');
		server = params[1];
		user = params[2]; while(user.length<5) user='0'+user;

		if (params.length==3) name=params[1];
		else name = params[3];
		name=name.substring(1, name.length - 1);
    name=name.replace("'","");
		imgs[i].parentNode.style.width='48px';
		//if (params.length>3) lnk='http://cs' + server + '.vkontakte.ru/u' + user + '/audio/' + name + '.mp3';	else lnk=name;
		if (params.length>3) lnk='http://cs' + trim(server) + '.vkontakte.ru/u' + trim(user) + '/audio/' + trim(name) + '.mp3';	else lnk=name;
    if(imgs[i].id && imgs[i].id.match(/imgbutton(\d+)/)){
      aid=imgs[i].id.match(/imgbutton(.+)/)[1];
		  if (smartlink) {lnk+='?/'+(ge('performer'+aid).innerText+'-'+ge('title'+aid).innerText)+'.mp3';};
		  var el=ge('performer'+aid).parentNode.parentNode;
		  el=geByClass("duration",el)[0];
		  if (SearchLink && el){el.innerHTML="<a href='gsearch.php?section=audio&c[q]="+(ge('performer'+aid).innerText+'-'+ge('title'+aid).innerText)+"'>"+el.innerText+"</a>";}
    }
    if (getSet(0) == 'y'){
    imgs[i].parentNode.innerHTML+=' <a href="'+lnk+'"><img src="'+icon_src+'"></a>';
    if (ge('wall')){imgs[i].parentNode.style.width='48px';}
		imgs[i].className+=' vkwllds';}
		if (!document.getElementById('vkopthidden') && !vatemp) imgs[i].parentNode.innerHTML+='<input type="hidden" id="vkopthidden" value="ok">';
		}
	i++;
	}
}
}
}
function vkGetLiricLink(aid){
    var perf=(ge('performer'+aid))?ge('performer'+aid):ge('performerWall'+aid);
    var titl=(ge('title' + aid ) )?ge('title' + aid  ):ge('titleWall'+aid);
  
    var title=titl.innerHTML.replace(/<[^>]+>/g,"");
    var artist=perf.innerHTML.replace(/<[^>]+>/g,"");
    return "http://www.lyricsplugin.com/wmplayer03/plugin/?artist="+encodeURIComponent(artist)+"&title="+encodeURIComponent(title);
}
function addLyric(id) {
    var img = document.getElementById("imgbutton"+id);
    var str = img.getAttribute("onclick");

    var tr=img.parentNode.parentNode;

    var title_a=tr.getElementsByTagName('td')[1].getElementsByTagName('b')[0].innerHTML;
    var title_t=tr.getElementsByTagName('td')[1].getElementsByTagName('span')[0].innerHTML;
    var songtitle = title_a+" - "+title_t;
    songtitle = trim(songtitle);

    var span = document.getElementById("title"+id);
    var title=span.innerHTML.replace(/<[^>]+>/g,"");
    var artb=document.getElementById("performer"+id);
    var artist=artb.innerHTML.replace(/<[^>]+>/g,"");
    var newdiv=document.createElement("div");
    var addon1=document.createElement("a");
    addon1.setAttribute("href","http://www.lyricsplugin.com/wmplayer03/plugin/?artist="+encodeURIComponent(artist)+"&title="+encodeURIComponent(title));
    addon1.setAttribute("target","_blank");
    addon1.setAttribute("id","vlyr"+id);
    addon1.innerHTML=IDL('AudioLyr')+' ';
    newdiv.appendChild(addon1);
    newdiv.className="duration";

    artb.parentNode.parentNode.appendChild(newdiv);

}

function addLyrics() {
 //   var parent = document.getElementById("audios");
	//if(parent){
	var audios = document.getElementsByTagName("div");
	re=/audio(\d+)/;
	 for (var i=0;i<audios.length;i++) {
	    var m = audios[i].id.match(re);
	    if (m) {
        if (!document.getElementById("vlyr"+m[1])) addLyric(m[1]);
	    }}
 //}
}

// AUDIOS MENU
function vkAddToMyAudio(aid,oid,ignore){
  var req='method=audio.add&aid='+aid+'&oid='+oid;
  doAPIRequest(req,function(r){
    if (r.error && !ignore){      //alert(r.error.error_code+'\n'+r.error.error_msg);
      if (r.error.error_code==7) 
        vkSetAppSettings(api_vkopt_app_id,function(){ vkAddToMyAudio(aid,oid,true); });
      else alert('Error.\nError Code 0x'+r.error.error_code); 
    }  else { 
      if (r.response=1) alert('Audio Added!'); 
      else alert(r.response+'\nError Audio');
    }
  });
}
// javascript: vkAddToMyAudio(73492141,22607418)
// javascript:  InitAudiosMenu();//vkAddToMyAudio(73492141,22607418);
function InitAudiosMenu(el,mid,cl){
  var aclass=(cl)?cl:'audioRow';
  var nodes=(!el)?geByClass(aclass):geByClass(aclass,ge(el));
  var dloc=location.href;
  var aid=false; var div,uid=false;
  for (var i=0; i<nodes.length;i++){
    aid=(nodes[i].id && nodes[i].id.split('audio')[1])?nodes[i].id.split('audio')[1]:false;
    if (aid && !ge('amnu'+aid)){
      if (ge('mid')) uid=((dloc.match(/(club|event)\d+/))?"-":"")+ge('mid').value;
      if (typeof audioData!='undefined'){uid=(audioData.id)?audioData.id:-audioData.gid; }
      if (mid) uid=mid;
      div=document.createElement('div');
      div.id='amnu'+aid;
      div.setAttribute("style","float: right;padding-left:2px;padding-top: 4px;font-size: 10px;display:block;");
      div.innerHTML='<a href="javascript:;" onclick="return false;" onmouseover="vkPFMenu(event,vkGenAudioItems(\''+aid+'\','+uid+'));">&#9658;</a>';
      var perf=(ge('performer'+aid))?ge('performer'+aid):ge('performerWall'+aid);
      var el=perf.parentNode.parentNode;
      el.insertBefore(div,el.childNodes[1]);
    }
  }
}

function vkAudioWikiCode(aid,uid){vk_MsgBox('<center><input type="text" value="[[audio'+uid+'_'+aid+']]" readonly onClick="this.focus();this.select();" size="25"/></center>','Wiki-code:');}
function vkGenAudioItems(aid,uid,mp3link){
  var items='';
  if (mp3link) items+= '<a href="'+mp3link+'">'+IDL('download')+'</a>';
  items+=(uid)?(
          '<a href=# onclick="vkAddToMyAudio('+parseInt(aid)+','+uid+'); return false;">'+IDL('AddMyAudio')+'</a>'+
          '<a href=# onclick="vkAudioWikiCode('+parseInt(aid)+','+uid+'); return false;">'+IDL('Wiki')+'</a>'
          ):"";
  items+='<a href="'+vkGetLiricLink(aid)+'" target=_blank>'+IDL('AudioLyr')+'</a>';
  var perf=(ge('performer'+aid))?ge('performer'+aid):ge('performerWall'+aid);
  var titl=(ge('title' + aid ) )?ge('title' + aid  ):ge('titleWall'+aid);
  items+="<a href='gsearch.php?section=audio&c[q]="+(perf.innerText+'-'+titl.innerText)+"'>"+IDL('GoSearch')+"</a>";
  return items;
}

function vkLoadAllAudios(callback){
  var html='';
  var LoadPage=function(offset){
    AjPost('/audio.php', {offset:offset, gid:audioData.gid, id:audioData.id, album_id:audioData.aid, ajax:1 },function(r,t){
      var res=eval('('+t+')');
      html+=res.html;
      if (!res.data.last) LoadPage(offset+100);
      else {
        ge('pagesTop').innerHTML='';
        ge('pagesBottom').innerHTML='';
        ge('audios').innerHTML=html;
        ReGenPlayList();
        if (callback) callback('ok');
      }
    }); 
  }
  LoadPage(0);
}


if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
