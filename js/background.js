console.log("loadscript Ext!");

var extensionURL = "https://anhkevin-extension.github.io/extension-laka/";
var excludeBackground = ['js/jquery.min.js'];

var manifest = {};
var matchURL = [];
var matchScript = {};


$.get(buildURL("manifest.json"), function(result) {
	manifest = result;
	loadBackgroundScript(manifest.background.scripts, 0);
}, "json");

/*
 * Load Script From Background
 */
var backgroundScript = [];
function loadBackgroundScript (scripts, index) {
    if (typeof scripts[index] !== 'undefined') {
        var script = scripts[index];
        if (excludeBackground.indexOf(script) == -1) {
            $.get(buildURL(script), function(result) {                
                backgroundScript.push(result);
                checkFinishOrContinue(index, scripts)
            }, "text");
        } else {
        	checkFinishOrContinue(index, scripts)
        }
    }
}

function checkFinishOrContinue(index, scripts) {
	if (index == scripts.length - 1) {
		for(i=0; i < backgroundScript.length; i++) {
			eval(backgroundScript[i]);
		};
    } else {
        loadBackgroundScript(scripts, index + 1);
    }    
}

/*
 * Load Script From Content_Script 
 */
var beforeScript = {};
chrome.webNavigation.onCommitted.addListener(function(details) {
	var scriptMatches = loadMatchScript(manifest.content_scripts, details.url, 'document_start');
    console.log(scriptMatches);
    if (scriptMatches.css.length > 0) {
		loadInsertCSS(details.tabId, scriptMatches.css, 0);
	}
    if (scriptMatches.js.length > 0) {
    	doExecuteScript(scriptMatches.js, 0, function(scripts, index, result) {    		
    		beforeScript[scripts[index]] = result;
    		chrome.tabs.executeScript(details.tabId, {code: result}, function(rs){
    			console.log('Lac 1', rs);
    		});
    	});
	}
});

chrome.webNavigation.onCommitted.addListener(function(details) {
	for (const prop in beforeScript) {
//		console.log(beforeScript[prop]);
//		chrome.tabs.executeScript(details.tabId, {code: beforeScript[prop]}, function(){
//		
//		});
	}
	
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    var scriptMatches = loadMatchScript(manifest.content_scripts, details.url, 'document_end');
    console.log(scriptMatches);
    if ($.isReady) {
    	if (scriptMatches.css.length > 0) {
    		loadInsertCSS(details.tabId, scriptMatches.css, 0);
    	}
        if (scriptMatches.js.length > 0) {
        	loadExecuteScript(details.tabId, scriptMatches.js, 0);
    	}
    } else {
    	$(document).ready(function() {
    		if (scriptMatches.css.length > 0) {
        		loadInsertCSS(details.tabId, scriptMatches.css, 0);
        	}
            if (scriptMatches.js.length > 0) {
            	loadExecuteScript(details.tabId, scriptMatches.js, 0);
        	}
    	});
    }
});

function loadMatchScript(scripts, url, param_run_at) {
	var scriptMatches = {'js':[], 'css':[]};
	$.each(scripts, function(i, objScript){
		if (objScript.hasOwnProperty('run_at') && objScript.run_at != param_run_at) {
			return;
		}
		if (checkMatchUrl(url, objScript.matches)) {
			if (objScript.hasOwnProperty('js')) {
				$.each(objScript.js, function(j, js){
					if (scriptMatches['js'].indexOf(js) == -1) {
						scriptMatches['js'].push(js);
					}
				});
			}
			
			if (objScript.hasOwnProperty('css')) {
				$.each(objScript.css, function(j, css){
					if (scriptMatches['css'].indexOf(css) == -1) {
						scriptMatches['css'].push(css);
					}
				});
			}
		}
	});
	return scriptMatches;
}

function buildURL(script) {
	return extensionURL + script + '?' + (new Date().getTime())
}

//chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//	console.log(tabId, changeInfo, tab);
//    if (changeInfo.hasOwnProperty('status') && changeInfo.status == "complete") {
//        var scriptMatches = loadMatchScript(manifest.content_scripts, tab.url);
//        if (scriptMatches.js.length > 0) {
//        	loadExecuteScript(tab, scriptMatches.js, 0);
//        }
//        if (scriptMatches.css.length > 0) {
//        	loadInsertCSS(tab, scriptMatches.css, 0);
//        }
//    }    
//}); 
function doExecuteScript (scripts, index, callback) {
	if (typeof scripts[index] !== 'undefined') {
	    $.get(buildURL(scripts[index]), function(result) {
	    	callback(scripts, index, result);
	    }, "text");
	}
}

function loadExecuteScript (tabId, scripts, index) {
	if (typeof scripts[index] !== 'undefined') {
	    $.get(buildURL(scripts[index]), function(result) {
	        chrome.tabs.executeScript(tabId, {code: result}, function(){
	        	loadExecuteScript (tabId, scripts, index + 1);
	        });
	    }, "text");
	}
}

function loadInsertCSS (tabId, scripts, index) {
	if (typeof scripts[index] !== 'undefined') {
	    $.get(buildURL(scripts[index]), function(result) {
	        chrome.tabs.insertCSS(tabId, {code: result}, function(){
	        	loadInsertCSS (tabId, scripts, index + 1);
	        });
	    }, "text");
	}
}

function checkMatchUrl(url, matches){
	if (typeof matches == "object" && matches.length > 0) {
		for (i=0; i<matches.length; i++) {
			if (url.match('^' + matches[i].replace('*', '(.*)') + '$')) {
				return true;
			}
		}
	}
	return false;
}
