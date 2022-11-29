console.log('laka.js');

$.fn.VAL = function ($val) {
	if (typeof $val == "undefined") {
		return this.val();
	}
	this.each(function(){
		var localName = this.localName;
		if (!['input', 'textarea', 'select'].indexOf(localName)) {
			return;
		}
		this.value = $val;
		var e = document.createEvent('HTMLEvents');
		e.initEvent('input', true, true);
		this.dispatchEvent(e);
	});
	return this;
}

$.ajaxBG = function(option) {
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
		} else {
			console.log('Recall $.ajaxBG ↵');
			$.ajaxBG(option);
		}
	});
};

$(function () {
    var timerLoadWatch = setInterval(function() {
      
        if ($('#chat-tool .chat-send-icon').length > 0) {
          
            processChatText();
            
            clearInterval(timerLoadWatch);
        }
    }, 1000);
	
	setTimeout(function(){
		analytic_click();
	}, 1000);
	
	var renderMenuMore = setInterval(function() {
      
		if ($('#room-list').length > 0) {

		    var elem_room_list = document.getElementById('room-list');
		    elem_room_list.style.height = "500px";
		    elem_room_list.scrollTop = 1000;
		    elem_room_list.style.height = "";
		    elem_room_list.scrollTop = 0;

		    clearInterval(renderMenuMore);
		}
    	}, 1000);
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

				matches_array = uniqueArray(matches_array);
				$.each(matches_array, function(i, v){
					console.log(v);
					$.ajaxBG({
			            url: v + '.json',
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

function analytic_click() {

	const get_store = localStorage.getItem('user');
	const userInfo = JSON.parse(get_store);
	if(userInfo) {
		$.ajaxBG({
			url: 'https://laka-tian.herokuapp.com/analytic',
			method: 'POST',
			dataType: 'json',
			data: {'quote': userInfo.user_id + '|' + currentDate(), 'author': userInfo.user_id},
			success: function (response, textStatus, xhr) {
				// console.log(response);
			},
			error: function (response, textStatus, xhr) {
				// console.log("FAIL!");
			}
		});
	}
}

function currentDate(format = 'yy-mm-dd') {
	const date = new Date();
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yy: date.getFullYear(),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
}
