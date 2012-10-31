
(function(){

	//jquery regex selector
	//http://james.padolsey.com/javascript/regex-selector-for-jquery/
	jQuery.expr[':'].regex = function(elem, index, match) {
	    var matchParams = match[3].split(','),
	        validLabels = /^(data|css):/,
	        attr = {
	            method: matchParams[0].match(validLabels) ? 
	                        matchParams[0].split(':')[0] : 'attr',
	            property: matchParams.shift().replace(validLabels,'')
	        },
	        regexFlags = 'ig',
	        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
	    return regex.test(jQuery(elem)[attr.method](attr.property));
	};


	//path object borrowed from jquery mobile
	//url path helpers for use in relative url management
	path = {

		// This scary looking regular expression parses an absolute URL or its relative
		// variants (protocol, site, document, query, and hash), into the various
		// components (protocol, host, path, query, fragment, etc that make up the
		// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
		// or String.match, it parses the URL into a results array that looks like this:
		//
		//     [0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
		//     [1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
		//     [2]: http://jblas:password@mycompany.com:8080/mail/inbox
		//     [3]: http://jblas:password@mycompany.com:8080
		//     [4]: http:
		//     [5]: //
		//     [6]: jblas:password@mycompany.com:8080
		//     [7]: jblas:password
		//     [8]: jblas
		//     [9]: password
		//    [10]: mycompany.com:8080
		//    [11]: mycompany.com
		//    [12]: 8080
		//    [13]: /mail/inbox
		//    [14]: /mail/
		//    [15]: inbox
		//    [16]: ?msg=1234&type=unread
		//    [17]: #msg-content
		//
		urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

		// Abstraction to address xss (Issue #4787) by removing the authority in
		// browsers that auto	decode it. All references to location.href should be
		// replaced with a call to this method so that it can be dealt with properly here
		getLocation: function( url ) {
			var uri = url ? this.parseUrl( url ) : location,
				hash = this.parseUrl( url || location.href ).hash;

			// mimic the browser with an empty string when the hash is empty
			hash = hash === "#" ? "" : hash;

			// Make sure to parse the url or the location object for the hash because using location.hash
			// is autodecoded in firefox, the rest of the url should be from the object (location unless
			// we're testing) to avoid the inclusion of the authority
			return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
		},

		parseLocation: function() {
			return this.parseUrl( this.getLocation() );
		},

		//Parse a URL into a structure that allows easy access to
		//all of the URL components by name.
		parseUrl: function( url ) {
			// If we're passed an object, we'll assume that it is
			// a parsed url object and just return it back to the caller.
			if ( $.type( url ) === "object" ) {
				return url;
			}

			var matches = path.urlParseRE.exec( url || "" ) || [];

				// Create an object that allows the caller to access the sub-matches
				// by name. Note that IE returns an empty string instead of undefined,
				// like all other browsers do, so we normalize everything so its consistent
				// no matter what browser we're running on.
				return {
					href:         matches[  0 ] || "",
					hrefNoHash:   matches[  1 ] || "",
					hrefNoSearch: matches[  2 ] || "",
					domain:       matches[  3 ] || "",
					protocol:     matches[  4 ] || "",
					doubleSlash:  matches[  5 ] || "",
					authority:    matches[  6 ] || "",
					username:     matches[  8 ] || "",
					password:     matches[  9 ] || "",
					host:         matches[ 10 ] || "",
					hostname:     matches[ 11 ] || "",
					port:         matches[ 12 ] || "",
					pathname:     matches[ 13 ] || "",
					directory:    matches[ 14 ] || "",
					filename:     matches[ 15 ] || "",
					search:       matches[ 16 ] || "",
					hash:         matches[ 17 ] || ""
				};
		},

		//Turn relPath into an asbolute path. absPath is
		//an optional absolute path which describes what
		//relPath is relative to.
		makePathAbsolute: function( relPath, absPath ) {
			if ( relPath && relPath.charAt( 0 ) === "/" ) {
				return relPath;
			}

			relPath = relPath || "";
			absPath = absPath ? absPath.replace( /^\/|(\/[^\/]*|[^\/]+)$/g, "" ) : "";

			var absStack = absPath ? absPath.split( "/" ) : [],
				relStack = relPath.split( "/" );
			for ( var i = 0; i < relStack.length; i++ ) {
				var d = relStack[ i ];
				switch ( d ) {
					case ".":
						break;
					case "..":
						if ( absStack.length ) {
							absStack.pop();
						}
						break;
					default:
						absStack.push( d );
						break;
				}
			}
			return "/" + absStack.join( "/" );
		},

		//Returns true if both urls have the same domain.
		isSameDomain: function( absUrl1, absUrl2 ) {
			return path.parseUrl( absUrl1 ).domain === path.parseUrl( absUrl2 ).domain;
		},

		//Returns true for any relative variant.
		isRelativeUrl: function( url ) {
			// All relative Url variants have one thing in common, no protocol.
			return path.parseUrl( url ).protocol === "";
		},

		//Returns true for an absolute url.
		isAbsoluteUrl: function( url ) {
			return path.parseUrl( url ).protocol !== "";
		},

		//Turn the specified realtive URL into an absolute one. This function
		//can handle all relative variants (protocol, site, document, query, fragment).
		makeUrlAbsolute: function( relUrl, absUrl ) {
			if ( !path.isRelativeUrl( relUrl ) ) {
				return relUrl;
			}

			if ( absUrl === undefined ) {
				absUrl = documentBase;
			}

			var relObj = path.parseUrl( relUrl ),
				absObj = path.parseUrl( absUrl ),
				protocol = relObj.protocol || absObj.protocol,
				doubleSlash = relObj.protocol ? relObj.doubleSlash : ( relObj.doubleSlash || absObj.doubleSlash ),
				authority = relObj.authority || absObj.authority,
				hasPath = relObj.pathname !== "",
				pathname = path.makePathAbsolute( relObj.pathname || absObj.filename, absObj.pathname ),
				search = relObj.search || ( !hasPath && absObj.search ) || "",
				hash = relObj.hash;

			return protocol + doubleSlash + authority + pathname + search + hash;
		},

		//Add search (aka query) params to the specified url.
		addSearchParams: function( url, params ) {
			var u = path.parseUrl( url ),
				p = ( typeof params === "object" ) ? $.param( params ) : params,
				s = u.search || "?";
			return u.hrefNoSearch + s + ( s.charAt( s.length - 1 ) !== "?" ? "&" : "" ) + p + ( u.hash || "" );
		},

		convertUrlToDataUrl: function( absUrl ) {
			var u = path.parseUrl( absUrl );
			if ( path.isEmbeddedPage( u ) ) {
				// For embedded pages, remove the dialog hash key as in getFilePath(),
				// otherwise the Data Url won't match the id of the embedded Page.
				return u.hash.split( dialogHashKey )[0].replace( /^#/, "" );
			} else if ( path.isSameDomain( u, documentBase ) ) {
				return u.hrefNoHash.replace( documentBase.domain, "" ).split( dialogHashKey )[0];
			}

			return window.decodeURIComponent(absUrl);
		},

		//get path from current hash, or from a file path
		get: function( newPath ) {
			if ( newPath === undefined ) {
				newPath = path.parseLocation().hash;
			}
			return path.stripHash( newPath ).replace( /[^\/]*\.[^\/*]+$/, '' );
		},

		//return the substring of a filepath before the sub-page key, for making a server request
		getFilePath: function( path ) {
			var splitkey = '&' + $.mobile.subPageUrlKey;
			return path && path.split( splitkey )[0].split( dialogHashKey )[0];
		},

		//set location hash to path
		set: function( path ) {
			location.hash = path;
		},

		//test if a given url (string) is a path
		//NOTE might be exceptionally naive
		isPath: function( url ) {
			return ( /\// ).test( url );
		},

		//return a url path with the window's location protocol/hostname/pathname removed
		clean: function( url ) {
			return url.replace( documentBase.domain, "" );
		},

		//just return the url without an initial #
		stripHash: function( url ) {
			return url.replace( /^#/, "" );
		},

		//remove the preceding hash, any query params, and dialog notations
		cleanHash: function( hash ) {
			return path.stripHash( hash.replace( /\?.*$/, "" ).replace( dialogHashKey, "" ) );
		},

		isHashValid: function( hash ) {
			return ( /^#[^#]+$/ ).test( hash );
		},

		//check whether a url is referencing the same domain, or an external domain or different protocol
		//could be mailto, etc
		isExternal: function( url ) {
			var u = path.parseUrl( url );
			return u.protocol && u.domain !== documentUrl.domain ? true : false;
		},

		hasProtocol: function( url ) {
			return ( /^(:?\w+:)/ ).test( url );
		},

		//check if the specified url refers to the first page in the main application document.
		isFirstPageUrl: function( url ) {
			// We only deal with absolute paths.
			var u = path.parseUrl( path.makeUrlAbsolute( url, documentBase ) ),

				// Does the url have the same path as the document?
				samePath = u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ),

				// Get the first page element.
				fp = $.mobile.firstPage,

				// Get the id of the first page element if it has one.
				fpId = fp && fp[0] ? fp[0].id : undefined;

				// The url refers to the first page if the path matches the document and
				// it either has no hash value, or the hash is exactly equal to the id of the
				// first page element.
				return samePath && ( !u.hash || u.hash === "#" || ( fpId && u.hash.replace( /^#/, "" ) === fpId ) );
		},

		isEmbeddedPage: function( url ) {
			var u = path.parseUrl( url );

			//if the path is absolute, then we need to compare the url against
			//both the documentUrl and the documentBase. The main reason for this
			//is that links embedded within external documents will refer to the
			//application document, whereas links embedded within the application
			//document will be resolved against the document base.
			if ( u.protocol !== "" ) {
				return ( u.hash && ( u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ) ) );
			}
			return ( /^#/ ).test( u.href );
		},


		// Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
		// requests if the document doing the request was loaded via the file:// protocol.
		// This is usually to allow the application to "phone home" and fetch app specific
		// data. We normally let the browser handle external/cross-domain urls, but if the
		// allowCrossDomainPages option is true, we will allow cross-domain http/https
		// requests to go through our page loading logic.
		isPermittedCrossDomainRequest: function( docUrl, reqUrl ) {
			return $.mobile.allowCrossDomainPages &&
				docUrl.protocol === "file:" &&
				reqUrl.search( /^https?:/ ) !== -1;
		}
	};

	//pathFixup
	$.fn.fixupPath = function(tag, urlAttribute, sourceUrl) {
		var container = $(this);
		var targets = container.find(tag+':not(:regex('+urlAttribute+',^(//|http)))');
		targets.each(function(){
			var target = $(this);
			var url = target.attr(urlAttribute);
			url = path.makeUrlAbsolute(url, sourceUrl);
			target.attr(urlAttribute, url);
		});
		return this;
	};

	$.fn.fixupAllPaths = function(resolveSourceUrl){
			$(this).each(function() {
			var container = $(this);
			var sourceUrl = resolveSourceUrl(container);
			//list of tags with urls - http://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
			//html4
			container.fixupPath('img','src', sourceUrl);
			container.fixupPath('a','href', sourceUrl);
			container.fixupPath('link','href', sourceUrl);

			container.fixupPath('applet','codebase', sourceUrl);
			container.fixupPath('area','href', sourceUrl);
			container.fixupPath('base','href', sourceUrl);
			container.fixupPath('blockquote','cite', sourceUrl);
			container.fixupPath('body','background', sourceUrl);
			container.fixupPath('del','cite', sourceUrl);
			container.fixupPath('form','action', sourceUrl);
			container.fixupPath('frame','longdesc', sourceUrl);
			container.fixupPath('frame','src', sourceUrl);
			container.fixupPath('head','profile', sourceUrl);
			container.fixupPath('iframe','longdesc', sourceUrl);
			container.fixupPath('iframe','src', sourceUrl);
			container.fixupPath('img','longdesc', sourceUrl);
			container.fixupPath('img','usemap', sourceUrl);
			container.fixupPath('input','src', sourceUrl);
			container.fixupPath('input','usemap', sourceUrl);
			container.fixupPath('ins','cite', sourceUrl);
			container.fixupPath('object','classid', sourceUrl);
			container.fixupPath('object','codebase', sourceUrl);
			container.fixupPath('object','data', sourceUrl);
			container.fixupPath('object','usemap', sourceUrl);
			container.fixupPath('q','cite', sourceUrl);
			container.fixupPath('script','src', sourceUrl);
			//html5
			container.fixupPath('audio','src', sourceUrl);
			container.fixupPath('button','formaction', sourceUrl);
			container.fixupPath('command','icon', sourceUrl);
			container.fixupPath('embed','src', sourceUrl);
			container.fixupPath('html','manifest', sourceUrl);
			container.fixupPath('input','formaction', sourceUrl);
			container.fixupPath('source','src', sourceUrl);
			container.fixupPath('video','poster', sourceUrl);
			container.fixupPath('video','src', sourceUrl);
			//css
			//background:url()
		});
	
	}

})();