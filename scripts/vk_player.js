// ==UserScript==
// @name          VK_ExtAudioPlayer v0.5    (Vkopt module)
// @description   (by KiberInfinity id13391307)
// @include_       */audio.php*
// @exclude_       */audio.php?act=new*
// @include       *vkontakte.ru*
// @include       *vk.com*
// ==/UserScript==


var vkp_img= {
     	play: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAMAAABVyG9ZAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAMUExURV99nf///+7u7pqxxnWAXsYAAACjSURBVHjaYmBkZsAKmBkBAogBhwxQDiCAGHADgADCgwACCA8CCCA8CCCAkBAjIyofIIBQpFDlAAIIVQpFDiCA0KSQ5QACCF0KSQ4ggDCkEHIAAYQpBZcDCCA8UgABhMdAgADC4wyAAMLjeIAAwuNlgADCE1AAAYQneAECCA8CCCA8CCCA8CCAAMKDAAIIT2IDCCAG3EkUIICATmbCChgZAQIMAJYcAJNnWU0+AAAAAElFTkSuQmCC",
			pause: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAMAAABVyG9ZAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAMUExURV99nf///+7u7pqxxnWAXsYAAACXSURBVHjaYmBkZsAKmBkBAogBhwxQDiCAGHADgADCgwACCA8CCCA8CCCAYIgRCJBpIAAIIDxSAAGERwoggPBIAQQQHimAAMIjBRBAeKQAAgiPFEAA4ZECCCA8UgABhEcKIIDwSAEEEB4pgADCIwUQQHgQQADhQQABhAcBBBAeBBBAeBIbQAAx4E6iAAEEdC0TVsDICBBgANQZAL0OgymfAAAAAElFTkSuQmCC"
		}

var CurArtist='';
var CurSongN='';
var CurDur='';
var AllowSetToStatus=false;
var vk_isPlaying=false;
var vk_AllowPCtrl=false;
var last_pl_cook="";

var vk_cmt="";

//sync with player_ctrls
function SyncPctrls(){
var pst=vkgetCookie('vkplayer');
  if (pst){
    pst=pst.split('-');
    var pfb=pst[0].split(''); }
  
var pst2=last_pl_cook;
  if (pst2){
    pst2=pst2.split('-');
    var pfb2=pst2[0].split(''); }

if (pfb[0]!=pfb2[0]){Player_BtnClick(); last_pl_cook=vkgetCookie('vkplayer');}
  if (pfb[1]=='1') {Player_ToTrack(1);  PlayerForwBakwCook(0);}        //forward
  if (pfb[1]=='2') {Player_ToTrack(0);  PlayerForwBakwCook(0);}        //backward
}

