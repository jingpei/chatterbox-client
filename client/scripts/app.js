// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
var app = {
  url: "https://api.parse.com/1/classes/chatterbox", 
  users: {},
  rooms: {}
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
    return data.results;
  }); 
}

app.updateMessages = function(chats){
  var $messageDisplay = $(".message-display"); 
  for(var i = 0; i < chats.length; i++){
    $messageDiv = $('<div></div>'); 
    $messageDiv.addClass(escapeCheck(chats[i].username + " chat"));
    $messageDiv.html(escapeCheck(chats[i].username) + ': ' + escapeCheck(chats[i].text) + "  " + "<p>"+chats[i].createdAt+"</p>");
    $messageDisplay.append($messageDiv);
  }
}

app.sendMessage = function(){
  var $message = {
    "username": $('#username').val(), 
    "text": $('#chat-message').val(), 
    "roomname": $('.roomname').val()
  };

  console.log($message);
  console.log(JSON.stringify($message));

  $.ajax({
    url: app.url, 
    type: 'POST', 
    data: JSON.stringify($message), 
    success: function(data){
      console.log('chatterbox: Message sent', data);
    }, 
    error: function (data){
      console.error('chatterbox: Failed to send message');
    } 
  });
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
setInterval(app.getMessages.bind(app), 1000);
