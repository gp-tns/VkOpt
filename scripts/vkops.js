// ==UserScript==
// @description   Vkontakte Optimizer Local Setting
// @include       *vkontakte.ru*
// @include       *vkadre.ru*
// @include       *vk.com*
// ==/UserScript==
//
// (c) All Rights Reserved. VkOpt.
//
IDBit='';FriendsNid=new Array();
// preferred links
vkLinks=new Array(); z=0;
vkLinks[0]=[decodeURI('[%D0%A1%D1%81%D1%8B%D0%BB%D0%BA%D0%B8]')];
// vkLinks[++z]=['[vkOpt]','http://vkopt.net.ru'];
// vkLinks[++z]=['SMS-MGFN','http://szf.megafon.ru/info/rus/sms'];
// vkLinks[++z]=['SMS-BLN','http://www.beeline.ru/sms/index.wbp'];
// vkLinks[++z]=['MiniGame =)',"javascript: attachScript('ag','http://erkie.github.com/asteroids.min.js');"];

//
// Main Menu Additional Links
vkNavLinks=[];
//vkNavLinks.push(["Обновить меню","javascript:vkLoadLeftMenu();"]);
//vkNavLinks.push(["Beta-page","http://idibi.net.ru/",'target="_blank"']);
//vkNavLinks.push(["Support","/board16925304"]);

// Настройки:
IDBit='';
//группы в которых вы администратор (для включения админ-функций) в виде 'XXX-YYY' где XXX и YYY id групп:
AdminGroups='';
//Стены за которыми надо следить:
WallIDs=[''];
//Категории друзей чтоб не грузить лишний раз. Для получения строки с катагориями используйте javascript: vkLoadFiendsGroups(true);
vkFrCatList='';

//для отключения пункта в расширенном меню пользователей сменить 1 на 0 у соответствующего пункта.
ExUserMenuCfg=new Array(
1, //Сообщение
1, //Стена
1, //Фотогрфии с...
1, //Видео с..
1, //Фотографии
1, //Аудио
0, //Аудио-приложение
1, //Видео
1, //Группы
1, //Друзья
1, //Вопросы
1, //Приложения
1, //События
1, //Заметки
1, //Подарки
1, //Рейтинг
1, //Добавить в друзья
1, //Добавить в закладки
1, //Добавить в Черный список
1  //Альт. Профайл
);
//по умолчанию следить только за своей стеной.
//для того что б следить за стеной чужого аккаунта необходимо через запятую вставить '14782277' - где цифры это айди акка за которым следить
//для слежки за стеной группы/встречи через запятую вставить 'g4838294' ====> того в это строчке можно записать что то типа такого: WallIDs=['','14782277','g4838294'];
//
// Заметки(а)
//
