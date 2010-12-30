// ==UserScript==
// @description   Vkontakte Optimizer module
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//


var SAVE_MSG_HISTORY_PATTERN="%username% [%date%]:\r\n%message%\r\n\r\n";//%usern_html%, %msg_html%
function vkPageMail(m) {
if (m==1) {	pageMenu='';
//blackList
if (location.href.split('&r=')[1] || location.href.split('=show')[1])
  if (ge('to_id')){
  pageMenu +='<a href=# onClick="javascript:IDIgnor_set('+document.getElementById('to_id').value+');">- '+IDL("blacklist")+'</a>';}
else	pageMenu +='<a href=# onClick="javascript:IDIgnorListM();">- '+IDL("blacklist")+'</a>';
return pageMenu;
} else {
//if (getSet(47)=='y') SetUnReadColor();
//MailSetEvents();
if (ge('historyContents')) {
  vkAddSaveMsgLink();
  vkAddClearChat();
}
if (ge('msgs')) vkAddDelAllMsg();
if (location.href.match('#mail_add_link')) {vkshowAddMedia();}
if (ge('to_id')) InitAudiosMenu('messageFields',ge('to_id').value,'audioRowWall'); 
}
}

function vkshowAddMedia(){if (typeof showAddMedia!='undefined') showAddMedia(); else setTimeout(vkshowAddMedia,100);}
/*
vkInitDataSaver();
vkSaveText("MyTest","SaveTest.txt");
*/
// SAVE HISTORY TO FILE
function vkAddSaveMsgLink(){
  vkInitDataSaver();
  var btn='<a href="#" onclick="vkMsgHistoryText(); return false;"><span id="saveldr" style="display:none"><img src="/images/upload.gif"></span>'+IDL('SaveHistory')+'</a>';
               
  var el=ge("dialog").getElementsByTagName("h4")[0];
  if (el.getElementsByTagName("div")[0]) {
    el=el.getElementsByTagName("div")[0];
    el.innerHTML=btn+'<span class="divide">|</span>'+el.innerHTML;
  } else { 
    el.innerHTML='<div style="font-size: 11px; font-weight: normal; float: right; ">'+btn+'</div>'+el.innerHTML;
  }
}
function vkMsgHistoryText(){
  var mid=ge("to_id").value;
  show("saveldr");
  AjPost('mail.php?act=history',{mid:mid,offset:"-1"},function(r,t){
    //alert(t);
     var messages=[];
     var div=document.createElement('div');
     div.innerHTML=t;
     var links = div.getElementsByTagName('a');
     for (i=0; i<links.length; i++) if (links[i].href.split('away.php?')[1]) {
        links[i].href=links[i].href.split('?to=')[1].replace(/%26/gi,'&').replace(/%3A/gi,':').replace(/%2F/gi,'/').replace(/%25/gi,'%').replace(/%3F/gi,'?').replace(/%3D/gi,'=').replace(/%26/gi,';');
        if (links[i].innerHTML.match(/\.{3}$/i))  links[i].innerHTML=links[i].href;
     }
     var nodes=div.getElementsByTagName('tr');
     for (var i=0; i<nodes.length;i++){
        var msg=nodes[i];
        var td=msg.getElementsByTagName('td');        
        var msgobj={
          date: td[0].innerHTML,
          user: td[1].innerHTML,
          mssg:td[2].innerHTML,
          name: td[1].innerText.replace(/:$/i,""),
          text: td[2].innerText.replace(/\n/g,"\r\n")
        }
        messages.push(msgobj);
     }
     //.replace(/[\\\/\?:\*"><"\|]/i,"")
     messages=messages.reverse();
     var outtext="";
     for (var i=0;i<messages.length;i++){
        outtext+=SAVE_MSG_HISTORY_PATTERN
                 .replace(/%username%/g,messages[i].name)
                 .replace(/%date%/g,    messages[i].date)
                 .replace(/%message%/g, messages[i].text)
                 .replace(/%usern_html%/g,messages[i].user)
                 .replace(/%msg_html%/g,  messages[i].mssg);
        //messages[i].name+" ["+messages[i].date+"]:\r\n"+messages[i].text+"\r\n\r\n";
     }
     doAPIRequest("method=getProfiles&uids="+mid+"&fields=uid,first_name,last_name",function(r){
      hide("vkphloader");
      var username="";
      if (r.response && r.response.length){
       var us=r.response[0];
       username=us.first_name+'_'+us.last_name;
      }
      hide("saveldr");
      vkSaveText(outtext,"messages_"+username+"("+mid+").txt");
    });
     
     
  });
}
// END OF SAVE HISTORY TO FILE


