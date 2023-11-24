console.log('main.js')

injectContentCss(httpGet('https://anhkevin-extension.github.io/extension-laka/css/laka.css'));

function injectContentCss(css) 
{
    var style = document.createElement('style');
	  style.innerHTML = css;
	  document.head.appendChild(style);
}
