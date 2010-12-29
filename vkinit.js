function Js2Doc(){
  for (var i=0;i<arguments.length;i++){  
    var js = document.createElement('script');
    js.type = 'text/javascript';
    var jsrc="";//"scripts/"+arguments[i];
    //alert(safari.extension.baseURI+'\n'+'\n'+arguments[i]);
	if (window.safari && safari.extension) jsrc=safari.extension.baseURI+'scripts/'+arguments[i];
    if (window.chrome && chrome.extension) jsrc=chrome.extension.getURL('scripts/'+arguments[i]);
	
    js.src = jsrc;//chrome.extension.getURL('scripts/'+arguments[i]);
    document.getElementsByTagName('head')[0].appendChild(js);
  }
}
function add_style(x){
    var stl = document.createElement("link");
    stl.rel = "stylesheet";
    stl.href = chrome.extension.getURL(x);
    document.getElementsByTagName("head")[0].appendChild(stl);
    delete(stl);
}
function VkLoadScripts(){
    Js2Doc(
        "vklang.js",
        "vk_users.js",
        "vk_audio.js", 
        "vk_video.js",	
        "vk_skinman.js",		
        "vk_closed.js",
        "vk_club.js",
        "vk_friend.js",
        "vk_mail.js",
        "vk_news.js",
        "vk_other.js",
        "vk_photo.js",
        "vk_player.js",
        "vk_player_ctrls.js",
        "vk_profile.js",
        "vk_txtformat.js",


        "vkOn.js",
        "vkops.js",
        "vk_altprofile.js",
        "vk_apps.js",

        "vkopt.js"
    );
    add_style("smstyle.css");
}

function ge(el){return document.getElementById(el);}

/*
function MainInit(){
  var head=document.getElementsByTagName('head')[0];
  if (document.getElementsByTagName('body')[0]) VkLoadScripts();//ge('pageContainer')
  else setTimeout(MainInit,10);
} 
MainInit();
*/
function MainInit(){
  var head = document.getElementsByTagName('head')[0];
  VkLoadScripts();
} 
MainInit();

/*
var vkoptjsload=setInterval(function(){                                           
if (head){clearInterval(vkoptjsload); VkLoadScripts()}
},10);
*/
//VkLoadScripts();
