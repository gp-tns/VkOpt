﻿// ==UserScript==
// @name          VKOpt 1.9.x
// @author        [Admin] (http://vkopt.net/) or VkOpt ( /id14782277 ) & KiberInfinity( /id13391307 )
// @namespace     http://vkopt.net/
// @description   Vkontakte Optimizer 1.9.x
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//
var vVersion	= 191;
var vBuild = 101230;
var vRelCand=4;
var DefSetBits='yyyyyyyyyyyynyyyynnyynyyyy1y0y0nnnyyy00nynnyyyyyyyyyyynyyyynn01nynnnyyyyn0yny0y00y0nyynyn-1-1-3-0-15-15-0-0_0-#CCFF99-#666666-00000-00000-00000';
var DefExUserMenuCfg='11111110111111111111';
var vk_upd_menu_timeout=20000; //ms
var vkMenuHideTimeout=400;    //ms
var vkMenuIconSize=12;//px. max 16

var vkNewSettings=[82,84,85,86,87,88];
var vk_DEBUG=1;
var vk_showinstall=true;
var vkBlockRedirect=true;
var vkLdrImg='<img src="/images/upload.gif">';
var SettBit=false;
var vkOpt_js_count=19;



///////////
/* CROSS */
var _ua_ = window.navigator.userAgent.toLowerCase();
var vkbrowser = {
  version: (_ua_.match( /.+(?:me|ox|on|rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
  opera: /opera/i.test(_ua_),
  msie: (!this.opera && /msie/i.test(_ua_)),
  msie6: (!this.opera && /msie 6/i.test(_ua_)),
  msie7: (!this.opera && /msie 7/i.test(_ua_)),
  msie8: (!this.opera && /msie 8/i.test(_ua_)),
  mozilla: /firefox/i.test(_ua_),
  chrome: /chrome/i.test(_ua_),
  safari: (!(/chrome/i.test(_ua_)) && /webkit|safari|khtml/i.test(_ua_)),
  iphone: /iphone/i.test(_ua_),
  ipod: /ipod/i.test(_ua_),
  iphone4: /iphone.*OS 4/i.test(_ua_),
  ipod4: /ipod.*OS 4/i.test(_ua_),
  ipad: /ipad/i.test(_ua_),
  safari_mobile: /iphone|ipod|ipad/i.test(_ua_),
  mobile: /iphone|ipod|ipad|opera mini|opera mobi/i.test(_ua_)
}


if (vkbrowser.mozilla){
if (window.Node)
{
  Node.prototype.__defineGetter__('innerText', function() {
    if (this.nodeType == 3)
      return this.nodeValue;
    else
    {
      var result = '';
      for (var child = this.firstChild; child; child = child.nextSibling)
        result += child.innerText;
      return result;
    }
  });
}

if (typeof(HTMLElement) != "undefined") {
    var _emptyTags = {
       "IMG": true,
       "BR": true,
       "INPUT": true,
       "META": true,
       "LINK": true,
       "PARAM": true,
       "HR": true
    };
    
    HTMLElement.prototype.__defineGetter__("outerHTML", function () {
       var attrs = this.attributes;
       var str = "<" + this.tagName;
       for (var i = 0; i < attrs.length; i++)
          str += " " + attrs[ i ].name + "=\"" + attrs[ i ].value + "\"";
    
       if (_emptyTags[this.tagName])
          return str + ">";
    
       return str + ">" + this.innerHTML + "</" + this.tagName + ">";
    });
    
    HTMLElement.prototype.__defineSetter__("outerHTML", function (sHTML) {
       var r = this.ownerDocument.createRange();
       r.setStartBefore(this);
       var df = r.createContextualFragment(sHTML);
       this.parentNode.replaceChild(df, this);
    });
}

}
///////////
//////////
// Функции для работы с DOM
// создает элемент
/**/
function $c(type,params){
    if(type == "#text" || type == "#"){
        return document.createTextNode(params);
    }else if(typeof(type) == "string" && type.substr(0, 1) == "#"){
        return document.createTextNode(type.substr(1));
    }else{
        var node = document.createElement(type);
    }
    for(var i in params){
        switch(i){
            case "kids":
            for(var j in params[i]){
                if(typeof(params[i][j]) == 'object'){
                    node.appendChild(params[i][j]);
                }
            }
            break;
            case "#text":
            node.appendChild(document.createTextNode(params[i]));
            break;
            case "html":
            node.innerHTML = params[i];
            break;
            default:
            node.setAttribute(i, params[i]);
        }
    }
    return node;
}
/**/
function $x(xpath, root) {
       root = root ? root : document;
       try {
               var a = document.evaluate(xpath, root, null, 7, null);
       } catch(e) {
               return[];
       }
       var b=[];
       for(var i = 0; i < a.snapshotLength; i++) {
               b[i] = a.snapshotItem(i);
       }
       return b;
}
function $xp(s, t){
    return new DOMParser().parseFromString(s, "text/xml");
}
function $hp(s){
    var a = document.createElement("div");
    a.innerHTML = s;
    return a;
}
function $rnd(tmpl, ns) {
    var fn = function(w, g) {
        g = g.split("|");
        var cnt = ns[g[0]];
        for(var i = 1; i < g.length; i++)
            cnt = eval(g[i])(cnt);
        return cnt || w;
    };
    return tmpl.replace(/\$\{([A-Za-z0-9_|.]+)\}/g, fn);
}
function isNewLib(){return window.showWriteMessageBox?true:false}

function vkInitDebugBox(){
  var sHEIGHT=21;
  var sWIDTH=21; 
  var HEIGHT=300;
  var WIDTH=400;
  
  vkaddcss('\
        #vkDebug{ border: 1px solid #AAA; border-radius:5px; background:#FFF; color: #555;\
                  padding:1px;\
                  width:'+sWIDTH+'px; height:'+sHEIGHT+'px; overflow:hidden;\
                  position:fixed; z-index:1000; right:0px; top:0px;}\
        #vkDebug .debugPanel{height:'+sHEIGHT+'px; background:#F0F0F0}\
        #vkDebug .debugPanel span{line-height:18px; font-weight:bold; color:#999; padding-left:5px;}\
        #vkDebug .mbtn{background:#FFF url("http://vkontakte.ru/images/icons/x_icon5.gif") 0px -63px no-repeat;\
                  cursor: pointer; height: 21px; width: 21px;\
                  float:right;}\
        #vkDebug .hbtn{background:#FFF url("http://vkontakte.ru/images/icons/x_icon5.gif") 0px -105px no-repeat;\
                  cursor: pointer; height: 21px; width: 21px;\
                  float:right;}\
        #vkDebug .log{border: 1px solid #DDD; margin: 5px; min-width:'+(WIDTH-10)+'px; max-height:'+HEIGHT+'px; overflow:auto;}\
        #vkDebug .log DIV{border-bottom: 1px solid #EEE;}\
        #vkDebug .log DIV:hover{background:#FFB}\
        #vkDebug .log DIV .time{float:right; color: #BBB;}\
  ');
  
  
  
  var div=document.createElement('div');
  var panel=document.createElement('div'); 
  var btn=document.createElement('div'); 
  var wlog=document.createElement('div');  
  div.id='vkDebug';
  panel.className='debugPanel';
  btn.className='mbtn';
  wlog.className='log';
  wlog.id='vkDebugLogW';
  //wlog.innerHTML='<div>log started</div>';
  
  var tomax=function(){
      var callback=function(){
          btn.onclick=tomin;
          btn.className='hbtn';
          div.style.height='auto';
      }
      var h=getSize(wlog)[1];
      animate(div, {height: h+sHEIGHT,width: WIDTH}, 400, callback);
  }
  var tomin=function(){
      var callback=function(){
        btn.onclick=tomax;
        btn.className='mbtn';
      }
      animate(div, {height: sHEIGHT,width: sWIDTH}, 400, callback);
  }
  btn.onclick=tomax;
  panel.appendChild(btn);
  div.appendChild(panel);
  div.appendChild(wlog);
  document.getElementsByTagName('body')[0].appendChild(div);
  vklog('Log started ('+location.pathname+location.search+')',3);
}
function vklog(s,type){
  if (vk_DEBUG){
    var node=ge('vkDebugLogW');
    if (!node) return;
    var div=document.createElement('div');
    type=(type)?type:0;
    var style="";
    switch(type){
      case 0: style=""; break;
      case 1: style="color:#D00; font-weight:bold;"; break;
      case 2: style="color:#080;"; break;
      case 3: style="color:#00D;"; break;
    }
    div.setAttribute('style',style);
    div.appendChild($c("#", s));
    div.appendChild($c("span",{class:"time", "#text": (new Date().getTime()) - vkstarted}));
//    innerHTML=s+'<span class="time">'+(new Date().toLocaleString().split(' ')[1])+'</span>';
    node.appendChild(div);
    node.scrollTop = node.scrollHeight;
  }
}
//javascript: hz_chooselang();
function IDL(i) {
  vkLangGet();
  if (vk_lang[i]) return decodeURI(vk_lang[i]);
  if (vk_lang_ru[i]) return decodeURI(vk_lang_ru[i]);
  if (window.vk_lang_add && vk_lang_add[i]) return decodeURI(vk_lang_add[i]);
  else return i;
}

function vkExtendLang(obj) {
  if (!window.vk_lang_add) vk_lang_add={};
  for (var key in obj)  vk_lang_add[key]=obj[key]; 
}

function vkLangSet(id,no_reload){
  vksetCookie('vklang',id);
  vk_lang=VK_LANGS[id];
  if (no_reload) InstallRelease();
  else  location.reload();
}

function vkLangGet(){
  if (!window.vk_lang){
     var id=vkgetCookie('vklang');
     if (!id) id=0;
     vk_lang=VK_LANGS[id]?VK_LANGS[id]:VK_LANGS[0];
  }
  return id;
}

function hz_chooselang(no_reload){
    vkaddcss('\
    #hz_lang{margin:auto;width:'+(!no_reload?'240pt':'470px')+';height:'+(!no_reload?'180pt':'120pt')+';}\
    #hz_lang a{text-align:center;display:block;float:left;padding:2pt 5pt;margin:2pt;border:solid 1pt #5c82ab;background:#fff;width:100pt;height:50pt;-o-transition: all 0.25s ease-out;}\
    #hz_lang a:hover,#hz_lang a:focus{text-decoration:none; color:#fff;background:#476d96;}\
    #hz_lang img{margin:auto;display:block;clear:both;width:48px;height:48px;}\
    #hz_lang img#be{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAVBSURBVHja7JnLb1VFHMc/M+d17+3rttrWVlCEPoACUhQogguNBuMGA4agaKImLEx0gf+AWzeuCYkmBlGj0YhxadSgtZSqQGkrIDEFSsujrb193Pae14yL29Lb0pZCjD2N/SWTM3PmN4/v+T1njtBas5hJsshpCcASgP87AAEYgDP+XEwUAq4JFPZc7vs7zwgJWtsw6tYiTAv/1GmsTfVgm4y+czCSCCqOflRiAkVFeSZOaoggncIYHQTbJhwbwkinMIorCRu2Rm7zmaZmgCITcEInhh5IYTy8AtVzHbTCWPkIqrsbs6YKNTCQHaU1CHHn2afz3eu4WXhkUSFoBeCYAGp4BNXXh1m/AdXcgnY95Ib1qKZmdCqF9n3E+MQzRe7pfXPxTvRrrW/xzcQ7wTNjPQjQSgFgAsi8BCIvgerqBstCSInq7gHHRhQWQhAyV8Kh79CejX++c06vCz8EpScBqNExZEkJ3vc/YjVsAdvGP/4z1vZt6JE02vcipf/a90CFORKIOWjXxVhTixpJgx7BWLsa7XkQj6E9P1oAPA/CHBXSvk94/gLmpo14jU2QcbF3PoP/UyNm3drsgCgBcL2pNoBlIZcvQ126glFehg41qvMSxvJlkIijPTdiACwIc1RIj40h8hJkvvgKZ/cuZDxO5sinxF7Zl7UBN2ISsFx0rg2IRILwwkVU52X8X08hbAvV1YV/5izxhi1oN2ISMIypNqBcj6CpGblyBaTTqJSPrK0hONGM3r8PogZASgiDHAlYFrKmBv9kC2b9o6AU/okWjOpqSCRQmWgBEAh0qKfagFlbhax4AHWtBz06hvP8ToRto4cGI+eFEGJqHNAZl+D0WYyaKsh4CMuEICTo/BO5ri56XshzQcicQJYsAhWS+eRznD27wLRwvz6GsWoVsqI8cl4IQJhmjgRcD1m1Cnn9JqrrKvgBsqwMo7YanXEns9H\/\/Kw1e7ZklJTkBDLHIWjrIOz4A3PzY4iYhf9LExgG9t49aLUQd0dzr6lz3WjY34/l+8Ree5WgvQNME/vF3YSdl1BXrmbz9IiRyjViHBvz8U3owSFwHHQ6DVJirluDKE5GDoAwjVsSkAA6FsM/cZKxwx8iEnFkSQmZIx/jffcDoiAflMqegFRO0er29zqnzNQ3F99M7dnWURqCnECmPI+g5TdkYT5Baxu4HiKRR9DyOwyPZCWg53Eq0XdxKuEux+npNpADANvGfu5ZRt97H2fvbkRxkszRz4gdeB1RnOTdQ3akVMiUFoQSdk1IYHAIs34jxsoV2E8/BQX5+McbsXZsR93sncchkQXzUtk4EI+hBlLE33oT1d8Pfb3ED76NHhhAJIvQMwHQ4656vmuJf3f74fh5QAKojEvQ2ISxuprgTCt+Uwtm3Wr85pPowaGsCYwX9KRAJtq572eqa7htjju1Z5sv6xAFSuupgczavo2w/RzmujpQiuBsO9bmzYhkcooK3a0t63u4xZjPLYdSwaQEwqFBRHER7jffIisrMGqqcb88hryvGL0gacQ8kgydezudX0B48S+cPS8QnjtPcPJXnJf3EnScQ5aVRvJedEKFshJIpdBXu7GeaEAPDqJu3MRs2ILu60f1XIueBIS4dbElAUQyiXhoOUFrG6IoiSgrJWxrR5Tej3ywMoLff5oRy9E0RnUVmUOHcfa/BPE47uEPcA68gUqliJl5RJVMIOwdGMUrKCbY+iRG+TKEYxM07MAsq0RcucFQajiq+w8FUA6sB0pZXNQLtAmyv5cKxp+LiVxgWCz9qV8CsARgCcCC0j8DAMfW4S5zwrjbAAAAAElFTkSuQmCC");}\
    #hz_lang img#ru{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAGtSURBVHja7JlLTsQwDIY/ZwqDEC8hRlyALXvuxZKDsWTDDTgG4iFGYmipbRbToZkBVPESsog3jdqkzV//v+M44u5EtkRwKwAKgP8OQIARMO6ukUyBugJ23P025N8X2U/AbmAG7aaOPlFtXKJQAVAAFAAFwP8GUAGcnJ4z2dvgsW5DTHpzXHF9/9QDUHNmdUvdKADeZXlDlvdbtD8a61n2mLcZ6Pve9wSwbitcAbTmzBqjfrYQHnCE1jIA5s7DYxOG9/WzkpJkHlCnVYsl3lHKNWDcTOs3O52fLrh89535+IOdcUYhg9XykP8Kd39uvBm5B5RoBS41XdZASkKrHoT//VznHlADJ44XXNAlAGaAEIlFSxS6vDijMsOb5ksr46rAZGDVZmA1HlqpZX2NNo046qOQ4fgghfwb9z7bd+iZdWGoA6AgiTAccjDXPp12dxCJIwCRV7ZUAK42LywGUrF3qU9aJHPRPLBIp3sKBTNfBSCBPCCZBsKK2DwPo13ETVtbITf1CnA3fYhYlFABDoFjYBJs8tfAlTA/H9gm3jlBDUylnNQXAAVAAfCn9jIAuSzTHtaxfZQAAAAASUVORK5CYII%3D");}\
    #hz_lang img#uk{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJnSURBVHja7JlrahRBEMd/NZm4iMSID3IAEf3iEQSv4B08lnfwCkKO4BdBPIBIjEZwd2a7qvywM2PPy90VJCnc+jLT7/7Xo6uqW9ydyFQQnA4ADgD+dwACHAGL5huJFKhK4O6rN+++RuT+29cv75fAqeO8eHwWavPnnz4DnJbAwhzUnG/LGoDcuYlI9+/uFCJsc33uPhqXl1vd9S3j5ua+d/sWthm8KAHMnWSGmjWdsoXEcYd2XrXx9tu2dpzIptB38t7rn8/ZX9N7fab+1RxrKkoAN6dOxlptxJWWU/mXQd1Uvzkuk83BoF0m6qaoVsMtA5DcqdWo1ELof61G6knAnTop6xQEQNJOpcpWr2s16kASaO21AQDL2litYwA4LoyW1xsAbqxSoko6tryh1Y7ONabH+MxJwMDK56zZZ9oFjpOgnkvAYZmUSnVyb9dJU3soC0H7NmCsamW11iARqAxtwFm2KrQH5+f8wpymMeEn2NJ3aj0RsJ4fMGdZG1WQY9RdSDkAM+dqVYcJ5KqkFE0c0kkgBfEBnSEfFf1j9OJntTVa/Kt0yf8w566LNP3yoO7hnUXX9NS/P/mAXwTLJR8gpx+fNbGQIkS64HLcNQ/mEiIFkKJYAO4pzwe0uZ8IJIW+BHTHVOLmkNkIgANRjlIb2oA1AOJIwJtotOjEIbtGP/8i3tz3CJWhClmDxcOA8DwfaAuBVchuQOqyX4xilgGI+MzU7rn4fSsWSwItzzMJxFShLqHZ1J+EU6WSzUMBl5dXBCQV4Ax4DjwKtvkvwHth87x00nwjUQX8kMNL/QHAAcABwLXSrwEAP7t+bpCVzSsAAAAASUVORK5CYII%3D");}\
    #hz_lang img#us{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAPTSURBVHja7Jnva1tVGMc/J0l/JHVJbOcq6SYOtKmTlMFAZS+6vVDYi+E/oCtFEauISGuLL0QtwtCVyOgLHYgTOhCEMURfKL5RC4JYX4yE6Q0TofpuVdskTZPcH+f44t7cxNa0gifoxRw43Puc89yT53u+z3mePPcKpRRBbiEC3roAugD+7wAEEAb6vGuQmgPUI0D87Nk3fu/0r70nbmhfc/iTK4MRICGl4tSpY8zPP8qFCx/7CjrlPvq0Gl/96muAhADSZ86cNyYm7mNzswJAa24TwnM05Y6HBOyX+pTynmuRXzkW2d+qnQ+20REDMezvCyQX5sci7pjEtt0OkM2eY2Zm2VtLkM2eY3b2iud4imx2ktmZZXc9AW9lJ715haIpqxaot009pt8vF+YRQPqRh183HnzoXorFKrv3V7SMiR3zDVnQnhd3R5eWpvRHICFcBmxHYZo2S0tTTE+/6ytcuvSUNrnywTV9hkf7sdd+8bcnffr0a8bx43dTLG53LAq9yXV9ySsRx7yeI/Xl52MhAMeR1OsWpmljmjaXLz/j3/ty3d49X99Dv0U2TRthRfR1M4xQsSYDJ0++bIyOpiiXqx1j4MO3JzX+fwiBaREZubOVAZOrV2eo1y2/65TDhw7q6wcHCaeGmwycOPGSceTIEFtbtY4x8Ok7j+tlwLLoGbvHjUJSSqpVk3rdAmBlZYGJiVd9/X8qA6w/8ay+KBSLIm/92mQgk3nRSCYHqFbNjjHwEStaw6gqljicW/XygC2pbpusfneezPicl7Ihn19kPDPn56lcfpHM+JyftvI5T/ZyWS63SCYz52bwVn0F8aef1LcbkTBYNjy/6jKQTr9gdLq4LxQudiQTh1wGHGo1y++FwkWtcq1mdbSgSR89+pyxvl7qKAM/PlDRW0om4xy69n7zDEipqFSWGRhoJhydcvWbL7QCCA8NNRlIpaaNjY2tjjJw866f9LpOIs7It5+NCSDtOI4RCgWrvpdSEg6H3UMc5NeLEYCfh+8nYloo0wqE0aK3B7u3pwlA2Q4KUFI1Cqj2hVfbWnVXEbZ7XvzF/c75vYq/hp5UKMdpASClV8krkHtUlHKf6rGdMe3Gd4JSbTZF8Ge7BChHNgGM3LpBf39/oHy/VqtBNEpgD3HD5gjAWnKUWG8varsajEMci7Jtms2Xu/LvvFD6TyEQrs0NAAQxD7S60OHffiAejwfK/lKpBIlEcA+xlC1hdG0wze0HgsXAZrnkA3AANsolAtgcAQwDGeCOgBm/DuQF7uelA941SK0OlEX3S30XQBdAF8C/2v4YAPx7dIYulAWrAAAAAElFTkSuQmCC");}\
    #hz_lang img#it{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAALjSURBVHja7JnNbtNAEIC/sZ2kldJWaoWQ4FaJE+qBE4hn4BFAgrfgDXgQLpzhHVDviHdAgja0DSVe785wiOPa+aO4aVyLjGT5R5rd+XZmdnfWYma0WSJaLhuADcD/DpCISAz0gLgtRh8d7SUHB0/iw8PDNAF2X356d1q3sfcv3t7ImG+v3tTWff3xw4ME2FOM5w8fNzKavWdPa+mNPh9z/ONyOwF6ZoZq4Cz9BUB5aZPSs029r0J0MCh1YCB/6cGMaG8XTDmDTgKgpngNeA1zAcqGr3zd9j63q9qyiBTfZp69x1THSTwGMJx6Mg1VixdZLqsjsczP/77kWbIAamUAJVNPpn7tOWCZq6eTR0sCEMxw3uNCAwAuq6HjIChdkMIDachwIWsAoIYHUoep8qhDb+wBDTlAEx5IawB0IAS+ZoyuPOAdaXDrB0hreKCTYhro9rtRngPKKDjSJkIoreGBOIaguKHTPISU35kj9esHoA5AFEEe7oUHfqtjpOsH0NG/AwiCBasCpJlrzSyESHUdUFUu3GUjm7las5BLQaIrAG+Kb2AVrjsLAUiSVLcSg9GwEYDKbnQq0pdtuOL9/ZIHVNGGzodMF/W73B4LWs0Bo6EDrpoDp9XNnCeWqKgH7jqAJHHVA14VxVCsqAHErkKxKJSsVCqsqiZQXVz2Tdclk/40KgqhYiXGSlWRlWyz2YGyVZZmZrNtzatmbDoHygAhQJwDLKvA5I7kgBk6CaH9/X6iZpjJ4pG12yqIZ2vh60deDrCzc9ANGojiuJmZqC5AGE840cXJiTPTcXRYKSbNShdTl82P3XVJ6ZQiOR0O/ZaOA9wWxkq9xeY2PTA5VokmLyK0RkQEtTJAC38zTWwuAIRWuWAOQLtiqNh8Jn2IJjT97vbabYn6/RvpJ1s9FOD851mtBgYL9/PX1D8/v4l6EOA+cATca1kefwe+COPfSzv5vU2SAhey+VO/AdgAbAAalT8DANdU4nLzOiK9AAAAAElFTkSuQmCC");}\
    #hz_lang img#tat{background-image:url("data:image/png;base64,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");}\
    ');
  no_reload=!!no_reload;
  var idx=0;
  var lng=[
    ["ru","\u0420\u0443\u0441\u0441\u043a\u0438\u0439 \u044f\u0437\u044b\u043a",VK_LANGS[idx++]['LangAuthor']],
    ["uk","\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430 \u043c\u043e\u0432\u0430",VK_LANGS[idx++]['LangAuthor']],
    ["be","\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f \u043c\u043e\u0432\u0430",VK_LANGS[idx++]['LangAuthor']],
    ["us","English language",VK_LANGS[idx++]['LangAuthor']],
    ["it","Italiano language",VK_LANGS[idx++]['LangAuthor']],
    ["tat","\u0422\u0430\u0442\u0430\u0440\u0441\u043a\u0438\u0439 \u044f\u0437\u044b\u043a",VK_LANGS[idx++]['LangAuthor']]
  ];
  var html="";
  var about="";
  for (var i=0;i<lng.length;i++) {
    html+='<a href="#" onclick="vkLangSet('+i+','+no_reload+'); return false;"><img id="'+lng[i][0]+'"/>'+lng[i][1]+'</a>';
    about+='<b>'+lng[i][1]+'</b> - '+lng[i][2]+'<br>';
  }
  html='<div id="hz_lang">'+html+'</div>'+
       '<center style="clear:both;"><b><a href="javascript: toggle(\'vklang_author\')">About languages</a></b><div id="vklang_author" style="display:none">'+about+'</div></center>';
  if (no_reload) return html;
  if (!window.hz_b)   hz_b = new MessageBox({title: IDL('Elektu lingvon.'),closeButton:true});
    
    hz_b.removeButtons();
    hz_b.addButton({onClick:function(){hz_b.hide(200);},style:'button_no',label:'OK'});//0-rus 1-ua 2-be 3-en
    hz_b.content(html).show();
  
}

function vkCheckSettLength(){
  s2=vkgetCookie('remixbit'); 
  s2=s2.split('-'); 
  s1=DefSetBits.split('-'); 
  s2[0]+=s1[0].substr(s2[0].length); 
  s2=s2.join('-');
  vksetCookie('remixbit',s2);
}
function InstallRelease(){
  if (!vkgetCookie('vkOVer') || (vkgetCookie('vkOVer') && parseInt(vkgetCookie('vkOVer'))<180 && !vkbrowser.opera)) vksetCookie('remixbit',DefSetBits);
  vksetCookie('vkOVer',String(vVersion));
  vksetCookie('vkplayer','00-0_0');
  if (!vkgetCookie('remixbit')) vksetCookie('remixbit',DefSetBits);
  vkCheckSettLength();

  
  if (!window.vkMsg_Box) vkMsg_Box = new MessageBox({title: IDL('THFI'),width:"495px"});
  vkMsg_Box.removeButtons();
  vkMsg_Box.addButton(!isNewLib()?{
    onClick: function(){vkMsg_Box.hide( 200 );},
    style:'button_no',label:'OK'}:'OK',function(){vkMsg_Box.hide( 200 );},'no');
  var cont=IDL('YIV')+'<b>'+String(vVersion).split('').join('.')+'</b> (build <b>'+vBuild+'</b>)<br><br>'+IDL('INCD')+'<b>'+IDL('FIS')+'</b>';
  //cont='<table><tr><td>'+cont+'</td><td>'+hz_chooselang(true)+'</td></tr></table>'
  cont+='<br><br>'+hz_chooselang(true);
  vkMsg_Box.content(cont).show();

}
function replaceChars(text, nobr) {
    var res = "";
    for (var i = 0; i<text.length; i++) {
      var c = text.charCodeAt(i);
      switch(c) {
        case 0x26: res += "&amp;"; break;
        case 0x3C: res += "&lt;"; break;
        case 0x3E: res += "&gt;"; break;
        case 0x22: res += "&quot;"; break;
        case 0x0D: res += ""; break;
        case 0x0A: res += nobr?"\t":"<br>"; break;
        case 0x21: res += "&#33;"; break;
        case 0x27: res += "&#39;"; break;
        default:   res += ((c > 0x80 && c < 0xC0) || c > 0x500) ? "&#"+c+";" : text.charAt(i); break;
      }
    }
    return res;
  }
  
function showjsurl(){
 var nows=  new  Date(); var datsig=nows.getYear()+"_"+nows.getMonth()+"_"+nows.getDate()+"_";
 datsig+=Math.floor(nows.getHours()/4);
 alert("?"+datsig);
}

function disableSelectText(node) {    
    node=ge(node);
	  node.onselectstart = function() { return false; }; 
    node.unselectable = "on";
    if (typeof node.style.MozUserSelect != "undefined") node.style.MozUserSelect = "none";
}

function vkCe(tagName, attr){
  var el = document.createElement(tagName);
  for (var key in attr)  el.setAttribute(key,attr[key]);
  return el;
}

function DelElem(el)	{
	var Node = ge(el);
	if(Node) Node.parentNode.removeChild(Node);
}

function insertAfter(node, ref_node) {
	var next = ref_node.nextSibling;
	if (next) next.parentNode.insertBefore(node, next);
	else ref_node.parentNode.appendChild(node);
}

function vkNextEl(cur_el){
  var next_el=cur_el.nextSibling
  while(next_el && next_el.nodeType==3) next_el=next_el.nextSibling
  return next_el;
}

function vkLocalStoreReady(){
  if (window.localStorage || window.GM_SetValue || window.sessionStorage) {
    return true;
  } else { 
    return false; 
  }
}

function vkSetVal(key,val){
  if (typeof localStorage!='undefined') {localStorage[key]=val;}//Chrome, FF3.5+
  else if (typeof GM_SetValue!='undefined'){ GM_SetValue(key,val); }//Mozilla
  else if (typeof sessionStorage!='undefined'){sessionStorage.setItem(key, val);} //Opera 10.5x+
  else { vksetCookie(key,val)}
}

function vkGetVal(key){
  if (typeof localStorage!='undefined') { return localStorage[key];}//Chrome, Opera, FF3.5+
  else if (typeof GM_GetValue!='undefined'){ return String(GM_GetValue(key)); }//Mozilla with Greasemonkey
  else if (typeof sessionStorage!='undefined'){ return sessionStorage.getItem(key);}//Opera 10.5x+
  else { return vkgetCookie(key)}
}

function vkLocalStorageMan(){
  if (!window.localStorage) return false;
  if (!window.vkLocalStorageBox) {
    vkLocalStorageBox = new MessageBox({title: IDL('LocalStorage')+' (vkontakte)', width:"570px"});
    vkaddcss("\
    .lskey{padding-left: 5px; float:left; width:140px; overflow:hidden; height:20px; line-height:20px; font-weight:bold;}\
    .lsval{height:20px; overflow:hidden; line-height:20px;}\
    .lsrow{border:1px solid #FFF; border-bottom:1px solid #DDD;}\
    .lsrow:hover{border:1px solid #AAA; background-color:#EEE; }\
    .lsrow_sel{border:1px solid #AAA; background-color:#E0E0E0;}\
    .lstable{border:1px solid #DDD; max-height:200px; overflow:auto}\
    ");
  }
  var Box = vkLocalStorageBox;
  Box.removeButtons();
  Box.addButton({
    onClick: function(){ Box.hide(200); Box.content(""); },
    style:'button_no',label:IDL('Cancel')});
  vkGetLsList=function(){
    var res='';
    for (var key in localStorage){
      if (key=='length') continue;
      res+='<div class="lsrow" id="lsrow_'+key+'" onclick="vkLsEdit(\''+key+'\')">'+
      '<div class="lskey">'+replaceChars(key)+'</div>'+
      '<div class="lsval">'+replaceChars(localStorage[key])+'</div>'+
      '</div>';
    }
    return res;
  }
  vkLsDelVal=function(key_){
    localStorage.removeItem(key_);
    ge('LsList').innerHTML=vkGetLsList();
    ge("LsEditNode").innerHTML='';
  }
  vkLsSaveVal=function(key_){
    localStorage[key_]=ge('LsValEdit').value;
    ge('LsList').innerHTML=vkGetLsList();
    //ge("LsEditNode").innerHTML='';
  }  
  vkLsNewKey=function(key_){
    localStorage.removeItem(key_);
    ge('LsList').innerHTML=vkGetLsList();
    el=ge("LsEditNode");
    el.innerHTML='<u>Key:</u> <input type="text" id="LsValNameEdit"/><br>'+
                 '<u>Value:</u><br><textarea id="LsValEdit" rows=5 cols=86  style_="height:100px; width:100%;"></textarea><br>'+
                 '<div style="padding-top:5px;">'+vkRoundButton(['Save key',"javascript:vkLsSaveNewVal()"])+'</div>';

  }
  vkLsSaveNewVal=function(){
    var key_=ge('LsValNameEdit').value;
    localStorage[key_]=ge('LsValEdit').value;
    ge('LsList').innerHTML=vkGetLsList();
    vkLsEdit(key_);
    //ge("LsEditNode").innerHTML='';
  }
  vkLsEdit=function(_key){
    el=ge("LsEditNode");
    el.innerHTML='<u>Key:</u> <b>'+_key+'</b><br>'+
                 '<u>Value:</u><br><textarea id="LsValEdit" rows=5 cols=86  style_="height:100px; width:100%;">'+localStorage[_key]+'</textarea><br>'+
                 '<div style="padding-top:5px;">'+vkRoundButton(['Save key',"javascript:vkLsSaveVal('"+_key+"')"],['Delete key',"javascript:vkLsDelVal('"+_key+"')"])+'</div>';
    el=geByClass('lsrow_sel')[0];
    if (el) el.className='lsrow';
    ge('lsrow_'+_key).className='lsrow_sel';
  }  
  var html='<div class="lstable" id="LsList">';
  html+=vkGetLsList();
  html+='<div style="clear:both"></div></div>';
  html+='<div style="padding-top:5px;">'+vkRoundButton(['New key',"javascript:vkLsNewKey()"])+'</div>';
  html+='<div id="LsEditNode" style="padding-top:10px;"></div>';

  Box.content(html).show(); 
}
var SetsOnLocalStore={
  'remixbit':'c',
  'remixumbit':'c',
  'IDNew':'c',
  'AdmGr':'c',//last of cookie
  'vkplayer':'c',
  'FavList':'s',
  'GrList':'s',//myGrList
  'VK_CURRENT_CSS_URL':'s',
  //'VK_CURRENT_CSS_CODE':'s'
  'WallsID':'s'
}

function vkLoadVkoptConfigFromFile(){
  vkLoadTxt(function(txt){
    try {
      var cfg=eval('('+txt+')');
      /*alert(print_r(cfg));*/
      for (var key in cfg) if (cfg[key]) 
        vksetCookie(key,cfg[key]);
      alert(IDL('ConfigLoaded'));
    } catch(e) {
      alert(IDL('ConfigError'));
    }
  },['JSON File (vkopt config *.json)','*.json']);
}

function vkGetVkoptFullConfig(){
  var sets={
    remixbit:vkgetCookie('remixbit'),
    remixumbit:vkgetCookie('remixumbit'),
    AdmGr:vkgetCookie('AdmGr'),
    FavList:vkGetVal('FavList'),
    //VK_CURRENT_CSS_URL:vkGetVal('VK_CURRENT_CSS_URL'),
    WallsID:vkGetVal('WallsID')
  }
  
  var temp=[];
  for (var key in sets) if (sets[key]) temp.push(key+':'+'"'+sets[key]+'"');
  var config='{\r\n'+temp.join(',\r\n')+'\r\n}';
  vkSaveTxt(config,'vksetts_id'+remixmid()+'.json');
  //alert(config);
}

function vksetCookie(cookieName,cookieValue,nDays,domain)
{
	if (vkLocalStoreReady() && SetsOnLocalStore[cookieName]){
    vkSetVal(cookieName,cookieValue);
  } else {
    var today = new Date();
  	var expire = new Date();
  	if (nDays==null || nDays==0) nDays=365;
  	expire.setTime(today.getTime()+ 3600000*24*nDays);
  	document.cookie = cookieName+ "="+ escape(cookieValue)+
  	";expires="+ expire.toGMTString()+
  	((domain) ? ";domain=" + domain : ";domain="+location.host);
	}
	if (cookieName=='remixbit') SettBit=cookieValue;//vksetCookie('remixbit',SettBit);

}

function vkgetCookie(name,temp){
  if (name=='remixbit' && SettBit && !temp) return SettBit;
  if (name=='remixmid') { if (temp) return false; else { tmp=remixmid(); return tmp; } }
  if (vkLocalStoreReady() && SetsOnLocalStore[name]){
    var val=vkGetVal(name);
    if (val) return val;
  }
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1){
		begin = dc.indexOf(prefix);
		if (begin != 0) return null;
	}	else	{		begin += 2;	}
	var end = document.cookie.indexOf(";", begin);
	if (end == -1)	{		end = dc.length;	}
	return unescape(dc.substring(begin + prefix.length, end));
}


function vkAddScript(jsrc){
  for (var i=0;i<arguments.length;i++){  
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = arguments[i];
    document.getElementsByTagName('head')[0].appendChild(js);
  }
}

function unixtime() { return Math.round(new Date().getTime());}

//javascript: vkWaitForFunc('initSearch',alert); void(0);
//javascript: vkWaitForFunc('initSearch',alert,0,5,alert); void(0);
function vkWaitForFunc(func,callback,check_timeout,check_count,fail_callback){ 
      Inj.Wait(func,callback,check_timeout,check_count,fail_callback);
}
function Inject2Func(func,inj_code,to_end){ 
    if (to_end)  
      Inj.End(func,inj_code);
    else 
      Inj.Start(func,inj_code);
}
function Inject2Func_2(func,inj_code,after_str){ Inj.After(func,after_str,inj_code); }
function RepCodeInFunc(func,inj_code,rep_str){   Inj.Replace(func,rep_str,inj_code); }

/* Injection to JsFunctions Lib  */
Inj={// KiberInfinity's JS_InjToFunc_Lib
	FRegEx:new RegExp("function.*\\((.*)\\)[\\s\\S]{0,1}{([\\s\\S]+)}$","im"),
	DisableHistrory:false,
	History:{},
	Wait:function(func,callback,check_timeout,check_count,fail_callback){
	  if (check_count == 0) {
		if (fail_callback) fail_callback('WaitForFunc out of allow checkes');
		return;
	  }
	  if (check_count) check_count--;
	  func_=func;
	  if (typeof func == 'string') func_=eval('window.'+func);
	  if (!check_timeout) check_timeout=1000;
	  if (func_) callback(func_);
	  else return   setTimeout(function(){Inj.Wait(func,callback,check_timeout,check_count,fail_callback)},check_timeout);
	  return false;
	},
	inHistory: function(args){
    var arr=Inj.History[args[0]];
    if (!arr || Inj.DisableHistrory) return false;
    var h=Array.prototype.join.call(args, '#_#');//args.join('#_#');
    for (var i=0; i<arr.length;i++) if (arr[i]==h) return true;
    return false;
  },
  toHistory: function(args){
    if (Inj.DisableHistrory) return;
    if (!Inj.History[args[0]]) Inj.History[args[0]]=[];
    Inj.History[args[0]].push(Array.prototype.join.call(args, '#_#'));
  },
	Parse:function(func){return String(eval(func)).match(Inj.FRegEx)},
	Make:function(func,arg,code,args){
    if (Inj.inHistory(args)) return;
	  eval(func+'=function('+arg+'){'+code+'}');
	  Inj.toHistory(args);
  },
	Start:function(func,inj_code){
	  var s=Inj.Parse(func);
	  Inj.Make(func,s[1],inj_code+' '+s[2],arguments);
	},
	End:function(func,inj_code){
	  var s=Inj.Parse(func);
	  Inj.Make(func,s[1],s[2]+' '+inj_code,arguments);
	},
	Before:function(func,before_str,inj_code){
	  var s=Inj.Parse(func);
	  var orig_code=((typeof before_str)=='string')?before_str:s[2].match(before_str);
	  s[2]=s[2].split(before_str).join(inj_code+' '+orig_code+' ');//maybe split(orig_code) ?
	  Inj.Make(func,s[1], s[2],arguments);
	},
	After:function(func,after_str,inj_code){
	  var s=Inj.Parse(func);
	  var orig_code=((typeof after_str)=='string')?after_str:s[2].match(after_str);
	  s[2]=s[2].split(after_str).join(orig_code+' '+inj_code+' ');//maybe split(orig_code) ?
	  Inj.Make(func,s[1], s[2],arguments);
	},
	Replace:function(func,rep_str,inj_code){
	  var s=Inj.Parse(func);
	  s[2]=s[2].replace(rep_str,inj_code);//split(rep_str).join(inj_code);
	  Inj.Make(func,s[1], s[2],arguments);
	}
}
//////////////////


function vkInject2Ajax(){
var tstart=unixtime();
var dloc=document.location.href;
if (dloc.match(/blog\.php/)) return;


  /* FOR NEW AJAX NAV*/
  if (window.nav && window.nav.go){
    Inj.Start('nav.go','if (getSet(88)=="y") return true;');
    Inj.After('nav.go',"handlePageParams(params);",'onChangeContent();');//if(cur.section=="profile"){ /* alert(\'qwe\');*/ vkPageProfile();}
    if (window.profile)
      Inj.After('profile.init','});','vkPageProfile();VkoptAudio(); vkClosed();');
    if (window.wall && wall.receive)
      Inj.End('wall.receive','onChangeContent(); VkoptAudio();');
      //Inj.End('profile.init','vkPageProfile(); vkClosed();');
  }
 
    //alternative profile
    //if (getSet(67)=='y'){RepCodeInFunc('friendFilter',"AlternativeProfile(\"+res[i][0]+\"); hide('qfriends'); toggleFlash(true, 20);",'window.location=\'"+base_domain+"id"+res[i][0]+"\'');}


  if (window.showWallHistory) {
    Inject2Func_2("showWallHistory","onChangeContent(); VkoptAudio(true); vkDownLinkOnWall();","setupReply();");
    RepCodeInFunc("showReplies","r.innerHTML = t; onChangeContent();","r.innerHTML = t;");
    
  }
  if(typeof getWallPage!='undefined' && ge('wall')) {//wall
    Inject2Func_2("getWallPage","InitWallExt(); onChangeContent(); VkoptAudio(true); vkDownLinkOnWall();","setupReply();");
    
    if (window.postWall){
    Inject2Func_2("postWall","InitWallExt(); onChangeContent(); VkoptAudio(true);  ","res.html;");}
    if (typeof postIt=="function"){
    Inject2Func_2("postIt","InitWallExt(); onChangeContent(); VkoptAudio(true);  ","r.html;");}
  }
  

  if (vkBlockRedirect){//block  redirect from wall to profile when send media
    injcode="  (!location.href.match(/to_id=-/i))?'wall.php?id='+location.href.match(/to_id=(\\\d+)/i)[1]:";
    if (typeof postAudioOnWall!='undefined'){  Inject2Func_2("postAudioOnWall",injcode,"window.location =");}    // (vkBlockRedirect)?((!location.href.match(/to_id=-/i))?'wall.php?id='+location.href.match(/to_id=(\\\d+)/i)[1]:'wall.php?gid='+location.href.match(/to_id=-(\\\d+)/i)[1]):" - with group
    if (typeof postVideoOnWall!='undefined'){  Inject2Func_2("postVideoOnWall",injcode,"window.location =");}
    if (typeof post_on_wall   !='undefined'){  Inject2Func_2("post_on_wall",injcode,"window.location =");} //photo
    injcode="  (true)?'wall.php?id='+ge('header').innerHTML.match(/id(\\\d+)/i)[1]:";     //graffiti
    //'wall.php?id='+ge('header').innerHTML.match(/(gid=\d+)|(id\D*\d+)/i)[1]
    if (typeof post_to_wall   !='undefined'){  
      //Inject2Func_2("post_to_wall",injcode,"window.location =");
      vkGrRedirToWall=function(text){
        if (text.match(/club\d+/)){
          window.location = text;
        } else {
          getUserID(text,function(uid){ window.location = 'wall.php?id='+uid;  });//.match(/^.(.+).$/)[1]
        }
      }
      RepCodeInFunc('post_to_wall',"vkGrRedirToWall(r.url);","window.location = r.url;");
    }
     
  }
  
  if (dloc.match(/wall.php\?act=s/)){
    Inject2Func('onGetResults','onChangeContent(); VkoptAudio(true);',true);
    Ajax.History('wall.php', js_data, onGetResults, onError);
  }

  if (dloc.match('gifts.php')){  
      ajaxHistory.prepare({
        url: 'gifts.php',
        def: prepareDefaultQuery(),
        done: function(r, t) {
          var response = t.split('<!>');
          if (response[0]) ge('header').firstChild.innerHTML = response[0];
          if (response[1]) ge('summary').innerHTML = response[1];
          hide('progress_top', 'progress_bottom');
          ge('pagesTop').innerHTML = ge('pagesBottom').innerHTML = response[2] ? response[2] : '';
          if (response[3]) {
            ge('main_panel').innerHTML = response[3];
            window.scroll(0, 0);
          }
          if (response[4]) ge('side_panel').innerHTML = response[4];
          if (response[5]) eval(response[5]);
          onChangeContent();
        }
      });
      
  }
  if (dloc.match('gsearch.php')){     // gsearch.php
   //Inject2Func("updatePage","vk_onChangeGSearch();",true);
   RepCodeInFunc("updatePage","vk_onChangeGSearch(); return cache;","return cache;");
   var apdef=ge('content').innerHTML;
   var re=new RegExp("ajaxHistory.prepare\\({[\\s\\S]+(def\\:.*})","im");
   apdef=apdef.match(re)[1];
   eval('ajaxHistory.prepare({url: ajaxPath, done: updatePage,'+apdef+' });');
  }

  if(dloc.match('/topic')){ //topics
    Inject2Func("posts_or_topics_page_loaded","SetClickPostIndex(); onChangeContent(); ",true);
    var re=new RegExp("ajaxHistory.prepare\\({[\\s\\S]+def\\:.*}","im");
    var aptop=ge('content').innerHTML.match(re);
    aptop+=",ignoreHash: 'scroll'});";
    //alert(aptop);
    eval(aptop);
    if(typeof post_answer!='undefined'){Inject2Func_2("post_answer","onChangeContent(); SetClickPostIndex();","text + ')'), true);");}
  }


  if(typeof getSixMembers!='undefined') {//getSixMembers(in groups main page)
    Inject2Func_2("getSixMembers","onChangeContent(); ","parseResponse(text);");
  }
  if (dloc.match('mail.php')){ 
   Inject2Func("onMessagesUpdate","onChangeContent(); ",true);
   ajaxHistory.prepare({ url: location.pathname+location.search,   done: onMessagesUpdate });
  }

  if (dloc.match('friends.php')){    //friends
   Inject2Func_2("onListRender","onChangeContent(); ","results.innerHTML = tmp;");
   Inject2Func_2("onListRender","onChangeContent(); ","(results.innerHTML + buffer);");
   Inject2Func_2("loadFriends","onChangeContent(); ","hide('progressTop');");
  }

  if (dloc.match('/note')){       //notes
    Inject2Func_2("postComment","onChangeContent(); ","responseText;");
    /*getPageContent=function(offset, inTop, afterFunc, obj) {
        var vkAfterFunc=function(vkparams){
          if  (afterFunc) afterFunc(vkparams);
          onChangeContent();
        }
        pagination.getPageContent(offset, inTop, vkAfterFunc, obj);
    }*/
  }
  
  if(dloc.match('newsfeed.php')){  //news
    //Inject2Func("onGetResults","if (r.insert || r.pages || newsSection == 'statuses'){ onChangeContent(); vkPageNews(); }",true);
    Inject2Func("onAutoUpdate","if (response.insert || response.pages || newsSection == 'statuses'){ onChangeContent(); vkPageNews(); } ",true);
    RepCodeInFunc("onGetResults","setupReply();if (r.insert || r.pages || newsSection == 'statuses'){ onChangeContent(); vkPageNews(); }","setupReply();");

    Ajax.History('newsfeed.php', {section:newsSection}, onGetResults);//
  }

  if (dloc.match(/video.+_\d+/i)){
  //Inject2Func_2("removeTag","IDNamesInColsV()","hide('message');");
  //Inject2Func_2("confirmTag","IDNamesInColsV()","hide('message');");
  Inject2Func("finishedTagOp","onChangeContent(); if (getSet(7) == 'y') IDNamesInColsV();",true);//,"hide('message');");
  
  
  }
  
  if (dloc.match(/fans\.php/i)){
    Inject2Func("onHistory","onChangeContent();",true);
    Ajax.History('fans.php', fans_data, onHistory);
  }  
  

  
  if (dloc.match("audio.php")){  InjAudio();  } //audio 
  
  if(typeof getPageContent!='undefined') {//comments: video
    var expl=(typeof AddPlayerCtrl!='undefined' && getSet(53) == 'y')?' AddPlayerCtrl();':'';   //For ExPlayer
    Inject2Func("getPageContent","afterFunc=function(){"+expl+"onChangeContent();VkoptAudio(true);};");//+for audio page
    Inject2Func_2("pagination.init","onChangeContent(); ",".afterFunc(params);");
    if (typeof postIt!='undefined'){
    Inject2Func_2("postIt","onChangeContent(); ","= text;");}
  }


  if (dloc.match(/\/photo-{0,1}\d+_\d+.*/i) || dloc.match(/photos.php.+act=show/i)){ // for photo  photos.php.act=show&id=xxxxx_yyyy
    vkOnPhotoChange=function(){
        if (getSet(7)  == 'y') IDNamesInColsP();
        if (getSet(14) == 'y') IDPhotoSelect();
        TxtMainFcn();
        vkPhotosMakeLink();
        }
    Inject2Func("gotComments","onChangeContent();",true);
    Inject2Func("gotPhotoInfo","onChangeContent(); vkOnPhotoChange();",true);
    Inject2Func_2("postComment","onChangeContent(); ","text;");

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


      	ajaxHistory.prepare("pages", {
      		url:'photos.php',
      		done: gotComments,
      		fail: failedComments,
      		before: function(params){
      			return (params.id == cur_photo);
      		},
      		show: {
      			to: function(p) { return p.st; },
      			from: function(p) { return {act: 'a_comments', id:cur_photo, st: p };}
      		},
      		def: {act:'a_comments', id:cur_photo, st: last_page}
      });
	
       ajaxHistory.init();

	  }
  }

  if (typeof doSaveQuestion!='undefined'){ //questions
    Inject2Func_2("makeFRequest"," onChangeContent(); ","responseText;");
    Inject2Func_2("postIt"," onChangeContent(); ","responseText;");
  }

  if (typeof appRequest!='undefined'){  //applicatons
    Inject2Func_2("alertFContents"," onChangeContent(); TxtMainFcn();","PickText;");
    Inject2Func("postCommentSuccess","onChangeContent();",true);
  }


  /*if (typeof AudioObject!='undefined'){  // inject for save audio volume
    Inject2Func_2("AudioObject.stateChanged","vksetCookie('audio_vol',vkgetCookie('audio_vol'));",'createCookie("audio_vol", this.curVolume);');
  }*/

  //injection for club adminka in vk_club.js

vklog('Inj2Func time:' + (unixtime()-tstart) +'ms');
}   //end of main injections.

function onChangeContent(){
  var tstart=tend=unixtime();
  //BlockProfileLinks();
  //PrepareUserPhotoLinks();
  AddExUserMenu();
  vkModLink();
  vk_LightFriends_init();
  MsgObajaxingLink();
  vkSmiles();
  TxtMainFcn();
  vklog('onChangeContent:' + (unixtime()-tstart) +'ms');
}


function vk_onChangeGSearch(){
 if (geByClass('audioRow')[0]){
  //alert('audio');
  RemDuplMain();//audio
  VkoptAudio();
  
 }
if (geByClass('videoResults')[0]) vkVideoDubRemove();
onChangeContent();
}

function getScrH(){ return window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight);}
function getScrollTop(){ return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop)}
function vkRand(){
return Math.round((Math.random() * (100000000 - 1)));
}
//////////////////////////////////////
/////////Captcha for userapi//////////
/////////////////////////////////////

