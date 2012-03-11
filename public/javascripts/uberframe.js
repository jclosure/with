// javascript:(function(){if(window.myBookmarklet !== undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src='http://tommy.com:8888/bookmarklet.js?'+new Date().getTime();}})();

var frameWindow = null;

function initUberFrame(text) {
	var frame = $('#uberframe iframe');
	text = unescape(decodeURIComponent(text));
	frame.get(0).contentWindow.postMessage(text, '*');	
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
				initMyBookmarklet();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initMyBookmarklet();
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
				r = null;
			
				if (window.getSelection) {
					r = window.getSelection().getRangeAt(0);
				}
				else if (document.getSelection)
				{
					r = document.getSelection().getRangeAt(0);
				}
				else if (document.selection)
				{
					r = document.selection.createRange();
				}
			
				var content = r.cloneContents(); 
				span = document.createElement('SPAN');
				span.appendChild(content);
				var htmlContent = span.innerHTML;
				s = "<div>" + htmlContent + "</div>";
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
				var s = "";
				s = getSelText();
				
				s = escape(encodeURIComponent(s));
			
				if (s == "") {
					var s = prompt("What do you need to remember?");
				}
				if ((s != "") && (s != null)) {
					$("body").append("\
					<div id='uberframe'>\
						<div id='uberframe_veil' style=''>\
							<p>Loading...</p>\
						</div>\
						<iframe src='"+document.home+"/marklet/capture?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"' onload=\"window.initUberFrame('"+s+"')\">Enable iFrames.</iframe>\
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
	
	// document.onclick= function(event) {
	// 	    if (event===undefined) event= window.event;                     // IE hack
	// 	    var target= 'target' in event? event.target : event.srcElement; // another IE hack
	// 
	// 	    var root= document.compatMode==='CSS1Compat'? document.documentElement : document.body;
	// 	    var mxy= [event.clientX+root.scrollLeft, event.clientY+root.scrollTop];
	// 
	// 	    var path= getPathTo(target);
	// 	    var txy= getPageXY(target);
	// 	    alert('Clicked element '+path+' offset '+(mxy[0]-txy[0])+', '+(mxy[1]-txy[1]));
	// 	}
	// 
	// 	function getPathTo(element) {
	// 	    if (element.id!=='')
	// 	        return 'id("'+element.id+'")';
	// 	    if (element===document.body)
	// 	        return element.tagName;
	// 
	// 	    var ix= 0;
	// 	    var siblings= element.parentNode.childNodes;
	// 	    for (var i= 0; i<siblings.length; i++) {
	// 	        var sibling= siblings[i];
	// 	        if (sibling===element)
	// 	            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
	// 	        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
	// 	            ix++;
	// 	    }
	// 	}
	// 
	// 	function getPageXY(element) {
	// 	    var x= 0, y= 0;
	// 	    while (element) {
	// 	        x+= element.offsetLeft;
	// 	        y+= element.offsetTop;
	// 	        element= element.offsetParent;
	// 	    }
	// 	    return [x, y];
	// 	}

})();

function guid()
{
	var S4 = function()
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}