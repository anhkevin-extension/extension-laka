console.log('laka.js');
$(function () {
    var timerLoadWatch = setInterval(function() {
      
        if ($('#chat-tool .chat-send-icon').length > 0) {
          
            processChatText();
            
            clearInterval(timerLoadWatch);
        }
    }, 1000);
    getStoreFromServer();
});

function processChatText() {
	console.log('processChatText', "==============");
	var processNum = 0;
	if ($('#chat-tool .chat-send-icon').length > 0 && $('#_redmineInfo').length == 0) {
		processNum ++;
		$('#chat-tool .chat-send-icon').append('<li id="_redmineInfo" class="_showDescription chatInput__redmineInfo" role="button" title="Get Redmine Task Subject"><span class="chatInput__iconContainer">【S】</span></span></li>');
		$('#_redmineInfo').click(function() {
			var str = $('.chat-input-textarea textarea').val();
			var regexp = /https\:\/\/redmine\.lampart\-vn\.com\/issues\/\d+/gi;
			var matches_array = str.match(regexp);
			if (!matches_array) {
                regexp = /https\:\/\/project\.lampart\-vn\.com\/issues\/\d+/gi;
                matches_array = str.match(regexp);
            }
			if (matches_array) {
				var userInfo = getStoreFromKey('userInfo');
				var token_redmine = '';
				if(userInfo && userInfo.api_key) {
					token_redmine = userInfo.api_key;
				}
				matches_array = uniqueArray(matches_array);
				if (token_redmine != '') {
				$.each(matches_array, function(i, v){
					console.log(v);
					$.ajaxBG({
			            url: v + '.json?token='+token_redmine,
			            method: 'GET',
			            dataType: 'json',
			            headers: {'X-Requested-With': 'XMLHttpRequest'},
			            success: function (response, textStatus, xhr) {
			                if (xhr.status === 200 && Object.keys(response).length > 0) {
			                    console.log(v, '■' + response.issue.subject);
			                    $('.chat-input-textarea textarea').VAL($('.chat-input-textarea textarea').val().replace(v, '■' + response.issue.subject + "\n" + v));
			                } else {
			                    console.log(response);
			                }
			            },
			            error: function (response, textStatus, xhr) {
			                console.log("Get From Redmine FAIL, Please try again later");
			            }
			        });
				});
					}
			} else {
				alert("Error! Please enter redmine link want to confirm in the message box.\nThanks");
			}
		});
	}
}

function uniqueArray(arr) {
	return arr.filter(function(value, index, self){
		return self.indexOf(value) === index;
	});
}

$.ajaxBG = function(option) {
	var success = false;
	var error = false;
	var callback = {};
//	if (option.hasOwnProperty('success')) {
//		callback['success'] = option.success;
//		delete option.success;
//	}
//	if (option.hasOwnProperty('error')) {
//		callback['error'] = option.error;
//		delete option.error;
//	}
//	if (option.hasOwnProperty('complete')) {
//		callback['complete'] = option.complete;
//		delete option.complete;
//	}
	if (option.hasOwnProperty('data')) {
		option['data']['_location_href'] = location.href;
	} else {
		option['data'] = {'_location_href' : location.href};
	}
	chrome.runtime.sendMessage({
		  'action': 'ajax',
		  'option': option
	}, function(response) {
		console.log('$.ajaxBG -> ', response);
		if (response && response.hasOwnProperty('callback') && option.hasOwnProperty(response.callback)) {
			option[response.callback](response.response, response.textStatus, response.xhr);
		} else 
//			if (option.hasOwnProperty('error')) 
		{
			console.log('Recall $.ajaxBG ↵');
			$.ajaxBG(option);
//			callback['error'](null, null, null);
		}
	});
};

function getStoreFromServer() {
    $.ajaxBG({
        url: apiUrl + 'get-store',
        method: 'GET',
        dataType: 'json',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        success: function (response, textStatus, xhr) {
            if (Object.keys(response).length > 0) {
                $.each(response, function (key, value) {
                    var data = null;
                    switch (key) {
                        case 'environment':
                        case 'extra':
                        case 'tracker':
                        case 'status':
                        case 'userList':
                        case 'userTracker':
                        case 'userInfo':
                        case 'done_ratio':
                        case 'priority':
                        case 'targetVersion':
                            data = JSON.stringify(value);
                            break;
                    }
                    if (data) {
                        localStorage.setItem(key, data);
                    }
                });
            } else {
                console.log(json);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (serverUrl.search(document.domain) === -1)
                console.log('Connect to get store from ' + serverUrl + ' failed. Please check authentication!!');
        }
    });
}

var cacheStore = {};
function getStoreFromKey(key) {
    data = {};
    switch (key) {
        case 'environment':
        case 'extra':
        case 'tracker':
        case 'status':
        case 'userList':
        case 'userTracker':
        case 'userInfo':
        case 'done_ratio':
        case 'priority':
        case 'targetVersion':
        	if (!cacheStore.hasOwnProperty(key)) {
                data = localStorage.getItem(key);
                data = JSON.parse(data);
                cacheStore[key] = data;
        	} else {
        		data = cacheStore[key];
        	}
            break;
    }
    return data;
}
