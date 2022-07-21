console.log('background.js');

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	// First, validate the message's structure
	if (msg.action === 'ajax' && msg.hasOwnProperty('option')) {
		// Enable the page-action for the requesting tab
		var option = $.extend(msg.option, {
			success: function (response, textStatus, xhr) {
				sendResponse({
					'callback'		: 'success',
					'response' 		: response,
					'textStatus' 	: textStatus,
					'xhr' 			: xhr
				});
            },
            error: function (response, textStatus, xhr) {
            	sendResponse({
            		'callback'		: 'error',
					'response' 		: response,
					'textStatus' 	: textStatus,
					'xhr' 			: xhr
				});
            },
            complete: function(response, textStatus, xhr) {
            	sendResponse({
            		'callback'		: 'complete',
					'response' 		: response,
					'textStatus' 	: textStatus,
					'xhr' 			: xhr
				});
            }
		});
		
		if (option.hasOwnProperty('url') && option.url.indexOf('https://project.redmine-chatwork.com') > -1) {
			option.url = option.url.replace('https://', 'http://');
		}
		if (option.hasOwnProperty('url') && option.url.indexOf('https://project.lampart-vn.com/') === 0) {
            option.beforeSend = function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa('cu_lac' + ":" + 'Vong.Lac.L.P'));
            };
        }
		console.log(option.url);
		$.ajax(option);
		
		return true;
	} else if (msg.action === 'issues' && msg.hasOwnProperty('issues')) {
		sendAllTab({'action': 'issues', 'issues': msg.issues}, [sender.tab.id]);
		
		if (socket) {
			console.log('<-> Send issues to Server : ', msg.issues);
			socket.emit('change-issues', msg.issues);
		}
		return true;
	}
	sendResponse({
		'Error'	: 'Action not match',
		'msg'	: msg
	});
	return true;
});
