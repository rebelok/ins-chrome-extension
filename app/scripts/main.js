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


function initObservations() {
  gmail.observe.on('view_thread', function (obj) {
    console.log('view_thread', obj);
  });

  gmail.observe.on('view_email', viewEmail);
}
function main(){

  try {
    $ = jQuery.noConflict();
    gmail = new Gmail($);
    console.log('Hello, ', gmail.get.user_email());
    console.log('Search: ', gmail.get.search_query());

    initObservations();
    bindEmailHover();
  }catch (e){
    console.log(e);
  }
}


refresh(main);

function bindEmailHover(){
  $('body').on('hover','[email].g2',emailHover);
}

function emailHover(){
 console.log('Email hover: '+ this.email);
}

function viewEmail(obj){
  console.log('email opened: ', obj);
  var email = new gmail.dom.email(obj.id);
  console.log('Email = ', email);

  var from = email.from();
  console.log('Email is from: ', from);

  drawSidebar();
}

function drawSidebar(){
  var sideBar = $('.adC[role="complementary"]').prepend('<div class="insightfulSidebar"></div>');

  console.log('IsRapportiveInstalled: ', gmail.check.is_rapportive_installed());
  var data = {"FirstName":"Anton", "LastName":"Gelenava", "Link":"url", "Avatar":"http://t0.gstatic.com/images?q=tbn:ANd9GcSLihjiJR0vIXqcDQ_wgD13JheFIZBFK8nAcEh4eroZrVWW3aYbnGvM1ck", "Email":"email", "Position":"CEO","CompanyName":"FLS", "Sigma":90,
    "Connections":[{"FirstName":"Ilya","LastName":"Billig","Position":"CEO","CompanyName":"Insightful Inc.","sigma":30.383561643835616,"Id":2,"Link":"link"},
    {"FirstName":"Sergey","LastName":"Popov","Position":null,"CompanyName":"First Line Software, Inc","sigma":0.94794520547945216,"Id":282587,"Link":"link"}]};

  var template = '{#.} \
  <div class=".bins-name">\
  <h2 class="bins-h2 bins-h2-name">\
    <a class="bins-person_link" href="{link}">{FirstName} {LastName}</a>\
  </h2>\
  </div>\
  <div class="bins-avatar"><img class="bins-avatar_img {@select key=Sigma}{@gte value=80}bins-link_green{/gte}{@gte value=50}bins-link_blue{/gte}{@default}bins-link_gray{/default}{/select}     " src="{Avatar}" alt="{FirstName} {LastName}"/></div>\
  <div class="bins-email">\
  <a class="" href="mailto://{Email}">{Email}</a>\
  </div>\
  <div class="bins-position">\
  <h2 class="bins-position">{Position} at {CompanyName}</h2>\
  {?.Connections}\
    <ul class="bins-connections_list">\
{#Connections}\
    <li><a class="bins-connection" href="{Link}">{FirstName} {LastName}</a></li>{~n}\
{/Connections}\
</ul>\
{/.Connections}\
  </div>\
    {/.}';
  var compiled = dust.compile(template, "test");
  dust.loadSource(compiled);

  dust.render("test", data, render);

}

function render(err, out){
  $('.insightfulSidebar').html(out).trigger("create");
  console.log('error: ',err);
}
