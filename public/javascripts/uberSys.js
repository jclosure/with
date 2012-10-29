
function initUberFrame() {
	var frame = $('#sysframe iframe');
	frame.get(0).contentWindow.postMessage(initUberFrame.message, '*');	
	frame.closest('.sysframe_veil').slideDown(1000);
}


var uberSystem = function(ui_url) {
	
	var self = {
		work: function(event){ 

			var message = "you pushed " + event.data;

			initUberFrame.message = message;

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


			var element = $(markup);
			$("body").append(element);
		}
	};

	
	if (!!window.addEventListener)
		window.addEventListener('message', self.work, false);
	else
		window.attachEvent('onmessage', self.work);
		
	
	return self;
};