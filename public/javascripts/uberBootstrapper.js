


(function(){
	loadScript(document.home + "/javascripts/head.min.js", function(){
		var scripts = [];
		var jqver = "1.7.2";
		if (window.jQuery === undefined || window.jQuery.fn.jquery < jqver)
			scripts.push("https://ajax.googleapis.com/ajax/libs/jquery/" + jqver + "/jquery.min.js");

		if (!window.getSelection && !document.getSelection)
		 	scripts.push(document.home + "/javascripts/ierange-m2-packed.js");

		//scripts.push('https://raw.github.com/josscrowcroft/Simple-JavaScript-DOM-Inspector/master/inspector.js');
		 
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

		var win = window;

		win.__uber = {};
		__uber.$ = jQuery.noConflict();

		//jQuery extensions
		__uber.$.fn.getStyleObject = function(evt){
		    var dom = __uber.$(this).get(0);
		    var style;
		    var returns = {};
		    if(win.getComputedStyle){
		        var camelize = function(a,b){
		            return b.toUpperCase();
		        }
		        style = win.getComputedStyle(dom, null);
		        if (style) {
			        for(var i = 0, l = style.length; i < l; i++){
			            var prop = style[i];
			            //var camel = prop.replace(/\-([a-z])/, camelize);
			            var val = style.getPropertyValue(prop);
			            //returns[camel] = val;
			            returns[prop] = val;
			        }
			    }
		        return returns;
		    }
		    if(dom.currentStyle){
		        style = dom.currentStyle;
		        for(var prop in style){
		            returns[prop] = style[prop];
		        }
		        return returns;
		    }
		    if(style = dom.style){
		        for(var prop in style){
		            if(typeof style[prop] != 'function'){
		                returns[prop] = style[prop];
		            }
		        }
		        return returns;
		    }
		    return returns;
		};
		
		//stage and execute main routine
		(__uber.marklet = function() {
			var system = uberSystem('/marklet/capture'); //TODO: DEDICATED UI
			var rc = uberRemoteControl('/marklet/rc', system); //TODO: DEDICATED UI
			
			__uber.system = system;
			__uber.rc = rc;	

			
			//$("body").append(system.element);
			__uber.$("body").append(rc.element);

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
