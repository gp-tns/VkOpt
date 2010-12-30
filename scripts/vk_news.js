// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


function vkPageNews(m) {
  if (m==1) {	pageMenu='';
  //blackList  
  return pageMenu;
  } else {
  // functions
  if (getSet(23) == 'n')
  	IDNewsAvat();
  if (!location.href.match('act=bookmarks'))
  	IDNewsObzor();
  }
}


function IDNewsAvat(div) {
vkaddcss(".feedFriendImg{display:none} .feedFriend{width:150px;padding:0;height:17px;} .feedFriends{text-align:left;padding:0;} .feedFriends br{display: none;} .feedFriends small{padding-left:4px}");
}

function IDNewsObzor(div) {
divs=[];
if (!div) divs=document.getElementsByTagName('table');
else divs[0]=div;
for(i=0; dv=divs[i]; i++) {
 if (dv.className.match('feedTable'))
 if (dv.getElementsByTagName('img')[0].src.match('add_photo_icon') || dv.getElementsByTagName('img')[0].src.match('photos_s.'))
  if (!dv.getElementsByTagName('td')[1].innerHTML.match('video')) {
if (location.href.match('act=group') || location.href.match('section=groups')) {
		var a=dv.getElementsByTagName('a');
    mid=a[0].href.match(/\d+/)?
		 a[0].href.match(/\d+/)[0]:
		 (a[1].href.match(/\d+/)?a[1].href.match(/\d+/)[0]:0);
	}
else mid=ExtractUserID(dv.getElementsByTagName('a')[0].href); //dv.getElementsByTagName('a')[0].href.split('id')[1];
	text=dv.getElementsByTagName('td')[1].innerHTML.split(' ');
	for (j=0; j<text.length; j++) {

//%u0438%u0439%20%5D%20%u0432%20%u0430%u043B%u044C%u0431%u043E%u043C%u044B
       //

		if (!isNaN(text[j]) && parseInt(text[j]) &&
			 (text[j-1].match('\u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D')        //groups
			 || text[j-1].match(decodeURI('%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D0%BB'))  //friends
       ) &&
			 text[j+1].match('\u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444')) {
			if (location.href.match('section=groups')) {mid='-'+mid; text[j]='<a href="/photos.php?act=albums&oid='+mid+'">[&nbsp;'+text[j];}
			else text[j]='<a href="javascript: \''+IDL('DontInNewWindow')+'\'" onclick="vkGoToLink(\'/photos.php?act=albums&oid=%id\',\''+mid+'\'); return false;">[&nbsp;'+text[j];// href="/photos.php?act=albums&oid='+mid+'"
			'';
			if (!location.href.match('section=groups')){ 
      text[j+1]=text[j+1]+"&nbsp;]</a> "+(vkbrowser.opera?"<a onclick=\"getUserID('"+mid+"',function(uid){idslideshow('start','0',uid)});\">[ss]</a>":'');//"idslideshow(\'start\',\'0\',\''+mid+'\')"
			} else {
      text[j+1]=text[j+1]+'&nbsp;]</a>  '+(vkbrowser.opera?'<a onclick="idslideshow(\'start\',\'0\',\''+mid+'\')">[ss]</a>':'');
      }
		}
	}
	dv.getElementsByTagName('td')[1].innerHTML=text.join(' ');
  }
 }
}


if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
