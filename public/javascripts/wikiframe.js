// javascript:(function(){if(window.myBookmarklet !== undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src='http://tommy.com:8888/bookmarklet.js?'+new Date().getTime();}})();

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
			function getSelText() {
				var s = '';
				if (window.getSelection) {
					s = window.getSelection();
				} else if (document.getSelection) {
					s = document.getSelection();
				} else if (document.selection) {
					s = document.selection.createRange().text;
				}
				return s;
			}
			

			function guid()
			{
				var S4 = function()
				{
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
			}
			
			
			if ($("#uberframe").length == 0) {
				var s = "";
				s = getSelText();
				if (s == "") {
					var s = prompt("What do you need to remember?");
				}
				if ((s != "") && (s != null)) {
					$("body").append("\
					<div id='uberframe'>\
						<div id='uberframe_veil' style=''>\
							<p>Loading...</p>\
						</div>\
						<iframe src='http://en.wikipedia.org/w/index.php?&search="+s+"' onload=\"$('#uberframe iframe').slideDown(500);\">Enable iFrames.</iframe>\
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