
var uberRemoteControl = function(ui_url, system){	

	var markup = "\
			<div id='rcframe'>\
				<div id='rcframe_veil'>\
					<p>Loading...</p>\
				</div>\
				<iframe src='"+document.home+ui_url+"?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"'>Enable iFrames.</iframe>\
				<style type='text/css'>\
					#rcframe_veil { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255,.25); cursor: pointer; z-index: 900; }\
					#rcframe_veil p { color: black; font: normal normal bold 20px/20px Helvetica, sans-serif; position: absolute; top: 50%; left: 50%; width: 10em; margin: -10px auto 0 -5em; text-align: center; }\
					#rcframe iframe { display: none; position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
				</style>\
			</div>";
	
	var element = $(markup);
	
	var self = {
		system: system,
		element: element,
		frame: element.find('iframe')
	};
	
	
	return self;
};