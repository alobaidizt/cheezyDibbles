var myFirebaseRef = new Firebase("https://glowing-torch-9630.firebaseio.com/");

myFirebaseRef.child("user/text").on("value", function(snapshot) {
  alert(snapshot.val());  // Alerts "San Francisco"

  if (snapshot.val() === "music") {
    chrome.extension.getBackgroundPage().console.log('music');
    chrome.tabs.query(
        {
          url:"https://play.google.com/music*",
          currentWindow: true
    }, function(tabs) {
      chrome.extension.getBackgroundPage().console.log(tabs);
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {active: true}); 
    });
  } else if (snapshot.val().indexOf("search for") > -1) {
    var text = snapshot.val().split(" ").slice(2);
    chrome.extension.getBackgroundPage().console.log(text);

    chrome.tabs.query(
        {
          url:"https://play.google.com/music*",
          currentWindow: true
    }, function(tabs) {
      chrome.extension.getBackgroundPage().console.log(tabs);
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {active: true}); 
    });
  }
});

//React when a browser action's icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
  var viewTabUrl = chrome.extension.getURL('splash.html');
  var imageUrl = "http://i.ytimg.com/vi/j1iejIfJ0gk/maxresdefault.jpg";

  //Look through all the pages in this extension to find one we can use.
  var views = chrome.extension.getViews();
  for (var i = 0; i < views.length; i++) {
    var view = views[i];
    console.log(view.location.href);

      console.log("mellow")
    // If this view has the right URL and hasn't been used yet...
    if (view.location.href == viewTabUrl && !view.imageAlreadySet) {
      console.log("hello")

      // ...call one of its functions and set a property.
      view.setImageUrl(imageUrl);
      view.imageAlreadySet = true;
      break; // we're done
    }
  }
});

