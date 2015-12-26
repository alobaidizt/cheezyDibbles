  // pasrse text by space and comma
  function parseText(text) {
    return text.split(/[\s,]+/);
  }

  // console on background page
  function bgConsole(message) {
    chrome.extension.getBackgroundPage().console.log('logging');
    chrome.extension.getBackgroundPage().console.log(message);
  }

  function scoringSystem(tabs, gems) {
    // Returns the the best result from the returned results array from the voiceRecognition service
    var scores = [];
    var matchedTabIds = [];
    var count = [];

    for (var tab in tabs) {
      var searchableString = tabs[tab].title.concat(tabs[tab].url).toLowerCase();
      for (var gem in gems) {
        if (gems[gem] !== "") {
          var regexStr = new RegExp(gems[gem],"g");
          count = (searchableString.match(regexStr) || []).length;
          if (scores[tab] == null) { // checks for both null & undefined
            scores[tab] = 0;
          }
          scores[tab] += count;
        }
      }
      if (scores[tab] > 0) {
        matchedTabIds.push({"tab":tabs[tab],"score":scores[tab]});    
      }
    } 
     
     // sorted in descenting order
     matchedTabIds =  matchedTabIds.sort(function(a,b) { 
      return b.score - a.score;
    });
    return matchedTabIds.map(function(obj) {return obj.tab;});
  }

  function appendResults(tabs) {
    var list = document.getElementById("list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    for (var tab in tabs) {
      var node = document.createElement("li");
      var a = document.createElement("a");
      var id = tabs[tab].id;

      a.text = tabs[tab].title;
      a.setAttribute('href','#');
      a.setAttribute('id', id);
      list.appendChild(node);
      a.addEventListener('click', function(e){
        var x = e.target;
        var tabId = parseInt(x.id);
        chrome.tabs.update(tabId, {active: true}); 
      });
      node.appendChild(a);
    }
  }

function addListenerMulti(el,events,func) {
   for (var e in events) {
    el.addEventListener(events[e], func);
   }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("audible").addEventListener("click", function() {

    chrome.tabs.query({"audible":true}, function(tabs) {
      appendResults(tabs);
      });
  });
  var textbox = document.getElementById("search-box");

  addListenerMulti(textbox,['keypress','mousedown'], function(eve) {

    if ( eve.which == 13 ) eve.preventDefault();
    var searchText = document.getElementById('search-box').value;
    var keywords = parseText(searchText.toLowerCase());
    var tabsOfInterest = [];

      chrome.tabs.query({}, function(tabs) {
        tabsOfInterest = scoringSystem(tabs, keywords);
        appendResults(tabsOfInterest);
      });
    });
  });


