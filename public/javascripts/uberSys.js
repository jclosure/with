
function initUberFrame() {
	var frame = __uber.$('#sysframe iframe');
	frame.get(0).contentWindow.postMessage(initUberFrame.message, '*');	
	frame.closest('.sysframe_veil').show();
}


var uberSystem = function(ui_url) {
	
	var self = {
		work: function(event){ 

			//disable selectorGadget if nec
			if (window.selectorGadgetLoaded)
					toggleSelectorGadget(document.home);

			//process message
			var message = event.data;
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
			else {
				if (__uber.$('#sysframe').length == 0){

					//initUberFrame.message = self.getSelText();
					
					initUberFrame.message = __uber.$('.sg_selected').map(function(){
						return self.getNodeText(this);
					}).get().join('');

					var markup = "\
							<div id='sysframe'>\
								<div class='sysframe_veil'>\
									<iframe src='"+document.home+ui_url+"?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"' onload=\"window.initUberFrame()\">Enable iFrames.</iframe>\
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
				var htmlContent = span.innerHTML;
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
				var content = range.cloneContents(); 
				span = document.createElement('SPAN');
				span.appendChild(content);
				var htmlContent = span.innerHTML;
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


	function toggleSelectorGadget(baseUrl){
	  window.selectorGadgetLoaded = !window.selectorGadgetLoaded;
	  baseUrl = baseUrl || "";
	  importCSS(baseUrl+ '/javascripts/selectorgadget/lib/selectorgadget.css');
	  importJS('http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js', 'jQuery', function() { // Load everything else when it is done.
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