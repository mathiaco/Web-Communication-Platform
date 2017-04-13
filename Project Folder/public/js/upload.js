// Initialize Firebase
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

    //get the elements
    var uploader = document.getElementById("uploader");
    var fileButton = document.getElementById('fileButton');
    fileButton.addEventListener('change',function(e){
  
    var file= e.target.files[0];
        //create a storage 
         var storageRef = firebase.storage().ref('documents/' + file.name);

    //upload file
         var task =storageRef.put(file);
   
    //update progress bar
        task.on('state_changed',
        function progress(snapshot){
        var percentage =(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        uploader.value= percentage;
    }, 
    
        function error(err){
            //handle unsuccessful uploads
    },
        function complete(){
        // handle successful uploads       
        var postKey = firebase.database().ref('StoringDocuments/').push().key;
        var downLUrl = task.snapshot.downloadURL;
        var updates={};
        var postData={
           url: downLUrl,
           filename:file.name
       };
        updates['StoringDocuments/' + postKey] =postData;
        firebase.database().ref().update(updates);
        
        // append the name of the file
        $("#uploadfiles").append(
           "<a href='" + downLUrl+ "'> "+ file.name +" <a/>" + "<br/>");
    }  

    );
    
});
