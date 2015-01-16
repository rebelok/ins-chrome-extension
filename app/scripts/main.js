/**
 * Created by rebel on 1/14/15.
 */
'use strict';

function refresh(f) {
  if(/in/.test(document.readyState)) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var gmail,$;


function main(){

  try {
    $ = jQuery.noConflict();
    gmail = new Gmail($);
    console.log('Hello, ', gmail.get.user_email());
    console.log('Search: ', gmail.get.search_query());
    init();
    initObservations();
    bindEmailHover();
  }catch (e){
    console.log(e);
  }
}
refresh(main);

function initObservations() {
  gmail.observe.on('view_thread', function (){});
  gmail.observe.on('view_email', viewEmail);
  gmail.observe.on('http_request', httpRequest);
}
function initSearchDetection(){

}

function init(){
  var page = gmail.get.current_page();
  if(page == null){
    drawSidebar(gmail.get.email_id());
  }
}


function bindEmailHover(){
  console.log('bindEmailHover');
  $('body').on('mouseenter','[email].g2',emailHover);
}

function httpRequest(){

}

function emailHover(){
  drawSidebar(this.email);
  console.log('Email hover: '+ this.email);

}

function viewEmail(obj){
  console.log('email opened: ', obj);
  drawSidebar(getEmail(obj.id));
}
function getEmail(emailId){
  var email = new gmail.dom.email(emailId);
  console.log('Email = ', email);

  var from = email.from();
  console.log('Email is from: ', from);
  return from.email;
}
function drawSidebar(email){
  console.log('drawSidebar. Email: ', email);

  var sideBar = $('.insightfulSidebar');
  if(sideBar.length == 0) {
    $('<div class="insightfulSidebar"></div>').prependTo('.adC[role="complementary"]');
  }

  console.log('IsRapportiveInstalled: ', gmail.check.is_rapportive_installed());
  var data = {"FirstName":"Anton", "LastName":"Gelenava", "Link":"url", "Color": "greens",
    "AvatarUrl":"http://t0.gstatic.com/images?q=tbn:ANd9GcSLihjiJR0vIXqcDQ_wgD13JheFIZBFK8nAcEh4eroZrVWW3aYbnGvM1ck",
    "Email":"anton.gelenava@firstlinesoftware.com", "Position":"CEO","CompanyName":"First Line Software, Inc","CompanyLink":"http://cloud.insightfulinc.com/Company/Details/2", "SLinksSum":90,
    "Connections":
      [{"FirstName":"Ilya","LastName":"Billig", "Color": "blues","AvatarUrl":"http://cloud.insightfulinc.com/static/img/custom/person-nemo.png","Position":"CEO","CompanyName":"Insightful Inc.","CompanyLink":"http://cloud.insightfulinc.com/Company/Details/2","SLinksSum":50.383561643835616,"Id":2,"Link":"link"},
    {"FirstName":"Sergey","LastName":"Popov", "Color": "grays","AvatarUrl":"http://m.c.lnkd.licdn.com/mpr/mprx/0_Rm-zuCdMfZ7_QRzkUd1Euh4BSUUfXjkkM26EuhHQtY70RMPXBeGJG8ye_zRrbV5eVSrI_bsyfcFd","Position":null,"CompanyName":"First Line Software, Inc","CompanyLink":"http://cloud.insightfulinc.com/Company/Details/2","SLinksSum":0.94794520547945216,"Id":282587,"Link":"link"}]};


  var compiled = dust.compile(template, "test");
  dust.loadSource(compiled);
  dust.render("test", data, render);
}

function render(err, out){
  $('.insightfulSidebar').html(out).trigger("create");
  console.log('Rendered. error = ',err);
}

var template = '{#.} \
  <div class=".bins-name">\
  <h2 class="bins-h2 bins-h2-name">\
    <a class="bins-person_link" href="{link}">{FirstName} {LastName}</a>\
  </h2>\
  </div>\
  <div class="bins-avatar"><img class="bins-avatar_img {Color}  {@select key=Sigma}{@gte value=80}bins-link_green{/gte}{@gte value=50}bins-link_blue{/gte}{@default}bins-link_gray{/default}{/select}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/></div>\
   <div class="bins-position">\
  <h2 class="bins-h2 bins-h2-position">{Position}</h2>\
  <a class="bins-company_link" href="{CompanyLink}">{CompanyName}</a>\
  <div class="bins-email">\
  <a class="bins-email_link" href="mailto://{Email}">{Email}</a>\
  </div>\
  <div class="bins-connections_title">\
  Connections\
  </div>\
  {?.Connections}\
    <ul class="bins-connections_list">\
{#Connections}\
    <li class="bins-connection"><a href="{Link}">\
    <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
    </a></li>{~n}\
{/Connections}\
</ul>\
{/.Connections}\
  </div>\
    {/.}';