function SetUnReadColor(){
    var cldwn = 120;
    var bgcolor = getMsgColor(), clar = hex2rgb(bgcolor); //background
    var rr = Math.max(clar[0] - cldwn, 0), gg = Math.max(clar[1] - cldwn,0), bb = Math.max(clar[2] - cldwn, 0);  //calc text color
    var textcolor = rgb2hex([rr, gg, bb]);
    //alert(bgcolor+'\n'+textcolor);
    //#E2E9FF
    mailcss = ''.concat('.mailbox table tr.newRow { background: ', bgcolor ,' !important; } ',
        '.mailbox table tr.newRow a { color: ', textcolor, ' !important; }',
        '.im_hist tr.un {  background-color: ', bgcolor, '!important;} .im_hist tr.un td {  border-color: ', bgcolor, ' !important;}');
    vkaddcss(mailcss);                            //#3B4DA0
}

var MsgFormBox;
var vkCurMsgUrl;
function AjMsgFormTo(uid,actshow,ignorsett){
if (!ignorsett){
 if (getSet('62') == 0) {return true;}
 if (getSet('62') == 2 && document.location.href.match('mail.php')){return true;}
 }
var requrl=(!actshow)?'/mail.php?act=write&to=':'/mail.php?act=show&id=';
getUserID(uid,function(uid){
    vkCurMsgUrl=requrl+uid;
      MsgFormBox = new MessageBox({title: IDL("Loading"),width: '520px',progress:'vk_MsgLdr', closeButton: true, fullPageLink:requrl+uid});
      MsgFormBox.setOptions({onHide: function(){MsgFormBox.content('');}});
      MsgFormBox.content('<div class="box_loader"></div><center>'+IDL('txMessage')+'<textarea id="quickNewMessTemp" style="width: 100%;height: 100px"></textarea></center>');
      MsgFormBox.removeButtons();
      MsgFormBox.show();
      ge('quickNewMessTemp').focus();
      //style for warnmsg moved to VkoptInitStyles
    
    AjGet(requrl+uid,function(req){
       var resp=req.responseText;
       var resp2=resp;
       var vk_dechash=false;
       var msgtime="";
       if (!resp.match("simpleBlock")){
       //resp=resp.split('<td class="dialog">')[1].split("</form>")[0]+'</form>';
       resp=resp.split(/<td class="dialog".*>/i)[1].split("</form>")[0]+'</form>';
       //alert(resp);
       if (!resp.match('<div class="replyExtraButtons">')){
       /* resp=resp.split('<ul',2);
        resp=resp[0]+resp[1].split('</ul>')[1];*/
        resp=resp.replace(/<div.id="mail_add_row".+<\/div>/,"");
        resp=resp.replace(/<ul.class=.nNav./,'<ul style="display:none;"');
        
        //resp=resp.split('<td class="label"></td>');
        //resp=resp[0]+resp[1].split('</td>')[1];
       } else {
        resp=resp.split('javascript:history.go(-1)').join("javascript:MsgFormBox.hide(200); void(0);"); //replace close btn
        resp=resp.replace("420px;","500px;").replace("240px","340px")
       }
       
       resp=resp.split('"postMessage">').join('"postMessage"><input type="hidden" id="ajax" name="ajax" value="1" />')
    // resp=resp.split('<input maxlength="128" class=\'inputText\' autocomplete=\'off\' type="text" name=\'title\' id=\'title\' style=\'width: 340px;\' value="').join('<input maxlength="128" class=\'inputText\' autocomplete=\'off\' type="text" name=\'title\' id=\'title\' style=\'width: 340px;\' OnClick="if(ge(\'title\').value==IDL(\'TopicNewMess\')){ge(\'title\').value=\'\';}" onblur="if(ge(\'title\').value==\'\'){ge(\'title\').value=IDL(\'TopicNewMess\');}" value="'+IDL('TopicNewMess'))
       var boxttl=resp.split('<h4>')[1].split('</h4>');
       resp=boxttl[1];
       resp='<div id="vkWarnMessage" style="display:none"></div>'+resp;
        //bugfix for friends.css
        vkaddcss("td.vk_label {text-align: left;}");
        resp=resp.split('class="label"').join('class="vk_label"');
        //end bugfix
       resp=resp.split('id="postMessage"').join('id="aj_postMessage"');    //fix
       resp=resp.split('id="messageFields"').join('id="aj_messageFields"'); //fix                                                                                                                                                                                                                                                                      //340px;
       var texar='<center><ul class=\'nNav\' style=\'float: left\'>'+GetStylesBtnCode('aj_messageBody',"")+'</ul></center>\n\n<br><textarea onkeyup="vk_utils.checkTextLength(4096, this.value, ge(\'vkWarnMessage\'))" onKeyPress="if (event.keyCode==10 || (event.ctrlKey && event.keyCode==13)) {SendAjMsgFnc();}" name="message" id="aj_messageBody" rows="6" style="width: 100%">'+ge("quickNewMessTemp").value+'</textarea><span id="TxtEditDiv_aj_messageBody"></span>';
       
       resp=resp.split('<textarea');
       resp=resp[0]+texar+resp[1].split('</textarea>')[1];
       boxttl=boxttl[0];//+msgtime;
       var user_id=resp.match(/to_id.+"(\d+)"/i)[1];
       MsgFormBox.setOptions({title:boxttl});
       resp+="<center>"+
             ((getSet('69')=='y')?'<a href="#" onclick="ConfirmDel('+user_id+',ge(\'vkWarnMessage\')); return false;">'+IDL('msgclearchat')+'</a><span class=\'divide\'>|</span>':"")+
             " <a href=\""+vkCurMsgUrl+"&hist=1\">[ "+getLang('mail_show_all_history')+" ]</a>"+
             "<span class=\"divide\">|</span> <a href=\""+vkCurMsgUrl+"#mail_add_link\">[ "+IDL('Attach')+" ]</a>"+
             "</center>";

       MsgFormBox.content(resp);
       if (resp.match("audioRowWall")){
          vkAddScript("/js/swfobject.js?5");
          vkAddScript("/js/player.js?5");
          addCss("css/player.css?1");
          InitAudiosMenu('aj_messageFields',user_id,'audioRowWall'); 
          VkoptAudio();
       }       
       /* if (actshow){
         var txel=geByClass('messageText',ge('aj_messageFields'))[0].getElementsByTagName('div')[1];
         txel.id='aj_mestext';
         var tael='<textarea id="aj_cite" readonly onblur="show(\'aj_mestext\'); hide(\'aj_cite\'); " style="display:none; width: 240px; height: '+txel.offsetHeight+'px">'+txel.innerText+'</textarea><span id="TxtEditDiv_aj_cite"></span>';
         txel.parentNode.innerHTML+=tael;
         ge('aj_mestext').onclick="hide('aj_mestext'); show('aj_cite'); ge('aj_cite').focus();";
         if (!ge('aj_mestext').innerHTML.match(/<a href=/i)){ ge('aj_mestext').onmouseover=ge('aj_mestext').onclick;}
         ge('aj_cite').onmouseout=ge('aj_cite').onblur;
    
       };*/
       
       if (resp2.match(/(decod.+hash)\(ge\('.+'\)/im)){
          var decfunc=resp2.match(/ge\(.+\).value.+=.+(decod.+hash)\(ge\('.+'\).value\)/im)[0];
          eval(decfunc);
       }
       MsgFormBox.addButton({onClick: function(){MsgFormBox.hide(200);},style:'button_no',label: IDL("Cancel")});
       /////  callback ajax funcions
       var callback=function(ajaxObj, responseText){
                    var resp="<center>"+responseText.split('</div>')[0]+'</div></center>';
                     hide('vk_MsgLdr');
                    if (responseText.match(/code=3/im)){
                        MsgFormBox.show();
                        ge("vkWarnMessage").style.display='';
                        ge("vkWarnMessage").innerHTML=IDL('FailMore20');
                    }else{
                    resp=resp.split("message").join("vkWarnMessage");
                    MsgFormBox.content(resp);
                    MsgFormBox.removeButtons();
                    MsgFormBox.addButton({onClick: function(){MsgFormBox.hide(200);},label: "OK"});
                    MsgFormBox.setOptions({progress:false});
                    MsgFormBox.show();
                    setTimeout(function(){MsgFormBox.hide(200);},500); }
                    }
       var cancel  = function(obj, text) { hide('vk_MsgLdr'); MsgFormBox.show();}
       var msgFail = function(obj, text) {
          hide('vk_MsgLdr');
          MsgFormBox.show();
          //vkDebugWin('######\n'+text+'\n######\n\n'+resp);
          ge("vkWarnMessage").style.display='';
          ge("vkWarnMessage").innerHTML=IDL('FailSendMsg')+'<br>'+text;}
       ////
       SendAjMsgFnc=function(){
                             show('vk_MsgLdr');
                             var options = {onSuccess: callback, onFail: msgFail, onCaptchaHide: cancel};
                             Ajax.postWithCaptcha('mail.php', serializeForm(ge('aj_postMessage')),options);}
                             
       MsgFormBox.addButton({label: IDL("Send"),onClick:SendAjMsgFnc });
       } else {
       resp='<div class="simpleBlock">'+resp.split('<div class="simpleBlock">')[1].split('<ul')[0]+'</div></div>';
       MsgFormBox.content(resp);
       MsgFormBox.setOptions({title:IDL("Error")});
       MsgFormBox.addButton({onClick: function(){MsgFormBox.hide(200);},label: "OK"});
       }
    ge('aj_messageBody').focus();
    BlockProfileLinks();
    vkExUMlinks('aj_messageFields');
    vkSmiles('aj_messageFields');
    });
});
return false;
}

function vkMarkMsgAsRead(ids,callback){
 var msgarr=[];
 for (var i = 0; i < ids.length; i++)     msgarr.push("post["+ids[i]+"]="+1);
 var posts=msgarr.join("&");
 AjPost("mail.php?act=mark_msg&"+posts,{"mark":"read"},function(r,t){
    if (callback) callback(t);
 });
}
function MsgObajaxingLink(){
var nodes=document.getElementsByTagName("a");
var re=/mail.php\?act=write\&to=(.+)/i;
var re2=/mail.php\?act=show\&id=(.+)/i;
  for (var i=0;i<nodes.length;i++){
   var node=nodes[i];  
   if (node.href && node.href.match(re) && !node.getAttribute('onclick')) { //node.href.match("#")
	   var id=node.href.match(re)[1];
     node.setAttribute("onclick",'return AjMsgFormTo("'+id+'");');
    }
 ///* 
   if (node.href && node.href.match(re2) && !node.getAttribute('onclick')) { //
    var id=node.href.match(re2)[1];
    node.setAttribute("onclick",'return AjMsgFormTo("'+id+'",true);');
    } //*/
  }
}

function vkAddClearChat(){
 if (getSet('69')=='y'){
  var el=geByClass('replyButtons')[0].parentNode;
  var div=document.createElement('div');
  div.className="replyButtons";
  div.setAttribute("style","float:right");
  div.innerHTML=//'<ul class="nNav"><li>'+
  '<a href="#" style="right:3px;" onclick="ConfirmDel('+ge("to_id").value+',ge(\'historyContents\'));return false;">'+IDL('msgclearchat')+'</a>';//+
 // '</li></ul>';
  el.appendChild(div);
 }
}
function vkAddDelAllMsg(){
 if (getSet('69')=='y'){
  var el=geByClass("writeTab")[0];
  var isinbox=(ge('out').value==0)?'true':'false';
  var del_caption=(ge('out').value==0)?IDL('msgdelinbox'):IDL('msgdeloutbox');
  el.innerHTML+=  
    '<span  style="float:left"><a href="#" onclick="ConfirmDel('+isinbox+');return false;">'+del_caption+'</a><span class=\'divide\'>|</span></span>'; 
 }
}

function ConfirmDel(act,out_elem){ if (confirm(IDL('msgdelconfirm'))) {show(out_elem); RunDelAll(act,out_elem);}}
function RunDelAll(isinbox,out_elem){
  var msgtype=(isinbox)?((typeof(isinbox) == 'number')?'message&id='+isinbox:"inbox"):"outbox";
  var el=(out_elem)?ge(out_elem):ge("mail_controls");
  el.innerHTML='<center><font size="4">'+IDL('msgreq')+'</font></center>';
  doUAPIRequest('act='+msgtype+'&from=0&to=200',
    function(res){
      var msgarr=new Array();
      var id;
      for (var i = 0; i < res.d.length; i++) {
        id=res.d[i][0];
        msgarr[msgarr.length]="post["+id+"]="+id;
      }
      var posts=msgarr.join("&");
      el.innerHTML='<center><font size="4">'+IDL('msgdel')+IDL('msgcnt')+res.n+'</font></center>';
      if(res.n>0) {
          AjPost("mail.php?act=mark_msg&"+posts,{"mark":"del"},function(req){
            RunDelAll(isinbox,out_elem);
          });
        //vk_DelMsgReq(posts,isinbox);
      } else {
        el.innerHTML='<center id="vkdelmsg"><font size="4">'+IDL('msgsuc')+'</font></center>';
        fadeOut(out_elem,2000);
      }
    });
}
/*function vk_DelMsgReq(msg_list,isinbox){
  AjPost("mail.php?act=mark_msg&"+msg_list,{"mark":"del"},function(req){
      //var res=eval('('+req.responseText+')');
      RunDelAll(isinbox);
    });
}*/
//RunDelAll(true);

function vkgetHistory(mid, no_pagination) {
 ge('vk_progr').style.display="";
 var no_pages = '';
 if (no_pagination) {no_pages = "&offset=-1";}
 AjGet('mail.php?act=history&mid='+mid+no_pages,vkshowHistory);
}

function vkgetHistoryPage(page,mid) {

 var no_pages = '';
  if (ge('messageHistory')) {ge('messageHistory').innerHTML='<div class="box_loader"></div>'};
 mid=ge('vk_msguid').value;
 no_pages = "&offset="+page
 AjGet('mail.php?act=history&mid='+mid+no_pages,vkshowHistory)
}

function vkshowHistory(http_request) {
var PickText, prevDiv;
 if (http_request.readyState == 4) {
  if (http_request.status == 200) {PickText = http_request.responseText;} else {PickText = 'There was a problem with the request.';}
  PickText=PickText.replace(/getPageContent/g,"vkgetHistoryPage");
  PickText=PickText.replace(/class="commentsPagesWrap standard"/g,'');
  PickText=PickText.replace(/style="margin-left: 90px;"/g,'');
  PickText=PickText.replace(/commentsPages/g,"VKAudioPages");
  var prevDiv = ge('vkhistoryContents');

  prevDiv.innerHTML = PickText;
 }
}

function IDIgnorListM(list) {
for(i=0;x=document.getElementsByTagName('tr')[i];i++) {
if (x.id.split('mess')[1]) {
td = 'ma'+x.id.split('mess')[1];
id = document.getElementById(td).getElementsByTagName('a')[0].href.split('to=')[1].split('&')[0];
document.getElementById(td).innerHTML+=
'<br><a href=# onClick=\"javascript:IDIgnor_set('+id+');\">[ '+IDL("addblack")+' ]</a>';
}}
}


//////////////////////////////////
////// miXOnIN & KiberInfinity //
////////////////////////////////
var icoNewMessVK='iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZtJREFUeNqkk9tKAlEUhv/ZjqN5zoSgJL0QykC0wsfwtkeIeoveIug1eoUOFxESdOFVRBdhluMoZOLs0da/yaCLji7YzMxa//fvtQ9jTadTzBMKc4a9e3jYkOfKP/kHOwiC1b1G46i+sYFsKvUryh0McNlq4fjk5EAFWls7Al/c3KDjedCTybeDGmrJkFVaa5VOJLC1vo7z62t0er2vYalRQy0Zskr7vgrkJFKS2C6XcdZsouO60EHwaTDHGjXUkiFrDOjuiyhJk81NnF5d4bHbNTkOvjPHGjXMma6EtX0aiNtYa7NB4UgE+XweZwLUq1WTu5S2i8Wiqc10lm3DNwbjsQreOxj7Pp77feSXl7EoM12ICaNeqyEej6Mty8il03DCYdhkhP3o4GU0Qld2eCmTgaUUEskkapWKMeA7gxvXluVQE45GPzoIvQrcfnpCLpuFCoXM+hjJ93sx+2YtLWbURmggrO25rnN7d4dioQDHcX68RAuxmBlkyFrxUmlfxWJr/7nHk+Hw3pInp83wv/gjz+PwrHl/5zcBBgDDTxI9ebiiBQAAAABJRU5ErkJggg==';
var icoNone='AAABAAEAICAAAAEAGACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAgAwAAMQOAADEDgAAAAAAAAAAAACPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZTqPZToAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
var animICOsta=0;
function WindForNewMessVK(NewMessContentvk,long,numbHeghtVK){
if(animICOsta==0){
animICOsta=1;
animICO(1,1);
}

numbHeghtVK=numbHeghtVK.substr(0,Number(numbHeghtVK.length-1));
if(getClientHeight()=="" || getClientHeight()==0){
toper=0;
}else{
toper=Number(getClientHeight()/2)-Number(long*40/2);
}
if(toper<0)toper=0;                                            //if(OpacityOnline==0){setOpacityShow(61,100);}     if(doSomethingto()==\'[object HTMLBodyElement]\'){setOpacityHide(99,60);}
//vkaddcss(".newmessvk_ {opacity: 0.6;} .newmessvk_ {position:absolute;left:0px;top:0px;} div > table.newmessvk_ {position:fixed;}.VkFlyMessBorder{border-width:1px 1px 1px 1px;border-color: #c1e79d;border-style:solid;overflow:hidden;}.messagevk TABLE:hover TD{border-color: "+CalculateColor('#c1e79d',60)+";}.messagevk TABLE:hover {background: "+CalculateColor(getMsgColor(),40)+";}.messagevk{overflow:hidden;}");
//NewMessWindContent='<div id="closeddMyVkMessVind" onMouseOver="fadeTo(ge(\'newmessvk_closed\'),500,1);" onmouseout="fadeTo(ge(\'newmessvk_closed\'),500,0.6);"><table border="0" cellspacing="0" cellpadding="0" class="newmessvk_" id="newmessvk_closed" style="width:387px;top:'+toper+'px;"><tr><td width="218" id="NewMessContent_vk"><div style="overflow:auto;max-height:'+getClientHeight()+'px;scrollbar-3dlight-color: #fff;scrollbar-arrow-color: #999;scrollbar-base-color: #fff;scrollbar-darkshadow-color: #fff;scrollbar-face-color: #fff;scrollbar-highlight-color: #999;scrollbar-shadow-color: #999;scrollbar-track-color: #fff;opacity: 0;" id="alfoptglob">'+NewMessContentvk+'</div></td><td valign="top" width="12" id="alfopt" style="opacity: 0;"><a href="javascript://" onclick="newmessvk_function(\'none\');return false;" title=""><img src="http://s29.ucoz.net/img/ma/cv.gif" width="12" height="54" border="0"></a></td></tr></table></div>';
//vkaddcss(".newmessvk_ {opacity: 0.6;} .newmessvk_ {position:absolute;left:0px;top:0px;} div > table.newmessvk_ {position:fixed;}.VkFlyMessBorder{border-width:1px 1px 1px 1px;border-color: #c1e79d;border-style:solid;overflow:hidden;}.messagevk TABLE:hover TD{border-color: "+CalculateColor('#c1e79d',60)+";}.messagevk TABLE:hover {background: "+CalculateColor(getMsgColor(),40)+";}.messagevk{overflow:hidden;}");
var ColorToHover=getMsgColor();//"#f6f3ac";

vkaddcss(".newmessvk_ {opacity: 0.6;} .newmessvk_ {position:fixed;left:0px;top:0px;}"+
         ".messagevk TABLE:hover {background: "+ColorToHover+" !important;}"+
         ".messagevk TABLE:hover .vkmsgth{background: "+ColorToHover+" !important;}");
vkaddcss(".MywikiTable {  border: 1px solid #DEE4E8 !important;  border-right: 0 !important;  border-top: 0 !important;  margin:2px 0px 2px 0px !important;  border-collapse: collapse !important; }"+
         ".MywikiTable td {  border-top: 1px solid #DEE4E8 !important;  border-right: 1px solid #DEE4E8 !important;  vertical-align: top !important;  padding: 5px !important;  margin: 0 !important; }"+
         ".MywikiTable th, .vkmsgth {  background-color:#F5F7F8 !important;  border:0 !important;  margin:0 !important;  border-top: 1px solid #DEE4E8 !important;  border-right: 1px solid #DEE4E8 !important;  padding:5px !important; }");

var contwidth=295;
NewMessWindContent='<div id="closeddMyVkMessVind"><div id="NewMessContent_vk"><DIV class="popup_box_container message_box newmessvk_" onMouseOver="fadeTo(ge(\'newmessvk_closed\'),500,1);" onmouseout="fadeTo(ge(\'newmessvk_closed\'),500,0.6);" id="newmessvk_closed" style="position:fixed;width:'+contwidth+'px;top:'+toper+'px;'+(getSet(86)=='y'?'right: 0px;left: auto;':'')+'"><DIV class="box_layout"><DIV class="box_title_wrap"><DIV class="box_x_button" onclick="newmessvk_function(\'none\');return false;"></DIV><DIV class="box_title"><CENTER><DIV>'+unescape('%u041D%u043E%u0432%u044B%u0435%20%u0441%u043E%u043E%u0431%u0449%u0435%u043D%u0438%u044F')+'</DIV></CENTER></DIV></DIV><DIV class="box_body"><DIV><div style="overflow:auto;max-height:'+(getClientHeight()-80)+'px;scrollbar-3dlight-color: #fff;scrollbar-arrow-color: #999;scrollbar-base-color: #fff;scrollbar-darkshadow-color: #fff;scrollbar-face-color: #fff;scrollbar-highlight-color: #999;scrollbar-shadow-color: #999;scrollbar-track-color: #fff;" id="alfoptglob">'+NewMessContentvk+'</div></DIV></DIV></DIV></DIV></div></div>';

msgfly=document.createElement('div');
msgfly.id='newmessvk_open';
msgfly.innerHTML=NewMessWindContent;
(ge('pageLayout')||ge('page_layout')).parentNode.appendChild(msgfly);
if(getClientHeight()!="" || getClientHeight()!=0){
document.getElementById("newmessvk_closed").style.top = Number(getClientHeight()/2)-Number(document.getElementById('newmessvk_closed').offsetHeight/2)+"px";
if(eval(numbHeghtVK)>getClientHeight()){
document.getElementById('newmessvk_closed').style.width="405px";
}
}
if (ge("alfopt")) ge("alfopt").style.opacity = 1;
if (ge("alfoptglob")) ge("alfoptglob").style.opacity = 1;
}
function getClientHeight()
{
  return  window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight);
  //return window.opera?document.documentElement.clientHeight:document.body.clientHeight && !document.compatMode=='CSS1Compat';
}
    function newmessvk_function(a) {
    	vkStatus('');
    	animICOsta=0;
    	animICO(0);
    	if (a=='none')  hide('newmessvk_open');
    	else show('newmessvk_open');
    	var el=ge("closeddMyVkMessVind");
    	if (el) el.parentNode.removeChild(el);
    }

    function f2newmessvk_closed() {
        newmessvk_function('');
    }

