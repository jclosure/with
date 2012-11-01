
function initUberFrame() {
	var frame = __uber.$('#sysframe iframe');
	frame.get(0).contentWindow.postMessage(initUberFrame.message, '*');	
	frame.closest('.sysframe_veil').show();
}


var uberSystem = function(ui_url) {
	
	var self = {
		work: function(event){ 
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

				alert('todo: hookup targeting')
			}
			else {
				if (__uber.$('#sysframe').length == 0){

					initUberFrame.message = self.getSelText();

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
		}
	};

	
	if (!!window.addEventListener)
		window.addEventListener('message', self.work, false);
	else
		window.attachEvent('onmessage', self.work);
		
	
	return self;
};