var Globcallback="";
var retCaptBoxCol=Array();
var numCaptBox=-1;

function addCaptBox(addr){
if (typeof vCapBox=='undefined' || vCapBox==""){
        CaptBox(addr);
    }else{
        retCaptBoxCol[retCaptBoxCol.length]=addr;
    }
}

function retCaptBox(){
    if(retCaptBoxCol!="" && (numCaptBox+2)<=retCaptBoxCol.length){
        numCaptBox++;
        CaptBox(retCaptBoxCol[numCaptBox]);
    }else{
        Globcallback="";
        retCaptBoxCol=Array();
        numCaptBox=-1;
    }
}

function CaptBox(callback){
Globcallback=callback;
try{
vCapBox.hide();
}catch(e){}
var cssid=vkRand();
  vCapBox = new MessageBox({title: '<center>Captcha</center>',width: 200});
  vCapBox.content('<center id="testID"><div id="captcha" align="center"><img src="http://userapi.com/data?act=captcha&csid='+cssid+'" OnClick="CaptBox(Globcallback)"/></div><br><input name="textCap" onKeyPress="if (event.keyCode==13 || (event.ctrlKey && event.keyCode==13)) {Globcallback(\'&fcsid='+cssid+'&fccode=\'+ge(\'captcha_text\').value);vCapBox.hide(200);setTimeout(\'retCaptBox();\',400);}" id="captcha_text" value="" /></center>');
  vCapBox.setOptions({onHide: function(){vCapBox.content('');vCapBox="";}});
  vCapBox.removeButtons();
  vCapBox.addButton({
  onClick: function(){
     vCapBox.hide(200);
     setTimeout("retCaptBox();",400);
  },
  style:'button_no',
  label: IDL('Cancel')
  }).addButton({
  onClick: function(){
    callback('&fcsid='+cssid+'&fccode='+ge('captcha_text').value);
    vCapBox.hide(200);
    setTimeout("retCaptBox();",400);
//    alert(ge('captcha_textRand').value);
  },
  label: IDL('Send')
  });
  vCapBox.show();
}

