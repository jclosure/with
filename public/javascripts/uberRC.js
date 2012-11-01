


var uberRemoteControl = function(ui_url, system){	

	//absolute position overlay testcase: http://movingthestill.tumblr.com/post/34614812561/title-if-i-could-fly-artist-gifmethegif-com

	var markup = "\
			<div id='rcframe'>\
				<div id='rcframe_veil'>\
					<p>Loading...</p>\
				</div>\
				<iframe style='z-index:9999!important;' src='"+document.home+ui_url+"?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"' onload=\"window.rc.wireCommands()\">Enable iFrames.</iframe>\
				<style type='text/css'>\
					#rcframe_veil { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255,.25); cursor: pointer; z-index: 900; }\
					#rcframe_veil p { color: black; font: normal normal bold 20px/20px Helvetica, sans-serif; position: absolute; top: 50%; left: 50%; width: 10em; margin: -10px auto 0 -5em; text-align: center; }\
					#rcframe iframe { display: none; position: fixed; top: 0px; right: 0px; width: 100%; height: 50px; border-bottom: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
				</style>\
			</div>";
	
	var element = __uber.$(markup);
	
	var self = {
		system: system,
		element: element,
		frame: element.find('iframe'),
		wireCommands: function(){
			
		}
	};
	
	
	return self;
};