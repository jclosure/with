


(function(a){function h(a,b){var c=a.length;while(c--)if(a[c]===b)return c;return-1}function i(a){var b,g,i,j,k,m;g=(a.target||a.srcElement).tagName,b=a.keyCode;if(b==93||b==224)b=91;if(b in d){d[b]=!0;for(j in f)f[j]==b&&(l[j]=!0);return}if(g=="INPUT"||g=="SELECT"||g=="TEXTAREA")return;if(!(b in c))return;for(k=0;k<c[b].length;k++){i=c[b][k];if(i.scope==e||i.scope=="all"){m=i.mods.length>0;for(j in d)if(!d[j]&&h(i.mods,+j)>-1||d[j]&&h(i.mods,+j)==-1)m=!1;(i.mods.length==0&&!d[16]&&!d[18]&&!d[17]&&!d[91]||m)&&i.method(a,i)===!1&&(a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation&&a.stopPropagation(),a.cancelBubble&&(a.cancelBubble=!0))}}}function j(a){var b=a.keyCode,c;if(b==93||b==224)b=91;if(b in d){d[b]=!1;for(c in f)f[c]==b&&(l[c]=!1)}}function k(){for(b in d)d[b]=!1;for(b in f)l[b]=!1}function l(a,b,d){var e,h,i,j;d===undefined&&(d=b,b="all"),a=a.replace(/\s/g,""),e=a.split(","),e[e.length-1]==""&&(e[e.length-2]+=",");for(i=0;i<e.length;i++){h=[],a=e[i].split("+");if(a.length>1){h=a.slice(0,a.length-1);for(j=0;j<h.length;j++)h[j]=f[h[j]];a=[a[a.length-1]]}a=a[0],a=g[a]||a.toUpperCase().charCodeAt(0),a in c||(c[a]=[]),c[a].push({shortcut:e[i],scope:b,method:d,key:e[i],mods:h})}}function m(a){e=a||"all"}function n(){return e||"all"}function o(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,function(){c(window.event)})}var b,c={},d={16:!1,18:!1,17:!1,91:!1},e="all",f={"⇧":16,shift:16,"⌥":18,alt:18,option:18,"⌃":17,ctrl:17,control:17,"⌘":91,command:91},g={backspace:8,tab:9,clear:12,enter:13,"return":13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,"delete":46,home:36,end:35,pageup:33,pagedown:34,",":188,".":190,"/":191,"`":192,"-":189,"=":187,";":186,"'":222,"[":219,"]":221,"\\":220};for(b=1;b<20;b++)f["f"+b]=111+b;for(b in f)l[b]=!1;o(document,"keydown",i),o(document,"keyup",j),o(window,"focus",k),a.key=l,a.key.setScope=m,a.key.getScope=n,typeof module!="undefined"&&(module.exports=key)})(this)






function initUberFrame() {
	var frame = $('#uberframe iframe');
	frame.get(0).contentWindow.postMessage(initUberFrame.capture.text, '*');	

}


function getNodeText(node) {
	var s = '',
	range = null;

	if (!!node) {
    	if (document.body.createTextRange) {
	        range = document.body.createTextRange();
	        range.moveToElementText(node);
	    } else if (window.getSelection) {       
	        var range = document.createRange();
	        range.selectNodeContents(node);
	    }
	}

	var content = range.cloneContents(); 
	span = document.createElement('SPAN');
	span.appendChild(content);
	var htmlContent = span.innerHTML;
	s = "<div>" + htmlContent + "</div>";
	return s;
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
			
			var boxStyle = $("<style type='text/css'>\
			  * { margin:0; padding:0; }\
			  .outer { display:none; }\
			  .outer div { position:absolute; background-color:rgb(255,0,0); z-index:65000; }\
			</style>");
			
			$("head").append(boxStyle);
			
			var box = new Overlay(0, 0, 0, 0);
			
			var doCapture = function(e){
				var el = $(e.target);
				
				var offset = el.offset();
				box.render(el.outerWidth(), el.outerHeight(), offset.left, offset.top);
				
				var node = el.get(0);
				initUberFrame.capture = initUberFrame.capture || {};	
				initUberFrame.capture.text = getNodeText(node);
			}
			
			
			$("body").mouseover(doCapture);
			
			
			key('⌘+c, ctrl+c', function(){ 			
				showFrame();
			});
			
		
			$("body").append("\
			<div id='uberframe' style='display: hidden'>\
				<div id='uberframe_veil' style=''>\
					<p>Loading...</p>\
				</div>\
				<iframe src='"+document.home+"/marklet/capture?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"' onload=\"(function() { window.initUberFrame.apply(window); })()\">Enable iFrames.</iframe>\
				<style type='text/css'>\
					#uberframe_veil { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255,.25); cursor: pointer; z-index: 900; }\
					#uberframe_veil p { color: black; font: normal normal bold 20px/20px Helvetica, sans-serif; position: absolute; top: 50%; left: 50%; width: 10em; margin: -10px auto 0 -5em; text-align: center; }\
					#uberframe iframe { display: none; position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
				</style>\
			</div>");
			
		
			function showFrame() {
				var frame = $("#uberframe iframe");
				var veil = $("#uberframe_veil");
				
				initUberFrame();
				
				if (!frame.is(':visible')) {
					box.hide();
					$("body").unbind('mouseover', doCapture);
					frame.slideDown(500);
					veil.fadeIn(750);
				
				} else {
					veil.fadeOut(750);
					frame.slideUp(500);
					$("body").mouseover(doCapture);
					
				}
				veil.click(function(event){
					veil.fadeOut(750);
					frame.slideUp(500);
					$("body").mouseover(doCapture);
				});
			}
			
			
			
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


function Overlay(width, height, left, top) {

    this.width = this.height = this.left = this.top = 0;

    // outer parent
    var outer = $("<div class='outer' />").appendTo("body");

    // red lines (boxes)
    var topbox    = $("<div />").css("height", 1).appendTo(outer);
    var bottombox = $("<div />").css("height", 1).appendTo(outer);  
    var leftbox   = $("<div />").css("width",  1).appendTo(outer);
    var rightbox  = $("<div />").css("width",  1).appendTo(outer);

    // don't count it as a real element
    outer.mouseover(function(){ 
        outer.hide(); 
    });


    /**
     * Public interface
     */

    this.resize = function resize(width, height, left, top) {
      if (width != null)
        this.width = width;
      if (height != null)
        this.height = height;
      if (left != null)
        this.left = left;
      if (top != null)
        this.top = top;      
    };

    this.show = function show() {
       outer.show();
    };

    this.hide = function hide() {
       outer.hide();
    };     

    this.render = function render(width, height, left, top) {

        this.resize(width, height, left, top);

        topbox.css({
          top:   this.top,
          left:  this.left,
          width: this.width
        });
        bottombox.css({
          top:   this.top + this.height - 1,
          left:  this.left,
          width: this.width
        });
        leftbox.css({
          top:    this.top, 
          left:   this.left, 
          height: this.height
        });
        rightbox.css({
          top:    this.top, 
          left:   this.left + this.width - 1, 
          height: this.height  
        });

        this.show();
    };      

    // initial rendering [optional]
    this.render(width, height, left, top);
}

function guid()
{
	var S4 = function()
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}