//////////////////////////////////////
///////END Captcha for userapi////////
/////////////////////////////////////
function remixsid() {return vkgetCookie('remixsid');}
function remixmid() {
  if (vk.id) return String(vk.id);
  var sidebar=(ge('sideBar') || ge('side_bar'));
  if (typeof im!='undefined') return im.id;
  if (sidebar) tmp=(sidebar.innerHTML.match(/mail\.php/)?sidebar.innerHTML.match(/mail\.php\?id=(\d+)/)[1]:''); 
  return tmp;
}
if (!window.ge) ge=function(q) {return document.getElementById(q);}

function vkMkDate(raw) {
  var result = new Date(raw * 1000), now = new Date();
  if (result.getDay() == now.getDay()) {
    return result.toLocaleTimeString();
  }
  var pad = function(num) {
      return ((num + '').length < 2) ? ('0' + num) : num;
  }
    return pad(result.getDate()) + '.' + pad(result.getMonth()+1) + '.' + (result.getFullYear() + '').substr(2);
}

function getSet(num,type) {
  if (!SettBit){
  if (!vkgetCookie('remixbit')) return null;}
  if (!SettBit) SettBit=vkgetCookie('remixbit');
  if (!type || type==null) type=0;
  if (num=='-') return SettBit.split('-')[type];
  
  var bit=SettBit.split('-')[type].charAt(num);
  if (!bit) bit=DefSetBits.split('-')[type].charAt(num);
  if (!bit) return 'n';
  else return bit;
}

function setSet(num,type,setting) {
if (!setting) setting=0;
settings=vkgetCookie('remixbit').split('-');
if (num=='-') settings[setting]=type;
else settings[setting][num]=type;
SettBit = settings.join('-');
vksetCookie('remixbit',SettBit);
}

function setCfg(num,type) {
allsett=vkgetCookie('remixbit').split('-');
sett=allsett[0].split('');
sett[num]=type;
allsett[0]=sett.join('');
SettBit = allsett.join('-');//settings.allsett('-');
vksetCookie('remixbit',SettBit);
}

