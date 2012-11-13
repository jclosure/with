


var uberRemoteControl = function(ui_url, system){	

	//absolute position overlay testcase: http://movingthestill.tumblr.com/post/34614812561/title-if-i-could-fly-artist-gifmethegif-com

	var markup = "\
			<div id='rcframe'>\
				<iframe style='z-index:9999!important;' src='"+document.home+ui_url+"?source="+encodeURIComponent(document.location)+"#"+encodeURIComponent(document.location.protocol+"//"+document.location.host)+"' onload=\"window.__uber.rc.wireCommands()\">Enable iFrames.</iframe>\
				<style type='text/css'>\
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