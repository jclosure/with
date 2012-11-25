
function initUberFrame() {
	var frame = __uber.$('#sysframe iframe');
	frame.get(0).contentWindow.postMessage(initUberFrame.message, '*');	
	frame.closest('.sysframe_veil').show();
}


var uberSystem = function(ui_url) {
	
	var self = {
		workHistory: [],
		work: function(event){ 


			//disable selectorGadget if nec
			if (window.selectorGadgetLoaded)
					toggleSelectorGadget(document.home);

			//process message
			var message = event.data;
			self.workHistory.push(message);

			if (message == 'close') {
				__uber.$('#sysframe').remove();
			}
			else if (message == 'exit') {
				__uber.$('#sysframe').remove();
				__uber.$('#rcframe').remove();
			}
			else if (message == 'targeting') {

				//alert('disabled.. add forked selectorgadget repo as submodule.');
				toggleSelectorGadget(document.home);
			}
			else if (message == 'capture') {
				if (__uber.$('#sysframe').length == 0){

					var styles = [
						'background-color',
						'color'
					];

							
					if (self.workHistory[self.workHistory.length - 2] == "targeting") {
						//TARGETED CONTENT
						var allSelected = __uber.$('.sg_selected');
						var nonNestedSelected = allSelected.filter(function(){
							var selected = __uber.$(this);
							return allSelected.has(selected).length == 0;
						});
						initUberFrame.message = nonNestedSelected.map(function(){
							var html = self.getNodeText(this);
							return html;
						}).get().join("\n\r");
					}
					else {
						//SELECTED CONTENT
						var html =  self.getSelText();
						html = ensureComputedStyles(__uber.$(html), html, styles);
						initUberFrame.message = html;
					}
					

					var markup = "\
							<div id='sysframe'>\
								<div class='sysframe_veil'>\
									<iframe style='z-index:9998!important;' src='"+document.home+ui_url+"?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"' onload=\"window.initUberFrame()\">Enable iFrames.</iframe>\
								</div>\
								<style type='text/css'>\
									.sysframe_veil { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255,.25); cursor: pointer; z-index: 900; }\
									#sysframe_veil p { color: black; font: normal normal bold 20px/20px Helvetica, sans-serif; position: absolute; top: 50%; left: 50%; width: 10em; margin: -10px auto 0 -5em; text-align: center; }\
									#sysframe iframe { position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
								</style>\
							</div>";


					var element = __uber.$(markup);
					__uber.$("body").append(element);
				}
			}
			else {
				//alert('command not found');
			}
		},
	    getSelText: function(){
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
				
				////fixup images
				//var markup = $(range.commonAncestorContainer);
				//markup.find('img').each(function(evt){	
				//	var img = $(this);
				//	var styles = img.curStyles("max-width", "width");
				//	img.css('maxWidth', styles.maxWidth);
				//});
				
				
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


				//WORKING: testing styles - CHANGE TO PLUGIN
				// var bgc = getStyle(containerNode, "background-color");
				// alert(bgc);


				var content = range.cloneContents(); 
				span = document.createElement('SPAN');
				span.appendChild(content);
				////fixup images
				//var markup = $(span).hide();
				//$('body').append(markup);
				//markup.find('img').each(function(evt){
				//	//debugger;	
				//	var img = $(this);
				//	var styles = img.curStyles("max-width", "width");
				//	img.css('maxWidth', styles.maxWidth);
				//});
				//markup.show();
				var htmlContent = __uber.$(span).html();//.innerHTML;
				s = "<div>" + htmlContent + "</div>";
		    }
			return s;
		},
	    getNodeText: function(node) {
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
			

				range.setEndAfter(node); //TODO: MAKE SURE THIS WORKS IN NONHTML5 BROWSERS
				
				$node = __uber.$(node);
				$node.removeClass('sg_selected');

				var content = range.cloneContents(); 

				setStylesRecursive(node, content.firstChild);

				$node.addClass('sg_selected');

				debugger;
				span = document.createElement('SPAN');
				span.appendChild(content);
				var htmlContent = __uber.$(span).html();//.innerHTML;

				s = "<div>" + htmlContent + "</div>";

			}
			return s;
		}
	};

	
	if (!!window.addEventListener)
		window.addEventListener('message', self.work, false);
	else
		window.attachEvent('onmessage', self.work);
		
	
	return self;
};



	//HELPERS
	function setStylesRecursive(node, content){
		if (!!node.childNodes && node.childNodes.length > 0){
			for(var i=0; i<node.childNodes.length; i++){
				var nodeChild = node.childNodes[i];
				var contentChild = content.childNodes[i];
				setStylesRecursive(nodeChild, contentChild);
			}
		}
		if (content.setAttribute){
			var styles = __uber.$(node).getStyleObject();
			if (styles['background-color'] == "rgba(0, 0, 0, 0)" || styles['background-color'] == 'transparent') {
				var body = __uber.$(node).closest('body').get(0);
				styles['background-color'] = getStyle(body, 'background-color');
			}
			var strStyles = "";
			for (name in styles){
				var style = styles[name];
				strStyles += name + ":" + style + ";" 
			}
			debugger;
			content.setAttribute('style', strStyles);
		}
	}

	function getStyle(el,styleProp) {
		if (el.currentStyle)
			var setting = el.currentStyle[styleProp];
		else if (window.getComputedStyle)
			var setting = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
		return setting;
	}

	function ensureComputedStyles(src, dest, styles){
		if (dest == "string")
			dest = __uber.$(dest).get(0);

	    for (var i=0;i<styles.length;i++) {
	    	var style = getStyle(src, styles[i]);
	        // Do not use `hasOwnProperty`, nothing will get copied
	        //if ( typeof style == "string" && style != "cssText" && !/\d/.test(style) ) {
	        if ( typeof style == "string" && style != "cssText" ) {
	                // The try is for setter only properties
	                try {
	                        dest.style[styles[i]] = style;
	                        // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
	                        // overwritten.  So make sure to reset this property. (hackyhackhack)
	                        // Other properties may need similar treatment
	                        if ( i == "font" ) {
	                                dest.style.fontSize = style.fontSize;
	                        }
	                } catch (e) {}
	        }
	    }
	   debugger;
	   $dest = $(dest);
	   var s = $dest.prop('style');
	   $dest.attr('style', s);
	    return __uber.$dest.html();
	}

	function toggleSelectorGadget(baseUrl){
	  window.selectorGadgetLoaded = !window.selectorGadgetLoaded;
	  baseUrl = baseUrl || "";
	  importCSS(baseUrl+ '/javascripts/selectorgadget/lib/selectorgadget.css');
	  importJS('https://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js', 'jQuery', function() { // Load everything else when it is done.
	    jQuery.noConflict();
	    importJS(baseUrl + '/javascripts/selectorgadget/vendor/diff/diff_match_patch.js', 'diff_match_patch', function() {
	      importJS(baseUrl + '/javascripts/selectorgadget/lib/dom.js', 'DomPredictionHelper', function() {
	        importJS(baseUrl + '/javascripts/selectorgadget/lib/interface.js');
	      });
	    });
	  });
	}

	function importJS(src, look_for, onload) {
	  var s = document.createElement('script');
	  s.setAttribute('type', 'text/javascript');
	  s.setAttribute('src', src);
	  if (onload) wait_for_script_load(look_for, onload);
	  var head = document.getElementsByTagName('head')[0];
	  if (head) {
	    head.appendChild(s);
	  } else {
	    document.body.appendChild(s);
	  }
	}

	function importCSS(href, look_for, onload) {
	  var s = document.createElement('link');
	  s.setAttribute('rel', 'stylesheet');
	  s.setAttribute('type', 'text/css');
	  s.setAttribute('media', 'screen');
	  s.setAttribute('href', href);
	  if (onload) wait_for_script_load(look_for, onload);
	  var head = document.getElementsByTagName('head')[0];
	  if (head) {
	    head.appendChild(s);
	  } else {
	    document.body.appendChild(s);
	  }
	}

	function wait_for_script_load(look_for, callback) {
	  var interval = setInterval(function() {
	    if (eval("typeof " + look_for) != 'undefined') {
	      clearInterval(interval);
	      callback();
	    }
	  }, 50);
	}