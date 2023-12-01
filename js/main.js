var get_host = location.hostname;

if (get_host == 'laka.lampart-vn.com')
{
	injectContentCss(httpGet('https://anhkevin-extension.github.io/extension-laka/css/laka.css?'+(new Date().getTime())), 'laka');
	injectContentScript(httpGet('https://anhkevin-extension.github.io/extension-laka/js/laka_script.js?'+(new Date().getTime())), 'laka');
}

function injectContentCss(css, title) 
{
    var styleElement = document.querySelector("style[title='" + title + "']");
	if (styleElement) {
  		styleElement.textContent = css;
	} else {
		var styleNew = document.createElement("style");
		styleNew.setAttribute("title", title);
	  	styleNew.textContent = css;
	  	document.head.appendChild(styleNew);
	}
}

function injectContentScript(js) 
{
    var script = document.createElement('script');
	  script.innerHTML = js;
	  document.head.appendChild(script);
}
