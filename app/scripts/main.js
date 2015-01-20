/**
 * Created by rebel on 1/14/15.
 */
'use strict';

function refresh(f) {
  if (/in/.test(document.readyState)) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var gmail, $, IsRapportiveInstalled;


function main() {
  try {
    $ = jQuery.noConflict();
    gmail = new Gmail($);
    console.log('Hello, ', gmail.get.user_email());
    init();
    detectRapportive();
  } catch (e) {
    console.log(e);
  }
}

refresh(main);

function init() {
  compileTemplates();
  initObservations();
  initSearchDetection();
  initDefaultState();
}

function initDefaultState() {
  var page = gmail.get.current_page();
  console.log('page', page);
  if (page == null) {
    var currentEmailId = gmail.get.email_id();
    if (currentEmailId) {
      var email = getEmail(currentEmailId);
      if (email) {
        drawSidebar(email);
      }
    }
  }else{
    if(page.indexOf('search')==0){
      drawSearchBar();
    }
  }
}

function initSearchDetection() {
  //var searchBar =gmail.dom.search_bar();
  //searchBar.on('change','input',drawSearchBar);
  //searchBar.closest('form').find('button').click(drawSearchBar);
  window.onhashchange = onHashChange;
}

function initObservations() {
  observeEmailView();
  observeEmailHover();
}

function observeEmailView() {
  gmail.observe.on('view_thread', function () {
  });
  gmail.observe.on('view_email', viewEmail);
}

function onHashChange() {
  console.log('hash changed');
  if (window.location.hash.indexOf('%40') > -1) {
    drawSearchBar();
  }
}

function observeEmailHover() {
  $('body').on('mouseenter', '[email].g2', onEmailHover);
}

function detectRapportive() {
  var checker = setInterval(rapportiveChecker, 1000);

  function rapportiveChecker() {
    if (gmail.check.is_rapportive_installed()) {
      IsRapportiveInstalled = true;
      clearInterval(checker);
      initDefaultState();
    }
  }
}

function onEmailHover() {
  var email = $(this).attr('email');
  console.log('Email hover: ', email);
  if (!email) return;
  drawSidebar(email);
}

function viewEmail(obj) {
  console.log('email opened: ', obj);
  if (!obj)return;
  drawSidebar(getEmail(obj.id));
}

function getEmail(emailId) {
  if (!emailId)return null;
  var email = new gmail.dom.email(emailId);
  console.log('Email = ', email);
  if (!email)return null;
  var from = email.from();
  console.log('Email is from: ', from);
  return from.email;
}

function drawSearchBar() {
  var searchQuery = gmail.get.search_query();
  if (!searchQuery)return;
  console.log('Search: ', searchQuery);
  var email = gmail.tools.extract_email_address(searchQuery);
  if (!email)return;
  console.log('searching: ', email);
  requestData(email, renderSearchBar);
}

function initSideBar() {
  var sideBar = $('.insightfulSidebar');
  if (sideBar.length == 0) {
    $('.adC[role="complementary"]').children().first().prepend('<div class="insightfulSidebar"></div>');
  }
}

function requestData(email, callback) {
  var data = {
    "Person": {
      "FirstName": "Anton",
      "LastName": "Gelenava",
      "Link": "url",
      "Color": "greens",
      "AvatarUrl": "http://t0.gstatic.com/images?q=tbn:ANd9GcSLihjiJR0vIXqcDQ_wgD13JheFIZBFK8nAcEh4eroZrVWW3aYbnGvM1ck",
      "Email": "anton.gelenava@firstlinesoftware.com",
      "Position": "CEO",
      "CompanyName": "First Line Software, Inc",
      "CompanyLink": "http://cloud.insightfulinc.com/Company/Details/2",
      "SLinksSum": 90,
      "Connections": [{
        "FirstName": "Ilya",
        "LastName": "Billig",
        "Color": "blues",
        "AvatarUrl": "http://cloud.insightfulinc.com/static/img/custom/person-nemo.png",
        "Position": "CEO",
        "CompanyName": "Insightful Inc.",
        "CompanyLink": "http://cloud.insightfulinc.com/Company/Details/2",
        "SLinksSum": 50.383561643835616,
        "Id": 2,
        "Link": "link"
      },
        {
          "FirstName": "Sergey",
          "LastName": "Popov",
          "Color": "greens",
          "AvatarUrl": "http://m.c.lnkd.licdn.com/mpr/mprx/0_Rm-zuCdMfZ7_QRzkUd1Euh4BSUUfXjkkM26EuhHQtY70RMPXBeGJG8ye_zRrbV5eVSrI_bsyfcFd",
          "Position": null,
          "CompanyName": "First Line Software, Inc",
          "CompanyLink": "http://cloud.insightfulinc.com/Company/Details/2",
          "SLinksSum": 0.94794520547945216,
          "Id": 282587,
          "Link": "link"
        }, {
          "FirstName": "Ilya",
          "LastName": "Billig",
          "Color": "blues",
          "AvatarUrl": "http://cloud.insightfulinc.com/static/img/custom/person-nemo.png",
          "Position": "CEO",
          "CompanyName": "Insightful Inc.",
          "CompanyLink": "http://cloud.insightfulinc.com/Company/Details/2",
          "SLinksSum": 50.383561643835616,
          "Id": 2,
          "Link": "link"
        },
        {
          "FirstName": "Sergey",
          "LastName": "Popov",
          "Color": "grays",
          "AvatarUrl": "http://m.c.lnkd.licdn.com/mpr/mprx/0_Rm-zuCdMfZ7_QRzkUd1Euh4BSUUfXjkkM26EuhHQtY70RMPXBeGJG8ye_zRrbV5eVSrI_bsyfcFd",
          "Position": null,
          "CompanyName": "First Line Software, Inc",
          "CompanyLink": "http://cloud.insightfulinc.com/Company/Details/2",
          "SLinksSum": 0.94794520547945216,
          "Id": 282587,
          "Link": "link"
        }, {
          "FirstName": "Ilya",
          "LastName": "Billig",
          "Color": "grays",
          "AvatarUrl": "http://cloud.insightfulinc.com/static/img/custom/person-nemo.png",
          "Position": "CEO",
          "CompanyName": "Insightful Inc.",
          "CompanyLink": "http://cloud.insightfulinc.com/Company/Details/2",
          "SLinksSum": 50.383561643835616,
          "Id": 2,
          "Link": "link"
        }]
    }
  };

  if (false) {
    callback(data);
  } else {
    var url = 'https://cloud.insightfulinc.com:8443/api/Extension';
    $.ajax({
      url: url,
      dataType: 'json',
      data: {email: email},
      xhrFields: {withCredentials: true}
    })
      .done(callback)
      .fail(function onError(jhr, status, error) {
        console.log('error - jhr %s, status - %s, error - %s', jhr, status, error);
      })
      .always(function (data) {
        console.log('done');
        console.log(data)
      });
  }
}
function drawSidebar(email) {
  if (!email)return;
  console.log('drawSidebar. Email: ', email);
  requestData(email, renderSideBar);
}

function renderSideBar(data) {
  console.log('renderSidebar');
  initSideBar();
  dust.render(IsRapportiveInstalled ? "simpleSideBarTemplate" : "fullSideBarTemplate", data, appendSidebar);
}
function renderSearchBar(data) {
  console.log('renderSearchBar');
  initSearchBar();
  dust.render('searchBarTemplate', data, appendSearchBar);

}
function initSearchBar() {
  var sideBar = $('[role="main"] .bins-search_bar');
  if (sideBar.length == 0) {
    $('.bX').after('<div class="bins-search_bar"></div>');
  }
}

function appendSidebar(err, out) {
  $('.insightfulSidebar').html(out).trigger("create");
  console.log('Rendered sidebar. error = ', err);
}
function appendSearchBar(err, out) {
  $('.bins-search_bar').html(out).trigger("create");
  console.log('Rendered searchbar. error = ', err);
}

function compileTemplates() {
  var compiledFullSideBarTemplate = dust.compile(fullSideBarTemplate, "fullSideBarTemplate");
  dust.loadSource(compiledFullSideBarTemplate);
  var compiledSimpleSideBarTemplate = dust.compile(simpleSideBarTemplate, "simpleSideBarTemplate");
  dust.loadSource(compiledSimpleSideBarTemplate);
  var compiledSearchBarTemplate = dust.compile(searchBarTemplate, "searchBarTemplate");
  dust.loadSource(compiledSearchBarTemplate);
}

var fullSideBarTemplate = '{#Person}\
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
  <a class="bins-email_link" href="mailto://{Emails[0]}">{Emails[0]}</a>\
  </div>\
  {?.Connections}\
  <div class="bins-connections_title">\
  Connections\
  </div>\
    <ul class="bins-connections_list">\
{#Connections}\
    <li class="bins-connection"><a href="{Link}" title="{FirstName} {LastName}">\
    <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
    </a></li>{~n}\
{/Connections}\
</ul>\
  </div>\
{/.Connections}\
    {/Person}';

var searchBarTemplate = '{#Person} \
    <div class="bins-person__avatar">\
      <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
    </div>\
  <div class="bins-person">\
  <h2 class="bins-h2 bins-h2-name">\
    <a class="bins-person_link" href="{link}">{FirstName} {LastName}</a>\
  </h2>\
   <div class="bins-position">\
  <h2 class="bins-h2 bins-h2-position">{Position}</h2>\
  <a class="bins-company_link" href="{CompanyLink}">{CompanyName}</a>\
  </div></div>\
  <div class="bins-contacts">\
  <div class="bins-email">\
  <a class="bins-email_link" href="mailto://{Emails[0]}">{Emails[0]}</a>\
  </div>\
  <span class="bins-phone">\
  {Phones[0]}\
  </div></div>\
  {?.Connections}\
  <div class="bins-connections">\
  <div class="bins-connections_title">\
  Connections\
  </div>\
    <ul class="bins-connections_list">\
{#Connections}\
    <li class="bins-connection"><a href="{Link}" title="{FirstName} {LastName}">\
    <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
    </a></li>{~n}\
{/Connections}\
</ul>\
  </div>\
{/.Connections}\
    {/Person}';

var simpleSideBarTemplate = '{#Person} \
  {?.Connections}\
<div class="bins-connections_title">\
Connections\
</div>\
    <ul class="bins-connections_list">\
{#Connections}\
    <li class="bins-connection">\
    <a href="{Link}" title="{FirstName} {LastName}">\
    <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
    </a>\
    </li>{~n}\
{/Connections}\
</ul>\
  </div>\
{/.Connections}\
    {/Person}';
