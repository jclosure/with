var realStyle = function(_elem, _style) {
    var computedStyle;
    if ( typeof _elem.currentStyle != 'undefined' ) {
        computedStyle = _elem.currentStyle;
    } else {
        computedStyle = document.defaultView.getComputedStyle(_elem, null);
    }

    return _style ? computedStyle[_style] : computedStyle;
};

var copyComputedStyle = function(src, dest) {
    var s = realStyle(src);
    for ( var i in s ) {
        // Do not use `hasOwnProperty`, nothing will get copied
        if ( typeof i == "string" && i != "cssText" && !/\d/.test(i) ) {
                // The try is for setter only properties
                try {
                        dest.style[i] = s[i];
                        // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
                        // overwritten.  So make sure to reset this property. (hackyhackhack)
                        // Other properties may need similar treatment
                        if ( i == "font" ) {
                                dest.style.fontSize = s.fontSize;
                        }
                } catch (e) {}
        }
    }
};