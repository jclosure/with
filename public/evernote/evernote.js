/*******************************************************************************
 * Copyright 2008, Evernote Corporation. All Rights Reserved.
 * 
 * @author Philip Constantinou
 */

Clip.constants = {
	isIE :(navigator.appVersion.indexOf("MSIE", 0) != -1),
	isSafari :(navigator.appVersion.indexOf("WebKit", 0) != -1),
	defaultClipperURL :"http://www.evernote.com"
};

function Clip(aWindow) {
	this.initClip(aWindow.document.title, aWindow.document.location, aWindow);
	this.fullPage = false;
}

// Declares the content and source of a web clip
Clip.prototype.initClip = function(title, url, window) {
	this.title = title;
	this.url = url;
	this.window = window;
}

/**
 * Captures all the content of the document
 */
Clip.prototype.clipBody = function() {
	if (this.window.document == null
			|| this.window.document.body == null
			|| (this.window.document.getElementsByTagName('frameset').length > 0)) {
		return false;
	}
	debugObj("Getting body text", this);
	this.content = this.DOMtoHTML(this.window.document.body);
	if (typeof this.content != 'string') {
		return false;
	}
	this.fullPage = true;
	return true;
}

Clip.prototype.setClipperURL = function(clipperURL) {
	// Convert post URL to SSL if the source page uses HTTPs and the Evernote
	// server
	// supports HTTPs.

	if (this.url.protocol.indexOf("https") == 0
			&& clipperURL.indexOf("http:") == 0
			&& clipperURL.indexOf(':', 6) == -1) {
		clipperURL = "https:" + clipperURL.substring(5, clipperURL.length);
	}
	this.clipperURL = clipperURL;
}

/**
 * Draw a floating div over the current page
 * 
 * @param clip
 * @param clippingForm
 * @param baseURL
 * @return
 */
Clip.prototype.showClipperPanel = function() {
	var panel;
	panel = this.div("e_clipper");
	panel.style.position = "absolute";
	// panel.style.left = "0px";
	panel.style.zIndex = 100000;
	panel.style.margin = "10px";
	panel.style.top = this.scrollTop(this.window) + "px";
	panel.style.left = this.scrollRight(this.window) + "px";

	var data;
	data = this.div("e_data", panel);
	data.style.position = "absolute";
	data.style.width = "0px";
	data.style.height = "0px";
	data.style.zIndex = 0;
	data.style.margin = "0px";
	data.style.top = "0px";

	var view;
	view = this.div("e_view", panel);
	view.style.backgroundColor = "white";
	view.style.zIndex = 2;
	view.style.width = "500px";
	view.style.height = "355px";
	view.style.border = "solid rgb(180,180,180)";
	view.style.borderWidth = "5px";
	view.style.padding = 5
	view.innerHTML = '<iframe id="e_iframe" '
			+ 'onLoad="p = document.getElementById(\'e_data\'); c = p.style.zIndex; if (c==7) {;p.parentNode.parentNode.removeChild(p.parentNode)} p.style.zIndex = ++c;" name="e_iframe" src="'
			+ this.clipperURL
			+ '/loadingClip.html" scrolling="no" frameborder="0" style="width:498px; height:354px; '
			+ 'border:1px; padding:0px; margin:0px"></iframe>';
	this.window.document.body.appendChild(panel);
	this.window.document.body.appendChild(this.formContainer);
	this.form.submit();
}

Clip.prototype.scrollTop = function() {
	return this
			.filterResults(
					this.window.pageYOffset ? this.window.pageYOffset : 0,
					this.window.document.documentElement ? this.window.document.documentElement.scrollTop
							: 0,
					this.window.document.body ? this.window.document.body.scrollTop
							: 0);
}

Clip.prototype.scrollRight = function() {
	return this
			.filterResults(
					this.window.pageXOffset ? this.window.pageXOffset : 0,
					this.window.document.documentElement ? this.window.document.documentElement.scrollRight
							: 0,
					this.window.document.body ? this.window.document.body.scrollRight
							: 0);
}