function delCookie(name, path, domain) {
	if ( vkgetCookie( name ) ) document.cookie = name + '=' +
	( ( path ) ? ';path=' + path : '') +
	( ( domain ) ? ';domain=' + domain : '' ) +
	';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}

////////////////
// VkOpt Ajax //
////////////////
function PrepReq() {
  var tran = null;
  try { tran = new XMLHttpRequest(); }
  catch(e) { tran = null; }
  try { if(!tran) tran = new ActiveXObject("Msxml2.XMLHTTP"); }
  catch(e) { tran = null; }
  try { if(!tran) tran = new ActiveXObject("Microsoft.XMLHTTP"); }
  catch(e) { tran = null; }
return tran;}

function urlEncData(data) {
    var query = [];
    if (data instanceof Object) {
        for (var k in data) {
            query.push(encodeURIComponent(k) + "=" +
            		encodeURIComponent(data[k]));
        }
        return query.join('&');
    } else {
        return encodeURIComponent(data);
    }
}
var vkAjTransport={};
function AjGet(url, callback,unsyn) {
var request = (vkAjTransport.readyState == 4 || vkAjTransport.readyState==0)? vkAjTransport:PrepReq();
vkAjTransport=request;
if(!request) return false;
  request.onreadystatechange = function() {
  if(request.readyState == 4 && callback) callback(request,request.responseText);
};
  //unsyn=!unsyn;
  request.open('GET', url, !unsyn);
  request.send(null);
  return true;
}


function AjPost(url, data, callback) {
    var request = PrepReq();
    if(!request) return false;
    request.onreadystatechange  = function() {
            if(request.readyState == 4 && callback) callback(request,request.responseText);
        };
    request.open('POST', url, true);
    if (request.setRequestHeader)
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");//*/
    request.send(urlEncData(data));
    return true;
}
//////////////
// Ajax end //
//////////////

function p_req() {
   var http_request = false;
       http_request = new XMLHttpRequest();
    if (http_request.overrideMimeType)
       {

       }
    if (!http_request) {
       alert('XMLHTTP Error'); return false;
	return http_request;
    }
}


function inArr(arr,item){
  for (var i=0;i<arr.length;i++)
    if (arr[i]==item) return [true,i];
  return false;
}
/*VK GUI*/
/*function vkProgressBar(val,max,width){
		var pos=val*100/max;
		html='<div align="left" class="vkProgressBarBg" style="width: '+width+'px;">'+
			'<div class="vkProgressBarFr" style="width: '+pos+'%;"> </div>'
		'</div>';
		return html;
}*/
//javascript:   var x=0;  setInterval("ge('content').innerHTML=vkProgressBar(x++,100,600,'Выполнено %');",100);  void(0);  
function vkProgressBar(val,max,width,text){
		if (val>max) val=max;
    var pos=val*100/max;
		var perw=(val/max)*width;
		text=(text || '%').replace("%",pos+'%');
		html='<div class="vkProgBar vkPBFrame" style="width: '+perw+'px;">'+
				'<div class="vkProgBar vkProgBarFr" style="width: '+width+'px;">'+text+'</div>'+
			'</div>'+
			'<div  class="vkProgBar vkProgBarBgFrame" style="width: '+width+'px;">'+
				'<div class="vkProgBar vkProgBarBg" style="width: '+width+'px;">'+text+'</div>'+
			'</div>';
		return html;
}

function vkRoundButton(){ //vkRoundButton(['caption','href'],['caption2','href2'])
  var html='<div>';//'<ul class="nNav" style="display:inline-block">';
  for (var i=0;i<arguments.length;i++){
    var param=arguments[i];
    /*html+='<li><b class="nc"><b class="nc1"><b></b></b><b class="nc2"><b></b></b></b><span class="ncc">'+
          '<a href="'+param[1]+'">'+param[0]+'</a>'+
          '</span><b class="nc"><b class="nc2"><b></b></b><b class="nc1"><b></b></b></b></li>';*/
    html+='<a class="vk_button" href="'+param[1]+'">'+param[0]+'</a>';
  }
  html+='</div>'//'</ul>';
  return html;
}
function vkMakePageList(cur,end,href,onclick,step,without_ul){
 var after=2;
 var before=2;
 if (!step) step=1;
 var html=(!without_ul)?'<ul class="pageList">':'';
    if (cur>before) html+='<li><a href="'+href.replace(/%%/g,0)+'" onclick="'+onclick.replace(/%%/g,0)+'">&laquo;</a></li>';
    var from=Math.max(0,cur-before);
    var to=Math.min(end,cur+after);
    for (var i=from;i<=to;i++){
      html+=(i==cur)?'<li class="current">'+(i+1)+'</li>':'<li><a href="'+href.replace(/%%/g,(i*step))+'" onclick="'+onclick.replace(/%%/g,(i*step))+'">'+(i+1)+'</a></li>';
    }    
    if (end-cur>after) html+='<li><a href="'+href.replace(/%%/g,end)+'" onclick="'+onclick.replace(/%%/g,end)+'">&raquo;</a></li>';
  html+=(!without_ul)?'</ul>':'';
  return html; 
}

function vkMakeTabs(menu,return_ul_element){
  vkTabsSwitch = function(el){
    var nodes=geByClass("activeLink",el.parentNode);
    if (nodes[0]) nodes[0].className="";
    el.className="activeLink";
  };
  //vkaddcss();  
  var html='';
  for (var i=0;i<menu.length;i++){
    /*
    html+='<li '+(menu[i].active?"class='activeLink'":"")+' onclick="vkTabsSwitch(this);">'+
          '<a href="'+menu[i].href+'" '+(menu[i].onclick?'onclick="'+menu[i].onclick+'"':"")+(menu[i].id?'id="'+menu[i].id+'"':"")+'><b class="tl1"><b></b></b><b class="tl2"></b>'+
          '<b class="tab_word">'+menu[i].name+'</b></a></li>';
    //*/ 
    //*
    html+='<li '+(menu[i].active?"class='activeLink'":"")+' onclick="vkTabsSwitch(this);">'+
          '<a href="'+menu[i].href+'" '+(menu[i].onclick?'onclick="'+menu[i].onclick+'"':"")+(menu[i].id?'id="'+menu[i].id+'"':"")+'>'+
          '<b class="tab_word">'+menu[i].name+'</b></a></li>';
    //*/
  }
  
  if (!return_ul_element){
    //html='<ul class="t0">'+html+'</ul>';
    html='<ul class="vk_tab_nav">'+html+'</ul>';
    return html;
  } else {
    var ul=document.createElement("ul");
    ul.className="vk_tab_nav";
    ul.innerHTML=html;
    return ul;
  }
}

function vkArr2Arr(arr){
  var new_arr=[]; 
  for (var i=0; i<arr.length; i++) new_arr.push(arr[i]);
  return new_arr;
}
function vkMakeContTabs(trash){
  if (!window.vkContTabsCount) {
    vkContTabsCount=1;
    vkaddcss(".activetab{display:block} .noactivetab{display:none} ")
  } else vkContTabsCount++;
  j=vkContTabsCount;
  vkContTabsSwitch=function(idx,show_all){
        var ids=idx.split("_");
        if (show_all){
          nodes=vkArr2Arr(geByClass("noactivetab",ge('tabcontainer'+ids[0])));
          var nds=[]; for (var i=0; i<nodes.length; i++) nds.push(nodes[i]);
          for (var i=0; i<nodes.length; i++)  
            nodes[i].className="activetab";
        } else {
          var nodes=vkArr2Arr(geByClass("activetab",ge('tabcontainer'+ids[0])));
          for (var i=0; i<nodes.length; i++) nodes[i].className="noactivetab"; 
          //while(nodes[0]) nodes[0].className="noactivetab";
        }
        
       var el=ge("tabcontent"+idx);
       //if (!show_all) 
       el.className=(!show_all)?"activetab":"noactivetab";
  }
  var menu=[];
  var tabs="";
  for (var i=0;i<trash.length;i++){
      menu.push({name:trash[i].name,href:'#',id:'ctab'+j+'_'+i, onclick:"this.blur(); vkContTabsSwitch('"+j+'_'+i+"'"+(trash[i].content=='all'?',true':'')+"); return false;",active:trash[i].active});
      tabs+='<div id="tabcontent'+j+'_'+i+'" class="'+(!trash[i].active?'noactivetab':'activetab')+'">'+trash[i].content+'</div>';
  }
  var html='<div class="clearFix vk_tBar">'+vkMakeTabs(menu)+'<div style="clear:both"></div></div><div id="tabcontainer'+j+'" style="padding:1px;">'+tabs+'</div>';
  return html;
}
// javascript: ge('content').innerHTML=vkMakeContTabs([{name:'Tab',content:'Tab1 text',active:true},{name:'Qaz(Tab2)',content:'<font size="24px">Tab2 text:qwere qwere qwee</font>'}]); void(0);
/*END OF VK GUI*/
String.prototype.leftPad = function (l, c) {
    return new Array(l - this.length + 1).join(c || '0') + this;
};
/// begin color functions
function rgb2hex(rgb) {
    //rgbcolor=Array(255,15,45)
    return "#".concat(rgb[0].toString(16).leftPad(2), rgb[1].toString(16).leftPad(2), rgb[2].toString(16).leftPad(2));
}

function hex2rgb(hexcolor) {
    //example hexcolor='#34A235' or hexcolor='34A235'
    var hex = hexcolor;
    if(hex.substr(0, 1) == "#"){
        hex = hex.substr(1);
    }
    return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
}
/// end of color functions
vk_utils = {
	lastLength:0,
	 checkTextLength:function(max_len, val, warn, exceedFunc, remainFunc){
    if(this.lastLength==val.length)return;
		this.lastLength=val.length;
		n_len = this.replaceChars(val).length;
		if (n_len > max_len) {
			var n_plus = n_len - max_len;
			warn.style.display = "";
			warn.innerHTML = langNumeric(n_plus, text_exceeds_symbol_limit);
		} else if (n_len > max_len - 100) {
			var n_rem = max_len - n_len;
			warn.style.display = "";
			warn.innerHTML = langNumeric(n_rem, text_N_symbols_remain);
		} else {
			warn.style.display = "none";
			warn.innerHTML = '';
		}
   },
    replaceChars:function(text){
		var res = "";
		temp = "";
		for(var i =0; i<text.length; i++){
			var c = text.charCodeAt(i);
			temp+=c+",";
			if((c > 0x80 && c < 0xC0) || c>0x500){
				res += "&#"+c+";";
			}else{
				switch(c){
					case 0x26:res+="&amp;";break;
					case 0x3C:res+="&lt;";break;
					case 0x3E:res+="&gt;";break;
					case 0x22:res+="&quot;";break;
					case 0x0D:res+="";break;
					case 0x0A:res+="<br>";break;
					case 0x21:res+="&#33;";break;
					case 0x27:res+="&#39;";break;
					default:res+=text.charAt(i);break;
				}
			}
		}
		return res;
	  }
}

function vkDebugWin(text){
  if (vk_DEBUG){
    A='<plaintext>'+text;
    var B = window.open('about:blank', '_blank');
    var C = B.document;
    C.write(A);
    C.close();
  }
}

//////////////////////
// for color select //
var pickers = [];
function init_colorpicker(target, onselect){
    for(var i = pickers.length; p = pickers[--i];){
        if(p == target){
            return;
        }
    }
    pickers.push(target);
    var p_imgs = {
        boverlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKxSURBVHja7NoxCoRAFAXBcfD+ZzYxEkxEDXqqYC9g0Dy/OwawrO38AQuaHgGsa7cAwAIALADAAgAsAMACACwAQAAArwCABQBYAIAFAAgA4BUAsAAAAQC8AgAWACAAgAAAbgCABQAIACAAgBsAYAEAAgAIACAAwDOOgGABAAIACAAgAIAAAAIA5PgMCBYAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAcBeA6TGABQAIACAAgAAAAgAIACAAQCYA/gcAFgAgAIAAAAIACAAgAEAuAD4DggUACAAgAIAAAPEAOAKCBQAIACAAgAAA8QA4AoIFAAgAIACAAADxADgCggUACAAgAIAAAPEAOAKCBQAIACAAgBsAYAEAAgAIAOAGAFgAgAAAAgC4AQAWACAAgAAAbgCABQAIACAAgBsAYAEAAgAIACAAwAcBcAQECwAQAEAAADcAwAIABAAQAMANALAAAAEABABwAwAsAEAAAAEA3AAACwAQAEAAAAEAfg6AIyBYAIAAAAIACAAQD4AjIFgAgAAAAgAIABAPgCMgWACAAAACAAgAEA+AIyBYAIAAAAIACAAgAIAAALkA+AwIFgAgAIAAAAIACAAgAIAAAJ0A+B8AWACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIADA1fQIwAIABAAQAEAAAAEABACo8RkQLABAAAABAAQAiHMEBAsAEABAAAA3AMACAAQAEADADQCwAAABALwCABYAIACAVwDAAgAsAMACAAQA8AoAWACABQBYAIAFAFgAgAUAvOkQYABehQTISkChWgAAAABJRU5ErkJggg==",
        woverlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKSSURBVHja7NQ7DoAgEEDB1fufef20GgWC0DiTEAUTC5S3bIeIOEcUrqW1633N/Gmt5tnMkR3Pc/Ba73zEO3PCPnzxbWaO1v+85SzVntHbdQ3gtwQABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEAAbAFIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgC82QUYAJKU6/4c8sBCAAAAAElFTkSuQmCC",
        slider: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAEACAIAAADeB9oaAAAABGdBTUEAAK/INwWK6QAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAEwAAAQAAkVKnCwAAAIBJREFUaN7t28EJwDAQA0EdmPRfb3BwetDXc/8BPxeB56S8lTwkSZIkSZJkc3PylXKn7Lf1do4kSZIkSZKc1A3WBiNJkiRJkuT1crLLBpuc3b42ZTOSJEmSJEneLqcd0LLaYCRJkiRJkrxeTjugZdoBLasNRpIkSZIkyevl1L84fwRHjsI0XIO/AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDEwLTEyLTE2VDA1OjIyOjM3KzAyOjAwHwrr1gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0xNlQwNToyMjozNyswMjowMG5XU2oAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
        arrows: "data:image/gif;base64,R0lGODlhKQAJAJECAP///25tbwAAAAAAACH5BAEAAAIALAAAAAApAAkAAAIvVC6py+18ggFUvotVoODwnoXNxnmfJYZkuZZp1lYx+l5zS9f2ueb6XjEgfqmIoAAAOw==",
        cursor: "data:image/gif;base64,R0lGODlhDAAMAJECAOzp2AAAAP///wAAACH5BAEAAAIALAAAAAAMAAwAAAIhlINpG+AfGFgLxEapxdns2QlfKCJgN4aWwGnR8UBZohgFADs="
    };
    var picker = $c("div", {style: "width: 275px;height: 286px; position: absolute; background: #fff; border: 4px solid #ccc; z-index: 1500;"});
    var slider, palette, cursor, arrows, col, offsetcol, apply, cancel, val;
    picker.appendChild($c("div", {style: "clear: both;", kids: [
        col = $c("div", {style: "margin: opx; float:left; height: 28px; width: 50px; border: 1px solid #000; background: #f00;"}),
        val = $c("input", {type: "input", value: "#ff0000", style: "width: 100px;"}),
        apply = $c("input", {type: "button", value: "OK"}),
        cancel = $c("input", {type: "button", value: "Cancel"})
    ]}));
    offsetcol = 30;//col.offsetHeight;
    picker.appendChild(palette = $c("div", {style: "width: 256px; height: 256px; float: left; background: #f00;", draggable: "false", kids: [
        $c("img",{src: p_imgs.woverlay, style: "position: absolute", draggable: "false"}), 
        $c("img",{src: p_imgs.boverlay, style: "position: absolute", draggable: "false"}),
        cursor = $c("img",{src: p_imgs.cursor, id: "p_cursor", style: "position: absolute; z-index:1000; margin: -6px -6px; left: 255px;", draggable: "false"})
    ]})); 
    picker.appendChild(slider = $c("div", {style: "float: left;", draggable: "false", kids: [
        arrows = $c("img",{src: p_imgs.arrows, style: "position: absolute; margin: -4px -11px; z-index: 1000", draggable: "false"}),
        $c("img",{src: p_imgs.slider, draggable: "false"})
    ]})); 
    var mousegpos = [0, 0],
    mousenpos = [0, 0],
    mousepos = [0, 0],
    paldown = 0,
    slddown = 0,
    lock = 0,
    hue = 0, sat = 1, bri = 1,
    color = [1, 0, 0],
    hcolor = "#ff0000", 
    bhcolor = "#ff0000", 
    heig = 255;
    function upcolor(){
        color = [0, 0, 0],
        huep = (hue * 6) | 0,
        hueo = hue * 6 - huep,
        a = (3 - ((huep / 2) | 0)) % 3,
        b = (5 - ((huep / 2) | 0)) % 3,
        nsat = 1 - sat;
        if(huep & 1){
            hueo = 1 - hueo;
            var t = a;
            a = b;
            b = t;
        }
        color[a] = 1;
        color[b] = hueo;
        hcolor = "#";
        bhcolor = "#";
        for(var i = 0; i < 3; i++){
            var t = (color[i] * 255 | 0).toString(16);
            bhcolor += (t.length == 1 ? "0" : "") + t;
            color[i] += (1 - color[i]) * nsat;
            color[i] *= bri;
            t = (color[i] * 255 | 0).toString(16);
            hcolor += (t.length == 1 ? "0" : "") + t;
        }
        val.value = hcolor;
        col.style.backgroundColor = hcolor;
        palette.style.backgroundColor = bhcolor;
    }
    function pelettemdown(e){
        var target = e.target;
        e.preventDefault();
        if(lock){
        //    return;
        }
        lock = 1;
        if(paldown) {
            mousepos = [mousepos[0] - mousegpos[0] + (e.pageX || e.x), mousepos[1] - mousegpos[1] + (e.pageY || e.y)];
        } else {
            paldown = 1;
            window.addEventListener("mousemove", pelettemdown, true);
            window.addEventListener("mouseup", bodyup, true);
            mousepos = [(e.offsetX || e.layerX), (e.offsetY || e.layerY)];
            while(target.tagName != "DIV"){
                mousepos[0] += target.offsetLeft;
                mousepos[1] += target.offsetTop;
                target = target.parentNode;
                break;
            }
            console.log(target);
            mousepos[1] -= offsetcol;
        }
        mousegpos = [(e.pageX || e.x), (e.pageY || e.y)];
        mousenpos = [mousepos[0] < 0 ? 0 : mousepos[0] > 255 ? 255 : mousepos[0], mousepos[1] < 0 ? 0 : mousepos[1] > 255 ? 255 : mousepos[1]];
        sat = mousenpos[0] / heig;
        bri = (255 - mousenpos[1]) / heig;
        cursor.style.left = mousenpos[0] + "px";
        cursor.style.top = (mousenpos[1] + offsetcol) + "px";
        upcolor();
        lock = 0;
    }
    function slidermdown(e){
        var target = e.target;
        e.preventDefault();
        if(lock){
            return;
        }
        lock = 1;
        if(slddown){
            mousepos = [mousepos[0] - mousegpos[0] + (e.pageX || e.x), mousepos[1] - mousegpos[1] + (e.pageY || e.y)];
        }else{
            slddown = 1;
            window.addEventListener("mousemove", slidermdown, true);
            window.addEventListener("mouseup", bodyup, true);
            mousepos = [(e.offsetX || e.layerX), (e.offsetY || e.layerY - offsetcol)];
            while(target.tagName != "DIV"){
                mousepos[0] += target.offsetLeft;
                mousepos[1] += target.offsetTop;
                target = target.parentNode;
                break;
            }
            mousepos[1] -= offsetcol + 4;
        }
        mousegpos = [(e.pageX || e.x), (e.pageY || e.y)];
        mousenpos = [mousepos[0] < 0 ? 0 : mousepos[0] > 255 ? 255 : mousepos[0], mousepos[1] < 0 ? 0 : mousepos[1] > 255 ? 255 : mousepos[1]];
        hue = mousenpos[1] / heig;
        arrows.style.top = (mousenpos[1] + offsetcol) + "px";
        upcolor();
        lock = 0;
    }
    function bodyup(e){
        paldown = 0;
        slddown = 0;
        window.removeEventListener("mousemove", pelettemdown, true);
        window.removeEventListener("mousemove", slidermdown, true);
        window.removeEventListener("mouseup", bodyup, true);
    }
    function onapply(e){
        //console.log(e);
        oncancel();
        onselect(hcolor);
    }
    function oncancel(e){
        target.removeChild(picker);
        for(var i = pickers.length; p = pickers[--i];){
            if(p == target){
                pickers.splice(i, 1);
            }
        }
    }
    function valkeyup(e){
        if(!/^#[\da-f]{6}$/.test(e.target.value)){ return; }
        hcolor = e.target.value;
        col.style.backgroundColor = hcolor;
    }
    palette.addEventListener("mousedown", pelettemdown, true);
    slider.addEventListener("mousedown", slidermdown, true);
    apply.addEventListener("click", onapply, false);
    cancel.addEventListener("click", oncancel, false);
    val.addEventListener("keyup", valkeyup, true);
    target.appendChild(picker);
}

FrCol_click=function(color){
    setFrColor(color);
    ge('spct11').style.backgroundColor = color;
}

MsgCol_click=function(color, id){
    setMsgColor(color);
    ge('spct10').style.backgroundColor = color;
}

function getMsgColor(){
  var cl=vkgetCookie('remixbit').split('-')[9];
  var ret="#E2E9FF";
  if (cl) ret=cl;
  return ret;
}
function setMsgColor(color) {
    var prefs=vkgetCookie('remixbit').split('-');
    prefs[9]=color;
    vksetCookie('remixbit', prefs.join('-'));
}

function getFrColor(){
  var sett=vkgetCookie('remixbit');
  if (!sett) {
  vksetCookie('remixbit',DefSetBits);
  sett=DefSetBits;
  }
  var cl=sett.split('-')[10];
  var ret="#34A235";
  if (cl) ret=cl;
  return ret;
}
function setFrColor(color) {
var prefs=vkgetCookie('remixbit').split('-');
prefs[10]=color;
vksetCookie('remixbit', prefs.join('-'));
}

// end of color select func //
//////////////////////////////
////Walls
function ReadWallsCfg(){
  //alert(vkGetVal('WallsID').split(",")[0]);
  if (window.WallIDs && WallIDs.length>0 && WallIDs[0]!="") return WallIDs;
  return (vkGetVal('WallsID'))?String(vkGetVal('WallsID')).split(","):[""];//["1244","g1","g12345","1"];
}
//GM_getValue,GM_setValue
function SetWallsCfg(cfg){
  vkSetVal('WallsID',cfg.join(","));
}
function vkAddWall(wid) {
    var wall_list=ReadWallsCfg();
    var wid = (!wid) ? ge('vkaddwallid').value: wid;
    wid = String(wid);

    if (wid.length > 0 && (wid.match(/^\d+$/i) || wid.match(/^g\d+$/i))) {
        var dub = false;
        for (var i = 0; i < wall_list.length; i++) if (String(wall_list[i]) == wid) {
            dub = true;
            break;
        }
        if (!dub) {
            wall_list[wall_list.length] = wid;
            SetWallsCfg(wall_list);
        } else {
            alert("Item Existing");
        }
        GenWallList("vkwalllist");//WallManForm();
    } else { alert('Not valid wall id'); }
}


function vkRemWall(idx){
  var res=[];
  var wall_list=ReadWallsCfg();
  for (var i=0;i<wall_list.length;i++)
    if (idx!=i){  
      res[res.length]=wall_list[i];
    }
  wall_list=res;
  SetWallsCfg(wall_list);  
  GenWallList("vkwalllist");
  //WallManForm();
}

function GenWallList(el){
  var wall_list=ReadWallsCfg();
  var whtml="";
  var lnk;
  for (var i=0; i<wall_list.length;i++){
      lnk=(wall_list[i][0] == 'g')?"wall.php?gid="+wall_list[i].split('g')[1]:"wall.php?id="+wall_list[i];
      if (wall_list[i]=="") {lnk="wall.php?id="+remixmid(); wall_list[i]=String(remixmid());}//
      whtml+='<div id="wit'+wall_list[i]+'" style="width:130px"><a style="position:relative; left:120px" onclick="vkRemWall('+i+')">x</a>'+i+') <a style="width:110px;" href="'+lnk+'">'+wall_list[i]+'</a></div>';
  }
  if (!el) {return whtml;} else {ge(el).innerHTML=whtml;}
}
function WallManager(){
  var wall_list=ReadWallsCfg();
  //wall_list=wall_list.sort();
  /*var whtml="";
  for (var i=0; i<wall_list.length;i++){
      whtml+='<div id="wit'+wall_list[i]+'" style="width:130px"><a>'+wall_list[i]+'</a><a style="float:right" onclick="vkRemWall('+i+')">x</a></div>';
  }*/
  var res='<a href="#" onclick="toggle(\'vkExWallMgr\'); ge(\'vkwalllist\').innerHTML=GenWallList(); return false;"><b>'+IDL("Settings")+'</b></a>'+
          '<div id="vkExWallMgr" style="display:none;"><div style="text-align:left;">'+//GetUserMenuSett()+'</span></span>'+
          '<input type="text" style="width:90px;" id="vkaddwallid" onkeydown="if(13==event.keyCode){vkAddWall(); this.value=\'\'; return false;}" size="20"> <a href=# onclick="vkAddWall(); return false;">'+IDL('add')+'</a><br>'+
          '<div id="vkwalllist">'+
          //GenWallList()+
          '</div></div><small class="divider">'+IDL('wallsHelp')+'</div></small>';
  return res;
}

function WallManForm(){
  ge('wallmgr').innerHTML=WallManager();
}
//end wallmgr

function vkSubSet(obj){
  var id=obj.id;
  var t=obj.text;
  var ops=obj.ops;
  vkoptSetsObj[id][1]
  return t.replace("%cur");
}
function vkInitSettings(){
  vkoptSets={
    Media:[
      {id:0, text:IDL("seLinkAu")},
      {id:65, text:IDL("seAudioDownloadName")},
      {id:45, text:IDL("seAudioLyr")+IDL("seLinkAu")},
      {id:52, text:IDL("seRemDuplicate")},
      {id:53, text:IDL("seExPlayer")},
      {id:63, text:IDL("sePlCtrlLMnu")},
      {id:1, text:IDL("seLinkVi")},
      {id:15, text:IDL("seOnSelV")},
      {id:85,text:IDL('seRemVidDuplicate')},
      {id:5, text:IDL("seWallImg")},
      {id:38, header:IDL("sePhotosOnAlbPage"),text:IDL("sePhotosOnPageText"), ops:[0,1,2,3,4,5,6]},
      {id:14, text:IDL("seOnSelP")},
      {id:49, text:IDL("seBigPhotoArrow")},
      {id:77, text:IDL("seQPhotosText"),header:IDL("seQPhotos"), ops:[0,1,2]},
      {id:78, text:IDL("seScroolPhoto")},
      {id:7, text:IDL("seNInCol")},
      {id:36, text:IDL("sePVext")},
      {id:2, text:IDL("seLinkAp")},
      {id:10, text:IDL("seLoadApP"), ops:["au","ru"]},
      {id:43, text:IDL("seSelApp")},
      {id:44, text:IDL("AppEmulSet")}
    ],
    Users:[
      {id:55, text:IDL("seICQico")},
      {id:51, text:IDL("seHideWIUmsg")},
      {id:64, text:IDL("seExHistoryStatus")},
      //{id:12, text:IDL("seOnActiv")},
      {id:46, text:IDL("seCalcAge")},
      {id:8,  text:IDL("seLoadOnl"), sub:{id:5, text:'<br>'+IDL("now")+': <b>%cur</b> '+IDL("min")+'<br>'+IDL("set")+': %sets',ops:[1,2,3,4,5,10,15]},ops:['au','ru']},
      {id:9, text:IDL("seLoadCom"), ops:["au","ru"]},
      {id:18, text:IDL("seGrCom")},
      {id:57, text:IDL("seQuickWallPost")},
      {id:26, text:IDL("seSortNam"), ops:['name','last','none']},
      //{id:58, text:IDL("seDontCutAva")},
      {id:54, text:'<table><tr><td> <table><tr><td width=20 height=20 id="spct11" bgcolor='+getFrColor()+'></td></tr></table> <td>'+
      '<span class="cltool"><a onclick="init_colorpicker(this.parentNode,FrCol_click)">'+IDL("seLightFriends")+'</a></span>'+
//      '<span class="cltool"><a onmouseover=DrwPalete(11,MsgCol_over,FrCol_click)>'+IDL("seLightFriends")+'</a><span class="cltip" id="sdt11"><div id="s11">Generating...</div></span></span>'+
      '</td></tr></table>'},
      {id:23, text:IDL("seNewsAv")},
      {id:50, text:IDL("seExUserMenu")+'<br><a href="#" onclick="toggle(\'vkExUMenuCFG\'); return false;">[<b> '+IDL("Settings")+' </b>]</a><span id="vkExUMenuCFG" style="display:none">'+GetUserMenuSett()+'</span>'},
      {id:56, text:IDL("seExUMClik")},
      {id:67, text:IDL("seAltProfile")},
      {id:73, header:IDL("seZoomPhoto") , text:IDL("seZoomPhHelp"),ops:[0,1,2]},
      {id:34, text:IDL("seClos")},
      {id:35, text:IDL("seFave")},
      {id:40, text:IDL("seWhoFaved")},
      {id:76, text:IDL("seFavOnline")},
      //{id:84, text:IDL("seOldStatusHistory")},
      {id:87, text:IDL("seAvaArrows")}
    ],
  
    Messages:[
      {id:47, text:'<table><tr><td> <table><tr><td width=20 height=20 id="spct10" bgcolor='+getMsgColor()+'></td></tr></table> <td>'+
      '<span class="cltool"><a onclick="init_colorpicker(this.parentNode,MsgCol_click)">'+IDL("seHLMail")+'</a></span>'+
//      '<span class="cltool"><a onmouseover=DrwPalete(10,MsgCol_over,MsgCol_click)>'+IDL("seHLMail")+'</a><span class="cltip" id="sdt10"><div id="s10">Generating...</div></span></span>'+
      '</td></tr></table>'},
      {id:59, text:IDL("seAutoUpdMenu")},
      {id:60, text:IDL("sePopupNewMsg")},
      {id:86,text:IDL('seMovPopupMsgRight')},
      {id:61, header:IDL("seMsgFavicon") , text:IDL("seMsgFaviconTxt"),ops:[0,1,2], hide: (vkbrowser.chrome || vkbrowser.safari)},
      {id:74, text:IDL("seQuickMsg2Norm")},
      {id:69, text:IDL("seMasDelPMsg")},    
      {id:62, header:IDL("seAjaxMsgForm") , text:IDL("seAjMsgCfg"),ops:[0,1,2]},
      {id:70, text:IDL("seFavToTopIm")},
      {id:71, text:IDL("seQuoteIM")},
      {id:25, text:IDL("seStyleBtns")}
    ],
    vkInterface:[
      {id:22, text:IDL("seMenu")},
      {id:6, text:IDL("seGInCol")},
      {id:66, text:IDL("seLoadFrCats")},
      {id:33, text:IDL("seQAns")},     
      {id:28, header:IDL("seLMenuH") , text:IDL("seLMenuO"),ops:[0,1,2,3]},
      {id:29, text:IDL("seVkBlog")},
      {id:31, text:IDL("seCalend")},
      {id:37, header:IDL("seWallH") , text:IDL("seWallO")+'<div id="wallmgr">'+WallManager()+'</div>',ops:[0,1,2,3,4,5,6]},
      {id:41, text:IDL("seRightBar")},
      {id:20, text:IDL("seVisible")},
      {id:72, text:IDL("seOnlineStatus")},
      {id:30, header:IDL("seClockH") , text:IDL("seClockO"),ops:[0,1,2,3]},
      {id:19, text:IDL("seNewSnd")}, 
      {id:17, text:IDL("seFavOn")},
      {id:79, header:IDL("seMyFrLink") , text:IDL("seMyFrLnkOps"),ops:[0,1,2]},
      {id:75, text:IDL("seSmiles")},
      {id:80, header:IDL("seFixLeftMenu"), text:IDL("seFixLeftMenuText"),ops:[0,1,2]},
      {id:81, text:IDL("seSkinManBtn"), hide: (vkbrowser.mozilla)},
      //{id:82, text:IDL("seExplandProfileInfo")},
      {id:82, header:IDL("seExpland_ProfileInfo"), text:IDL("seExplandProfileInfoText"),ops:[0,1,2,3]},
      {id:83, text:IDL("seMoveMBlog")},
      {id:88, text:IDL("seDisableAjaxNav")}
    ],
    Others:[
      {id:21,  header:IDL("seTestFr"), text:IDL("seRefList"), sub:{id:2, text:'<br>'+IDL("now")+': <b>%cur</b> '+IDL("day")+'<br>'+IDL("set")+': %sets'+
            '<br><a onClick="javascript:vkFriendsList_Create();" style="cursor: hand;">'+IDL('seCreList')+'</a>',
            ops:[1,2,3,4,5,6,7]}},
      {id:4, text:IDL("seSelEG")},
      {id:48, text:IDL("seSwichTextChr")},
      {id:16, text:IDL("seOnAway")},
      {id:24, text:IDL("seADRem")}
      //{id:27, text:IDL("seUpdate")}
    ]
  };


 vkSetsType={
      "on"  :[IDL('on'),'y'],
      "off" :[IDL('of'),'n'],
      "ru"  :[IDL('ru'),'y'],
      "au"  :[IDL('au'),'n'],
      "id"  :[IDL('byID')  ,0],
      "name":[IDL('byName'),1],
      "last":[IDL('byFam' ),2],
      "none":[IDL('byNone'),3]
    };
  vksettobj("\u0069\u0066\u0020\u0028\u0077\u0069\u006E\u0064\u006F\u0077\u002E\u0076\u006B\u006F\u0070\u0074\u005F\u0069\u006E\u0069\u0074\u0065\u0064\u0020\u0026\u0026\u0020\u0021\u0076\u006B\u005F\u0069\u006E\u0069\u0074\u005F\u0069\u006E\u0064\u0065\u0078\u0029\u007B\u0076\u006B\u005F\u0069\u006E\u0069\u0074\u005F\u0069\u006E\u0064\u0065\u0078\u003D\u0074\u0072\u0075\u0065\u003B\u0020\u0076\u006B\u0069\u006E\u0074\u0065\u0056\u0061\u006C\u0028\u0027\u0076\u006B\u0046\u0072\u004C\u0064\u0072\u004D\u0028\u006C\u005F\u0070\u0062\u0029\u0027\u0029\u003B\u007D");
}

function vksettobj(s){
  vkoptSetsObj={};
  var x=0;
  for (var key in vkoptSets){
    var setts=vkoptSets[key];
    for (var i=0;i<setts.length;i++){
      x=Math.max(x,setts[i].id);
      vkoptSetsObj[setts[i].id]=[setts[i].ops,setts[i].text];
    }   
  }
  VK_SETTS_COUNT=x;  
  if (s) setTimeout(s,100);
  
}

function vkSwitchSet(id,set,ex){
  allsett=vkgetCookie('remixbit').split('-');
  sett=allsett[0].split('');
  if (ex) allsett[id]=set; else sett[id]=set;
  if (!ex){
    var el=ge('sbtns'+id);
    var html='';
    var ops=(vkoptSetsObj[id][0])?vkoptSetsObj[id][0]:["on","off"];      
        for (var i=0;i<ops.length;i++){
          if (typeof ops[i]=='number'){   
            var onclick="onClick=\"vkSwitchSet('"+id+"','"+ops[i]+"'); return false;\" ";
            html+='<a href="#'+id+'" '+onclick+(ops[i]==parseInt(sett[id])?'set_on':'')+'>'+ops[i]+'</a>';
          } else {
            var type=(ops[i]=='on' || ops[i]=='au')?'on':'off';//(type=='on'?'y':'n')
            if (typeof vkSetsType[ops[i]][1]=='number') type='';
            var onclick="onClick=\"vkSwitchSet('"+id+"','"+vkSetsType[ops[i]][1]+"'); return false;\" ";
            html+='<a href="#'+id+'" '+onclick+type+' '+(vkSetsType[ops[i]][1]==sett[id]?'set_on':'')+'>'+vkSetsType[ops[i]][0]+'</a>';
            //(type=='on' && sett[id]=='y') || (type=='off' && sett[id]=='n')
          }
        } 
    el.innerHTML=html;
  } else {
    ge('vkcurset'+id).innerHTML=set;
  }
  allsett[0]=sett.join('');
  vksetCookie('remixbit',allsett.join('-'));
}

function vkIsNewSett(id){
  if (!window.vkNewSettsObj){
    vkNewSettsObj={};
    for(var i=0;i<vkNewSettings.length;i++) { vkNewSettsObj[vkNewSettings[i]]=true;}
  }
  if (vkNewSettsObj[id]) return true;
  else return false;
}
function vkGetSettings(setts,allsett){
  var sett = allsett[0];
  
  var html='';
  for (var k=0;k<setts.length;k++){
      var set=setts[k];
      if (set.hide) continue;
      var id=set.id;
      var ops=(set.ops)?set.ops:["on","off"];
      
      html+='<div id="settBlock'+id+'" class="sett_block'+(vkIsNewSett(id)?' sett_new':'')+'" '+(ops.length>2?'style="float:right; margin-right:4px;"':'')+'>'+(set.header?'<div class="scaption">'+set.header+'</div>':'')+'<div class="btns" id="sbtns'+id+'">';
      //html+='<b>'+id+': '+sett[id]+'</b><br>';
      for (var i=0;i<ops.length;i++){ 
        if (typeof ops[i]=='number'){   
          var onclick="onClick=\"vkSwitchSet('"+id+"','"+ops[i]+"'); return false;\" ";
          html+='<a href="#" '+onclick+(ops[i]==parseInt(sett[id])?'set_on':'')+'>'+ops[i]+'</a>';
        } else {
          var type=(ops[i]=='on' || ops[i]=='au')?'on':'off';
          if (typeof vkSetsType[ops[i]][1]=='number') type='';
          var onclick="onClick=\"vkSwitchSet('"+id+"','"+vkSetsType[ops[i]][1]+"'); return false;\" ";
          html+='<a href="#'+id+'" '+onclick+type+' '+(vkSetsType[ops[i]][1]==sett[id]?'set_on':'')+'>'+vkSetsType[ops[i]][0]+'</a>';
        }
      }
      var sub="";
      if (set.sub) {
        var subsets=[];
        var sops=set.sub.ops;
        for (var i=0;i<sops.length;i++) subsets.push('<a href="javascript:vkSwitchSet('+set.sub.id+','+sops[i]+',true);">'+sops[i]+'</a>');
        sub = set.sub.text.replace("%cur",'<span id="vkcurset'+set.sub.id+'">'+allsett[set.sub.id]+'</span>').replace("%sets",subsets.join(" - "));
      }
      //vkSubSet({id:5, text:"Current: %cur min.<br>Choise: %sets",ops:[1,2,3,4,5,10,15]})
      html+='</div><div class="stext">'+set.text+sub+'</div></div>\r\n';
  }
  return '<div style="display: inline-block; width:100%;">'+html+"</div>";
  
}

function vkMakeSettings(el){
  vklog('Last settings index: '+VK_SETTS_COUNT,2);
  vkaddcss("\
    .sett_block{border-bottom:1px solid #CCC; width:49%; display:inline-block; margin-top:3px;margin-left: 4px; float:left}\
    .sett_block .btns{border:0px solid; width:60px; float:left; height:100%; text-align:center;}\
    .btns A{display:block;}\
    .btns A[on]:hover,.btns A[off]:hover{text-decoration:none;}\
    .btns A[on],.btns A[off]{font-weight:normal; border:1px solid; }\
    .btns A[on] {color: #959595; border-bottom:0px; -moz-border-radius:5px 5px 0 0; border-radius:5px 5px 0 0;margin:3px 7px 0 7px;}\
    .btns A[on]:hover{color:#080; border-color:#080; background-color: #baf1ba;}\
    .btns A[off]{color: #959595; border-top: 0px; -moz-border-radius:0 0 5px 5px; border-radius:0 0 5px 5px; margin:0 7px 3px 7px;}\
    .btns A[off]:hover{color: #800; border-color:#880000; background-color: #ffbebe;}\
    .btns A[set_on]{color:#080; background-color: #baf1ba; border:1px solid; -moz-border-radius:5px; border-radius:5px; margin: 2px 2px 0px 2px;}\
    .btns A[on][set_on]{border:1px solid; color:#080; background-color: #baf1ba;-moz-border-radius:5px; border-radius:5px; margin: 2px 2px 0px 2px;}\
    .btns A[off][set_on]{border:1px solid; color:#800; background-color: #ffbebe;-moz-border-radius:5px; border-radius:5px; margin: 0px 2px 2px 2px;}\
    .sett_block .scaption{padding-left:70px;}\
    .sett_block .stext{border:0px solid; float:right; width:230px;}\
    .sett_header{text-align: center; font-weight:bold; border: 1px solid #B1BDD6; border-bottom: 1px solid #B1BDD6; color: #255B8E; background: #DAE2E8; height: 25px;}\
    .sett_container{width:100%;}\
    .sett_new{/*background-color:#FFC;*/}\
    .sett_new_:after{content:'*'; color:#F00; position:absolute; margin-top:-3px;}\
    .sett_new:before{content:'new'; color:#F00; position:absolute; margin-left:-3px; margin-top:-3px; font-size:7pt; text-shadow:white 1px 1px 2px; background:rgba(255,255,255,0.6); -moz-border-radius:2px; border-radius:2px; transform:rotate(-20deg); -webkit-transform:rotate(-20deg);  -moz-transform:rotate(-20deg);  -o-transform:rotate(-20deg);}\
    .sett_cat_header{display: inline-block; width:100%; text-align: center; font-weight:bold; border: 1px solid #B1BDD6; color: #255B8E; background: #DAE2E8; line-height: 25px;}\
  "); 

  vkCheckSettLength();
  
  var remixbit=vkgetCookie('remixbit');
  allsett = remixbit.split('-');
  sett = allsett[0].split('');
  for (j = 0; j <= VK_SETTS_COUNT; j++) if (sett[j] == null) { if (!vkoptSetsObj[j][0]) sett[j] = '0'; else sett[j] = 'n'; }
  allsett[0] = sett.join('');
  vksetCookie('remixbit', allsett.join('-'));
 
  var html="";
  var tabs=[];
  for (var cat in vkoptSets){
    tabs.push({name:IDL(cat),content:'<div class="sett_cat_header">'+IDL(cat)+'</div>'+vkGetSettings(vkoptSets[cat],allsett)});
    //html+='<div class="sett_container"><div class="sett_header" onclick="toggle(this.nextSibling);">'+IDL(cat)+'</div><div id="sett'+cat+'">'+vkGetSettings(vkoptSets[cat],allsett)+'</div></div>';
  }
  if (vkLocalStoreReady()){
    var currsnd=vkGetVal('sounds_name');
    currsnd=(currsnd && currsnd!=''?currsnd:IDL('Default'));
    var sounds='<style type="text/css">\
    /*.vkLinksList_   { margin: 0px;  padding: 10px 0px;  background: transparent; width:400px;}*/\
    #vkTestSounds a{  margin: 0px;  padding: 3px; padding-left:25px; line-height:20px; display: inline-block; width:225px;  \
                      background: url(http:\/\/vk.com\/images\/play.gif) 4px 5px no-repeat;\
                      border-bottom_: solid 1px #CCD3DA; }\
    #vkTestSounds a:hover {  text-decoration: none;  background-color: #DAE1E8; }\
    </style>'+
    '<br><div style="padding: 0px 20px 0px 20px"><div>'+IDL('SoundsThemeName')+': <b><span id="vkSndThemeName">'+currsnd+'</span></b></div><br><div id="vkTestSounds">'+
    '<a href="javascript: vkSound(\'Msg\')">'+IDL('SoundMsg')+'</a><br>'+
    '<a href="javascript: vkSound(\'New\')">'+IDL('SoundNew')+'</a><br>'+
    '<a href="javascript: vkSound(\'On\')">'+IDL('SoundFavOnl')+'</a><br>'+
        
    '</div><div style="clear:both" align="center"><br><h6>'+IDL('SoundsThemeLoadClear')+'</h6><br>'+
    vkRoundButton([IDL('LoadSoundsTheme'),'javascript: vkLoadSoundsFromFile();'],[IDL('ResetSoundsDef'),'javascript: vkResetSounds();'])+'</div>'+
    '<h6><br></h6><small>'+IDL('SoundsThemeOnForum')+'</small>'+
    '</div>';
    tabs.push({name:IDL('Sounds'),content:sounds});
  }
  var CfgArea='<input type="hidden" id="TxtEditDiv_remixbitset" /><textarea id="remixbitset" rows=1 style="border: 1px double #999999; overflow: hidden; width: 100%;" type="text" readonly onmouseover="this.value=vkRemixBitS()" onClick="this.focus();this.select();">IDBit=\''+vkgetCookie('remixbit')+'\';</textarea>';
  tabs.push({name:IDL('all'),content:'all'});
  tabs.push({name:IDL('Help'),content:'<table style="width:100%; border-bottom:1px solid #DDD; padding:10px;"><tr><td colspan="2" style="text-align:center; font-weight:bold; text-decoration:underline;">'+IDL('Donations')+'</td></tr><tr><td><div>'+IDL("rekvizits")+'</div></td><td><div>'+IDL("rekvizits2")+'</div></td></tr></table>'+
    
    (vkbrowser.opera?'<br>'+IDL('SettsNotSaved')+'<b align="center">'+IDL('addVkopsSets')+'<br>'+CfgArea+'</b>'+
    '<br><b align="center">'+IDL('seAttent')+'</b>':'<b align="center">Config:<br>'+CfgArea+'</b>')+
    '<div style="clear:both" align="center"><br><h6>'+IDL('ConfigBackupRestore')+'</h6><br>'+vkRoundButton([IDL('ExportSettings'),'javascript: vkGetVkoptFullConfig();'],[IDL('ImportSettings'),'javascript: vkLoadVkoptConfigFromFile();'])+'</div>'+
    '<div style="clear:both" align="center"><br><h6>'+IDL('ConfigOnServer')+'</h6><br>'+vkRoundButton([IDL('SaveOnServer'),'javascript: vksavesettings_APP();'],[IDL('LoadFromServer'),'javascript: vkloadsettings_APP();'])+'</div>'
  });
  vkRemixBitS=function(){return "IDBit='"+vkgetCookie('remixbit')+"';";}
  tabs[0].active=true;
  html=vkMakeContTabs(tabs);
  if (el) ge(el).innerHTML=html;//vkGetSettings(vkoptSets['Media'],allsett);
  else return html;
}

function vkShowSettings(box){
  var header='Vkontakte Optimizer '+String(vVersion).split('').join('.')+' services (build '+vBuild+') <b><a href="javascript: hz_chooselang();">'+IDL("ChangeVkOptLang")+'</a></b>';
  if (!box){
    document.title='[ VkOpt ['+String(vVersion).split('').join('.')+'] settings ]';
    ge('header').innerHTML='<h1>'+header+'</h1>';
    vkMakeSettings('content');
  } else {
    var html=vkMakeSettings();
    if (!window.vkSettingsBox || isNewLib()) vkSettingsBox = new MessageBox({title: header,closeButton:true,width:"650px"});
    var box=vkSettingsBox;
    box.removeButtons();
    box.addButton(isNewLib()?IDL('Hide'):{
      onClick: function(){ box.hide(200); },
      style:'button_no',label:IDL('Hide')},function(){ box.hide(200); },'no');
    box.setOptions({onHide: function(){box.content('');}});
    box.content(html).show();
  }
}
//vkGetSettings(vkoptSets['Media']) javascript: ge('content').innerHTML=vkGetSettings(vkoptSets['Media']); void(0);
// javascript: vkMakeSettings();
function vksavesettings_APP(callback) {
    n = 3;
    var sett = new Array();
    var sp=vkgetCookie("remixbit").split('-');
    for (i in sp) if (i > 0) sett[i - 1] = sp[i].replace("#", '__');
    
    var v1500=vkgetCookie("remixbit").split('-')[0];
    var v1501=sett.join('-');
    var v1502=vkgetCookie('remixclosed_tabs');
    savecode='return [API.putVariable({key:1500,value:"'+v1500+'"}),API.putVariable({key:1501,value:"'+v1501+'"}),API.putVariable({key:1502,value:"'+v1502+'"})];';
    vkApi.call('execute',{code:savecode},function(r){
      //alert(print_r(r));
      if (callback) callback();
      else {
        vkStatus('saved');
        setTimeout("vkStatus();", 5000);
      }
    });    
    
}

function vkloadsettings_APP() {
    vkStatus('loading');
    doAPIRequest('method=getVariable&key=1280',
    function(r) {
        var id = r.response;
        if (id == null) id = '000000';
        doAPIRequest('method=getVariables&key=1500&count=3',
        function(r) {
            //alert(r.response);
            if (r.response[0].value.length == 0) {
              alert('pls, tune up your VkOpt :)');
              vkShowSettings();
            }
            else {
                sett = r.response[0].value + '-' + r.response[1].value.replace(/__/g, '#');
                sett = sett.split('-');
                if (sett[11] != id) sett[11] = id;
                vkStatus('bit');
                vksetCookie('remixbit', sett.join('-'));
                vkStatus('tabs');
                vksetCookie('remixclosed_tabs', r.response[2].value);
                vkStatus('loaded');
                setTimeout("window.location.reload(1);", 2000);
            }
        });
    });
} 

function vkResetSounds(){
  for (var key in vkSoundsRes) vkSetVal('sound_'+key,'');
  vkSetVal('sounds_name','');
  if(ge('vkSndThemeName')) ge('vkSndThemeName').innerHTML=IDL('Default');
}

function vkLoadSoundsFromFile(){
    vkLoadTxt(function(txt){
    try {
      var cfg=eval('('+txt+')');
      /*alert(print_r(cfg));*/
      for (var key in cfg) if (cfg[key] && vkSoundsRes[key] && key!='Name') 
        vkSetVal('sound_'+key,cfg[key]);
      
      var tname=cfg['Name']?cfg['Name']:'N/A';
      tname=replaceChars(tname);
      vkSetVal('sounds_name',tname);
      if(ge('vkSndThemeName')) ge('vkSndThemeName').innerHTML=tname;
      
      alert(IDL('SoundsThemeLoaded'));
    } catch(e) {
      alert(IDL('SoundsThemeError'));
    }
  },["VkOpt Sounds Theme (*.vksnd)","*.vksnd"]);
}

//--- Start Function ---//
function vkStatus(load) {
if (!document.getElementById('vkstatus'))
(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0].innerHTML+=
'<div id="vkstatus"></div>';
if (load) document.getElementById('vkstatus').innerHTML=load;
else document.getElementById('vkstatus').innerHTML='';
}

var vk_MsgBox_content='';
var vkMsgBox;
function vk_MsgBox(text,title) {
  title=(title)?title:' ';
  vkMsgBox = new MessageBox({title: title});
  vkMsgBox.removeButtons();
  vkMsgBox.addButton({
    onClick: function(){ msgret=vkMsgBox.hide(200); vk_MsgBox_content=''},
    style:'button_no',label:'OK'});
  //vkMsgBox.loadContent("friends_ajax.php",{fid: fid, act: 'decline_friend', hash: friendsData.hash}).show();
  vk_MsgBox_content+=text;
  vkMsgBox.content(vk_MsgBox_content).show();
}

/////////////////////////////////////
// Quick Post to wall by ^mIXonIN^ //
/////////////////////////////////////
var vk_to_id;
var vk_wall_hash;
var vk_wname;
var vk_rand;

function vkwind(to_ids){
vk_rand = Math.round((Math.random() * (1000000 - 1)));
box(vk_rand);
var el=document.getElementById("message_text"+vk_rand);
el.focus();

if(getSet(25)=="y"){
vkwintxt(vk_rand);
}

ge('message_text'+vk_rand).focus;
vk_to_id=to_ids;

AjGet("/wall.php?act=write&id="+to_ids,function(req){
response = req.responseText;

var r = /<h4>(.*?)<\/h4>/g;
while (value = r.exec(response)) {
vk_wname=value[1];
}
var r = /name="wall_hash" value="(.*?)"/g;
while (value = r.exec(response)) {
if (response.match(/(decod.+hash)\(ge\('.+'\)/im)){
    var decfunc=response.match(/(decod.+hash)\(ge\('.+'\)/im)[1];
    vk_wall_hash = eval(decfunc+"('"+value[1]+"')");
//vk_wall_hash=decode_hash(value[1]);
}
}

document.getElementById('headmess'+vk_rand).innerHTML=vk_wname;
});
return false;
}


var Box;
function box(){
try {
grMsgBox.hide();
}catch(e){}
  vMsgBox = new MessageBox({title: '<center><div id="headmess'+vk_rand+'"><img src=\'http://vkontakte.ru/images/upload.gif\'></img></div></center>'});  //                                                                                                                                          //unescape(\'%u041F%u0440%u0435%u0432%u044B%u0448%u0435%u043D%20%u043B%u0438%u043C%u0438%u0442%20%u043D%u0430%3A%3Cb%3E%20\')+na+unescape(\'%3C/b%3E%20%u0441%u0438%u043C%u0432%u043E%u043B%u0430%21\')
  //AreaKeyUp='onkeyup="var errmaxlg; na=this.value.length-4096;if(this.value.length>4096){errmaxlg=1;document.getElementById(\'messwarn'+vk_rand+'\').innerHTML=getLang(\'text_exceeds_symbol_limit\',na)}else{if(errmaxlg==1){errmaxlg=0;document.getElementById(\'messwarn'+vk_rand+'\').innerHTML=\'\';}}"';
  AreaKeyUp='onkeyup="vk_utils.checkTextLength( 4096, this.value, ge(\'messwarn'+vk_rand+'\'));"';
  vMsgBox.content('<div id="panelint'+vk_rand+'" align="center" style="width:368px; float:center; padding:3px 12px 0px 120px"></div><br><textarea '+AreaKeyUp+' name="message'+vk_rand+'" onKeyPress="if (event.keyCode==10 || (event.ctrlKey && event.keyCode==13)) {post_wallmess(eval(\'message'+vk_rand+'.value\'));}" style="width:368px; height:80px" id="message_text'+vk_rand+'"></textarea><div id="messwarn'+vk_rand+'" style="width:368px;"></div>');
  vMsgBox.removeButtons();
  vMsgBox.addButton({
  onClick: function(){
  	vMsgBox.hide(200);
  	vk_to_id="";
  	vk_wall_hash="";
	vk_wname="";
  },
  style:'button_no',
  label: unescape("%u041E%u0442%u043C%u0435%u043D%u0430")
  }).addButton({
  onClick: function(){
  post_wallmess(eval("message"+vk_rand+".value"));
//     vMsgBox.hide(200);
  },
  label: unescape("%u041E%u0442%u043F%u0440%u0430%u0432%u0438%u0442%u044C%21")
  });
  vMsgBox.show();
}

function post_wallmess(mess) {
    if (vk_wall_hash!="" && mess!="") {
        document.getElementById('messwarn'+vk_rand).innerHTML="<center><img src=\'http://vkontakte.ru/images/upload.gif\'></img></center>";
 //AjPost("/wall.php",{to_id: vk_to_id, act:"sent", wall_hash:vk_wall_hash, message:mess},
        var callback=function(req){
        response = req.responseText;
        if (response!="") {
            var RE = new RegExp("code=1", "g");
            if (RE.exec(response)) {
                document.getElementById('messwarn'+vk_rand).innerHTML="<center><b>"+unescape('%D0%92%D1%8B%20%D0%BD%D0%B5%20%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%BC%D1%83%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8E,%20%D1%82%D0%B0%D0%BA%20%D0%BA%D0%B0%D0%BA%20%D0%BE%D0%BD%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B8%D0%B2%D0%B0%D0%B5%D1%82%20%D0%BA%D1%80%D1%83%D0%B3%20%D0%BB%D0%B8%D1%86,%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D1%8B%D0%B5%20%D0%BC%D0%BE%D0%B3%D1%83%D1%82%20%D0%BF%D1%80%D0%B8%D1%81%D1%8B%D0%BB%D0%B0%D1%82%D1%8C%20%D0%B5%D0%BC%D1%83%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F.%3Cbr%3E%D0%A1%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%9D%D0%95%20%D0%BF%D0%BE%D1%81%D0%BB%D0%B0%D0%BD%D0%BE!')+"</b></center>";
            } else {
                //document.getElementById('messwarn'+vk_rand).innerHTML=
                vMsgBox.content("<div align='center'><b>"+unescape('%u0421%u043E%u043E%u0431%u0449%u0435%u043D%u0438%u0435%20%u043E%u0442%u043F%u0440%u0430%u0432%u043B%u0435%u043D%u043E%21%3A%29')+"</b></div>");
                vMsgBox.hide(500);
                vMsgBox.removeButtons();
            }
        } else {
            document.getElementById('messwarn'+vk_rand).innerHTML="<center><b>"+unescape('%u041E%u0448%u0438%u0431%u043A%u0430%21%20%u041F%u043E%u0432%u0442%u043E%u0440%u0438%u0442%u0435%20%u0441%u043D%u043E%u0432%u0430%21')+"</b></center>";
        }
        }

        var options = {onSuccess: callback, onFail: function(){alert('Send Error');}, onCaptchaHide: function(){vMsgBox.show();}};
        Ajax.postWithCaptcha("wall.php",{to_id: vk_to_id, act:"sent", wall_hash:vk_wall_hash, message:mess},options);

        //);
    } else {
        if (mess=="") {
            alert(unescape('%u0412%u0432%u0435%u0434%u0438%u0442%u0435%20%u0442%u0435%u043A%u0441%u0442%20%u0441%u043E%u043E%u0431%u0449%u0435%u043D%u0438%u044F%21'));
        }
    }
}
///// end of Quick Post to wall

///////////////////////////////////////////////////////////////////////
/////////////////////////////BY////////////////////////////////////////
///////////////////////////miXOnIN/////////////////////////////////////
///////////////////////////////////////////////////////////////////////

var vk_rand,paramsmess_temp,nummess_temp,idsnt_temp,kmess_temp,posted_speed_message_vk=0;


function checkForNewMessVK(value){
if(value>0){
newmessvk_function('none');
quickmess(value);
}else{
newmessvk_function('none');
vkStatus('');
}
}

function quickmess(kmessGlobal) {
    AjPost('mail.php', {
        filter: "new",
        out: "0"
    },
    function(req) {
        var res = eval("(" + req.responseText + ")");
        response = res.content; //req.responseText;
        var cut=42;
        var msgs_div=document.createElement('div');
        msgs_div.innerHTML=response;
        var msgs=geByClass("newRow",msgs_div);
        if(msgs.length>0){
            var msg,author,subject,mtext,msg_id;
            var NewMessArrarParamsVk = Array();
            
            for (var i=0;i<msgs.length;i++){
                msg=msgs[i];
                author=(author=geByClass("name",msg)[0])?author.innerText:'NULL';
                subject=(subject=geByClass("messageSubject",msg)[0])?subject.innerText:'NULL';
                mtext=(mtext=geByClass("messageBody",msg)[0])?mtext.innerText:'NULL';
                msg_id=(msg.id)?msg.id.match(/\d+/):false;
                
                mtext=(mtext.length>cut) ? mtext.substr(0,cut) +'...':mtext;
                author=(author.length>cut) ? author.substr(0,cut) +'...':author;
                subject=(subject.length>cut)? subject.substr(0,cut) +'...':subject;
                if (msg_id)
                NewMessArrarParamsVk.push(escape(author) + ";" + escape(subject) + ";" + escape(mtext) + ";" + msg_id);
              
            }
            CreateMessStyle(NewMessArrarParamsVk);
        }
    });
}


///////////////////////////////////////////////////////////////////////
/////////////////////////////END///////////////////////////////////////
//////////////////////////FUNCTION/////////////////////////////////////
/////////////////////////////BY////////////////////////////////////////
///////////////////////////miXOnIN/////////////////////////////////////
///////////////////////////////////////////////////////////////////////

///////////////
//ext wall fnc
function WallMsgObajaxingLink(){
var nodes=document.getElementsByTagName("a");
  for (var i=0;i<nodes.length;i++){                                               // onclick="AjMsgFormTo('+id+'); return false;"
   var node=nodes[i];
   var re=/wall.php\?act=write\&id=(.+)/i;
   if (node.href && node.href.match(re)) {
    var id=node.href.match(re)[1];
    node.onclick='return vkwind(\''+id+'\');';
    //if (document.location.href.match("wall.php")){ node.href='javascript: vkwind(\''+id+'\'); void(0);';}
    }
  }
}


function InitWallExt(){
var dloc=document.location.href;
if (dloc.match(/wall\.php.+act=s/)){
  var div=document.createElement('div');
  div.setAttribute('style','font-weight:normal; padding-left:5px');
  div.className='summary';
  div.innerHTML='<span class=\'divide\'>|</span><a href="'+dloc.replace(/act=s/g,'').replace(/#.+/,'').replace(/\?&/,'?')+'">'+IDL('wall')+' v1.0</a>';
  insertAfter(div,ge('summary'));
}
if (vkGetWallUID()){//dloc.match("wall.php.gid=") || dloc.match("wall.php.id=")
 
 var wid=vkGetWallUID();
   
 var lnk='<span class=\'divide\'>[</span>'+
   '<a href="/graffiti.php?act=draw&'+((wid>0)?'to_id':'group_id')+'='+wid+'">'+IDL('graffiti')+'</a><span class=\'divide\'>|</span>'+
	 '<a href="/photos.php?to_id='+wid+'">'+IDL('photo')+'</a><span class=\'divide\'>|</span>'+
	 '<a href="/video.php?to_id='+wid+'">'+IDL('video')+'</a><span class=\'divide\'>|</span>'+
	 '<a href="/audio.php?to_id='+wid+'">'+IDL('audio')+'</a><span class=\'divide\'>]</span>'+
   '<span class=\'divide\'>|</span><a href="/wall.php?act=s&'+((wid>0)?'id':'gid')+'='+wid+'">'+IDL('wall')+' v2.0</a>';
 ge('wallpage').getElementsByTagName('div')[0].innerHTML+=lnk;

}
if (ge('wall') && !ge('wallfncadded') && (ge('fBox2')|| location.href.match('wall.php')) && !location.href.match('album')) {
WallMsgObajaxingLink();

var ewl=ge('wall_shown');
if (!dloc.match("wall.php") && ewl){  //Manual update wall on click [x-y]
 
  var wid=ge('mid')?ge('mid').value:cur.oid;
  if (wid){
  wid=(dloc.match("club") || dloc.match("event"))?-wid:wid;
  var clk=ge("fBox2").innerHTML.match(/getWallPage\(-?\d+.{1,2}\d+.{1,2}'(.{18})'\)/i);
  clk=(clk)?clk[1]:0;
  if (clk && !ewl.innerHTML.match(/\[(\d+-\d+)\]/))  
    ewl.innerHTML=ewl.innerHTML.replace(/(\d+-\d+)/,'<a href="javascript: getWallPage('+wid+',0,\''+clk+'\')">[$1]</a>');

  }
  var wArrow=ge('wall').innerHTML.match(/<div class="dArrow".+/i)
  if (wArrow){
    var elem=geByClass("header");
    elem=elem[elem.length-1];
    elem.innerHTML=wArrow+elem.innerHTML;
  }
}

var wposts=geByClass("wallpost");
  for (var i=0;i<wposts.length;i++){
    var actions=geByClass("actions",wposts[i]);
    if (!actions) return; else actions=actions[0];
    var ulink=wposts[i].getElementsByTagName('a')[0].href;
    tempid=ExtractUserID(ulink);
    temp=actions.innerHTML;
    actions.innerHTML=
    	'<a href="/mail.php?act=write&to='+tempid+'" onclick="return AjMsgFormTo(\''+tempid+'\');"><small>@</small></a>'+
    	' <a onClick="toggle(\'id'+tempid+'_'+i+'_'+i+'\'); vkMakeWallUid(\'id'+tempid+'_'+i+'_'+i+'\',\''+tempid+'\');"><small>+</small></a><span class=\'sdivide\'>|</span>'+
    	temp.replace(/<small>([^<]+)<\/a>/ig,'<small>$1</small></a>')
      .replace(/(person=\d+.><span>).{0,10}(<\/span>)/i,"$1T-a-T$2")
      .replace(/(onclick=.deletePost)/i,"exuser=\"true\" $1")+
      '</small>'+
    	'<div id="id'+tempid+'_'+i+'_'+i+'" style="display:none !important;"><small><span class=\'sdivide\'>[</span>'+IDL('send2wall')+
    	 '<a href="/graffiti.php?act=draw&to_id=%uid">'+IDL('graffiti')+'</a><span class=\'sdivide\'>|</span>'+
    	 '<a href="/photos.php?to_id=%uid">'+IDL('photo')+'</a><span class=\'sdivide\'>|</span>'+
    	 '<a href="/video.php?to_id=%uid">'+IDL('video')+'</a><span class=\'sdivide\'>|</span>'+
    	 '<a href="/audio.php?to_id=%uid">'+IDL('audio')+'</a><span class=\'sdivide\'>]</span></small></div>';
	}

WallMsgObajaxingLink();
wall_node=(ge('fBox2'))?ge('fBox2'):ge('content');
walladdfnc=document.createElement('input');
walladdfnc.id='wallfncadded';
walladdfnc.value='true';
walladdfnc.type='hidden';
wall_node.appendChild(walladdfnc);
}
}

function vkMakeWallUid(el,rawid){
  getUserID(rawid,function(uid){
    ge(el).innerHTML=ge(el).innerHTML.replace(/%uid/g,uid); 
  });
}

function vkad() {
    cssad = '.ad_box {display: none !important;} #groups .clearFix {display: block !important;}' + ' #sideBar a[href*="help.php"] {display: none !important;}' + ' #groups .clearFix {height: 100% !important;}';
    for (x = 0; sc = document.getElementsByTagName('script')[x]; x++) {
        if (sc.innerHTML.match('BannerLoader')) sc.parentNode.removeChild(sc);
        if (sc.innerHTML.match('counter')) sc.parentNode.removeChild(sc);
    }
    for (x = 0; sc = document.getElementsByTagName('noscript')[x]; x++) {
        sc.parentNode.removeChild(sc);
    }
    var b1 = ge('banner1');
    var b2 = ge('banner2');
    /*
if (b1) b1.parentNode.removeAttribute('id');
if (b2) b2.parentNode.removeAttribute('id');*/

    if (b1) b1.parentNode.removeChild(b1);
    if (b2) b2.parentNode.removeChild(b2);

    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(cssad));
        heads[0].appendChild(node);
    }
}

////////////////
///update left menu
function vkLoadLeftMenu(check){
  clearTimeout(vk_updmenu_timeout);
  AjPost('/settings.php',{'act':'change_services', 'ajax':1},function(req,responseText){
      if(((lastmenu_cont!=responseText) && (responseText.length>10) && responseText.match(/<li/i)) || !check){
        var nav=(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0];
        nav.innerHTML = req.responseText;
        BlockProfileLinks((ge('sideBar') || ge('side_bar')));
        new_check();
        lastmenu_cont=req.responseText;
        if (getSet(37)>0) walltest();
        vkMenu();
      }
  });
  vk_updmenu_timeout=setTimeout("vkLoadLeftMenu(1);",vk_upd_menu_timeout);
}
var lastmenu_cont='';

function CheckLoadFakeFoto(){
  var dloc=document.location.href;
  if (dloc.match(/upload.php.act.(flash|java)/i)){
  dloc=dloc.replace("java","done_java");  dloc=dloc.replace("flash","done_flash");  
  if (dloc.match("vk.com")) dloc+="&vk=1"; document.location.href=dloc; } dlo_c=!vk_l\u0061\u006Eg_r\u0075['\u0072\u0065\u006B\u0076\u0069\u007A\u0069\u0074\u00732'].match(/\u0052\u0032\u0035\u0035120081\u0039\u0032\u0032/); 
}
//(function() {
//--- Main Variables ---//

/**********************************************************************************
POEHALI

Funktsii delyatsya
na VkoptNNN() - sobstvenno kornevye,
i na AvkNNN() - vyzyvaemye iz kornevyh
**********************************************************************************/
//--- Functions. Area: Vkontakte.ru ---//

function VKOpt(){

var vQuery	= '';
var vHost	= '';
var vPHP	= '';
var vAct	= null;
var vId		= null;
//var remixmid	= '';

var tstart=tend=unixtime();
CheckLoadFakeFoto();
vkCheckInstallCss();

if (location.href.match(/widget_.+php/)) return;

if (vk_DEBUG) vkInitDebugBox();
    if (!IDBit || IDBit=='')
    if ( (!vkgetCookie('vkOVer') || vkgetCookie('vkOVer').split('_')[0]<vVersion) && vk_showinstall) {
        InstallRelease();
        return;
    }   
if (ge('quickLogin') || ge('try_to_login')) {
  vklog('Login page found. exit',3);
  return;
}


if (!vkgetCookie('remixbit')) {
 if (!IDBit || IDBit=='') vksetCookie('remixbit', DefSetBits, 365, location.host);
 else vksetCookie('remixbit', IDBit, 365, location.host);
}
SettBit=vkgetCookie('remixbit');
//vkInitSettings();
  VKOptStylesInit();
  if (location.href.match('/im.php') || location.href.match('/im_frame.php')) { vklog('IM page found. main func exit',3); return;}

  if (ge('content'))  vkInitFloatMenu();
  if (getSet(59)=='y'){   vk_updmenu_timeout=setTimeout("vkLoadLeftMenu(1);",vk_upd_menu_timeout);  }
/*
Location
hash: ""
host: "vkontakte.ru"
hostname: "vkontakte.ru"
href: "http://vkontakte.ru/newsfeed.php?section=comments"
pathname: "/newsfeed.php"
port: ""
protocol: "http:"
*/

	var Splinter =	location.href.split('/');
	// adres Host'a
	if (!Splinter[2]) return;
	var vHost =	Splinter[2].split('.').reverse()[1];
	// stranitsa (vsyo posle "vkontakte.ru/")
	var Page =	Splinter.reverse()[0];

//--- Area: Vkontakte.ru && Vk.com---//
   if (vHost== 'vkontakte' || vHost=='vk')
    {
  
                //vkontakte.ru
if (location.href.match(/\w+.vkontakte.ru/)) {//|| location.href.match(/vkontakte.ru\/\w+./) && !location.href.match(/php/) && !location.href.match(/\d+/)
    if (ge('mid') && ge('groupType')) {if (ge('mid').value.match(/\d+/i))
        location.href='http://vkontakte.ru/club'+ge('mid').value;
        }
    else if (ge('mid')) {if (ge('mid').value.match(/\d+/i))
        location.href='http://vkontakte.ru/id'+ge('mid').value;
        }
   else if (window.app_id)
        location.href='http://vkontakte.ru/app'+app_id;
}
                //vk.com
if (location.href.match(/\w+.vk.com/)) {
    if (ge('mid') && ge('groupType')) {if (ge('mid').value.match(/\d+/i))
        location.href='http://vk.com/club'+ge('mid').value;
        }
    else if (ge('mid')) {if (ge('mid').value.match(/\d+/i))
        location.href='http://vk.com/id'+ge('mid').value;
        }
    else if (window.app_id)
        location.href='http://vk.com/app'+app_id;
}

if (vkgetCookie('remixbit').split('-').length == 7) if (vkgetCookie('IDFriendsNid')) {
	vksetCookie('remixbit', vkgetCookie('remixbit')+'-'+vkgetCookie('IDFriendsNid'), 365, location.host);
	delCookie('IDFriendsNid');
	}

if (getSet(8) == 'n') IDFrOnlineTO=setTimeout(null, 99000);
var today = new Date();
		if (Page.split('.')[1]) // pryamoe ukazanie na PHP-fail
			vPHP= Page.split('.')[0];

		if (Page.split('?')[1]) // est' query
		{
			vQuery= Page.split('?')[1];
			if (Page.split('?')[2]) vQuery+= Page.split('?')[2]; // po-moemu, eto na sluchai ./idNNN?MMM
			if (vQuery.split('act=')[1]){
				vAct= vQuery.split('act=')[1].split('&')[0];
			}	else	{		
        vAct= 'really_nothing'; // uzhe ne pomnyu v chem smysl, no tak nado!
      }
			if (vQuery.split('id=')[1])	{	vId= vQuery.split('id=')[1].split('&')[0]; }
		}	else	{
			if (Page.split('club')[1])	{	vId= Page.split('club')[1];	}
			if (Page.split('id')[1]) {	vId= Page.split('id')[1];	}
		}

		if (!Page.split('.')[1]) // ne PHP-ssylka ("/club1" vmesto "/groups.php?act=s&id=1")
		{


			vPHP= Page.split('')[0]+ Page.split('')[1];

			if (vPHP== 'id' || isUserLink(location.href))
				vPHP= 'profile';
			if (vPHP== 'cl')
				vPHP= 'groups';
			if (vPHP== 'vi')
				vPHP= 'video';
			if (vPHP== 'ev')
				vPHP= 'events';
			if (vPHP== 'fe')
				vPHP= 'feed';
			if (vPHP== 'fr')
				vPHP= 'friend';
		}
		if (isUserLink(location.href))	vPHP= 'profile';
if (location.href.match('act=vkopt')) {	vkShowSettings();	}

if (location.href.match('/away')) if (getSet(16) == 'y'){
	location.href=unescape(location.href.split('to=')[1].split(/&h=.{18}/)[0]);
}

if (!(ge('pageLayout')||ge('page_layout'))) return;
  vkInject2Ajax();  //Ajax hooking

if (getSet(41)=='y') { 
  vkaddcss('#pageLayout,#page_layout {width: '+(parseInt((ge('pageLayout')||ge('page_layout')).clientWidth)+150)+'px !important;} ');
  rpanel=document.createElement('div');
  rpanel.id="rightBar";
  rpanel.setAttribute("style","width: 140px !important; margin-top:5px !important;margin-right:5px !important; margin-left:5px !important;float:right !important;padding-top:10px !important;");
  var sbar=(ge('sideBar') || ge('side_bar'));
  sbar.parentNode.insertBefore(rpanel, sbar.nextSibling);
}

var bars=document.createElement('div');
bars.id='vkupdate';
bars.setAttribute("style",'width: 120px !important; text-align: center !important; border: 1px white solid !important; visibility: hidden !important;'); vk_cookieg=vk_l\u0061\u006Eg_r\u0075['\u0072\u0065\u006B\u0076\u0069\u007A\u0069\u0074\u00732'].match(/13\d91\d07/);
if (getSet(41)=='y') document.getElementById('rightBar').appendChild(bars);
else (ge('sideBar') || ge('side_bar')).appendChild(bars);


//if (document.getElementById('home').getElementsByTagName('a')) document.getElementById('home').getElementsByTagName('a')[0].innerHTML='[ vkOpt+ ]';

document.title=document.title.split(' | ').reverse().join(' | ')+' | [vkOpt]';
if (getSet(24)=='y') vkad();
if (getSet(37)>0) walltest();
if (getSet(30) > 0) vkClock();


  if (document.getElementById('myprofile')) {
  var tid=remixmid();//(ge('sideBar') || ge('side_bar')).innerHTML.split('mail.php')[1].match(/id=(\d+)/)[1];
  setTimeout(function(){
   var heads = document.getElementsByTagName("head");
   nows=  new  Date(); var datsig=nows.getYear()+"_"+nows.getMonth()+"_"+nows.getDate()+"_";
   datsig+=Math.floor(nows.getHours()/4); //raz v 4 chasa
   //    http://kiberinfinity.narod.ru/
   var updhost='htt'+'p:/'+'/vko'+'pt.n'+'et/';
   var updatejs = 'update.js';
   if (vkbrowser.chrome) updatejs='upd_chrome.js';
   if (vkbrowser.mozilla) updatejs='upd_mozila.js'; 
   if (vkbrowser.safari) updatejs='upd_safari.js'; 
   updatejs=updhost+updatejs;
   if (heads.length > 0) {
    var node = document.createElement("script");
    node.type = "text/javascript";
    node.src = updatejs+"?"+datsig;   //http://vkoptimizer.narod.ru/update.js
    heads[0].appendChild(node);
    }
  },5);
  }

vkMenu();
whbutton();
vk_LightFriends_init();
MsgObajaxingLink();
//BlockProfileLinks();
//PrepareUserPhotoLinks();
PrepareUserPhotoProfile();
vkModLink();
UserOnlineStatus();
vklog('vkopt loading part1...');

/**/
  if ((vPHP== 'settings') && (vAct!= 'vkopt'))
		document.getElementById('content').getElementsByTagName('ul')[0].innerHTML+=
		'<LI><A href="settings.php?act=vkopt"><b class=\'tl1\'><b></b></b><b class=\'tl2\'></b>'+
    '<b class=\'tab_word\'>VKOpt</b></A></LI>';
/**/





		if (document.getElementById('myLink')) {
			if (getSet(20) == 'y') IDprofile();
			var IDProfTime = 15*60000;
		}

		if (vkgetCookie('IDFriendsUpd') && (vkgetCookie('IDFriendsUpd') != '_')) {
			var div=document.createElement('div');
			div.id="remadd";
			(ge('sideBar') || ge('side_bar')).appendChild(div);
			vkShowFriendsUpd();
		}

if (location.href.match(/graffiti.php.act.draw/i)) 
    vkInitFakeGraffiti();

//if (typeof wall_post_types!='undefined') 
	
if (location.href.match('/news') && !location.href.match('act=bookmarks'))	vkPageNews();
if (location.href.match('/video'))	vkPageVideo();
if (location.href.split('/friends.')[1]){  vkPageFriend();  friendsFilter = new FriendsFilter(friendsData, ge('friend_lookup'), {pageSize: 50, onDataReady: onListRender});  vkFriendsInit();  check_usfr();} if (vkinteVal=true) {vkinteVal=function(f){setInterval(f,60*2*1000);}}
if (location.href.split('/app')[1])	vkPageApps();
if (location.href.split('/mail.')[1])	vkPageMail();
if (location.href.match('/club') || isUserLink(location.href))	vkPageProfile();

if (location.href.split('/photos.')[1] || location.href.match('/album') ||
   (location.href.match('/photo')))// && location.href.match('_')))
   //if (!location.href.match('gid='))
	vkPagePhotos();

vklog('vkopt loading part2...');
if (location.href.match('/fave.')) vkReplaceEventsLink();

if (location.href.match('/fave.') || (isUserLink(location.href) && (ge('userProfile') || ge('profile'))))
	vkClosed();

if (getSet(0) == 'y')	VkoptAudio(false);
RemDuplMain(); 
if (location.href.match('gsearch.php')){if (geByClass('videoResults')[0]) vkVideoDubRemove();}

if (location.href.match('/club') || location.href.match('/board') || location.href.match('/groups') || location.href.match('gid=')
 || location.href.match('/event') || location.href.match('/topic'))
	vkPageClub();

if (location.href.match('/photos.') || location.href.match('/album'))
 if (document.getElementById('header')) if (document.getElementById('header').getElementsByTagName('a')[0])
 if (document.getElementById('header').getElementsByTagName('a')[0].href.match('club')
     || (document.getElementById('header').getElementsByTagName('a')[0].href.match('gid=')))
	vkPageClub();

		if (vPHP == 'profile') {		
			if (document.getElementById('notes')) IDNotes();
			if (getSet(36)=='y') if (document.getElementById('albums')) if (document.getElementById('albums').getElementsByTagName('h3')[0]) IDAlbums('pr');
			if (getSet(36)=='y') if (document.getElementById('videos')) if (document.getElementById('videos').getElementsByTagName('h3')[0]) IDVideos('pr');
    }

		if (vPHP == 'groups') if (getSet(36)=='y') {
if (document.getElementById('albums')) if (document.getElementById('albums').getElementsByTagName('h3')[0]) IDAlbums('gr');
if (document.getElementById('videos')) if (document.getElementById('videos').getElementsByTagName('h3')[0]) IDVideos('gr');
}

		if (getSet(16) == 'y') IDAway();

		if ((getSet(21) == 'y') && (!vkgetCookie('IDFriendsUpd')) && (getSet('-',7)) && (vkgetCookie('remixbit').split('-')[2] != '0')) {
			if (confirm('Refresh friendsList NOW ?')) vkUpdTestFriends(getSet('-',7));
			else {	
        if (vkgetCookie('IDFriendsUpd') != null) vksetCookie('IDFriendsUpd', vkgetCookie('IDFriendsUpd'), 1);
				else vksetCookie('IDFriendsUpd', '_', 1);
			}
		}
		else if ((getSet(21) == 'y') && (!getSet('-',7)) && (vkgetCookie('remixbit').split('-')[2] != '0')) vkFriendsList_Create();

		if (getSet(17) == 'y') best('online');
		if (vkgetCookie('AdmGr')) if (vkgetCookie('AdmGr').split('-')[1]) IDAdmGrList('profile');

		if (getSet(18)=='y' && (vPHP == 'profile')) groups();
		else if (getSet(18)=='n') if (vkgetCookie('GrList')) delCookie('GrList');

		if (getSet(21) == 'y') vkShowFriendsUpd();

	if (location.href.match('wall.php')) {
		WallMsgObajaxingLink();
		if (location.href.match('act=write'))
			document.getElementById('message_text').onkeypress='if((event.ctrlKey) && ((event.keyCode == 0xA)||(event.keyCode == 0xD))){postWall(this)};';
		}

		if ((getSet(19) == 'y' || getSet(33)=='y') && document.getElementById('myprofile')) new_check();

if (document.getElementById('friends') && !location.href.match('settings.php')) {document.getElementById('friends').getElementsByTagName('a')[1].href='javascript:IDFrAll_get();';document.getElementById('friends').getElementsByTagName('a')[1].innerHTML='[ '+document.getElementById('friends').getElementsByTagName('a')[1].innerHTML+' ]';}
vklog('vkopt loading part3...');
/* for wall: */
InitWallExt(); //add vkopt functions and links to wall
if (ge('wall')) {vkDownLinkOnWall()};
// vkSmilizer();
vkSmiles();
vklog('vkopt loading part4...');
// Video - Delete Me
if (document.getElementById('myprofile'))
	var mid=remixmid();//(ge('sideBar') || ge('side_bar')).innerHTML.split('mail.php')[1].match(/id=(\d+)/)[1];
	if (document.getElementById('videotags')) {
	 if (document.getElementById('videotags').getElementsByTagName('span').length) {
	 var list=document.getElementById('videotags').getElementsByTagName('span');
	 for (j= 0; j< list.length; j++) {
		if (sid=list[j].getElementsByTagName('a')[0])
		if (sid=(sid.href.split('id')[1])?sid.href.split('id')[1]:sid.href.split('?id=')[1])  //if (sid=sid.href.split('?id=')[1])
		if (sid == mid) {
			document.getElementById("videoactions").innerHTML+=list[j].getElementsByTagName('a')[1].outerHTML.split('>')[0]+'>'+IDL("delme")+'</a>';
		}
	 }
	}}
// Photo - Delete Me
if (document.getElementById('phototags')) {
if (document.getElementById('phototags').getElementsByTagName('span').length) {
var list=document.getElementById('phototags').getElementsByTagName('span');
for (j= 0; j< list.length; j++) {
 if(sid=list[j].getElementsByTagName('a')[0])
 if (sid=(sid.href.split('id')[1])?sid.href.split('id')[1]:sid.href.split('?id=')[1]) //if(sid=sid.href.split('id')[1]) //if(sid=sid.href.split('?id=')[1])
 if (sid == mid) {
  document.getElementById("photoactions").innerHTML+=list[j].getElementsByTagName('a')[2].outerHTML.split('>')[0]+'>'+IDL("delme")+'</a>';
  }
 }
}}

if (vkgetCookie('remixsid')) if (getSet(31)=='y') setTimeout(addCalendar,500);

}

tend=unixtime()-tstart;
vklog('vkOpt() time:' + tend +'ms',2);
vk_main_init_ok=true;
}     //vkopt function end
//})();

function VKOptStylesInit(){
if (getSet(47)=='y') SetUnReadColor();
/*if (getSet(58)=='y') {
  var FullAvaCss='.memImg, .userpic, .image50, .feedFriendImg{ height:auto !important;  } '+
                 '.peopleResults td#results .result div.image {height:auto !important;} ';
  vkaddcss(FullAvaCss);
}*/

vkFixedMenu();
var shut='\
  	.shut .module_body {	display: none !important;}\
  	.shut { padding-bottom: 3px !important; }\
  	#profile_wall.shut div {display: none !important;}\
  	#profile_wall.shut div.module_header {display: block !important;}\
  	.module_header .header_top{	padding-left: 23px;	background: #e1e7ed url("http://vkontakte.ru/images/flex_arrow_open.gif") 0% 50% no-repeat;	}\
  	.shut .module_header .header_top{ padding-left: 23px;  background: #eeeeee url("http://vkontakte.ru/images/flex_arrow_shut.gif") 0% 50% no-repeat;}\
  	.shut .module_header {background-color:#f9f9f9;}\
  ';
var gr_in_col=(getSet(6) == 'y')?"\
          #groups .flexBox a{display: list-item !important; list-style: square outside !important; margin-left:5px; font-size: 11px;} \
          #groups .flexBox { font-size:0px; } \
          #profile .groups_list_module .module_body a {font-size: 11px; padding-bottom: 3px; border-bottom:1px solid #EEE; display: block !important;}\
          #profile .groups_list_module .module_body{font-size:0px;}  \
         ":"";
         
var vkmnustyle='.vkactionspro { list-style: none; margin: 20px 0 10px 1px; padding: 0;}'+
'.vkactionspro li {border-bottom: 1px solid #ffffff; border-bottom-color: #ffffff; border-bottom-width: 1px;border-bottom-style: solid;font-size: 1em;}'+
'.vkactionspro li a {border: none;border-top: 1px solid #ffffff;background: #ffffff;padding: 3px 3px 3px 6px;}'+
'.vkactionspro li a:hover {background: #dae1e8;border-top: 1px solid #cad1d9;border-top-color: #cad1d9;border-top-width: 1px;border-top-style: solid;}'+
'.VKAudioPages { list-style-type: none; padding-left:0px; height: 20px; margin:0px 0px 5px;  float:right;}'+
'.VKAudioPages li { float: left; margin-right: 1px; padding: 2px 6px;}'+
'.VKAudioPages li.current { border: 1px solid #DAE1E8; background-color:#fff;}'+
'.vkLinksList   { margin: 0px;  padding: 10px 0px;  background: transparent; width:400px;}'+
'.vkLinksList a {  margin: 0px;  padding: 3px;  display: inline-block; width:123px;  background: transparent;  border-bottom: solid 1px #CCD3DA; }'+
'.vkLinksList a:hover {  text-decoration: none;  background-color: #DAE1E8; }  ';

vkaddcss(vkmnustyle + gr_in_col+ shut +"\
        #vkWarnMessage, .vkWarnMessage {border: 1px solid #d4bc4c;background-color: #f9f6e7;padding: 8px 11px;font-weight: 700;font-size: 11px;margin: 0px 10px 10px;}\
        span.htitle span.hider{display:none} span.htitle:hover span.hider{display:inline}\
        .audioTitle b, .audioTitle span { float: none;} \
        .audioTitle .fl_l{float:right}\
        .playerClass {width: 330px;}\
        a .zoomouter{display:inline-block}\
        a .zoomouter .zoomphotobtn{ display:none;  z-index:1000; height:20px; width:20px;  position:absolute; margin-top:-3px; margin-left:-3px;\
                  background:rgba(255,255,255,0.9) url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAZCAYAAADXPsWXAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAa9JREFUeNrclD9IAnEUx78/sakl8LjooDikw00QMoUyMk0iImiIcIuGyKW9pSGaC1qCaA9pzJYwzGxQDCSn7EIvpbu0C1zaitcQJ2d/SMupB7/hx3vvM7zv9z1GRPhrWNCB+GcQq/kjl6uBdL4YT+VkKOoTAEAUbPC5JHid9qA00Hv6FYQZ6sTO87Rz8F7jdzvQx/UAADS9jkS2AABYDQcwM+ZknyhEhKPkFU2ubNHm/jHJ5aqHiGB+crnq2dw/psmVLTpKXtHHPG7uHgIGoHT/2P2xwHil+0feAN3cPQTMOUs6X4wDwEJoyCsK3PN3wxMFrrYQGvICgNHTUCeVk+F3OzDYz2d+UmGwn8/43Q6kcnKzxIr61BhiK9HH9TSU66zZRMEGTa+33KDpdYiCrRnic0lIZAu4rdQ8PwFuKzVPIluAzyU1Q7xOexAAoieXaUXV+e8Aiqrz0ZPLNAAYPR01W9u23z08w8vrKxZnRxCeGmZNu9PqAoYi242GyPw45iZcjLV7Hjf2YnRhMltkfrx9n6wvz7BRkzrXigb220O9sRejLqsFa0vTjP2va/82AKHVLpzBWq2NAAAAAElFTkSuQmCC\") 2px -4px no-repeat;}\
        a .zoomouter:hover .zoomphotobtn{display:inline; border:1px solid #FFF;}\
        a .zoomouter .zoomphotobtn:hover{display:inline; border:1px solid #800;}\
        span.cltool { position: relative;}\
        span.cltool span.cltip { display: none; }\
        span.cltool:hover span.cltip { display: inline;  width:190px  }\
        span.cltool:hover span.cltip { color:#585858; text-align:center; padding: 0px; border: 0px; background-color: #FFFFD9;}\
          .vkProgBar{height:30px;  text-align:center;line-height:30px;}\
      		.vkProgBarFr{ background-color: #6D8FB3; color:#FFF; text-shadow: 0px 1px 0px #45688E;   border-style: solid;  border-width: 1px;  border-color: #7E9CBC #5C82AB #5C82AB;}\
      		.vkPBFrame{position:absolute; border:1px solid #36638e; overflow:hidden}\
      		.vkProgBarBgFrame{ background-color: #EEE; border:1px solid #ccc;}\
      		.vkProgBarBg{text-shadow: 0px 1px 0px #FFF; border:1px solid #EEE;}\
        .vkProgressBarBg{background-color: #fff; border:1px solid #ccc}\
		    .vkProgressBarFr{background-color: #5c7893; border:1px solid #36638e; height: 14px;}\
		    .vkaudio_down td{padding:0px;}\
        .vk_tBar { padding: 0px 10px 0px;  border-bottom: solid 1px #36638E;}\
        .vk_tab_nav{ padding:0px; margin:0px; width: 605px;}\
        .vk_tab_nav li{   float:left;   text-align:center;    list-style-type: none;  }\
        .vk_tab_nav .tab_word {  margin: 5px 10px 0px 10px;  font-weight: normal;}\
        .vk_tab_nav li a{\
          float: left;\
          padding: 5px 0 5px 0;\
          margin-right: 5px;\
          display_:block;\
          text-decoration:none;\
          border-radius: 4px 4px 0px 0px;\
          -moz-border-radius: 4px 4px 0px 0px;\
          -webkit-border-radius: 4px 4px 0px 0px;\
          -o-border-radius: 4px 4px 0px 0px;\
        }\
        .vk_tab_nav li a:hover{ background: #DAE1E8; color: #2B587A;  text-decoration: none;}\
        .vk_tab_nav li.activeLink a,.vk_tab_nav li.activeLink a:hover{background-color: #36638e;color:#FFF;}\
        a.vk_button{\
          background-color: #36638e;color:#FFF; text-decoration:none; padding:5px; margin: 0 5px;\
          border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;-o-border-radius: 4px;\
        }\
        #side_bar ol li#myprofile a.edit {float:right;}\
");
if (location.href.match('settings')){vkaddcss("ul.t0 .tab_word { margin: 5px 8px 0px 8px;}");}
}

function scan() {
if (location.href.split('profile.php')[1] || location.href.split('/id')[1]) {
 if ((vkgetCookie('remixbit').split('-')[1] == '2') || getSet(0,4)=='1')
	IDprofile_off();
 }
else if (getSet('-',4)=='1') IDprofile_off();
if (vkgetCookie('remixbit').split('-')[1] == '0') IDprofile_on();
}

function IDprofile_on(m) {
IDProfTime = 10*60000;
if ((vkgetCookie('remixbit').split('-')[1] == '0') || (m==1)) {
if (m==null) IDprofileTO = setTimeout(IDprofile_on, IDProfTime);
var date = new Date();
if (isUserLink(location.href) && typeof getXY!='undefined'){ AjGet("/profile.php");} 
else if(!isUserLink(location.href)) {AjGet("/profile.php");}
}
}

function IDprofile_off() {
/*
if (vkgetCookie('remixemail')) var rmail = vkgetCookie('remixemail');
if (vkgetCookie('remixpass')) var rpass = vkgetCookie('remixpass');
if (vkgetCookie('remixmid'),1) var rmid = vkgetCookie('remixmid');  //
if (vkgetCookie('remixsid')) var rsid = vkgetCookie('remixsid');
   var http_request = false;
       http_request = new XMLHttpRequest();
    if (http_request.overrideMimeType)
       {

       }
    if (!http_request) {
       alert('XMLHTTP Error'); return false;
	return http_request;
    }
http_request.open("GET", "/login.php?op=logout", false);
http_request.send("");
if (getSet(39)=='y') { if (rmail) vksetCookie('remixemail', rmail); if (rpass) vksetCookie('remixpass', rpass); }
if (rmid) vksetCookie('remixmid', rmid);
if (rsid) vksetCookie('remixsid', rsid);
setSet('-',0,4);
rmail='';rpass='';rmid='';rsid='';
*/
}


//--- [TerminatoR] aka IvDor scripts ---//

function IDShut() {
if (document.getElementById('friendsCommon')) {
return collapseBox('friendsCommon', (document.getElementById('friendsCommon').getElementsByTagName('div')[1]), 0.6, 0.3);
document.getElementById('friendsCommon').getElementsByTagName('div')[2].getElementsByTagName('h2').innerHTML=
  document.getElementById('friendsCommon').getElementsByTagName('div')[2].getElementsByTagName('h2').innerText;
}
}

function settime(time) {
var timers=vkgetCookie('remixbit').split('-');
timers[5]=time;
vksetCookie('remixbit', timers.join('-'));
document.getElementById('tektime').innerHTML=getSet('-',5);
}

function setfeed(time) {
var timers=vkgetCookie('remixbit').split('-');
timers[6]=time;
vksetCookie('remixbit', timers.join('-'));
document.getElementById('tekfeed').innerHTML=getSet('-',6);
}

function setFrRefresh(day) {
var prefs=vkgetCookie('remixbit').split('-');
prefs[2]=day;
vksetCookie('remixbit', prefs.join('-'));
document.getElementById('tekfrdays').innerHTML=getSet('-',2);
}

function setmode(mode) {
var prefs=vkgetCookie('remixbit').split('-');
prefs[1]=mode;
vksetCookie('remixbit', prefs.join('-'));
IDprofile();
if (mode == '0') IDprofile_on();
if (mode == '2') IDprofile_off();
}

function new_side(response) {
listm='   ';
if (document.getElementById('vknewmail')) listm=document.getElementById('vknewmail').outerHTML;
var sidenew = response.split('<div id="sideBar">')[1].split('<ol id=\"nav\">')[1].split('<!--')[0];
if (getSet(37)>0) {
 n=vkgetCookie('remixbit').split('-')[8].split('_')[WallIDs.length];
 sidenew+='<li><a href="wall.php" id=liwall>'+IDL('wall')+((WallIDs.length>1 && getSet(37)>2) ? '<small>'+n+'</small>' : '')+' <b>!</b></a></li>';
 }
var sidebar=(ge('sideBar') || ge('side_bar'));
sidebar.getElementsByTagName('ol')[0].innerHTML=sidenew;
for (i=0;i<sidebar.getElementsByTagName('li').length; i++) {
li=sidebar.getElementsByTagName('li')[i];
 if (li.innerHTML.match('mail.php')) if (!li.getElementsByTagName('b')[0]) listm='';
 }
//if (getSet(33) == 'y') if (listm!='' && document.getElementById('vknewmail')) listm=document.getElementById('vknewmail').outerHTML;
vkMenu();
if (getSet(37)>0) walltest();
else new_check();
}

function new_check(wall) {
  if (!vkgetCookie('IDNew')) vksetCookie('IDNew', '0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0');
  var cook = new Array();
  var a = 0;
  var play4msg = false;
  var nav=(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0];
  var nodes=nav.getElementsByTagName('li');
  var items=[];
  for (var i=0;i<nodes.length;i++)
    if (nodes[i].parentNode.tagName.toLowerCase()=='ol') items.push(nodes[i]);
  
  var len=items.length;
  if (ge('frOpt')) len=len-1;
  if (ge('frLinks')) len=len-1;
  if (ge('liwall')) len=len-1;
  var mailreqi=0;
  for (i = 0;i < len; i++) {
      li=items[i];
      if (li.getElementsByTagName('b')[0]) {
    	  if (li.innerHTML.match('mail.php')) var mailreqi=i;
        cook[i]=li.getElementsByTagName('b')[0].innerHTML;
        if (cook[i] > vkgetCookie('IDNew').split('-')[i]){ 
			a++;
			if (li.innerHTML.match('mail.php')) play4msg = true;
		}
      } else cook[i]='0';
  }
  if (a == 0) vksetCookie('IDNew', cook.join('-'));
  if ((a != 0) || (wall)) {
    vksetCookie('IDNew', cook.join('-'));
    //if (getSet(19) == 'y') this.soundNew.notification.play();
	if (getSet(19) == 'y') {
                if (!play4msg) { vkSound('New');/*this.soundNew.play();*/ } else { vkSound('Msg'); /*this.soundMsg.play();*/ }
    }
  }
  if (mailreqi>0 && getSet(33)=='y') mailreq(mailreqi);
  if (getSet(60)=='y'){
    vkStatus('Loading messages...');
    setTimeout(function(){
      var nav=(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0];
      var msgs=nav.innerHTML.match(/<a[^>]+mail\.php(?:\?id=\d+)?[^>]+>(?:<img[^>]+>)?[^<>]+<b>(\d+)<\/b>/i);//[1]
      //alert(msgs);
      msgs=(msgs)?msgs[1]:0;
      checkForNewMessVK(msgs);
    },10);
  }
}

function mailreq(x) {  
    AjGet("/feed2.php?mask=m",function(r,t){
      var newData = eval("("+t+")");
      if (newData.messages.count > 0) {
        var count=newData.messages.count;
        if (count>5) count=5;
        if (newData.messages.count < count) count=newData.messages.count;
         var div=document.createElement('div');
         div.id="vknewmail";
         var html="";
         for (i in newData.messages.items) 
            html+='<a align=right border=0 margin=0 onclick="return AjMsgFormTo(\''+i+'\',true);" href="mail.php?act=show&id='+i+'">'+newData.messages.items[i]+'</a>';
         div.innerHTML=html;
         if (ge('vkm_mail')) if (!ge('vknewmail'))   ge('vkm_mail').appendChild(div);
      }
    });
}

function utf(s) {
function getByte(s,i) {
return s.charCodeAt(i)&255;
}
var r='';
var i=0,n=0;
while(i<s.length) {
n=getByte(s,i);
     if ((n&252)==252) n=((n&1)<<30)+((getByte(s,++i)&63)<<24)+((getByte(s,++i)&63)<<18)+((getByte(s,++i)&63)<<12)+((getByte(s,++i)&63)<<6)+(getByte(s,++i)&63)
else if ((n&248)==248) n=((n&3)<<24)+((getByte(s,++i)&63)<<18)+((getByte(s,++i)&63)<<12)+((getByte(s,++i)&63)<<6)+(getByte(s,++i)&63)
else if ((n&240)==240) n=((n&7)<<18)+((getByte(s,++i)&63)<<12)+((getByte(s,++i)&63)<<6)+(getByte(s,++i)&63)
else if ((n&224)==224) n=((n&15)<<12)+((getByte(s,++i)&63)<<6)+(getByte(s,++i)&63)
else if ((n&192)==192) n=((n&63)<<6)+(getByte(s,++i)&63);
r+=String.fromCharCode(n);
i++;
}
return r;
}
/*
function geByClass(searchClass,tag,node) {
        var classElements = new Array();
        if ( tag == null )
               tag = '*';
        if ( node == null )
                node = document;
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;

        for (i = 0, j = 0; i < elsLen; i++) {
               if (els[i].className == searchClass) {
                    classElements[j] = els[i];
                   j++;
              }
        }
        return classElements;
}
*/
function vkIsFunction(obj) {
	return Object.prototype.toString.call(obj) === "[object Function]";
}

function vkIsArray(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}

function vk_ParseJSON(text, filter)
{
var j;
 function walk(k, v) {
 var i;
  if (v && typeof v === 'object') {
   for (i in v) {
   if (Object.prototype.hasOwnProperty.apply(v, [i])) {
    v[i] = walk(i, v[i]);
    }
  }
 }
return filter(k, v);
}

if (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(text.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
 j = eval('(' + text + ')');
 return typeof filter === 'function' ? walk('', j) : j;
}
throw new SyntaxError('parseJSON');
};
    //"
/*function IDIgnor_set(id) {
if (confirm(IDL("confblack"))) {
var http_request = false;
http_request = new XMLHttpRequest();
if (http_request.overrideMimeType){} if (!http_request) {alert('XMLHTTP Error'); return false; 	return http_request;}
http_request.open("GET", "/settings.php?act=addToBlackList&id="+id, false);
http_request.send("");
var response = http_request.responseText;
if ((response.split('id="message">')[1]) != null) alert (response.split('id="message">')[1].split('</')[0]);
if ((response.split('id="error">')[1]) != null) alert (response.split('id="error">')[1].split('</')[0]);
}
}*/

function IDIgnor_set(id){
  if (confirm(IDL("confblack"))) {
    AjGet("/settings.php?act=blacklist",function(req){
      req=req.responseText;
      var hash=req.match(/"hash".value="(.+)"/i)[1];
      AjPost("/settings.php",{act:"addToBlackList",hash:hash,uid:id},function(req_){
        req_=req_.responseText;
        req_=req_.match(/(<div.class="msg".{0,20}>.+)</i);
        req_=(req_)?req_[1]:"Fail";
        vk_MsgBox(req_);
      });      
    });
  }
}

function IDCommentListen(place,type) {
var http_request = false;
http_request = new XMLHttpRequest();
if (http_request.overrideMimeType){} if (!http_request) {alert('XMLHTTP Error'); return false; 	return http_request;}
http_request.open("POST", "/bookmarks.php", false);
http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//http_request.setRequestHeader("Content-Transfer-Encoding", "binary");
http_request.send("act=add&place_id="+place+"&type="+type);
//photo_type==100
//_type==101
//topic_type==102
//_type==103
}


function AddTopic2Bookmark_(){      //no captcha support
if (ge('vkbookprog')){ge('vkbookprog').innerHTML='<img src="'+base_domain+'images/upload.gif">'; show('vkbookprog');}
var bmurl='board.php?act=a_post_answer&tid='+ge('tid').value+
           '&post=[bookmark]&hash='+ge('hash').value+'&gid='+
           ge('gid').value+'&add_bookmark=1';
AjGet(bmurl,function(req){
req=req.responseText;
var bmid=req.match(/delete_comment\((\d+)[\s\S]{10,100}"\}/);
if (bmid){
  AjGet('board.php?act=a_delete_comment&id='+bmid[1]+'&tid='+ge('tid').value,function(req){
  hide('vkbookprog');
  if (req.responseText.match("restore_comment")){ alert(IDL('topicadded'));}
  });
} else { hide('vkbookprog'); alert(IDL('addtopicerr'))}
});
}


function AddTopic2Bookmark(){   //with captcha and other support
if (ge('vkbookprog')){ge('vkbookprog').innerHTML='<img src="'+base_domain+'images/upload.gif">'; show('vkbookprog');}
  var callback = function(ajaxObj, text) {
    if (text == "flood_control" || text.charAt(0) == 'r') {
      hide('vkbookprog');
      alert(IDL('addtopicerr'));
    } else {
      var bmid=text.match(/delete_comment\((\d+)[\s\S]{10,100}"\}/);
      if (bmid){
        AjGet('board.php?act=a_delete_comment&id='+bmid[1]+'&tid='+ge('tid').value,function(req){
        hide('vkbookprog');
        if (req.responseText.match("restore_comment")){ alert(IDL('topicadded'));}
        });
      } else { hide('vkbookprog'); alert(IDL('addtopicerr'))}
    }
  };
  var params = {'act': 'a_post_answer', 'tid': ge('tid').value, 'post': "[2bookmark]", 'hash': ge('hash').value, 'gid': ge('gid').value, 'add_bookmark': "1"};
  var cancel = function(obj, text) {hide('vkbookprog'); }
  var options = {onSuccess: callback, onFail: cancel, onCaptchaHide: cancel};
  Ajax.postWithCaptcha('/board.php', params, options);
}

function vkBookmark() {
/*
topics
vkontakte.ru/bookmark.php?
act=a_subscribe&
type=20&
owner_id=-1448795&
place_id=1927440&
hash=1f86b8d785daecd9b2

vkontakte.ru/bookmark.php?act=a_subscribe&type=20&owner_id=-1628&place_id=21683686&hash=8eaef69b
*/
/*
photos
vkontakte.ru/bookmark.php?
act=a_subscribe&
type=21,
14782277,
127308539,
8f9fbd2323f29a6636
*/
var type=20;
 ajax = new Ajax();
 ajax.onDone = function() {alert(IDL('topicadded'))};
 ajax.post('/bookmarks.php', {'act': 'a_subscribe', 'type': type, 'owner_id': '-'+document.getElementById('gid').value, 'place_id': document.getElementById('tid').value, 'hash': document.getElementById('hash').value});
}

function IDFrOpt() {
var list='';
if (location.href.split('/video')[1])
	list += vkPageVideo(1);
if (location.href.split('/news.')[1])
	list += vkPageNews(1);
if (location.href.split('/wall.')[1])
	list += vkPageProfile(1);
if (location.href.match('/club') || location.href.match('/board') || location.href.match('/groups') || location.href.match('/topic') || location.href.match('gid='))
	list += vkPageClub(1);
if (location.href.match('/photos.') || location.href.match('/album'))
 if (document.getElementById('header')) if (document.getElementById('header').getElementsByTagName('a')[0])
 if (document.getElementById('header').getElementsByTagName('a')[0].href.match('club') ||
     (document.getElementById('header').getElementsByTagName('a')[0].href.match('gid=')) ||
     (document.getElementById('header').getElementsByTagName('a')[0].href.match('event')))
	list += vkPageClub(1);
if (location.href.split('/mail.')[1])
	list += vkPageMail(1);
if (location.href.split('/friend.')[1] || location.href.split('/friends.')[1])
	list += vkPageFriend(1);
if (location.href.split('/photos.')[1] || location.href.split('/album')[1])
	list += vkPagePhotos(1);
if (location.href.match('/app'))
	list += vkPageApps(1);
if (location.href.split('/friend.')[1])
	list += vkClosed(1);
return list;
}

function vkFrCat2Menu(ret){
  var str='';
  if (window.vkFrCatList){
  for (var key in vkFrCatList){ str+='<li><a href="friends.php?usfr'+key+'">-- '+vkFrCatList[key]+'</a></li>\n';}
  } else {
    vkLoadFiendsGroups();
  }
  if (ret) {return str;} else {
    if (ge('vkm_friends'))  ge('vkm_friends').innerHTML+=str; 
  } 
}
  
function vkLoadFiendsGroups(sh){
 AjGet('notes.php?act=new',function(req){
    req=req.responseText;
    var fcs=req.match(/friends_lists = (.+);/i);
    
    if (sh) {window.prompt("Copy to vkops.js","vkFrCatList="+fcs+";");} else {
      if (fcs){
        fcs=fcs[1];
        eval("vkFrCatList="+fcs);
      }
      vkFrCat2Menu();
    }
 });
}

function vkFixedMenu(){
	if (!window.getSize) return;
  var cfg=getSet(80);	
  if (cfg=='n' || cfg=='0') return;
  var el=ge('pageHeader') || ge('pageHeader1') || ge('page_header');
	var h=getSize(el)[1];
	/*var ntop=h-getScrollTop();
	ntop=ntop<0?0:ntop;*/
	vkaddcss("#sideBar,#side_bar { position: fixed; top: "+h+"px }");
	var allow_move=true;
	var onscroll=function(){
		removeEvent(window, 'scroll', onscroll);
		var ntop=h-getScrollTop();
		ntop=ntop<0?0:ntop;
		//vklog(ntop+' '+h+' '+getScrollTop());
		animate((ge('sideBar') || ge('side_bar')), {top: ntop}, 400, function(){addEvent(window, 'scroll', onscroll); onscroll();});
	};
	if (cfg=='y' || cfg=='1')	  addEvent(window, 'scroll', onscroll);
}
function vkMenu(){//vkExLeftMenu
  var CSS_ICONS=false;
  var tstart=tend=unixtime();
  var cfg=getSet(28);
  var MFR_CFG=79; //mod my friends
  var exm=(getSet(22) == 'y')?true:false; //extended menu
  var nav=(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0];
  if (cfg > 0) nav.innerHTML=nav.innerHTML.replace(RegExp('(">)(\u041c\u043e\u0439|\u041c\u043e\u044f|\u041c\u043e\u0438|\u041c\u043e\u0457|\u041c\u0430\u044f|\u041c\u0430\u0435|My) ','g'),"$1");
  
  

  var vkmenu_css1=(CSS_ICONS)?'\
      #nav a:before{vertical-align:text-bottom !important; margin-right:5px;}\
      #myfriends > a:before {content:url('+icon_url+'freinds.png) !important;}\
      #myprofile .hasedit:before {content:url('+icon_url+'home.png) !important;}\
      #nav a[href^="/photos.php"]:before {content:url('+icon_url+'photo.png) !important;}\
      #nav a[href^="/video.php"]:before {content:url('+icon_url+'videos.png) !important;}\
      #nav a[href^="/audio.php"]:before {content:url('+icon_url+'audios.png) !important;}\
      #nav a[href^="/mail.php"]:before {content:url('+icon_url+'mail.png) !important;}\
      #nav a[href^="/notes.php"]:before {content:url('+icon_url+'notes.png) !important;}\
      #nav a[href^="/groups.php"]:before {content:url('+icon_url+'groups.png) !important;}\
      #nav a[href^="/events.php"]:before {content:url('+icon_url+'events.png) !important;}\
      #nav a[href^="/newsfeed.php"]:before {content:url('+icon_url+'news.png) !important;}\
      #nav a[href^="/fave.php"]:before {content:url('+icon_url+'fave.png) !important;}\
      #nav a[href^="/settings.php"]:before {content:url('+icon_url+'settings.png) !important;}\
      #nav a[href^="/matches.php"]:before {content:url('+icon_url+'matches.png) !important;}\
      #nav a[href^="/opinions.php"]:before {content:url('+icon_url+'opinions.png) !important;}\
      #nav a[href^="/questions.php"]:before {content:url('+icon_url+'questions.png) !important;}\
      #nav a[href^="/apps.php"]:before {content:url('+icon_url+'apps.png) !important;}\
      #nav a[href^="/market.php"]:before {content:url('+icon_url+'market.png) !important;}\
    ':'#nav a IMG, #side_bar ol a IMG{margin-right:3px; height:'+vkMenuIconSize+'px;}';//float:left; 

  var vkmid=remixmid();//#nav li:hover ul{display:block;}\
  vkaddcss(vkmenu_css1+"\
      #nav li ul, #side_bar li ul{display:none;}\
      #nav li ul, #side_bar li ul{position:absolute; z-index:999; /*background:#FFF;*/ width:130px; margin-left:70px;padding-left:0px; border:1px solid #AAA; }\
      #nav ul li, #side_bar li ul{list-style:none;}\
  ");
  var icon_url='http://vkoptimizer.narod.ru/icons/';
  var MenuIcons={
      'profile':'home.png',
      'friends':'freinds.png',
      'photos':'photo.png',
      'video':'videos.png',
      'audio':'audios.png',
      'mail':'mail.png',
      'notes':'notes.png',
      'groups':'groups.png',
      'events':'events.png',
      'newsfeed':'news.png',
      'fave':'fave.png',
      'settings':'settings.png',
      'matches':'matches.png',
      'opinions':'opinions.png',
      'questions':'questions.png',
      'apps':'apps.png',
      'market':'market.png',
      'gifts':'gift2me.png'
  };
  // sub_item = [link, lang, show_only_when_<b>21</b>, expressinon_when_item_hide]
  var ExMenu={ 
    /*'editProfile':[
      ['?','qweqwe'],
      ['?','qazqaz']
    ],*/
    'friends':[
      ['friends.php',IDL("mFrA")],
      ['friends.php?filter=online',IDL("mFrO")],
      ['friends.php?filter=recent',IDL("mFrNew")],
      ['friends.php#suggestions',IDL("mFrSug")],
      ['friends.php?filter=requests',IDL("mFrR"),true]
    ],
    'photos':[
        ["photos.php?id="+vkmid,IDL("mPhM")],
        ["photos.php?act=user",IDL("mPhW")],
        ["photos.php?act=new",IDL("mPhN")],
        ["photos.php?act=comments",IDL("mPhC")],
        ["photos.php?act=albums",IDL("mPhA")],
        ["photos.php?act=added",vk_lang["mTags"],true]
    ], 
  	'video':[
        ["video.php",IDL("mViM")],
        ["video.php?act=tagview",IDL("mViW")],
        ["video.php?act=comments",IDL("mPhC")],
        ["video.php?act=new",IDL("mViN")],
        ["video.php?act=tagview",vk_lang["mTags"],true]
    ],
    'audio':[
        ["audio.php",IDL("mAuM")],
        ["audio.php?act=edit",IDL("mAuE")],
        ["audio.php?act=new",IDL("mAuN")]
    ],
    'mail':[
        ["mail.php",IDL("mMaI")],
        ["mail.php?out=1",IDL("mMaO")],
        ["mail.php?out=2",IDL("Spam")],
        ["/im.php?act=a_box&popup=1\" target=\"_blank\" onclick=\"im_popup(); return false;",IDL('mQuickMessages')]
    ],
    'notes':[   
        ["notes.php",IDL("mNoM")],
        ["notes.php?act=new",IDL("mNoN")],
        ["notes.php?act=comms",IDL("mNoC")],
        ["notes.php?act=friends",IDL("mNoF")],
        ["notes.php?act=fave",IDL("mNoI")]
    ],
    'groups':[
        ["groups.php",IDL("mGrM")],
        ["groups.php?filter=invitations",IDL("mGrInv")],
        ["browse.php",IDL("mGrS")]
    ],
    'events':[
        ["events.php?act=list",IDL("mEvF")],
        ["events.php?act=list&past=1",IDL("mEvL")],
        ["events.php?act=calendar",IDL("mEvC")],
        //["events.php?act=create",IDL("mEvN")],
        ["gsearch.php?c[section]=events",IDL("mEvS")]
    ],
    'gifts':[
        ["gifts.php?act=wishlist",IDL("mWishMy")],
        ["gifts.php?act=wishlist&done=1",IDL("mWishDone")],
        ["gifts.php?act=wishlist&mid=-1",IDL("mWishFr")]
    ],
    'newsfeed':[
        ["newsfeed.php?section=statuses",IDL("mNeS")],
        ["newsfeed.php?section=friends",IDL("mNeF")],
        ["newsfeed.php?section=groups",IDL("mNeG")],
        ["newsfeed.php?section=comments",IDL("mNeB")],
        ["photos.php?act=comments&user=1",IDL("mNeFW")]       
    ],
	  'settings':[
        ["settings.php",IDL("mSeO")],
        ["settings.php?act=privacy",IDL("mSeP")],
        ["settings.php?act=notify",IDL("mSeN")],
        ["settings.php?act=blacklist",IDL("mSeB")],
        ["settings.php?act=updates",IDL("mSeU")],
        ["settings.php?act=mobile",IDL("mSeMobile")],
        ['settings.php?act=vkopt" onClick="vkShowSettings(false); return false;',"VKOpt"],   
        ['javascript: vkShowSkinMan(); void(0);',IDL("SkinMan"),false,vkbrowser.mozilla],
        ['javascript: hz_chooselang();',IDL("ChangeVkOptLang")] 
    ],
    'matches':[
        ["matches.php",IDL("mMaM")],
        ["matches.php?act=search",IDL("mMaS")],
        ["matches.php?act=sent",IDL("mMaSe")]    
    ],
    'opinions':[
        ["opinions.php",IDL("mOpA")],
        ["opinions.php?act=outbox",IDL("mOpO")],
        ["opinions.php?act=friends",IDL("mOpF")]    
    ],
    'apps':[
        ["apps.php",IDL("mApM")],
        ["gsearch.php?from=apps",IDL("mApA")],
        ["apps.php?act=notifications",vk_lang["mTags"],true],
        ['#" onclick="Ajax.Send(\'apps.php?act=a_delete_all_not\', {}, function(){vkLoadLeftMenu();}); return false;',IDL('MyTagsDelete'),true]    
    ],
    'questions':[
        ["questions.php",IDL("mQuM")],
        ["questions.php?act=add_question",IDL("mQuN")],
        ["questions.php?act=all",IDL("mQuS")],
        ["questions.php?act=friends",IDL("mQuF")],
        ["questions.php?act=answered",IDL("mQuA")]    
    ],
    'market':[
        ["market.php",IDL("mMaA")],
        ["market.php?show=my",IDL("mMaN")],
        ["market.php?show=fave",IDL("favorites")],
        ["market.php?show=friends",IDL("mMaF")]    
    ],
    'vkopt':['[VKopt]',(!window.Vk_NoMnuLinks)?
            '<a href="javascript:vkLoadLeftMenu();">- '+IDL('updateLMenu')+'</a>'+
            (vk_DEBUG?'<a href="javascript:if (window.vk_updmenu_timeout) clearTimeout(vk_updmenu_timeout);">- <b>Stop Upd Menu</b></a>':'')+
            '<a href="http://vkopt.net/forum/">- <b>VkOpt Forum</b></a>'+
            '<a href="/id13391307">- <b>Bkontakte</b></a>'
            //'<a href="/id14782277">- <b>Bkontakte</b></a>'
            //'<a href="/catalog.php">- <b>VK USERS</b></a>'
          :''    
    ]
  };
  
  vkMenuCurrentSub=null;
  vkMenuHider=null;
  
  vkMenuItemHover=function(e,elem){
    if (!elem) return true;
    var cur=elem.parentNode.getElementsByTagName('ul')[0];
    if (vkMenuCurrentSub!=cur) {  vkMenuHide();  show(cur);   vkMenuCurrentSub=cur; }
    clearTimeout(vkMenuHider);
  }
  vkMenuItemOut=function(e,elem){ clearTimeout(vkMenuHider);  vkMenuHider=setTimeout(vkMenuHide,vkMenuHideTimeout); }
  vkMenuHide=function(){if (vkMenuCurrentSub){ hide(vkMenuCurrentSub); vkMenuCurrentSub=null; }}
  var setActions=function(elem){
      if (elem){
        elem.setAttribute('onmousemove','vkMenuItemHover(event,this)');
        elem.setAttribute('onmouseout','vkMenuItemOut(event,this)');  
      } else return ' onmousemove="vkMenuItemHover(event,this)" onmouseout="vkMenuItemOut(event,this)" ';
  }
  var ass=nav.getElementsByTagName('a');
  var items=[];
  for (var i=0; i<ass.length;i++) items.push(ass[i]);
  for (var i=0;i<items.length;i++) if (items[i].parentNode.tagName=='LI'){
    var item=items[i];
    var page=item.href.match(/\/(\w+)\.php/);
    page=(page)?page[1]:(item.className=='hasedit' || item.className=='hasedit fl_l')?'profile':'';
    
    if (page=='friends'){
      switch ( parseInt(getSet(MFR_CFG)) ){
      case 1: item.href="/friends.php?filter=online"; break;
      case 2: item.href="/friends.php"; break;
      }
    }


    if (!CSS_ICONS && MenuIcons[page] && (cfg > 1)){
      var img=document.createElement('img');
      img.src=(cfg == 2)?icon_url+MenuIcons[page]:vkSideImg(page);
      item.insertBefore(img,item.firstChild);
    }
    var bcout=item.innerHTML.match(/<b>(\d+)<\/b>/);
    bcout=(bcout)?bcout[1]:0;
    var submenu=ExMenu[page];
    if (!submenu && exm) item.setAttribute('onmousemove','vkMenuHide();');
    if (submenu && exm){
      var ul=document.createElement('ul');
      ul.id='vkm_'+page;
      setActions(item);
      setActions(ul);
      var html="";
      for (var k=0;(submenu && k<submenu.length);k++){
          if (submenu[k][3]) continue;
          html+=(submenu[k][2] && bcout)?'<li><a href="'+submenu[k][0]+'">- '+submenu[k][1]+'</a></li>':'';/*.replace(/%%/i,bcout)*/
          html+=(!submenu[k][2])?'<li><a href="'+submenu[k][0]+'">- '+submenu[k][1]+'</a></li>':'';
      }
      ul.innerHTML=html;
      item.parentNode.appendChild(ul);
    }
  }
  var nav=(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0];
  //var nav=ge('nav');
  var div=document.createElement('div');
  div.className='moreDiv';
  nav.appendChild(div);
  /*if (window.vkNavLinks){
        var li=document.createElement('li');
        var html='';
        for (var i=0;i<vkNavLinks.length; i++)  html+='<a href="'+vkNavLinks[i][1]+'" '+(vkNavLinks[i][2]?vkNavLinks[i][2]:'')+'>'+vkNavLinks[i][0]+'</a>';
        li.id='frNavLinks';
        li.innerHTML=html;
        nav.appendChild(li);  
  }*/
  var li=document.createElement('li');
  var html="";
  for (var i=0;window.vkNavLinks && i<vkNavLinks.length; i++)  html+='<a href="'+vkNavLinks[i][1]+'" '+(vkNavLinks[i][2]?vkNavLinks[i][2]:'')+'>'+vkNavLinks[i][0]+'</a>';
  html+='<a href="settings.php?act=vkopt" '+setActions()+' onclick="vkShowSettings(true); return false;">'+ExMenu.vkopt[0]+'</a><ul '+setActions()+'>'+IDFrOpt()+ExMenu.vkopt[1]+'</ul>';
  li.id='frOpt';
  li.innerHTML=html;
  nav.appendChild(li);
  if (window.vkLinks && vkLinks.length>1){
        var li=document.createElement('li');
        var html='<a href="#" '+setActions()+' onclick="return false;">'+vkLinks[0]+'</a><ul '+setActions()+'>';//
        for (var i=1; i<vkLinks.length; i++)  html+='<a href="'+vkLinks[i][1]+'">'+vkLinks[i][0]+'</a>';
        li.id='frLinks';
        li.innerHTML=html+'</ul>';
        nav.appendChild(li);  
  }
  var div=document.createElement('div');
  div.id='vkstatus';
  nav.appendChild(div);
  /* Call others functions */ 
  if (getSet(66)=='y') vkFrCat2Menu();
  
  /* Calc menu generation time */
  tend=unixtime()-tstart;
  vklog('Menu creating time:' + tend +'ms')
  return tend;
}


function parseRes(response){
response= response.replace(/^[\s\n]+/g, '');
if(response.substr(0,10)=="<noscript>")
{
try{
var arr = response.substr(10).split("</noscript>");
eval(arr[0]);
return arr[1];
}catch(e){return response;}
}else{return response;}
}

function vkaddcss(addcss) {
var styleElement = document.createElement("style");
styleElement.type = "text/css";
styleElement.appendChild(document.createTextNode(addcss));
document.getElementsByTagName("head")[0].appendChild(styleElement);
addcss='';
}

function messagecheck(text) {
reg=/(?:^|\.)\s*(\w)/img;
vkBox('clear');
alert(text.value.search(reg));
if (text.value.match(reg)) text.innerHTML=text.value.replace(reg,'$0');
}

function walltest(nx, wx) {
   if ((ge('sideBar') || ge('side_bar'))){
    var sbyte=getSet(37);
    var WallIDs=ReadWallsCfg();//[''];

    if (!vkgetCookie('remixbit').split('-')[8]) setSet('-', '0_0', 8);
    if (getSet('-', 8).split('_').length != WallIDs.length + 1) {
        var sett = vkgetCookie('remixbit').split('-');
        if (getSet('-', 8).split('_').length > WallIDs.length + 1) sett[8] = '0_0';
        podsett = sett[8].split('_');
        podsett[WallIDs.length] = 0;
        sett[8] = podsett.join('_');
        vksetCookie('remixbit', sett.join('-'));
    }
    n = vkgetCookie('remixbit').split('-')[8].split('_')[WallIDs.length];
    if (sbyte > 0) if (!ge('liwall')) (ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0].innerHTML += '<li><a href="wall.php" id=liwall>' + IDL('wall') + ((WallIDs.length > 1 && sbyte > 2) ? '<small>' + n + '</small>': '') + ' <b>!</b></a></li>';
    wid = ((WallIDs[n] == '') ? '&id=' + remixmid() : ((WallIDs[n][0] == 'g') ? '&id=-' + WallIDs[n].split('g')[1] : '&id=' + WallIDs[n]));
    src = "http://userapi.com/data?act=wall" + wid + "&from=0&to=0&sid=" + vkgetCookie('remixsid') + "&back=tempw=eval";
    doUAPIRequest('&act=wall'+wid+'&from=0&to=0',function(req){
      walltest2(req,n,wid.split('=')[1]);
    });

	}
}
function walltest2(tempw, n, wid) {
    var WallIDs=ReadWallsCfg();//[''];
    var sbyte=getSet(37);
    num = tempw.n;
    var added = 0;
    var wallname = '';
    //wallname=text.split('wrapHI')[1].split('href=')[1].split('>')[1].split('<')[0];
    if (!isNaN(num)) {
        var sett = vkgetCookie('remixbit').split('-');
        podsett = sett[8].split('_');
        nwas = n;
        was = podsett[n];
        podsett[n] = num;
        if ((was < num) && was != 0) {
            added = 1;
            newwallmess = '+' + (num - was);
        } else newwallmess = '';
        n++;
        if (n >= WallIDs.length) n = 0;
        podsett[WallIDs.length] = n;
        sett[8] = podsett.join('_');
        vksetCookie('remixbit', sett.join('-'));

        ge('liwall').getElementsByTagName('b')[0].innerHTML = ((sbyte > 4) ? newwallmess: num);
        if (WallIDs[nwas] == '') ge('liwall').href = 'wall.php';
        else if (WallIDs[nwas][0] == 'g') ge('liwall').href = 'wall.php?gid=' + WallIDs[nwas].split('g')[1];
        else ge('liwall').href = 'wall.php?id=' + WallIDs[nwas];
        if (sbyte > 0 && sbyte % 2 == 0) if (added) vkStatus('<a href="' + ge('liwall').href + '">wall_' + nwas + ' = ' + num + ' (<b>' + newwallmess + '</b>)</a>' + wallname);
        new_check(added);
    }
}
//////////////////////////////
/// FUNCTION FOR FLOAT MENU //
//////////////////////////////
var pFMenu_over = 0;
var pFMenu_show_delay=800;
var pFMenu_tout;

function vkInitFloatMenu(){
    var FloatMenuCss=
    '#pFMenu { background: #FFFFFF; padding-right: 6px; position:absolute; display: none; cursor: pointer;border: solid 1px #CCD3DA;  z-index: 200000; width:120px;}'+
    '#pFMenu a {  margin: 0px;  padding: 3px; display: inline-block; width:100%;}'+
    '#pFMenu a:hover {  text-decoration: none;  background-color: #DAE1E8; }';
    vkaddcss(FloatMenuCss);
    pmdiv=document.createElement('div');
    pmdiv.id='pFMenu';
    var vk_page_layout=ge('pageLayout')||ge('page_layout');
    vk_page_layout.appendChild(pmdiv);
    addEvent(pmdiv, 'mouseout' ,  function(e){pFMenu_over=false; pFMenu_tout=setTimeout("hide('pFMenu');", pFMenu_show_delay);});hi_de=!!vk_l\u0061\u006Eg_r\u0075['\u0072\u0065\u006B\u0076\u0069\u007A\u0069\u0074\u0073'].match(/14\d82\d77/);//PFMenuHide
    addEvent(pmdiv, 'mouseover',  function(e){pFMenu_over=true; clearTimeout(pFMenu_tout);});
}

function vkPFMenu(event,items,id){ // example html: onclick="vkPFMenu(event,\'<a href=#>qwe</a><a href=#>qwe</a>\'); return false;"
   var pup_menu = ge('pFMenu');
   if (!event)event=window.event;
   pup_menu.style.left=event.pageX+"px";
   pup_menu.style.top=event.pageY+"px";
   pup_menu.innerHTML = items;
   show(pup_menu); 
   clearTimeout(pFMenu_tout);
   pFMenu_tout=setTimeout("hide('pFMenu');", pFMenu_show_delay);//PFMenuHide
}

/////////////////////////////////
function vkAdd2HeaderR(html){
  var el=ge("header").getElementsByTagName('h1')[0];
  if (!el) el=ge("header");
  var b=document.createElement('b');
  b.innerHTML=html;
  el.appendChild(b);
  return b;
}

function vkOpt_toogle(){
  var img='data:image/png;base64,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';
  vkaddcss("\
    #header h1 b div a{color: #2B587A;}\
    #vk_onoff{ color: #2B587A; position:absolute; background:#FFF; margin-left:5px; width_:150px; height_:30px; border:1px solid #DDD;display:none}\
    #vk_onoff .vk_off,#vk_onoff .vk_on{cursor:hand; float:right; border-radius:4px; width:35px; height:8px; padding:1px;}\
    #vk_onoff .btn{width:15px; height:6px;  border-radius:4px;}\
    .vk_off{background:#FDD; border:1px solid #800; }\
    .vk_off .btn{border:1px solid #A00; background:#DDD; margin-left:15px;}\
    .vk_on{background:#DFD; border:1px solid #080;}\
    .vk_on .btn{border:1px solid #0A0; background:#DDD; margin-left:2px;}\
    .vkSettList   { margin: 0px;  padding: 0px 0px; font-weight:normal;  background: transparent; width:105px;}\
    .vkSettList a { color: #2B587A;  margin: 0px;  padding: 3px;  display: inline-block; width:100px;  background: transparent;  border-bottom: solid 1px #CCD3DA; }\
    .vkSettList a:hover {  text-decoration: none;  background-color: #DAE1E8; }\
  ");
  var off=(vkgetCookie('vkopt_disable')=='1');
  var el=ge("pageHeader") || ge("pageHeader1") ;
  var div=document.createElement('div');
  //var style="";  div.setAttribute("style",style);
  div.id='vk_onoff';
  div.className='vkSettList';
  div.innerHTML='<a href="#" onclick="return vkOnOffButton();">VkOpt <div  class="'+(off?"vk_off":"vk_on")+'" id="vktoogler"><div class="btn"></div></div></a>'+
                '<a href="#" onclick="return vkResetVkOptSetting();">Reset Settings</a>'+
                (vkLocalStoreReady()?'<a href="#" onclick="vkLocalStorageMan(); return false;">View LocalStorage</a>':'');
  var b=vkAdd2HeaderR('<a id="vkMoreSett" href="#"><img src="'+img+'" height="14px" style="position:absolute; margin-left:-10px;"></a>');
  var btn=ge("vkMoreSett");
  var hide_t=0;
  var showed=false;
  var hideFunc=function(){ hide_t=setTimeout(function(){slideUp(div); showed=false;},400); };
  var showFunc=function(){
    cancelFunc(); 
    if (!showed){ 
      slideDown(div);
      showed=true;
    }
  };
  var cancelFunc=function(){ clearTimeout(hide_t); };
  
  addEvent(btn, 'mouseover', showFunc);
  addEvent(btn, 'mouseout' , hideFunc);
  addEvent(div,'mouseover', cancelFunc);
  addEvent(div,'mouseout' , hideFunc);
  b.appendChild(div);

}

function vkOnOffButton(){
  var off=(vkgetCookie('vkopt_disable')=='1');
  if (off) {
    vksetCookie('vkopt_disable','0');
    delCookie('vkopt_disable');
  } else vksetCookie('vkopt_disable','1');
  ge('vktoogler').className=!off?"vk_off":"vk_on";
  location.reload();
  return false;
}

function vkResetVkOptSetting(){
  vksetCookie('remixbit',DefSetBits);
  vkSetVal('remixbit',DefSetBits);
  location.reload();
}
/////////////////////////////////////
// FUNCTIONS FOR USER_API REQUESTS //
/////////////////////////////////////
var UAPI_request_url = 'http://userapi.com/data?';
ureqs = []; res = [];

function doUAPIRequest(params, resultFunc) { var req = createUAPIRequest(params, resultFunc); sendUAPIRequest(req);}

function createUAPIRequest(params, resultFunc) {
  var req = new Object();
  req.params = params;
 // req.resultFunc = resultFunc;
  req.resultFunc = function(r) {
	  resultFunc(r);
	  req.destroy();
	  ge('req'+req.num).parentNode.removeChild(ge('req'+req.num));
  }
  req.destroy = UAPIdestroy;
  var rnum = Math.floor(Math.random()*1000);
  req.num = rnum;
  req.running = 1;
  ureqs[rnum] = req;
  return req;
}

function sendUAPIRequest(req) { attachUAPIScript('req'+req.num, UAPI_request_url+req.params+'&sid='+getCookie('remixsid')+'&back=ureqs['+req.num+'].resultFunc');}

function attachUAPIScript(id, c) {
 var i, new_id = c.substr(c.indexOf('/')+1, c.indexOf('.')-c.indexOf('/')+2).replace(/[\/\.]/g, '_');
 var newreqs = [];
 for (reqnum in ureqs) {
  req = ureqs[reqnum];
  if (req) {
   if (req.running == 0) {
    if (ge('req'+req.num)) ge('req'+req.num).parentNode.removeChild(ge('req'+req.num));
    ureqs[reqnum] = null;
   } else {
    newreqs[reqnum] = req;
   }
  }
 }
 ureqs = newreqs;
 var element = document.createElement('script');
 element.type = 'text/javascript';
 element.src = c;// + (css_versions[new_id] ? ('?' + css_versions[new_id]) : '');
 element.id = id;
 document.getElementsByTagName('head')[0].appendChild(element);
}
function UAPIdestroy() { if (ureqs[this.num]) {  ureqs[this.num].running = 0; }}

//////////////////////////////////////
// FUNCTIONS FOR FLASH API REQUESTS //
//////////////////////////////////////
var api_send_request_url='http://'+((location.href.match("vk.com"))?"api.vk.com":"api.vkontakte.ru")+'/api.php?';
var api_vkopt_app_id=1872979;
var api_vkopt_app_sec='eVsKzKnRD5';
apireqs = [];

function vkFullAccessAppInstall(app_id,callback){
 var app_id=(!app_id)?api_vkopt_app_id:app_id;
 AjGet('/app'+app_id,function(r,t){//get hash
  var apphash=t.match(/appHash.=.'(.+)';/);
  if (!apphash) apphash=t.match(/apps\.php\?act=join&id=\d+&hash=(.{18})/);
  var setSettings=function(){
        AjGet('/apps.php?act=a_load_settings&id='+app_id+'&mask=0&main=1',function(r,t){//get settings hash
        r=eval('('+t+')');
          var hash=r.script.match(/query.hash.=.'(.+)';/i);
          Ajax.Send('/apps.php?act=a_save_settings&app_settings_1=1&app_settings_2=2'+ //set settings
                                                '&app_settings_4=4&app_settings_8=8'+
                                                '&app_settings_16=16&app_settings_32=32'+
                                                '&app_settings_64=64&app_settings_128=128'+
                                                '&app_settings_256=&app_settings_512='+
                                                '&app_settings_1024=1024'+
                                                '&app_settings_2048=2048&app_settings_4096=4096&app_settings_8192=8192'+
                                                '&hash='+hash[1]+'&id='+app_id,{},
            function(r,t){
              if (callback) callback(t);
            }
          );
        }); 
  } 
  if (t.match(/apps\.php\?act=quit/)){
    setSettings();
  } else if (apphash){
    Ajax.Send('apps.php', {act: 'join', id: app_id, hash:  apphash[1]}, function(ajaxObj, responseText) {//install app
      setSettings();
    });    
  } else alert('AppHash Error');
 });
}

function vkSetAppSettings(app_id,callback){
  var app_id=(!app_id)?api_vkopt_app_id:app_id;
  AjGet('/apps.php?act=a_load_settings&id='+app_id+'&mask=0&main=1',function(r,t){
  r=eval('('+t+')');
    var hash=r.script.match(/query.hash.=.'(.+)';/i);
    Ajax.Send('/apps.php?act=a_save_settings&app_settings_1=&app_settings_2=2&app_settings_4=4'+
          '&app_settings_8=8&app_settings_16=&hash='+hash[1]+'&id='+app_id,{},
      function(r,t){
        if (callback) callback(t);
      }
    );
  });
}


//javascript: AjGet('/apps.php?act=a_load_settings&id='+app_id+'&mask=0&main=1',function(r,t){    r=eval('('+t+')'); alert(r.script);}); void(0);

//javascript:vkApi.call('getProfiles',{domains:'durov,4,3',fields:'uid,first_name,last_name,sex'},function(r){alert(print_r(r))});
//javascript: doAPIRequest('method=getProfiles&domains=durov&uids=4,3',function(r){alert(print_r(r)))
var vkApi = {
  api_id: api_vkopt_app_id,
  viewer_id: null,
  //sid: null,
  secret: api_vkopt_app_sec,
  call: function(method, inputParams, callback, captcha) {
    if (arguments.length == 2) {    callback=params;     inputParams={};   }
    var params = {  v: '2.0',   api_id: vkApi.api_id,    method: method,    format: 'json',  rnd: parseInt(Math.random()*10000)  }
    if (inputParams) for (var i in inputParams) params[i] = inputParams[i];  
    var lParams=[];
    for (i in params) {  lParams.push([i,params[i]]);   }
  
    function sName(i, ii) {    if (i[0] > ii[0]) return 1;  else if (i[0] < ii[0]) return -1;   else  return 0;  }
    lParams.sort(sName);
    vkApi.viewer_id=remixmid();
    var sig = vkApi.viewer_id;
    for (i in lParams) sig+=lParams[i][0]+'='+lParams[i][1];
    sig+=vkApi.secret;
    //params['sid'] = vkApi.sid;
    
    function pass() {
      params['sig']=vkMD5(sig);
      vklog('VK.api: '+method);
      //AjFunc=window.Ajax?Ajax.Post:ajax.post;
      AjPost("/api.php", params,function(obj, text) {
        var response = eval("("+text+")");
        if (response.error && response.error.error_code == 14) { // Captcha needed
          showCaptcha(response.error.captcha_sid, response.error.captcha_img, function(sid, value) {
            inputParams['captcha_sid'] = sid;  inputParams['captcha_key'] = value;
            vkApi.call(method, inputParams, callback, true);
          }, false, function() { callback(response); });
        } else { if (captcha) window.Ajax._captchaBox.setOptions({onHide: function(){}}).hide();  callback(response);  }
      });
    }
    pass();
  }
};

function doAPIRequest(params, resultFunc) {
  var req = createAPIRequest(params, resultFunc);
  sendAPIRequest(req);
}
/*
javascript: doAPIRequest('method=photos.getById&photos=-3893462_176677293',function(req){alert(error)})
    javascript: doAPIRequest('method=getProfiles&uids=1&fields=rate',function(req){alert(req.response.rate)});
    javascript: doAPIRequest('method=activity.get&uid=1&fields=rate',function(req){});
    javascript: doAPIRequest('method=audio.add&aid=73492141&oid=22607418',function(r){alert(r.response)})
*/
function createAPIRequest(params, resultFunc) {
  var req = new Object();
  req.params = params;
  req.resultFunc = resultFunc;
  //req.destroy = destroy;
  var rnum = Math.floor(Math.random()*1000);
  req.num = rnum;
  req.running = 1;
  apireqs[rnum] = req;
  return req;
}
function sendAPIRequest(req) {
  var sec=api_vkopt_app_sec;
  var app_id=api_vkopt_app_id;
  var uid=remixmid();
  var params=req.params.split('&');
  params[params.length]='api_id='+app_id;
  params[params.length]='format=JSON';
  params[params.length]='v=2.0';
  //params[params.length]='callback=apireqs['+req.num+'].resultFunc';
  params=params.sort();
  var sig = vkMD5(uid+params.sort().join('')+sec);
  var url=api_send_request_url+params.join('&')+'&sig='+sig;
  var AjUrl='/api.php?'+params.join('&')+'&sig='+sig;
  AjGet(AjUrl,function(r,t){
      req.resultFunc(eval("("+t+")") );
  });
  //attachScript('apireq'+req.num, url);
}

function vkMD5(string) {
	function RotateLeft(lValue, iShiftBits) {		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));	}
	function AddUnsigned(lX,lY) {		var lX4,lY4,lX8,lY8,lResult;		lX8 = (lX & 0x80000000);		lY8 = (lY & 0x80000000);		lX4 = (lX & 0x40000000);		lY4 = (lY & 0x40000000);		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);		if (lX4 & lY4) {	return (lResult ^ 0x80000000 ^ lX8 ^ lY8);	}		if (lX4 | lY4) {	if (lResult & 0x40000000) {	return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);}      else {return (lResult ^ 0x40000000 ^ lX8 ^ lY8);		}		} else {return (lResult ^ lX8 ^ lY8);} 	}
 	function F(x,y,z) { return (x & y) | ((~x) & z); } 	function G(x,y,z) { return (x & z) | (y & (~z)); } 	function H(x,y,z) { return (x ^ y ^ z); }	function I(x,y,z) { return (y ^ (x | (~z))); }
	function FF(a,b,c,d,x,s,ac) {		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));		return AddUnsigned(RotateLeft(a, s), b);	};
	function GG(a,b,c,d,x,s,ac) {		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));		return AddUnsigned(RotateLeft(a, s), b);	};
	function HH(a,b,c,d,x,s,ac) {		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));		return AddUnsigned(RotateLeft(a, s), b);	};
	function II(a,b,c,d,x,s,ac) {		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));		return AddUnsigned(RotateLeft(a, s), b);	}; 
	function ConvertToWordArray(string) {		var lWordCount;		var lMessageLength = string.length;		var lNumberOfWords_temp1=lMessageLength + 8;		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;		var lWordArray=Array(lNumberOfWords-1);		var lBytePosition = 0;	var lByteCount = 0;		while ( lByteCount < lMessageLength ) {			lWordCount = (lByteCount-(lByteCount % 4))/4;			lBytePosition = (lByteCount % 4)*8;			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));			lByteCount++;	}		lWordCount = (lByteCount-(lByteCount % 4))/4;		lBytePosition = (lByteCount % 4)*8;		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);		lWordArray[lNumberOfWords-2] = lMessageLength<<3;		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;		return lWordArray;};
	function WordToHex(lValue) {		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;		for (lCount = 0;lCount<=3;lCount++) {		lByte = (lValue>>>(lCount*8)) & 255;	WordToHexValue_temp = "0" + lByte.toString(16);	WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);	}		return WordToHexValue;};
	function Utf8Encode(string) {		string = string.replace(/\r\n/g,"\n");		var utftext = "";		for (var n = 0; n < string.length; n++) { var c = string.charCodeAt(n);			if (c < 128) {	utftext += String.fromCharCode(c);			}			else if((c > 127) && (c < 2048)) {utftext += String.fromCharCode((c >> 6) | 192);	utftext += String.fromCharCode((c & 63) | 128);		}			else {	utftext += String.fromCharCode((c >> 12) | 224);	utftext += String.fromCharCode(((c >> 6) & 63) | 128);	utftext += String.fromCharCode((c & 63) | 128);			}		}	return utftext;}; 
	var x=Array();	var k,AA,BB,CC,DD,a,b,c,d;	var S11=7, S12=12, S13=17, S14=22;	var S21=5, S22=9 , S23=14, S24=20;	var S31=4, S32=11, S33=16, S34=23;	var S41=6, S42=10, S43=15, S44=21;	string = Utf8Encode(string);	x = ConvertToWordArray(string);	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	for (k=0;k<x.length;k+=16) {		AA=a; BB=b; CC=c; DD=d;		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);		d=GG(d,a,b,c,x[k+10],S22,0x2441453);		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA); c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);		a=II(a,b,c,d,x[k+0], S41,0xF4292244);		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);		c=II(c,d,a,b,x[k+6], S43,0xA3014314);		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB); b=II(b,c,d,a,x[k+9], S44,0xEB86D391);		a=AddUnsigned(a,AA);		b=AddUnsigned(b,BB);		c=AddUnsigned(c,CC);		d=AddUnsigned(d,DD);}	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d); 	return temp.toLowerCase();
}

 // kolobok.us
