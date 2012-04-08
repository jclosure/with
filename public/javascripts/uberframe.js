// javascript:(function(){if(window.myBookmarklet !== undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src='http://tommy.com:8888/bookmarklet.js?'+new Date().getTime();}})();



function initUberFrame() {
	var frame = $('#uberframe iframe');
	frame.get(0).contentWindow.postMessage(initUberFrame.capture.text, '*');	
	frame.slideDown(500);
}

(function(){

	// the minimum version of jQuery we want
	var v = "1.3.2";

	// check for jQuery. if it exists, verify it's not too old.
	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				
				loadSupport();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		loadSupport();
	}
	
	
	//todo: lazy

	function loadSupport()
	{
		if ($.browser.msie  && parseInt($.browser.version, 10) <= 8)
		{
			var done = false;
			var script = document.createElement("script");
			script.src = document.home + "/javascripts/ierange-m2-packed.js";
			script.onload = script.onreadystatechange = function(){
				if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")){
					done = true;
					initMyBookmarklet();
				}
			};
			document.getElementsByTagName("head")[0].appendChild(script);
		} else {
			initMyBookmarklet();
		}
	}
	
	
	function initMyBookmarklet() {
		
		(window.myBookmarklet = function() {
			// function getSelText() {
			// 				var s = '';
			// 				if (window.getSelection) {
			// 					s = window.getSelection();
			// 				} else if (document.getSelection) {
			// 					s = document.getSelection();
			// 				} else if (document.selection) {
			// 					s = document.selection.createRange().text;
			// 				}
			// 				return s;
			// 			}
			
			
			function getSelText() {
				var s = '',
				range = null;
				sel = null;
			
				if (window.getSelection) {
					sel = window.getSelection();
					if (!!sel.anchorNode && !!sel.focusNode)
						range = sel.getRangeAt(0);
				}
				else if (document.getSelection)
				{
					sel = document.getSelection();
					range = sel.getRangeAt(0);
				}
				else if (document.selection)
				{
					sel = document.selection;
					range = sel.createRange();
				}
				
			
				if (!!range) {
					//range extension code - works but may not be desirable
					//TODO: MAKE SURE THIS WORKS IN NONHTML5 BROWSERS
					var containerNode = range.commonAncestorContainer;
					//to see if is TextNode
					//containerNode.nodeName == "#text"
					if (containerNode.nodeType == 3) { 
						if (range.startOffset == 0) {
							if (!containerNode.previousSibling)
								range.setStartBefore(containerNode.parentNode); 
						}
						if (range.endOffset == containerNode.length) { //selected to end of node contents
							if (!containerNode.nextSibling)
								range.setEndAfter(containerNode.parentNode);
						}
					}
				
				
					var content = range.cloneContents(); 
					span = document.createElement('SPAN');
					span.appendChild(content);
					var htmlContent = span.innerHTML;
					s = "<div>" + htmlContent + "</div>";
			    }
				return s;
			}
			
			function getSelectionHtml() {
			    var html = "";
			    if (typeof window.getSelection != "undefined") {
			        var sel = window.getSelection();
			        if (sel.rangeCount) {
			            var container = document.createElement("div");
			            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
			                container.appendChild(sel.getRangeAt(i).cloneContents());
			            }
			            html = container.innerHTML;
			        }
			    } else if (typeof document.selection != "undefined") {
			        if (document.selection.type == "Text") {
			            html = document.selection.createRange().htmlText;
			        }
			    }
			    return html;
			}
			
			
			if ($("#uberframe").length == 0) {
				
				
				//s = escape(s);
				capture = initUberFrame.capture = {};
				capture.text = getSelText() || "";
				//capture.source = document.location.toString();
			
				
				if (capture.text == "") {
					capture.text = prompt("What do you need to remember?");
					debugger;
					capture.text = "<div>" + capture.text + "</div>";
				}
				if (!!capture.text && capture.text != "") {
					$("body").append("\
					<div id='uberframe'>\
						<div id='uberframe_veil' style=''>\
							<p>Loading...</p>\
						</div>\
						<iframe src='"+document.home+"/snippets/new?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"' onload=\"window.initUberFrame()\">Enable iFrames.</iframe>\
						<style type='text/css'>\
							#uberframe_veil { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255,.25); cursor: pointer; z-index: 900; }\
							#uberframe_veil p { color: black; font: normal normal bold 20px/20px Helvetica, sans-serif; position: absolute; top: 50%; left: 50%; width: 10em; margin: -10px auto 0 -5em; text-align: center; }\
							#uberframe iframe { display: none; position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
						</style>\
					</div>");
					$("#uberframe_veil").fadeIn(750);
				}
			} else {
				$("#uberframe_veil").fadeOut(750);
				$("#uberframe iframe").slideUp(500);
				setTimeout("$('#uberframe').remove()", 750);
			}
			$("#uberframe_veil").click(function(event){
				$("#uberframe_veil").fadeOut(750);
				$("#uberframe iframe").slideUp(500);
				setTimeout("$('#uberframe').remove()", 750);
			});
		})();
	}
	


})();

function guid()
{
	var S4 = function()
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}