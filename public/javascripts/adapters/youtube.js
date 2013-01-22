
//youtube page adapter
(function(){
	var getNodeText = __uber.system.getNodeText;
	__uber.system.getNodeText = function(node){
		var cap_str = getNodeText.apply(__uber.system, [node]);
		var $cap = __uber.$(cap_str);
		var $embed = $cap.find('embed');
		
		var s = '';
		var v = getURLParameter('v');
		var width = $embed.width();
		var height = $embed.height();
		var s = '<iframe width="__width__" height="__height__" src="http://www.youtube.com/embed/__v__" frameborder="0" allowfullscreen></iframe>'
				.replace(/__width__/, width)
				.replace(/__height__/, height)
				.replace(/__v__/, v);
		var $s = __uber.$(s);
		
		$embed.replaceWith($s);
		
		return $cap.html();
		
	};

	//helpers
	function getURLParameter(name) {
	    return decodeURIComponent(
	      (RegExp(name + '=' + '(.+?)(&|$)', 'i').exec(location.search) || [, ""])[1]
	    );
	  }

})();