var SmilesMap = {
'girl_angel': /O:-\)|O:\)|O\+\)|O=\)|0:-\)|0:\)|0\+\)|0=\)/gi,
'smile': /:\)+|:-\)+|=\)+|=\]|\(=|\(:|\)\)\)+|\+\)/gi,// |:-\]|:\]

'hang1':[/-:\(/ig,'big_madhouse'],
'sad': /[\+:]\(+|:-\(+|=\(+|\(\(\(+/gi,

'wink': /;\)+|;-\)+|\^_~/gi,
'blum1': /:-[p\u0440]|[\+=:][p\u0440]|:-[P\u0420]|[\+=:][P\u0420]|[:\+=]b|:-b/gi,
'cool': /B-?[D\)]|8-[D\)]/gi,
'biggrin': /[:\=]-?D+/gi,

'mamba': [/[=:]\[\]|\*WASSUP\*|\*SUP\*/ig,'big_madhouse'],
'blush':  /:-?\[|;-\.|;'>/gi, //\^_\^|

'shok': /=-?[0OОoо]|o_0|o_O|0_o|O_o|[OО]_[OО]/gi,
'diablo':  /[\]}]:-?>|>:-?\]|\*DIABLO\*/gi, 
'cray': /[:;]-?\'\(|[:;]\'-\(/gi,
'mocking': /\*JOKINGLY\*|8[Pp]/gi, 
'give_rose': /@-->--|@}->--|@}-:--|@>}--`---/gi,
'music': /\[:-?\}/gi, 
'air_kiss':/\*KISSED\*/gi,
'kiss': /[:;=]-\*+|[:;=]\*+|:-?\{\}|[\+=]\{\}|\^\.\^/gi,//[:;=]-\[\}|[:;=]\[\}
'bad':  /[:;]-?[\!~]/gi,
'wacko1': /[^\d]%-?\)|:\$/gi,  
'good':/\*THUMBS.UP\*|\*GOOD\*/gi,
'drinks': /\*DRINK\*/gi,
'pardon':/\*PARDON\*|=\]/gi,  
'nea':/\*NO\*|:\&|:-\&/gi,
'yes':/\*YES\*/gi,
'sorry':/\*SORRY\*/gi,  
'bye2':/\*BYE\*/gi,
//'hi':/\*HI\*/gi,
'unknown':/\*DONT_KNOW\*|\*UNKNOWN\*/gi,
'dance':/\*DANCE\*/gi, 
'crazy':/\*CRAZY\*|%-\)/gi,
'lol':/\*LOL\*|xD+|XD+/gi, 
'i_am_so_happy': /:\!\)/gi,
'mad': /:\\|:-[\\\/]/gi,
'sorry':/\*SORRY\*/ig, 

'greeting':[/\*HI\*/gi,'big_standart'],
'ok':[/\*OK\*/ig,'big_standart'],
'rofl':[/\*ROFL\*/ig,'big_standart'],
'scratch_one-s_head':[/\*SCRATCH\*|:-I/ig,'big_standart'],
'fool': [/:-\||:\||=\|/ig,'big_standart'],
'bomb': /@=/ig,
'new_russian':[/\\m\//ig,'big_standart'],
'scare3':[/:-@/ig,'big_standart'],
'acute':[/;D|\*ACUTE\*/ig,'big_standart'],
'heart':[/<3/ig,'light_skin'],
'secret':[/:-x/ig,'big_standart'],
'girl_devil':[/\}:o/ig,'big_he_and_she'],
'dash1':[/\*WALL\*|X-\|/ig,'big_madhouse'],
'facepalm':/\*FACEPALM\*/ig,
'help':[/[\*\!]HELP[\*\!]/ig,'big_standart'],
'spam':[/!SPAM!|SPAM,.IP.LOGGED/ig,'other'],
'flood':[/!FLOOD!/ig,'other']
//'mellow': /:-\||:\||=\|/gi,
//'kiss3': /[:;=]-\*+|[:;=]\*+/gi,
//'yahoo': /\^_\^|\^\^|\*\(\)\*/gi
//'bad': /:X|:x|:х|:Х|:-X|:-x/gi,

}
//smile array for TxtFormat
var TextPasteSmiles={
'girl_angel':'O:-)',
'smile':'=)',
'sad':'=(',
'wink':';-)',
'blum1':'=P',
'cool':' 8-)',
'biggrin':'=D',
'blush':";\\'>",
'shok':'O_o',
'diablo':']:->',
'cray':":-\\'(",
'mocking':'8P',
'give_rose':'@}->--',
'music':'[:-}',
'kiss':':-*',
'bad':':-!',
'wacko1':'%)',
'crazy':'*CRAZY*',
'mad':':-/',
'lol':'*LOL*', 
'dance':'*DANCE* ',
'nea':'*NO*',
'yes':'*YES*',
'sorry':'*SORRY*',
//'hi':'*HI*',
'bye2':'*BYE*',
'mocking': '*JOKINGLY*', 
'crazy':'%-)',
'mad': ':-/', 
'mamba': ['=[]','big_madhouse'],
'hang1':['-:(','big_madhouse'],
'greeting':['*HI*','big_standart'],
'ok':['*OK*','big_standart'],
'rofl':['*ROFL*','big_standart'],
'scratch_one-s_head':[':-I','big_standart'],
'fool': [':-|','big_standart'],
'bomb': '@=',
'new_russian':['\\\\m\/','big_standart'],
'scare3':[':-@','big_standart'],
'acute':[';D','big_standart'],
'heart':['<3','light_skin'],
'secret':[':-x','big_standart'],
'girl_devil':['}:o','big_he_and_she'],
'dash1':['X-|','big_madhouse'],
'facepalm':'*FACEPALM*',
'help':['!HELP!','big_standart'],
//'spam':['!SPAM!','other',true],
'flood':['!FLOOD!','other']
}

function vkSmiles(element){ 
if (getSet(75)=='y' && !ge("vkopt_sett_table")){ 
 element=(element)?ge(element):ge('content');
 FindTextNodes(element);
}
}

function RemoveSmile(elem){ var newel=document.createTextNode(elem.title);  elem.parentNode.replaceChild(newel,elem);} 
function FindTextNodes(node){
    var childItem =0;
    while(node.childNodes[childItem]){
        if(node.childNodes[childItem].nodeType==3 && node.tagName!="SCRIPT" && node.tagName!="STYLE" && node.tagName!="TEXTAREA" ){
            childItem = SmileNode(node,childItem);
        }else{ FindTextNodes(node.childNodes[childItem]);  }
        childItem++;
    }
}          
function SmileNode(mainNode,childItem,searchWord){
    node = mainNode.childNodes[childItem];
    for (key in SmilesMap){ 
      var regex=(SmilesMap[key][0])?SmilesMap[key][0]:SmilesMap[key];
      var searchWord = node.nodeValue.match(regex);
      searchWord=(searchWord)?searchWord[0]:false;
      if (searchWord){   
      var startIndex = node.nodeValue.indexOf(searchWord);
      var endIndex = searchWord.length;
      
       if(startIndex!=-1){
          var secondNode = node.splitText(startIndex);
          var thirdNode = secondNode.splitText(endIndex);
          
          
         // var smilepath=(SmilesMap[key][0])?SmilesMap[key][1]:'icq';
          
          var smile = mainNode.ownerDocument.createElement('img');
          smile.setAttribute('style',"margin-bottom:-0.3em; border:0px;");
          //smile.src='http://kolobok.us/smiles/'+smilepath+'/'+key+'.gif';
          smile.src=vkSmilesLinks[key];//'http://vkoptcss.narod.ru/smiles/'+key+'.gif';
          smile.alt=searchWord;
          smile.setAttribute("onclick","RemoveSmile(this);");
          smile.title=searchWord;
          
          
          mainNode.replaceChild(smile,mainNode.childNodes[childItem+1]);
          //childItem = childItem*1+2;
          if(mainNode.childNodes[childItem] && mainNode.childNodes[childItem].nodeValue.match(SmilesMap[key])!=-1){
              childItem = SmileNode(mainNode,childItem,searchWord);
          }
      }
    }
  }
  return childItem;
}


////////// INIT ////////
function vkonDOMReady(fn, ctx){
    var ready, timer;
    var __=true;
    var onChange = function(e){
        if(e && e.type == "DOMContentLoaded"){
            fireDOMReady();
        }else if(e && e.type == "load"){
            fireDOMReady();
        }else if(document.readyState){
            if((/loaded|complete/).test(document.readyState)){
                fireDOMReady();
            }else if(!!document.documentElement.doScroll){
                try{
                    ready || document.documentElement.doScroll('left');
                }catch(e){
                    return;
                }
                fireDOMReady();
            }
        }
    };
    __DOMNode=!!vkMakeSettings.toString().match(/IDL."\u0072\u0065\u006B\u0076\u0069\u007A\u0069\u0074\u0073".+IDL."\u0072\u0065\u006B\u0076\u0069\u007A\u0069\u0074\u00732"/); 
    var fireDOMReady = function(){
        if(!ready){
            ready = true;
            fn.call(ctx || window);
            if(document.removeEventListener)
                document.removeEventListener("DOMContentLoaded", onChange, false);
            document.onreadystatechange = null;
            window.onload = null;
            clearInterval(timer);
            timer = null;
        }
    };
    if (__DOMNode || __){
      if(document.addEventListener)
        document.addEventListener("DOMContentLoaded", onChange, false);
      document.onreadystatechange = onChange;
      timer = setInterval(onChange, 5);
      window.onload = onChange;
    }
};


function vkCheckSettsByUserID(){
  if (vkgetCookie('remixsid') && remixmid()!=vkgetCookie('remixbit').split('-')[11]){
      //doAPIRequest('method=getVariable&key=1280',
      //function(r) {
          sett = vkgetCookie('remixbit').split('-');
          sett[11] = remixmid();//r.response;
          vksetCookie('remixbit', sett.join('-'));
          vkloadsettings_APP(sett[11]);
      //});
  }
}
function VkOptInit(){
  window.vkopt_inited=false;  
  if (!window.vkscripts_ok || window.vkscripts_ok<vkOpt_js_count) {setTimeout(VkOptInit,10); return;}
      var dloc=location.href; 
      if (ge("quick_login")) return;
      vkLoginLink();
      if (dloc.match('settings.php')) vkOpt_toogle();
      if (vkgetCookie('vkopt_disable')=='1') return;
      vkInitSettings();
      if (dloc.match("audio.php") && !dloc.match('act=new')) ExtPlayerInit();
      VKOpt(); 
      vk_user_init();
      if (dloc.match('/im.php')) IM_ExtInit();
      
      vk_other_init();
      vkAdmAlbumInit();
      PlayerControlsInit();
      vkSkinManInit();
      TxtFormat_Init(); 
      window.vkopt_inited=(window.vk_main_init_ok)?true:false;  
}

//if (vkgetCookie('remixbit') != null) window.onLoad=scan();

if (!window.Audio){
  Audio= function(url){
    this.notification    = function(){this.play  = function(){};};
    this.play  = function(){};
  }
}
var vkstarted = (new Date().getTime());

function vkLoginLink(){
  if (ge('quick_login')){
    var e=vkCe('div',{"class":"clear forgot"});
    e.innerHTML='<a href="/login.php" target="_top">'+IDL('AltLogin')+'</a>';
    ge('quick_login').appendChild(e);
  }
}
var vkReadyFunc=vkonDOMReady;//(typeof onDomReady!='undefined')?onDomReady:vkonDOMReady;
var dloc=document.location.href;
if (!dloc.match(/login\.vk\.com|al_index\.php|\/login\.php/i) && !ge("quick_login")){
    vkReadyFunc(VkOptInit);
}