function animICO(type, anim) {
    if (getSet('61') > 0) {
        if (animICOsta == 1) {
            if (type == 1 && anim == 1) {
                setIconVK("data:image/gif;base64," + icoNewMessVK);
                if (getSet('61') == 2) {
                    setTimeout("animICO(1,0);", 5000);
                }
            }
            if (type == 1 && anim == 0) {
                setIconVK("http://vkontakte.ru/images/favicon.ico");
                //setIconVK("data:image/gif;base64,"+icoNone);
                setTimeout("animICO(1,1);", 1000);
            }
        } else {
            if (type == 0) {
                setIconVK("http://vkontakte.ru/images/favicon.ico");
            }
        }
    }
}

function isOperaVK(){
    return (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
}

    function setIconVK(icon){
        var head = document.getElementsByTagName("head")[0];
        var links = document.getElementsByTagName("link");
        for (i in links) {
            var ico = links[i];
            if (ico && ico.parentNode && (ico.rel == "shortcut icon")) {
                var parent = ico.parentNode;

                
                if (true) {//isOperaVK()
                    //parent.innerHTML = parent.innerHTML;
                    parent.removeChild(ico);
                    var new_ico = document.createElement("link");
                    new_ico.setAttribute("href",icon);
                    new_ico.setAttribute("type","image/x-icon");
                    new_ico.setAttribute("rel","shortcut icon");
                    head.appendChild(new_ico);                    
                }  else {
                    parent.removeChild(ico);
                    parent.appendChild(ico);
                    
                }
            }
        }
    }


function CreateMessStyle(MessParamsArray,idsnt,kmess){
newmessvk_function('none');
var el=ge("closeddMyVkMessVind")
if(el){
el.parentNode.removeChild(el);
}

var vuvodMess="";
var numberHehghtVK="";

for (var i=0;i<MessParamsArray.length;i++){//kmess

MessParams=MessParamsArray[i].split(';');
                                                                                                                         //LoadMess('+MessParams[3]+');get_quick_message('+MessParams[3]+','+kmess+','+Number(idsnt.length-1)+',Array('+idsnt+'));
//vuvodMess+='<div class="messagevk" id="messagevk'+MessParams[3]+'" style="background: '+getMsgColor()+';"><table onclick="LoadMess('+MessParams[3]+'); AjMsgFormTo(\''+MessParams[3]+'\',true,true);" style="border-width:1px 1px 1px 1px;border-color: #2581ca;border-style:solid;max-width:350px;min-width:350px;max-height:40px;min-height:40px;"><tr><td id="tab2'+MessParams[3]+'" rowspan="2" style="max-width:100px;min-width:100px;max-height:20px;min-height:20px;" class="VkFlyMessBorder">'+unescape(MessParams[0])+'</td><td style="max-width:250px;min-width:250px;max-height:15px;min-height:15px;" class="VkFlyMessBorder" id="topicvk'+MessParams[3]+'">'+unescape(MessParams[1])+'</td></tr><tr><td style="max-width:250px;min-width:250px;max-height:15px;min-height:15px;" class="VkFlyMessBorder" id="textvk'+MessParams[3]+'">'+unescape(MessParams[2])+'</td></tr></table></div>';
var mwidth=250;
var m2width=250;
vuvodMess+='<div class="messagevk" id="messagevk'+MessParams[3]+'">'+
            '<table onclick="LoadMess('+MessParams[3]+'); AjMsgFormTo(\''+MessParams[3]+'\',true,true);" class="MywikiTable" style="max-width:'+mwidth+'px;min-width:'+mwidth+'px;max-height:40px;min-height:40px;">'+
            '<tr><td class="vkmsgth" style="max-width:'+m2width+'px;min-width:'+m2width+'px;max-height:15px;min-height:15px;" id="topicvk'+MessParams[3]+'">'+
            '<b>'+unescape(MessParams[0])+'</b>: '+unescape(MessParams[1])+'</td></tr>'+//<div style="float:right" onclick="vkMarkMsgAsRead(['+MessParams[3]+'],function(){hide(this)}); return false;">X</div>
            '<tr><td style="max-width:'+m2width+'px;min-width:'+m2width+'px;max-height:15px;min-height:15px;" id="textvk'+MessParams[3]+'">'+
            unescape(MessParams[2])+'</td></tr></table></div>';
            
numberHehghtVK+="Number(document.getElementById('messagevk"+MessParams[3]+"').offsetHeight)+";
//<th id="tab2'+MessParams[3]+'" rowspan="2" style="max-width:100px;min-width:100px;max-height:20px;min-height:20px;">'+unescape(MessParams[0])+'</th> 

//vkaddcss("DIV#messagevk"+MessParams[3]+" TABLE:hover {background: "+CalculateColor(getMsgColor(),40)+";} TABLE:hover TD{border-color: "+CalculateColor('#2581ca',120)+";}");
//vkaddcss("table#tab1"+MessParams[3]+":hover {background: #fc0;}");
//vkaddcss("TD#tab3"+MessParams[3]+":hover {background: #fc0;}");
//vkaddcss("TR:hover {background: #fc0;}");
}
WindForNewMessVK(vuvodMess,MessParamsArray.length,numberHehghtVK);
}


function CalculateColor(bgcolor,cldwn,pl){
var clar=hex2rgb(bgcolor); //background
if(pl==1){
var rr=Math.max(clar[0]+cldwn,0), gg=Math.max(clar[1]+cldwn,0), bb=Math.max(clar[2]+cldwn,0);  //calc text color
return textcolor=rgb2hex(Array(rr,gg,bb));
}else{
var rr=Math.max(clar[0]-cldwn,0), gg=Math.max(clar[1]-cldwn,0), bb=Math.max(clar[2]-cldwn,0);  //calc text color
return textcolor=rgb2hex(Array(rr,gg,bb));
}
}


function LoadMess(id){
ge("topicvk"+id).innerHTML="<s>"+ge("topicvk"+id).innerHTML+"</s>";
ge("textvk"+id).innerHTML="<s>"+ge("textvk"+id).innerHTML+"</s>";
//updateLeftNavMenu();
}


 // IM //
/*    */
function vkWFgen(i,txt,fulltext) {
var text="";
    if (!vkGetVal('FavList') || (typeof vkGetVal('FavList') == 'undefined') || (vkGetVal('FavList') == '')) IDFavList = '0_none';
    else IDFavList = vkGetVal('FavList');
    var IDFavor = IDFavList.split('_')[1].split('-');
    IDFavList={};
    if (IDFavor.length>0)
      for (var j=0;j<IDFavor.length;j++){
        IDFavList[IDFavor[j]+"_"]=true;
      }
 
 if (IDFavList[i]) {
     text ='<div class="im_friend" id="im_friend' + intval(i) + '" onmousemove="im.select_friend(this)" onclick="im.add_peer(' + intval(i) + ')"><b>' + txt + '</b></div>';//"<span><b>best</b></span>";
     fulltext=text+fulltext;
 } else {
     text = '<div class="im_friend" id="im_friend' + intval(i) + '" onmousemove="im.select_friend(this)" onclick="im.add_peer(' + intval(i) + ')">' + txt + '</div>';
     fulltext+=text;
 }
return fulltext;//'<span>'+i.match(/\d+/i)+' _vkWFgen_</span>';
}

function vkModWrapFr(){
  RepCodeInFunc("im.wrap_friends","text=vkWFgen(i,txt,text);",/text.....<div.class=.im_friend.+/ig); 
  im.filter_friends();  
}

function vkQMQuote(el){
  ge('im_txt'+im.peer).focus();
  ge('im_txt'+im.peer).value+='[> '+el.innerText+' <]\n';
  im.tabs[im.peer].txt.update();
}
function AddRepHist(str){
  return str.replace(/<div>/ig,"<div onclick=\"vkQMQuote(this);\">");
}


function IM_HistoryMod(html){
  var msg_id=0,el;
  var div=document.createElement('div');
  div.innerHTML=html;
  var tr=div.getElementsByTagName('tr');
  for (var i=0;i<tr.length;i++){
    el=tr[i];
    msg_id=tr[i].id.match(/\d+/);
    el=el.getElementsByTagName('td')[2];
    el.innerHTML=el.innerHTML.replace(/<\/div>/i,'<a id="msgflink'+msg_id+'" href="mail.php?act=show&id='+msg_id+'" target="_blank" style="float: right; background: url(/images/icons/topics_s.gif) no-repeat 0px -0px; width:22px; height: 22px;"></a></div>');
  }
 el=div.innerHTML;
 div.innerHTML='';
 return el;
}
  
function IM_InitFullLinks(){
if (getSet(74)=='y'){
  Inject2Func_2("im.add_msg",'message = \'<a id="msgflink\'+msg_id+\'" href="mail.php?act=show&id=\' + msg_id + \'" target="_blank" style="float: right; background: url(/images/icons/topics_s.gif) no-repeat 0px -0px; width:22px; height: 22px;"></a>\' + message;','target="_blank">$1</a>\');');
  Inject2Func_2("im.send",' ge("msgflink"+msg_id).href="mail.php?act=show&id="+response.msg_id; ge("msgflink"+msg_id).id="msgflink"+response.msg_id;',RegExp("msg_row.id.+response.msg_id;","i"));
  Inject2Func_2("im.load_history","html=IM_HistoryMod(html);","var rows = ge('im_rows' + peer_id);");
}
}

function IM_Quote_init(){
  Inject2Func_2("im.load_history","response[0]=AddRepHist(response[0]);","('<sep>');");
  RepCodeInFunc("im.add_msg","'<div onclick=\"vkQMQuote(this);\">'","'<div>'"); 
}

function IM_Smiles(){
if (getSet(75)=='y'){ 
Inject2Func_2("im.add_msg","vkSmiles('im_body');","'100%';");
Inject2Func_2("im.load_history","vkSmiles('im_body');","scrollHeight;");
Inject2Func_2("im.load_history","vkSmiles('im_body');","new_scroll;");
}
}
function NoLimitFriend(){
  //if(typeof im=='undefined'){
	//  setTimeout('NoLimitFriend()',100);
  //}else{
	  RepCodeInFunc('im.wrap_friends','if (++im.friends_shown > 1000) {','if (++im.friends_shown > 100) {');
	  im.filter_friends();
  //}
}
function IM_ExtInit(){
  if(typeof im=='undefined' || typeof DefSetBits=='undefined'){
	  setTimeout(IM_ExtInit,100);
	}else{
    if (getSet(70)=='y') vkModWrapFr();
    NoLimitFriend();
    if (getSet(71)=='y') IM_Quote_init();
    IM_InitFullLinks();
    IM_Smiles();
    UserOnlineStatus();
    if(setkev){ if (getSet(48)=='y') {InpTexSetEvents(); setkev=false;}}
  }
}
/*
(function(){
  if (location.href.match('/im.php')) { document.addEventListener('DOMContentLoaded',IM_ExtInit, false);}
})();*/
if (!window.vkscripts_ok) vkscripts_ok=1; else vkscripts_ok++;
