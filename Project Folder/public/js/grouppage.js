function writePostData(userId, name, title, content) {
  firebase.database().ref(userId).set({
    username: name,
    title: title,
    content: content
  });
}

function initializeFirebase() {
  var config = {
    apiKey: "AIzaSyC0_XhkEWujv03WECUWtR0Hck9WH_hjkoU",
    authDomain: "group3db-f028e.firebaseapp.com",
    databaseURL: "https://group3db-f028e.firebaseio.com",
    storageBucket: "group3db-f028e.appspot.com",
    messagingSenderId: "164875081133"
  };
  firebase.initializeApp(config);
}



initializeFirebase();
$("#postBtn").click( function() {
  writePostData("123", "Jeff", $("#title-text").val(), $("#message-text").val())
  });