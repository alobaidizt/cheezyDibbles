var myFirebaseRef = new Firebase("https://glowing-torch-9630.firebaseio.com/");

myFirebaseRef.child("user/text").on("value", function(snapshot) {
  if (snapshot.val().indexOf("search for") > -1) {
  }
});

//React when a browser action's icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
});

