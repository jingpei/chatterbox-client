// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
var app = {
  url: "https://api.parse.com/1/classes/chatterbox", 
  friends: {}, //this contains the friends?  
  room: {}, //"roomname" should be key? 
  data: {}
};

app.init = function(){
  this.getMessages(); 
}

app.getMessages = function(){
  $.ajax({
    url: app.url, 
    type: 'GET', 
    contentType: 'application/json', 
    success: function(data, textStatus, jqXHR){
      //data is an array of objects that contain all message data (users, time, message, etc.)
      return data.results; 
    } 
  }).done(function(data){
    app.updateMessages(data.results);
    app.updateRooms(data.results);
    app.setRoom(data.results);
    app.data = data.results;
    return data.results;
  }); 
}

app.updateMessages = function(chats){
  var $messageDisplay = $(".message-display"); 
  for(var i = 0; i < chats.length; i++){
    var $messageDiv = $('<div></div>'); 
    $messageDiv.addClass(escapeCheck(chats[i].username + " chat"));
    var friend = escapeCheck(chats[i].username); //to circumvent closure of ".on('click)"
    $messageDiv.on("click", function(){ 
      app.addFriend(friend)
      });
    if(app.friends[escapeCheck(chats[i].username)]){
      $messageDiv.html('<strong>' + escapeCheck(chats[i].username) + ': ' + escapeCheck(chats[i].text) + "  " + "<p>"+chats[i].createdAt+"</p>"+'</strong>');
      $messageDisplay.append($messageDiv);
    }else{
      $messageDiv.html(escapeCheck(chats[i].username) + ': ' + escapeCheck(chats[i].text) + "  " + "<p>"+chats[i].createdAt+"</p>");
      $messageDisplay.append($messageDiv);
    }
  }
}

app.updateRooms = function(chats){
  var $roomOptions = $("#roomChoice");
  for(var i=0; i<chats.length; i++){
    var $roomOption = $('<option></option>');
    if(app.room[escapeCheck(chats[i].roomname)]==undefined){
      $roomOption.html(escapeCheck(chats[i].roomname));
      $roomOptions.append($roomOption);
      app.room[escapeCheck(chats[i].roomname)] = escapeCheck(chats[i].roomname);
    }
  }
}

app.setRoom = function(chats){
  // console.log(app.data)
  var $roomName = $("option:selected").val(); //.val() is awesome. it gets all the things in the html tag (all the text)
  console.log($roomName);
  $(".chat").remove(); 
  for(var i=0; i<chats.length; i++){
    if(app.room[escapeCheck(chats[i].roomname)]!==undefined && app.room[escapeCheck(chats[i].roomname)]===$roomName){
      app.updateMessages([chats[i]]);
    }
  }
}

app.makeRoom = function(){
  var newRoom = prompt("What is the name of your room?"); 
  if(!app.room[newRoom]){
    var $roomOptions = $("#roomChoice");
    var $roomOption = $("<option></option>");
    $roomOption.html(escapeCheck(newRoom));
    $roomOptions.append($roomOption);
    app.room[escapeCheck(newRoom)] = escapeCheck(newRoom); //added this back to the app.rooms object
  }
}
// $("#make-new-room").on("click"); //so, this works (maybe), but it's nicer in the index.html file. 


app.sendMessage = function(){
  var $message = {
    "username": window.location.search.split("?username=")[1], //see config.js
    "text": $('#chat-message').val(), 
    "roomname": $('option:selected').val()
  };

  console.log($message);
  console.log(JSON.stringify($message));

  $.ajax({
    url: app.url, 
    type: 'POST', 
    data: JSON.stringify($message), 
    success: function(data){
      console.log('chatterbox: Message sent', data);
      app.getMessages(); 
      $('#chat-message').val("");
    }, 
    error: function (data){
      console.error('chatterbox: Failed to send message');
    } 
  });
}

app.addFriend = function(friendName){
  app.friends[friendName] = friendName; 
  //make message bold
  //add <strong></strong> tags to message
  // app.updateMessages();
}


var escapeCheck = function(text){
  var newName ="";
  if(text == undefined){
    return "noName";
  }
  for(var j = 0; j < text.length; j++){
    if(text[j] === "<" ||
      text[j] === ">" ||
      text[j] === "&" ||
      text[j] === "\"" ||
      text[j] === "\'" ||
      text[j] === "," ||
      text[j] === "!" ||
      text[j] === "@" ||
      text[j] === "$" ||
      text[j] === "%" ||
      text[j] === "(" ||
      text[j] === ")" ||
      text[j] === "=" ||
      text[j] === "+" ||
      text[j] === "{" ||
      text[j] === "}" ||
      text[j] === "[" ||
      text[j] === "]" 
      ){
      //do nothing 
    }else{
      newName+=text[j];
    }
  }
  return newName;
}

app.init(); 
setInterval(app.getMessages.bind(app), 3000);