function PlayerForwBakwCook(fbs){
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

function Player_BtnClick(){
  if (AudioObject.curAudio!=0)
  setTimeout(function(){ ge("imgbutton" + AudioObject.curAudio).onclick(); }, 0);
  else PlayFirstSong();
}
function Player_ToTrack(fb){
	var id=AudioObject.curAudio;
	if (!id) id=GetAllAids()[0]; 
	var nextId = getSiblingsIds(ge("audio" + id))[fb];
    AudioObject.hidePlayer(id);
    AudioObject.playback();
    AudioObject.playbackSent = 0;
    if (nextId) setTimeout(function(){ ge("imgbutton" + nextId).onclick(); }, 0);
    if (!nextId && window.audioData){
      var playFirst = function(){
        var next = GetAllAids()[0];
        if(next) setTimeout(function(){ ge("imgbutton" + next).onclick(); }, 0);
      }
      if(!audioData.last){
        var nextOffset = audioData.offset + 100;
        getPage(nextOffset, function(){
          if(nextOffset != audioData.offset) return;
          playFirst();
        });
      } else {
        if(audioData.offset){
          getPage(0, function() {
            playFirst();
          });
        } else {
          playFirst();
        }
      }
    }
}
function SwichAudioList(){
toggle('audio_list');
toggle('vkPlayList');
}

function Player_ToStatus(){
var img=get('vk_StatusBtn');
var sptip=get('st_tip');
if (img.src==pstatusoff_img){
    img.src=pstatuson_img;
    sptip.innerHTML=IDL('Play2Status_off');
    if (AudioObject.curAudio>0) SetAudioActivity(trackres);
    AllowSetToStatus=true;
    } else {
    img.src=pstatusoff_img;
    sptip.innerHTML=IDL('Play2Status_on');
    AllowSetToStatus=false;
    }
}
function ToStatus_Btn(){                                                                                  //  vkp_ctrimg
var bitem='<img id="vk_StatusBtn" src="'+pstatusoff_img+'" onClick="Player_ToStatus();" class="playimg">';
bitem='<span class="ptool">'+bitem+'<span class="ptip" id="st_tip" onClick="Player_ToStatus();">'+IDL('Play2Status_on')+'</span></span>';
return bitem;
}

function Snuffle_Btn(){ 
  var bitem='<img id="vk_StatusBtn" src="'+snuffle_img+'" onClick="GetPlayListItems(null,true);" class="playimg">';
  bitem='<span class="ptool">'+bitem+'<span class="ptip" id="st_tip" onClick="GetPlayListItems(null,true);">'+IDL('SnufflePls')+'</span></span>';
  return bitem;   
}

function Player_OnOffCtrl(){
var img=get('vk_EnCtrlBtn');
var sptip=get('spc_tip');
if (img.src==enablectrloff_img){
    img.src=enablectrlon_img;
   sptip.innerHTML=IDL('Off_red')+IDL('PlayerEPC');
    vk_AllowPCtrl=true;
    PlayerForwBakwCook(0); //reset back/frow in cookie
    IntervSyncEnable(true);
    SetPSC_status();
    } else {
    img.src=enablectrloff_img;
   sptip.innerHTML=IDL('On_green')+IDL('PlayerEPC');
   vk_AllowPCtrl=false;
   IntervSyncEnable(false);
    }
}
function EnableCtrl_Btn(){
var bitem='<img id="vk_EnCtrlBtn" src="'+enablectrloff_img+'" onClick="Player_OnOffCtrl();" class="playimg">';
bitem='<span class="ptool">'+bitem+'<span class="ptip" id="spc_tip" onClick="Player_OnOffCtrl();">'+IDL('On_green')+IDL('PlayerEPC')+'</span></span>';
return bitem;
}
//

function SetPlayerIds(aid){
  if (AudioObject.curAudio!=aid){
      ge("vkplntdd").innerHTML=
      '<div id="line' + aid + '" class="playline" style="display: none;"></div>'+
      '<div id="toddler' + aid + '" class="toddler" style="display: none;"></div>'+
      '<div id="player' + aid + '" style="display: none;" class="playerClass"></div>';
  }
}



function AddPlayerCtrl(){
if (!ge('audiosWrap')) return;
var Aumas=GetAllAids();
  AddScroollCss();
  //vkaddcss(pls_style);
  
var vkp_LeftP_items=''//ToStatus_Btn();
if (ge('vkAnav')){ge('vkAnav').innerHTML=(geByClass('commentsPages')[0])?geByClass('commentsPages')[0].innerHTML:'';}
//<span class='divider'>|</span><a class='notbold' href='audio.php?act=new'>xxxxx</a>

if(!ge('vk_pl_div')){
  ge('audiosWrap').innerHTML=
         // '<div id="vk_PControls" class="bar clearFix summaryBar" style="position:relative"></div>'+
          '<div id="vk_pl_div" align=center style="padding: 5px 30px"></div>'+
          '<center><div onclick="SwichAudioList();"><a class="playimg">[ Show/Hide audios ]</a></div></center>'+
          '<div id="audio_list" style="display:none">'+ge('audiosWrap').innerHTML+'</div>';
  var node=ge('vk_pl_div');
  GetAudioName(Aumas[0])
  node.innerHTML+='<div id="vk_curtrack">'+VK_PlayerTitle()+'</div><br>';
  node.innerHTML+='<div><table><tr>'+

  '<td valign="center" id="vkp_LeftPanel">'+vkp_LeftP_items+'</td>'+
  '<td valign="center"><img src="'+back_img+'" onClick="Player_ToTrack(0);" id="vkplb_btn" class="playimg"></td>'+
  '<td valign="center"><img src="'+vkp_img['play']+'" onClick="Player_BtnClick();" id="vkpl_btn" status="play" class="playimg"></td>'+
  '<td valign="center"><img src="'+forw_img+'" onClick="Player_ToTrack(1);" id="vkplf_btn" class="playimg"></td>'+
  '<td valign="center" id="vkp_RightPanel"></td>'+
  '</tr></table></div>'+
      '<div id="vkplntdd" style="height:14px;margin-left:28px;" align=left>'+
        '<div id="line0" class="playline" style="display: none;"></div>'+
        '<div id="toddler0" class="toddler" style="display: none;"></div>'+
        '<div id="player0" style="display: none;" class="playerClass"></div>'+
      '</div><div id="vkpback" style="display:none"></div>';
 
  node.innerHTML+=GetPlayList(Aumas);
  setTimeout("Vk_InitScrool();",500);

  last_pl_cook=vkgetCookie('vkplayer');
  //vk_cmt=setInterval("SyncPctrls();",500);
  
}
}

function IntervSyncEnable(bool){
if (bool) vk_cmt=setInterval("SyncPctrls();",500)
else clearInterval(vk_cmt);
}

function set_PlsOffStyle(obj){
const poff='pls_off';
const pcur='pls_on';
var style=poff;
if ((AudioObject.curAudio!=0) && (obj.id=="pls"+AudioObject.curAudio)) {style=pcur;
obj.parentNode.className="pls_td_on";
} else obj.parentNode.className="";

}



function GetPlayListItems(arr, snuff) {
    /*if (!ge("audio" + AudioObject.curAudio) && cur_audio_el != "") {
        ge('audios').innerHTML = cur_audio_el + ge('audios').innerHTML;
    }*/
    //javascript: GetPlayListItems(GetAllAids().shuffle())
    if (snuff) {
        var nodes = ge('audios').childNodes;
        var el = ge('audios');
        var i = nodes.length, j, t;
        while (i) {
            j = Math.floor((i--) * Math.random());
            el.insertBefore(nodes[i], nodes[j]);
        }
    }
    if (!arr) arr = GetAllAids();

    var s = "";
    for (var i = 0; i < arr.length; i++) {
        s += '<tr><td id="atd' + arr[i] + '">';
        var onclk = "ge('imgbutton" + arr[i] + "').onclick();";
        s += '<div onclick="' + onclk + ' return false;" id="pls' + arr[i] + '" class="pls_off">' + GetAudioName(arr[i], true) + '</div>';
        s += '</td></tr><tr><td>';
    }
    ge('movemenu_v').innerHTML = s;
    if (AudioObject.curAudio != 0 && ge(ge('pls' + AudioObject.curAudio))) set_PlsOffStyle(ge('pls' + AudioObject.curAudio));
}

function GetPlayList(arr){
//javascript: AddScroollCss();init();
if (!arr) arr=GetAllAids();
var s='<div class="body_v" id="vkPlayList"><div class="delivery_middle" id="withscript_v"><div class="col1">';
s+= '<table class="js_menu2" style="margin-top: 0px;" id="movemenu_v" cellpadding="0" cellspacing="0">';

  for (var i=0;i<arr.length;i++){                                     
  s+='<tr><td id="atd'+arr[i]+'">';
  var onclk="ge('imgbutton"+arr[i]+"').onclick();";           
  s+='<div onclick="'+onclk+' return false;" id="pls'+arr[i]+'" class="pls_off">'+GetAudioName(arr[i],true)+'</div>';
  s+='</td></tr><tr><td>';
  }
  
  
  s+='</td></tr></table></div>';
  //s+='</div></div>';
  s+='<div class="col2">'+
    '<div class="menu_scrolling">'+
        '<div class="scrolling_line" id="scroller_bar_v" align="left">'+
            '<img id="scroller_v" style="top: 0px; padding-bottom: 0px;" alt="" src="'+scrool2_img+'" />'+
        '</div></div></div>'+
'</div></div>';
return s;
}
function GetLinkToMp3(aid,with_name){
  var lnk="";
  img=ge("imgbutton"+aid);
  if (img)
  if (img.getAttribute('onclick').split('operate')[1]) {
	if (img.getAttribute('onclick').split('operate(')[1])
		params = img.getAttribute('onclick').split('operate(')[1].split(')')[0];
	if (img.getAttribute('onclick').split('operateWall(')[1])
		params = img.getAttribute('onclick').split('operateWall(')[1].split(')')[0];

		params = params.split(',');
		server = params[1];
		user = params[2]; while(user.length<5) user='0'+user;

		if (params.length==3) name=params[1];
		else name = params[3];
		name=name.substring(1, name.length - 1);
		if (params.length>3) lnk='http://cs' + server + '.vkontakte.ru/u' + user + '/audio/' + name + '.mp3';	else lnk=name;
		if (with_name) {lnk=lnk+'?/'+(ge('performer'+aid).innerText+'-'+ge('title'+aid).innerText)+'.mp3'}; //  //GetAudioName(aid,'fdw')
		return lnk;
		} else return false;
}

function GetMinSecStr(sec){
var minutes=(sec/60);
minutes=minutes - minutes % 1;
var seconds=(sec % 60);
seconds='0'+seconds;
seconds=seconds.substring(seconds.length-2,seconds.length);
return minutes+':'+seconds;
}

//GetAudioName(AudioObject.curAudio);
function GetAudioName(id,frmt){
const dhdr='duration">';

var CurSongName='';
var curaperf=ge('performer'+id);
var anode=curaperf.parentNode.parentNode;
curaperf=curaperf.getElementsByTagName('a')[0];
CurSongName=curaperf.innerHTML+' - ';
CurArtist=curaperf.innerHTML;


var curatitle=ge('title'+id);
var cattla=curatitle.getElementsByTagName('a');
var s='';
if (cattla.length<1)
  s+=curatitle.innerHTML
else
  s+=cattla[0].innerHTML;
CurSongName+=s;
CurSongN=s;

if (AudioObject.fileInfo[id]){
var dura=GetMinSecStr(AudioObject.fileInfo[id]["duration"]);
CurSongName+=' ('+dura+')';
CurDur=dura;} else{
dura=anode.innerHTML;
//alert(CurDur);
dura=dura.substring(dura.indexOf(dhdr)+dhdr.length,dura.length);
dura=dura.substring(0,dura.indexOf("</"));
//CurDur='---';
CurSongName+=' ('+dura+')';
CurDur=dura;
}
if (frmt){
 var style='float:right;';
      var uid, aid=id;
      //if (ge('mid')) uid=((dloc.match(/(club|event)\d+/))?"-":"")+ge('mid').value;
      if (typeof audioData!='undefined'){uid=(audioData.id)?audioData.id:-audioData.gid; }
    
// var searchtxt="http://www.lyricsplugin.com/wmplayer03/plugin/?artist="+encodeURIComponent(CurArtist)+"&title="+encodeURIComponent(CurSongN);   //<a target=_blank href="'+searchtxt+'"></a>
 var exdur='('+CurDur+') <a target=_blank onmouseover="vkPFMenu(event,vkGenAudioItems(\''+aid+'\','+uid+',\''+GetLinkToMp3(id,true)+'\'));" href="'+GetLinkToMp3(id,true)+'">&#9661;</a>';
 var CurSongName='<b>'+CurArtist+'</b> - '+CurSongN+'</div><div class="durat">'+exdur+'</div>';}             //'+IDL('download')+'                             '+IDL('SearchText')+'
 
if (frmt=='fdw'){
var CurSongName=CurArtist+'-'+CurSongN;
}
return CurSongName;
}

function VK_PlayerTitle(){
 var style='color: #777; padding: 4px 7px 0px 0px; font-size:10px;';
 var s='<b>'+CurArtist+'</b> - '+CurSongN+'  <span style="'+style+'">('+CurDur+')</span>'
 return s;
}

function GetAllAids(){
var aids=[];
var nodes=geByClass('audioRow');
for (var i=0;i<nodes.length;i++) aids.push(nodes[i].id.split('audio')[1]);
return aids;
}

function PlayFirstSong(){
var fst='imgbutton'+GetAllAids()[0];
//alert(fst);
ge(fst).onclick();
}


function SetPSC_status(){

if (vk_AllowPCtrl){
  if(AudioObject.curAudio>0){
    var cururl=AudioObject.fileInfo[AudioObject.curAudio]["url"];
    var curuser=ge('audioBar').innerHTML.match(/"id":(\d+)/); //[1]
    if (!curuser) curuser=ge('audioBar').innerHTML.match(/"id":"(\d+)"/);
    curuser = (curuser) ? curuser[1] : '0';
    var curaid=AudioObject.curAudio;

    var cst = (vk_isPlaying) ? "1" : "0";
    var stcook=cst+'0-'+curuser+'_'+curaid;
    vksetCookie('vkplayer',stcook);
    last_pl_cook=stcook;
  }
}
}
var trackres='';
function SetAudioActivity(trname){
linkt='http://userapi.com/data?act=set_activity&text='+'%26%239835%3B%20'+encodeURIComponent(trname)+'&sid='+vkgetCookie('remixsid')+'&xx='+Math.floor(Math.random()*(100000));
img = new Image();
img.src = linkt;
}

function vkPlayerOnPlay(){
			    if (AudioObject.curAudio!=0){
				 trackres=GetAudioName(AudioObject.curAudio);
			     }
			     else trackres='not played';
			     document.title=trackres;
			     ge('vkpl_btn').src=vkp_img['pause'];
			     ge('vkpl_btn').setAttribute("status","pause");
			     ge('vk_curtrack').innerHTML=VK_PlayerTitle();
			     if (AllowSetToStatus) SetAudioActivity(trackres);
			     vk_isPlaying=true;
			     SetPSC_status();

}
function ExtPlayerInit(){
var dloc=document.location.href;
if  (!dloc.match('to_id') && !dloc.match("act=edit"))
if (getSet(53) == 'y'){
if (ge('bigSummary')){
  vkaddcss(pls_style);
  ge('bigSummary').innerHTML+='<div class="summary"><div>'+
                                 "<span class='divider'>|</span>"+
                                 (ge('pagesTop').innerHTML.length>3?'<a href="javascript: show(\'progressTop\'); vkLoadAllAudios(function(){hide(\'progressTop\')});">'+IDL('all')+'</a>':'')+
                                 //"<span class='divider'>|</span>"+
                                 '</div></div>'+ToStatus_Btn()+((getSet(63) == 'y')?EnableCtrl_Btn():'')+Snuffle_Btn()+
                                 
                                 ((geByClass('commentsPages')[0])?'<ul id="vkAnav" class="VKAudioPages">'+geByClass('commentsPages')[0].innerHTML+'</ul>':'');
                      }
RepCodeInFunc("updatePage","","AudioObject.stop();");    //for next page 
Inject2Func_2("updatePage","vkPLAppendCurrent();","ge('audios').innerHTML = res.html;");	    
Inject2Func_2("AudioObject.operate","ge('vkpl_btn').src=vkp_img['play']; ge('vkpl_btn').setAttribute('status','play');  vk_isPlaying=false; SetPSC_status();",'this.changeState(id, "pause");');	
Inject2Func_2("AudioObject.operate","vkPlayerOnPlay();",'this.changeState(id, "play");');	
Inject2Func("AudioObject.showPlayer","vkPlayerOnShow(id); vkPlayerOnPlay();",true);	
Inject2Func("AudioObject.hidePlayer","vkPlayerOnHide();", true);
Inject2Func("operate","SetPlayerIds(id);");
AddPlayerCtrl();
}
}
function vkPLAppendCurrent(){	
	if (window.VK_CUR_AUDIO_EL){
		var node=ge('audios');
		node.insertBefore(VK_CUR_AUDIO_EL,node.firstChild);
	}
}
function vkPlayerOnHide(){
	ge('vkpl_btn').src=vkp_img['play']; 
	ge('vkpl_btn').setAttribute("status","play");
	vk_isPlaying=false; 
	SetPSC_status();
}
function vkPlayerOnShow(id){
	VK_CUR_AUDIO_EL=ge('audio'+id).cloneNode(true);
	//SetPlayerIds(id);
	var arr=GetAllAids();
	for (var i=0;i<arr.length;i++){  set_PlsOffStyle(ge('pls'+arr[i]));}
}

///////////////////////////////////////////
///////// INIT SCROOL FOR PLAYLIST ////////
/// src from: http://www.noinimod.ru/52 ///
///////////////////////////////////////////


VerticalScroll = function (scroller, scroller_bar, menu)
{
    this.canDrag = false;
    this.prepared = false;

    this.shift_y;
    this.delta;

    this.scroller = scroller;
    this.scrollerBar = scroller_bar;
    this.menu = menu;

    this.scrollerStartShift;
    this.menuStartShift;

    this.scrollerTrackWidth = 445;
    this.menuTrackWidth;

    this.scrollerWidth;
    this.menuWidth = 240;

    this.step;

    this.dontmove = false;

    this.a = false;

    this.prepare = function()
    {
        if(get(this.scroller) && get(this.menu))
        {
            this.scroller = get(this.scroller);
            this.scrollerBar = get(this.scroller_bar);
            this.menu = get(this.menu);
            this.scrollerStartShift = parseInt(this.scroller.style.top);
            this.menuStartShift = parseInt(this.menu.style.marginTop);
            this.menuTrackWidth = this.menu.offsetHeight + this.menuStartShift;
            this.scrollerWidth = Math.round( (this.menuWidth * this.scrollerTrackWidth) / this.menuTrackWidth );
            this.scrollerWidth = (this.scrollerWidth < 16) ?  16 : this.scrollerWidth;
            this.scrollerWidth = (this.scrollerWidth > this.scrollerTrackWidth) ?  this.scrollerTrackWidth : this.scrollerWidth;
            this.scroller.style.paddingBottom = this.scrollerWidth - 8 + "px";
            this.scrollerTrackWidth -= this.scrollerWidth;
            this.menuTrackWidth -= this.menuWidth;
            this.delta = this.menuTrackWidth / this.scrollerTrackWidth;
            this.prepared = true;
        }
        return false;
    }

    this.fixForBrowsers = function(event)
    {
        if (!event){
        event = window.event;  // For IE.
        }
        if(event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        if(event.preventDefault) event.preventDefault();
        event.returnValue = false;
    }

    this.setStep = function(){   //this.step = Math.round(this.scrollerWidth / 3 * 2);
        this.step = Math.round(this.menu.getElementsByTagName("td")['0'].offsetHeight * this.scrollerTrackWidth / this.menuTrackWidth);
    }

    this.setPosition = function(newPosition)
    {
        if(newPosition <= this.scrollerTrackWidth + this.scrollerStartShift && newPosition >= this.scrollerStartShift)
        {   this.scroller.style.top = newPosition + "px";
        } else
        {   if(newPosition >= this.scrollerTrackWidth + this.scrollerStartShift)
            {
                this.scroller.style.top = this.scrollerTrackWidth + this.scrollerStartShift + "px";
            }
            if(newPosition <= this.scrollerStartShift)
            {
                this.scroller.style.top = this.scrollerStartShift + "px";
            }
        }
        this.menu.style.marginTop = Math.round( (parseInt(this.scroller.style.top) - this.scrollerStartShift) * this.delta * (-1) ) + this.menuStartShift + "px";
        return false;
    }

    this.drag = function(event)
    {
        if (!event){   // For IE.
            event = window.event;}
        if (this.prepared)
        {
            this.canDrag = true;
            this.shift_y = event.clientY - parseInt(this.scroller.style.top);
            this.fixForBrowsers(event);
        }
        return false;
    }

    this.movescroller = function(event)
    {
        if (!event){   // For IE.
            event = window.event;}
        if (this.prepared && !this.dontmove)
        {
            this.setStep();
            var clickY = event.layerY ? event.layerY : event.offsetY;
            var currentPosition = parseInt(this.scroller.style.top);
            var i = (clickY > currentPosition) ? 1 : -1;
            var newPosition = 2*i*this.step + parseInt(this.scroller.style.top);
            this.setPosition(newPosition);
            this.fixForBrowsers(event);
        }
        else  {this.dontmove = false;}
        return false;
    }

    this.move = function(event)
    {
        if (!event){   // For IE.
            event = window.event;}
        if (this.prepared && this.canDrag)
        {
            this.setPosition(event.clientY-this.shift_y);
            this.fixForBrowsers(event);
        }
        return false;
    }

    this.drop = function(){ this.canDrag=false; }

    this.scrollerClickHandler = function() { this.dontmove=true; }

    this.handle = function(delta, event){
        if (!event){  // For IE.
            event = window.event;}
        var i = (delta < 0) ? 1 : -1;
        this.setStep()
        var currentPosition = parseInt(this.scroller.style.top);
        var newPosition = i*this.step + currentPosition;
        this.setPosition(newPosition);
        this.fixForBrowsers(event);
    }

    this.cancelWheelAction = function(event){
        if (!event){  // For IE.
            event = window.event;}
        if (event.preventDefault){event.preventDefault();}
        event.returnValue = false;
    }

    this.wheel = function(event)
    {
        var delta = 0;
        if (!event){   // For IE.
            event = window.event;}
        if (event.wheelDelta)
        {   delta = event.wheelDelta/120;
        
            if (window.opera){delta = event.wheelDelta/40;}
        } else if (event.detail) { delta = -event.detail; }
        if (delta)
        {
            this.handle(delta, event);
            this.fixForBrowsers(event);
            return false;
        }
    }
}

function get(id)
{
    return document.getElementById(id);
}

var vertical;   //scroll obj

function HandleOnMouseUpVertical(event){ vertical.drop(event);}
function HandleOnMouseMoveScrool(event){  vertical.move(event);}
// vertical
function handleOnClickBarVertical(event){ vertical.movescroller(event);}
function handleOnMouseDownVertical(event){ vertical.drag(event);}
function handleOnClickVertical(event){   vertical.scrollerClickHandler(event);}
function handleOnMouseWheelVertical(event){  vertical.wheel(event);}


function ReGenPlayList() {
    if (getSet(53) == 'y') {
        GetPlayListItems();
        Vk_InitScrool();
    }
    VkoptAudio(true);
}
function InjAudio(){
  Inject2Func("getPage","callback=ReGenPlayList;");
  Inject2Func("updatePage","ReGenPlayList();",true);
}
function Vk_InitScrool()   // Call to init
{
    ge('scroller_v').style.top="0px";
    ge('movemenu_v').style.marginTop="0px";
    vertical = new VerticalScroll('scroller_v', 'scroller_bar_v', 'movemenu_v');

    vertical.prepare();
    document.onmousemove = HandleOnMouseMoveScrool;
    window.onmouseup = HandleOnMouseUpVertical;
    get('scroller_bar_v').onclick = handleOnClickBarVertical;

    get('scroller_v').onmousedown = handleOnMouseDownVertical;
    get('scroller_v').onmouseup = HandleOnMouseUpVertical;
    get('scroller_v').onclick = handleOnClickVertical;

    if (get('withscript_v').addEventListener)
        get('withscript_v').addEventListener('DOMMouseScroll', handleOnMouseWheelVertical, false);
    get('withscript_v').onmousewheel = handleOnMouseWheelVertical;
}

function AddScroollCss(){
var s='<style>'+
'.body{padding: 0;margin: 0;font: 62.5%/1.4 tahoma,sans-serif;color: #be946a;position: relative;}'+
'.delivery_middle{background: #fff;width: 100%;overflow: hidden;width: 600px;border: 1px solid #000;}'+

'.body_v {padding: 0;margin: 0;font: 62.5%/1.4 tahoma,sans-serif;color: #be946a;position: relative;}'+
'.body_v .delivery_middle{background: #fff;overflow: hidden;height: 440px; width: 370px;border: 1px solid #D6DBF6;overflow: hidden;}'+
'.body_v .delivery_middle .col1 {width: 350px;float: left;}'+
'.body_v .delivery_middle .col2 {width: 10px; height: 440px;float: right;}'+
'.body_v .menu_scrolling{padding: 0px 0px 0px 0px;}'+ //20px 8px 20px 12px;
'.body_v .scrolling_line{border-left: 1px solid #D6DBF6; width: 9px; background-color: #E5EBF0; repeat-y;height: 440px}'+ //background: url(http://www.noinimod.ru/data/weblog/post/52/images/t/scrolling_line_v.gif)
'.body_v .scrolling_line img{border: 1px solid #2A5883; position: absolute; no-repeat 0% 100%;background: url('+scrool_img+')}'+ //
'.body_v table.js_menu2{border:0; border-collapse: collapse;font-size: 7pt;margin-left: 3px;}'+
'.body_v table.js_menu2 td{padding: 0px 0 0px 0;text-align: left;color: #000;}'+
'.body_v table.js_menu2 .rasporka2{width: 190px;font-size: 0;line-height: 0;}'+

'</style>';
vkaddcss(s);
}
//////////////////////////////////////////
////////    END OF INIT SCROOL   /////////
//////////////////////////////////////////

/*
(function(){
document.addEventListener('DOMContentLoaded',ExtPlayerInit, false);
})();
*/

var back_img='data:image/gif;base64,R0lGODlhFAAUAOYAAAAAAP////7+//39/uru80dwmEx0nEx0m011nE52nU51nFB3nlB3nVF4nlN6oFJ5n1J4nlR6oFV7oVZ8oVV7oFd9old8oVuApGKFqGSHqWuMrW6Or26Pr3OSsXmXtXmWtHqXtHyZtn+buIqkv4ymwI6nwJeuxZ2zyaC1y6G2y6W5za/A0rvK2c3Y49Hb5enu8+jt8vDz9vf5+0ZwmEdxmUlymUt0m0x1nE52nFB4nlF5nlN6n1R7oFV8oVyBpGGFp2yOrnSUsnWUsnmYtXqYtX6bt4mkvo2nv4+pwY6owJOrwpSsw5mwxpivxae7zuLp7+bs8eXr8PP2+PL19/n7/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFUALAAAAAAUABQAAAfdgC9IQhyFhoeGG0EjT0czDxGRkpOTDzUiHxATm5ydnhM8GiENnDgPFp4LCJwRHKObO0sdD5w9B0QmFJutrxIOASirExE3STJTFxHDrqQSEQEnqw07KwEBMD7KvM3P0QgYLdbX2cu93TNDUOLj2swTzgEmQQPr7OXcAUwZUfXY7ebQCvxwsc7fvXfdEOSYwEKcwW0Ioa16wECFAHsQ4aW4sYmHjRJUpJDLGCGFB1KcDBRxUkEXxE0JTqVSwIoDEZSfcg4D0mRGg59AgwrVQcNIDCUgQihdypQpCBIEAgEAOw==';
var forw_img='data:image/gif;base64,R0lGODlhFAAUAOYAAAAAAP////7+//39/uru80dwmEx0nEx0m011nE52nU51nFB3nlB3nVF4nlN6oFJ5n1J4nlR6oFV7oVZ8oVV7oFd9old8oVuApGKFqGSHqWuMrW6Or26Pr3OSsXmXtXmWtHqXtHyZtn+buIqkv4ymwI6nwJeuxZ2zyaC1y6G2y6W5za/A0rvK2c3Y49Hb5enu8+jt8vDz9vf5+0ZwmEdxmUlymUt0m0x1nE52nFB4nlF5nlN6n1R7oFV8oVyBpGGFp2yOrnSUsnWUsnmYtXqYtX6bt4mkvo2nv4+pwY6owJOrwpSsw5mwxpivxae7zuLp7+bs8eXr8PP2+PL19/n7/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFUALAAAAAAUABQAAAfggE8jQRschoeIh0JILyI1DxGRkpOTDzNHGjwTm5ydnhMQHxwRnAgLnhYPOJwNIaObFCZEBz2cDx1LO5utrxEXUzJJN6QTCCgBDhITvKQRPjABASs7DcUnARHKzBPO0NEtGAgI19nLrs3P0dFQQzPk2ufc6eoBA0Em2PC98+pRGUz5zO3zFs3FjwLvBKIjyGJCjnEBt3ULIEAFgwfWIsZzJoVKCRuaJtxIofEVhQpOihjo1MBDinLbNik41SlVAlYhgBD7xHMZESM0dDQYSrSo0RlNCJAAEaKp06dPQSiJEQgAOw==';
var scrool_img='data:image/gif;base64,R0lGODlhBwAUAIAAAFh9oQAAACwAAAAABwAUAAACCoSPqcvtD6OcFBUAOx==';
var scrool2_img='data:image/gif;base64,R0lGODlhBwADAIAAAFh9oQAAACwAAAAABwADAAACBISPqQUAOw==';
var pstatusoff_img='data:image/gif;base64,R0lGODlhFAAUANUAAP7+//39/vr7/ebt9PD0+Pf5+/z9/vv8/fr7/KnE3KvF3Je41aLA2aPA2afE3KjE3LLK37jP4sja6cna6eXt9Ojv9aPB2bfP4snb6cja6Obu9O/0+PL2+fb5+/r8/fn7/Pj6+/7///3+/vz9/f////7+/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAFAAUAAAGiECScEgsGo/IpHLJbAoRkQtyIpFgSBlS5/EgbB7NjsNAGI0oECPmet2SLaMBxbJMvB+aAYNjpE5IIg8MDAceFhZ8SSIOIUIlH4hKi40kAAV7kg8OQgAdmIoOBAYOH5eJSRwPZhQPkXUHIBpzp0oKCwcNn0wLFg0VAsDBwAclRiXBASXKy8pOSUEAO0==';
var pstatuson_img='data:image/gif;base64,R0lGODlhFAAUANUAAP39/u/y9ufs8kBrm9Td597l7Z61zKG3za3A08LQ3szX4tLc5tvj69ri6uDn7t/m7ePp7+jt8uzw9Pj6/Pv8/fr7/HOXt3KWtnWYt6K5zq3B08PR3srW4XyevKS7z6O6zubs8eXr8PP2+PL19/f6+/3+/v////7+/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAFAAUAAAGfECTcEgsGo/IpHLJbAobgwEyGjVJN9GDQcrECjKg0IVLrF4HkcwAZLGQpwJPFONGGKmmAPXBiNqTehQnACQEA39IgQAAFByHSnoDJyUVCY+AAx8RAwuOiEgaayBjl0oDDgp0paYDBX5OVB0Ms7SzEBNGIrQSIxO+v7hOSEEAO0==';
var enablectrlon_img='data:image/gif;base64,R0lGODlhLAAUAOYAAPP1+PDz91Z1l1x6m117m158nF98nGOAn2SBoGWBoGeDoa++zq69zbPB0MPO2sTP2z9qlUFslkdwmUlxmklymkpzm0tzm0pymkx0nEx0m011nE51nU52nU92nVB3nlF4nlR6oFV7oVZ8oVV7oFNzlVR0llV1l1Z2l1l4mVt6mmqLrGuMrWyNrWuMrGWCoGeEonKRsH+cuX6atoahvI+owY6nwJOrw5+1y6K3zKa6zqi7z62/0qq6y6q6ysfU4crW4s7Z5M3Y48zX4tjh6urv9PH09/X3+fP19/r7/EdxmUpzmk52nFR7oFV8oVd9oVh+omqMrG6Prm+PrnaWs3WUsn+cuIGeuYSgu4Ofuo+pwZCpwZauxKe7zq3A0q6/z8jV4dTe5/L19+zx9Pz9/f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAALAAUAAAH/4BkgoOEhYaHiImKi4yNjo+Qi14JCi+Wl5YKCV6RRF+foF8+PwFkAAcpBaqrrCkHAGQBPz6hoESEMkobGh29GhxJWWRhCAOqBignrAUDCGFkWUkcvL4bSjKEUh8iTiFNS0xOGlVkRy7GBSYNCyQEqwMuR2RVGk5MS00hTiIfUoQwFa7cwFBhChgoF7CUO6eKxAMyPdqpgicPywUoYKZUwHDjSgUY/yjQ2BFBixEkKyYoNIeOhANBPEpMjEcGy4QVSIxoibCDBgWQg2BQqKEjhyAjKlQubPlSEAMBzGjaVGFEUA4dNX6GrMFlyxgySJWybNiUzNOoFSdQJTNmC5esQKAFCaXRBcIMAEhaiGVYwCVMmWhrTmiBBMAMCF18xiUDcAYODBaoDGFBYSVfhxAlBsZCgcUQKhYw4JjxkVCUD06egBjBgVuGGEtVqWPnbqa8GBn2cRgB4omTD1EIWVHSy4NxDh4k2BhW7FiyZc2e2ZDgAbnxXkqsEBIjBIj370CCFDGFatkyV7CKBAH/XYiYSJMqYbqkiVOk+/jz69/P31AgADs=';
var enablectrloff_img='data:image/gif;base64,R0lGODlhLAAUAOYAAP7+//39/vz8/fX4+/T3+vj6/Pf5+5K21pm72p6+23ep1Xms1oCw2IKx2YKy2YOy2YW02oi224601Y+11pC21pK31pW52Ji72Zq82pu92py92qDA3KLC3aHB3KPD3YCx2IO02oO02Ya12oi324e22oi32oq43Im324y53I+73Y+83ZC83pC93pC83ZK93pS/35O+3qjL5anL5a3O59/r9OPt9ebv9uXu9eTt9Ofv9ebu9PP3+vH1+KnM5anN5arN5qrN5azO5rbU6bvW6b7Z68Da7MTc7cXd7cfe7tDj8M/i79Hj8NPl8dbm8dzq9OHt9eLt9eTt8+nw9bfW6fL3+vT4+v3+/vz9/f////7+/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAALAAUAAAH/4BYgoOEhYaHiImKi4yNjo+QizcJGx2Wl5YbCTeRAjufoDtUOwFYVh0XGaqrrBcdVlgBoqGgAoRDIREkJ7wkIx9JphwIqhoWFawZCBywSR8ju70RIUOEMiguMCssJSowJEWmHsQZFFI5EhirCB6wRSQwKiUsKzAuKDKEMyBHTiIgUwz4eGBEHDkJPLBESaeKHSwjD3wYmAJChJMjIGboc5DExoIlWQD8aFDQyjhVCAXhmNCwHRYjDX4AyLJkgY0kDjQOmuFASY0ngrL0IGkQZUJBOg4ocwmzRxZBT2ooyblRCZQmQYeWPJkhJVKlDl82cCqoCZSpOgXx7KgAiRUAQJKImjx4dGXLhw2AALCCRMFNqjtBIKEhAoKQAkEcbKWrkOHShw6CFBACQQQNJBkJxUAB40WKFiOyiQg3V5U5dOruYikiwt6IFilewEARgxCRELxM6B5hggETYeSMIWO1DBYTBiZ46+YVggihKwQGSJ8+oEqpU6mStXoVqwr16QSuRJpUCdMlTZwiqV/Pvr3794YCAQA7';
var download_img='data:image/gif;base64,R0lGODdhEAARALMAAF99nf///+7u7pqxxv///8nW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAEAARAAAEJpCUQaulRd5dJ/9gKI5hYJ7mh6LgGojsmJJ0PXq3JmaE4P9AICECADs=';
var snuffle_img='data:image/gif;base64,R0lGODlhFAAUALMAAAAAAP///4mft6O0x7XD0srU31d3mGyIpfH09+Lo7QAAAAAAAAAAAAAAAAAAAAAAACwAAAAAFAAUAAAEiDDISau9uKIhuv8fgQTIcYBodxhCMBiJFFvIGBBwJxuDdsqHgu5mMBAmCIHhABS2XEVDQaJcxhLBoWAlsBFWsADWKUtsbQVjYjQeSkpBXG/SfiLBc3rWLsFtDzNNbgFpR3A2YnsUAnklgQlSOAU1CGuUlzUva0omnZ6fPG8FBKSlpqZTGaqrqxEAOx==';

//javascript:  vkaddcss("");
var pls_style='.pls_over, .pls_off, .pls_on {'+
' padding: 3px 21px 4px 3px;'+
' width: 280px;'+
//' background-color: #FFF;'+
//' border-bottom: 1px solid #DAE2E8;'+
' float:left;'+
//' border-bottom: 0px;'+
' cursor: pointer;'+
//' border-top: 1px solid #FFF;'+
//' border-bottom: 1px solid #FFF;'+
'} '+

'.js_menu2 TD:hover DIV{background-color: #587DA1; color: #FFF;border: 0px;} '+
'.js_menu2 TD:hover a{color: #FFF;} '+
'.js_menu2 TD:hover {background-color: #587DA1; color: #FFF;border-top: 1px solid #2A5883; border-bottom: 1px solid #2A5883;} '+

'.js_menu2 .dvplitem DIV:hover DIV{background-color: #587DA1; color: #FFF;border: 0px;} '+
'.js_menu2 .dvplitem DIV:hover a{color: #FFF;} '+
'.js_menu2 .dvplitem DIV:hover {background-color: #587DA1; color: #FFF;border-top: 1px solid #2A5883; border-bottom: 1px solid #2A5883;} '+

//'.js_menu2 TD{}'+// border-color: #FFFFFF;

'.pls_td_on{background-color: #E1E8ED; border-bottom: 1px solid #CCD5DD; border-top: 1px solid #CCD5DD;} '+

'.pls_over {'+
' border-bottom: 0px;'+
' background-color: #587DA1;'+
' color: #FFF;'+
' border-top: 1px solid #2A5883;'+
' border-bottom: 1px solid #2A5883;'+
'} '+

'.pls_on {'+
' background-color: #E1E8ED;'+
' border-bottom: 1px solid #CCD5DD;'+
' border-top: 1px solid #CCD5DD;} '+

'.durat {'+
//' display:block;'+
//' width: 60px;'+
' line-height:21px;'+
' float:right;'+
' height:100%'+
'}'+

'.vkp_ctrimg {'+
' padding: 3px '+ //21px 4px 3px;
'}'+

/*'span.durat { position: relative; float:right; height:100%} '+
'span.durat span.ptip { display: none; } '+
'span.durat:hover span.ptip { display: block; z-index: 100;  position: absolute; top: 25px;  left: 0; width:130px  } '+
'span.durat:hover span.ptip { color:#585858; text-align:center; padding: 10px; border: 1px solid #E9E9E9; background-color: #FFFFD9;} '+
 */

'span.ptool { position: relative;} '+
'span.ptool span.ptip { display: none; } '+
'span.ptool:hover span.ptip { display: block; z-index: 100;  position: absolute; top: 25px;  left: 0; width:130px  } '+
'span.ptool:hover span.ptip { color:#585858; text-align:center; padding: 10px; border: 1px solid #E9E9E9; background-color: #FFFFD9;} '+

'span.pltool { position: relative;} '+
'span.pltool span.pltip { display: none; } '+
'span.pltool:hover {display: none;} '+                                                                    // 110px
'span.pltool:hover span.pltip { display: block; z-index: 100;  position: relative; top: -3px;  left: -120px; width:auto;  } '+
'span.pltool:hover span.pltip { color:#585858; text-align:center; padding: 2px; border: 1px solid #DDDDDD; background-color: #FFFFD9;} ';//+

if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;