console.log('laka.js');
$(function () {
    var timerLoadWatch = setInterval(function() {
      
        if ($('#chat-tool .chat-send-icon').length > 0) {
          
            processChatText();
            
            clearInterval(timerLoadWatch);
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
