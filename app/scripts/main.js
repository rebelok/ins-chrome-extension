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
var sideBarTemplate = '<div class="bins-side_bar"></div>',
  disabledButtonClass = 'bins-button__disabled',
  inviteUrl = 'https://cloud.insightfulinc.com:8443/Invite/People';

function main() {
  try {
    $ = jQuery.noConflict();
    gmail = new Gmail($);
    console.log('Hello, ', gmail.get.user_email());
    init();
    console.log('init pass');

    detectRapportive();
  } catch (e) {
    console.log(e);
  }
}

refresh(main);

function init() {
  compileTemplates();
  console.log('compile pass');

  initObservations();
  initSearchDetection();
  initDefaultState();
  initEvents();
  initInviteButton();
}

function initEvents() {
  $('.bins-button_invite').click(sendInvite);
}

function initDefaultState() {
  var page = gmail.get.current_page();
  console.log('page', page);
  if (page == null) {
    if (gmail.check.is_google_apps_user() && !(gmail.get.displayed_email_data() && gmail.get.displayed_email_data().thread_id)) {
      drawSearchBar()
    } else {
      var currentEmailId = gmail.get.email_id();
      console.log(currentEmailId);
      if (currentEmailId) {
        var email = getEmail(currentEmailId);
        if (email) {
          drawSidebar(email);
        }
      }
    }
  } else {
    if (page.indexOf('search') == 0) {
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
  drawSearchBar();
}

function observeEmailHover() {
  $('body').on('mouseenter', '[email]', onEmailHover);
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
  if (!searchQuery) {
    console.log('no search query detected');
    return;
  }
  console.log('Search: ', searchQuery);
  var searchTerm = gmail.tools.extract_email_address(searchQuery) || searchQuery;
  if (!searchTerm)return;
  console.log('searching: ', searchTerm);
  var localErrorCallback = errorCallback.bind(null, appendSearchBar, function () {
  });
  requestData(searchTerm, renderSearchBar, localErrorCallback);
}

function initSideBar() {
  $('.bins-side_bar').remove();
  if (IsRapportiveInstalled) {
    $('#rapportive-sidebar').after(sideBarTemplate);
    return;
  }
  $('.adC[role="complementary"]').children().first().prepend(sideBarTemplate);
}

function initInviteButton() {
  addToolbarInvite();
  gmail.observe.on("send_message", addToolbarInvite);
  function addToolbarInvite() {
    gmail.tools.add_toolbar_button('Invite people to Insightful', function () {
      window.open(inviteUrl, '_blank');
    });
  }
}

function sendInvite() {
  var $this = $(this);
  var invDiv = $('<div class="bins-invite">Invitation sent</div>');
  var email = $this.data('email');
  var url = 'https://cloud.insightfulinc.com:8443/api/userprofileapi?invite';

  $this.addClass(disabledButtonClass);

  $.ajax({
    url: url,
    type: 'POST',
    data: {email: email},
    xhrFields: {withCredentials: true}
  })
    .done(function () {
      console.log('invite ok');
      $this.after(invDiv).remove();
    })
    .fail(function (data, a, b, c) {
      console.log('invite failed');
      console.log(data);
      console.log(a);
      console.log(b);
      $this.removeClass(disabledButtonClass);
    });
}

function requestData(email, callback, errorCallback) {
  var url = 'https://cloud.insightfulinc.com:8443/api/Extension';
  $.ajax({
    url: url,
    dataType: 'json',
    data: {email: email},
    xhrFields: {withCredentials: true}
  })
    .done(callback)
    .fail(errorCallback)
    .always(function (data) {
      if (data.Person) {
        data.Person.IsDirect = data.Person.Proximity === 1;
      }
      console.log('done');
      console.log(data)
    });
}

function drawSidebar(email) {
  if (!email)return;
  console.log('drawSidebar. Email: ', email);
  var localErrorCallback = errorCallback.bind(email, appendSidebar, appendSidebar);
  requestData(email, renderSideBar, localErrorCallback);
}

function renderSideBar(data) {
  console.log('renderSidebar');
  dust.render(IsRapportiveInstalled ? "simpleSideBarTemplate" : "fullSideBarTemplate", data, appendSidebar);
}

function errorCallback(unauthtorizedCallback, notFoundCallback, jhr, status, error) {
  console.log(unauthtorizedCallback);
  console.log(jhr);
  if (jhr.status === 401) {
    unauthtorizedCallback('401', '<div class="bins-footer"> Please, login to load additional information about contact <nobr>from <a class="bins-link bins-site_link" href="http://cloud.insightfulinc.com">Isightful</a>.</nobr></div> ');
  } else if (jhr.status === 404 && this) {
    notFoundCallback('404', '<div class="bins-footer"> <span class="bins-invite_text">Invite this person to Insightful to share your contacts</span>&nbsp;&nbsp;<div class="bins-button bins-button_invite" data-email="' + this + '">Invite</div>&nbsp;&nbsp;<a class="bins-link bins-site_link" href="http://cloud.insightfulinc.com">Insightful</a></div>');
  }
  console.log('error - jhr %s, status - %s, error - %s', jhr, status, error);
}

function renderSearchBar(data) {
  console.log('renderSearchBar');
  dust.render('searchBarTemplate', data, appendSearchBar);

}

function initSearchBar() {
  $('[role="main"] .bins-search_bar').remove();
  var target = $('div[role="main"]');
  var googleSearchBar = target.find('.bX');
  if (googleSearchBar.length > 0) {
    target = googleSearchBar;
  }
  else {
    target = target.children().first();
  }
  console.log(target);
  target.after('<div class="bins-search_bar"></div>');
}

function appendSidebar(err, out) {
  initSideBar();
  $('.bins-side_bar').html(out).trigger("create");
  console.log('Rendered sidebar. error = ', err);
  initEvents();
}

function appendSearchBar(err, out) {
  console.log('Rendered searchbar. error = ', err);
  initSearchBar();
  var searchBar = $('.bins-search_bar');
  searchBar.html(out).trigger("create");
  initEvents();
  searchAfterRender();
}

function searchAfterRender() {

  var $bar = $('.bins-search_bar');
  if ($bar.length == 0)return;

  var $gglBar = $('[role="main"] .bX');
  if ($gglBar.length == 0)return;

  if (gmail.check.is_google_apps_user()) {
    $bar.parent().addClass('bins-guser');
  }

  var nameLink = $bar.find('.bins-h2-name');
  if ($gglBar.find('.CR').text().toLowerCase().trim() === nameLink.text().toLowerCase().trim()) {
    nameLink.remove();
  }
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
  <div class="bins-name">\
    <h2 class="bins-h2 bins-h2-name">\
      <a class="bins-person_link" href="{Link}">{FirstName} {LastName}</a>\
    </h2>\
  </div>\
  <div class="bins-person">\
    <div class="bins-avatar">\
      <a class="bins-person_link" href="{Link}">\
        <img class="bins-avatar_img--person {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
      </a>\
    </div>\
    <div class="bins-person_details">\
      {?.Position}\
        <h2 class="bins-h2 bins-h2-position">{Position}</h2>\
      {/.Position}\
      <div class="bins-position">\
        {?.CompanyName}\
          <a class="bins-company_link" href="{CompanyLink}">{CompanyName}</a>\
        {/.CompanyName}\
      </div>\
      {?.InvitationsStatus}\
          <div class="bins-invite">Invitation sent</div>\
        {:else}\
          {?.CanInvite}\
            <div class="bins-invite">\
              <span class="bins-invite_text">\
                Invite this person to Insightful to share your contacts\
              </span>\
              <div class="bins-button bins-button_invite" data-email="{Emails[0]}">\
                Invite\
              </div>\
            </div>\
          {/.CanInvite}\
        {/.InvitationsStatus}\
    </div>\
</div>\
    {?.Emails}\
    <div class="bins-email">\
      {#Emails}\
       <a class="bins-link bins-email_link" title="{.}" href="mailto://{.}">{.}</a>\
        {~n}\
      {/Emails}\
    </div>\
  {/.Emails}\
  {?.Connections}\
    <div class="bins-connections_title">\
      {?.IsDirect}\
      Shared contacts\
      {:else}\
      You know this person through\
      {/IsDirect}\
    </div>\
    <ul class="bins-connections_list">\
      {#Connections}\
        <li class="bins-connection">\
          <a class="bins-connection_link" {?.EmptyAvatar}data-initials="{FirstName[0]}{LastName[0]}"{/.EmptyAvatar} href="{Link}" title="{FirstName} {LastName}">\
            <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
          </a>\
        </li>{~n}\
      {/Connections}\
    </ul>\
    <div class="bins-footer">\
      <a class="bins-link bins-site_link" href="http://cloud.insightfulinc.com">Insightful</a>\
    </div>\
  {/.Connections}\
{/Person}';

var searchBarTemplate = '{#.}\
  <a class="bins-link bins-site_link" href="http://cloud.insightfulinc.com">Insightful</a>\
    {#Persons} \
      <div class="bins-search_bar__content">\
        <div class="bins-person__avatar">\
          <a class="bins-person_link" href="{Link}">\
            <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
          </a>\
        </div>\
      <div class="bins-person">\
        <h2 class="bins-h2 bins-h2-name">\
          <a class="bins-person_link" href="{Link}">{FirstName} {LastName}</a>\
        </h2>\
        <div class="bins-position">\
          <h2 class="bins-h2 bins-h2-position">{Position}</h2>\
          <a class="bins-company_link" href="{CompanyLink}">{CompanyName}</a>\
        </div>\
      </div>\
  <div class="bins-contacts">\
   {?.Emails}\
    <div class="bins-email">\
      {#Emails}\
       <a class="bins-link bins-email_link" title="{.}" href="mailto://{.}">{.}</a>{~n}\
      {/Emails}\
    </div>\
    {/.Emails}\
    {?.Phones}\
      <div class="bins-phones">\
        {#Phones}\
         <span class="bins-phone">{.}</span>{~n}\
        {/Phones}\
      </div>\
    {/.Phones}\
  </div>\
  {?.Connections}\
  <div class="bins-connections">\
    <div class="bins-connections_title">\
    Connections\
    </div>\
    <ul class="bins-connections_list">\
    {#Connections}\
     <li class="bins-connection">\
          <a class="bins-connection_link" {?.EmptyAvatar}data-initials="{FirstName[0]}{LastName[0]}"{/.EmptyAvatar} href="{Link}" title="{FirstName} {LastName}">\
            <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
          </a>\
        </li>{~n}\
    {/Connections}\
    </ul>\
  </div>\
{/.Connections}\
</div>{~n}{/Persons}\
{/.}';

var simpleSideBarTemplate = '{#Person} \
  {?.Connections}\
<div class="bins-connections_title">\
Connections\
</div>\
    <ul class="bins-connections_list">\
{#Connections}\
   <li class="bins-connection">\
          <a class="bins-connection_link" {?.EmptyAvatar}data-initials="{FirstName[0]}{LastName[0]}"{/.EmptyAvatar} href="{Link}" title="{FirstName} {LastName}">\
            <img class="bins-avatar_img {Color}" src="{AvatarUrl}" alt="{FirstName} {LastName}"/>\
          </a>\
        </li>{~n}\
{/Connections}\
</ul>\
  </div>\
{/.Connections}\
    <div class="bins-footer">\
      {?.InvitationsStatus}\
        <div class="bins-invite">Invitation sent</div>\
      {:else}\
        {?.CanInvite}\
          <div class="bins-button bins-button_invite" data-email="{Emails[0]}">Invite</div>\
        {/.CanInvite}\
      {/.InvitationsStatus}\
      <a class="bins-link bins-site_link" href="http://cloud.insightfulinc.com">Insightful</a>\
    </div>\
{/Person}';