Clip.prototype.filterResults = function(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

Clip.prototype.addQuicknote = function() {
	var quicknote = this.makeElement('input', this.form);
	quicknote.name = 'quicknote';
	quicknote.value = true;
	quicknote.type = 'text';
}

Clip.prototype.makeElement = function(elementName, parentElement) {
	var element;
	element = this.window.document.createElement(elementName);
	if (parentElement) {
		parentElement.appendChild(element);
	}
	return element;
}

Clip.prototype.addClippedText = function() {
	var body = this.makeElement('textarea', this.form);
	body.name = 'body';
	body.value = this.content;

	var title = this.makeElement('input', this.form);
	title.name = 'title';
	title.value = this.title;
	title.type = 'text';
}

Clip.prototype.makeForm = function() {
	var form;
	var target = 'e_iframe';
	var div = this.makeElement('div');
	div.style.display = 'none';
	div.id = "evernote_clip_form";
	form = this.makeElement('form', div);

	form.action = this.clipperURL + '/clip.action';
	form.method = 'POST';
	form.target = target || '_top';
	form.enctype = "application/x-www-form-urlencoded";
	form.acceptCharset = "UTF-8";
	form.name = "en_clip_form";

	var url = this.makeElement('input', form);
	url.name = 'url';
	url.value = this.url;
	url.type = 'text';
	
	var format = this.makeElement('input', form);
	format.name = 'format';
	format.value = 'microclip';
	format.type = 'text';

	this.form = form;
	this.formContainer = div;
}

Clip.prototype.div = function(id, parentElement) {
	var d = this.makeElement("div", parentElement);
	d.id = id;
	d.style.border = "0";
	d.style.margin = "0";
	d.style.padding = "0";
	d.style.position = "relative";

	return d;
}

Clip.prototype.HTMLEncode = function(str) {
	var result = "";
	for ( var i = 0; i < str.length; i++) {
		var charcode = str.charCodeAt(i);
		var aChar = str[i];
		if (charcode > 0x7f) {
			result += "&#" + charcode + ";";
		} else if (aChar == '>') {
			result += "&gt;";
		} else if (aChar == '<') {
			result += "&lt;";
		} else if (aChar == '&') {
			result += "&amp;";
		} else {
			result += str[i];
		}
	}
	return result;
}

function debugObj(label, obj) {
	return ;
	var str = "";
	for ( var p in obj) {
		str += (p + ":" + obj[p] + "\n\n");
	}
	alert(label + "*******\n" + str);
}

/**
 * Get selected range
 * 
 * @param selectionObject
 *            a representation of the text selection
 * @return a range object representing the selected text
 */
Clip.prototype.getRangeObject = function(selectionObject) {
	if (selectionObject.getRangeAt) {
		if (selectionObject.rangeCount == 0)
			return null;
		var r = selectionObject.getRangeAt(0);
		// Test if selection has nothing in it.
		if (r.startContainer == r.endContainer && r.startOffset == r.endOffset) {
			return null;
		}
		debugObj("Selection", r);
		return r;
	} else {
		var range = this.window.document.createRange();
		range
				.setStart(selectionObject.anchorNode,
						selectionObject.anchorOffset);
		range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
		return range;
	}
}

Clip.prototype.clipSelection = function() {
	var result = this.clipSelectionFromWindow(this.window);
	debugObj("Clip selection result", result);
	return result;
}

Clip.prototype.clipSelectionFromWindow = function(aWindow) {
	if (aWindow == null || aWindow.document == null
			|| aWindow.document.body == null) {
		return false;
	}
	var userSelection = null;
	var range = null;
	// Obtain user selection
	try {
		if (Clip.constants.isIE == false && aWindow.getSelection) {
			userSelection = aWindow.getSelection();
			if (userSelection  && userSelection.type != 'text') {
				debugObj("Not text selection", userSelection);
			}
		} else if (aWindow.document.selection) { // should come last; Opera!
			if (aWindow.document.selection.type != 'text') {
				userSelection = null;
			}
			if (Clip.constants.isIE) {
				userSelection = aWindow.document.selection.createRange();
			} else {
				userSelection = document.selection.createRange();
			}
		}
	} catch (e) {
		debugObj("Error while getting selection", e);
		return false;
	}

	// Test for textRange (ie) or range (w3c) support
	if (userSelection != null) {
		if (Clip.constants.isIE) {
			if (userSelection.htmlText.length > 0) {
				this.content = userSelection.htmlText;
				this.window = aWindow;
				return true;
			}
		} else {
			range = this.getRangeObject(userSelection);
			if (range != null) {
				this.content = this.DOMtoHTML(range.cloneContents());
				this.window = aWindow;
				return true;
			}
		}
		// Recurse
		for ( var i = 0; i < aWindow.frames.length; i++) {
			var aFrame = aWindow.frames[i];
			if (aFrame != null) {
				try {
					var success = this.clipSelectionFromWindow(aFrame);
					if (success) {
						return content;
					}
				} catch (e) {
					;
				}
			}
		}
	}
	return false;
}

Clip.prototype.DOMtoHTML = function(n) {
	if (Clip.constants.isIE) {
		return n.innerHTML;
	} else {
		return this.serializeDOMNode(n);
	}
}

/**
 * Recurses through a DOM and returns a text stream
 */
Clip.prototype.serializeDOMNode = function(n) {
	var v = "";
	if (n == null)
		return v;
	var hasTag = (n.nodeType == 1) && (n.nodeName.indexOf('#') != 0);
	var name = "";
	if (n.nodeType == 3) { // Text block
		v += this.HTMLEncode(n.nodeValue);
	} else if (n.nodeType == 1) { // Element tag
		if (hasTag) {
			name = n.nodeName;
			v += '<' + name;
			var attrs = n.attributes;
			if (attrs != null) {
				for ( var i = 0; i < attrs.length; i++) {
					if (attrs[i].nodeValue != null
							&& attrs[i].nodeValue.length > 0)
						v += ' ' + attrs[i].nodeName + '=' + '"'
								+ attrs[i].nodeValue + '" ';
				}
			}
			v += '>';

		}
	}
	// Recurs through child notes
	if (n.hasChildNodes()) {
		var children = n.childNodes;
		for ( var j = 0; j < children.length; j++) {
			try {
				var child = children[j];
				if (child != null && child.nodeType > 0
						&& child.nodeName != 'SCRIPT'
						&& child.nodeName != 'IFRAME') {
					v += this.serializeDOMNode(child);
				}
			} catch (e) {
				;
			}
		}
	}
	if (hasTag) {
		v += '</' + name + '>';
	}
	return v;
}

/**
 * Sends the clip to the provide service's clipping URL
 * 
 * @param clipURL
 */
function EN_clip(clipURL) {
	var clipManager = new ClipManager(clipURL);
	if (clipManager.clipPage() == false) {
		alert('Sorry, Evernote cannot clip this entire page. Please select the portion you wish to clip.');
	} else {
		clipManager.submit();
	}
	// Check to see if the page has frames and no main content

	// if (clip.url.protocol.indexOf("http") != 0) {
	// alert('Sorry, Evernote can only clip web pages.');
	// return;
	// }

}

/*******************************************************************************
 * ClipManager
 */

function ClipManager(clipURL) {
	var aWindow = null;
	try {
		aWindow = (window_clipped_to_en) ? window_clipped_to_en : window;
	} catch (e) {
		aWindow = window;
	}
	// Replace beta clipper with real site
	if (clipURL == 'http://preview.evernote.com') {
		clipURL = Clip.constants.defaultClipperURL;
	}
	// Test to see if there's selected text
	this.clip = new Clip(aWindow);
	this.clip.setClipperURL(clipURL);
}

ClipManager.prototype.quicknote = function() {
	this.clip.makeForm();
	this.clip.addQuicknote();
}

ClipManager.prototype.clipPage = function() {
	if (this.clip.clipSelection()) {
		debugObj("Successful clip of selection", this.clip);
	} else {
		try {
			if (this.clip.clipBody() ==  false) {
				alert('Sorry, Evernote cannot clip this entire page. Please select the portion you wish to clip.');
				return false;
			}
		} catch (e) {
			// Can't construct a clip -- usually because the body is a frame
			alert('Sorry, Evernote cannot clip this entire page. Please select the portion you wish to clip.');
			return false;
		}
	}
	debugObj("Making form");
	this.clip.makeForm();
	debugObj("Adding text");
	this.clip.addClippedText();
	if (this.clip.fullPage) {
		debugObj("Adding quicknote.");
		this.clip.addQuicknote();
	}
	return true;
}

ClipManager.prototype.clipSelection = function() {
	var isSelection = this.clip.clipSelection();
	this.clip.makeForm();
	if (isSelection) {
		this.clip.addClippedText();
	} else {
		this.clip.addQuicknote();
	}
	return true;
}


ClipManager.prototype.submit = function() {
	this.clip.showClipperPanel();
}

/*******************************************************************************
 * Start clipper
 */
try {
	EN_clip(EN_CLIP_HOST);
} catch (e) {
	debugObj("Clipping error", e);
}