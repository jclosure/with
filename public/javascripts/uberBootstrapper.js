


(function(){
	loadScript(document.home + "/javascripts/head.min.js", function(){
		var scripts = [];
		var jqver = "1.3.2";
		if (window.jQuery === undefined || window.jQuery.fn.jquery < jqver)
			scripts.push("https://ajax.googleapis.com/ajax/libs/jquery/" + jqver + "/jquery.min.js");

		if (!window.getSelection && !document.getSelection)
		 	scripts.push(document.home + "/javascripts/ierange-m2-packed.js");
		 
		scripts.push(document.home + "/javascripts/json2.js");
		scripts.push(document.home + "/javascripts/uberSys.js");
		scripts.push(document.home + "/javascripts/uberRC.js");
		scripts.push(boot);
		head.js.apply(this, scripts);
	});

	function boot()
	{
		//default jquery setup for cors
		jQuery.ajaxSetup({
			headers: {"X-Requested-With": "XMLHttpRequest"}
		});
		jQuery.support.cors = true;


		
		//stage and execute main routine
		(window.ubermarklet = function() {
			var system = uberSystem('/marklet/capture'); //TODO: DEDICATED UI
			var rc = uberRemoteControl('/marklet/rc', system); //TODO: DEDICATED UI
			
			window.system = system;
			window.rc = rc;	

			
			//$("body").append(system.element);
			$("body").append(rc.element);

			//system.frame.show();
			rc.frame.show();
		})();
	}
	
	//support
	function loadScript(url, callback) {
		var done = false;
		var script = document.createElement("script");
		script.src = url;
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")){
				done = true;
				callback();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	}
})();
