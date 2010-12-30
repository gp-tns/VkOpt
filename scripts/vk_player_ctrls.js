// ==UserScript==
// @name          VK_ExtAudioPlayer page controls v 0.9    (VKopt module)
// @description   (by KiberInfinity id13391307)
// @include       http://*vkontakte.ru/*
// @include       http://*vk.com/*
// ==/UserScript==

// player_state='00-13391307_65065682'
//              'XY-ID_AID' -  X: 0 - stop/payse;  1 - play;
//                             Y: 0 - normal; 1 - 2forward; 2 - 2backward;
//                             ID_AID: ID - user id; AID - audio id;


var sync_plctrl_timeout=1500;
var vkstate=false;
var Plajax;

var last_plc_cook="";

//sync with player_ctrls
function SyncMPctrls(){
var pst=vkgetCookie('vkplayer');
  if (pst){
    pst=pst.split('-');
    var pfb=pst[0].split(''); }

var pst2=last_plc_cook;
  if (pst2){
    pst2=pst2.split('-');
    var pfb2=pst2[0].split(''); }

 if (pfb[0]!=pfb2[0]){          //<--- play/pause
  var btn=ge('sb_vkpl_btn');
  //alert(pfb[0]);
  if (pfb[0]=='0') {
    btn.src=vk_pp_img['play'];
    vkstate=false;
  } else {
    btn.src=vk_pp_img['pause'];
    vkstate=true;
  }
 last_plc_cook=vkgetCookie('vkplayer');
 }
 
}
  
function PlayerControlsInit(){
if ((ge('pageLayout')||ge('page_layout')) && !document.location.href.match('index.php'))
if ((getSet(53) == 'y') && (getSet(63) == 'y')){
Plajax = new Ajax();
if (!vkgetCookie('vkplayer')) vksetCookie('vkplayer','00-0_0');
if((ge('sideBar') || ge('side_bar')) && !ge('vk_plsb')){
  var node=(ge('sideBar') || ge('side_bar'));
  var pst=vkgetCookie('vkplayer');
  var simg;
  if (pst){
    pst=pst.split('-');
    var pfb=pst[0].split(''); }
  if (pfb[0]=='0') {
    simg=vk_pp_img['play'];
    vkstate=false;
  } else {
    simg=vk_pp_img['pause'];
    vkstate=true;
  }
  var div=document.createElement('div');
  div.id="vk_plsb";
  div.setAttribute("style","width:100%;");
  div.innerHTML='<center><table><tr>'+  //
  '<td valign="center"><img src="'+sb_back_img+'" onClick="Player2ForwBakw(2);" id="sb_vkbk_btn" style="cursor: hand;"></td>'+
  '<td valign="center"><img src="'+simg+'" onClick="PlayerSwichPlay();" id="sb_vkpl_btn" status="'+(vkstate?'pause':'play')+'" style="cursor: hand;"></td>'+
  '<td valign="center"><img src="'+sb_forw_img+'" onClick="Player2ForwBakw(1);" id="sb_vkfw_btn" style="cursor: hand;"></td>'+
  '</tr></table></center>';
  node.appendChild(div);
                   //<br><br><br><br><br>
  /*node.innerHTML+='<div id="vk_plsb" style="width:100%;"><center><table><tr>'+ 
  '<td valign="center"><img src="'+sb_back_img+'" onClick="Player2ForwBakw(2);" style="cursor: hand;"></td>'+
  '<td valign="center"><img src="'+simg+'" onClick="PlayerSwichPlay();" id="sb_vkpl_btn" style="cursor: hand;"></td>'+
  '<td valign="center"><img src="'+sb_forw_img+'" onClick="Player2ForwBakw(1);" style="cursor: hand;"></td>'+
  '</tr></table></center></div>';*/
  last_plc_cook=vkgetCookie('vkplayer');
  setInterval("SyncMPctrls();",sync_plctrl_timeout);
}
}
}

function PlayerSwichPlay(){
// player_state='00-13391307_65065682'
//vksetCookie('vkplayer',settings.join('-'));
var pst=vkgetCookie('vkplayer');
  if (pst){
    pst=pst.split('-');
    var pfb=pst[0].split('');
    //alert(pst+'\n'+); pfb[0]=0;
  }
var btn=ge('sb_vkpl_btn');
  if (vkstate) {
    btn.src=vk_pp_img['play'];
    btn.setAttribute("status","play");
    vkstate=false;
    pfb[0]=0;
  } else {
    btn.src=vk_pp_img['pause'];
    btn.setAttribute("status","pause");
    vkstate=true;
    pfb[0]=1;
  }
var stcook=pfb.join('')+'-'+pst[1];
vksetCookie('vkplayer',stcook);
}

function Player2ForwBakw(fbs){
var pst=vkgetCookie('vkplayer');
  if (pst){
    pst=pst.split('-');
    var pfb=pst[0].split('');
    //alert(pst+'\n'+); pfb[0]=0;
  }
  pfb[1]=fbs;
var stcook=pfb.join('')+'-'+pst[1];
vksetCookie('vkplayer',stcook);
}

