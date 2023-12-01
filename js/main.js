var get_host = location.hostname;

if (get_host == 'laka.lampart-vn.com')
{
	injectContentCss(httpGet('https://anhkevin-extension.github.io/extension-laka/css/laka.css?'+(new Date().getTime())));
	injectContentScript(httpGet('https://anhkevin-extension.github.io/extension-laka/js/laka_script.js?'+(new Date().getTime())));
}

function injectContentCss(css) 
{
    var style = document.createElement('style');
	  style.innerHTML = css;
	  document.head.appendChild(style);
}

function injectContentScript(js) 
{
    var script = document.createElement('script');
	  script.innerHTML = js;
	  document.head.appendChild(script);
}
