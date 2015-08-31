// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
var app = {}; //to trick out the test

var getMessages = function(){
  var messages = $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox', 
    type: 'GET', 
    contentType: 'application/json', 
    success: function(data, textStatus, jqXHR){
      //data is an array of objects that contain all message data (users, time, message, etc.)
      messages = data.results;
      return data.results; 
    } 
  }).done(function(data){
    updateMessages(data.results);
    return data.results;
  });
  //messages = Object.create(messages)
  // return messages;
  //return messages.responseJSON.results; //WHY YOU NO WORK. 
}

getMessages();
setInterval(getMessages, 5000);

var updateMessages = function(chats){
  var $messageDisplay = $(".message-display"); 
  for(var i = 0; i < chats.length; i++){
    $messageDiv = $('<div></div>'); 
    $messageDiv.addClass(escapeCheck(chats[i].username));
    $messageDiv.html(escapeCheck(chats[i].username) + ': ' + escapeCheck(chats[i].text));
    $messageDisplay.append($messageDiv);
  }
}

var sendMessage = function(){
  var $message = $('textarea').text();
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox', 
    type: 'POST', 
    data: JSON.stringify($message), 
    success: function(data){
      console.log('chatterbox: Message sent');
    }, 
    error: function (data){
      console.error('chatterbox: Failed to send message');
    } 
  });
}



var escapeCheck = function(text){
  var newName ="";
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