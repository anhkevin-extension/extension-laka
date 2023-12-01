console.log('Loaded laka_script.js');

// self executing function here
(function() {
    // your page initialization code here
    // the DOM will be available here

    var iconChatElement = document.getElementById("chat-send-icon");
    var newIconChat = document.createElement("div");
    newIconChat.innerHTML ='<li id="_redmineInfo" class="_showDescription chatInput__redmineInfo" role="button" title="Get Redmine Task Subject"><span class="chatInput__iconContainer">【S】</span></span></li>';
    newIconChat.innerHTML +='<li id="_redmineCC" class="_showDescription chatInput__redmineInfo" role="button" title="Get Redmine Task Related Members (To/CC)"><span class="chatInput__iconContainer">【C】</span></li>';
    iconChatElement.appendChild(newIconChat);
})();
