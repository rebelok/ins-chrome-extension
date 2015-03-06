'use strict';
function loadScript(name) {
  console.log('loading %s script..', name);
  var j = document.createElement('script');
  j.src = chrome.extension.getURL(name);
  (document.head || document.documentElement).appendChild(j);
  console.log('done');
}

function loadCSS(name) {
  console.log('loading %s css..', name);
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.extension.getURL(name);
  (document.head || document.documentElement).appendChild(link);
  console.log('done');
}


loadCSS('styles/main.css');
loadScript('bower_components/jquery/dist/jquery.min.js');
loadScript('bower_components/dustjs-linkedin/dist/dust-full.min.js');
loadScript('scripts/gmail.js');
loadScript('scripts/main.js');