var sb_back_img='data:image/gif;base64,R0lGODlhFAAUAOYAAAAAAP////7+//39/uru80dwmEx0nEx0m011nE52nU51nFB3nlB3nVF4nlN6oFJ5n1J4nlR6oFV7oVZ8oVV7oFd9old8oVuApGKFqGSHqWuMrW6Or26Pr3OSsXmXtXmWtHqXtHyZtn+buIqkv4ymwI6nwJeuxZ2zyaC1y6G2y6W5za/A0rvK2c3Y49Hb5enu8+jt8vDz9vf5+0ZwmEdxmUlymUt0m0x1nE52nFB4nlF5nlN6n1R7oFV8oVyBpGGFp2yOrnSUsnWUsnmYtXqYtX6bt4mkvo2nv4+pwY6owJOrwpSsw5mwxpivxae7zuLp7+bs8eXr8PP2+PL19/n7/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFUALAAAAAAUABQAAAfdgC9IQhyFhoeGG0EjT0czDxGRkpOTDzUiHxATm5ydnhM8GiENnDgPFp4LCJwRHKObO0sdD5w9B0QmFJutrxIOASirExE3STJTFxHDrqQSEQEnqw07KwEBMD7KvM3P0QgYLdbX2cu93TNDUOLj2swTzgEmQQPr7OXcAUwZUfXY7ebQCvxwsc7fvXfdEOSYwEKcwW0Ioa16wECFAHsQ4aW4sYmHjRJUpJDLGCGFB1KcDBRxUkEXxE0JTqVSwIoDEZSfcg4D0mRGg59AgwrVQcNIDCUgQihdypQpCBIEAgEAOw==';
var sb_forw_img='data:image/gif;base64,R0lGODlhFAAUAOYAAAAAAP////7+//39/uru80dwmEx0nEx0m011nE52nU51nFB3nlB3nVF4nlN6oFJ5n1J4nlR6oFV7oVZ8oVV7oFd9old8oVuApGKFqGSHqWuMrW6Or26Pr3OSsXmXtXmWtHqXtHyZtn+buIqkv4ymwI6nwJeuxZ2zyaC1y6G2y6W5za/A0rvK2c3Y49Hb5enu8+jt8vDz9vf5+0ZwmEdxmUlymUt0m0x1nE52nFB4nlF5nlN6n1R7oFV8oVyBpGGFp2yOrnSUsnWUsnmYtXqYtX6bt4mkvo2nv4+pwY6owJOrwpSsw5mwxpivxae7zuLp7+bs8eXr8PP2+PL19/n7/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFUALAAAAAAUABQAAAfggE8jQRschoeIh0JILyI1DxGRkpOTDzNHGjwTm5ydnhMQHxwRnAgLnhYPOJwNIaObFCZEBz2cDx1LO5utrxEXUzJJN6QTCCgBDhITvKQRPjABASs7DcUnARHKzBPO0NEtGAgI19nLrs3P0dFQQzPk2ufc6eoBA0Em2PC98+pRGUz5zO3zFs3FjwLvBKIjyGJCjnEBt3ULIEAFgwfWIsZzJoVKCRuaJtxIofEVhQpOihjo1MBDinLbNik41SlVAlYhgBD7xHMZESM0dDQYSrSo0RlNCJAAEaKp06dPQSiJEQgAOw==';
var vk_pp_img= {
     	play: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAMAAABVyG9ZAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAMUExURV99nf///+7u7pqxxnWAXsYAAACjSURBVHjaYmBkZsAKmBkBAogBhwxQDiCAGHADgADCgwACCA8CCCA8CCCAkBAjIyofIIBQpFDlAAIIVQpFDiCA0KSQ5QACCF0KSQ4ggDCkEHIAAYQpBZcDCCA8UgABhMdAgADC4wyAAMLjeIAAwuNlgADCE1AAAYQneAECCA8CCCA8CCCA8CCAAMKDAAIIT2IDCCAG3EkUIICATmbCChgZAQIMAJYcAJNnWU0+AAAAAElFTkSuQmCC",
			pause: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAMAAABVyG9ZAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAMUExURV99nf///+7u7pqxxnWAXsYAAACXSURBVHjaYmBkZsAKmBkBAogBhwxQDiCAGHADgADCgwACCA8CCCA8CCCAYIgRCJBpIAAIIDxSAAGERwoggPBIAQQQHimAAMIjBRBAeKQAAgiPFEAA4ZECCCA8UgABhEcKIIDwSAEEEB4pgADCIwUQQHgQQADhQQABhAcBBBAeBBBAeBIbQAAx4E6iAAEEdC0TVsDICBBgANQZAL0OgymfAAAAAElFTkSuQmCC"
		};
/*
(function(){
document.addEventListener('DOMContentLoaded',PlayerControlsInit, false);
})();
*/
if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
