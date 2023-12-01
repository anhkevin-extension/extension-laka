console.log('Loaded laka_script.js');

// self executing function here
(function() {
    // your page initialization code here
    // the DOM will be available here

    var iconChatElement = document.getElementById("chat-send-icon");
    var newIconChat = document.createElement("div");
    newIconChat.innerHTML ='<li id="_redmineInfoTest" class="_showDescription chatInput__redmineInfo" role="button" title="Get Redmine Task Subject"><span class="chatInput__iconContainer">【S】</span></span></li>';
    newIconChat.innerHTML +='<li id="_redmineCC" class="_showDescription chatInput__redmineInfo" role="button" title="Get Redmine Task Related Members (To/CC)"><span class="chatInput__iconContainer">【C】</span></li>';
    iconChatElement.appendChild(newIconChat);

    // Click #_redmineInfo
    document.getElementById("_redmineInfoTest").addEventListener("click", function() {
        var str = document.querySelector(".chat-input-textarea textarea").value;
        var regexp = /https\:\/\/redmine\.lampart\-vn\.com\/issues\/\d+/gi;
        var matches_array = str.match(regexp);
        if (!matches_array) {
            regexp = /https\:\/\/project\.lampart\-vn\.com\/issues\/\d+/gi;
            matches_array = str.match(regexp);
        }
        if (matches_array) {
            matches_array = uniqueArray(matches_array);
            matches_array.forEach(function(v, i) {
                console.log(v);
                var xhr = new XMLHttpRequest();
                xhr.open("GET", v + ".json");
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.setRequestHeader('X-Redmine-API-Key', 'e9f59fb2de1c541560987d2376098a0241ba45fe');
		xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
		xhr.setRequestHeader('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS');
		xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
                xhr.setRequestHeader ("Authorization", "Basic " + btoa('cu_lac' + ":" + 'Vong.Lac.L.P'));
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        if (Object.keys(response).length > 0) {
                            console.log(v, "■" + response.issue.subject);
                            var textarea = document.querySelector(".chat-input-textarea textarea");
                            var newVal = textarea.value.replace(v, "■" + response.issue.subject + "\n" + v);
                            textarea.value = newVal;
                        } else {
                            console.log(response);
                        }
                    }
                };
                xhr.onerror = function() {
                    console.log("Get From Redmine FAIL, Please try again later");
                };
                xhr.send();
            });
        } else {
            alert("Error! Please enter redmine link want to confirm in the message box.\nThanks");
        }
    });
})();

function uniqueArray(arr) {
	return arr.filter(function(value, index, self){
		return self.indexOf(value) === index;
	});
}
