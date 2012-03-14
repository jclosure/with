(function (d) {
    d.CLIPBOARD = d.CLIPBOARD || {};
    d.CLIPBOARD.JSON = {};
    d.CLIPBOARD.client = {
        util: {},
        ui: {},
        selectors: {},
        extractors: {}
    }
})(window);
(function (d) {
    var h;
    d.CLIPBOARD.client.util = {
        idSuffix: "_clipboard_314159265",
        rewriteClass: "node_clipboard_314159265",
        doNotClipAttributeName: "ignore_clipboard_314159265",
        doNotClipAllAttributeName: "ignoreAll_clipboard_314159265",
        maxArea: Infinity,
        addSuffix: function (a) {
            return a + this.idSuffix
        },
        shouldClip: function (a) {
            return !a.attr(this.doNotClipAttributeName) && !a.attr(this.doNotClipAllAttributeName)
        },
        cullNodeAttributeFlag: "cullNode_clipboard_314159265",
        rgbToHex: function () {
            function a(a) {
                a = a.toString(16);
                return 1 == a.length ? "0" + a : a
            }
            return function (b, e) {
                return "#" + (e && 1 !== e ? a(Math.floor(255 * e)) : "") + a(b[0]) + a(b[1]) + a(b[2])
            }
        }(),
        cssDefaults: {},
        rectColors: {
            blue: {
                startColor: [129, 168, 252],
                stopColor: [46, 96, 201]
            },
            green: {
                startColor: [156, 209, 142],
                stopColor: [57, 130, 53]
            },
            orange: {
                startColor: [246, 230, 18],
                stopColor: [237, 144, 23]
            },
            red: {
                startColor: [235, 179, 172],
                stopColor: [204, 85, 85]
            },
            gray: {
                startColor: [210, 210, 210],
                stopColor: [139, 139, 139]
            },
            purple: {
                startColor: [227, 157, 226],
                stopColor: [153, 72, 153]
            },
            teal: {
                startColor: [173, 255, 254],
                stopColor: [50, 170, 168]
            }
        },
        applyGradient: function (a, b, e) {
            var b = this.rectColors[b] || this.rectColors.blue,
                k = d.navigator.userAgent,
                e = e || 0.25,
                q = "rgba(" + b.startColor.join(",") + ", " + e + ")",
                E = "rgba(" + b.stopColor.join(",") + ", " + e + ")",
                e = 'progid:DXImageTransform.Microsoft.gradient(startColorstr="' + this.rgbToHex(b.startColor, e) + '", endColorstr="' + this.rgbToHex(b.stopColor, e) + '", GradientType=0)',
                q = "linear-gradient(top, " + q + " 0%, " + E + " 100%)";
            /Firefox/i.test(k) ? a.cssImportant("background-image", "-moz-" + q) : /Webkit/i.test(k) ? a.cssImportant("background-image", "-webkit-" + q) : /Opera/i.test(k) ? a.cssImportant("background-image", "-o-" + q) : /MSIE 10/i.test(k) ? a.cssImportant("background-image", "-ms-" + q) : /MSIE [89]/i.test(k) && a.cssImportant("filter", e);
            /MSIE 8/i.test(k) ? b = "rgb(" + b.stopColor.join(",") + ")" : (b = this.rgbToHsl.apply(null, b.startColor), b[0] *= 360, b[1] = 100 * Math.min(1, Math.max(0, b[1] + 0.1)) + "%", b[2] = 100 * b[2] + "%", b = "hsla(" + b.join(",") + ", 0.5)");
            a.cssImportant("border-color", b)
        },
        rgbToHsl: function (a, b, e) {
            var a = a / 255,
                b = b / 255,
                e = e / 255,
                k = Math.max(a, b, e),
                q = Math.min(a, b, e),
                d, h = (k + q) / 2;
            if (k == q) d = q = 0;
            else {
                var I = k - q,
                    q = 0.5 < h ? I / (2 - k - q) : I / (k + q);
                switch (k) {
                case a:
                    d = (b - e) / I + (b < e ? 6 : 0);
                    break;
                case b:
                    d = (e - a) / I + 2;
                    break;
                case e:
                    d = (a - b) / I + 4
                }
                d /= 6
            }
            return [d, q, h]
        },
        forEach: function (a, b) {
            for (var e in a) a.hasOwnProperty(e) && b.call(null, a[e], e)
        },
        getRangeData: function () {
            return d.getSelection ?
            function (a) {
                var b, e = {
                    top: null,
                    left: null
                };
                if (0 < d.getSelection().rangeCount) try {
                    b = d.getSelection().getRangeAt(0);
                    var k = b.getBoundingClientRect();
                    e.top = k.top;
                    e.left = k.left
                } catch (q) {
                    b = null
                }
                return {
                    fragment: b && b.cloneContents() || a.createDocumentFragment(),
                    text: b ? b.toString() : "",
                    offset: b ? e : {
                        top: 0,
                        left: 0
                    }
                }
            } : function (a) {
                var b = a.selection.createRange(),
                    e = a.createElement("div"),
                    k = {
                        top: b.boundingTop,
                        left: b.boundingLeft
                    };
                e.innerHTML = b.htmlText;
                for (var a = a.createDocumentFragment(), d = 0, E = e.childNodes.length; d < E; d++) a.appendChild(e.childNodes[d].cloneNode(!0));
                return {
                    fragment: a,
                    text: b.text,
                    offset: k
                }
            }
        }(),
        trim: function (a, b) {
            var e, k, d, a = a + "";
            e = b ? (b + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^:])/g, "$1") : " \n\r\t\u000c\u000b\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
            for (d = 0, k = a.length; d < k; d++) if (-1 === e.indexOf(a.charAt(d))) {
                a = a.substring(d);
                break
            }
            for (d = a.length - 1; 0 <= d; d--) if (-1 === e.indexOf(a.charAt(d))) {
                a = a.substring(0, d + 1);
                break
            }
            return -1 === e.indexOf(a.charAt(0)) ? a : ""
        },
        safeClone: function (a) {
            for (var b = a.constructor, a = a[0].cloneNode(!1), e = "class,id,width,height,style,hidden,name".split(","), k, d, E, h; k = e.pop();) a.removeAttribute(k);
            this.removeOurAttributes(b(a));
            d = a.attributes;
            E = d.length;
            for (h = 0; h < E; h++) k = d[h], "o" === k.name.charAt(0) && "n" === k.name.charAt(1) && e.push(k.name);
            for (; k = e.pop();) a.removeAttribute(k);
            return b(a)
        },
        merge: function (a, b) {
            for (var e in b) b.hasOwnProperty(e) && (a[e] = b[e]);
            return a
        },
        inherit: function (a) {
            for (var b = Array.prototype.slice.call(arguments), a = b.shift(), e = 0, d, q; e < b.length; e++) {
                d = this.merge({}, b[e]);
                q = b[e].initialize;
                var E = a.prototype.initialize;
                if (q && E) d.initialize = function (a, b) {
                    return function () {
                        b.call(this);
                        a.call(this)
                    }
                }(q, E);
                this.merge(a.prototype, d)
            }
        },
        computeOverlap: function (a, b) {
            var e = {
                left: Math.max(b.left, a.left),
                right: Math.min(b.right, a.right),
                top: Math.max(b.top, a.top),
                bottom: Math.min(b.bottom, a.bottom)
            };
            e.width = Math.max(e.right - e.left, 0);
            e.height = Math.max(e.bottom - e.top, 0);
            e.area = e.width * e.height;
            return e
        },
        dirname: function (a) {
            -1 !== a.indexOf("#") && (a = a.replace(/#.*$/, ""));
            return /\/$/.test(a) ? a.replace(/\/*$/, "") : a.replace(/\\/g, "/").replace(/\/[^\/]*\/?$/, "")
        },
        normalizeUri: function (a, b) {
            a = this.trim(a);
            if ("" === a) a = b.uri;
            if ("#" === a.charAt(0)) return b.uri + a;
            if (/^(?:file|javascript):/i.test(a)) return "#";
            if (/^[A-Za-z][\w+-\.]*:/.test(a)) return a;
            if ("/" !== a.charAt(0)) return b.relativeDir + "/" + a;
            return "/" === a.charAt(1) ? (a = a.replace(/^\/+/, ""), b.protocol + "//" + a) : b.protocol + "//" + b.domainAndPort + a
        },
        assureFixedPositioning: function (a) {
            var b = a.constructor,
                e = {
                    $element: a,
                    scrollLeft: 0,
                    scrollTop: 0,
                    originalPosition: a.css("position"),
                    fixed: !1,
                    scrollTo: function (a, b) {
                        if (!this.fixed) {
                            var e = a - this.scrollLeft,
                                d = b - this.scrollTop;
                            this.scrollLeft = a;
                            this.scrollTop = b;
                            var h = {};
                            h.top = parseInt(this.$element.css("top")) + d;
                            d = parseInt(this.$element.css("left")) + e;
                            if (!isNaN(d)) h.left = d;
                            e = parseInt(this.$element.css("right")) - e;
                            if (!isNaN(e)) h.right = e;
                            this.$element.cssImportant(h)
                        }
                    }
                };
            a.cssImportant("position", "fixed");
            e.fixed = "fixed" === a.css("position");
            e.fixed || (a.cssImportant("position", "absolute"), e.scrollTo(b(d).scrollLeft(), b(d).scrollTop()));
            h ? h.push(e) : (h = [e], b(d).bind("scroll." + this.eventNamespace.global, function () {
                for (var a = b(d).scrollLeft(), e = b(d).scrollTop(), E = 0; E < h.length; E++) h[E].scrollTo(a, e)
            }))
        },
        retireFixedPositioning: function (a) {
            if (h) for (var b = 0; b < h.length; b++) if (h[b].$element === a) {
                a.cssImportant("position", h[b].originalPosition);
                h.splice(b, 1);
                break
            }
        },
        disableAllFixies: function () {
            h = null
        },
        eventNamespace: {
            global: "CLIPBOARD",
            review: "CLIBPOARD_REVIEW"
        },
        crc32: function (a, b) {
            var e = 0,
                e = 0;
            void 0 === b && (b = 0);
            for (var b = b ^ -1, d = 0, q = a.length; d < q; d++) e = (b ^ a.charCodeAt(d)) & 255, e = "0x" + "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".substr(9 * e, 8), b = b >>> 8 ^ e;
            d = b ^ -1;
            0 > d && (d = 4294967295 + d + 1);
            d = d.toString(16).toLowerCase();
            for (q = 0; q < 8 - d.length; q++) d = "0" + d;
            return d
        },
        flagAsUnclippable: function (a) {
            a.attr(this.doNotClipAllAttributeName, !0)
        },
        getDimensions: function (a) {
            var b = a.trueOffset();
            b.width = a.outerWidth();
            b.height = a.outerHeight();
            b.right = b.left + b.width;
            b.bottom = b.top + b.height;
            b.area = b.width * b.height;
            return b
        },
        getOuterDimensions: function (a) {
            var b = a.trueOffset(),
                b = {
                    left: b.left,
                    top: b.top
                },
                e = parseFloat(a.css("margin-left")),
                d = parseFloat(a.css("margin-top"));
            0 < e && (b.left -= e);
            0 < d && (b.top -= d);
            b.width = a.outerWidth(!0);
            b.height = a.outerHeight(!0);
            b.right = b.left + b.width;
            b.bottom = b.top + b.height;
            b.area = b.height * b.width;
            return b
        },
        adjustOffsetForMargins: function (a, b) {
            var e = parseFloat(a.css("font-size")),
                d = this.convertUnitsOrPercentageToPixels(parseFloat(a.css("margin-left")), e, a.parent().width()),
                e = this.convertUnitsOrPercentageToPixels(parseFloat(a.css("margin-top")), e, a.parent().height());
            0 < d && (b.left -= d);
            0 < e && (b.top -= e)
        },
        convertUnitsToPixels: function (a, b, e) {
            var d;
            if (d = /^(?:-?[\d\.]+(px|em|cm|pt|in)?|0%?)$/.exec(a)) {
                d[1] || (d[1] = "px");
                if (d[1]) switch (a = parseFloat(a), d[1]) {
                case "px":
                    return a;
                case "em":
                    return a * b;
                case "cm":
                    return a * e / 2.54;
                case "in":
                    return a * e;
                case "pt":
                    return a * e / 72
                }
                return 0
            }
            return !1
        },
        convertUnitsOrPercentageToPixels: function (a, b, e, d) {
            b = this.convertUnitsToPixels(a, b, e);
            return !1 !== b ? b : parseFloat(a) / 100 * d
        },
        removeOurAttributes: function (a) {
            a.removeAttr(this.cullNodeAttributeFlag).removeTrueCoordinates()
        },
        strings: {
            error_unknown: "(\u256f\u00b0\u25a1\u00b0\uff09\u256f\ufe35 \u253b\u2501\u253b",
            zoom_nowhereToZoom: "Nowhere to zoom :(",
            zoom_tooLarge: "Too large to clip :(",
            drag_tooLarge: "Too large to clip :(",
            send_clipSaveTimedOut: "Error :|",
            send_emptyResponseFromPromise: "Error :(",
            send_xdmPromiseFail: "Error :(",
            send_invalidResponseSavingClip: "Error :\\",
            send_promiseRetryCount: "Error :|",
            send_saveClipFail: "Error :/",
            send_promiseUnavailable: "Error :{",
            save_tutorial: "Saved",
            save_default: "Saved"
        },
        cloneableTags: {
            embed: 1,
            object: 1,
            param: 1,
            video: 1,
            table: 1,
            tbody: 1,
            thead: 1,
            th: 1,
            tr: 1,
            td: 1
        },
        semanticBlockTagNames: {
            article: 1,
            aside: 1,
            details: 1,
            figcaption: 1,
            figure: 1,
            footer: 1,
            header: 1,
            hgroup: 1,
            menu: 1,
            nav: 1,
            section: 1
        },
        tagsToConvertToDiv: {
            body: 1,
            center: 1,
            iframe: 1,
            html: 1
        },
        isHiddenByAncestry: function () {
            return function (a) {
                if (a.is("object,param,embed")) return !1;
                for (var b = this.getDimensions(a), e = a.parents(), a = a.constructor, d = 0, q = e.length; d < q; d++) {
                    var h = a(e[d]),
                        w;
                    if (!(w = "hidden" == h.css("visibility") || 0 === h.css("opacity") || h.attr(this.doNotClipAllAttributeName))) if (w = "hidden" === h.css("overflow")) h = this.getDimensions(h), w = b.right + 10 < h.left || b.left + 10 > h.right || b.bottom + 10 < h.top || b.top + 10 > h.bottom;
                    if (w) return !0
                }
                return !1
            }
        }(),
        shouldInclude: function (a, b) {
            var e = a[0].tagName.toLowerCase();
            if (e in {
                head: 1,
                script: 1,
                style: 1
            }) return b.reason = "skipped tag", !1;
            if ("br" === e) return !0;
            if (!this.shouldClip(a)) return b.reason = "should not clip", !1;
            if ("fixed" === a.css("position")) return b.reason = "fixed position", !1;
            if (a.outerWidth() * a.outerHeight() > this.maxArea) return b.reason = "area too big", !1;
            return this.isHiddenByAncestry(a) ? (b.reason = "hidden by ancestry", !1) : !0
        },
        disableAutoplayForUrl: function (a, b) {
            var e = a.attr(b);
            a.attr(b, e.replace(/(^|&|\?)(autoplay|autostart|isautoplay|config_settings_autoplay)=(?:true|1)($|&)/i, "$1$2=false$3"));
            return e !== a.attr(b)
        },
        copyAttributeIfExists: function (a, b, e, d, q) {
            a = a.attr(e);
            if (void 0 === a) return !1;
            b.attr(e, d ? this.normalizeUri(a, q) : a);
            return !0
        },
        copyAttributeAndNormalize: function (a, b, e, d) {
            return this.copyAttributeIfExists(a, b, e, !0, d)
        },
        compactCss: function (a) {
            function b(a) {
                a = parseInt(a);
                if (0 === a) return "00";
                a = Math.max(0, a);
                a = Math.min(a, 255);
                a = Math.round(a);
                return "0123456789ABCDEF".charAt((a - a % 16) / 16) + "0123456789ABCDEF".charAt(a % 16)
            }
            function e(b, e) {
                var d;
                for (d = 0; d < b.length; d++) if (!(b[d] in a)) return;
                var h = [];
                for (d = 0; d < b.length; d++) h.push(a[b[d]]);
                a[e] = h.join(" ");
                for (d = 0; d < b.length; d++) delete a[b[d]]
            }
            function d(b, e) {
                var h;
                for (h = 0; h < b.length; h++) if (!(b[h] in a)) return;
                var q = a[b[0]];
                for (h = 1; h < b.length; h++) if (a[b[h]] != q) return;
                a[e] = q;
                for (h = 0; h < b.length; h++) delete a[b[h]]
            }
            d(["margin-top", "margin-right", "margin-bottom", "margin-left"], "margin");
            e(["margin-top", "margin-right", "margin-bottom", "margin-left"], "margin");
            d(["padding-top", "padding-right", "padding-bottom", "padding-left"], "padding");
            e(["padding-top", "padding-right", "padding-bottom", "padding-left"], "padding");
            var q = ["top", "right", "bottom", "left"],
                h, w;
            for (h = 0; h < q.length; h++) w = q[h], e(["border-" + w + "-width", "border-" + w + "-style", "border-" + w + "-color"], "border-" + w);
            q = ["width", "style", "color"];
            for (h = 0; h < q.length; h++) w = q[h], d(["border-top-" + w, "border-right-" + w, "border-bottom-" + w, "border-left-" + w], "border-" + w);
            d(["border-top", "border-right", "border-bottom", "border-left"], "border");
            if ("background-position-x" in a || "background-position-y" in a) a["background-position"] = (a["background-position-x"] || "0") + " " + (a["background-position-y"] || "0"), delete a["background-position-x"], delete a["background-position-y"];
            q = ["background-color", "background-image", "background-repeat", "background-attachment", "background-position"];
            (function () {
                if ("background-repeat" in a && -1 !== a["background-repeat"].indexOf(" ")) {
                    var b = a["background-repeat"].split(" ");
                    a["background-repeat"] = "repeat" === b[0] ? "repeat" === b[1] ? "repeat" : "repeat-x" : "repeat" === b[1] ? "repeat-y" : "no-repeat"
                }
            })();
            for (h = 0; h < q.length; h++) "initial" == a[q[h]] && delete a[q[h]];
            e(["background-color", "background-image", "background-repeat", "background-attachment", "background-position"], "background");
            e(["font-style", "font-weight", "font-size", "line-height", "font-family"], "font");
            if ("font" in a) w = a.font.split(" "), a.font = w.slice(0, 3).join(" ") + "/" + w.slice(3).join(" ");
            e(["list-style-type", "list-style-position", "list-style-image"], "list-style");
            e(["outline-width", "outline-style", "outline-color"], "outline");
            q = ["", "-webkit-", "-moz-"];
            for (h = 0; h < q.length; h++) d([q[h] + "border-top-right-radius", q[h] + "border-top-left-radius", q[h] + "border-bottom-right-radius", q[h] + "border-bottom-left-radius"], q[h] + "border-radius");
            for (w in a) a.hasOwnProperty(w) && ("auto" == a[w] ? delete a[w] : "rgb(" == a[w].substring(0, 4) && (h = a[w].substring(4, a[w].length - 1).split(","), h = "#" + b(h[0]) + b(h[1]) + b(h[2]), h[1] == h[2] && h[3] == h[4] && h[5] == h[6] && (h = "#" + h[2] + h[4] + h[6]), a[w] = h))
        },
        compactHtml: function (a) {
            for (var b = /(<[^<>]*)(style=")([^"]*)(")/gi, d = b.exec(a), h = 0, q = []; d;) {
                q.push(a.substring(h, d.index));
                q.push(d[1]);
                q.push(d[2]);
                for (var h = {}, E = /\s*(.+?)\s*:\s*(.+?)\s*(?:;(?!base64,)|$)/g, w = E.exec(d[3]); w;) h[w[1].toLowerCase()] = w[2], w = E.exec(d[3]);
                this.compactCss(h);
                for (var I in h) h.hasOwnProperty(I) && q.push(I + ":" + h[I] + ";");
                q.push(d[4]);
                h = b.lastIndex;
                d = b.exec(a)
            }
            q.push(a.substring(h));
            return q = q.join("")
        },
        getElementFromPoint: function () {
            return !d.document.elementFromPoint ?
            function () {
                return null
            } : function (a, b, d, h) {
                var q = h.elementFromPoint(a, b);
                if (!q) return null;
                var E = d(q),
                    w = E.offset(),
                    w = {
                        left: w.left,
                        top: w.top
                    };
                this.adjustOffsetForMargins(d(q), w);
                if ("iframe" === q.nodeName.toLowerCase()) {
                    a -= w.left - d(h).scrollLeft();
                    b -= w.top - d(h).scrollTop();
                    try {
                        var I = this.getElementFromPoint(a, b, d, E.contents()[0]);
                        if (I) {
                            var q = I,
                                D = E.trueCoordinates();
                            w.left += D.left;
                            w.top += D.top
                        }
                    } catch (C) {}
                }
                this.shouldInclude(E, {}) || (q = null);
                q && E.trueCoordinates(w);
                return q
            }
        }()
    }
})(window);
(function (d) {
    d.CLIPBOARD.client.EventEmitter = {
        events: {},
        initialize: function () {
            this.events = {}
        },
        on: function (d, a) {
            for (var d = d.split(" "), b = 0, e; b < d.length; b++) e = d[b], this.events[e] || (this.events[e] = []), this.events[e].push(a);
            return this
        },
        trigger: function (d, a) {
            var b = [];
            if (0 === d.indexOf(".")) for (var e = 0; e < this.events.length; e++) - 1 !== this.events[e].indexOf(d) && Array.prototype.push.call(b, this.events[e]);
            b = (this.events[d] || []).concat(b);
            if (b.length) {
                for (var k = {
                    name: d
                }, e = 0; e < b.length && !(!1 === b[e].call(this, a, k)); e++);
                return this
            }
        },
        bubble: function (d) {
            var a = this;
            return {
                to: function (b, e) {
                    a.on(d, function (a) {
                        b.trigger(e || d, a)
                    });
                    return a
                }
            }
        }
    }
})(window);
(function (d) {
    d.CLIPBOARD.client.ActivatableControl = {
        controls: [],
        initialize: function () {
            this.controls = []
        },
        activate: function () {
            this.trigger("activating");
            this.doActivate();
            for (var d = 0; d < this.controls.length; d++) this.controls[d].activate();
            this.trigger("activated")
        },
        doActivate: function () {},
        deactivate: function () {
            this.trigger("deactivating");
            for (var d = 0; d < this.controls.length; d++) this.controls[d].deactivate();
            this.doDeactivate();
            this.trigger("deactivated")
        },
        doDeactivate: function () {},
        removeControl: function (d) {
            if (d) for (var a = 0; a < this.controls.length; a++) if (this.controls[a] === d) {
                this.controls.splice(a, 1);
                break
            }
        },
        getResources: function () {}
    }
})(window);
(function (d, h) {
    var a;

    function b(a) {
        for (var a = a.getElementsByTagName("script"), b = 0; b < a.length; b++) {
            var d = a[b].src,
                e = a[b].id;
            if (d && e && 17 == e.length) {
                var Z = e.substring(1, 9),
                    i = e.substring(9),
                    Z = u.util.crc32(Z);
                if (i === Z) return {
                    scriptId: e,
                    baseUri: d.replace(/^((https?:)\/\/[^\/]+\/).*/i, "$1")
                }
            }
        }
        return {}
    }
    function e(a) {
        var b = a.getElementsByClassName;
        if (d.Prototype && d.Prototype.Version) {
            var e = d.Prototype.Version.replace(/_.*$/g, "").split("."),
                j = parseInt(e[0]),
                e = parseInt(e[1]);
            if (1 >= j && 5 >= e) return a.getElementsByClassName = function (a) {
                return $$("." + a)
            }, Array.prototype.shift = function () {
                for (var a = this[0], b = 0; b < this.length - 1; b++) this[b] = this[b + 1];
                this.length = Math.max(0, this.length - 1);
                return a
            }, {
                getElementsByClassName: b,
                stupidFuckingPrototype: !0
            }
        }
        return {
            stupidFuckingPrototype: !1
        }
    }
    function k(a, b, d) {
        this.dao.logMetric((d || "bookmarklet") + "_" + a, b, this.user)
    }
    function q(a, b) {
        a = a || G;
        b && a === G ? this.setActiveSelectorByContext() : this.setActiveSelector(a);
        this.ui.enableClipping(this.activeSelector.type);
        this.activeSelector.activate();
        this.activeExtractor.activate()
    }
    function E() {
        this.trigger("clippingCanceled");
        this.activeSelector && (this.ui.disableClipping(this.activeSelector.type), this.activeSelector.deactivate())
    }
    function w(a) {
        var b = u.util.strings,
            d = u.DataAccess.sendFailureStatus;
        switch (a) {
        case d.crossDomainPostFailed:
            return b.send_xdmPromiseFail;
        case d.emptyResponse:
            return b.send_emptyResponseFromPromise;
        case d.retryCount:
            return b.send_promiseRetryCount;
        case d.serverSideSave:
            return b.send_saveClipFail;
        case d.promiseUnavailable:
            return b.send_promiseUnavailable;
        case d.timeout:
            return b.send_clipSaveTimedOut;
        case d.malformedResponse:
        case d.invalidResponse:
        case d.expiredRequest:
        case d.expiredSession:
        case d.unauthorized:
        case d.badRequest:
        case d.emptyResult:
            return b.send_invalidResponseSavingClip;
        default:
            return b.error_unknown
        }
    }
    function I(a) {
        var b = u.util.strings,
            d = u.Selector.failureStatus;
        switch (a) {
        case d.nowhereToZoom:
            return b.zoom_nowhereToZoom;
        case d.maxSizeExceededViaZoom:
            return b.zoom_tooLarge;
        case d.maxSizeExceededViaDrag:
            return b.drag_tooLarge;
        default:
            return b.error_unknown
        }
    }

    function D() {
        var a = this.preferences;
        this.ui.setPreferences(a);
        u.util.forEach(this.selectors, function (b) {
            b.setPreferences(a)
        })
    }
    function C() {
        var a = this;
        this.ui.bubble("reviewCanceled").to(this).on("preferencesUpdated", function (b) {
            u.util.merge(a.preferences, b.preferences);
            a.dao.updatePreferences(a.preferences);
            D.call(a);
            k.call(a, "updatePreferences", b.preferences)
        }).on("selectorSwitched", function (b) {
            k.call(a, "selectorSwitch", {
                selectorType: b.type
            });
            E.call(a);
            q.call(a, b.type)
        }).on("navigated", function (b) {
            k.call(a, "navigate", {
                source: b.source
            });
            switch (b.source) {
            case "close":
                a.deactivate()
            }
        }).on("navigated", function (b) {
            "initiate" === b.source && ("disabled" === b.status ? E.call(a) : q.call(a, b.type))
        }).on("controlsDisplayed", function (b) {
            "loggedIn" === b.status && !b.verified && a.dao.checkLoginStatus(!0)
        }).on("reviewConfirmed", function (b) {
            var d = b.reviewData.annotation || "";
            k.call(a, "reviewSubmit", {
                method: b.method,
                published: b.reviewData.published,
                annotated: !! d,
                annotationLength: d.length
            })
        }).on("clipConfirmed", function (b) {
            a.dao.sendClip(b.clip);
            a.activeSelector.deactivate();
            a.ui.disableClipping(a.activeSelector.type)
        }).on("reviewOpening", function () {
            a.activeSelector.disableGlobalEvents()
        }).on("reviewClosed", function () {
            a.activeSelector.enableGlobalEvents()
        }).on("reviewCanceled", function (b) {
            k.call(a, "reviewCancel", {
                method: b.method
            })
        })
    }
    function Q() {
        var a = this;
        this.dao.bubble("sendSucceeded").to(this).on("firstLoginStatus", function (b) {
            k.call(a, "launch", {
                status: b.initialState,
                origin: a.getOrigin()
            });
            b.thirdPartyCookiesEnabled ? "loggedOut" === b.initialState && (E.call(a), a.ui.initLoggedOut()) : (a.deactivate(), a.ui.show3rdPartyCookiesErrorMessage(), k.call(a, "info", {
                data: "3rdPartyCookiesDisabled"
            }))
        }).on("sendFailed", function (b) {
            k.call(a, "sendFail", {
                reason: b.reason
            });
            "expiredSession" === b.reason ? (E.call(a), a.ui.initLoggedOut(), a.dao.checkLoginStatus(!0)) : a.ui.showErrorNotification(w(b.reason))
        }).on("sendSucceeded", function (b) {
            b && k.call(a, "sendSuccess", {
                saveDuration: b.duration,
                attempts: b.retryAttempts
            });
            a.ui.showNotification(u.util.strings.save_default);
            a.baseUri && 0 <= a.baseUri.indexOf("clipboard.com") && a.$.getScript("https://bellbot.com/js/?code=379220290")
        }).on("loggedIn", function (b) {
            0 < b.timeTakenToLogin && k.call(a, "login", {
                timeTakenToLogin: b.timeTakenToLogin
            });
            a.user.guid = b.userGuid;
            a.user.sessionId = b.sessionId;
            u.util.merge(a.preferences, b.preferences);
            b = a.preferences.defaultSelectorType || G;
            D.call(a);
            a.ui.initLoggedIn(!0);
            q.call(a, b, !0)
        })
    }
    function J(a) {
        var b = this;
        a.bubble("zooming").to(this, "selectorZoomed").bubble("selecting").to(this, "selectorMoved").bubble("selectionEnded").to(this).bubble("activated").to(this, "selectorActivated").on("canceled", function (a) {
            b.ui.hideNotification();
            k.call(b, "cancelClipMode", {
                source: a.source
            });
            E.call(b)
        }).on("scrolled", function (a) {
            k.call(b, "scrollDuringExtract", {
                source: a.source
            })
        }).on("selectionEnded", function (a) {
            "bookmark" === a.selectionType ? b.extractors.bookmark.extract(a.selectionData, a.extractionContext) : b.activeExtractor.extract(a.selectionData, a.extractionContext)
        }).on("selectionFailed", function (a) {
            k.call(b, "info", {
                data: a.reason
            });
            b.ui.showErrorNotification(I(a.reason))
        }).on("bookmarkPage", function () {
            b.ui.showNotification("Bookmark page", -1)
        }).on("notBookmarkPage", function () {
            b.ui.hideNotification()
        })
    }
    function x(a) {
        var b = this;
        a.bubble("extracted").to(this).on("autoplayDisabled", function (a) {
            k.call(b, "autoplayDisable", {
                source: a.source
            })
        }).on("extracted", function (d) {
            var e = b.createClip({
                width: d.dimensions.width,
                height: d.dimensions.height,
                html: d.html,
                type: a.type,
                text: d.text,
                top: d.top,
                left: d.left,
                blobSchemaVersion: "0.2"
            });
            k.call(b, "extract", {
                elapsedTime: d.elapsedTime,
                type: d.extractionType,
                rectangleColor: b.preferences.rectangleColor,
                reviewClip: b.preferences.reviewClip,
                publishByDefault: b.preferences.publishByDefault
            });
            b.ui.reviewClip({
                clip: e,
                rawHtml: d.html
            })
        })
    }
    function N() {
        C.call(this);
        Q.call(this);
        for (var a in this.selectors) this.selectors.hasOwnProperty(a) && J.call(this, this.selectors[a]);
        for (a in this.extractors) this.extractors.hasOwnProperty(a) && x.call(this, this.extractors[a])
    }
    function R(a) {
        if (O.indexOf) return O.indexOf(a);
        for (var b = 0; b < O.length; b++) if (O[b] === a) return b;
        return -1
    }

    function P(a) {
        var a = a("<div/>").css({
            position: "absolute",
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            "margin-top": 0,
            "margin-bottom": 0,
            "margin-left": 0,
            "margin-right": 0,
            "background-color": "transparent"
        }).appendTo("body"),
            b = a.offset();
        a.remove();
        return b
    }
    function v(a) {
        var a = a("<div>").css({
            width: 0,
            height: 0,
            display: "none",
            "background-color": "rgba(64, 128, 256, 0.25)"
        }).appendTo("body"),
            b = a.css("background-color");
        a.remove();
        return /^rgba/.test(b)
    }
    function B(a) {
        var a = a("<div/>").css({
            width: "1in",
            visibility: "hidden",
            position: "absolute",
            left: "-10000px",
            "padding-top": 0,
            "padding-bottom": 0,
            "padding-left": 0,
            "padding-right": 0
        }).appendTo("body"),
            b = a.width();
        a.remove();
        return b
    }
    function S(a) {
        a = a("head base:first").attr("href");
        if (!a) a = d.location.href, a = a.replace(/#.*$/, "");
        var b = document.createElement("a");
        b.href = a;
        a = {
            uri: a,
            protocol: b.protocol,
            host: b.hostname,
            port: b.port,
            query: b.search,
            domainAndPort: /tps?:\/\/([^\/]+)/.exec(b.href)[1],
            path: b.pathname.replace(/^([^\/])/, "/$1"),
            relative: (b.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1]
        };
        a.relativeDir = a.protocol + "//" + a.domainAndPort + u.util.dirname(a.relative);
        return a
    }
    function K() {
        var a = s[this.documentId];
        if (a.$) return !1;
        (function () {
            (function (a, b) {
                function d(c) {
                    var g = U[c] = {},
                        f, a, c = c.split(/\s+/);
                    for (f = 0, a = c.length; f < a; f++) g[c[f]] = !0;
                    return g
                }
                function e(c, g, l) {
                    if (l === b && 1 === c.nodeType) if (l = "data-" + g.replace(V, "-$1").toLowerCase(), l = c.getAttribute(l), "string" === typeof l) {
                        try {
                            l = "true" === l ? !0 : "false" === l ? !1 : "null" === l ? null : f.isNumeric(l) ? parseFloat(l) : T.test(l) ? f.parseJSON(l) : l
                        } catch (a) {}
                        f.data(c, g, l)
                    } else l = b;
                    return l
                }
                function m(c) {
                    for (var g in c) if (!("data" === g && f.isEmptyObject(c[g])) && "toJSON" !== g) return !1;
                    return !0
                }
                function j(c, g, l) {
                    var a = g + "defer",
                        b = g + "queue",
                        L = g + "mark",
                        d = f._data(c, a);
                    d && ("queue" === l || !f._data(c, b)) && ("mark" === l || !f._data(c, L)) && setTimeout(function () {
                        !f._data(c, b) && !f._data(c, L) && (f.removeData(c, a, !0), d.fire())
                    }, 0)
                }
                function h() {
                    return !1
                }
                function q() {
                    return !0
                }
                function s(c, g, l) {
                    g = g || 0;
                    if (f.isFunction(g)) return f.grep(c, function (c, f) {
                        return !!g.call(c, f, c) === l
                    });
                    if (g.nodeType) return f.grep(c, function (c) {
                        return c === g === l
                    });
                    if ("string" === typeof g) {
                        var a = f.grep(c, function (c) {
                            return 1 === c.nodeType
                        });
                        if (Da.test(g)) return f.filter(g, a, !l);
                        g = f.filter(g, a)
                    }
                    return f.grep(c, function (c) {
                        return 0 <= f.inArray(c, g) === l
                    })
                }
                function n(c) {
                    var g = Oa.split("|"),
                        c = c.createDocumentFragment();
                    if (c.createElement) for (; g.length;) c.createElement(g.pop());
                    return c
                }
                function v(c, g) {
                    if (1 === g.nodeType && f.hasData(c)) {
                        var l, a, b;
                        a = f._data(c);
                        var L = f._data(g, a),
                            d = a.events;
                        if (d) for (l in delete L.handle, L.events = {}, d) for (a = 0, b = d[l].length; a < b; a++) f.event.add(g, l + (d[l][a].namespace ? "." : "") + d[l][a].namespace, d[l][a], d[l][a].data);
                        if (L.data) L.data = f.extend({}, L.data)
                    }
                }
                function k(c, g) {
                    var l;
                    if (1 === g.nodeType) {
                        g.clearAttributes && g.clearAttributes();
                        g.mergeAttributes && g.mergeAttributes(c);
                        l = g.nodeName.toLowerCase();
                        if ("object" === l) g.outerHTML = c.outerHTML;
                        else if ("input" === l && ("checkbox" === c.type || "radio" === c.type)) {
                            if (c.checked) g.defaultChecked = g.checked = c.checked;
                            if (g.value !== c.value) g.value = c.value
                        } else if ("option" === l) g.selected = c.defaultSelected;
                        else if ("input" === l || "textarea" === l) g.defaultValue = c.defaultValue;
                        g.removeAttribute(f.expando)
                    }
                }
                function o(c) {
                    return "undefined" !== typeof c.getElementsByTagName ? c.getElementsByTagName("*") : "undefined" !== typeof c.querySelectorAll ? c.querySelectorAll("*") : []
                }
                function Y(c) {
                    if ("checkbox" === c.type || "radio" === c.type) c.defaultChecked = c.checked
                }
                function B(c) {
                    var g = (c.nodeName || "").toLowerCase();
                    "input" === g ? Y(c) : "script" !== g && "undefined" !== typeof c.getElementsByTagName && f.grep(c.getElementsByTagName("input"), Y)
                }
                function u(c, g) {
                    g.src ? f.ajax({
                        url: g.src,
                        async: !1,
                        dataType: "script"
                    }) : f.globalEval((g.text || g.textContent || g.innerHTML || "").replace(jb, "/*$0*/"));
                    g.parentNode && g.parentNode.removeChild(g)
                }
                function G(c, g, l) {
                    var a = "width" === g ? c.offsetWidth : c.offsetHeight,
                        b = "width" === g ? kb : lb,
                        L = 0,
                        d = b.length;
                    if (0 < a) {
                        if ("border" !== l) for (; L < d; L++) l || (a -= parseFloat(f.css(c, "padding" + b[L])) || 0), a = "margin" === l ? a + (parseFloat(f.css(c, l + b[L])) || 0) : a - (parseFloat(f.css(c, "border" + b[L] + "Width")) || 0);
                        return a + "px"
                    }
                    a = qa(c, g, g);
                    if (0 > a || null == a) a = c.style[g] || 0;
                    a = parseFloat(a) || 0;
                    if (l) for (; L < d; L++) a += parseFloat(f.css(c, "padding" + b[L])) || 0, "padding" !== l && (a += parseFloat(f.css(c, "border" + b[L] + "Width")) || 0), "margin" === l && (a += parseFloat(f.css(c, l + b[L])) || 0);
                    return a + "px"
                }
                function w(c) {
                    return function (g, l) {
                        var r;
                        "string" !== typeof g && (l = g, g = "*");
                        if (f.isFunction(l)) for (var a = g.toLowerCase().split(Pa), b = 0, d = a.length, p, i; b < d; b++) p = a[b], (i = /^\+/.test(p)) && (p = p.substr(1) || "*"), r = c[p] = c[p] || [], p = r, p[i ? "unshift" : "push"](l)
                    }
                }
                function D(c, g, f, a, t, d) {
                    t = t || g.dataTypes[0];
                    d = d || {};
                    d[t] = !0;
                    for (var t = c[t], p = 0, i = t ? t.length : 0, e = c === Ga, m; p < i && (e || !m); p++) m = t[p](g, f, a), "string" === typeof m && (!e || d[m] ? m = b : (g.dataTypes.unshift(m), m = D(c, g, f, a, m, d)));
                    if ((e || !m) && !d["*"]) m = D(c, g, f, a, "*", d);
                    return m
                }
                function O(c, g) {
                    var l, a, t = f.ajaxSettings.flatOptions || {};
                    for (l in g) g[l] !== b && ((t[l] ? c : a || (a = {}))[l] = g[l]);
                    a && f.extend(!0, c, a)
                }
                function K(c, g, l, a) {
                    if (f.isArray(g)) f.each(g, function (g, b) {
                        l || nb.test(c) ? a(c, b) : K(c + "[" + ("object" === typeof b || f.isArray(b) ? g : "") + "]", b, l, a)
                    });
                    else if (!l && null != g && "object" === typeof g) for (var b in g) K(c + "[" + b + "]", g[b], l, a);
                    else a(c, g)
                }
                function S() {
                    try {
                        return new a.XMLHttpRequest
                    } catch (c) {}
                }
                function C() {
                    setTimeout(H, 0);
                    return xa = f.now()
                }
                function H() {
                    xa = b
                }
                function M(c, g) {
                    var l = {};
                    f.each(Qa.concat.apply([], Qa.slice(0, g)), function () {
                        l[this] = c
                    });
                    return l
                }
                function fa(c) {
                    if (!Ha[c]) {
                        var g = z.body,
                            l = f("<" + c + ">").appendTo(g),
                            a = l.css("display");
                        l.remove();
                        if ("none" === a || "" === a) {
                            if (!ha) ha = z.createElement("iframe"), ha.frameBorder = ha.width = ha.height = 0;
                            g.appendChild(ha);
                            if (!ra || !ha.createElement) ra = (ha.contentWindow || ha.contentDocument).document, ra.write(("CSS1Compat" === z.compatMode ? "<!doctype html>" : "") + "<html><body>"), ra.close();
                            l = ra.createElement(c);
                            ra.body.appendChild(l);
                            a = f.css(l, "display");
                            g.removeChild(ha)
                        }
                        Ha[c] = a
                    }
                    return Ha[c]
                }
                function X(c) {
                    return f.isWindow(c) ? c : 9 === c.nodeType ? c.defaultView || c.parentWindow : !1
                }
                var z = a.document,
                    Ia = a.navigator,
                    E = a.location,
                    f = function () {
                        function c() {
                            if (!g.isReady) {
                                try {
                                    z.documentElement.doScroll("left")
                                } catch (f) {
                                    setTimeout(c, 1);
                                    return
                                }
                                g.ready()
                            }
                        }
                        var g = function (c, f) {
                                return new g.fn.init(c, f, t)
                            },
                            f = a.jQuery,
                            y = a.$,
                            t, d = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                            p = /\S/,
                            i = /^\s+/,
                            e = /\s+$/,
                            m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                            A = /^[\],:{}\s]*$/,
                            j = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                            o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                            r = /(?:^|:|,)(?:\s*\[)+/g,
                            h = /(webkit)[ \/]([\w.]+)/,
                            H = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                            da = /(msie) ([\w.]+)/,
                            q = /(mozilla)(?:.*? rv:([\w.]+))?/,
                            s = /-([a-z]|[0-9])/ig,
                            M = /^-ms-/,
                            n = function (c, g) {
                                return (g + "").toUpperCase()
                            },
                            v = Ia.userAgent,
                            ka, sa, ob = Object.prototype.toString,
                            ta = Object.prototype.hasOwnProperty,
                            Ja = Array.prototype.push,
                            k = Array.prototype.slice,
                            aa = String.prototype.trim,
                            X = Array.prototype.indexOf,
                            ia = {};
                        g.fn = g.prototype = {
                            constructor: g,
                            init: function (c, f, l) {
                                var a;
                                if (!c) return this;
                                if (c.nodeType) return this.context = this[0] = c, this.length = 1, this;
                                if ("body" === c && !f && z.body) return this.context = z, this[0] = z.body, this.selector = c, this.length = 1, this;
                                if ("string" === typeof c) {
                                    if ((a = "<" === c.charAt(0) && ">" === c.charAt(c.length - 1) && 3 <= c.length ? [null, c, null] : d.exec(c)) && (a[1] || !f)) {
                                        if (a[1]) return l = (f = f instanceof g ? f[0] : f) ? f.ownerDocument || f : z, (c = m.exec(c)) ? g.isPlainObject(f) ? (c = [z.createElement(c[1])], g.fn.attr.call(c, f, !0)) : c = [l.createElement(c[1])] : (c = g.buildFragment([a[1]], [l]), c = (c.cacheable ? g.clone(c.fragment) : c.fragment).childNodes), g.merge(this, c);
                                        if ((f = z.getElementById(a[2])) && f.parentNode) {
                                            if (f.id !== a[2]) return l.find(c);
                                            this.length = 1;
                                            this[0] = f
                                        }
                                        this.context = z;
                                        this.selector = c;
                                        return this
                                    }
                                    return !f || f.jquery ? (f || l).find(c) : this.constructor(f).find(c)
                                }
                                if (g.isFunction(c)) return l.ready(c);
                                if (c.selector !== b) this.selector = c.selector, this.context = c.context;
                                return g.makeArray(c, this)
                            },
                            selector: "",
                            jquery: "1.7.1",
                            length: 0,
                            size: function () {
                                return this.length
                            },
                            toArray: function () {
                                return k.call(this, 0)
                            },
                            get: function (c) {
                                return null == c ? this.toArray() : 0 > c ? this[this.length + c] : this[c]
                            },
                            pushStack: function (c, f, l) {
                                var a = this.constructor();
                                g.isArray(c) ? Ja.apply(a, c) : g.merge(a, c);
                                a.prevObject = this;
                                a.context = this.context;
                                if ("find" === f) a.selector = this.selector + (this.selector ? " " : "") + l;
                                else if (f) a.selector = this.selector + "." + f + "(" + l + ")";
                                return a
                            },
                            each: function (c, f) {
                                return g.each(this, c, f)
                            },
                            ready: function (c) {
                                g.bindReady();
                                ka.add(c);
                                return this
                            },
                            eq: function (c) {
                                c = +c;
                                return -1 === c ? this.slice(c) : this.slice(c, c + 1)
                            },
                            first: function () {
                                return this.eq(0)
                            },
                            last: function () {
                                return this.eq(-1)
                            },
                            slice: function () {
                                return this.pushStack(k.apply(this, arguments), "slice", k.call(arguments).join(","))
                            },
                            map: function (c) {
                                return this.pushStack(g.map(this, function (g, f) {
                                    return c.call(g, f, g)
                                }))
                            },
                            end: function () {
                                return this.prevObject || this.constructor(null)
                            },
                            push: Ja,
                            sort: [].sort,
                            splice: [].splice
                        };
                        g.fn.init.prototype = g.fn;
                        g.extend = g.fn.extend = function () {
                            var c, f, a, l, y, t = arguments[0] || {},
                                d = 1,
                                L = arguments.length,
                                ka = !1;
                            "boolean" === typeof t && (ka = t, t = arguments[1] || {}, d = 2);
                            "object" !== typeof t && !g.isFunction(t) && (t = {});
                            L === d && (t = this, --d);
                            for (; d < L; d++) if (null != (c = arguments[d])) for (f in c) ta.call(c, f) && (a = t[f], l = c[f], t !== l && (ka && l && (g.isPlainObject(l) || (y = g.isArray(l))) ? (y ? (y = !1, a = a && g.isArray(a) ? a : []) : a = a && g.isPlainObject(a) ? a : {}, t[f] = g.extend(ka, a, l)) : l !== b && (t[f] = l)));
                            return t
                        };
                        g.extend({
                            noConflict: function (c) {
                                if (a.$ === g) a.$ = y;
                                if (c && a.jQuery === g) a.jQuery = f;
                                return g
                            },
                            isReady: !1,
                            readyWait: 1,
                            holdReady: function (c) {
                                c ? g.readyWait++ : g.ready(!0)
                            },
                            ready: function (c) {
                                if (!0 === c && !--g.readyWait || !0 !== c && !g.isReady) {
                                    if (!z.body) return setTimeout(g.ready, 1);
                                    g.isReady = !0;
                                    !0 !== c && 0 < --g.readyWait || (ka.fireWith(z, [g]), g.fn.trigger && g(z).trigger("ready").off("ready"))
                                }
                            },
                            bindReady: function () {
                                if (!ka) {
                                    ka = g.Callbacks("once memory");
                                    if ("complete" === z.readyState) return setTimeout(g.ready, 1);
                                    if (z.addEventListener) z.addEventListener("DOMContentLoaded", sa, !1), a.addEventListener("load", g.ready, !1);
                                    else if (z.attachEvent) {
                                        z.attachEvent("onreadystatechange", sa);
                                        a.attachEvent("onload", g.ready);
                                        var f = !1;
                                        try {
                                            f = null == a.frameElement
                                        } catch (l) {}
                                        z.documentElement.doScroll && f && c()
                                    }
                                }
                            },
                            isFunction: function (c) {
                                return "function" === g.type(c)
                            },
                            isArray: Array.isArray ||
                            function (c) {
                                return "array" === g.type(c)
                            },
                            isWindow: function (c) {
                                return c && "object" === typeof c && "setInterval" in c
                            },
                            isNumeric: function (c) {
                                return !isNaN(parseFloat(c)) && isFinite(c)
                            },
                            type: function (c) {
                                return null == c ? "" + c : ia[ob.call(c)] || "object"
                            },
                            isPlainObject: function (c) {
                                if (!c || "object" !== g.type(c) || c.nodeType || g.isWindow(c)) return !1;
                                try {
                                    if (c.constructor && !ta.call(c, "constructor") && !ta.call(c.constructor.prototype, "isPrototypeOf")) return !1
                                } catch (f) {
                                    return !1
                                }
                                for (var a in c);
                                return a === b || ta.call(c, a)
                            },
                            isEmptyObject: function (c) {
                                for (var g in c) return !1;
                                return !0
                            },
                            error: function (c) {
                                throw Error(c);
                            },
                            parseJSON: function (c) {
                                if ("string" !== typeof c || !c) return null;
                                c = g.trim(c);
                                if (a.JSON && a.JSON.parse) return a.JSON.parse(c);
                                if (A.test(c.replace(j, "@").replace(o, "]").replace(r, ""))) return (new Function("return " + c))();
                                g.error("Invalid JSON: " + c)
                            },
                            parseXML: function (c) {
                                var f, l;
                                try {
                                    a.DOMParser ? (l = new DOMParser, f = l.parseFromString(c, "text/xml")) : (f = new ActiveXObject("Microsoft.XMLDOM"), f.async = "false", f.loadXML(c))
                                } catch (y) {
                                    f = b
                                }(!f || !f.documentElement || f.getElementsByTagName("parsererror").length) && g.error("Invalid XML: " + c);
                                return f
                            },
                            noop: function () {},
                            globalEval: function (c) {
                                c && p.test(c) && (a.execScript ||
                                function (c) {
                                    a.eval.call(a, c)
                                })(c)
                            },
                            camelCase: function (c) {
                                return c.replace(M, "ms-").replace(s, n)
                            },
                            nodeName: function (c, g) {
                                return c.nodeName && c.nodeName.toUpperCase() === g.toUpperCase()
                            },
                            each: function (c, f, a) {
                                var l, y = 0,
                                    t = c.length,
                                    d = t === b || g.isFunction(c);
                                if (a) if (d) for (l in c) {
                                    if (ta.call(c, l) && !1 === f.apply(c[l], a)) break
                                } else for (; y < t && !(!1 === f.apply(c[y++], a)););
                                else if (d) for (l in c) {
                                    if (ta.call(c, l) && !1 === f.call(c[l], l, c[l])) break
                                } else for (; y < t && !(!1 === f.call(c[y], y, c[y++])););
                                return c
                            },
                            trim: aa ?
                            function (c) {
                                return null == c ? "" : aa.call(c)
                            } : function (c) {
                                return null == c ? "" : c.toString().replace(i, "").replace(e, "")
                            },
                            makeArray: function (c, f) {
                                var l = f || [];
                                if (null != c) {
                                    var a = g.type(c);
                                    null == c.length || "string" === a || "function" === a || "regexp" === a || g.isWindow(c) ? Ja.call(l, c) : g.merge(l, c)
                                }
                                return l
                            },
                            inArray: function (c, g, f) {
                                var l;
                                if (g) {
                                    if (X) return X.call(g, c, f);
                                    l = g.length;
                                    for (f = f ? 0 > f ? Math.max(0, l + f) : f : 0; f < l; f++) if (f in g && g[f] === c) return f
                                }
                                return -1
                            },
                            merge: function (c, g) {
                                var f = c.length,
                                    l = 0;
                                if ("number" === typeof g.length) for (var a = g.length; l < a; l++) c[f++] = g[l];
                                else for (; g[l] !== b;) c[f++] = g[l++];
                                c.length = f;
                                return c
                            },
                            grep: function (c, g, f) {
                                for (var l = [], a, f = !! f, b = 0, y = c.length; b < y; b++) a = !! g(c[b], b), f !== a && l.push(c[b]);
                                return l
                            },
                            map: function (c, f, l) {
                                var a, y, t = [],
                                    d = 0,
                                    L = c.length;
                                if (c instanceof g || L !== b && "number" === typeof L && (0 < L && c[0] && c[L - 1] || 0 === L || g.isArray(c))) for (; d < L; d++) a = f(c[d], d, l), null != a && (t[t.length] = a);
                                else for (y in c) a = f(c[y], y, l), null != a && (t[t.length] = a);
                                return t.concat.apply([], t)
                            },
                            guid: 1,
                            proxy: function (c, f) {
                                if ("string" === typeof f) var l = c[f],
                                    f = c,
                                    c = l;
                                if (!g.isFunction(c)) return b;
                                var a = k.call(arguments, 2),
                                    l = function () {
                                        return c.apply(f, a.concat(k.call(arguments)))
                                    };
                                l.guid = c.guid = c.guid || l.guid || g.guid++;
                                return l
                            },
                            access: function (c, f, l, a, y, t) {
                                var d = c.length;
                                if ("object" === typeof f) {
                                    for (var L in f) g.access(c, L, f[L], a, y, l);
                                    return c
                                }
                                if (l !== b) {
                                    a = !t && a && g.isFunction(l);
                                    for (L = 0; L < d; L++) y(c[L], f, a ? l.call(c[L], L, y(c[L], f)) : l, t);
                                    return c
                                }
                                return d ? y(c[0], f) : b
                            },
                            now: function () {
                                return (new Date).getTime()
                            },
                            uaMatch: function (c) {
                                c = c.toLowerCase();
                                c = h.exec(c) || H.exec(c) || da.exec(c) || 0 > c.indexOf("compatible") && q.exec(c) || [];
                                return {
                                    browser: c[1] || "",
                                    version: c[2] || "0"
                                }
                            },
                            sub: function () {
                                function c(g, f) {
                                    return new c.fn.init(g, f)
                                }
                                g.extend(!0, c, this);
                                c.superclass = this;
                                c.fn = c.prototype = this();
                                c.fn.constructor = c;
                                c.sub = this.sub;
                                c.fn.init = function (l, a) {
                                    a && a instanceof g && !(a instanceof c) && (a = c(a));
                                    return g.fn.init.call(this, l, a, f)
                                };
                                c.fn.init.prototype = c.fn;
                                var f = c(z);
                                return c
                            },
                            browser: {}
                        });
                        g.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (c, g) {
                            ia["[object " + g + "]"] = g.toLowerCase()
                        });
                        v = g.uaMatch(v);
                        if (v.browser) g.browser[v.browser] = !0, g.browser.version = v.version;
                        if (g.browser.webkit) g.browser.safari = !0;
                        p.test("\u00a0") && (i = /^[\s\xA0]+/, e = /[\s\xA0]+$/);
                        t = g(z);
                        z.addEventListener ? sa = function () {
                            z.removeEventListener("DOMContentLoaded", sa, !1);
                            g.ready()
                        } : z.attachEvent && (sa = function () {
                            "complete" === z.readyState && (z.detachEvent("onreadystatechange", sa), g.ready())
                        });
                        return g
                    }(),
                    U = {};
                f.Callbacks = function (c) {
                    var c = c ? U[c] || d(c) : {},
                        g = [],
                        l = [],
                        a, t, L, p, e, m = function (a) {
                            var l, b, y, t;
                            for (l = 0, b = a.length; l < b; l++) y = a[l], t = f.type(y), "array" === t ? m(y) : "function" === t && (!c.unique || !j.has(y)) && g.push(y)
                        },
                        A = function (f, b) {
                            b = b || [];
                            a = !c.memory || [f, b];
                            t = !0;
                            e = L || 0;
                            L = 0;
                            for (p = g.length; g && e < p; e++) if (!1 === g[e].apply(f, b) && c.stopOnFalse) {
                                a = !0;
                                break
                            }
                            t = !1;
                            g && (c.once ? !0 === a ? j.disable() : g = [] : l && l.length && (a = l.shift(), j.fireWith(a[0], a[1])))
                        },
                        j = {
                            add: function () {
                                if (g) {
                                    var c = g.length;
                                    m(arguments);
                                    t ? p = g.length : a && !0 !== a && (L = c, A(a[0], a[1]))
                                }
                                return this
                            },
                            remove: function () {
                                if (g) for (var f = arguments, a = 0, l = f.length; a < l; a++) for (var b = 0; b < g.length && !(f[a] === g[b] && (t && b <= p && (p--, b <= e && e--), g.splice(b--, 1), c.unique)); b++);
                                return this
                            },
                            has: function (c) {
                                if (g) for (var f = 0, a = g.length; f < a; f++) if (c === g[f]) return !0;
                                return !1
                            },
                            empty: function () {
                                g = [];
                                return this
                            },
                            disable: function () {
                                g = l = a = b;
                                return this
                            },
                            disabled: function () {
                                return !g
                            },
                            lock: function () {
                                l = b;
                                (!a || !0 === a) && j.disable();
                                return this
                            },
                            locked: function () {
                                return !l
                            },
                            fireWith: function (g, f) {
                                l && (t ? c.once || l.push([g, f]) : (!c.once || !a) && A(g, f));
                                return this
                            },
                            fire: function () {
                                j.fireWith(this, arguments);
                                return this
                            },
                            fired: function () {
                                return !!a
                            }
                        };
                    return j
                };
                var $ = [].slice;
                f.extend({
                    Deferred: function (c) {
                        var g = f.Callbacks("once memory"),
                            a = f.Callbacks("once memory"),
                            b = f.Callbacks("memory"),
                            t = "pending",
                            d = {
                                resolve: g,
                                reject: a,
                                notify: b
                            },
                            p = {
                                done: g.add,
                                fail: a.add,
                                progress: b.add,
                                state: function () {
                                    return t
                                },
                                isResolved: g.fired,
                                isRejected: a.fired,
                                then: function (c, g, f) {
                                    i.done(c).fail(g).progress(f);
                                    return this
                                },
                                always: function () {
                                    i.done.apply(i, arguments).fail.apply(i, arguments);
                                    return this
                                },
                                pipe: function (c, g, a) {
                                    return f.Deferred(function (l) {
                                        f.each({
                                            done: [c, "resolve"],
                                            fail: [g, "reject"],
                                            progress: [a, "notify"]
                                        }, function (c, g) {
                                            var a = g[0],
                                                b = g[1],
                                                y;
                                            if (f.isFunction(a)) i[c](function () {
                                                if ((y = a.apply(this, arguments)) && f.isFunction(y.promise)) y.promise().then(l.resolve, l.reject, l.notify);
                                                else l[b + "With"](this === i ? l : this, [y])
                                            });
                                            else i[c](l[b])
                                        })
                                    }).promise()
                                },
                                promise: function (c) {
                                    if (null == c) c = p;
                                    else for (var g in p) c[g] = p[g];
                                    return c
                                }
                            },
                            i = p.promise({}),
                            e;
                        for (e in d) i[e] = d[e].fire, i[e + "With"] = d[e].fireWith;
                        i.done(function () {
                            t = "resolved"
                        }, a.disable, b.lock).fail(function () {
                            t = "rejected"
                        }, g.disable, b.lock);
                        c && c.call(i, i);
                        return i
                    },
                    when: function (c) {
                        function g(c) {
                            return function (g) {
                                b[c] = 1 < arguments.length ? $.call(arguments, 0) : g;
                                --i || e.resolveWith(e, b)
                            }
                        }
                        function a(c) {
                            return function (g) {
                                p[c] = 1 < arguments.length ? $.call(arguments, 0) : g;
                                e.notifyWith(m, p)
                            }
                        }
                        var b = $.call(arguments, 0),
                            t = 0,
                            d = b.length,
                            p = Array(d),
                            i = d,
                            e = 1 >= d && c && f.isFunction(c.promise) ? c : f.Deferred(),
                            m = e.promise();
                        if (1 < d) {
                            for (; t < d; t++) b[t] && b[t].promise && f.isFunction(b[t].promise) ? b[t].promise().then(g(t), e.reject, a(t)) : --i;
                            i || e.resolveWith(e, b)
                        } else e !== c && e.resolveWith(e, d ? [c] : []);
                        return m
                    }
                });
                f.support = function () {
                    var c, g, l, b, t, d, p, i, e = z.createElement("div");
                    e.setAttribute("className", "t");
                    e.innerHTML = " <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
                    g = e.getElementsByTagName("*");
                    l = e.getElementsByTagName("a")[0];
                    if (!g || !g.length || !l) return {};
                    b = z.createElement("select");
                    t = b.appendChild(z.createElement("option"));
                    g = e.getElementsByTagName("input")[0];
                    c = {
                        leadingWhitespace: 3 === e.firstChild.nodeType,
                        tbody: !e.getElementsByTagName("tbody").length,
                        htmlSerialize: !! e.getElementsByTagName("link").length,
                        style: /top/.test(l.getAttribute("style")),
                        hrefNormalized: "/a" === l.getAttribute("href"),
                        opacity: /^0.55/.test(l.style.opacity),
                        cssFloat: !! l.style.cssFloat,
                        checkOn: "on" === g.value,
                        optSelected: t.selected,
                        getSetAttribute: "t" !== e.className,
                        enctype: !! z.createElement("form").enctype,
                        html5Clone: "<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML,
                        submitBubbles: !0,
                        changeBubbles: !0,
                        focusinBubbles: !1,
                        deleteExpando: !0,
                        noCloneEvent: !0,
                        inlineBlockNeedsLayout: !1,
                        shrinkWrapBlocks: !1,
                        reliableMarginRight: !0
                    };
                    g.checked = !0;
                    c.noCloneChecked = g.cloneNode(!0).checked;
                    b.disabled = !0;
                    c.optDisabled = !t.disabled;
                    try {
                        delete e.test
                    } catch (m) {
                        c.deleteExpando = !1
                    }!e.addEventListener && e.attachEvent && e.fireEvent && (e.attachEvent("onclick", function () {
                        c.noCloneEvent = !1
                    }), e.cloneNode(!0).fireEvent("onclick"));
                    g = z.createElement("input");
                    g.value = "t";
                    g.setAttribute("type", "radio");
                    c.radioValue = "t" === g.value;
                    g.setAttribute("checked", "checked");
                    e.appendChild(g);
                    l = z.createDocumentFragment();
                    l.appendChild(e.lastChild);
                    c.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked;
                    c.appendChecked = g.checked;
                    l.removeChild(g);
                    l.appendChild(e);
                    e.innerHTML = "";
                    if (a.getComputedStyle) g = z.createElement("div"), g.style.width = "0", g.style.marginRight = "0", e.style.width = "2px", e.appendChild(g), c.reliableMarginRight = 0 === (parseInt((a.getComputedStyle(g, null) || {
                        marginRight: 0
                    }).marginRight, 10) || 0);
                    if (e.attachEvent) for (p in {
                        submit: 1,
                        change: 1,
                        focusin: 1
                    }) g = "on" + p, i = g in e, i || (e.setAttribute(g, "return;"), i = "function" === typeof e[g]), c[p + "Bubbles"] = i;
                    l.removeChild(e);
                    l = b = t = g = e = g = null;
                    f(function () {
                        var g, a, l, b, y = z.getElementsByTagName("body")[0];
                        if (y) {
                            g = z.createElement("div");
                            g.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
                            y.insertBefore(g, y.firstChild);
                            e = z.createElement("div");
                            g.appendChild(e);
                            e.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
                            d = e.getElementsByTagName("td");
                            i = 0 === d[0].offsetHeight;
                            d[0].style.display = "";
                            d[1].style.display = "none";
                            c.reliableHiddenOffsets = i && 0 === d[0].offsetHeight;
                            e.innerHTML = "";
                            e.style.width = e.style.paddingLeft = "1px";
                            f.boxModel = c.boxModel = 2 === e.offsetWidth;
                            if ("undefined" !== typeof e.style.zoom) e.style.display = "inline", e.style.zoom = 1, c.inlineBlockNeedsLayout = 2 === e.offsetWidth, e.style.display = "", e.innerHTML = "<div style='width:4px;'></div>", c.shrinkWrapBlocks = 2 !== e.offsetWidth;
                            e.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;visibility:hidden;border:0;";
                            e.innerHTML = "<div style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;'><div></div></div><table style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
                            a = e.firstChild;
                            l = a.firstChild;
                            b = {
                                doesNotAddBorder: 5 !== l.offsetTop,
                                doesAddBorderForTableAndCells: 5 === a.nextSibling.firstChild.firstChild.offsetTop
                            };
                            l.style.position = "fixed";
                            l.style.top = "20px";
                            b.fixedPosition = 20 === l.offsetTop || 15 === l.offsetTop;
                            l.style.position = l.style.top = "";
                            a.style.overflow = "hidden";
                            a.style.position = "relative";
                            b.subtractsBorderForOverflowNotVisible = -5 === l.offsetTop;
                            b.doesNotIncludeMarginInBodyOffset = 1 !== y.offsetTop;
                            y.removeChild(g);
                            e = null;
                            f.extend(c, b)
                        }
                    });
                    return c
                }();
                var T = /^(?:\{.*\}|\[.*\])$/,
                    V = /([A-Z])/g;
                f.extend({
                    cache: {},
                    uuid: 0,
                    expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
                    noData: {
                        embed: !0,
                        object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                        applet: !0
                    },
                    hasData: function (c) {
                        c = c.nodeType ? f.cache[c[f.expando]] : c[f.expando];
                        return !!c && !m(c)
                    },
                    data: function (c, g, a, y) {
                        if (f.acceptData(c)) {
                            var t;
                            t = f.expando;
                            var d = "string" === typeof g,
                                e = c.nodeType,
                                p = e ? f.cache : c,
                                i = e ? c[t] : c[t] && t,
                                m = "events" === g;
                            if (i && p[i] && (m || y || p[i].data) || !(d && a === b)) {
                                i || (e ? c[t] = i = ++f.uuid : i = t);
                                if (!p[i] && (p[i] = {}, !e)) p[i].toJSON = f.noop;
                                if ("object" === typeof g || "function" === typeof g) y ? p[i] = f.extend(p[i], g) : p[i].data = f.extend(p[i].data, g);
                                t = c = p[i];
                                if (!y) {
                                    if (!c.data) c.data = {};
                                    c = c.data
                                }
                                a !== b && (c[f.camelCase(g)] = a);
                                if (m && !c[g]) return t.events;
                                d ? (a = c[g], null == a && (a = c[f.camelCase(g)])) : a = c;
                                return a
                            }
                        }
                    },
                    removeData: function (c, g, a) {
                        if (f.acceptData(c)) {
                            var b, t, d, e = f.expando,
                                p = c.nodeType,
                                i = p ? f.cache : c,
                                A = p ? c[e] : e;
                            if (i[A]) {
                                if (g && (b = a ? i[A] : i[A].data)) {
                                    f.isArray(g) || (g in b ? g = [g] : (g = f.camelCase(g), g = g in b ? [g] : g.split(" ")));
                                    for (t = 0, d = g.length; t < d; t++) delete b[g[t]];
                                    if (!(a ? m : f.isEmptyObject)(b)) return
                                }
                                if (!a && (delete i[A].data, !m(i[A]))) return;
                                f.support.deleteExpando || !i.setInterval ? delete i[A] : i[A] = null;
                                p && (f.support.deleteExpando ? delete c[e] : c.removeAttribute ? c.removeAttribute(e) : c[e] = null)
                            }
                        }
                    },
                    _data: function (c, g, a) {
                        return f.data(c, g, a, !0)
                    },
                    acceptData: function (c) {
                        if (c.nodeName) {
                            var g = f.noData[c.nodeName.toLowerCase()];
                            if (g) return !(!0 === g || c.getAttribute("classid") !== g)
                        }
                        return !0
                    }
                });
                f.fn.extend({
                    data: function (c, g) {
                        var a, y, t, d = null;
                        if ("undefined" === typeof c) {
                            if (this.length && (d = f.data(this[0]), 1 === this[0].nodeType && !f._data(this[0], "parsedAttrs"))) {
                                y = this[0].attributes;
                                for (var i = 0, p = y.length; i < p; i++) t = y[i].name, 0 === t.indexOf("data-") && (t = f.camelCase(t.substring(5)), e(this[0], t, d[t]));
                                f._data(this[0], "parsedAttrs", !0)
                            }
                            return d
                        }
                        if ("object" === typeof c) return this.each(function () {
                            f.data(this, c)
                        });
                        a = c.split(".");
                        a[1] = a[1] ? "." + a[1] : "";
                        return g === b ? (d = this.triggerHandler("getData" + a[1] + "!", [a[0]]), d === b && this.length && (d = f.data(this[0], c), d = e(this[0], c, d)), d === b && a[1] ? this.data(a[0]) : d) : this.each(function () {
                            var b = f(this),
                                y = [a[0], g];
                            b.triggerHandler("setData" + a[1] + "!", y);
                            f.data(this, c, g);
                            b.triggerHandler("changeData" + a[1] + "!", y)
                        })
                    },
                    removeData: function (c) {
                        return this.each(function () {
                            f.removeData(this, c)
                        })
                    }
                });
                f.extend({
                    _mark: function (c, g) {
                        c && (g = (g || "fx") + "mark", f._data(c, g, (f._data(c, g) || 0) + 1))
                    },
                    _unmark: function (c, g, a) {
                        !0 !== c && (a = g, g = c, c = !1);
                        if (g) {
                            var a = a || "fx",
                                b = a + "mark";
                            (c = c ? 0 : (f._data(g, b) || 1) - 1) ? f._data(g, b, c) : (f.removeData(g, b, !0), j(g, a, "mark"))
                        }
                    },
                    queue: function (c, g, a) {
                        var b;
                        if (c) return g = (g || "fx") + "queue", b = f._data(c, g), a && (!b || f.isArray(a) ? b = f._data(c, g, f.makeArray(a)) : b.push(a)), b || []
                    },
                    dequeue: function (c, g) {
                        var g = g || "fx",
                            a = f.queue(c, g),
                            b = a.shift(),
                            t = {};
                        "inprogress" === b && (b = a.shift());
                        b && ("fx" === g && a.unshift("inprogress"), f._data(c, g + ".run", t), b.call(c, function () {
                            f.dequeue(c, g)
                        }, t));
                        a.length || (f.removeData(c, g + "queue " + g + ".run", !0), j(c, g, "queue"))
                    }
                });
                f.fn.extend({
                    queue: function (c, g) {
                        "string" !== typeof c && (g = c, c = "fx");
                        return g === b ? f.queue(this[0], c) : this.each(function () {
                            var a = f.queue(this, c, g);
                            "fx" === c && "inprogress" !== a[0] && f.dequeue(this, c)
                        })
                    },
                    dequeue: function (c) {
                        return this.each(function () {
                            f.dequeue(this, c)
                        })
                    },
                    delay: function (c, g) {
                        c = f.fx ? f.fx.speeds[c] || c : c;
                        return this.queue(g || "fx", function (g, f) {
                            var a = setTimeout(g, c);
                            f.stop = function () {
                                clearTimeout(a)
                            }
                        })
                    },
                    clearQueue: function (c) {
                        return this.queue(c || "fx", [])
                    },
                    promise: function (c) {
                        function g() {
                            --d || a.resolveWith(y, [y])
                        }
                        "string" !== typeof c && (c = b);
                        for (var c = c || "fx", a = f.Deferred(), y = this, t = y.length, d = 1, e = c + "defer", i = c + "queue", c = c + "mark", p; t--;) if (p = f.data(y[t], e, b, !0) || (f.data(y[t], i, b, !0) || f.data(y[t], c, b, !0)) && f.data(y[t], e, f.Callbacks("once memory"), !0)) d++, p.add(g);
                        g();
                        return a.promise()
                    }
                });
                var I = /[\n\t\r]/g,
                    x = /\s+/,
                    Q = /\r/g,
                    J = /^(?:button|input)$/i,
                    P = /^(?:button|input|object|select|textarea)$/i,
                    N = /^a(?:rea)?$/i,
                    R = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
                    ua = f.support.getSetAttribute,
                    p, da, W;
                f.fn.extend({
                    attr: function (c, g) {
                        return f.access(this, c, g, !0, f.attr)
                    },
                    removeAttr: function (c) {
                        return this.each(function () {
                            f.removeAttr(this, c)
                        })
                    },
                    prop: function (c, g) {
                        return f.access(this, c, g, !0, f.prop)
                    },
                    removeProp: function (c) {
                        c = f.propFix[c] || c;
                        return this.each(function () {
                            try {
                                this[c] = b, delete this[c]
                            } catch (g) {}
                        })
                    },
                    addClass: function (c) {
                        var g, a, b, t, d, e, i;
                        if (f.isFunction(c)) return this.each(function (g) {
                            f(this).addClass(c.call(this, g, this.className))
                        });
                        if (c && "string" === typeof c) {
                            g = c.split(x);
                            for (a = 0, b = this.length; a < b; a++) if (t = this[a], 1 === t.nodeType) if (!t.className && 1 === g.length) t.className = c;
                            else {
                                d = " " + t.className + " ";
                                for (e = 0, i = g.length; e < i; e++)~d.indexOf(" " + g[e] + " ") || (d += g[e] + " ");
                                t.className = f.trim(d)
                            }
                        }
                        return this
                    },
                    removeClass: function (c) {
                        var g, a, y, t, d, e, i;
                        if (f.isFunction(c)) return this.each(function (g) {
                            f(this).removeClass(c.call(this, g, this.className))
                        });
                        if (c && "string" === typeof c || c === b) {
                            g = (c || "").split(x);
                            for (a = 0, y = this.length; a < y; a++) if (t = this[a], 1 === t.nodeType && t.className) if (c) {
                                d = (" " + t.className + " ").replace(I, " ");
                                for (e = 0, i = g.length; e < i; e++) d = d.replace(" " + g[e] + " ", " ");
                                t.className = f.trim(d)
                            } else t.className = ""
                        }
                        return this
                    },
                    toggleClass: function (c, g) {
                        var a = typeof c,
                            b = "boolean" === typeof g;
                        return f.isFunction(c) ? this.each(function (a) {
                            f(this).toggleClass(c.call(this, a, this.className, g), g)
                        }) : this.each(function () {
                            if ("string" === a) for (var t, d = 0, e = f(this), i = g, p = c.split(x); t = p[d++];) i = b ? i : !e.hasClass(t), e[i ? "addClass" : "removeClass"](t);
                            else if ("undefined" === a || "boolean" === a) this.className && f._data(this, "__className__", this.className), this.className = this.className || !1 === c ? "" : f._data(this, "__className__") || ""
                        })
                    },
                    hasClass: function (c) {
                        for (var c = " " + c + " ", g = 0, f = this.length; g < f; g++) if (1 === this[g].nodeType && -1 < (" " + this[g].className + " ").replace(I, " ").indexOf(c)) return !0;
                        return !1
                    },
                    val: function (c) {
                        var g, a, y, t = this[0];
                        if (arguments.length) return y = f.isFunction(c), this.each(function (a) {
                            var l = f(this);
                            if (1 === this.nodeType && (a = y ? c.call(this, a, l.val()) : c, null == a ? a = "" : "number" === typeof a ? a += "" : f.isArray(a) && (a = f.map(a, function (c) {
                                return null == c ? "" : c + ""
                            })), g = f.valHooks[this.nodeName.toLowerCase()] || f.valHooks[this.type], !g || !("set" in g) || g.set(this, a, "value") === b)) this.value = a
                        });
                        if (t) {
                            if ((g = f.valHooks[t.nodeName.toLowerCase()] || f.valHooks[t.type]) && "get" in g && (a = g.get(t, "value")) !== b) return a;
                            a = t.value;
                            return "string" === typeof a ? a.replace(Q, "") : null == a ? "" : a
                        }
                    }
                });
                f.extend({
                    valHooks: {
                        option: {
                            get: function (c) {
                                var g = c.attributes.value;
                                return !g || g.specified ? c.value : c.text
                            }
                        },
                        select: {
                            get: function (c) {
                                var g, a, b = c.selectedIndex,
                                    t = [],
                                    d = c.options,
                                    e = "select-one" === c.type;
                                if (0 > b) return null;
                                c = e ? b : 0;
                                for (a = e ? b + 1 : d.length; c < a; c++) if (g = d[c], g.selected && (f.support.optDisabled ? !g.disabled : null === g.getAttribute("disabled")) && (!g.parentNode.disabled || !f.nodeName(g.parentNode, "optgroup"))) {
                                    g = f(g).val();
                                    if (e) return g;
                                    t.push(g)
                                }
                                return e && !t.length && d.length ? f(d[b]).val() : t
                            },
                            set: function (c, g) {
                                var a = f.makeArray(g);
                                f(c).find("option").each(function () {
                                    this.selected = 0 <= f.inArray(f(this).val(), a)
                                });
                                if (!a.length) c.selectedIndex = -1;
                                return a
                            }
                        }
                    },
                    attrFn: {
                        val: !0,
                        css: !0,
                        html: !0,
                        text: !0,
                        data: !0,
                        width: !0,
                        height: !0,
                        offset: !0
                    },
                    attr: function (c, g, a, y) {
                        var t, d, e = c.nodeType;
                        if (c && !(3 === e || 8 === e || 2 === e)) {
                            if (y && g in f.attrFn) return f(c)[g](a);
                            if ("undefined" === typeof c.getAttribute) return f.prop(c, g, a);
                            if (y = 1 !== e || !f.isXMLDoc(c)) g = g.toLowerCase(), d = f.attrHooks[g] || (R.test(g) ? da : p);
                            if (a !== b) if (null === a) f.removeAttr(c, g);
                            else {
                                if (d && "set" in d && y && (t = d.set(c, a, g)) !== b) return t;
                                c.setAttribute(g, "" + a);
                                return a
                            } else {
                                if (d && "get" in d && y && null !== (t = d.get(c, g))) return t;
                                t = c.getAttribute(g);
                                return null === t ? b : t
                            }
                        }
                    },
                    removeAttr: function (c, g) {
                        var a, b, d, e, i = 0;
                        if (g && 1 === c.nodeType) {
                            b = g.toLowerCase().split(x);
                            for (e = b.length; i < e; i++) if (d = b[i]) a = f.propFix[d] || d, f.attr(c, d, ""), c.removeAttribute(ua ? d : a), R.test(d) && a in c && (c[a] = !1)
                        }
                    },
                    attrHooks: {
                        type: {
                            set: function (c, g) {
                                if (J.test(c.nodeName) && c.parentNode) f.error("type property can't be changed");
                                else if (!f.support.radioValue && "radio" === g && f.nodeName(c, "input")) {
                                    var a = c.value;
                                    c.setAttribute("type", g);
                                    if (a) c.value = a;
                                    return g
                                }
                            }
                        },
                        value: {
                            get: function (c, g) {
                                return p && f.nodeName(c, "button") ? p.get(c, g) : g in c ? c.value : null
                            },
                            set: function (c, g, a) {
                                if (p && f.nodeName(c, "button")) return p.set(c, g, a);
                                c.value = g
                            }
                        }
                    },
                    propFix: {
                        tabindex: "tabIndex",
                        readonly: "readOnly",
                        "for": "htmlFor",
                        "class": "className",
                        maxlength: "maxLength",
                        cellspacing: "cellSpacing",
                        cellpadding: "cellPadding",
                        rowspan: "rowSpan",
                        colspan: "colSpan",
                        usemap: "useMap",
                        frameborder: "frameBorder",
                        contenteditable: "contentEditable"
                    },
                    prop: function (c, g, a) {
                        var y, d, e = c.nodeType;
                        if (c && !(3 === e || 8 === e || 2 === e)) {
                            if (1 !== e || !f.isXMLDoc(c)) g = f.propFix[g] || g, d = f.propHooks[g];
                            return a !== b ? d && "set" in d && (y = d.set(c, a, g)) !== b ? y : c[g] = a : d && "get" in d && null !== (y = d.get(c, g)) ? y : c[g]
                        }
                    },
                    propHooks: {
                        tabIndex: {
                            get: function (c) {
                                var g = c.getAttributeNode("tabindex");
                                return g && g.specified ? parseInt(g.value, 10) : P.test(c.nodeName) || N.test(c.nodeName) && c.href ? 0 : b
                            }
                        }
                    }
                });
                f.attrHooks.tabindex = f.propHooks.tabIndex;
                da = {
                    get: function (c, g) {
                        var a, y = f.prop(c, g);
                        return !0 === y || "boolean" !== typeof y && (a = c.getAttributeNode(g)) && !1 !== a.nodeValue ? g.toLowerCase() : b
                    },
                    set: function (c, g, a) {
                        !1 === g ? f.removeAttr(c, a) : (g = f.propFix[a] || a, g in c && (c[g] = !0), c.setAttribute(a, a.toLowerCase()));
                        return a
                    }
                };
                if (!ua) W = {
                    name: !0,
                    id: !0
                }, p = f.valHooks.button = {
                    get: function (c, g) {
                        var f;
                        return (f = c.getAttributeNode(g)) && (W[g] ? "" !== f.nodeValue : f.specified) ? f.nodeValue : b
                    },
                    set: function (c, g, f) {
                        var a = c.getAttributeNode(f);
                        a || (a = z.createAttribute(f), c.setAttributeNode(a));
                        return a.nodeValue = g + ""
                    }
                }, f.attrHooks.tabindex.set = p.set, f.each(["width", "height"], function (c, g) {
                    f.attrHooks[g] = f.extend(f.attrHooks[g], {
                        set: function (c, f) {
                            if ("" === f) return c.setAttribute(g, "auto"), f
                        }
                    })
                }), f.attrHooks.contenteditable = {
                    get: p.get,
                    set: function (c, g, f) {
                        "" === g && (g = "false");
                        p.set(c, g, f)
                    }
                };
                f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function (c, g) {
                    f.attrHooks[g] = f.extend(f.attrHooks[g], {
                        get: function (c) {
                            c = c.getAttribute(g, 2);
                            return null === c ? b : c
                        }
                    })
                });
                if (!f.support.style) f.attrHooks.style = {
                    get: function (c) {
                        return c.style.cssText.toLowerCase() || b
                    },
                    set: function (c, g) {
                        return c.style.cssText = "" + g
                    }
                };
                if (!f.support.optSelected) f.propHooks.selected = f.extend(f.propHooks.selected, {
                    get: function () {
                        return null
                    }
                });
                if (!f.support.enctype) f.propFix.enctype = "encoding";
                f.support.checkOn || f.each(["radio", "checkbox"], function () {
                    f.valHooks[this] = {
                        get: function (c) {
                            return null === c.getAttribute("value") ? "on" : c.value
                        }
                    }
                });
                f.each(["radio", "checkbox"], function () {
                    f.valHooks[this] = f.extend(f.valHooks[this], {
                        set: function (c, g) {
                            if (f.isArray(g)) return c.checked = 0 <= f.inArray(f(c).val(), g)
                        }
                    })
                });
                var ma = /^(?:textarea|input|select)$/i,
                    Sa = /^([^\.]*)?(?:\.(.+))?$/,
                    pb = /\bhover(\.\S+)?\b/,
                    qb = /^key/,
                    rb = /^(?:mouse|contextmenu)|click/,
                    Ta = /^(?:focusinfocus|focusoutblur)$/,
                    sb = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
                    tb = function (c) {
                        if (c = sb.exec(c)) c[1] = (c[1] || "").toLowerCase(), c[3] = c[3] && RegExp("(?:^|\\s)" + c[3] + "(?:\\s|$)");
                        return c
                    },
                    Ua = function (c) {
                        return f.event.special.hover ? c : c.replace(pb, "mouseenter$1 mouseleave$1")
                    };
                f.event = {
                    add: function (c, g, a, y, d) {
                        var e, i, p, m, A, j, o, r, h;
                        if (!(3 === c.nodeType || 8 === c.nodeType || !g || !a || !(e = f._data(c)))) {
                            if (a.handler) o = a, a = o.handler;
                            if (!a.guid) a.guid = f.guid++;
                            p = e.events;
                            if (!p) e.events = p = {};
                            i = e.handle;
                            if (!i) e.handle = i = function (c) {
                                return "undefined" !== typeof f && (!c || f.event.triggered !== c.type) ? f.event.dispatch.apply(i.elem, arguments) : b
                            }, i.elem = c;
                            g = f.trim(Ua(g)).split(" ");
                            for (e = 0; e < g.length; e++) {
                                m = Sa.exec(g[e]) || [];
                                A = m[1];
                                j = (m[2] || "").split(".").sort();
                                h = f.event.special[A] || {};
                                A = (d ? h.delegateType : h.bindType) || A;
                                h = f.event.special[A] || {};
                                m = f.extend({
                                    type: A,
                                    origType: m[1],
                                    data: y,
                                    handler: a,
                                    guid: a.guid,
                                    selector: d,
                                    quick: tb(d),
                                    namespace: j.join(".")
                                }, o);
                                r = p[A];
                                if (!r && (r = p[A] = [], r.delegateCount = 0, !h.setup || !1 === h.setup.call(c, y, j, i))) c.addEventListener ? c.addEventListener(A, i, !1) : c.attachEvent && c.attachEvent("on" + A, i);
                                if (h.add && (h.add.call(c, m), !m.handler.guid)) m.handler.guid = a.guid;
                                d ? r.splice(r.delegateCount++, 0, m) : r.push(m);
                                f.event.global[A] = !0
                            }
                            c = null
                        }
                    },
                    global: {},
                    remove: function (c, g, a, b, d) {
                        var e = f.hasData(c) && f._data(c),
                            i, p, m, A, j, o, r, h, H, Z;
                        if (e && (r = e.events)) {
                            g = f.trim(Ua(g || "")).split(" ");
                            for (i = 0; i < g.length; i++) if (p = Sa.exec(g[i]) || [], m = A = p[1], p = p[2], m) {
                                h = f.event.special[m] || {};
                                m = (b ? h.delegateType : h.bindType) || m;
                                H = r[m] || [];
                                j = H.length;
                                p = p ? RegExp("(^|\\.)" + p.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                                for (o = 0; o < H.length; o++) if (Z = H[o], (d || A === Z.origType) && (!a || a.guid === Z.guid) && (!p || p.test(Z.namespace)) && (!b || b === Z.selector || "**" === b && Z.selector)) H.splice(o--, 1), Z.selector && H.delegateCount--, h.remove && h.remove.call(c, Z);
                                0 === H.length && j !== H.length && ((!h.teardown || !1 === h.teardown.call(c, p)) && f.removeEvent(c, m, e.handle), delete r[m])
                            } else for (m in r) r.hasOwnProperty(m) && f.event.remove(c, m + g[i], a, b, !0);
                            if (f.isEmptyObject(r)) {
                                if (g = e.handle) g.elem = null;
                                f.removeData(c, ["events", "handle"], !0)
                            }
                        }
                    },
                    customEvent: {
                        getData: !0,
                        setData: !0,
                        changeData: !0
                    },
                    trigger: function (c, g, l, d) {
                        if (!l || !(3 === l.nodeType || 8 === l.nodeType)) {
                            var e = c.type || c,
                                i = [],
                                p, m, A, j, r;
                            if (!Ta.test(e + f.event.triggered) && (0 <= e.indexOf("!") && (e = e.slice(0, -1), p = !0), 0 <= e.indexOf(".") && (i = e.split("."), e = i.shift(), i.sort()), l && !f.event.customEvent[e] || f.event.global[e])) if (c = "object" === typeof c ? c[f.expando] ? c : new f.Event(e, c) : new f.Event(e), c.type = e, c.isTrigger = !0, c.exclusive = p, c.namespace = i.join("."), c.namespace_re = c.namespace ? RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, p = 0 > e.indexOf(":") ? "on" + e : "", l) {
                                c.result = b;
                                if (!c.target) c.target = l;
                                g = null != g ? f.makeArray(g) : [];
                                g.unshift(c);
                                A = f.event.special[e] || {};
                                if (!(A.trigger && !1 === A.trigger.apply(l, g))) {
                                    r = [
                                        [l, A.bindType || e]
                                    ];
                                    if (!d && !A.noBubble && !f.isWindow(l)) {
                                        j = A.delegateType || e;
                                        i = Ta.test(j + e) ? l : l.parentNode;
                                        for (m = null; i; i = i.parentNode) r.push([i, j]), m = i;
                                        m && m === l.ownerDocument && r.push([m.defaultView || m.parentWindow || a, j])
                                    }
                                    for (m = 0; m < r.length && !c.isPropagationStopped(); m++) i = r[m][0], c.type = r[m][1], (j = (f._data(i, "events") || {})[c.type] && f._data(i, "handle")) && j.apply(i, g), (j = p && i[p]) && f.acceptData(i) && !1 === j.apply(i, g) && c.preventDefault();
                                    c.type = e;
                                    if (!d && !c.isDefaultPrevented() && (!A._default || !1 === A._default.apply(l.ownerDocument, g)) && !("click" === e && f.nodeName(l, "a")) && f.acceptData(l)) if (p && l[e] && ("focus" !== e && "blur" !== e || 0 !== c.target.offsetWidth) && !f.isWindow(l))(m = l[p]) && (l[p] = null), f.event.triggered = e, l[e](), f.event.triggered = b, m && (l[p] = m);
                                    return c.result
                                }
                            } else for (m in l = f.cache, l) l[m].events && l[m].events[e] && f.event.trigger(c, g, l[m].handle.elem, !0)
                        }
                    },
                    dispatch: function (c) {
                        var c = f.event.fix(c || a.event),
                            g = (f._data(this, "events") || {})[c.type] || [],
                            l = g.delegateCount,
                            d = [].slice.call(arguments, 0),
                            e = !c.exclusive && !c.namespace,
                            i = [],
                            p, m, A, j, r, o, h;
                        d[0] = c;
                        c.delegateTarget = this;
                        if (l && !c.target.disabled && !(c.button && "click" === c.type)) {
                            A = f(this);
                            A.context = this.ownerDocument || this;
                            for (m = c.target; m != this; m = m.parentNode || this) {
                                r = {};
                                o = [];
                                A[0] = m;
                                for (p = 0; p < l; p++) {
                                    j = g[p];
                                    h = j.selector;
                                    if (r[h] === b) {
                                        var H = r,
                                            da = h,
                                            z;
                                        if (j.quick) {
                                            z = j.quick;
                                            var q = m.attributes || {};
                                            z = (!z[1] || m.nodeName.toLowerCase() === z[1]) && (!z[2] || (q.id || {}).value === z[2]) && (!z[3] || z[3].test((q["class"] || {}).value))
                                        } else z = A.is(h);
                                        H[da] = z
                                    }
                                    r[h] && o.push(j)
                                }
                                o.length && i.push({
                                    elem: m,
                                    matches: o
                                })
                            }
                        }
                        g.length > l && i.push({
                            elem: this,
                            matches: g.slice(l)
                        });
                        for (p = 0; p < i.length && !c.isPropagationStopped(); p++) {
                            l = i[p];
                            c.currentTarget = l.elem;
                            for (g = 0; g < l.matches.length && !c.isImmediatePropagationStopped(); g++) if (j = l.matches[g], e || !c.namespace && !j.namespace || c.namespace_re && c.namespace_re.test(j.namespace)) if (c.data = j.data, c.handleObj = j, j = ((f.event.special[j.origType] || {}).handle || j.handler).apply(l.elem, d), j !== b) c.result = j, !1 === j && (c.preventDefault(), c.stopPropagation())
                        }
                        return c.result
                    },
                    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                    fixHooks: {},
                    keyHooks: {
                        props: "char charCode key keyCode".split(" "),
                        filter: function (c, g) {
                            if (null == c.which) c.which = null != g.charCode ? g.charCode : g.keyCode;
                            return c
                        }
                    },
                    mouseHooks: {
                        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                        filter: function (c, g) {
                            var a, f, d = g.button,
                                e = g.fromElement;
                            if (null == c.pageX && null != g.clientX) a = c.target.ownerDocument || z, f = a.documentElement, a = a.body, c.pageX = g.clientX + (f && f.scrollLeft || a && a.scrollLeft || 0) - (f && f.clientLeft || a && a.clientLeft || 0), c.pageY = g.clientY + (f && f.scrollTop || a && a.scrollTop || 0) - (f && f.clientTop || a && a.clientTop || 0);
                            if (!c.relatedTarget && e) c.relatedTarget = e === c.target ? g.toElement : e;
                            if (!c.which && d !== b) c.which = d & 1 ? 1 : d & 2 ? 3 : d & 4 ? 2 : 0;
                            return c
                        }
                    },
                    fix: function (c) {
                        if (c[f.expando]) return c;
                        var g, a, d = c,
                            e = f.event.fixHooks[c.type] || {},
                            i = e.props ? this.props.concat(e.props) : this.props,
                            c = f.Event(d);
                        for (g = i.length; g;) a = i[--g], c[a] = d[a];
                        if (!c.target) c.target = d.srcElement || z;
                        if (3 === c.target.nodeType) c.target = c.target.parentNode;
                        if (c.metaKey === b) c.metaKey = c.ctrlKey;
                        return e.filter ? e.filter(c, d) : c
                    },
                    special: {
                        ready: {
                            setup: f.bindReady
                        },
                        load: {
                            noBubble: !0
                        },
                        focus: {
                            delegateType: "focusin"
                        },
                        blur: {
                            delegateType: "focusout"
                        },
                        beforeunload: {
                            setup: function (c, g, a) {
                                if (f.isWindow(this)) this.onbeforeunload = a
                            },
                            teardown: function (c, g) {
                                if (this.onbeforeunload === g) this.onbeforeunload = null
                            }
                        }
                    },
                    simulate: function (c, g, a, b) {
                        c = f.extend(new f.Event, a, {
                            type: c,
                            isSimulated: !0,
                            originalEvent: {}
                        });
                        b ? f.event.trigger(c, null, g) : f.event.dispatch.call(g, c);
                        c.isDefaultPrevented() && a.preventDefault()
                    }
                };
                f.event.handle = f.event.dispatch;
                f.removeEvent = z.removeEventListener ?
                function (c, g, a) {
                    c.removeEventListener && c.removeEventListener(g, a, !1)
                } : function (c, g, a) {
                    c.detachEvent && c.detachEvent("on" + g, a)
                };
                f.Event = function (c, g) {
                    if (!(this instanceof f.Event)) return new f.Event(c, g);
                    c && c.type ? (this.originalEvent = c, this.type = c.type, this.isDefaultPrevented = c.defaultPrevented || !1 === c.returnValue || c.getPreventDefault && c.getPreventDefault() ? q : h) : this.type = c;
                    g && f.extend(this, g);
                    this.timeStamp = c && c.timeStamp || f.now();
                    this[f.expando] = !0
                };
                f.Event.prototype = {
                    preventDefault: function () {
                        this.isDefaultPrevented = q;
                        var c = this.originalEvent;
                        if (c) c.preventDefault ? c.preventDefault() : c.returnValue = !1
                    },
                    stopPropagation: function () {
                        this.isPropagationStopped = q;
                        var c = this.originalEvent;
                        if (c) c.stopPropagation && c.stopPropagation(), c.cancelBubble = !0
                    },
                    stopImmediatePropagation: function () {
                        this.isImmediatePropagationStopped = q;
                        this.stopPropagation()
                    },
                    isDefaultPrevented: h,
                    isPropagationStopped: h,
                    isImmediatePropagationStopped: h
                };
                f.each({
                    mouseenter: "mouseover",
                    mouseleave: "mouseout"
                }, function (c, g) {
                    f.event.special[c] = {
                        delegateType: g,
                        bindType: g,
                        handle: function (c) {
                            var a = c.relatedTarget,
                                b = c.handleObj,
                                d;
                            if (!a || a !== this && !f.contains(this, a)) c.type = b.origType, d = b.handler.apply(this, arguments), c.type = g;
                            return d
                        }
                    }
                });
                if (!f.support.submitBubbles) f.event.special.submit = {
                    setup: function () {
                        if (f.nodeName(this, "form")) return !1;
                        f.event.add(this, "click._submit keypress._submit", function (c) {
                            c = c.target;
                            if ((c = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b) && !c._submit_attached) f.event.add(c, "submit._submit", function (c) {
                                this.parentNode && !c.isTrigger && f.event.simulate("submit", this.parentNode, c, !0)
                            }), c._submit_attached = !0
                        })
                    },
                    teardown: function () {
                        if (f.nodeName(this, "form")) return !1;
                        f.event.remove(this, "._submit")
                    }
                };
                if (!f.support.changeBubbles) f.event.special.change = {
                    setup: function () {
                        if (ma.test(this.nodeName)) {
                            if ("checkbox" === this.type || "radio" === this.type) f.event.add(this, "propertychange._change", function (c) {
                                if ("checked" === c.originalEvent.propertyName) this._just_changed = !0
                            }), f.event.add(this, "click._change", function (c) {
                                if (this._just_changed && !c.isTrigger) this._just_changed = !1, f.event.simulate("change", this, c, !0)
                            });
                            return !1
                        }
                        f.event.add(this, "beforeactivate._change", function (c) {
                            c = c.target;
                            if (ma.test(c.nodeName) && !c._change_attached) f.event.add(c, "change._change", function (c) {
                                this.parentNode && !c.isSimulated && !c.isTrigger && f.event.simulate("change", this.parentNode, c, !0)
                            }), c._change_attached = !0
                        })
                    },
                    handle: function (c) {
                        var g = c.target;
                        if (this !== g || c.isSimulated || c.isTrigger || "radio" !== g.type && "checkbox" !== g.type) return c.handleObj.handler.apply(this, arguments)
                    },
                    teardown: function () {
                        f.event.remove(this, "._change");
                        return ma.test(this.nodeName)
                    }
                };
                f.support.focusinBubbles || f.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function (c, g) {
                    var a = 0,
                        b = function (c) {
                            f.event.simulate(g, c.target, f.event.fix(c), !0)
                        };
                    f.event.special[g] = {
                        setup: function () {
                            0 === a++ && z.addEventListener(c, b, !0)
                        },
                        teardown: function () {
                            0 === --a && z.removeEventListener(c, b, !0)
                        }
                    }
                });
                f.fn.extend({
                    on: function (c, g, a, d, e) {
                        var i, p;
                        if ("object" === typeof c) {
                            "string" !== typeof g && (a = g, g = b);
                            for (p in c) this.on(p, g, a, c[p], e);
                            return this
                        }
                        null == a && null == d ? (d = g, a = g = b) : null == d && ("string" === typeof g ? (d = a, a = b) : (d = a, a = g, g = b));
                        if (!1 === d) d = h;
                        else if (!d) return this;
                        if (1 === e) i = d, d = function (c) {
                            f().off(c);
                            return i.apply(this, arguments)
                        }, d.guid = i.guid || (i.guid = f.guid++);
                        return this.each(function () {
                            f.event.add(this, c, d, a, g)
                        })
                    },
                    one: function (c, g, a, f) {
                        return this.on.call(this, c, g, a, f, 1)
                    },
                    off: function (c, g, a) {
                        if (c && c.preventDefault && c.handleObj) {
                            var d = c.handleObj;
                            f(c.delegateTarget).off(d.namespace ? d.type + "." + d.namespace : d.type, d.selector, d.handler);
                            return this
                        }
                        if ("object" === typeof c) {
                            for (d in c) this.off(d, g, c[d]);
                            return this
                        }
                        if (!1 === g || "function" === typeof g) a = g, g = b;
                        !1 === a && (a = h);
                        return this.each(function () {
                            f.event.remove(this, c, a, g)
                        })
                    },
                    bind: function (c, g, a) {
                        return this.on(c, null, g, a)
                    },
                    unbind: function (c, g) {
                        return this.off(c, null, g)
                    },
                    live: function (c, g, a) {
                        f(this.context).on(c, this.selector, g, a);
                        return this
                    },
                    die: function (c, g) {
                        f(this.context).off(c, this.selector || "**", g);
                        return this
                    },
                    delegate: function (c, g, a, f) {
                        return this.on(g, c, a, f)
                    },
                    undelegate: function (c, g, a) {
                        return 1 == arguments.length ? this.off(c, "**") : this.off(g, c, a)
                    },
                    trigger: function (c, g) {
                        return this.each(function () {
                            f.event.trigger(c, g, this)
                        })
                    },
                    triggerHandler: function (c, g) {
                        if (this[0]) return f.event.trigger(c, g, this[0], !0)
                    },
                    toggle: function (c) {
                        var g = arguments,
                            a = c.guid || f.guid++,
                            b = 0,
                            d = function (a) {
                                var l = (f._data(this, "lastToggle" + c.guid) || 0) % b;
                                f._data(this, "lastToggle" + c.guid, l + 1);
                                a.preventDefault();
                                return g[l].apply(this, arguments) || !1
                            };
                        for (d.guid = a; b < g.length;) g[b++].guid = a;
                        return this.click(d)
                    },
                    hover: function (c, g) {
                        return this.mouseenter(c).mouseleave(g || c)
                    }
                });
                f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (c, g) {
                    f.fn[g] = function (c, a) {
                        null == a && (a = c, c = null);
                        return 0 < arguments.length ? this.on(g, null, c, a) : this.trigger(g)
                    };
                    f.attrFn && (f.attrFn[g] = !0);
                    if (qb.test(g)) f.event.fixHooks[g] = f.event.keyHooks;
                    if (rb.test(g)) f.event.fixHooks[g] = f.event.mouseHooks
                });
                (function () {
                    function c(c, g, a, f, b, l) {
                        for (var b = 0, e = f.length; b < e; b++) {
                            var i = f[b];
                            if (i) {
                                for (var p = !1, i = i[c]; i;) {
                                    if (i[d] === a) {
                                        p = f[i.sizset];
                                        break
                                    }
                                    if (1 === i.nodeType && !l) i[d] = a, i.sizset = b;
                                    if (i.nodeName.toLowerCase() === g) {
                                        p = i;
                                        break
                                    }
                                    i = i[c]
                                }
                                f[b] = p
                            }
                        }
                    }
                    function g(c, g, a, f, b, l) {
                        for (var b = 0, e = f.length; b < e; b++) {
                            var i = f[b];
                            if (i) {
                                for (var p = !1, i = i[c]; i;) {
                                    if (i[d] === a) {
                                        p = f[i.sizset];
                                        break
                                    }
                                    if (1 === i.nodeType) {
                                        if (!l) i[d] = a, i.sizset = b;
                                        if ("string" !== typeof g) {
                                            if (i === g) {
                                                p = !0;
                                                break
                                            }
                                        } else if (0 < o.filter(g, [i]).length) {
                                            p = i;
                                            break
                                        }
                                    }
                                    i = i[c]
                                }
                                f[b] = p
                            }
                        }
                    }
                    var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                        d = "sizcache" + (Math.random() + "").replace(".", ""),
                        e = 0,
                        i = Object.prototype.toString,
                        p = !1,
                        m = !0,
                        A = /\\/g,
                        j = /\r\n/g,
                        r = /\W/;
                    [0, 0].sort(function () {
                        m = !1;
                        return 0
                    });
                    var o = function (c, g, f, b) {
                            var f = f || [],
                                d = g = g || z;
                            if (1 !== g.nodeType && 9 !== g.nodeType) return [];
                            if (!c || "string" !== typeof c) return f;
                            var e, p, y, t, m, A = !0,
                                j = o.isXML(g),
                                r = [],
                                h = c;
                            do if (a.exec(""), e = a.exec(h)) if (h = e[3], r.push(e[1]), e[2]) {
                                t = e[3];
                                break
                            }
                            while (e);
                            if (1 < r.length && da.exec(c)) if (2 === r.length && H.relative[r[0]]) p = aa(r[0] + r[1], g, b);
                            else for (p = H.relative[r[0]] ? [g] : o(r.shift(), g); r.length;) c = r.shift(), H.relative[c] && (c += r.shift()), p = aa(c, p, b);
                            else if (!b && 1 < r.length && 9 === g.nodeType && !j && H.match.ID.test(r[0]) && !H.match.ID.test(r[r.length - 1]) && (e = o.find(r.shift(), g, j), g = e.expr ? o.filter(e.expr, e.set)[0] : e.set[0]), g) {
                                e = b ? {
                                    expr: r.pop(),
                                    set: M(b)
                                } : o.find(r.pop(), 1 === r.length && ("~" === r[0] || "+" === r[0]) && g.parentNode ? g.parentNode : g, j);
                                p = e.expr ? o.filter(e.expr, e.set) : e.set;
                                for (0 < r.length ? y = M(p) : A = !1; r.length;) e = m = r.pop(), H.relative[m] ? e = r.pop() : m = "", null == e && (e = g), H.relative[m](y, e, j)
                            } else y = [];
                            y || (y = p);
                            y || o.error(m || c);
                            if ("[object Array]" === i.call(y)) if (A) if (g && 1 === g.nodeType) for (c = 0; null != y[c]; c++) y[c] && (!0 === y[c] || 1 === y[c].nodeType && o.contains(g, y[c])) && f.push(p[c]);
                            else for (c = 0; null != y[c]; c++) y[c] && 1 === y[c].nodeType && f.push(p[c]);
                            else f.push.apply(f, y);
                            else M(y, f);
                            t && (o(t, d, f, b), o.uniqueSort(f));
                            return f
                        };
                    o.uniqueSort = function (c) {
                        if (n && (p = m, c.sort(n), p)) for (var g = 1; g < c.length; g++) c[g] === c[g - 1] && c.splice(g--, 1);
                        return c
                    };
                    o.matches = function (c, g) {
                        return o(c, null, null, g)
                    };
                    o.matchesSelector = function (c, g) {
                        return 0 < o(g, null, null, [c]).length
                    };
                    o.find = function (c, g, a) {
                        var f, b, d, l, e, i;
                        if (!c) return [];
                        for (b = 0, d = H.order.length; b < d; b++) if (e = H.order[b], l = H.leftMatch[e].exec(c)) if (i = l[1], l.splice(1, 1), "\\" !== i.substr(i.length - 1) && (l[1] = (l[1] || "").replace(A, ""), f = H.find[e](l, g, a), null != f)) {
                            c = c.replace(H.match[e], "");
                            break
                        }
                        f || (f = "undefined" !== typeof g.getElementsByTagName ? g.getElementsByTagName("*") : []);
                        return {
                            set: f,
                            expr: c
                        }
                    };
                    o.filter = function (c, g, a, f) {
                        for (var l, d, e, i, p, y, t, m, A = c, r = [], j = g, h = g && g[0] && o.isXML(g[0]); c && g.length;) {
                            for (e in H.filter) if (null != (l = H.leftMatch[e].exec(c)) && l[2]) if (y = H.filter[e], p = l[1], d = !1, l.splice(1, 1), "\\" !== p.substr(p.length - 1)) {
                                j === r && (r = []);
                                if (H.preFilter[e]) if (l = H.preFilter[e](l, j, a, r, f, h)) {
                                    if (!0 === l) continue
                                } else d = i = !0;
                                if (l) for (t = 0; null != (p = j[t]); t++) p && (i = y(p, l, t, j), m = f ^ i, a && null != i ? m ? d = !0 : j[t] = !1 : m && (r.push(p), d = !0));
                                if (i !== b) {
                                    a || (j = r);
                                    c = c.replace(H.match[e], "");
                                    if (!d) return [];
                                    break
                                }
                            }
                            if (c === A) if (null == d) o.error(c);
                            else break;
                            A = c
                        }
                        return j
                    };
                    o.error = function (c) {
                        throw Error("Syntax error, unrecognized expression: " + c);
                    };
                    var h = o.getText = function (c) {
                            var g, a;
                            g = c.nodeType;
                            var f = "";
                            if (g) if (1 === g || 9 === g) {
                                if ("string" === typeof c.textContent) return c.textContent;
                                if ("string" === typeof c.innerText) return c.innerText.replace(j, "");
                                for (c = c.firstChild; c; c = c.nextSibling) f += h(c)
                            } else {
                                if (3 === g || 4 === g) return c.nodeValue
                            } else for (g = 0; a = c[g]; g++) 8 !== a.nodeType && (f += h(a));
                            return f
                        },
                        H = o.selectors = {
                            order: ["ID", "NAME", "TAG"],
                            match: {
                                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                            },
                            leftMatch: {},
                            attrMap: {
                                "class": "className",
                                "for": "htmlFor"
                            },
                            attrHandle: {
                                href: function (c) {
                                    return c.getAttribute("href")
                                },
                                type: function (c) {
                                    return c.getAttribute("type")
                                }
                            },
                            relative: {
                                "+": function (c, g) {
                                    var a = "string" === typeof g,
                                        f = a && !r.test(g),
                                        a = a && !f;
                                    f && (g = g.toLowerCase());
                                    for (var f = 0, b = c.length, l; f < b; f++) if (l = c[f]) {
                                        for (;
                                        (l = l.previousSibling) && 1 !== l.nodeType;);
                                        c[f] = a || l && l.nodeName.toLowerCase() === g ? l || !1 : l === g
                                    }
                                    a && o.filter(g, c, !0)
                                },
                                ">": function (c, g) {
                                    var a, f = "string" === typeof g,
                                        b = 0,
                                        l = c.length;
                                    if (f && !r.test(g)) for (g = g.toLowerCase(); b < l; b++) {
                                        if (a = c[b]) a = a.parentNode, c[b] = a.nodeName.toLowerCase() === g ? a : !1
                                    } else {
                                        for (; b < l; b++)(a = c[b]) && (c[b] = f ? a.parentNode : a.parentNode === g);
                                        f && o.filter(g, c, !0)
                                    }
                                },
                                "": function (a, f, b) {
                                    var l, d = e++,
                                        i = g;
                                    "string" === typeof f && !r.test(f) && (l = f = f.toLowerCase(), i = c);
                                    i("parentNode", f, d, a, l, b)
                                },
                                "~": function (a, f, b) {
                                    var l, d = e++,
                                        i = g;
                                    "string" === typeof f && !r.test(f) && (l = f = f.toLowerCase(), i = c);
                                    i("previousSibling", f, d, a, l, b)
                                }
                            },
                            find: {
                                ID: function (c, g, a) {
                                    if ("undefined" !== typeof g.getElementById && !a) return (c = g.getElementById(c[1])) && c.parentNode ? [c] : []
                                },
                                NAME: function (c, g) {
                                    if ("undefined" !== typeof g.getElementsByName) {
                                        for (var a = [], f = g.getElementsByName(c[1]), b = 0, l = f.length; b < l; b++) f[b].getAttribute("name") === c[1] && a.push(f[b]);
                                        return 0 === a.length ? null : a
                                    }
                                },
                                TAG: function (c, g) {
                                    if ("undefined" !== typeof g.getElementsByTagName) return g.getElementsByTagName(c[1])
                                }
                            },
                            preFilter: {
                                CLASS: function (c, g, a, f, b, l) {
                                    c = " " + c[1].replace(A, "") + " ";
                                    if (l) return c;
                                    for (var l = 0, d; null != (d = g[l]); l++) d && (b ^ (d.className && 0 <= (" " + d.className + " ").replace(/[\t\n\r]/g, " ").indexOf(c)) ? a || f.push(d) : a && (g[l] = !1));
                                    return !1
                                },
                                ID: function (c) {
                                    return c[1].replace(A, "")
                                },
                                TAG: function (c) {
                                    return c[1].replace(A, "").toLowerCase()
                                },
                                CHILD: function (c) {
                                    if ("nth" === c[1]) {
                                        c[2] || o.error(c[0]);
                                        c[2] = c[2].replace(/^\+|\s*/g, "");
                                        var g = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec("even" === c[2] && "2n" || "odd" === c[2] && "2n+1" || !/\D/.test(c[2]) && "0n+" + c[2] || c[2]);
                                        c[2] = g[1] + (g[2] || 1) - 0;
                                        c[3] = g[3] - 0
                                    } else c[2] && o.error(c[0]);
                                    c[0] = e++;
                                    return c
                                },
                                ATTR: function (c, g, a, f, b, l) {
                                    g = c[1] = c[1].replace(A, "");
                                    !l && H.attrMap[g] && (c[1] = H.attrMap[g]);
                                    c[4] = (c[4] || c[5] || "").replace(A, "");
                                    "~=" === c[2] && (c[4] = " " + c[4] + " ");
                                    return c
                                },
                                PSEUDO: function (c, g, f, b, d) {
                                    if ("not" === c[1]) if (1 < (a.exec(c[3]) || "").length || /^\w/.test(c[3])) c[3] = o(c[3], null, null, g);
                                    else return c = o.filter(c[3], g, f, 1 ^ d), f || b.push.apply(b, c), !1;
                                    else if (H.match.POS.test(c[0]) || H.match.CHILD.test(c[0])) return !0;
                                    return c
                                },
                                POS: function (c) {
                                    c.unshift(!0);
                                    return c
                                }
                            },
                            filters: {
                                enabled: function (c) {
                                    return !1 === c.disabled && "hidden" !== c.type
                                },
                                disabled: function (c) {
                                    return !0 === c.disabled
                                },
                                checked: function (c) {
                                    return !0 === c.checked
                                },
                                selected: function (c) {
                                    return !0 === c.selected
                                },
                                parent: function (c) {
                                    return !!c.firstChild
                                },
                                empty: function (c) {
                                    return !c.firstChild
                                },
                                has: function (c, g, a) {
                                    return !!o(a[3], c).length
                                },
                                header: function (c) {
                                    return /h\d/i.test(c.nodeName)
                                },
                                text: function (c) {
                                    var g = c.getAttribute("type"),
                                        a = c.type;
                                    return "input" === c.nodeName.toLowerCase() && "text" === a && (g === a || null === g)
                                },
                                radio: function (c) {
                                    return "input" === c.nodeName.toLowerCase() && "radio" === c.type
                                },
                                checkbox: function (c) {
                                    return "input" === c.nodeName.toLowerCase() && "checkbox" === c.type
                                },
                                file: function (c) {
                                    return "input" === c.nodeName.toLowerCase() && "file" === c.type
                                },
                                password: function (c) {
                                    return "input" === c.nodeName.toLowerCase() && "password" === c.type
                                },
                                submit: function (c) {
                                    var g = c.nodeName.toLowerCase();
                                    return ("input" === g || "button" === g) && "submit" === c.type
                                },
                                image: function (c) {
                                    return "input" === c.nodeName.toLowerCase() && "image" === c.type
                                },
                                reset: function (c) {
                                    var g = c.nodeName.toLowerCase();
                                    return ("input" === g || "button" === g) && "reset" === c.type
                                },
                                button: function (c) {
                                    var g = c.nodeName.toLowerCase();
                                    return "input" === g && "button" === c.type || "button" === g
                                },
                                input: function (c) {
                                    return /input|select|textarea|button/i.test(c.nodeName)
                                },
                                focus: function (c) {
                                    return c === c.ownerDocument.activeElement
                                }
                            },
                            setFilters: {
                                first: function (c, g) {
                                    return 0 === g
                                },
                                last: function (c, g, a, f) {
                                    return g === f.length - 1
                                },
                                even: function (c, g) {
                                    return 0 === g % 2
                                },
                                odd: function (c, g) {
                                    return 1 === g % 2
                                },
                                lt: function (c, g, a) {
                                    return g < a[3] - 0
                                },
                                gt: function (c, g, a) {
                                    return g > a[3] - 0
                                },
                                nth: function (c, g, a) {
                                    return a[3] - 0 === g
                                },
                                eq: function (c, g, a) {
                                    return a[3] - 0 === g
                                }
                            },
                            filter: {
                                PSEUDO: function (c, g, a, f) {
                                    var b = g[1],
                                        l = H.filters[b];
                                    if (l) return l(c, a, g, f);
                                    if ("contains" === b) return 0 <= (c.textContent || c.innerText || h([c]) || "").indexOf(g[3]);
                                    if ("not" === b) {
                                        g = g[3];
                                        a = 0;
                                        for (f = g.length; a < f; a++) if (g[a] === c) return !1;
                                        return !0
                                    }
                                    o.error(b)
                                },
                                CHILD: function (c, g) {
                                    var a, f, b, l, e, i;
                                    a = g[1];
                                    i = c;
                                    switch (a) {
                                    case "only":
                                    case "first":
                                        for (; i = i.previousSibling;) if (1 === i.nodeType) return !1;
                                        if ("first" === a) return !0;
                                        i = c;
                                    case "last":
                                        for (; i = i.nextSibling;) if (1 === i.nodeType) return !1;
                                        return !0;
                                    case "nth":
                                        a = g[2];
                                        f = g[3];
                                        if (1 === a && 0 === f) return !0;
                                        b = g[0];
                                        if ((l = c.parentNode) && (l[d] !== b || !c.nodeIndex)) {
                                            e = 0;
                                            for (i = l.firstChild; i; i = i.nextSibling) if (1 === i.nodeType) i.nodeIndex = ++e;
                                            l[d] = b
                                        }
                                        i = c.nodeIndex - f;
                                        return 0 === a ? 0 === i : 0 === i % a && 0 <= i / a
                                    }
                                },
                                ID: function (c, g) {
                                    return 1 === c.nodeType && c.getAttribute("id") === g
                                },
                                TAG: function (c, g) {
                                    return "*" === g && 1 === c.nodeType || !! c.nodeName && c.nodeName.toLowerCase() === g
                                },
                                CLASS: function (c, g) {
                                    return -1 < (" " + (c.className || c.getAttribute("class")) + " ").indexOf(g)
                                },
                                ATTR: function (c, g) {
                                    var a = g[1],
                                        a = o.attr ? o.attr(c, a) : H.attrHandle[a] ? H.attrHandle[a](c) : null != c[a] ? c[a] : c.getAttribute(a),
                                        f = a + "",
                                        b = g[2],
                                        l = g[4];
                                    return null == a ? "!=" === b : !b && o.attr ? null != a : "=" === b ? f === l : "*=" === b ? 0 <= f.indexOf(l) : "~=" === b ? 0 <= (" " + f + " ").indexOf(l) : !l ? f && !1 !== a : "!=" === b ? f !== l : "^=" === b ? 0 === f.indexOf(l) : "$=" === b ? f.substr(f.length - l.length) === l : "|=" === b ? f === l || f.substr(0, l.length + 1) === l + "-" : !1
                                },
                                POS: function (c, g, a, f) {
                                    var b = H.setFilters[g[2]];
                                    if (b) return b(c, a, g, f)
                                }
                            }
                        },
                        da = H.match.POS,
                        q = function (c, g) {
                            return "\\" + (g - 0 + 1)
                        },
                        s;
                    for (s in H.match) H.match[s] = RegExp(H.match[s].source + /(?![^\[]*\])(?![^\(]*\))/.source), H.leftMatch[s] = RegExp(/(^(?:.|\r|\n)*?)/.source + H.match[s].source.replace(/\\(\d+)/g, q));
                    var M = function (c, g) {
                            c = Array.prototype.slice.call(c, 0);
                            return g ? (g.push.apply(g, c), g) : c
                        };
                    try {
                        Array.prototype.slice.call(z.documentElement.childNodes, 0)
                    } catch (v) {
                        M = function (c, g) {
                            var a = 0,
                                f = g || [];
                            if ("[object Array]" === i.call(c)) Array.prototype.push.apply(f, c);
                            else if ("number" === typeof c.length) for (var b = c.length; a < b; a++) f.push(c[a]);
                            else for (; c[a]; a++) f.push(c[a]);
                            return f
                        }
                    }
                    var n, k;
                    z.documentElement.compareDocumentPosition ? n = function (c, g) {
                        return c === g ? (p = !0, 0) : !c.compareDocumentPosition || !g.compareDocumentPosition ? c.compareDocumentPosition ? -1 : 1 : c.compareDocumentPosition(g) & 4 ? -1 : 1
                    } : (n = function (c, g) {
                        if (c === g) return p = !0, 0;
                        if (c.sourceIndex && g.sourceIndex) return c.sourceIndex - g.sourceIndex;
                        var a, f, b = [],
                            l = [];
                        a = c.parentNode;
                        f = g.parentNode;
                        var d = a;
                        if (a === f) return k(c, g);
                        if (a) {
                            if (!f) return 1
                        } else return -1;
                        for (; d;) b.unshift(d), d = d.parentNode;
                        for (d = f; d;) l.unshift(d), d = d.parentNode;
                        a = b.length;
                        f = l.length;
                        for (d = 0; d < a && d < f; d++) if (b[d] !== l[d]) return k(b[d], l[d]);
                        return d === a ? k(c, l[d], -1) : k(b[d], g, 1)
                    }, k = function (c, g, a) {
                        if (c === g) return a;
                        for (c = c.nextSibling; c;) {
                            if (c === g) return -1;
                            c = c.nextSibling
                        }
                        return 1
                    });
                    (function () {
                        var c = z.createElement("div"),
                            g = "script" + (new Date).getTime(),
                            a = z.documentElement;
                        c.innerHTML = "<a name='" + g + "'/>";
                        a.insertBefore(c, a.firstChild);
                        if (z.getElementById(g)) H.find.ID = function (c, g, a) {
                            if ("undefined" !== typeof g.getElementById && !a) return (g = g.getElementById(c[1])) ? g.id === c[1] || "undefined" !== typeof g.getAttributeNode && g.getAttributeNode("id").nodeValue === c[1] ? [g] : b : []
                        }, H.filter.ID = function (c, g) {
                            var a = "undefined" !== typeof c.getAttributeNode && c.getAttributeNode("id");
                            return 1 === c.nodeType && a && a.nodeValue === g
                        };
                        a.removeChild(c);
                        a = c = null
                    })();
                    (function () {
                        var c = z.createElement("div");
                        c.appendChild(z.createComment(""));
                        if (0 < c.getElementsByTagName("*").length) H.find.TAG = function (c, g) {
                            var a = g.getElementsByTagName(c[1]);
                            if ("*" === c[1]) {
                                for (var f = [], b = 0; a[b]; b++) 1 === a[b].nodeType && f.push(a[b]);
                                a = f
                            }
                            return a
                        };
                        c.innerHTML = "<a href='#'></a>";
                        if (c.firstChild && "undefined" !== typeof c.firstChild.getAttribute && "#" !== c.firstChild.getAttribute("href")) H.attrHandle.href = function (c) {
                            return c.getAttribute("href", 2)
                        };
                        c = null
                    })();
                    z.querySelectorAll &&
                    function () {
                        var c = o,
                            g = z.createElement("div");
                        g.innerHTML = "<p class='TEST'></p>";
                        if (!(g.querySelectorAll && 0 === g.querySelectorAll(".TEST").length)) {
                            o = function (g, a, f, b) {
                                a = a || z;
                                if (!b && !o.isXML(a)) {
                                    var l = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(g);
                                    if (l && (1 === a.nodeType || 9 === a.nodeType)) {
                                        if (l[1]) return M(a.getElementsByTagName(g), f);
                                        if (l[2] && H.find.CLASS && a.getElementsByClassName) return M(a.getElementsByClassName(l[2]), f)
                                    }
                                    if (9 === a.nodeType) {
                                        if ("body" === g && a.body) return M([a.body], f);
                                        if (l && l[3]) {
                                            var d = a.getElementById(l[3]);
                                            if (d && d.parentNode) {
                                                if (d.id === l[3]) return M([d], f)
                                            } else return M([], f)
                                        }
                                        try {
                                            return M(a.querySelectorAll(g), f)
                                        } catch (e) {}
                                    } else if (1 === a.nodeType && "object" !== a.nodeName.toLowerCase()) {
                                        var l = a,
                                            i = (d = a.getAttribute("id")) || "__sizzle__",
                                            p = a.parentNode,
                                            y = /^\s*[+~]/.test(g);
                                        d ? i = i.replace(/'/g, "\\$&") : a.setAttribute("id", i);
                                        if (y && p) a = a.parentNode;
                                        try {
                                            if (!y || p) return M(a.querySelectorAll("[id='" + i + "'] " + g), f)
                                        } catch (t) {} finally {
                                            d || l.removeAttribute("id")
                                        }
                                    }
                                }
                                return c(g, a, f, b)
                            };
                            for (var a in c) o[a] = c[a];
                            g = null
                        }
                    }();
                    (function () {
                        var c = z.documentElement,
                            g = c.matchesSelector || c.mozMatchesSelector || c.webkitMatchesSelector || c.msMatchesSelector;
                        if (g) {
                            var a = !g.call(z.createElement("div"), "div"),
                                f = !1;
                            try {
                                g.call(z.documentElement, "[test!='']:sizzle")
                            } catch (b) {
                                f = !0
                            }
                            o.matchesSelector = function (c, b) {
                                b = b.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                                if (!o.isXML(c)) try {
                                    if (f || !H.match.PSEUDO.test(b) && !/!=/.test(b)) {
                                        var l = g.call(c, b);
                                        if (l || !a || c.document && 11 !== c.document.nodeType) return l
                                    }
                                } catch (d) {}
                                return 0 < o(b, null, null, [c]).length
                            }
                        }
                    })();
                    (function () {
                        var c = z.createElement("div");
                        c.innerHTML = "<div class='test e'></div><div class='test'></div>";
                        if (c.getElementsByClassName && 0 !== c.getElementsByClassName("e").length && (c.lastChild.className = "e", 1 !== c.getElementsByClassName("e").length)) H.order.splice(1, 0, "CLASS"), H.find.CLASS = function (c, g, a) {
                            if ("undefined" !== typeof g.getElementsByClassName && !a) return g.getElementsByClassName(c[1])
                        }, c = null
                    })();
                    o.contains = z.documentElement.contains ?
                    function (c, g) {
                        return c !== g && (c.contains ? c.contains(g) : !0)
                    } : z.documentElement.compareDocumentPosition ?
                    function (c, g) {
                        return !!(c.compareDocumentPosition(g) & 16)
                    } : function () {
                        return !1
                    };
                    o.isXML = function (c) {
                        return (c = (c ? c.ownerDocument || c : 0).documentElement) ? "HTML" !== c.nodeName : !1
                    };
                    var aa = function (c, g, a) {
                            for (var f, b = [], l = "", g = g.nodeType ? [g] : g; f = H.match.PSEUDO.exec(c);) l += f[0], c = c.replace(H.match.PSEUDO, "");
                            c = H.relative[c] ? c + "*" : c;
                            f = 0;
                            for (var d = g.length; f < d; f++) o(c, g[f], b, a);
                            return o.filter(l, b)
                        };
                    o.attr = f.attr;
                    o.selectors.attrMap = {};
                    f.find = o;
                    f.expr = o.selectors;
                    f.expr[":"] = f.expr.filters;
                    f.unique = o.uniqueSort;
                    f.text = o.getText;
                    f.isXMLDoc = o.isXML;
                    f.contains = o.contains
                })();
                var ub = /Until$/,
                    vb = /^(?:parents|prevUntil|prevAll)/,
                    Ka = /,/,
                    Da = /^.[^:#\[\.,]*$/,
                    wb = Array.prototype.slice,
                    Aa = f.expr.match.POS,
                    xb = {
                        children: !0,
                        contents: !0,
                        next: !0,
                        prev: !0
                    };
                f.fn.extend({
                    find: function (c) {
                        var g = this,
                            a, b;
                        if ("string" !== typeof c) return f(c).filter(function () {
                            for (a = 0, b = g.length; a < b; a++) if (f.contains(g[a], this)) return !0
                        });
                        var d = this.pushStack("", "find", c),
                            e, i, p;
                        for (a = 0, b = this.length; a < b; a++) if (e = d.length, f.find(c, this[a], d), 0 < a) for (i = e; i < d.length; i++) for (p = 0; p < e; p++) if (d[p] === d[i]) {
                            d.splice(i--, 1);
                            break
                        }
                        return d
                    },
                    has: function (c) {
                        var g = f(c);
                        return this.filter(function () {
                            for (var c = 0, a = g.length; c < a; c++) if (f.contains(this, g[c])) return !0
                        })
                    },
                    not: function (c) {
                        return this.pushStack(s(this, c, !1), "not", c)
                    },
                    filter: function (c) {
                        return this.pushStack(s(this, c, !0), "filter", c)
                    },
                    is: function (c) {
                        return !!c && ("string" === typeof c ? Aa.test(c) ? 0 <= f(c, this.context).index(this[0]) : 0 < f.filter(c, this).length : 0 < this.filter(c).length)
                    },
                    closest: function (c, g) {
                        var a = [],
                            b, d, e = this[0];
                        if (f.isArray(c)) {
                            for (d = 1; e && e.ownerDocument && e !== g;) {
                                for (b = 0; b < c.length; b++) f(e).is(c[b]) && a.push({
                                    selector: c[b],
                                    elem: e,
                                    level: d
                                });
                                e = e.parentNode;
                                d++
                            }
                            return a
                        }
                        var i = Aa.test(c) || "string" !== typeof c ? f(c, g || this.context) : 0;
                        for (b = 0, d = this.length; b < d; b++) for (e = this[b]; e;) if (i ? -1 < i.index(e) : f.find.matchesSelector(e, c)) {
                            a.push(e);
                            break
                        } else if (e = e.parentNode, !e || !e.ownerDocument || e === g || 11 === e.nodeType) break;
                        a = 1 < a.length ? f.unique(a) : a;
                        return this.pushStack(a, "closest", c)
                    },
                    index: function (c) {
                        return !c ? this[0] && this[0].parentNode ? this.prevAll().length : -1 : "string" === typeof c ? f.inArray(this[0], f(c)) : f.inArray(c.jquery ? c[0] : c, this)
                    },
                    add: function (c, g) {
                        var a = "string" === typeof c ? f(c, g) : f.makeArray(c && c.nodeType ? [c] : c),
                            b = f.merge(this.get(), a);
                        return this.pushStack(!a[0] || !a[0].parentNode || 11 === a[0].parentNode.nodeType || !b[0] || !b[0].parentNode || 11 === b[0].parentNode.nodeType ? b : f.unique(b))
                    },
                    andSelf: function () {
                        return this.add(this.prevObject)
                    }
                });
                f.each({
                    parent: function (c) {
                        return (c = c.parentNode) && 11 !== c.nodeType ? c : null
                    },
                    parents: function (c) {
                        return f.dir(c, "parentNode")
                    },
                    parentsUntil: function (c, g, a) {
                        return f.dir(c, "parentNode", a)
                    },
                    next: function (c) {
                        return f.nth(c, 2, "nextSibling")
                    },
                    prev: function (c) {
                        return f.nth(c, 2, "previousSibling")
                    },
                    nextAll: function (c) {
                        return f.dir(c, "nextSibling")
                    },
                    prevAll: function (c) {
                        return f.dir(c, "previousSibling")
                    },
                    nextUntil: function (c, g, a) {
                        return f.dir(c, "nextSibling", a)
                    },
                    prevUntil: function (c, g, a) {
                        return f.dir(c, "previousSibling", a)
                    },
                    siblings: function (c) {
                        return f.sibling(c.parentNode.firstChild, c)
                    },
                    children: function (c) {
                        return f.sibling(c.firstChild)
                    },
                    contents: function (c) {
                        return f.nodeName(c, "iframe") ? c.contentDocument || c.contentWindow.document : f.makeArray(c.childNodes)
                    }
                }, function (c, g) {
                    f.fn[c] = function (a, b) {
                        var d = f.map(this, g, a);
                        ub.test(c) || (b = a);
                        b && "string" === typeof b && (d = f.filter(b, d));
                        d = 1 < this.length && !xb[c] ? f.unique(d) : d;
                        if ((1 < this.length || Ka.test(b)) && vb.test(c)) d = d.reverse();
                        return this.pushStack(d, c, wb.call(arguments).join(","))
                    }
                });
                f.extend({
                    filter: function (c, g, a) {
                        a && (c = ":not(" + c + ")");
                        return 1 === g.length ? f.find.matchesSelector(g[0], c) ? [g[0]] : [] : f.find.matches(c, g)
                    },
                    dir: function (c, g, a) {
                        for (var d = [], c = c[g]; c && 9 !== c.nodeType && (a === b || 1 !== c.nodeType || !f(c).is(a));) 1 === c.nodeType && d.push(c), c = c[g];
                        return d
                    },
                    nth: function (c, g, a) {
                        for (var g = g || 1, f = 0; c && !(1 === c.nodeType && ++f === g); c = c[a]);
                        return c
                    },
                    sibling: function (c, g) {
                        for (var a = []; c; c = c.nextSibling) 1 === c.nodeType && c !== g && a.push(c);
                        return a
                    }
                });
                var Oa = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
                    yb = / jQuery\d+="(?:\d+|null)"/g,
                    La = /^\s+/,
                    Va = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
                    Wa = /<([\w:]+)/,
                    zb = /<tbody/i,
                    Ab = /<|&#?\w+;/,
                    Bb = /<(?:script|style)/i,
                    Cb = /<(?:script|object|embed|option|style)/i,
                    Xa = RegExp("<(?:" + Oa + ")", "i"),
                    Ya = /checked\s*(?:[^=]|=\s*.checked.)/i,
                    Db = /\/(java|ecma)script/i,
                    jb = /^\s*<!(?:\[CDATA\[|\-\-)/,
                    ea = {
                        option: [1, "<select multiple='multiple'>", "</select>"],
                        legend: [1, "<fieldset>", "</fieldset>"],
                        thead: [1, "<table>", "</table>"],
                        tr: [2, "<table><tbody>", "</tbody></table>"],
                        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                        area: [1, "<map>", "</map>"],
                        _default: [0, "", ""]
                    },
                    Za = n(z);
                ea.optgroup = ea.option;
                ea.tbody = ea.tfoot = ea.colgroup = ea.caption = ea.thead;
                ea.th = ea.td;
                if (!f.support.htmlSerialize) ea._default = [1, "div<div>", "</div>"];
                f.fn.extend({
                    text: function (c) {
                        return f.isFunction(c) ? this.each(function (g) {
                            var a = f(this);
                            a.text(c.call(this, g, a.text()))
                        }) : "object" !== typeof c && c !== b ? this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(c)) : f.text(this)
                    },
                    wrapAll: function (c) {
                        if (f.isFunction(c)) return this.each(function (g) {
                            f(this).wrapAll(c.call(this, g))
                        });
                        if (this[0]) {
                            var g = f(c, this[0].ownerDocument).eq(0).clone(!0);
                            this[0].parentNode && g.insertBefore(this[0]);
                            g.map(function () {
                                for (var c = this; c.firstChild && 1 === c.firstChild.nodeType;) c = c.firstChild;
                                return c
                            }).append(this)
                        }
                        return this
                    },
                    wrapInner: function (c) {
                        return f.isFunction(c) ? this.each(function (g) {
                            f(this).wrapInner(c.call(this, g))
                        }) : this.each(function () {
                            var g = f(this),
                                a = g.contents();
                            a.length ? a.wrapAll(c) : g.append(c)
                        })
                    },
                    wrap: function (c) {
                        var g = f.isFunction(c);
                        return this.each(function (a) {
                            f(this).wrapAll(g ? c.call(this, a) : c)
                        })
                    },
                    unwrap: function () {
                        return this.parent().each(function () {
                            f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
                        }).end()
                    },
                    append: function () {
                        return this.domManip(arguments, !0, function (c) {
                            1 === this.nodeType && this.appendChild(c)
                        })
                    },
                    prepend: function () {
                        return this.domManip(arguments, !0, function (c) {
                            1 === this.nodeType && this.insertBefore(c, this.firstChild)
                        })
                    },
                    before: function () {
                        if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function (c) {
                            this.parentNode.insertBefore(c, this)
                        });
                        if (arguments.length) {
                            var c = f.clean(arguments);
                            c.push.apply(c, this.toArray());
                            return this.pushStack(c, "before", arguments)
                        }
                    },
                    after: function () {
                        if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function (c) {
                            this.parentNode.insertBefore(c, this.nextSibling)
                        });
                        if (arguments.length) {
                            var c = this.pushStack(this, "after", arguments);
                            c.push.apply(c, f.clean(arguments));
                            return c
                        }
                    },
                    remove: function (c, g) {
                        for (var a = 0, b; null != (b = this[a]); a++) if (!c || f.filter(c, [b]).length)!g && 1 === b.nodeType && (f.cleanData(b.getElementsByTagName("*")), f.cleanData([b])), b.parentNode && b.parentNode.removeChild(b);
                        return this
                    },
                    empty: function () {
                        for (var c = 0, g; null != (g = this[c]); c++) for (1 === g.nodeType && f.cleanData(g.getElementsByTagName("*")); g.firstChild;) g.removeChild(g.firstChild);
                        return this
                    },
                    clone: function (c, g) {
                        c = null == c ? !1 : c;
                        g = null == g ? c : g;
                        return this.map(function () {
                            return f.clone(this, c, g)
                        })
                    },
                    html: function (c) {
                        if (c === b) return this[0] && 1 === this[0].nodeType ? this[0].innerHTML.replace(yb, "") : null;
                        if ("string" === typeof c && !Bb.test(c) && (f.support.leadingWhitespace || !La.test(c)) && !ea[(Wa.exec(c) || ["", ""])[1].toLowerCase()]) {
                            c = c.replace(Va, "<$1></$2>");
                            try {
                                for (var g = 0, a = this.length; g < a; g++) if (1 === this[g].nodeType) f.cleanData(this[g].getElementsByTagName("*")), this[g].innerHTML = c
                            } catch (d) {
                                this.empty().append(c)
                            }
                        } else f.isFunction(c) ? this.each(function (g) {
                            var a = f(this);
                            a.html(c.call(this, g, a.html()))
                        }) : this.empty().append(c);
                        return this
                    },
                    replaceWith: function (c) {
                        if (this[0] && this[0].parentNode) {
                            if (f.isFunction(c)) return this.each(function (g) {
                                var a = f(this),
                                    b = a.html();
                                a.replaceWith(c.call(this, g, b))
                            });
                            "string" !== typeof c && (c = f(c).detach());
                            return this.each(function () {
                                var g = this.nextSibling,
                                    a = this.parentNode;
                                f(this).remove();
                                g ? f(g).before(c) : f(a).append(c)
                            })
                        }
                        return this.length ? this.pushStack(f(f.isFunction(c) ? c() : c), "replaceWith", c) : this
                    },
                    detach: function (c) {
                        return this.remove(c, !0)
                    },
                    domManip: function (c, g, a) {
                        var d, e, i, p = c[0],
                            m = [];
                        if (!f.support.checkClone && 3 === arguments.length && "string" === typeof p && Ya.test(p)) return this.each(function () {
                            f(this).domManip(c, g, a, !0)
                        });
                        if (f.isFunction(p)) return this.each(function (d) {
                            var e = f(this);
                            c[0] = p.call(this, d, g ? e.html() : b);
                            e.domManip(c, g, a)
                        });
                        if (this[0]) {
                            d = p && p.parentNode;
                            d = f.support.parentNode && d && 11 === d.nodeType && d.childNodes.length === this.length ? {
                                fragment: d
                            } : f.buildFragment(c, this, m);
                            i = d.fragment;
                            if (e = 1 === i.childNodes.length ? i = i.firstChild : i.firstChild) {
                                g = g && f.nodeName(e, "tr");
                                e = 0;
                                for (var o = this.length, A = o - 1; e < o; e++) a.call(g ? f.nodeName(this[e], "table") ? this[e].getElementsByTagName("tbody")[0] || this[e].appendChild(this[e].ownerDocument.createElement("tbody")) : this[e] : this[e], d.cacheable || 1 < o && e < A ? f.clone(i, !0, !0) : i)
                            }
                            m.length && f.each(m, u)
                        }
                        return this
                    }
                });
                f.buildFragment = function (c, g, a) {
                    var b, d, e, i, p = c[0];
                    g && g[0] && (i = g[0].ownerDocument || g[0]);
                    i.createDocumentFragment || (i = z);
                    if (1 === c.length && "string" === typeof p && 512 > p.length && i === z && "<" === p.charAt(0) && !Cb.test(p) && (f.support.checkClone || !Ya.test(p)) && (f.support.html5Clone || !Xa.test(p))) d = !0, (e = f.fragments[p]) && 1 !== e && (b = e);
                    b || (b = i.createDocumentFragment(), f.clean(c, i, b, a));
                    d && (f.fragments[p] = e ? b : 1);
                    return {
                        fragment: b,
                        cacheable: d
                    }
                };
                f.fragments = {};
                f.each({
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith"
                }, function (c, a) {
                    f.fn[c] = function (b) {
                        var d = [],
                            b = f(b),
                            e = 1 === this.length && this[0].parentNode;
                        if (e && 11 === e.nodeType && 1 === e.childNodes.length && 1 === b.length) return b[a](this[0]), this;
                        for (var e = 0, i = b.length; e < i; e++) {
                            var p = (0 < e ? this.clone(!0) : this).get();
                            f(b[e])[a](p);
                            d = d.concat(p)
                        }
                        return this.pushStack(d, c, b.selector)
                    }
                });
                f.extend({
                    clone: function (c, a, b) {
                        var d, e, i;
                        f.support.html5Clone || !Xa.test("<" + c.nodeName) ? d = c.cloneNode(!0) : (d = z.createElement("div"), Za.appendChild(d), d.innerHTML = c.outerHTML, d = d.firstChild);
                        var p = d;
                        if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (1 === c.nodeType || 11 === c.nodeType) && !f.isXMLDoc(c)) {
                            k(c, p);
                            d = o(c);
                            e = o(p);
                            for (i = 0; d[i]; ++i) e[i] && k(d[i], e[i])
                        }
                        if (a && (v(c, p), b)) {
                            d = o(c);
                            e = o(p);
                            for (i = 0; d[i]; ++i) v(d[i], e[i])
                        }
                        return p
                    },
                    clean: function (c, a, b, d) {
                        a = a || z;
                        "undefined" === typeof a.createElement && (a = a.ownerDocument || a[0] && a[0].ownerDocument || z);
                        for (var e = [], i, p = 0, m; null != (m = c[p]); p++) if ("number" === typeof m && (m += ""), m) {
                            if ("string" === typeof m) if (Ab.test(m)) {
                                m = m.replace(Va, "<$1></$2>");
                                i = (Wa.exec(m) || ["", ""])[1].toLowerCase();
                                var o = ea[i] || ea._default,
                                    A = o[0],
                                    r = a.createElement("div");
                                a === z ? Za.appendChild(r) : n(a).appendChild(r);
                                for (r.innerHTML = o[1] + m + o[2]; A--;) r = r.lastChild;
                                if (!f.support.tbody) {
                                    A = zb.test(m);
                                    o = "table" === i && !A ? r.firstChild && r.firstChild.childNodes : "<table>" === o[1] && !A ? r.childNodes : [];
                                    for (i = o.length - 1; 0 <= i; --i) f.nodeName(o[i], "tbody") && !o[i].childNodes.length && o[i].parentNode.removeChild(o[i])
                                }!f.support.leadingWhitespace && La.test(m) && r.insertBefore(a.createTextNode(La.exec(m)[0]), r.firstChild);
                                m = r.childNodes
                            } else m = a.createTextNode(m);
                            var j;
                            if (!f.support.appendChecked) if (m[0] && "number" === typeof (j = m.length)) for (i = 0; i < j; i++) B(m[i]);
                            else B(m);
                            m.nodeType ? e.push(m) : e = f.merge(e, m)
                        }
                        if (b) {
                            c = function (c) {
                                return !c.type || Db.test(c.type)
                            };
                            for (p = 0; e[p]; p++) d && f.nodeName(e[p], "script") && (!e[p].type || "text/javascript" === e[p].type.toLowerCase()) ? d.push(e[p].parentNode ? e[p].parentNode.removeChild(e[p]) : e[p]) : (1 === e[p].nodeType && (a = f.grep(e[p].getElementsByTagName("script"), c), e.splice.apply(e, [p + 1, 0].concat(a))), b.appendChild(e[p]))
                        }
                        return e
                    },
                    cleanData: function (c) {
                        for (var a, b, d = f.cache, e = f.event.special, i = f.support.deleteExpando, p = 0, m; null != (m = c[p]); p++) if (!m.nodeName || !f.noData[m.nodeName.toLowerCase()]) if (b = m[f.expando]) {
                            if ((a = d[b]) && a.events) {
                                for (var o in a.events) a.events.hasOwnProperty(o) && (e[o] ? f.event.remove(m, o) : f.removeEvent(m, o, a.handle));
                                if (a.handle) a.handle.elem = null
                            }
                            i ? delete m[f.expando] : m.removeAttribute && m.removeAttribute(f.expando);
                            delete d[b]
                        }
                    }
                });
                var Ma = /alpha\([^)]*\)/i,
                    Eb = /opacity=([^)]*)/,
                    Fb = /([A-Z]|^ms)/g,
                    $a = /^-?\d+(?:px)?$/i,
                    Gb = /^-?\d/,
                    Hb = /^([\-+])=([\-+.\de]+)/,
                    Ib = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    },
                    kb = ["Left", "Right"],
                    lb = ["Top", "Bottom"],
                    qa, ab, bb;
                f.fn.css = function (c, a, d) {
                    if (2 === arguments.length && a === b) return this;
                    "object" === typeof c && 2 === arguments.length && (d = !! a);
                    return f.access(this, c, a, !0, function (c, a, g) {
                        return g !== b ? f.style(c, a, g, {
                            notImportant: !d
                        }) : f.css(c, a)
                    })
                };
                f.extend({
                    cssHooks: {
                        opacity: {
                            get: function (c, a) {
                                if (a) {
                                    var f = qa(c, "opacity", "opacity");
                                    return "" === f ? "1" : f
                                }
                                return c.style.opacity
                            }
                        }
                    },
                    cssNumber: {
                        fillOpacity: !0,
                        fontWeight: !0,
                        lineHeight: !0,
                        opacity: !0,
                        orphans: !0,
                        widows: !0,
                        zIndex: !0,
                        zoom: !0
                    },
                    cssProps: {
                        "float": f.support.cssFloat ? "cssFloat" : "styleFloat"
                    },
                    style: function (c, a, d, e) {
                        if (c && !(3 === c.nodeType || 8 === c.nodeType || !c.style)) {
                            var i = a,
                                p, m, o = f.camelCase(a),
                                A = c.style,
                                r = f.cssHooks[o],
                                a = f.cssProps[o] || o;
                            if (d !== b) {
                                m = typeof d;
                                if ("string" === m && (p = Hb.exec(d))) d = +(p[1] + 1) * +p[2] + parseFloat(f.css(c, a)), m = "number";
                                if (!(null == d || "number" === m && isNaN(d))) if ("number" === m && !f.cssNumber[o] && (d += "px"), "number" === m && "opacity" === o && (d += ""), !r || !("set" in r) || (d = r.set(c, d)) !== b) try {
                                    if (e && e.notImportant) A[a] = d;
                                    else if (A.setProperty) A.setProperty(i, d, "important");
                                    else {
                                        "display" === i && !d && (d = fa(c.nodeName));
                                        var j = RegExp("((?:^|;)\\s*" + i + ")\\s*:\\s*.+?(?:\\s*!important)?(?:;|$)", "gi");
                                        A.cssText = j.test(A.cssText) ? A.cssText.replace(j, "$1: " + d + " !important;") : A.cssText + (";" + i + ": " + d + " !important;")
                                    }
                                } catch (h) {}
                            } else return r && "get" in r && (p = r.get(c, !1, e)) !== b ? p : A[a]
                        }
                    },
                    css: function (c, a, d) {
                        var e, i, a = f.camelCase(a);
                        i = f.cssHooks[a];
                        a = f.cssProps[a] || a;
                        "cssFloat" === a && (a = "float");
                        if (i && "get" in i && (e = i.get(c, !0, d)) !== b) return e;
                        if (qa) return qa(c, a)
                    },
                    swap: function (c, a, f) {
                        var b = {},
                            d;
                        for (d in a) b[d] = c.style[d], c.style[d] = a[d];
                        f.call(c);
                        for (d in a) c.style[d] = b[d]
                    }
                });
                f.curCSS = f.css;
                f.each(["height", "width"], function (c, a) {
                    f.cssHooks[a] = {
                        get: function (c, b, d) {
                            var e;
                            if (b) {
                                if (0 !== c.offsetWidth) return G(c, a, d);
                                f.swap(c, Ib, function () {
                                    e = G(c, a, d)
                                });
                                return e
                            }
                        },
                        set: function (c, a) {
                            if ($a.test(a)) {
                                if (a = parseFloat(a), 0 <= a) return a + "px"
                            } else return a
                        }
                    }
                });
                if (!f.support.opacity) f.cssHooks.opacity = {
                    get: function (c, a) {
                        return Eb.test((a && c.currentStyle ? c.currentStyle.filter : c.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : a ? "1" : ""
                    },
                    set: function (c, a) {
                        var b = c.style,
                            d = c.currentStyle,
                            e = f.isNumeric(a) ? "alpha(opacity=" + 100 * a + ")" : "",
                            i = d && d.filter || b.filter || "";
                        b.zoom = 1;
                        if (1 <= a && "" === f.trim(i.replace(Ma, "")) && (b.removeAttribute("filter"), d && !d.filter)) return;
                        f.style(c, "filter", Ma.test(i) ? i.replace(Ma, e) : i + " " + e)
                    }
                };
                f(function () {
                    if (!f.support.reliableMarginRight) f.cssHooks.marginRight = {
                        get: function (c, a) {
                            var b;
                            f.swap(c, {
                                display: "inline-block"
                            }, function () {
                                b = a ? qa(c, "margin-right", "marginRight") : c.style.marginRight
                            });
                            return b
                        }
                    }
                });
                z.defaultView && z.defaultView.getComputedStyle && (ab = function (c, a) {
                    if ("string" === typeof a) {
                        var b, d, e, a = a.replace(Fb, "-$1").toLowerCase();
                        if ((d = c.ownerDocument.defaultView) && (e = d.getComputedStyle(c, null))) b = e.getPropertyValue(a), "" === b && !f.contains(c.ownerDocument.documentElement, c) && (b = f.style(c, a));
                        return b
                    }
                });
                z.documentElement.currentStyle && (bb = function (c, a) {
                    var f, b, d = c.currentStyle && c.currentStyle[a],
                        e = c.style;
                    if (null === d && e && (f = e[a])) d = f;
                    if (!$a.test(d) && Gb.test(d)) {
                        f = e.left;
                        if (b = c.runtimeStyle && c.runtimeStyle.left) c.runtimeStyle.left = c.currentStyle.left;
                        e.left = "fontSize" === a ? "1em" : d || 0;
                        d = e.pixelLeft + "px";
                        e.left = f;
                        if (b) c.runtimeStyle.left = b
                    }
                    return "" === d ? "auto" : d
                });
                qa = ab || bb;
                if (f.expr && f.expr.filters) f.expr.filters.hidden = function (c) {
                    var a = c.offsetHeight;
                    return 0 === c.offsetWidth && 0 === a || !f.support.reliableHiddenOffsets && "none" === (c.style && c.style.display || f.css(c, "display"))
                }, f.expr.filters.visible = function (c) {
                    return !f.expr.filters.hidden(c)
                };
                var Jb = /%20/g,
                    nb = /\[\]$/,
                    cb = /\r?\n/g,
                    Kb = /#.*$/,
                    Lb = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
                    Mb = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
                    Nb = /^(?:GET|HEAD)$/,
                    Ob = /^\/\//,
                    db = /\?/,
                    Pb = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                    Qb = /^(?:select|textarea)/i,
                    Pa = /\s+/,
                    Rb = /([?&])_=[^&]*/,
                    eb = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
                    fb = f.fn.load,
                    Ga = {},
                    gb = {},
                    na, oa, hb = ["*/"] + ["*"];
                try {
                    na = E.href
                } catch (Xb) {
                    na = z.createElement("a"), na.href = "", na = na.href
                }
                oa = eb.exec(na.toLowerCase()) || [];
                f.fn.extend({
                    load: function (c, a, d) {
                        if ("string" !== typeof c && fb) return fb.apply(this, arguments);
                        if (!this.length) return this;
                        var e = c.indexOf(" ");
                        if (0 <= e) var i = c.slice(e, c.length),
                            c = c.slice(0, e);
                        e = "GET";
                        a && (f.isFunction(a) ? (d = a, a = b) : "object" === typeof a && (a = f.param(a, f.ajaxSettings.traditional), e = "POST"));
                        var p = this;
                        f.ajax({
                            url: c,
                            type: e,
                            dataType: "html",
                            data: a,
                            complete: function (c, a, g) {
                                g = c.responseText;
                                c.isResolved() && (c.done(function (c) {
                                    g = c
                                }), p.html(i ? f("<div>").append(g.replace(Pb, "")).find(i) : g));
                                d && p.each(d, [g, a, c])
                            }
                        });
                        return this
                    },
                    serialize: function () {
                        return f.param(this.serializeArray())
                    },
                    serializeArray: function () {
                        return this.map(function () {
                            return this.elements ? f.makeArray(this.elements) : this
                        }).filter(function () {
                            return this.name && !this.disabled && (this.checked || Qb.test(this.nodeName) || Mb.test(this.type))
                        }).map(function (c, a) {
                            var b = f(this).val();
                            return null == b ? null : f.isArray(b) ? f.map(b, function (c) {
                                return {
                                    name: a.name,
                                    value: c.replace(cb, "\r\n")
                                }
                            }) : {
                                name: a.name,
                                value: b.replace(cb, "\r\n")
                            }
                        }).get()
                    }
                });
                f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (c, a) {
                    f.fn[a] = function (c) {
                        return this.on(a, c)
                    }
                });
                f.each(["get", "post"], function (c, a) {
                    f[a] = function (c, d, e, i) {
                        f.isFunction(d) && (i = i || e, e = d, d = b);
                        return f.ajax({
                            type: a,
                            url: c,
                            data: d,
                            success: e,
                            dataType: i
                        })
                    }
                });
                f.extend({
                    getScript: function (c, a) {
                        return f.get(c, b, a, "script")
                    },
                    getJSON: function (c, a, b) {
                        return f.get(c, a, b, "json")
                    },
                    ajaxSetup: function (c, a) {
                        a ? O(c, f.ajaxSettings) : (a = c, c = f.ajaxSettings);
                        O(c, a);
                        return c
                    },
                    ajaxSettings: {
                        url: na,
                        isLocal: /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(oa[1]),
                        global: !0,
                        type: "GET",
                        contentType: "application/x-www-form-urlencoded",
                        processData: !0,
                        async: !0,
                        accepts: {
                            xml: "application/xml, text/xml",
                            html: "text/html",
                            text: "text/plain",
                            json: "application/json, text/javascript",
                            "*": hb
                        },
                        contents: {
                            xml: /xml/,
                            html: /html/,
                            json: /json/
                        },
                        responseFields: {
                            xml: "responseXML",
                            text: "responseText"
                        },
                        converters: {
                            "* text": a.String,
                            "text html": !0,
                            "text json": f.parseJSON,
                            "text xml": f.parseXML
                        },
                        flatOptions: {
                            context: !0,
                            url: !0
                        }
                    },
                    ajaxPrefilter: w(Ga),
                    ajaxTransport: w(gb),
                    ajax: function (c, a) {
                        function d(c, a, g, l) {
                            if (2 !== s) {
                                s = 2;
                                q && clearTimeout(q);
                                da = b;
                                H = l || "";
                                k.readyState = 0 < c ? 4 : 0;
                                var j, h, z, l = a;
                                if (g) {
                                    var M = e,
                                        v = k,
                                        aa = M.contents,
                                        X = M.dataTypes,
                                        ia = M.responseFields,
                                        Y, W, fa, B;
                                    for (W in ia) W in g && (v[ia[W]] = g[W]);
                                    for (;
                                    "*" === X[0];) X.shift(), Y === b && (Y = M.mimeType || v.getResponseHeader("content-type"));
                                    if (Y) for (W in aa) if (aa[W] && aa[W].test(Y)) {
                                        X.unshift(W);
                                        break
                                    }
                                    if (X[0] in g) fa = X[0];
                                    else {
                                        for (W in g) {
                                            if (!X[0] || M.converters[W + " " + X[0]]) {
                                                fa = W;
                                                break
                                            }
                                            B || (B = W)
                                        }
                                        fa = fa || B
                                    }
                                    fa ? (fa !== X[0] && X.unshift(fa), g = g[fa]) : g = void 0
                                } else g = b;
                                if (200 <= c && 300 > c || 304 === c) {
                                    if (e.ifModified) {
                                        if (Y = k.getResponseHeader("Last-Modified")) f.lastModified[r] = Y;
                                        if (Y = k.getResponseHeader("Etag")) f.etag[r] = Y
                                    }
                                    if (304 === c) l = "notmodified", j = !0;
                                    else try {
                                        Y = e;
                                        Y.dataFilter && (g = Y.dataFilter(g, Y.dataType));
                                        var u = Y.dataTypes;
                                        W = {};
                                        var G, ba, Ia = u.length,
                                            D, F = u[0],
                                            w, ma, ja, ca, pa;
                                        for (G = 1; G < Ia; G++) {
                                            if (1 === G) for (ba in Y.converters) "string" === typeof ba && (W[ba.toLowerCase()] = Y.converters[ba]);
                                            w = F;
                                            F = u[G];
                                            if ("*" === F) F = w;
                                            else if ("*" !== w && w !== F) {
                                                ma = w + " " + F;
                                                ja = W[ma] || W["* " + F];
                                                if (!ja) for (ca in pa = b, W) if (D = ca.split(" "), D[0] === w || "*" === D[0]) if (pa = W[D[1] + " " + F]) {
                                                    ca = W[ca];
                                                    !0 === ca ? ja = pa : !0 === pa && (ja = ca);
                                                    break
                                                }!ja && !pa && f.error("No conversion from " + ma.replace(" ", " to "));
                                                !0 !== ja && (g = ja ? ja(g) : pa(ca(g)))
                                            }
                                        }
                                        h = g;
                                        l = "success";
                                        j = !0
                                    } catch (mb) {
                                        l = "parsererror", z = mb
                                    }
                                } else if (z = l, !l || c) l = "error", 0 > c && (c = 0);
                                k.status = c;
                                k.statusText = "" + (a || l);
                                j ? m.resolveWith(i, [h, l, k]) : m.rejectWith(i, [k, l, z]);
                                k.statusCode(A);
                                A = b;
                                n && p.trigger("ajax" + (j ? "Success" : "Error"), [k, e, j ? h : z]);
                                o.fireWith(i, [k, l]);
                                n && (p.trigger("ajaxComplete", [k, e]), --f.active || f.event.trigger("ajaxStop"))
                            }
                        }
                        "object" === typeof c && (a = c, c = b);
                        var a = a || {},
                            e = f.ajaxSetup({}, a),
                            i = e.context || e,
                            p = i !== e && (i.nodeType || i instanceof f) ? f(i) : f.event,
                            m = f.Deferred(),
                            o = f.Callbacks("once memory"),
                            A = e.statusCode || {},
                            r, j = {},
                            h = {},
                            H, z, da, q, M, s = 0,
                            n, v, k = {
                                readyState: 0,
                                setRequestHeader: function (c, a) {
                                    if (!s) {
                                        var g = c.toLowerCase(),
                                            c = h[g] = h[g] || c;
                                        j[c] = a
                                    }
                                    return this
                                },
                                getAllResponseHeaders: function () {
                                    return 2 === s ? H : null
                                },
                                getResponseHeader: function (c) {
                                    var a;
                                    if (2 === s) {
                                        if (!z) for (z = {}; a = Lb.exec(H);) z[a[1].toLowerCase()] = a[2];
                                        a = z[c.toLowerCase()]
                                    }
                                    return a === b ? null : a
                                },
                                overrideMimeType: function (c) {
                                    if (!s) e.mimeType = c;
                                    return this
                                },
                                abort: function (c) {
                                    c = c || "abort";
                                    da && da.abort(c);
                                    d(0, c);
                                    return this
                                }
                            };
                        m.promise(k);
                        k.success = k.done;
                        k.error = k.fail;
                        k.complete = o.add;
                        k.statusCode = function (c) {
                            if (c) {
                                var a;
                                if (2 > s) for (a in c) A[a] = [A[a], c[a]];
                                else a = c[k.status], k.then(a, a)
                            }
                            return this
                        };
                        e.url = ((c || e.url) + "").replace(Kb, "").replace(Ob, oa[1] + "//");
                        e.dataTypes = f.trim(e.dataType || "*").toLowerCase().split(Pa);
                        if (null == e.crossDomain) M = eb.exec(e.url.toLowerCase()), e.crossDomain = !(!M || !(M[1] != oa[1] || M[2] != oa[2] || (M[3] || ("http:" === M[1] ? 80 : 443)) != (oa[3] || ("http:" === oa[1] ? 80 : 443))));
                        if (e.data && e.processData && "string" !== typeof e.data) e.data = f.param(e.data, e.traditional);
                        D(Ga, e, a, k);
                        if (2 === s) return !1;
                        n = e.global;
                        e.type = e.type.toUpperCase();
                        e.hasContent = !Nb.test(e.type);
                        n && 0 === f.active++ && f.event.trigger("ajaxStart");
                        if (!e.hasContent && (e.data && (e.url += (db.test(e.url) ? "&" : "?") + e.data, delete e.data), r = e.url, !1 === e.cache)) {
                            M = f.now();
                            var aa = e.url.replace(Rb, "$1_=" + M);
                            e.url = aa + (aa === e.url ? (db.test(e.url) ? "&" : "?") + "_=" + M : "")
                        }(e.data && e.hasContent && !1 !== e.contentType || a.contentType) && k.setRequestHeader("Content-Type", e.contentType);
                        e.ifModified && (r = r || e.url, f.lastModified[r] && k.setRequestHeader("If-Modified-Since", f.lastModified[r]), f.etag[r] && k.setRequestHeader("If-None-Match", f.etag[r]));
                        k.setRequestHeader("Accept", e.dataTypes[0] && e.accepts[e.dataTypes[0]] ? e.accepts[e.dataTypes[0]] + ("*" !== e.dataTypes[0] ? ", " + hb + "; q=0.01" : "") : e.accepts["*"]);
                        for (v in e.headers) k.setRequestHeader(v, e.headers[v]);
                        if (e.beforeSend && (!1 === e.beforeSend.call(i, k, e) || 2 === s)) return k.abort(), !1;
                        for (v in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) k[v](e[v]);
                        if (da = D(gb, e, a, k)) {
                            k.readyState = 1;
                            n && p.trigger("ajaxSend", [k, e]);
                            e.async && 0 < e.timeout && (q = setTimeout(function () {
                                k.abort("timeout")
                            }, e.timeout));
                            try {
                                s = 1, da.send(j, d)
                            } catch (X) {
                                if (2 > s) d(-1, X);
                                else throw X;
                            }
                        } else d(-1, "No Transport");
                        return k
                    },
                    param: function (c, a) {
                        var d = [],
                            e = function (c, a) {
                                a = f.isFunction(a) ? a() : a;
                                d[d.length] = encodeURIComponent(c) + "=" + encodeURIComponent(a)
                            };
                        if (a === b) a = f.ajaxSettings.traditional;
                        if (f.isArray(c) || c.jquery && !f.isPlainObject(c)) f.each(c, function () {
                            e(this.name, this.value)
                        });
                        else for (var i in c) K(i, c[i], a, e);
                        return d.join("&").replace(Jb, "+")
                    }
                });
                f.extend({
                    active: 0,
                    lastModified: {},
                    etag: {}
                });
                var Sb = f.now(),
                    Ba = /(\=)\?(&|$)|\?\?/i;
                f.ajaxSetup({
                    jsonp: "callback",
                    jsonpCallback: function () {
                        return f.expando + "_" + Sb++
                    }
                });
                f.ajaxPrefilter("json jsonp", function (c, g, b) {
                    g = "application/x-www-form-urlencoded" === c.contentType && "string" === typeof c.data;
                    if ("jsonp" === c.dataTypes[0] || !1 !== c.jsonp && (Ba.test(c.url) || g && Ba.test(c.data))) {
                        var d, e = c.jsonpCallback = f.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback,
                            i = a[e],
                            p = c.url,
                            m = c.data,
                            o = "$1" + e + "$2";
                        !1 !== c.jsonp && (p = p.replace(Ba, o), c.url === p && (g && (m = m.replace(Ba, o)), c.data === m && (p += (/\?/.test(p) ? "&" : "?") + c.jsonp + "=" + e)));
                        c.url = p;
                        c.data = m;
                        a[e] = function (c) {
                            d = [c]
                        };
                        b.always(function () {
                            a[e] = i;
                            if (d && f.isFunction(i)) a[e](d[0])
                        });
                        c.converters["script json"] = function () {
                            d || f.error(e + " was not called");
                            return d[0]
                        };
                        c.dataTypes[0] = "json";
                        return "script"
                    }
                });
                f.ajaxSetup({
                    accepts: {
                        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                    },
                    contents: {
                        script: /javascript|ecmascript/
                    },
                    converters: {
                        "text script": function (c) {
                            f.globalEval(c);
                            return c
                        }
                    }
                });
                f.ajaxPrefilter("script", function (c) {
                    if (c.cache === b) c.cache = !1;
                    if (c.crossDomain) c.type = "GET", c.global = !1
                });
                f.ajaxTransport("script", function (c) {
                    if (c.crossDomain) {
                        var a, f = z.head || z.getElementsByTagName("head")[0] || z.documentElement;
                        return {
                            send: function (d, e) {
                                a = z.createElement("script");
                                a.async = "async";
                                if (c.scriptCharset) a.charset = c.scriptCharset;
                                a.src = c.url;
                                a.onload = a.onreadystatechange = function (c, d) {
                                    if (d || !a.readyState || /loaded|complete/.test(a.readyState)) a.onload = a.onreadystatechange = null, f && a.parentNode && f.removeChild(a), a = b, d || e(200, "success")
                                };
                                f.insertBefore(a, f.firstChild)
                            },
                            abort: function () {
                                if (a) a.onload(0, 1)
                            }
                        }
                    }
                });
                var Na = a.ActiveXObject ?
                function () {
                    for (var c in va) va[c](0, 1)
                } : !1, Tb = 0, va;
                f.ajaxSettings.xhr = a.ActiveXObject ?
                function () {
                    var c;
                    if (!(c = !this.isLocal && S())) a: {
                        try {
                            c = new a.ActiveXObject("Microsoft.XMLHTTP");
                            break a
                        } catch (g) {}
                        c = void 0
                    }
                    return c
                } : S;
                (function (c) {
                    f.extend(f.support, {
                        ajax: !! c,
                        cors: !! c && "withCredentials" in c
                    })
                })(f.ajaxSettings.xhr());
                f.support.ajax && f.ajaxTransport(function (c) {
                    if (!c.crossDomain || f.support.cors) {
                        var g;
                        return {
                            send: function (d, e) {
                                var i = c.xhr(),
                                    p, m;
                                c.username ? i.open(c.type, c.url, c.async, c.username, c.password) : i.open(c.type, c.url, c.async);
                                if (c.xhrFields) for (m in c.xhrFields) i[m] = c.xhrFields[m];
                                c.mimeType && i.overrideMimeType && i.overrideMimeType(c.mimeType);
                                !c.crossDomain && !d["X-Requested-With"] && (d["X-Requested-With"] = "XMLHttpRequest");
                                try {
                                    for (m in d) i.setRequestHeader(m, d[m])
                                } catch (o) {}
                                i.send(c.hasContent && c.data || null);
                                g = function (a, d) {
                                    var l, m, o, A, r;
                                    try {
                                        if (g && (d || 4 === i.readyState)) {
                                            g = b;
                                            if (p) i.onreadystatechange = f.noop, Na && delete va[p];
                                            if (d) 4 !== i.readyState && i.abort();
                                            else {
                                                l = i.status;
                                                o = i.getAllResponseHeaders();
                                                A = {};
                                                if ((r = i.responseXML) && r.documentElement) A.xml = r;
                                                A.text = i.responseText;
                                                try {
                                                    m = i.statusText
                                                } catch (j) {
                                                    m = ""
                                                }!l && c.isLocal && !c.crossDomain ? l = A.text ? 200 : 404 : 1223 === l && (l = 204)
                                            }
                                        }
                                    } catch (h) {
                                        d || e(-1, h)
                                    }
                                    A && e(l, m, A, o)
                                };
                                !c.async || 4 === i.readyState ? g() : (p = ++Tb, Na && (va || (va = {}, f(a).unload(Na)), va[p] = g), i.onreadystatechange = g)
                            },
                            abort: function () {
                                g && g(0, 1)
                            }
                        }
                    }
                });
                var Ha = {},
                    ha, ra, Ub = /^(?:toggle|show|hide)$/,
                    Vb = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
                    Ca, Qa = [
                        ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
                        ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
                        ["opacity"]
                    ],
                    xa;
                f.fn.extend({
                    show: function (c, a, b) {
                        if (c || 0 === c) return this.animate(M("show", 3), c, a, b);
                        for (var b = 0, d = this.length; b < d; b++) c = this[b], c.style && (a = f.css(c, "display"), !f._data(c, "olddisplay") && "none" === a && (f.style(c, "display", ""), a = ""), "" === a && "none" === f.css(c, "display") && f._data(c, "olddisplay", fa(c.nodeName)));
                        for (b = 0; b < d; b++) if (c = this[b], c.style && (a = f.css(c, "display"), "" === a || "none" === a)) f.style(c, "display", f._data(c, "olddisplay") || "");
                        return this
                    },
                    hide: function (c, a, b) {
                        if (c || 0 === c) return this.animate(M("hide", 3), c, a, b);
                        for (var b = 0, d = this.length; b < d; b++) c = this[b], c.style && (a = f.css(c, "display"), "none" !== a && !f._data(c, "olddisplay") && f._data(c, "olddisplay", a));
                        for (b = 0; b < d; b++) this[b].style && f.style(this[b], "display", "none");
                        return this
                    },
                    _toggle: f.fn.toggle,
                    toggle: function (c, a, b) {
                        var d = "boolean" === typeof c;
                        f.isFunction(c) && f.isFunction(a) ? this._toggle.apply(this, arguments) : null == c || d ? this.each(function () {
                            var a = d ? c : f(this).is(":hidden");
                            f(this)[a ? "show" : "hide"]()
                        }) : this.animate(M("toggle", 3), c, a, b);
                        return this
                    },
                    fadeTo: function (c, a, f, b) {
                        return this.filter(":hidden").css("opacity", 0).show().end().animate({
                            opacity: a
                        }, c, f, b)
                    },
                    animate: function (c, a, b, d) {
                        function e() {
                            var r;
                            !1 === i.queue && f._mark(this);
                            var a = f.extend({}, i),
                                g = 1 === this.nodeType,
                                b = g && f(this).is(":hidden"),
                                d, p, l, m, o;
                            a.animatedProperties = {};
                            for (l in c) {
                                d = f.camelCase(l);
                                l !== d && (c[d] = c[l], delete c[l]);
                                p = c[d];
                                f.isArray(p) ? (a.animatedProperties[d] = p[1], r = c[d] = p[0], p = r) : a.animatedProperties[d] = a.specialEasing && a.specialEasing[d] || a.easing || "swing";
                                if ("hide" === p && b || "show" === p && !b) return a.complete.call(this);
                                if (g && ("height" === d || "width" === d)) a.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], "inline" === f.css(this, "display") && "none" === f.css(this, "float") && (!f.support.inlineBlockNeedsLayout || "inline" === fa(this.nodeName) ? f.style(this, "display", "inline-block") : f.style(this, "zoom", 1))
                            }
                            null != a.overflow && f.style(this, "overflow", "hidden");
                            for (l in c) if (g = new f.fx(this, a, l), p = c[l], Ub.test(p)) if (d = f._data(this, "toggle" + l) || ("toggle" === p ? b ? "show" : "hide" : 0)) f._data(this, "toggle" + l, "show" === d ? "hide" : "show"), g[d]();
                            else g[p]();
                            else d = Vb.exec(p), m = g.cur(), d ? (p = parseFloat(d[2]), o = d[3] || (f.cssNumber[l] ? "" : "px"), "px" !== o && (f.style(this, l, (p || 1) + o), m *= (p || 1) / g.cur(), f.style(this, l, m + o)), d[1] && (p = ("-=" === d[1] ? -1 : 1) * p + m), g.custom(m, p, o)) : g.custom(m, p, "");
                            return !0
                        }
                        var i = f.speed(a, b, d);
                        if (f.isEmptyObject(c)) return this.each(i.complete, [!1]);
                        c = f.extend({}, c);
                        return !1 === i.queue ? this.each(e) : this.queue(i.queue, e)
                    },
                    stop: function (c, a, d) {
                        "string" !== typeof c && (d = a, a = c, c = b);
                        a && !1 !== c && this.queue(c || "fx", []);
                        return this.each(function () {
                            var a, g = !1,
                                b = f.timers,
                                e = f._data(this);
                            d || f._unmark(!0, this);
                            if (null == c) for (a in e) {
                                if (e[a] && e[a].stop && a.indexOf(".run") === a.length - 4) {
                                    var i = e[a];
                                    f.removeData(this, a, !0);
                                    i.stop(d)
                                }
                            } else if (e[a = c + ".run"] && e[a].stop) e = e[a], f.removeData(this, a, !0), e.stop(d);
                            for (a = b.length; a--;) if (b[a].elem === this && (null == c || b[a].queue === c)) {
                                if (d) b[a](!0);
                                else b[a].saveState();
                                g = !0;
                                b.splice(a, 1)
                            }(!d || !g) && f.dequeue(this, c)
                        })
                    }
                });
                f.each({
                    slideDown: M("show", 1),
                    slideUp: M("hide", 1),
                    slideToggle: M("toggle", 1),
                    fadeIn: {
                        opacity: "show"
                    },
                    fadeOut: {
                        opacity: "hide"
                    },
                    fadeToggle: {
                        opacity: "toggle"
                    }
                }, function (c, a) {
                    f.fn[c] = function (c, f, b) {
                        return this.animate(a, c, f, b)
                    }
                });
                f.extend({
                    speed: function (c, a, b) {
                        var d = c && "object" === typeof c ? f.extend({}, c) : {
                            complete: b || !b && a || f.isFunction(c) && c,
                            duration: c,
                            easing: b && a || a && !f.isFunction(a) && a
                        };
                        d.duration = f.fx.off ? 0 : "number" === typeof d.duration ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
                        if (null == d.queue || !0 === d.queue) d.queue = "fx";
                        d.old = d.complete;
                        d.complete = function (c) {
                            f.isFunction(d.old) && d.old.call(this);
                            d.queue ? f.dequeue(this, d.queue) : !1 !== c && f._unmark(this)
                        };
                        return d
                    },
                    easing: {
                        linear: function (c, a, f, b) {
                            return f + b * c
                        },
                        swing: function (c, a, f, b) {
                            return (-Math.cos(c * Math.PI) / 2 + 0.5) * b + f
                        }
                    },
                    timers: [],
                    fx: function (c, a, f) {
                        this.options = a;
                        this.elem = c;
                        this.prop = f;
                        a.orig = a.orig || {}
                    }
                });
                f.fx.prototype = {
                    update: function () {
                        this.options.step && this.options.step.call(this.elem, this.now, this);
                        (f.fx.step[this.prop] || f.fx.step._default)(this)
                    },
                    cur: function () {
                        if (null != this.elem[this.prop] && (!this.elem.style || null == this.elem.style[this.prop])) return this.elem[this.prop];
                        var c, a = f.css(this.elem, this.prop);
                        return isNaN(c = parseFloat(a)) ? !a || "auto" === a ? 0 : a : c
                    },
                    custom: function (c, a, d) {
                        function e(c) {
                            return i.step(c)
                        }
                        var i = this,
                            p = f.fx;
                        this.startTime = xa || C();
                        this.end = a;
                        this.now = this.start = c;
                        this.pos = this.state = 0;
                        this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px");
                        e.queue = this.options.queue;
                        e.elem = this.elem;
                        e.saveState = function () {
                            i.options.hide && f._data(i.elem, "fxshow" + i.prop) === b && f._data(i.elem, "fxshow" + i.prop, i.start)
                        };
                        e() && f.timers.push(e) && !Ca && (Ca = setInterval(p.tick, p.interval))
                    },
                    show: function () {
                        var c = f._data(this.elem, "fxshow" + this.prop);
                        this.options.orig[this.prop] = c || f.style(this.elem, this.prop);
                        this.options.show = !0;
                        c !== b ? this.custom(this.cur(), c) : this.custom("width" === this.prop || "height" === this.prop ? 1 : 0, this.cur());
                        f(this.elem).show()
                    },
                    hide: function () {
                        this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop);
                        this.options.hide = !0;
                        this.custom(this.cur(), 0)
                    },
                    step: function (c) {
                        var a, b = xa || C(),
                            d = !0,
                            e = this.elem,
                            i = this.options;
                        if (c || b >= i.duration + this.startTime) {
                            this.now = this.end;
                            this.pos = this.state = 1;
                            this.update();
                            i.animatedProperties[this.prop] = !0;
                            for (a in i.animatedProperties)!0 !== i.animatedProperties[a] && (d = !1);
                            if (d) {
                                null != i.overflow && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function (c, a) {
                                    f.style(e, "overflow" + a, i.overflow[c])
                                });
                                i.hide && f(e).hide();
                                if (i.hide || i.show) for (a in i.animatedProperties) f.style(e, a, i.orig[a]), f.removeData(e, "fxshow" + a, !0), f.removeData(e, "toggle" + a, !0);
                                if (c = i.complete) i.complete = !1, c.call(e)
                            }
                            return !1
                        }
                        Infinity == i.duration ? this.now = b : (c = b - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos);
                        this.update();
                        return !0
                    }
                };
                f.extend(f.fx, {
                    tick: function () {
                        for (var c, a = f.timers, b = 0; b < a.length; b++) c = a[b], !c() && a[b] === c && a.splice(b--, 1);
                        a.length || f.fx.stop()
                    },
                    interval: 13,
                    stop: function () {
                        clearInterval(Ca);
                        Ca = null
                    },
                    speeds: {
                        slow: 600,
                        fast: 200,
                        _default: 400
                    },
                    step: {
                        opacity: function (c) {
                            f.style(c.elem, "opacity", c.now)
                        },
                        _default: function (c) {
                            c.elem.style && null != f.css(c.elem, c.prop) ? f.style(c.elem, c.prop, c.now + c.unit) : c.elem[c.prop] = c.now
                        }
                    }
                });
                f.each(["width", "height"], function (c, a) {
                    f.fx.step[a] = function (c) {
                        f.style(c.elem, a, Math.max(0, c.now) + c.unit)
                    }
                });
                if (f.expr && f.expr.filters) f.expr.filters.animated = function (c) {
                    return f.grep(f.timers, function (a) {
                        return c === a.elem
                    }).length
                };
                var Wb = /^t(?:able|d|h)$/i,
                    ib = /^(?:body|html)$/i;
                f.fn.offset = "getBoundingClientRect" in z.documentElement ?
                function (c) {
                    var a = this[0],
                        b;
                    if (c) return this.each(function (a) {
                        f.offset.setOffset(this, c, a)
                    });
                    if (!a || !a.ownerDocument) return null;
                    if (a === a.ownerDocument.body) return f.offset.bodyOffset(a);
                    try {
                        b = a.getBoundingClientRect()
                    } catch (d) {}
                    var e = a.ownerDocument,
                        i = e.documentElement;
                    if (!b || !f.contains(i, a)) return b ? {
                        top: b.top,
                        left: b.left
                    } : {
                        top: 0,
                        left: 0
                    };
                    a = e.body;
                    e = X(e);
                    return {
                        top: b.top + (e.pageYOffset || f.support.boxModel && i.scrollTop || a.scrollTop) - (i.clientTop || a.clientTop || 0),
                        left: b.left + (e.pageXOffset || f.support.boxModel && i.scrollLeft || a.scrollLeft) - (i.clientLeft || a.clientLeft || 0)
                    }
                } : function (c) {
                    var a = this[0];
                    if (c) return this.each(function (a) {
                        f.offset.setOffset(this, c, a)
                    });
                    if (!a || !a.ownerDocument) return null;
                    if (a === a.ownerDocument.body) return f.offset.bodyOffset(a);
                    var b, d = a.offsetParent,
                        e = a.ownerDocument,
                        i = e.documentElement,
                        p = e.body;
                    b = (e = e.defaultView) ? e.getComputedStyle(a, null) : a.currentStyle;
                    for (var m = a.offsetTop, o = a.offsetLeft;
                    (a = a.parentNode) && a !== p && a !== i && !(f.support.fixedPosition && "fixed" === b.position);) {
                        b = e ? e.getComputedStyle(a, null) : a.currentStyle;
                        m -= a.scrollTop;
                        o -= a.scrollLeft;
                        if (a === d) {
                            m += a.offsetTop;
                            o += a.offsetLeft;
                            if (f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !Wb.test(a.nodeName))) m += parseFloat(b.borderTopWidth) || 0, o += parseFloat(b.borderLeftWidth) || 0;
                            d = a.offsetParent
                        }
                        f.support.subtractsBorderForOverflowNotVisible && "visible" !== b.overflow && (m += parseFloat(b.borderTopWidth) || 0, o += parseFloat(b.borderLeftWidth) || 0)
                    }
                    if ("relative" === b.position || "static" === b.position) m += p.offsetTop, o += p.offsetLeft;
                    f.support.fixedPosition && "fixed" === b.position && (m += Math.max(i.scrollTop, p.scrollTop), o += Math.max(i.scrollLeft, p.scrollLeft));
                    return {
                        top: m,
                        left: o
                    }
                };
                f.offset = {
                    bodyOffset: function (c) {
                        var a = c.offsetTop,
                            b = c.offsetLeft;
                        f.support.doesNotIncludeMarginInBodyOffset && (a += parseFloat(f.css(c, "marginTop")) || 0, b += parseFloat(f.css(c, "marginLeft")) || 0);
                        return {
                            top: a,
                            left: b
                        }
                    },
                    setOffset: function (c, a, b) {
                        var d = f.css(c, "position");
                        if ("static" === d) c.style.position = "relative";
                        var e = f(c),
                            i = e.offset(),
                            p = f.css(c, "top"),
                            m = f.css(c, "left"),
                            o = {},
                            A = {};
                        ("absolute" === d || "fixed" === d) && -1 < f.inArray("auto", [p, m]) ? (A = e.position(), d = A.top, m = A.left) : (d = parseFloat(p) || 0, m = parseFloat(m) || 0);
                        f.isFunction(a) && (a = a.call(c, b, i));
                        if (null != a.top) o.top = a.top - i.top + d;
                        if (null != a.left) o.left = a.left - i.left + m;
                        "using" in a ? a.using.call(c, o) : e.css(o)
                    }
                };
                f.fn.extend({
                    position: function () {
                        if (!this[0]) return null;
                        var c = this[0],
                            a = this.offsetParent(),
                            b = this.offset(),
                            d = ib.test(a[0].nodeName) ? {
                                top: 0,
                                left: 0
                            } : a.offset();
                        b.top -= parseFloat(f.css(c, "marginTop")) || 0;
                        b.left -= parseFloat(f.css(c, "marginLeft")) || 0;
                        d.top += parseFloat(f.css(a[0], "borderTopWidth")) || 0;
                        d.left += parseFloat(f.css(a[0], "borderLeftWidth")) || 0;
                        return {
                            top: b.top - d.top,
                            left: b.left - d.left
                        }
                    },
                    offsetParent: function () {
                        return this.map(function () {
                            for (var c = this.offsetParent || z.body; c && !ib.test(c.nodeName) && "static" === f.css(c, "position");) c = c.offsetParent;
                            return c
                        })
                    }
                });
                f.each(["Left", "Top"], function (c, a) {
                    var d = "scroll" + a;
                    f.fn[d] = function (a) {
                        var g, e;
                        if (a === b) {
                            g = this[0];
                            return !g ? null : (e = X(g)) ? "pageXOffset" in e ? e[c ? "pageYOffset" : "pageXOffset"] : f.support.boxModel && e.document.documentElement[d] || e.document.body[d] : g[d]
                        }
                        return this.each(function () {
                            (e = X(this)) ? e.scrollTo(!c ? a : f(e).scrollLeft(), c ? a : f(e).scrollTop()) : this[d] = a
                        })
                    }
                });
                f.each(["Height", "Width"], function (c, a) {
                    var d = a.toLowerCase();
                    f.fn["inner" + a] = function () {
                        var c = this[0];
                        return c ? c.style ? parseFloat(f.css(c, d, "padding")) : this[d]() : null
                    };
                    f.fn["outer" + a] = function (c) {
                        var a = this[0];
                        return a ? a.style ? parseFloat(f.css(a, d, c ? "margin" : "border")) : this[d]() : null
                    };
                    f.fn[d] = function (c) {
                        var e = this[0];
                        if (!e) return null == c ? null : this;
                        if (f.isFunction(c)) return this.each(function (a) {
                            var g = f(this);
                            g[d](c.call(this, a, g[d]()))
                        });
                        if (f.isWindow(e)) {
                            var i = e.document.documentElement["client" + a],
                                p = e.document.body;
                            return "CSS1Compat" === e.document.compatMode && i || p && p["client" + a] || i
                        }
                        if (9 === e.nodeType) return Math.max(e.documentElement["client" + a], e.body["scroll" + a], e.documentElement["scroll" + a], e.body["offset" + a], e.documentElement["offset" + a]);
                        return c === b ? (e = f.css(e, d), i = parseFloat(e), f.isNumeric(i) ? i : e) : this.css(d, "string" === typeof c ? c : c + "px", !0)
                    }
                });
                a.jQuery = a.$ = f;
                "function" === typeof define && define.amd && define.amd.jQuery && define("jquery", [], function () {
                    return f
                })
            })(d)
        })();
        if (this.env.iHatePrototype.stupidFuckingPrototype) this.document.getElementsByClassName = this.env.iHatePrototype.getElementsByClassName;
        var b, e = b = this.$ = a.$ = d.jQuery.noConflict(!0);
        this.baseData = a.baseData = S(this.$);
        this.bodyOffset = a.bodyOffset = P(this.$);
        (function () {
            function a(b) {
                var d = function (a, b) {
                        return a << b | a >>> 32 - b
                    },
                    e = function (a) {
                        var b = "",
                            d, e;
                        for (d = 7; 0 <= d; d--) e = a >>> 4 * d & 15, b += e.toString(16);
                        return b
                    },
                    m, r, j = Array(80),
                    h = 1732584193,
                    k = 4023233417,
                    s = 2562383102,
                    q = 271733878,
                    v = 3285377520,
                    o, n, B, u, G, b = this.utf8_encode(b);
                o = b.length;
                var w = [];
                for (m = 0; m < o - 3; m += 4) r = b.charCodeAt(m) << 24 | b.charCodeAt(m + 1) << 16 | b.charCodeAt(m + 2) << 8 | b.charCodeAt(m + 3), w.push(r);
                switch (o % 4) {
                case 0:
                    m = 2147483648;
                    break;
                case 1:
                    m = b.charCodeAt(o - 1) << 24 | 8388608;
                    break;
                case 2:
                    m = b.charCodeAt(o - 2) << 24 | b.charCodeAt(o - 1) << 16 | 32768;
                    break;
                case 3:
                    m = b.charCodeAt(o - 3) << 24 | b.charCodeAt(o - 2) << 16 | b.charCodeAt(o - 1) << 8 | 128
                }
                for (w.push(m); 14 != w.length % 16;) w.push(0);
                w.push(o >>> 29);
                w.push(o << 3 & 4294967295);
                for (b = 0; b < w.length; b += 16) {
                    for (m = 0; 16 > m; m++) j[m] = w[b + m];
                    for (m = 16; 79 >= m; m++) j[m] = d(j[m - 3] ^ j[m - 8] ^ j[m - 14] ^ j[m - 16], 1);
                    r = h;
                    o = k;
                    n = s;
                    B = q;
                    u = v;
                    for (m = 0; 19 >= m; m++) G = d(r, 5) + (o & n | ~o & B) + u + j[m] + 1518500249 & 4294967295, u = B, B = n, n = d(o, 30), o = r, r = G;
                    for (m = 20; 39 >= m; m++) G = d(r, 5) + (o ^ n ^ B) + u + j[m] + 1859775393 & 4294967295, u = B, B = n, n = d(o, 30), o = r, r = G;
                    for (m = 40; 59 >= m; m++) G = d(r, 5) + (o & n | o & B | n & B) + u + j[m] + 2400959708 & 4294967295, u = B, B = n, n = d(o, 30), o = r, r = G;
                    for (m = 60; 79 >= m; m++) G = d(r, 5) + (o ^ n ^ B) + u + j[m] + 3395469782 & 4294967295, u = B, B = n, n = d(o, 30), o = r, r = G;
                    h = h + r & 4294967295;
                    k = k + o & 4294967295;
                    s = s + n & 4294967295;
                    q = q + B & 4294967295;
                    v = v + u & 4294967295
                }
                G = e(h) + e(k) + e(s) + e(q) + e(v);
                return G.toLowerCase()
            }(function (a) {
                var b;
                if (!a) b = d.CLIPBOARD = d.CLIPBOARD || {}, a = b.common = b.common || {};
                a.fixBackgroundImage = function (a) {
                    var b = a.css("background-image");
                    b && "none" != b && setTimeout(function () {
                        a.css("background-image", "none");
                        a.css("background-image", b)
                    }, 1)
                };
                a.pad = function (a, b, d) {
                    if (!a.length || !b) return a;
                    for (var d = d - a.length, e = "", i = 0; i < d; ++i) e += b;
                    return e + a
                };
                a.caseInsensitiveCompare = function (a, b) {
                    var d = a.toLowerCase(),
                        e = b.toLowerCase();
                    return d < e ? -1 : d > e ? 1 : 0
                };
                a.loginBlacklist = {
                    about: 1,
                    account: 1,
                    activate: 1,
                    add: 1,
                    addons: 1,
                    admin: 1,
                    administrator: 1,
                    all: 1,
                    api: 1,
                    app: 1,
                    apps: 1,
                    archive: 1,
                    archives: 1,
                    avatar: 1,
                    avatarupload: 1,
                    auth: 1,
                    better: 1,
                    blob: 1,
                    blobloader: 1,
                    block: 1,
                    blog: 1,
                    cache: 1,
                    cancel: 1,
                    careers: 1,
                    cart: 1,
                    cat: 1,
                    cats: 1,
                    category: 1,
                    categories: 1,
                    changelog: 1,
                    checkout: 1,
                    chrome: 1,
                    chromeapp: 1,
                    chromeextversion: 1,
                    codereview: 1,
                    clip: 1,
                    clips: 1,
                    common: 1,
                    compare: 1,
                    config: 1,
                    configuration: 1,
                    connect: 1,
                    contact: 1,
                    create: 1,
                    css: 1,
                    "delete": 1,
                    direct_messages: 1,
                    documentation: 1,
                    download: 1,
                    downloads: 1,
                    edit: 1,
                    editor: 1,
                    email: 1,
                    emailverify: 1,
                    embed: 1,
                    employment: 1,
                    enterprise: 1,
                    error: 1,
                    extension: 1,
                    extensions: 1,
                    facebook: 1,
                    faq: 1,
                    favorites: 1,
                    feed: 1,
                    feedback: 1,
                    feeds: 1,
                    fleet: 1,
                    fleets: 1,
                    follow: 1,
                    followers: 1,
                    following: 1,
                    friend: 1,
                    friends: 1,
                    gist: 1,
                    group: 1,
                    groups: 1,
                    help: 1,
                    home: 1,
                    hosting: 1,
                    hostmaster: 1,
                    idea: 1,
                    ideas: 1,
                    index: 1,
                    info: 1,
                    invitations: 1,
                    invite: 1,
                    is: 1,
                    it: 1,
                    job: 1,
                    jobs: 1,
                    js: 1,
                    json: 1,
                    lib: 1,
                    lists: 1,
                    login: 1,
                    logout: 1,
                    log: 1,
                    logs: 1,
                    mail: 1,
                    manage: 1,
                    map: 1,
                    maps: 1,
                    mine: 1,
                    mis: 1,
                    news: 1,
                    notification: 1,
                    notifications: 1,
                    oauth: 1,
                    oauth_clients: 1,
                    offers: 1,
                    openid: 1,
                    order: 1,
                    orders: 1,
                    organizations: 1,
                    pass: 1,
                    people: 1,
                    plans: 1,
                    popular: 1,
                    post: 1,
                    privacy: 1,
                    profile: 1,
                    projects: 1,
                    put: 1,
                    recruitment: 1,
                    redeem: 1,
                    register: 1,
                    remove: 1,
                    replies: 1,
                    root: 1,
                    rss: 1,
                    sales: 1,
                    save: 1,
                    search: 1,
                    security: 1,
                    session: 1,
                    sessions: 1,
                    settings: 1,
                    shared: 1,
                    site: 1,
                    sites: 1,
                    shop: 1,
                    signup: 1,
                    sitemap: 1,
                    ssl: 1,
                    ssladmin: 1,
                    ssladministrator: 1,
                    sslwebmaster: 1,
                    start: 1,
                    "static": 1,
                    status: 1,
                    stories: 1,
                    styleguide: 1,
                    subscribe: 1,
                    subscriptions: 1,
                    support: 1,
                    sysadmin: 1,
                    sysadministrator: 1,
                    tag: 1,
                    tags: 1,
                    terms: 1,
                    token: 1,
                    tour: 1,
                    translations: 1,
                    trends: 1,
                    twitter: 1,
                    twittr: 1,
                    unfollow: 1,
                    unsubscribe: 1,
                    update: 1,
                    url: 1,
                    user: 1,
                    users: 1,
                    utils: 1,
                    verifyemail: 1,
                    w3c: 1,
                    weather: 1,
                    widget: 1,
                    widgets: 1,
                    wiki: 1,
                    ww: 1,
                    www: 1,
                    wwww: 1,
                    xfn: 1,
                    xml: 1,
                    xmpp: 1,
                    yaml: 1,
                    yml: 1
                };
                a.merge = function (a, b, d) {
                    for (var e in b) if (b.hasOwnProperty(e) && (d || !a.hasOwnProperty(e))) a[e] = b[e];
                    return a
                };
                a.createAvatarUrl = function (a, b, d) {
                    return d ? a.cdnUser + d + "_" + b : a.staticBaseUrl + "/images/missing-avatar.jpg"
                };
                a.getBestThumbnailPath = function (b, d, e, i, j) {
                    j = Math.max(i, j);
                    i = Math.ceil(a.logBase(j, 2));
                    d = Math.max(d, e);
                    e = Math.ceil(a.logBase(d, 2));
                    j /= Math.pow(2, i - e);
                    e = Math.max(8, e);
                    1.15 < d / j && (e = Math.min(e + 1, i));
                    return a.getThumbnailPathForLevel(b, e)
                };
                a.getThumbnailPathForLevel = function (a, b) {
                    switch (a.type) {
                    case "bookmark":
                        return a.thumbnailId ? a.thumbnailId + "_" + b : a.clipId + "_" + b;
                    default:
                        return a.blobId + "_" + b
                    }
                };
                a.logBase = function (a, b) {
                    return Math.log(a) / Math.log(b)
                }
            })("undefined" === typeof process || !process.versions ? null : exports);
            (function (e, i, j) {
                function m() {
                    o || (USTORE.init(), o = !0)
                }
                function r() {
                    if (null != B) return B;
                    var a = CLIPBOARD.time,
                        b = (new Date).getTime();
                    return B = parseInt(a) - b
                }
                function h(a) {
                    var d = [];
                    b.each(a, function (a, b) {
                        d.push(encodeURIComponent(a) + "=" + encodeURIComponent(b))
                    });
                    return d.sort().join("&")
                }
                function k(d, e, i, m, o) {
                    d = h(b.extend({
                        hmac_url: encodeURIComponent(d),
                        hmac_time: encodeURIComponent(i),
                        hmac_guid: encodeURIComponent(m),
                        hmac_nonce: a(d + (new Date).getTime() + o)
                    }, e));
                    o = a(d + o);
                    return {
                        msg: d + "&hmac_sig=" + o,
                        sig: o
                    }
                }
                function s(a, d) {
                    var e = a.sign || !1,
                        i = a.verb || null,
                        m = a.path || null,
                        o = a.cache || !1,
                        j = a.raw || null,
                        f = a.jsonp || !1,
                        A = a.jsonpCallbackName || null;
                    if (i && m && !(f && "GET" != i)) {
                        var h = "",
                            h = /^\/\//.test(m) ? m : v + m,
                            q = (new Date).getTime() + r(),
                            m = function (a) {
                                d && d(a.error, a.result, a.requestBody)
                            },
                            B = function (a) {
                                d && (500 <= a.status ? d({
                                    noConnection: !0,
                                    statusCode: a.status
                                }, null) : d({
                                    unknown: !0,
                                    statusCode: a.status
                                }, null))
                            };
                        if ("GET" === i) {
                            if (e) var e = n.guid(),
                                u = n.secret(),
                                j = k(h, null, q, e, u),
                                h = -1 === h.indexOf("?") ? h + ("?" + j.msg) : h + ("&" + j.msg);
                            if (f) {
                                i = {
                                    type: i,
                                    dataType: "jsonp",
                                    url: h,
                                    cache: o,
                                    async: !0,
                                    success: m,
                                    error: B
                                };
                                if (A) i.jsonp = !1, i.jsonpCallback = A;
                                b.ajax(i)
                            } else b.ajax({
                                type: i,
                                url: h,
                                cache: o,
                                async: !0,
                                success: m,
                                error: B
                            })
                        } else {
                            A = j;
                            if (e) e = n.guid(), u = n.secret(), j = k(h, j, q, e, u), A = j.msg;
                            b.ajax({
                                type: i,
                                url: h,
                                data: A,
                                cache: o,
                                async: !0,
                                success: m,
                                error: B
                            })
                        }
                    }
                }
                var q = e.CLIPBOARD = e.CLIPBOARD || {},
                    n = q.data = q.data || {},
                    e = d.location,
                    v = e.protocol + "//" + e.host,
                    o = !1,
                    B = null,
                    u = n.localSignPost = function (a, b, d) {
                        s({
                            sign: !0,
                            verb: "POST",
                            path: a,
                            raw: b
                        }, d)
                    },
                    G = n.localPost = function (a, b, d) {
                        s({
                            verb: "POST",
                            path: a,
                            raw: b
                        }, d)
                    },
                    w = n.localSignPut = function (a, b, d) {
                        s({
                            sign: !0,
                            verb: "PUT",
                            path: a,
                            raw: b
                        }, d)
                    },
                    D = n.localSignGet = function (a, b) {
                        s({
                            sign: !0,
                            verb: "GET",
                            path: a
                        }, b)
                    },
                    ca = function (a, b, d) {
                        s({
                            verb: "GET",
                            path: a,
                            cache: b
                        }, d)
                    },
                    O = n.localSignDelete = function (a, b, d) {
                        s({
                            sign: !0,
                            verb: "DELETE",
                            path: a,
                            raw: b
                        }, d)
                    },
                    K = function (a, b, d, e) {
                        s({
                            verb: "GET",
                            path: a,
                            cache: b,
                            jsonp: !0,
                            jsonpCallbackName: d
                        }, e)
                    },
                    S = n.getData = function (a) {
                        m();
                        a = USTORE.getValue(a);
                        return null == a || "" == a || "null" == a ? null : a
                    };
                n.setData = function (a, b) {
                    m();
                    USTORE.setValue(a, b)
                };
                n.secret = function () {
                    return S("secret")
                };
                n.login = function () {
                    return S("login")
                };
                n.guid = function () {
                    return S("guid")
                };
                n.searchPrivate = function (a, b, d, e, i) {
                    a = {
                        scope: JSON.stringify(a)
                    };
                    if (b) a.query = b;
                    if (d) a.beforeTime = d;
                    if (e) a.rows = e;
                    u("/api/v1/searchPrivate", a, function (a, b) {
                        i.apply(this, arguments)
                    })
                };
                n.searchPublic = function (a, b, d, e, i) {
                    a = {
                        scope: JSON.stringify(a)
                    };
                    if (b) a.query = b;
                    if (d) a.beforeTime = d;
                    if (e) a.rows = e;
                    G("/api/v1/searchPublic", a, i)
                };
                n.getClip = function (a, b) {
                    ca("/api/v1/clips/" + a, !1, function (a, d) {
                        b(a, d)
                    })
                };
                n.getTop = function (a, b, d) {
                    ca("/api/v1/top/" + a + "/" + b, !1, d)
                };
                var C = {};
                n.getBlob = function (a, b) {
                    var d, e;
                    d = "/api/v2/blobs/" + a;
                    q.config.cdnBaseUrl ? (e = "getBlobJsonPCallback_" + a, C[e] ? C[e].push(b) : (C[e] = [b], d = q.config.cdnBaseUrl + d + "/" + e, K(d, !0, e, function (a, b) {
                        var d, f;
                        f = C[e];
                        for (d = 0; d < f.length; ++d) f[d](a, b);
                        delete C[e]
                    }))) : ca(d, !0, function (a, d) {
                        b(a, d)
                    })
                };
                n.deleteClip = function (a, b) {
                    O("/api/v1/clips/" + a, {}, function (a) {
                        b(a)
                    })
                };
                n.setClipAsPublic = function (a, b, d) {
                    w("/api/v1/clips/" + a, {
                        isPrivate: !b
                    }, function (a) {
                        d(a)
                    })
                };
                n.setClipAnnotation = function (a, b, d) {
                    w("/api/v1/clips/" + a, {
                        annote: b
                    }, function (a) {
                        d(a)
                    })
                };
                n.setClipTitle = function (a, b, d) {
                    w("/api/v1/clips/" + a, {
                        title: b
                    }, function (a) {
                        d(a)
                    })
                };
                n.reClip = function (a, b) {
                    u("/api/v1/clips/" + a, {
                        reclip: !0
                    }, function (a) {
                        b(a)
                    })
                };
                n.getLikes = function (a) {
                    D("/api/v1/likes/", a)
                };
                n.getLikedClips = function (a, b, d) {
                    D("/api/v1/likes/clips?start=" + a + "&rows=" + b, d)
                };
                n.like = function (a, b, d) {
                    w("/api/v1/likes/" + a, {
                        addOrRemove: b
                    }, function (a) {
                        d(a)
                    })
                };
                n.addOpenAction = function (a, b) {
                    G("/api/v1/actions/open/" + a, b)
                };
                n.getActions = function (a, b) {
                    if (!a || 0 >= a.length) b("need at least one clip id to fetch actions for");
                    else {
                        var d = "";
                        "string" == typeof a ? d = a : a.join && (d = a.join(","));
                        ca("/api/v1/actions/" + d, !1, function (a, d) {
                            b && b(a, d)
                        })
                    }
                };
                n.getHotClips = function (a, b, d, e) {
                    D("/api/v1/hot?start=" + a + "&rows=" + b + "&type=" + d, e)
                };
                n.getComments = function (a, b) {
                    if (!a || 0 >= a.length) b("need at least one clip id to fetch comments for");
                    else {
                        var d = "";
                        "string" == typeof a ? d = a : a.join && (d = a.join(","));
                        ca("/api/v1/comments/" + d, !1, function (a, d) {
                            b(a, d)
                        })
                    }
                };
                n.addComment = function (a, b, d) {
                    w("/api/v1/comments/" + a, {
                        text: b
                    }, function (a, b) {
                        d(a, b)
                    })
                };
                n.deleteComment = function (a, b, d) {
                    O("/api/v1/comments/" + a, {
                        clipId: b
                    }, function (a, b) {
                        d(a, b)
                    })
                };
                n.getCounts = function (a, b) {
                    var d = "/api/v1/counts";
                    a.username && (d += "/" + a.username);
                    D(d, function (a, d) {
                        b(a, d)
                    })
                };
                n.getMessage = function (a) {
                    ca("/api/v1/message", !1, function (b, d) {
                        a(b, d)
                    })
                };
                n.updateUserProfile = function (a, b) {
                    w("/api/v1/users/", a, b)
                };
                n.emailClip = function (a, b, d) {
                    u("/api/v1/share/emailClip", {
                        clipId: a,
                        toEmail: b
                    }, d)
                };
                n.getFacebookFriendList = function (a) {
                    D("/api/v1/secure/fb/friendsList", a)
                };
                n.connectFbAccount = function (a, b, d, e) {
                    u("/api/v1/secure/fb/connect/", {
                        fbId: a,
                        fbAccessToken: b,
                        fetchAvatar: d
                    }, e)
                };
                n.disconnectFbTimeline = function (a) {
                    O("/api/v1/secure/fb/timeline/", {}, a)
                };
                n.disconnectFbAccount = function (a) {
                    O("/api/v1/secure/fb/connect/", {}, a)
                };
                n.lookupUser = function (a, b) {
                    ca("/api/v1/users/lookup?" + h(a), !1, b)
                };
                n.getConnections = function (a, b) {
                    "function" === typeof a && !b && (b = a, a = j);
                    D("/api/v1/connections" + (a ? "?refreshIfOlderThan=" + a : ""), b)
                };
                n.getAutocompleteDict = function (a) {
                    n.localSignGet("/api/v1/autocomplete", function (b, d) {
                        a && a(b, d)
                    })
                };
                n.getNotifications = function (a) {
                    D("/api/v1/notifications?markRead=1", a)
                };
                n.getUnreadNotificationCount = function (a) {
                    D("/api/v1/notifications/unreadCount", a)
                };
                n.sendInvite = function (a, b) {
                    u("/api/v1/invites/sendInvite", {
                        email: a
                    }, b)
                };
                n.createInviteToken = function (a, b) {
                    u("/api/v1/invites", {
                        key: a
                    }, b)
                };
                n.saveInviteEmail = function (a, b) {
                    G("/api/v1/saveEmail", {
                        email: a
                    }, b)
                };
                n.sendFeedback = function (a, b) {
                    u("/api/v1/feedback", {
                        message: a
                    }, function (a) {
                        b(a)
                    })
                };
                n.addFollow = function (a, b) {
                    u("/api/v1/follows", {
                        item: a
                    }, function (a) {
                        b(a)
                    })
                };
                n.deleteFollow = function (a, b) {
                    O("/api/v1/follows/" + encodeURIComponent(encodeURIComponent(a)), {}, function (a) {
                        b(a)
                    })
                };
                n.getFollows = function (a) {
                    D("/api/v1/follows", function (b, d) {
                        a(b, d)
                    })
                };
                n.testFollow = function (a, b) {
                    D("/api/v1/follows/" + a.join(","), function (a, d) {
                        b(a, d)
                    })
                };
                n.updateUserTag = function (a, b, d, e) {
                    w("/api/v1/users/" + a + "/tags/" + encodeURIComponent(encodeURIComponent(b)), {
                        description: d
                    }, function (a) {
                        e(a)
                    })
                };
                n.getUserTag = function (a, b, d) {
                    D("/api/v1/users/" + a + "/tags/" + encodeURIComponent(encodeURIComponent(b)), function (a, b) {
                        d(a, b)
                    })
                };
                n.getSession = function (a) {
                    D("/api/v1/sessions", function (b, d) {
                        a(b, d)
                    })
                };
                n.setAsFrozen = function (a, b, d) {
                    w("/api/v1/clips/" + a, {
                        frozen: b
                    }, function (a) {
                        d(a)
                    })
                };
                n.requestEmailVerification = function (a, b) {
                    var d = "/api/v1/validateemail";
                    b && (d += "/" + b);
                    u(d, {}, function (b, d) {
                        a(b, d)
                    })
                };
                n.getEmailVerification = function (a) {
                    D("/api/v1/validateemail", function (b, d) {
                        a(b, d)
                    })
                };
                n.uploadAvatar = function (a, b) {
                    u("/api/v1/secure/users/avatar", {
                        facebookId: a
                    }, b)
                };
                (function (a) {
                    function b(a, d, e) {
                        w("/api/v1/clips/" + a, {
                            broken: d ? !0 : !1
                        }, function (a, b) {
                            e(a, b)
                        })
                    }
                    a.flagAsBroken = function (a, d) {
                        b(a, !0, d)
                    };
                    a.flagAsNotBroken = function (a, d) {
                        b(a, !1, d)
                    }
                })(n);
                n.flagAsInappropriate = function (a, b, d) {
                    w("/api/v1/clips/" + a, {
                        _cb_action: "flagInappropriate",
                        reason: b || "<none>"
                    }, d)
                };
                n.linkAmplify = function (a, b, d, e) {
                    G("/api/v1/amplify", {
                        source: d,
                        clipboardLogin: b,
                        amplifyLogin: a
                    }, e)
                }
            })(d, document);
            (function (a, b, e) {
                var m, j, h, n, k, s;

                function q(a, b) {
                    m = j = -1;
                    for (var d = b - 1; 0 <= d; --d) {
                        var e = a.charAt(d);
                        if (!o(e)) {
                            if ("@" == e || "#" == e) if (0 == d || v(a.charAt(d - 1))) {
                                m = d;
                                break
                            }
                            return !1
                        }
                    }
                    if (0 > m) return !1;
                    j = a.length;
                    for (d = b; d < a.length; ++d) if (e = a.charAt(d), !o(e)) {
                        if (v(e)) {
                            j = d;
                            break
                        }
                        m = j = -1;
                        return !1
                    }
                    h = a.substr(m, j - m);
                    return !0
                }
                function v(a) {
                    return " " == a || "\t" == a || "\n" == a
                }
                function o(a) {
                    a = a.toLowerCase();
                    return "z" >= a && "a" <= a || "9" >= a && "0" <= a || "_" == a
                }
                function B(a, b) {
                    n = e(this);
                    U.parent()[0] != b[0] && (b.append(U), u());
                    var i = e(this).caret();
                    if (!i || 0 > i.end || i.start != i.end) w();
                    else if (q(n.val(), i.end)) if (i = h.charAt(0), a[i]) {
                        var m;
                        var f = h.substr(1),
                            f = f.toLowerCase();
                        (new Date).getTime();
                        var o = [],
                            j = [],
                            r = 0,
                            v = "#" == i ? $ : "@" == i ? E : null;
                        if (v) if (1 > f.length) {
                            f = [];
                            m = 0;
                            for (v = Math.min(v.length, S); m < v; ++m) f.push(m);
                            m = f
                        } else {
                            var Z = RegExp("\\b" + f.split("").join("[\\w_]*"));
                            for (m = 0; m < v.length && (!v[m].match(Z) || !(v[m].match(RegExp("\\b" + f)) ? o.push(m) : j.push(m), ++r >= S)); ++m);
                            m = o.concat(j)
                        } else m = [];
                        if (m && m.length) {
                            v = m;
                            m = !1;
                            f = e(d.document).scrollTop();
                            f = b.offset().top - f;
                            j = f + b.outerHeight();
                            o = "@" == i ? 39 : 22;
                            j = e(d).height() - j;
                            j < S * o && f > j && (m = !0);
                            f = e("<ul></ul>");
                            m && v.reverse();
                            for (o = 0; o < v.length; ++o) f.append(D(v[o], i));
                            f.children().removeClass("active_314159265");
                            m ? e(f.children()[v.length - 1]).addClass("active_314159265") : e(f.children()[0]).addClass("active_314159265");
                            e("> ul", U).replaceWith(f);
                            if (!k || s != m) i = {
                                left: -parseInt(b.css("border-left-width"), 10),
                                width: b.outerWidth() + "px"
                            }, m ? (U.addClass("inverted_314159265"), i.bottom = b.outerHeight() + "px", i.top = "") : (U.removeClass("inverted_314159265"), i.bottom = "", i.top = b.outerHeight() + "px"), U.css(i), k = !0, U.addClass("active_314159265");
                            s = m
                        } else w()
                    } else w();
                    else w()
                }
                function u() {
                    U.delegate("li", "mouseenter", function () {
                        e(this).siblings("li").removeClass("active_314159265");
                        e(this).addClass("active_314159265")
                    });
                    U.delegate("li", "mousedown", function () {
                        return !1
                    });
                    U.delegate("li", "click", function () {
                        G(e(this).attr("val"))
                    })
                }
                function G(a) {
                    var b = n.val(),
                        b = b.slice(0, m) + a + " " + b.slice(j);
                    n.val(b);
                    a = m + a.length + 1;
                    n.caret(a, a);
                    w()
                }
                function w() {
                    k && (U.removeClass("active_314159265"), k = !1)
                }
                function D(a, b) {
                    if (T[b][a]) return T[b][a];
                    if ("#" == b) {
                        var d = T[b],
                            i;
                        if (!K || !K.tags || !K.tags[a]) i = null;
                        else {
                            i = K.tags[a];
                            var f = e('<li class="tag_314159265">#' + i + "</li>");
                            f.attr("val", "#" + i);
                            i = f
                        }
                        return d[a] = i
                    }
                    "@" == b ? (d = T[b], !K || !K.users || !K.users[a] ? i = null : (i = K.users[a], f = C.createAvatarUrl(O.config, "s", i.login), f = e('<li class="user_314159265"><img width="30" height="30" src="' + f + '" /><div class="textWrap_314159265"><span>@' + i.login + "</span> " + (i.name || "") + "</div></li>"), f.attr("val", "@" + i.login), e("img", f).showPlaceholderOnError(), i = f), d = d[a] = i) : d = null;
                    return d
                }
                var O = a.CLIPBOARD,
                    C = O.common = O.common || {};
                O.data = O.data || {};
                var S = 10,
                    K = null,
                    E = [],
                    $ = [],
                    U = e('<div class="autocomplete_314159265"><ul></ul></div>'),
                    T = {
                        "@": {},
                        "#": {}
                    };
                n = null;
                h = null;
                m = -1;
                k = !1;
                j = void 0;
                s = void 0;
                O.setAutocompleteDict = function (a) {
                    K = {
                        users: [],
                        tags: []
                    };
                    $ = [];
                    E = [];
                    if (a && a.tags) {
                        for (var b in a.tags) a.tags.hasOwnProperty(b) && K.tags.push(a.tags[b]);
                        K.tags.sort(C.caseInsensitiveCompare);
                        for (b = 0; b < K.tags.length; ++b) $.push(K.tags[b].toLowerCase())
                    }
                    if (a && a.users) {
                        for (var d in a.users) a.users.hasOwnProperty(d) && K.users.push(a.users[d]);
                        K.users.sort(function (a, b) {
                            return C.caseInsensitiveCompare(a.login, b.login)
                        });
                        for (b = 0; b < K.users.length; ++b) a = K.users[b].login, d = K.users[b].name, E.push((a ? a.toLowerCase() : "") + " " + (d ? d.toLowerCase() : ""))
                    }
                };
                e.fn.autocompletify = function (a, b) {
                    var d = e(this);
                    b || (e(this).wrap('<div class="autocompleteWrap_314159265"/>'), b = e(this).parent());
                    a = a || {
                        "@": 1,
                        "#": 1
                    };
                    d.bind("keydown", function (a) {
                        if (k && (38 == a.keyCode || 40 == a.keyCode)) {
                            var b = e("> ul", U).children(),
                                d = b.size(),
                                i = e("li.active_314159265", U).index(),
                                d = (i + d + (40 == a.keyCode ? 1 : -1)) % d;
                            b.eq(i).removeClass("active_314159265");
                            b.eq(d).addClass("active_314159265");
                            a.preventDefault();
                            return !1
                        }
                        if (k && (13 == a.keyCode || 9 == a.keyCode)) return (b = e("li.active_314159265", U)) && G(b.attr("val")), a.preventDefault(), !1
                    });
                    d.bind("keyup", function (e) {
                        if (38 == e.keyCode || 40 == e.keyCode || 13 == e.keyCode) return !0;
                        B.call(d, a, b);
                        return !0
                    });
                    d.bind("blur", function () {
                        w()
                    });
                    d.bind("focus", function () {
                        B.call(d, a, b)
                    });
                    return this
                }
            })(d, document, e);
            (function (a, b) {
                b.fn.showPlaceholderOnError = function (d) {
                    var e = a.CLIPBOARD,
                        j = e.common;
                    b(this).error(function () {
                        var a = j.createAvatarUrl(e.config, d);
                        b(this).attr("src") != a && b(this).attr("src", a)
                    });
                    return b(this)
                }
            })(d, e);
            e.easing.jswing = e.easing.swing;
            e.extend(e.easing, {
                def: "easeOutQuad",
                swing: function (a, b, d, m, j) {
                    return e.easing[e.easing.def](a, b, d, m, j)
                },
                easeInQuad: function (a, b, d, e, j) {
                    return e * (b /= j) * b + d
                },
                easeOutQuad: function (a, b, d, e, j) {
                    return -e * (b /= j) * (b - 2) + d
                },
                easeInOutQuad: function (a, b, d, e, j) {
                    return 1 > (b /= j / 2) ? e / 2 * b * b + d : -e / 2 * (--b * (b - 2) - 1) + d
                },
                easeInCubic: function (a, b, d, e, j) {
                    return e * (b /= j) * b * b + d
                },
                easeOutCubic: function (a, b, d, e, j) {
                    return e * ((b = b / j - 1) * b * b + 1) + d
                },
                easeInOutCubic: function (a, b, d, e, j) {
                    return 1 > (b /= j / 2) ? e / 2 * b * b * b + d : e / 2 * ((b -= 2) * b * b + 2) + d
                },
                easeInQuart: function (a, b, d, e, j) {
                    return e * (b /= j) * b * b * b + d
                },
                easeOutQuart: function (a, b, d, e, j) {
                    return -e * ((b = b / j - 1) * b * b * b - 1) + d
                },
                easeInOutQuart: function (a, b, d, e, j) {
                    return 1 > (b /= j / 2) ? e / 2 * b * b * b * b + d : -e / 2 * ((b -= 2) * b * b * b - 2) + d
                },
                easeInQuint: function (a, b, d, e, j) {
                    return e * (b /= j) * b * b * b * b + d
                },
                easeOutQuint: function (a, b, d, e, j) {
                    return e * ((b = b / j - 1) * b * b * b * b + 1) + d
                },
                easeInOutQuint: function (a, b, d, e, j) {
                    return 1 > (b /= j / 2) ? e / 2 * b * b * b * b * b + d : e / 2 * ((b -= 2) * b * b * b * b + 2) + d
                },
                easeInSine: function (a, b, d, e, j) {
                    return -e * Math.cos(b / j * (Math.PI / 2)) + e + d
                },
                easeOutSine: function (a, b, d, e, j) {
                    return e * Math.sin(b / j * (Math.PI / 2)) + d
                },
                easeInOutSine: function (a, b, d, e, j) {
                    return -e / 2 * (Math.cos(Math.PI * b / j) - 1) + d
                },
                easeInExpo: function (a, b, d, e, j) {
                    return 0 == b ? d : e * Math.pow(2, 10 * (b / j - 1)) + d
                },
                easeOutExpo: function (a, b, d, e, j) {
                    return b == j ? d + e : e * (-Math.pow(2, -10 * b / j) + 1) + d
                },
                easeInOutExpo: function (a, b, d, e, j) {
                    return 0 == b ? d : b == j ? d + e : 1 > (b /= j / 2) ? e / 2 * Math.pow(2, 10 * (b - 1)) + d : e / 2 * (-Math.pow(2, -10 * --b) + 2) + d
                },
                easeInCirc: function (a, b, d, e, j) {
                    return -e * (Math.sqrt(1 - (b /= j) * b) - 1) + d
                },
                easeOutCirc: function (a, b, d, e, j) {
                    return e * Math.sqrt(1 - (b = b / j - 1) * b) + d
                },
                easeInOutCirc: function (a, b, d, e, j) {
                    return 1 > (b /= j / 2) ? -e / 2 * (Math.sqrt(1 - b * b) - 1) + d : e / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + d
                },
                easeInElastic: function (a, b, d, e, j) {
                    var a = 1.70158,
                        h = 0,
                        n = e;
                    if (0 == b) return d;
                    if (1 == (b /= j)) return d + e;
                    h || (h = 0.3 * j);
                    n < Math.abs(e) ? (n = e, a = h / 4) : a = h / (2 * Math.PI) * Math.asin(e / n);
                    return -(n * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * j - a) * 2 * Math.PI / h)) + d
                },
                easeOutElastic: function (a, b, d, e, j) {
                    var a = 1.70158,
                        h = 0,
                        n = e;
                    if (0 == b) return d;
                    if (1 == (b /= j)) return d + e;
                    h || (h = 0.3 * j);
                    n < Math.abs(e) ? (n = e, a = h / 4) : a = h / (2 * Math.PI) * Math.asin(e / n);
                    return n * Math.pow(2, -10 * b) * Math.sin((b * j - a) * 2 * Math.PI / h) + e + d
                },
                easeInOutElastic: function (a, b, d, e, j) {
                    var a = 1.70158,
                        h = 0,
                        n = e;
                    if (0 == b) return d;
                    if (2 == (b /= j / 2)) return d + e;
                    h || (h = j * 0.3 * 1.5);
                    n < Math.abs(e) ? (n = e, a = h / 4) : a = h / (2 * Math.PI) * Math.asin(e / n);
                    return 1 > b ? -0.5 * n * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * j - a) * 2 * Math.PI / h) + d : 0.5 * n * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * j - a) * 2 * Math.PI / h) + e + d
                },
                easeInBack: function (a, b, d, e, j, n) {
                    n == h && (n = 1.70158);
                    return e * (b /= j) * b * ((n + 1) * b - n) + d
                },
                easeOutBack: function (a, b, d, e, j, n) {
                    n == h && (n = 1.70158);
                    return e * ((b = b / j - 1) * b * ((n + 1) * b + n) + 1) + d
                },
                easeInOutBack: function (a, b, d, e, j, n) {
                    n == h && (n = 1.70158);
                    return 1 > (b /= j / 2) ? e / 2 * b * b * (((n *= 1.525) + 1) * b - n) + d : e / 2 * ((b -= 2) * b * (((n *= 1.525) + 1) * b + n) + 2) + d
                },
                easeInBounce: function (a, b, d, j, h) {
                    return j - e.easing.easeOutBounce(a, h - b, 0, j, h) + d
                },
                easeOutBounce: function (a, b, d, e, j) {
                    return (b /= j) < 1 / 2.75 ? e * 7.5625 * b * b + d : b < 2 / 2.75 ? e * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + d : b < 2.5 / 2.75 ? e * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + d : e * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + d
                },
                easeInOutBounce: function (a, b, d, j, h) {
                    return b < h / 2 ? 0.5 * e.easing.easeInBounce(a, 2 * b, 0, j, h) + d : 0.5 * e.easing.easeOutBounce(a, 2 * b - h, 0, j, h) + 0.5 * j + d
                }
            });
            (function (a) {
                function b(e) {
                    var i = e || d.event,
                        j = [].slice.call(arguments, 1),
                        m = 0,
                        n = 0,
                        k = 0,
                        e = a.event.fix(i);
                    e.type = "mousewheel";
                    i.wheelDelta && (m = i.wheelDelta / 120);
                    i.detail && (m = -i.detail / 3);
                    k = m;
                    i.axis !== h && i.axis === i.HORIZONTAL_AXIS && (k = 0, n = -1 * m);
                    i.wheelDeltaY !== h && (k = i.wheelDeltaY / 120);
                    i.wheelDeltaX !== h && (n = -1 * i.wheelDeltaX / 120);
                    j.unshift(e, m, n, k);
                    return (a.event.dispatch || a.event.handle).apply(this, j)
                }
                var e = ["DOMMouseScroll", "mousewheel"];
                if (a.event.fixHooks) for (var j = e.length; j;) a.event.fixHooks[e[--j]] = a.event.mouseHooks;
                a.event.special.mousewheel = {
                    setup: function () {
                        if (this.addEventListener) for (var a = e.length; a;) this.addEventListener(e[--a], b, !1);
                        else this.onmousewheel = b
                    },
                    teardown: function () {
                        if (this.removeEventListener) for (var a = e.length; a;) this.removeEventListener(e[--a], b, !1);
                        else this.onmousewheel = null
                    }
                };
                a.fn.extend({
                    mousewheel: function (a) {
                        return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
                    },
                    unmousewheel: function (a) {
                        return this.unbind("mousewheel", a)
                    }
                })
            })(e);
            (function (a, b, d, e, j, h) {
                function n(a, b) {
                    var d = typeof a[b];
                    return "function" == d || !! ("object" == d && a[b]) || "unknown" == d
                }
                function k() {
                    try {
                        var a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                        P = Array.prototype.slice.call(a.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/), 1);
                        wa = 9 < parseInt(P[0], 10) && 0 < parseInt(P[1], 10);
                        return !0
                    } catch (b) {
                        return !1
                    }
                }
                function s() {
                    if (!la) {
                        la = !0;
                        for (var a = 0; a < ya.length; a++) ya[a]();
                        ya.length = 0
                    }
                }
                function q(a, b) {
                    la ? a.call(b) : ya.push(function () {
                        a.call(b)
                    })
                }
                function v() {
                    var a = parent;
                    if ("" !== z) for (var b = 0, d = z.split("."); b < d.length; b++) a = a[d[b]];
                    return a.easyXDM
                }
                function o(a) {
                    var b = a.toLowerCase().match($),
                        a = b[2],
                        d = b[3],
                        b = b[4] || "";
                    if ("http:" == a && ":80" == b || "https:" == a && ":443" == b) b = "";
                    return a + "//" + d + b
                }
                function B(a) {
                    a = a.replace(V, "$1/");
                    if (!a.match(/^(http||https):\/\//)) {
                        var b = "/" === a.substring(0, 1) ? "" : d.pathname;
                        "/" !== b.substring(b.length - 1) && (b = b.substring(0, b.lastIndexOf("/") + 1));
                        a = d.protocol + "//" + d.host + b + a
                    }
                    for (; T.test(a);) a = a.replace(T, "");
                    return a
                }
                function u(a, b) {
                    var d = "",
                        f = a.indexOf("#"); - 1 !== f && (d = a.substring(f), a = a.substring(0, f));
                    var f = [],
                        e;
                    for (e in b) b.hasOwnProperty(e) && f.push(e + "=" + h(b[e]));
                    return a + (J ? "#" : -1 == a.indexOf("?") ? "?" : "&") + f.join("&") + d
                }
                function w(a) {
                    return "undefined" === typeof a
                }
                function G(a, b, d) {
                    var f, e;
                    for (e in b) b.hasOwnProperty(e) && (e in a ? (f = b[e], "object" === typeof f ? G(a[e], f, d) : d || (a[e] = b[e])) : a[e] = b[e]);
                    return a
                }
                function D(a) {
                    if (w(Q)) {
                        var d = b.body.appendChild(b.createElement("form")),
                            e = d.appendChild(b.createElement("input"));
                        e.name = f + "TEST" + U;
                        Q = e !== d.elements[e.name];
                        b.body.removeChild(d)
                    }
                    Q ? d = b.createElement('<iframe name="' + a.props.name + '"/>') : (d = b.createElement("IFRAME"), d.name = a.props.name);
                    d.id = d.name = a.props.name;
                    delete a.props.name;
                    a.onLoad && N(d, "load", a.onLoad);
                    if ("string" == typeof a.container) a.container = b.getElementById(a.container);
                    if (!a.container) G(d.style, {
                        position: "absolute",
                        top: "-2000px"
                    }), a.container = b.body;
                    e = a.props.src;
                    delete a.props.src;
                    G(d, a.props);
                    d.border = d.frameBorder = 0;
                    d.allowTransparency = !0;
                    a.container.appendChild(d);
                    d.src = e;
                    a.props.src = e;
                    return d
                }
                function K(f) {
                    var e = f.protocol,
                        j;
                    f.isHost = f.isHost || w(ga.xdm_p);
                    J = f.hash || !1;
                    if (!f.props) f.props = {};
                    if (f.isHost) {
                        if (f.remote = B(f.remote), f.channel = f.channel || "default" + U++, f.secret = Math.random().toString(16).substring(2), w(e)) o(d.href) == o(f.remote) ? e = "4" : n(a, "postMessage") || n(b, "postMessage") ? e = "1" : f.swf && n(a, "ActiveXObject") && k() ? e = "6" : "Gecko" === navigator.product && "frameElement" in a && -1 == navigator.userAgent.indexOf("WebKit") ? e = "5" : f.remoteHelper ? (f.remoteHelper = B(f.remoteHelper), e = "2") : e = "0"
                    } else {
                        f.channel = ga.xdm_c;
                        f.secret = ga.xdm_s;
                        f.remote = ga.xdm_e;
                        var e = ga.xdm_p,
                            m;
                        if (m = f.acl) {
                            a: {
                                m = f.acl;
                                var h = f.remote;
                                "string" == typeof m && (m = [m]);
                                for (var s, q = m.length; q--;) if (s = m[q], s = RegExp("^" == s.substr(0, 1) ? s : "^" + s.replace(/(\*)/g, ".$1").replace(/\?/g, ".") + "$"), s.test(h)) {
                                    m = !0;
                                    break a
                                }
                                m = !1
                            }
                            m = !m
                        }
                        if (m) throw Error("Access denied for " + f.remote);
                    }
                    f.protocol = e;
                    switch (e) {
                    case "0":
                        G(f, {
                            interval: 100,
                            delay: 2E3,
                            useResize: !0,
                            useParent: !1,
                            usePolling: !1
                        }, !0);
                        if (f.isHost) {
                            if (!f.local) {
                                e = d.protocol + "//" + d.host;
                                j = b.body.getElementsByTagName("img");
                                for (h = j.length; h--;) if (m = j[h], m.src.substring(0, e.length) === e) {
                                    f.local = m.src;
                                    break
                                }
                                if (!f.local) f.local = a
                            }
                            e = {
                                xdm_c: f.channel,
                                xdm_p: 0
                            };
                            f.local === a ? (f.usePolling = !0, f.useParent = !0, f.local = d.protocol + "//" + d.host + d.pathname + d.search, e.xdm_e = f.local, e.xdm_pa = 1) : e.xdm_e = B(f.local);
                            if (f.container) f.useResize = !1, e.xdm_po = 1;
                            f.remote = u(f.remote, e)
                        } else G(f, {
                            channel: ga.xdm_c,
                            remote: ga.xdm_e,
                            useParent: !w(ga.xdm_pa),
                            usePolling: !w(ga.xdm_po),
                            useResize: f.useParent ? !1 : f.useResize
                        });
                        j = [new x.stack.HashTransport(f), new x.stack.ReliableBehavior({}), new x.stack.QueueBehavior({
                            encode: !0,
                            maxLength: 4E3 - f.remote.length
                        }), new x.stack.VerifyBehavior({
                            initiate: f.isHost
                        })];
                        break;
                    case "1":
                        j = [new x.stack.PostMessageTransport(f)];
                        break;
                    case "2":
                        j = [new x.stack.NameTransport(f), new x.stack.QueueBehavior, new x.stack.VerifyBehavior({
                            initiate: f.isHost
                        })];
                        break;
                    case "3":
                        j = [new x.stack.NixTransport(f)];
                        break;
                    case "4":
                        j = [new x.stack.SameOriginTransport(f)];
                        break;
                    case "5":
                        j = [new x.stack.FrameElementTransport(f)];
                        break;
                    case "6":
                        P || k(), j = [new x.stack.FlashTransport(f)]
                    }
                    j.push(new x.stack.QueueBehavior({
                        lazy: f.lazy,
                        remove: !0
                    }));
                    return j
                }
                function O(a) {
                    for (var b, d = {
                        incoming: function (a, b) {
                            this.up.incoming(a, b)
                        },
                        outgoing: function (a, b) {
                            this.down.outgoing(a, b)
                        },
                        callback: function (a) {
                            this.up.callback(a)
                        },
                        init: function () {
                            this.down.init()
                        },
                        destroy: function () {
                            this.down.destroy()
                        }
                    }, f = 0, e = a.length; f < e; f++) {
                        b = a[f];
                        G(b, d, !0);
                        if (0 !== f) b.down = a[f - 1];
                        if (f !== e - 1) b.up = a[f + 1]
                    }
                    return b
                }
                function C(a) {
                    a.up.down = a.down;
                    a.down.up = a.up;
                    a.up = a.down = null
                }
                var S = this,
                    U = Math.floor(1E4 * Math.random()),
                    E = Function.prototype,
                    $ = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/,
                    T = /[\-\w]+\/\.\.\//,
                    V = /([^:])\/\//g,
                    z = "",
                    x = {},
                    I = a.easyXDM,
                    f = "easyXDM_",
                    Q, J = !1,
                    P, wa, N, R;
                if (n(a, "addEventListener")) N = function (a, b, d) {
                    a.addEventListener(b, d, !1)
                }, R = function (a, b, d) {
                    a.removeEventListener(b, d, !1)
                };
                else if (n(a, "attachEvent")) N = function (a, b, d) {
                    a.attachEvent("on" + b, d)
                }, R = function (a, b, d) {
                    a.detachEvent("on" + b, d)
                };
                else throw Error("Browser not supported");
                var la = !1,
                    ya = [],
                    za;
                "readyState" in b ? (za = b.readyState, la = "complete" == za || ~navigator.userAgent.indexOf("AppleWebKit/") && ("loaded" == za || "interactive" == za)) : la = !! b.body;
                if (!la) {
                    if (n(a, "addEventListener")) N(b, "DOMContentLoaded", s);
                    else if (N(b, "readystatechange", function () {
                        "complete" == b.readyState && s()
                    }), b.documentElement.doScroll && a === top) {
                        var Ra = function () {
                                if (!la) {
                                    try {
                                        b.documentElement.doScroll("left")
                                    } catch (a) {
                                        e(Ra, 1);
                                        return
                                    }
                                    s()
                                }
                            };
                        Ra()
                    }
                    N(a, "load", s)
                }
                var ga = function (a) {
                        for (var a = a.substring(1).split("&"), b = {}, d, f = a.length; f--;) d = a[f].split("="), b[d[0]] = j(d[1]);
                        return b
                    }(/xdm_e=/.test(d.search) ? d.search : d.hash),
                    ua = function () {
                        var a = {},
                            b = {
                                a: [1, 2, 3]
                            };
                        if ("undefined" != typeof JSON && "function" === typeof JSON.stringify && '{"a":[1,2,3]}' === JSON.stringify(b).replace(/\s/g, "")) return JSON;
                        if (Object.toJSON && '{"a":[1,2,3]}' === Object.toJSON(b).replace(/\s/g, "")) a.stringify = Object.toJSON;
                        if ("function" === typeof String.prototype.evalJSON && (b = '{"a":[1,2,3]}'.evalJSON(), b.a && 3 === b.a.length && 3 === b.a[2])) a.parse = function (a) {
                            return a.evalJSON()
                        };
                        return a.stringify && a.parse ? (ua = function () {
                            return a
                        }, a) : null
                    };
                G(x, {
                    version: "2.4.15.118",
                    query: ga,
                    stack: {},
                    apply: G,
                    getJSONObject: ua,
                    whenReady: q,
                    noConflict: function (b) {
                        a.easyXDM = I;
                        (z = b) && (f = "easyXDM_" + z.replace(".", "_") + "_");
                        return x
                    }
                });
                x.DomHelper = {
                    on: N,
                    un: R,
                    requiresJSON: function (d) {
                        "object" == typeof a.JSON && a.JSON || b.write('<script type="text/javascript" src="' + d + '"><\/script>')
                    }
                };
                (function () {
                    var a = {};
                    x.Fn = {
                        set: function (b, d) {
                            a[b] = d
                        },
                        get: function (b, d) {
                            var f = a[b];
                            d && delete a[b];
                            return f
                        }
                    }
                })();
                x.Socket = function (a) {
                    var b = O(K(a).concat([{
                        incoming: function (b, d) {
                            a.onMessage(b, d)
                        },
                        callback: function (b) {
                            if (a.onReady) a.onReady(b)
                        }
                    }])),
                        d = o(a.remote);
                    this.origin = o(a.remote);
                    this.destroy = function () {
                        b.destroy()
                    };
                    this.postMessage = function (a) {
                        b.outgoing(a, d)
                    };
                    b.init()
                };
                x.Rpc = function (a, b) {
                    if (b.local) for (var d in b.local) if (b.local.hasOwnProperty(d)) {
                        var f = b.local[d];
                        "function" === typeof f && (b.local[d] = {
                            method: f
                        })
                    }
                    var e = O(K(a).concat([new x.stack.RpcBehavior(this, b),
                    {
                        callback: function (b) {
                            if (a.onReady) a.onReady(b)
                        }
                    }]));
                    this.origin = o(a.remote);
                    this.destroy = function () {
                        e.destroy()
                    };
                    e.init()
                };
                x.stack.SameOriginTransport = function (a) {
                    var b, i, j, h;
                    return b = {
                        outgoing: function (a, b, d) {
                            j(a);
                            d && d()
                        },
                        destroy: function () {
                            i && (i.parentNode.removeChild(i), i = null)
                        },
                        onDOMReady: function () {
                            h = o(a.remote);
                            a.isHost ? (G(a.props, {
                                src: u(a.remote, {
                                    xdm_e: d.protocol + "//" + d.host + d.pathname,
                                    xdm_c: a.channel,
                                    xdm_p: 4
                                }),
                                name: f + a.channel + "_provider"
                            }), i = D(a), x.Fn.set(a.channel, function (a) {
                                j = a;
                                e(function () {
                                    b.up.callback(!0)
                                }, 0);
                                return function (a) {
                                    b.up.incoming(a, h)
                                }
                            })) : (j = v().Fn.get(a.channel, !0)(function (a) {
                                b.up.incoming(a, h)
                            }), e(function () {
                                b.up.callback(!0)
                            }, 0))
                        },
                        init: function () {
                            q(b.onDOMReady, b)
                        }
                    }
                };
                x.stack.FlashTransport = function (a) {
                    function j(a) {
                        e(function () {
                            n.up.incoming(a, s)
                        }, 0)
                    }
                    function h(d) {
                        var f = a.swf + "?host=" + a.isHost,
                            e = "easyXDM_swf_" + Math.floor(1E4 * Math.random());
                        x.Fn.set("flash_loaded" + d.replace(/[\-.]/g, "_"), function () {
                            x.stack.FlashTransport[d].swf = v = r.firstChild;
                            for (var a = x.stack.FlashTransport[d].queue, b = 0; b < a.length; b++) a[b]();
                            a.length = 0
                        });
                        a.swfContainer ? r = "string" == typeof a.swfContainer ? b.getElementById(a.swfContainer) : a.swfContainer : (r = b.createElement("div"), G(r.style, wa && a.swfNoThrottle ? {
                            height: "20px",
                            width: "20px",
                            position: "fixed",
                            right: 0,
                            top: 0
                        } : {
                            height: "1px",
                            width: "1px",
                            position: "absolute",
                            overflow: "hidden",
                            right: 0,
                            top: 0
                        }), b.body.appendChild(r));
                        var j = "callback=flash_loaded" + d.replace(/[\-.]/g, "_") + "&proto=" + S.location.protocol + "&domain=" + S.location.href.match($)[3] + "&port=" + (S.location.href.match($)[4] || "") + "&ns=" + z;
                        r.innerHTML = "<object height='20' width='20' type='application/x-shockwave-flash' id='" + e + "' data='" + f + "'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='" + f + "'></param><param name='flashvars' value='" + j + "'></param><embed type='application/x-shockwave-flash' FlashVars='" + j + "' allowScriptAccess='always' wmode='transparent' src='" + f + "' height='1' width='1'></embed></object>"
                    }
                    var n, k, s, v, r;
                    return n = {
                        outgoing: function (b, d, f) {
                            v.postMessage(a.channel, b.toString());
                            f && f()
                        },
                        destroy: function () {
                            try {
                                v.destroyChannel(a.channel)
                            } catch (b) {}
                            v = null;
                            k && (k.parentNode.removeChild(k), k = null)
                        },
                        onDOMReady: function () {
                            s = a.remote;
                            x.Fn.set("flash_" + a.channel + "_init", function () {
                                e(function () {
                                    n.up.callback(!0)
                                })
                            });
                            x.Fn.set("flash_" + a.channel + "_onMessage", j);
                            a.swf = B(a.swf);
                            var b = a.swf.match($)[3],
                                i = function () {
                                    x.stack.FlashTransport[b].init = !0;
                                    v = x.stack.FlashTransport[b].swf;
                                    v.createChannel(a.channel, a.secret, o(a.remote), a.isHost);
                                    a.isHost && (wa && a.swfNoThrottle && G(a.props, {
                                        position: "fixed",
                                        right: 0,
                                        top: 0,
                                        height: "20px",
                                        width: "20px"
                                    }), G(a.props, {
                                        src: u(a.remote, {
                                            xdm_e: o(d.href),
                                            xdm_c: a.channel,
                                            xdm_p: 6,
                                            xdm_s: a.secret
                                        }),
                                        name: f + a.channel + "_provider"
                                    }), k = D(a))
                                };
                            x.stack.FlashTransport[b] && x.stack.FlashTransport[b].init ? i() : x.stack.FlashTransport[b] ? x.stack.FlashTransport[b].queue.push(i) : (x.stack.FlashTransport[b] = {
                                queue: [i]
                            }, h(b))
                        },
                        init: function () {
                            q(n.onDOMReady, n)
                        }
                    }
                };
                x.stack.PostMessageTransport = function (b) {
                    function i(a) {
                        var f;
                        if (a.origin) f = o(a.origin);
                        else if (a.uri) f = o(a.uri);
                        else if (a.domain) f = d.protocol + "//" + a.domain;
                        else throw "Unable to retrieve the origin of the event";
                        f == k && a.data.substring(0, b.channel.length + 1) == b.channel + " " && j.up.incoming(a.data.substring(b.channel.length + 1), f)
                    }
                    var j, h, n, k;
                    return j = {
                        outgoing: function (a, d, f) {
                            n.postMessage(b.channel + " " + a, d || k);
                            f && f()
                        },
                        destroy: function () {
                            R(a, "message", i);
                            h && (n = null, h.parentNode.removeChild(h), h = null)
                        },
                        onDOMReady: function () {
                            k = o(b.remote);
                            if (b.isHost) {
                                var s = function (d) {
                                        d.data == b.channel + "-ready" && (n = "postMessage" in h.contentWindow ? h.contentWindow : h.contentWindow.document, R(a, "message", s), N(a, "message", i), e(function () {
                                            j.up.callback(!0)
                                        }, 0))
                                    };
                                N(a, "message", s);
                                G(b.props, {
                                    src: u(b.remote, {
                                        xdm_e: o(d.href),
                                        xdm_c: b.channel,
                                        xdm_p: 1
                                    }),
                                    name: f + b.channel + "_provider"
                                });
                                h = D(b)
                            } else N(a, "message", i), n = "postMessage" in a.parent ? a.parent : a.parent.document, n.postMessage(b.channel + "-ready", k), e(function () {
                                j.up.callback(!0)
                            }, 0)
                        },
                        init: function () {
                            q(j.onDOMReady, j)
                        }
                    }
                };
                x.stack.FrameElementTransport = function (j) {
                    var h, n, k, s;
                    return h = {
                        outgoing: function (a, b, d) {
                            k.call(this, a);
                            d && d()
                        },
                        destroy: function () {
                            n && (n.parentNode.removeChild(n), n = null)
                        },
                        onDOMReady: function () {
                            s = o(j.remote);
                            if (j.isHost) G(j.props, {
                                src: u(j.remote, {
                                    xdm_e: o(d.href),
                                    xdm_c: j.channel,
                                    xdm_p: 5
                                }),
                                name: f + j.channel + "_provider"
                            }), n = D(j), n.fn = function (a) {
                                delete n.fn;
                                k = a;
                                e(function () {
                                    h.up.callback(!0)
                                }, 0);
                                return function (a) {
                                    h.up.incoming(a, s)
                                }
                            };
                            else {
                                if (b.referrer && o(b.referrer) != ga.xdm_e) a.top.location = ga.xdm_e;
                                k = a.frameElement.fn(function (a) {
                                    h.up.incoming(a, s)
                                });
                                h.up.callback(!0)
                            }
                        },
                        init: function () {
                            q(h.onDOMReady, h)
                        }
                    }
                };
                x.stack.NameTransport = function (a) {
                    function b(d) {
                        k.contentWindow.sendMessage(d, a.remoteHelper + (n ? "#_3" : "#_2") + a.channel)
                    }
                    function d() {
                        n ? (2 === ++v || !n) && h.up.callback(!0) : (b("ready"), h.up.callback(!0))
                    }
                    function i(a) {
                        h.up.incoming(a, A)
                    }
                    function j() {
                        r && e(function () {
                            r(!0)
                        }, 0)
                    }
                    var h, n, k, s, v, r, A, w;
                    return h = {
                        outgoing: function (a, d, f) {
                            r = f;
                            b(a)
                        },
                        destroy: function () {
                            k.parentNode.removeChild(k);
                            k = null;
                            n && (s.parentNode.removeChild(s), s = null)
                        },
                        onDOMReady: function () {
                            n = a.isHost;
                            v = 0;
                            A = o(a.remote);
                            a.local = B(a.local);
                            n ? (x.Fn.set(a.channel, function (b) {
                                n && "ready" === b && (x.Fn.set(a.channel, i), d())
                            }), w = u(a.remote, {
                                xdm_e: a.local,
                                xdm_c: a.channel,
                                xdm_p: 2
                            }), G(a.props, {
                                src: w + "#" + a.channel,
                                name: f + a.channel + "_provider"
                            }), s = D(a)) : (a.remoteHelper = a.remote, x.Fn.set(a.channel, i));
                            k = D({
                                props: {
                                    src: a.local + "#_4" + a.channel
                                },
                                onLoad: function Ka() {
                                    var b = k || this;
                                    R(b, "load", Ka);
                                    x.Fn.set(a.channel + "_load", j);
                                    (function Aa() {
                                        "function" == typeof b.contentWindow.sendMessage ? d() : e(Aa, 50)
                                    })()
                                }
                            })
                        },
                        init: function () {
                            q(h.onDOMReady, h)
                        }
                    }
                };
                x.stack.HashTransport = function (b) {
                    function d() {
                        if (v) {
                            var a = v.location.href,
                                b = "",
                                f = a.indexOf("#"); - 1 != f && (b = a.substring(f));
                            b && b != k && (k = b, i.up.incoming(k.substring(k.indexOf("_") + 1), u))
                        }
                    }
                    var i, j, h, n, k, s, v, r, B, u;
                    return i = {
                        outgoing: function (a) {
                            if (r) a = b.remote + "#" + s+++"_" + a, (j || !B ? r.contentWindow : r).location = a
                        },
                        destroy: function () {
                            a.clearInterval(h);
                            (j || !B) && r.parentNode.removeChild(r);
                            r = null
                        },
                        onDOMReady: function () {
                            j = b.isHost;
                            n = b.interval;
                            k = "#" + b.channel;
                            s = 0;
                            B = b.useParent;
                            u = o(b.remote);
                            if (j) {
                                b.props = {
                                    src: b.remote,
                                    name: f + b.channel + "_provider"
                                };
                                if (B) b.onLoad = function () {
                                    v = a;
                                    h = setInterval(d, n);
                                    i.up.callback(!0)
                                };
                                else {
                                    var q = 0,
                                        A = b.delay / 50;
                                    (function Da() {
                                        if (++q > A) throw Error("Unable to reference listenerwindow");
                                        try {
                                            v = r.contentWindow.frames[f + b.channel + "_consumer"]
                                        } catch (a) {}
                                        v ? (h = setInterval(d, n), i.up.callback(!0)) : e(Da, 50)
                                    })()
                                }
                                r = D(b)
                            } else v = a, h = setInterval(d, n), B ? (r = parent, i.up.callback(!0)) : (G(b, {
                                props: {
                                    src: b.remote + "#" + b.channel + new Date,
                                    name: f + b.channel + "_consumer"
                                },
                                onLoad: function () {
                                    i.up.callback(!0)
                                }
                            }), r = D(b))
                        },
                        init: function () {
                            q(i.onDOMReady, i)
                        }
                    }
                };
                x.stack.ReliableBehavior = function () {
                    var a, b, d = 0,
                        f = 0,
                        e = "";
                    return a = {
                        incoming: function (i, j) {
                            var o = i.indexOf("_"),
                                m = i.substring(0, o).split(","),
                                i = i.substring(o + 1);
                            m[0] == d && (e = "", b && b(!0));
                            0 < i.length && (a.down.outgoing(m[1] + "," + d + "_" + e, j), f != m[1] && (f = m[1], a.up.incoming(i, j)))
                        },
                        outgoing: function (i, j, o) {
                            e = i;
                            b = o;
                            a.down.outgoing(f + "," + ++d + "_" + i, j)
                        }
                    }
                };
                x.stack.QueueBehavior = function (a) {
                    function b() {
                        if (a.remove && 0 === f.length) C(d);
                        else if (!i && !(0 === f.length || n)) {
                            i = !0;
                            var j = f.shift();
                            d.down.outgoing(j.data, j.origin, function (a) {
                                i = !1;
                                j.callback && e(function () {
                                    j.callback(a)
                                }, 0);
                                b()
                            })
                        }
                    }
                    var d, f = [],
                        i = !0,
                        o = "",
                        n, k = 0,
                        s = !1,
                        v = !1;
                    return d = {
                        init: function () {
                            w(a) && (a = {});
                            if (a.maxLength) k = a.maxLength, v = !0;
                            a.lazy ? s = !0 : d.down.init()
                        },
                        callback: function (a) {
                            i = !1;
                            var f = d.up;
                            b();
                            f.callback(a)
                        },
                        incoming: function (b, f) {
                            if (v) {
                                var e = b.indexOf("_"),
                                    i = parseInt(b.substring(0, e), 10);
                                o += b.substring(e + 1);
                                0 === i && (a.encode && (o = j(o)), d.up.incoming(o, f), o = "")
                            } else d.up.incoming(b, f)
                        },
                        outgoing: function (e, i, j) {
                            a.encode && (e = h(e));
                            var o = [],
                                m;
                            if (v) {
                                for (; 0 !== e.length;) m = e.substring(0, k), e = e.substring(m.length), o.push(m);
                                for (; m = o.shift();) f.push({
                                    data: o.length + "_" + m,
                                    origin: i,
                                    callback: 0 === o.length ? j : null
                                })
                            } else f.push({
                                data: e,
                                origin: i,
                                callback: j
                            });
                            s ? d.down.init() : b()
                        },
                        destroy: function () {
                            n = !0;
                            d.down.destroy()
                        }
                    }
                };
                x.stack.VerifyBehavior = function (a) {
                    function b() {
                        f = Math.random().toString(16).substring(2);
                        d.down.outgoing(f)
                    }
                    var d, f, e;
                    return d = {
                        incoming: function (i, j) {
                            var o = i.indexOf("_"); - 1 === o ? i === f ? d.up.callback(!0) : e || (e = i, a.initiate || b(), d.down.outgoing(i)) : i.substring(0, o) === e && d.up.incoming(i.substring(o + 1), j)
                        },
                        outgoing: function (a, b, e) {
                            d.down.outgoing(f + "_" + a, b, e)
                        },
                        callback: function () {
                            a.initiate && b()
                        }
                    }
                };
                x.stack.RpcBehavior = function (a, b) {
                    function d(a) {
                        a.jsonrpc = "2.0";
                        i.down.outgoing(j.stringify(a))
                    }
                    function f(a, b) {
                        var e = Array.prototype.slice;
                        return function () {
                            var f = arguments.length,
                                i, j = {
                                    method: b
                                };
                            0 < f && "function" === typeof arguments[f - 1] ? (1 < f && "function" === typeof arguments[f - 2] ? (i = {
                                success: arguments[f - 2],
                                error: arguments[f - 1]
                            }, j.params = e.call(arguments, 0, f - 2)) : (i = {
                                success: arguments[f - 1]
                            }, j.params = e.call(arguments, 0, f - 1)), m["" + ++o] = i, j.id = o) : j.params = e.call(arguments, 0);
                            if (a.namedParams && 1 === j.params.length) j.params = j.params[0];
                            d(j)
                        }
                    }
                    function e(a, b, f, i) {
                        if (f) {
                            var j, o;
                            b ? (j = function (a) {
                                j = E;
                                d({
                                    id: b,
                                    result: a
                                })
                            }, o = function (a, f) {
                                o = E;
                                var e = {
                                    id: b,
                                    error: {
                                        code: -32099,
                                        message: a
                                    }
                                };
                                if (f) e.error.data = f;
                                d(e)
                            }) : j = o = E;
                            "[object Array]" === Object.prototype.toString.call(i) || (i = [i]);
                            try {
                                var m = f.method.apply(f.scope, i.concat([j, o]));
                                w(m) || j(m)
                            } catch (h) {
                                o(h.message)
                            }
                        } else b && d({
                            id: b,
                            error: {
                                code: -32601,
                                message: "Procedure not found."
                            }
                        })
                    }
                    var i, j = b.serializer || ua(),
                        o = 0,
                        m = {};
                    return i = {
                        incoming: function (a) {
                            a = j.parse(a);
                            if (a.method) b.handle ? b.handle(a, d) : e(a.method, a.id, b.local[a.method], a.params);
                            else {
                                var f = m[a.id];
                                a.error ? f.error && f.error(a.error) : f.success && f.success(a.result);
                                delete m[a.id]
                            }
                        },
                        init: function () {
                            if (b.remote) for (var d in b.remote) b.remote.hasOwnProperty(d) && (a[d] = f(b.remote[d], d));
                            i.down.init()
                        },
                        destroy: function () {
                            for (var d in b.remote) b.remote.hasOwnProperty(d) && a.hasOwnProperty(d) && delete a[d];
                            i.down.destroy()
                        }
                    }
                };
                S.easyXDM = x
            })(d, document, location, d.setTimeout, decodeURIComponent, encodeURIComponent);
            (function (a, b, d, e) {
                a.fn.caret = function (j, h) {
                    var n, k, s = this[0],
                        v = a.browser.msie;
                    if ("object" === typeof j && "number" === typeof j.start && "number" === typeof j.end) n = j.start, k = j.end;
                    else if ("number" === typeof j && "number" === typeof h) n = j, k = h;
                    else if ("string" === typeof j) - 1 < (n = s.value.indexOf(j)) ? k = n + j[b] : n = null;
                    else if ("[object RegExp]" === Object.prototype.toString.call(j)) {
                        var q = j.exec(s.value);
                        if (null != q) n = q.index, k = n + q[0][b]
                    }
                    if ("undefined" != typeof n) return v ? (v = this[0].createTextRange(), v.collapse(!0), v.moveStart("character", n), v.moveEnd("character", k - n), v.select()) : (this[0].selectionStart = n, this[0].selectionEnd = k), this[0].focus(), this;
                    if (v) {
                        k = document.selection;
                        var o, B;
                        "textarea" != this[0].tagName.toLowerCase() ? (v = this.val(), n = k[d]()[e](), n.moveEnd("character", v[b]), o = "" == n.text ? v[b] : v.lastIndexOf(n.text), n = k[d]()[e](), n.moveStart("character", -v[b]), B = n.text[b]) : (n = k[d](), k = n[e](), k.moveToElementText(this[0]), k.setEndPoint("EndToEnd", n), o = k.text[b] - n.text[b], B = o + n.text[b])
                    } else o = s.selectionStart, B = s.selectionEnd;
                    n = s.value.substring(o, B);
                    return {
                        start: o,
                        end: B,
                        text: n,
                        replace: function (a) {
                            return s.value.substring(0, o) + a + s.value.substring(B, s.value[b])
                        }
                    }
                }
            })(e, "length", "createRange", "duplicate");
            (function (a, b) {
                a.fn.allParents = function () {
                    if (!this.length) return a([]);
                    for (var d = a(this[0]), e = d.parents(), d = d[0].ownerDocument; d !== b;) d = (d.parentWindow || d.defaultView).frameElement, e.push(d), Array.prototype.push.apply(e, a(d).parents().toArray()), d = d.ownerDocument;
                    return e
                }
            })(e, document);
            (function (a, b) {
                a.fn.bgPosition = function () {
                    return b.defaultView && b.defaultView.getComputedStyle ? this.css("background-position") : !this[0] || !this[0].currentStyle ? "0 0" : this[0].currentStyle.backgroundPositionX + " " + this[0].currentStyle.backgroundPositionY
                }
            })(e, document);
            (function (a, b) {
                function d(a, b, i) {
                    var j = a.constructor,
                        n = {
                            notImportant: !i
                        };
                    e.util.forEach(a, function (a) {
                        e.util.forEach(b, function (b, d) {
                            j.style(a, d, b, n)
                        })
                    })
                }
                var e = a.CLIPBOARD.client,
                    j = {
                        "background-image": "none",
                        "background-origin": "padding-box",
                        "background-size": "auto",
                        "border-spacing": "0",
                        border: "0 solid black",
                        "border-image": "none",
                        bottom: "auto",
                        clear: "none",
                        color: "#CFCFCF",
                        content: "normal",
                        crop: "auto",
                        cursor: "auto",
                        direction: "ltr",
                        "float": "none",
                        "font-family": '"Lucida Grande", Arial, sans-serif',
                        "font-size": "13px",
                        "font-size-adjust": "none",
                        "font-stretch": "normal",
                        "font-style": "normal",
                        "font-variant": "normal",
                        "font-weight": "normal",
                        height: "auto",
                        left: "auto",
                        "letter-spacing": "normal",
                        "line-break": "auto",
                        "line-height": "normal",
                        "margin-bottom": "0",
                        "margin-left": "0",
                        "margin-right": "0",
                        "margin-top": "0",
                        "max-height": "none",
                        "max-width": "none",
                        "min-height": "none",
                        "min-width": "none",
                        "outline-color": "invert",
                        "outline-style": "none",
                        "outline-width": "medium",
                        "overflow-wrap": "normal",
                        "padding-bottom": "0",
                        "padding-left": "0",
                        "padding-right": "0",
                        "padding-top": "0",
                        position: "static",
                        quotes: "none",
                        right: "auto",
                        "text-autospace": "none",
                        "text-decoration": "none",
                        "text-outline": "none",
                        "text-overflow": "clip",
                        "text-shadow": "none",
                        "text-transform": "none",
                        "text-wrap": "none",
                        top: "auto",
                        "unicode-bidi": "normal",
                        visibility: "visible",
                        "white-space": "normal",
                        width: "auto",
                        "word-break": "normal",
                        "word-spacing": "normal",
                        "z-index": "auto"
                    },
                    n = {
                        display: "block",
                        overflow: "visible",
                        "overflow-clip": "auto",
                        "overflow-style": "auto",
                        "overflow-x": "visible",
                        "overflow-y": "visible",
                        "text-align": "left",
                        "text-indent": "0",
                        widows: "2"
                    },
                    h = {
                        display: "inline",
                        "vertical-align": "baseline"
                    },
                    k = ["moz", "webkit", "o", "ms"],
                    s = {
                        "border-top-left-radius": 0,
                        "border-top-right-radius": 0,
                        "border-bottom-left-radius": 0,
                        "border-bottom-right-radius": 0,
                        "box-shadow": "none"
                    },
                    v;
                for (v in s) {
                    j[v] = s[v];
                    for (var q = 0; q < k.length; q++) s.hasOwnProperty(v) && (j["-" + k[q] + "-" + v] = s[v])
                }
                if (b.support.opacity) j.opacity = "1", j["background-color"] = "transparent", j["background-attachment"] = "scroll", j["background-position"] = "0 0", j["background-image"] = "none", j["background-repeat"] = "repeat";
                b.fn.applyBlockStyles = function () {
                    var a = b.extend({}, j, n);
                    d(this, a, !1);
                    return this
                };
                b.fn.applyInlineStyles = function () {
                    var a = b.extend({}, j, h);
                    d(this, a, !1);
                    return this
                };
                b.fn.applyTableStyles = function () {
                    this.applyBlockStyles();
                    d(this, {
                        "border-collapse": "separate",
                        "table-layout": "auto",
                        display: "table"
                    }, !1);
                    return this
                };
                b.fn.applyTableCellStyles = function () {
                    this.applyBlockStyles();
                    d(this, {
                        "empty-cells": "show",
                        "vertical-align": "baseline",
                        display: "table-cell"
                    }, !1);
                    return this
                };
                b.fn.applyTableRowStyles = function () {
                    this.applyBlockStyles();
                    d(this, {
                        display: "table-row"
                    }, !1);
                    return this
                };
                b.fn.applyListStyles = function () {
                    this.applyBlockStyles();
                    d(this, {
                        "list-style-image": "none",
                        "list-style-position": "outside",
                        "list-style-type": "disc"
                    }, !1);
                    return this
                };
                b.fn.applyLinkStyles = function () {
                    this.applyInlineStyles();
                    d(this, {
                        cursor: "pointer"
                    }, !1);
                    return this
                };
                b.fn.applyListItemStyles = function () {
                    this.applyBlockStyles();
                    d(this, {
                        display: "list-item"
                    }, !1);
                    return this
                };
                b.fn.applyTextInputStyles = function () {
                    this.applyInlineStyles();
                    d(this, {
                        cursor: "text"
                    }, !1);
                    return this
                };
                b.fn.cssImportant = function (a, b) {
                    return this.css(a, b, !0)
                }
            })(d, e);
            (function (a, b) {
                b.htmlEncode = function (a) {
                    return b("<div/>").text(a || "").html()
                };
                b.htmlDecode = function (a) {
                    return b("<div/>").html(a || "").text()
                }
            })(d, e);
            (function (a) {
                a.fn.trueCoordinates = function (a) {
                    if (!a) return {
                        left: parseFloat(this.attr("clipboard_left")),
                        top: parseFloat(this.attr("clipboard_top"))
                    };
                    this.attr("clipboard_left", a.left).attr("clipboard_top", a.top);
                    return this
                };
                a.fn.removeTrueCoordinates = function () {
                    return this.removeAttr("clipboard_left").removeAttr("clipboard_top")
                }
            })(e);
            (function (a, b) {
                a.fn.trueOffset = function () {
                    for (var d = this.offset(), e = this[0].ownerDocument; e !== b;) {
                        var e = (e.parentWindow || e.defaultView).frameElement,
                            j = a(e).offset();
                        d.left += j.left;
                        d.top += j.top;
                        e = e.ownerDocument
                    }
                    return d
                }
            })(e, document);
            (function () {
                function a(b) {
                    return 10 > b ? "0" + b : b
                }
                function b(a) {
                    n.lastIndex = 0;
                    return n.test(a) ? '"' + a.replace(n, function (a) {
                        var b = v[a];
                        return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    }) + '"' : '"' + a + '"'
                }
                function e(a, d) {
                    var j, n, m, h, v = k,
                        r, B = d[a];
                    B && "object" === typeof B && "function" === typeof B.toJSON && (B = B.toJSON(a));
                    "function" === typeof q && (B = q.call(d, a, B));
                    switch (typeof B) {
                    case "string":
                        return b(B);
                    case "number":
                        return isFinite(B) ? "" + B : "null";
                    case "boolean":
                    case "null":
                        return "" + B;
                    case "object":
                        if (!B) return "null";
                        k += s;
                        r = [];
                        if ("[object Array]" === Object.prototype.toString.apply(B)) {
                            h = B.length;
                            for (j = 0; j < h; j += 1) r[j] = e(j, B) || "null";
                            m = 0 === r.length ? "[]" : k ? "[\n" + k + r.join(",\n" + k) + "\n" + v + "]" : "[" + r.join(",") + "]";
                            k = v;
                            return m
                        }
                        if (q && "object" === typeof q) {
                            h = q.length;
                            for (j = 0; j < h; j += 1) n = q[j], "string" === typeof n && (m = e(n, B)) && r.push(b(n) + (k ? ": " : ":") + m)
                        } else for (n in B) Object.hasOwnProperty.call(B, n) && (m = e(n, B)) && r.push(b(n) + (k ? ": " : ":") + m);
                        m = 0 === r.length ? "{}" : k ? "{\n" + k + r.join(",\n" + k) + "\n" + v + "}" : "{" + r.join(",") + "}";
                        k = v;
                        return m
                    }
                }
                if ("function" !== typeof Date.prototype.toJSON) Date.prototype.toJSON = function () {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "Z" : null
                }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                    return this.valueOf()
                };
                var j = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    n = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    k, s, v = {
                        "\u0008": "\\b",
                        "\t": "\\t",
                        "\n": "\\n",
                        "\u000c": "\\f",
                        "\r": "\\r",
                        '"': '\\"',
                        "\\": "\\\\"
                    },
                    q;
                if ("function" !== typeof d.CLIPBOARD.JSON.stringify) d.CLIPBOARD.JSON.stringify = function (a, b, d) {
                    var j;
                    s = k = "";
                    if ("number" === typeof d) for (j = 0; j < d; j += 1) s += " ";
                    else "string" === typeof d && (s = d);
                    if ((q = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) throw Error("JSON.stringify");
                    return e("", {
                        "": a
                    })
                };
                if ("function" !== typeof d.CLIPBOARD.JSON.parse) d.CLIPBOARD.JSON.parse = function (a, b) {
                    function d(a, e) {
                        var j, i, n = a[e];
                        if (n && "object" === typeof n) for (j in n) Object.hasOwnProperty.call(n, j) && (i = d(n, j), i !== h ? n[j] = i : delete n[j]);
                        return b.call(a, e, n)
                    }
                    var e, a = "" + a;
                    j.lastIndex = 0;
                    j.test(a) && (a = a.replace(j, function (a) {
                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    }));
                    if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return e = eval("(" + a + ")"), "function" === typeof b ? d({
                        "": e
                    }, "") : e;
                    throw new SyntaxError("JSON.parse");
                }
            })()
        })();
        this.xdm = d.easyXDM;
        if (this.domain !== d.location.host) this.xdm = this.xdm.noConflict(u.util.idSuffix);
        this.$("head").append(this.$("<link/>").attr({
            type: "text/css",
            rel: "stylesheet",
            href: this.baseUri + "css/bookmarklet_0.9.97.css"
        }), this.$("<link/>").attr({
            type: "text/css",
            rel: "stylesheet",
            href: this.baseUri + "css/clipText_0.9.97.css"
        }));
        this.trigger("initialized");
        return !0
    }
    function j(a) {
        if (document.createEvent) {
            var b;
            try {
                b = this.document.createEvent("CustomEvent"), b.initCustomEvent(a, !0, !0, this)
            } catch (e) {
                b = this.document.createEvent("Event"), b.initEvent(a, !0, !0)
            }
            d.dispatchEvent(b)
        }
    }
    function n(n, h) {
        this.initialize();
        h = u.util.merge(u.util.merge({}, V), h);
        this.scope = n || d.document.documentElement;
        this.document = this.scope.ownerDocument;
        this.documentId = R(this.document);
        this.preferences = {};
        if (0 > this.documentId) O.push(this.document), this.documentId = O.length - 1;
        this.user = {
            guid: "",
            sessionId: ""
        };
        var G = b(this.document);
        this.baseUri = G.baseUri || "";
        this.domain = this.baseUri.replace(/^https?:\/\/(.+?)(?:\/.*)?$/, "$1");
        this.scriptId = G.scriptId || "";
        s[this.documentId] || (s[this.documentId] = {
            env: {
                iHatePrototype: e(this.document)
            },
            baseData: {},
            $: null,
            bodyOffset: {}
        });
        this.$ = s[this.documentId].$;
        this.env = s[this.documentId].env;
        this.baseData = s[this.documentId].baseData;
        this.support = a;
        this.defaultTitle = u.util.trim(this.document.title) || this.document.location.href;
        K.call(this);
        if (!this.support) this.support = a = {
            rgba: v(this.$),
            dpi: B(this.$),
            regexSplit: 3 === "x y".split(/(\s)/).length
        };
        G = {
            $: this.$,
            document: this.document,
            baseUri: this.baseUri,
            baseData: this.baseData,
            bodyOffset: this.bodyOffset,
            support: this.support,
            preferences: this.preferences
        };
        this.ui = new u.ui.UiController(G);
        this.dao = new u.DataAccess(this.baseUri, this.$.ajax, this.xdm);
        this.controls = [this.ui];
        this.selectors = h.populateSelectorsThunk(G);
        this.extractors = {};
        for (var w in this.selectors) this.selectors.hasOwnProperty(w) && (this.extractors[w] = this.selectors[w].getExtractor());
        this.extractors.bookmark = new u.extractors.bookmarkExtractor(G);
        N.call(this);
        this.on("activated", function () {
            this.activeSelector && q.call(this, this.activeSelector.type, !0)
        });
        this.dao.getAutocompleteDict(function (a, b) {
            a || d.CLIPBOARD.setAutocompleteDict(b)
        });
        this.env.iHatePrototype.stupidFuckingPrototype && k.call(this, "info", {
            data: "badPrototypeVersion"
        });
        j.call(this, "clipperCreated")
    }
    a = void 0;
    var s = {},
        O = [],
        u = d.CLIPBOARD.client,
        G = "rectangle",
        V = {
            populateSelectorsThunk: function (a) {
                return {
                    text: new u.selectors.TextSelector(a),
                    rectangle: new u.selectors.RectangleSelector(a)
                }
            }
        };
    n.prototype.createClip = function () {
        var a = {
            source: d.location.href,
            date: (new Date).toString(),
            type: "clip",
            version: "0.1",
            title: "",
            html: "",
            text: "",
            annotation: "",
            width: 0,
            height: 0,
            top: null,
            left: null,
            "private": !0
        };
        return function (b) {
            return u.util.merge(u.util.merge({}, u.util.merge(a, {
                title: this.defaultTitle
            })), b)
        }
    }();
    n.getInstance = function () {
        var a;
        return function () {
            if (!a) a = new n, d[a.scriptId] = {
                reload: function () {
                    a.activate()
                }
            }, d[a.scriptId + "_reload"] = d[a.scriptId].reload;
            return a
        }
    }();
    u.util.inherit(n, u.ActivatableControl, u.EventEmitter);
    n.prototype.constructor = n;
    n.prototype.setActiveSelectorByContext = function () {
        for (var a in this.selectors) if (this.selectors.hasOwnProperty(a) && this.selectors[a].shouldUseAsDefault()) {
            this.setActiveSelector(a);
            break
        }
    };
    n.prototype.setActiveSelector = function (a) {
        if (this.selectors[a] && this.activeSelector !== this.selectors[a]) this.activeSelector && (this.activeSelector.deactivate(), this.activeExtractor.deactivate(), this.removeControl(this.activeSelector), this.removeControl(this.activeExtractor)), this.activeSelector = this.selectors[a], this.activeExtractor = this.extractors[a], this.controls.push(this.activeSelector)
    };
    n.prototype.getOrigin = function () {
        return d[this.scriptId + "_origin"] || "bookmarklet"
    };
    n.prototype.doActivate = function () {
        var a = !0;
        return function () {
            a ? a = !1 : this.trigger("reloaded")
        }
    }();
    u.Clipper = n
})(window);
(function (d) {
    d.CLIPBOARD.client.Extractor = {
        $: null,
        type: null,
        initialize: function () {
            this.$ = null
        },
        extract: function () {
            return ""
        }
    }
})(window);
(function (d) {
    d.CLIPBOARD.client.Selector = {
        initialize: function () {
            this.type = this.$ = null
        },
        $: null,
        type: null,
        select: function () {},
        getSelection: function () {
            return {
                startElement: null,
                endElement: null
            }
        },
        disableGlobalEvents: function () {},
        enableGlobalEvents: function () {},
        shouldUseAsDefault: function () {
            return !1
        },
        getExtractor: function () {
            return null
        },
        setPreferences: function () {},
        failureStatus: {
            nowhereToZoom: "nowhereToZoom",
            maxSizeExceededViaZoom: "maxSizeExceededViaZoom",
            maxSizeExceededViaDrag: "maxSizeExceededViaDrag"
        }
    }
})(window);
(function (d) {
    function h(a) {
        a.props = {};
        a.props[b.util.doNotClipAllAttributeName] = !0;
        return new this.xdm.Socket(a)
    }
    function a(a, b, d) {
        this.initialize();
        this.baseUri = a;
        this.sendAjaxRequest = b;
        this.promises = [];
        this.xdm = d
    }
    var b = d.CLIPBOARD.client,
        e = {
            crossDomainPostFailed: "crossDomainPostFailedForPromise",
            emptyResponse: "emptyResponseFromPromise",
            retryCount: "maxedOutPromiseRetryCount",
            serverSideSave: "failedToSaveClipOrBlob",
            promiseUnavailable: "promiseUnavailable",
            timeout: "savingClipTimedOut",
            malformedResponse: "malformedJsonInClipSaveResponse",
            invalidResponse: "invalidResponseSavingClip",
            expiredRequest: "expiredRequest",
            expiredSession: "expiredSession",
            unauthorized: "unauthorized",
            badRequest: "badRequest",
            emptyResult: "emptyResultSavingClip",
            unknown: "unknown"
        },
        k = function () {
            function a(b, d) {
                this.trigger("firstLoginStatus", {
                    initialState: d,
                    thirdPartyCookiesEnabled: b.thirdPartyCookiesEnabled
                })
            }
            var b = 2E3,
                e = 0,
                I = null,
                D = !0,
                C, Q = 0,
                J = "loggedIn";
            return function (x) {
                D && (C = (new Date).getTime());
                var N = this;
                I && (I = clearTimeout(I));
                var R = h.call(this, {
                    remote: N.baseUri + "utils/crossDomainPost.html",
                    onReady: function () {
                        R.postMessage(d.CLIPBOARD.JSON.stringify({
                            action: "fetchUserData"
                        }))
                    },
                    onMessage: function (h) {
                        h = h && h.length && d.CLIPBOARD.JSON.parse(h) || {};
                        h.loggedIn ? (D && a.call(N, h, "loggedIn"), "loggedOut" === J && (Q = ((new Date).getTime() - C) / 1E3), N.trigger("loggedIn", {
                            preferences: h.preferences,
                            timeTakenToLogin: Q,
                            userGuid: h.guid,
                            sessionId: h.sid
                        })) : (D && (J = "loggedOut", a.call(N, h, "loggedOut")), x && h.thirdPartyCookiesEnabled && (30 < ++e && (b = 5E3), I = setTimeout(function () {
                            k.call(N, !0)
                        }, b)));
                        d.CLIPBOARD.config = h.config;
                        D = !1;
                        R.destroy()
                    }
                })
            }
        }();
    a.promiseResult = {
        processing: 0,
        succeeded: 1,
        failedToSave: -1,
        unavailable: -2
    };
    a.sendFailureStatus = e;
    b.util.inherit(a, b.EventEmitter);
    a.prototype.constructor = a;
    a.prototype.checkLoginStatus = function (a) {
        k.call(this, !! a)
    };
    b.util.merge(a.prototype, {
        addPromiseCheck: function (b, d) {
            var h = this,
                d = d || (new Date).getTime();
            h.promises.push(b);
            if (!h.promises.timeoutId) h.promises.timeoutId = setTimeout(function () {
                h.promises.timeoutId = null;
                if (0 !== h.promises.length) {
                    var b = h.promises.shift();
                    h.sendAjaxRequest({
                        dataType: "jsonp",
                        url: h.baseUri + "api/v1/promises/" + encodeURIComponent(b.key),
                        error: function () {
                            h.trigger("sendFailed", {
                                reason: e.crossDomainPostFailed
                            })
                        },
                        success: function (k) {
                            if (k) switch (k.status) {
                            case a.promiseResult.processing:
                                if (10 < b.tryCount) {
                                    h.trigger("sendFailed", {
                                        reason: e.retryCount
                                    });
                                    break
                                }
                                b.tryCount++;
                                h.addPromiseCheck(b, d);
                                break;
                            case a.promiseResult.succeeded:
                                h.trigger("sendSucceeded", {
                                    retryAttempts: b.tryCount - 1,
                                    duration: (new Date).getTime() - d
                                });
                                break;
                            case a.promiseResult.failedToSave:
                                h.trigger("sendFailed", {
                                    reason: e.serverSideSave
                                });
                                break;
                            case a.promiseResult.unavailable:
                                h.trigger("sendFailed", {
                                    reason: e.promiseUnavailable
                                })
                            } else h.trigger("sendFailed", {
                                reason: e.emptyResponse
                            })
                        }
                    })
                }
            }, 500)
        },
        updatePreferences: function (a) {
            var a = b.util.merge({}, a),
                e = {};
            b.util.forEach(a, function (a, b) {
                e[b] = "object" === typeof a ? d.CLIPBOARD.JSON.stringify(a) : a
            });
            var k = h.call(this, {
                remote: this.baseUri + "utils/crossDomainPost.html",
                onReady: function () {
                    var a = d.CLIPBOARD.JSON.stringify({
                        APIpath: "/api/v1/users",
                        method: "PUT",
                        data: e
                    });
                    k.postMessage(a)
                },
                onMessage: function () {
                    k.destroy()
                }
            })
        },
        sendClip: function (a) {
            this.trigger("sendingClip");
            if ((/^https?:\/\/(.+?)\//i.exec(this.baseUri) || [])[1] === d.location.host && "/tutorial" === d.location.pathname) this.trigger("sendSucceeded");
            else var b = this,
                k = setTimeout(function () {
                    b.trigger("sendFailed", {
                        reason: e.timeout
                    })
                }, 5E3),
                I = h.call(this, {
                    remote: b.baseUri + "utils/crossDomainPost.html",
                    onReady: function () {
                        clearTimeout(k);
                        I.postMessage(d.CLIPBOARD.JSON.stringify({
                            APIpath: "/api/v1/clips",
                            method: "POST",
                            data: a
                        }))
                    },
                    onMessage: function (a) {
                        var h;
                        if (a && 0 < a.length) try {
                            if (a = d.CLIPBOARD.JSON.parse(a), a.error) {
                                var k = a.error;
                                h = k.expiredSession ? e.expiredSession : k.expiredRequest ? e.expiredRequest : k.badRequest ? e.badRequest : k.unauthorized ? e.unauthorized : e.unknown
                            } else a.result ? b.addPromiseCheck({
                                key: a.result.promiseKey,
                                tryCount: 0
                            }) : h = e.emptyResult
                        } catch (q) {
                            h = e.malformedResponse
                        } else h = e.invalidResponse;
                        h && b.trigger("sendFailed", {
                            reason: h
                        });
                        I.destroy()
                    }
                })
        },
        logMetric: function (a, b, d) {
            var e = this;
            setTimeout(function () {
                e.sendAjaxRequest(e.baseUri + "api/v1/metrics/" + (d.guid || ""), {
                    type: "GET",
                    data: {
                        eventName: a,
                        sessionId: d.sessionId,
                        data: b || {}
                    },
                    dataType: "jsonp"
                })
            }, 20)
        },
        getAutocompleteDict: function (a) {
            var b = h.call(this, {
                remote: this.baseUri + "utils/crossDomainPost.html",
                onReady: function () {
                    var a = d.CLIPBOARD.JSON.stringify({
                        action: "fetchAutocompleteDict"
                    });
                    b.postMessage(a)
                },
                onMessage: function (d) {
                    if (d && d.length) {
                        var e = null,
                            h = null;
                        try {
                            e = JSON.parse(d).result
                        } catch (k) {
                            h = k
                        }
                        a(h, e)
                    } else a(!0);
                    b.destroy()
                }
            })
        }
    });
    b.DataAccess = a
})(window);
(function (d) {
    var h, a, b, e, k, q, E, w, I, D, C, Q, J, x, N, R, P, v, B, S, K, j, n;

    function s(a) {
        return "review_" + T.util.addSuffix(a)
    }
    function O(a, b, d) {
        a.close();
        a.trigger("confirmed", {
            method: d,
            clip: b.clip,
            reviewData: u(a.$)
        })
    }
    function u(b) {
        var d = b("#" + h).is(":checked"),
            e = T.util.trim(b("#" + a).val());
        e === b("#" + a).attr("placeholder") && (e = "");
        return {
            published: d,
            annotation: e
        }
    }
    function G(a) {
        var d = this.$,
            j = d("<div/>").attr("id", b).text(a.clip.title),
            a = d("<div/>").attr("id", e).text(a.clip.source),
            h = d("<img/>").attr("id", k).attr("src", this.baseUri + "images/bookmarkMed.png"),
            j = d("<div/>").attr("id", q).append(h, j, a);
        return d("<div/>").append(j).html()
    }
    function V(a) {
        this.initialize();
        this.baseUri = a.baseUri;
        this.$ = a.$;
        this.document = a.document;
        this.$dialog = this.$overlay = null
    }
    var T = d.CLIPBOARD.client;
    n = s("overlay");
    B = s("button");
    b = s("bookmarkTitle");
    e = s("bookmarkSubtitle");
    k = s("bookmarkImage");
    q = s("bookmarkWrapper");
    s("activeControl");
    h = s("publishControl");
    Q = s("publishWrapper");
    J = s("publishText");
    a = s("annotate");
    E = s("dialog");
    w = s("header");
    I = s("contents");
    D = s("clipContents");
    C = s("controls");
    s("control");
    x = s("footer");
    N = s("inputContainer");
    R = s("reviewClip");
    P = s("reviewClipLabel");
    K = s("buttonWrapper");
    S = s("save");
    v = s("cancel");
    j = s("wrapper");
    T.util.inherit(V, T.ActivatableControl, T.EventEmitter);
    V.prototype.close = function () {
        if (this.isOpen()) {
            this.trigger("closing");
            var a = this,
                b = this.$;
            this.$overlay.fadeOut(200, function () {
                a.$overlay.remove();
                a.$overlay = null
            });
            this.$dialog.fadeOut(200, function () {
                a.$dialog.remove();
                a.$dialog = null
            });
            b(this.document).off("." + T.util.eventNamespace.review);
            this.trigger("closed")
        }
    };
    V.prototype.open = function (b) {
        var e = this.$,
            k = this;
        k.trigger("opening");
        var s = e(d).width(),
            i = e(d).height(),
            q = b.clip.height + 20 + 160,
            m, r;
        "bookmark" == b.clip.type ? (r = G.call(this, b), m = 640, q = 300) : (m = Math.min(Math.max(600, b.clip.width + 50), s - 100), q = Math.min(q, i - 100), r = b.rawHtml.replace(/&amp;/g, "&"));
        this.$dialog = e("<div/>").applyBlockStyles().attr("id", E);
        var u = e("<div/>").applyBlockStyles().attr("id", w).append(e("<h1/>").applyBlockStyles().text("Annotate, tag or share your clip!")),
            V = e("<div/>").applyBlockStyles().attr("id", I).cssImportant("height", q - 160 + "px");
        e("<div/>").applyBlockStyles().attr("id", D).addClass("clipping_314159265").html(r).appendTo(V);
        r = e("<div/>").applyBlockStyles().attr("id", C);
        e("<input/>").applyTextInputStyles().attr({
            id: a,
            placeholder: "Enter annotation, #tags and @mentions",
            title: "Enter annotation, #tags and @mentions",
            type: "text"
        }).on("keypress keydown keyup", function (a) {
            27 === a.keyCode || 13 === a.keyCode || a.stopPropagation()
        }).appendTo(r).autocompletify({
            "@": 1,
            "#": 1
        });
        var F = e("<span/>").applyInlineStyles().attr("id", Q).append(e("<input/>").applyInlineStyles().attr("id", h).attr("type", "checkbox").attr("checked", this.preferences.publishByDefault)).append(e("<label/>").applyInlineStyles().attr("id", J).attr("for", h).text("Publish clip"));
        r.append(F);
        F = e("<div/>").applyBlockStyles().attr("id", x);
        e("<div/>").applyBlockStyles().attr("id", N).append(e("<input/>").applyInlineStyles().attr({
            type: "checkbox",
            id: R,
            checked: !this.preferences.reviewClip
        })).change(function (a) {
            a = e(a.target);
            k.trigger("preferencesUpdated", {
                preferences: {
                    reviewClip: !a.is(":checked")
                }
            })
        }).append(e("<label/>").applyInlineStyles().attr({
            "for": R,
            id: P
        }).text("Do not show this popup anymore")).appendTo(F);
        var Ea = e("<button/>").applyInlineStyles().attr("id", v).addClass(B).text("Cancel").click(function () {
            k.trigger("canceled", {
                method: "cancelButton"
            });
            k.close()
        }),
            ia = e("<button/>").applyInlineStyles().attr("id", S).addClass(B).text("Save").click(function () {
                O(k, b, "saveButton")
            });
        e("<div/>").applyBlockStyles().attr("id", K).append(Ea, ia).appendTo(F);
        e("<div/>").applyBlockStyles().attr("id", j).append(u, V, r, F).appendTo(this.$dialog);
        this.$dialog.appendTo("body");
        T.util.assureFixedPositioning(this.$dialog);
        V = u = 0;
        !e.support.boxModel && e.browser.msie && "8.0" === e.browser.version && (u = e(d).scrollTop(), V = e(d).scrollLeft());
        this.$overlay = e("<div>").applyBlockStyles().attr("id", n).cssImportant({
            top: 0,
            left: 0,
            position: "fixed"
        }).appendTo("body");
        T.util.assureFixedPositioning(this.$overlay);
        this.$overlay.animate({
            opacity: 0.8
        }, 500, "easeInOutQuad");
        this.$dialog.cssImportant({
            left: b.clip.left - e(d).scrollLeft(),
            top: b.clip.top - e(d).scrollTop(),
            overflow: "hidden",
            width: b.clip.width,
            height: b.clip.height
        }).delay(100).animate({
            width: m,
            height: q,
            left: 0.5 * (s - m) + V,
            top: 0.5 * (i - q) + u,
            opacity: 1
        }, 750, "easeInOutQuad", function () {
            e(this).cssImportant("overflow", "visible").find('input[type="text"]:first').focus()
        });
        e(this.document).on("keydown." + T.util.eventNamespace.review, function (a) {
            27 === a.keyCode ? (k.trigger("canceled", {
                method: "escapeKey"
            }), k.close()) : 13 === a.keyCode && O(k, b, "enterKey")
        });
        this.trigger("opened")
    };
    V.prototype.constructor = V;
    V.prototype.isOpen = function () {
        return !!this.$overlay && !! this.$dialog
    };
    V.prototype.doDeactivate = function () {
        this.isOpen() && this.close()
    };
    V.prototype.setPreferences = function (a) {
        this.preferences = a
    };
    T.ui.Review = V
})(window);
(function (d) {
    function h(a) {
        function b() {
            P.remove();
            h.remove();
            v.remove();
            I.remove()
        }
        var e = this.$,
            h = e("<div/>").css({
                position: "fixed",
                top: 0,
                left: 0,
                background: "#000000",
                zIndex: E,
                opacity: 0.5,
                width: "100%",
                height: "100%"
            }),
            k = "#faq-third-party-cookies",
            w = d.navigator.userAgent;
        /MSIE/i.test(w) ? k += "-ie" : /Firefox/i.test(w) ? k += "-firefox" : /Chrome/i.test(w) ? k += "-chrome" : /Safari/i.test(w) && (k += "-safari");
        w = "";
        switch (a) {
        case "cookies":
            w = '<p style="">The clipper requires 3rd party cookies to be enabled. Head over to our <a target="_blank" href="' + this.baseUri + "help" + k + '" style="color: #469CB9">help page</a> for instructions on how to enable them.</p>'
        }
        var w = w + '<p style="position: absolute; bottom: 40px; margin: 0 auto; width: 90%">Click anywhere to dismiss this message.</p>',
            a = {
                top: "50%",
                left: "50%",
                display: "none",
                width: 600,
                height: 440,
                padding: "20px",
                "margin-left": -300,
                "margin-top": -220,
                position: "fixed"
            },
            I = e("<div/>").css(e.extend({}, a, {
                background: "#eee",
                "z-index": E + 3
            })).appendTo("body"),
            P = e("<div/>").css(e.extend({}, a, {
                background: "transparent url(" + this.baseUri + "images/logo1_0.9.97.png) no-repeat center center",
                opacity: 0.3,
                "z-index": E + 4
            })),
            v = e("<div/>");
        v.css(e.extend({}, a, {
            zIndex: E + 5,
            "-webkit-border-radius": "3px",
            "-moz-border-radius": "3px",
            "border-radius": "3px",
            "-webkit-box-shadow": "-3px 3px 10px rgba(0,0,0,0.75)",
            "box-shadow": "-3px 3px 10px rgba(0,0,0,0.75)",
            background: "transparent",
            color: "rgb(57,39,27)",
            "text-align": "center",
            "font-family": '"lucida grande", tahoma, verdana, arial, sans-serif',
            "font-size": "22px"
        })).html(w);
        e.each([I, h, P, v], function () {
            this.appendTo("body").fadeIn().click(b)
        });
        q.util.assureFixedPositioning(h)
    }
    function a(a) {
        return function () {
            a.$(d).unbind("." + w);
            a.$(a.document).unbind("." + w);
            a.widget.hide()
        }
    }
    function b(a) {
        return function () {
            a.widget.show()
        }
    }
    function e(a) {
        return function (b) {
            a.trigger("reviewConfirmed", b);
            var d = b.clip;
            d.annotation = b.reviewData.annotation;
            d["private"] = !b.reviewData.published;
            a.trigger("clipConfirmed", {
                clip: d
            })
        }
    }
    function k(d, h) {
        this.initialize();
        this.baseUri = d.baseUri;
        this.$ = d.$;
        this.document = d.document;
        this.shouldShowReview = d.preferences.reviewClip;
        h = q.util.merge(q.util.merge({}, {
            review: I.review(d),
            widget: I.widget(d)
        }), h);
        this.review = h.review;
        this.widget = h.widget;
        this.controls = [this.review, this.widget];
        this.review.on("opening", a(this)).on("closing", b(this)).on("confirmed", e(this)).bubble("preferencesUpdated").to(this).bubble("closing").to(this, "reviewClosing").bubble("closed").to(this, "reviewClosed").bubble("opening").to(this, "reviewOpening").bubble("canceled").to(this, "reviewCanceled");
        this.widget.bubble("navigated").to(this).bubble("selectorSwitched").to(this).bubble("preferencesUpdated").to(this).bubble("displayed").to(this, "controlsDisplayed")
    }
    var q = d.CLIPBOARD.client,
        E = 9999999,
        w = "clipboard_ui",
        I = {
            review: function (a) {
                return new q.ui.Review(a)
            },
            widget: function (a) {
                return new q.ui.Widget(a)
            }
        };
    q.util.inherit(k, q.ActivatableControl, q.EventEmitter);
    k.prototype.constructor = k;
    k.prototype.doDeactivate = function () {
        this.hideNotification()
    };
    q.util.merge(k.prototype, {
        show3rdPartyCookiesErrorMessage: function () {
            h.call(this, "cookies")
        },
        showNotification: function (a, b) {
            this.widget.showMessage(a, b)
        },
        hideNotification: function (a) {
            this.widget.hideMessage(a)
        },
        showErrorNotification: function (a, b) {
            this.widget.showErrorMessage(a, b)
        },
        initLoggedIn: function (a) {
            this.widget.initLoggedIn( !! a)
        },
        initLoggedOut: function () {
            this.widget.initLoggedOut()
        },
        enableClipping: function (a) {
            this.widget.enableClipping(a)
        },
        disableClipping: function (a) {
            this.widget.disableClipping(a)
        },
        reviewClip: function (a) {
            this.shouldShowReview ? this.review.open(a) : this.trigger("clipConfirmed", a)
        },
        setPreferences: function (a) {
            this.shouldShowReview = !! a.reviewClip;
            this.widget.setPreferences(a);
            this.review.setPreferences(a)
        }
    });
    q.ui.UiController = k
})(window);
(function (d, h) {
    function a(a) {
        return "widget_" + j.util.addSuffix(a)
    }
    function b(a, b) {
        for (var d = b.split(" "), e = 0; e < d.length; e++) if (/Active_clipboard_314159265$/.test(d[e])) return d[e];
        return ""
    }
    function e(b) {
        return function () {
            return a(b + "Active")
        }
    }
    function k(a) {
        return function () {
            var b;
            b = /Active_clipboard_314159265\b/.test(a.$("#" + F.selectorType)[0].className);
            a.trigger("navigated", {
                source: "initiate",
                type: a.currentSelectorType,
                status: b ? "disabled" : "enabled"
            })
        }
    }
    function q(a) {
        this.trigger("selectorSwitched", {
            type: a
        })
    }
    function E() {
        var a = this.$("#" + F.flyout).cssImportant("background-color", "#57443f");
        this.$.browser.webkit && a.show();
        a.slideDown(250);
        this.$("#" + F.menuContainer).addClass(V)
    }
    function w(a) {
        var b = this.$,
            d = this;
        b("#" + F.flyout).slideUp(250, function () {
            b(this).empty();
            d.activeTab = null;
            b(this).cssImportant("background-color", "transparent");
            b("#" + F.menuContainer).removeClass(V);
            a && a()
        })
    }
    function I(a, b) {
        var d = a.$;
        return function () {
            var e = d(this),
                j = {};
            j[b] = e.is('input[type="checkbox"]') ? e.is(":checked") : e.val();
            D.call(a, j)
        }
    }
    function D(a) {
        this.trigger("preferencesUpdated", {
            preferences: a
        })
    }
    function C() {
        var d = this.$,
            h = this,
            n = d("#" + F.clipContainer).find("." + i).andSelf();
        if (this.activeTab === ba.selectors) w.call(this, function () {
            P(n, !1)
        });
        else {
            P(n, !0);
            var m = [];
            j.util.forEach(ia, function (j, i) {
                var n = i.toLowerCase(),
                    k = d("<div/>").addClass(T).applyBlockStyles(),
                    s = d("<div/>").applyBlockStyles().attr("id", a(n + "Dark")).addClass(G).appendTo(k);
                n === h.currentSelectorType && s.addClass(e(n + "Dark"));
                d("<h4/>").addClass(a("selectorHeader")).mouseover(function () {
                    n !== h.currentSelectorType && s.addClass(e(n + "Dark"))
                }).mouseout(function () {
                    n !== h.currentSelectorType && s.removeClass(b)
                }).mousedown(function (a) {
                    a.stopPropagation();
                    q.call(h, n);
                    var e = d(this).find("." + G)[0];
                    d("#" + F.flyout).find("." + G).filter(function () {
                        return this !== e
                    }).removeClass(b)
                }).append(s).append(d("<span/>").applyInlineStyles().text(i)).appendTo(k);
                d("<div/>").html(j).applyBlockStyles().appendTo(k);
                m.push(k[0])
            });
            J.call(this, d(m));
            E.call(this)
        }
    }
    function Q() {
        var b = this.$,
            d = b("#" + F.help);
        if (this.activeTab === ba.help) w.call(this, function () {
            R(d, !1);
            P(d, !1)
        });
        else {
            R(d, !0);
            P(d, !0);
            var i = [];
            j.util.forEach(Ea, function (d, j) {
                var h = a(j),
                    n = b("<div/>").addClass(wa).applyBlockStyles();
                b("<div/>").applyBlockStyles().addClass(h + " " + G).addClass(e(j)).appendTo(n);
                b("<div/>").applyBlockStyles().addClass(Z).html(d).find("p").applyBlockStyles().end().appendTo(n);
                i.push(n[0])
            });
            for (var h = 0; h < i.length - 1; h++) b("<div/>").applyBlockStyles().addClass(a("divider")).appendTo(i[h]);
            J.call(this, b(i));
            E.call(this)
        }
    }
    function J(a) {
        function b() {
            function i() {
                if ("auto" !== j) {
                    e.height("auto");
                    var a = e.height();
                    e.height(j);
                    e.animate({
                        height: a
                    }, 200, "linear", function () {
                        e.height("auto");
                        e.cssImportant("overflow", "auto")
                    })
                }
            }
            e.empty().append(a.hide());
            d.support.opacity ? a.fadeIn(250).promise().done(i) : (a.show(), i())
        }
        var d = this.$,
            e = this.$("#" + F.flyout),
            j = e.height(),
            j = j || "auto",
            i = e.height(j).cssImportant("overflow", "hidden").contents();
        d.support.opacity ? i.fadeOut(250).promise().done(b) : (i.remove(), b())
    }
    function x() {
        var b = this.$,
            d = this,
            e = b("#" + F.preferences);
        if (this.activeTab === ba.preferences) w.call(this, function () {
            R(e, !1);
            P(e, !1)
        });
        else {
            R(e, !0);
            P(e, !0);
            var i = b("<div/>").applyBlockStyles().addClass(T);
            b("<h4/>").applyBlockStyles().text("Clip settings").appendTo(i);
            var h = b("<table/>").applyTableStyles(),
                n = [];
            b("<tr/>").applyTableRowStyles().append(b("<td/>").applyTableCellStyles().append(b("<input/>").applyInlineStyles().attr({
                type: "checkbox",
                id: a("preferencesReview"),
                checked: this.preferences.reviewClip
            }).change(I(this, "reviewClip"))), b("<td/>").applyTableCellStyles().append(b("<label/>").applyInlineStyles().attr({
                "for": a("preferencesReview")
            }).text("Review clip before saving"))).appendTo(h);
            b("<tr/>").applyTableRowStyles().append(b("<td/>").applyTableCellStyles().append(b("<input/>").applyInlineStyles().attr({
                type: "checkbox",
                id: a("preferencesPublish"),
                checked: this.preferences.publishByDefault
            }).change(I(this, "publishByDefault"))), b("<td/>").applyTableCellStyles().append(b("<label/>").applyInlineStyles().attr({
                "for": a("preferencesPublish")
            }).text("Publish clips by default"))).appendTo(h);
            h.appendTo(i);
            n.push(i[0]);
            var i = b("<div/>").applyBlockStyles().addClass(T),
                m = b("<ul/>").applyListStyles().attr("id", F.colorRadioList);
            b("<h4/>").applyBlockStyles().text("Rectangle color").appendTo(i);
            j.util.forEach(j.util.rectColors, function (a, e) {
                var j = d.rgbaSupport ? "rgba(" + a.startColor.join(",") + ", 0.25)" : "rgb(" + a.startColor.join(",") + ")";
                b("<li/>").applyListItemStyles().cssImportant("background-color", j).click(function (a) {
                    return function () {
                        D.call(d, {
                            rectangleColor: a
                        })
                    }
                }(e)).appendTo(m)
            });
            i.append(m);
            i.append(b("<div/>").cssImportant("clear", "left"));
            n.push(i[0]);
            n.push(b("<div/>").cssImportant("clear", "left")[0]);
            J.call(this, b(n));
            E.call(this)
        }
    }
    function N(a) {
        var d = a.$;
        return function () {
            var e = d(this),
                j = a.$container.find("." + s),
                h = d("#" + F.menu),
                n = (j.length - 1) * r + r / 3;
            a.$container.data("expanded") ? w.call(a, function () {
                h.find("." + i + ", " + A).filter(":not(#" + F.selectorType + ")").each(function () {
                    d(this).removeClass(b).removeClass(U).parent().removeClass(b).removeClass($)
                });
                var a = d(this);
                h.animate({
                    width: h.width() - n
                }, 250, "easeInCubic", function () {
                    a.empty();
                    j.hide();
                    e.toggleClass(O + " " + u)
                })
            }) : (h.width(h.width()), j.show(), h.animate({
                width: h.width() + n
            }, 250, "easeInCubic", function () {
                e.toggleClass(O + " " + u)
            }));
            a.$container.data("expanded", !a.$container.data("expanded"))
        }
    }
    function R(a, d) {
        var j = /^widget_(.+?)_clipboard_314159265$/.exec(a.attr("id"))[1];
        d ? a.addClass(e(j)) : a.removeClass(b)
    }
    function P(a, b) {
        a.toggleClass(U, b).closest("." + A).toggleClass($, b)
    }
    function v(a) {
        this.$container.find("." + i + ", " + A).filter(":not(#" + F.selectorType + ")").removeClass(b);
        P(this.$container.find("." + U), !1);
        this.trigger("navigated", {
            source: a
        });
        switch (a) {
        case ba.help:
            Q.call(this);
            break;
        case ba.preferences:
            x.call(this);
            break;
        case ba.selectors:
            C.call(this)
        }
        this.activeTab = ba[a]
    }
    function B(a) {
        function b(a, d, e) {
            a = q("<div/>").applyBlockStyles().attr("id", a + "_container").addClass(A + " " + m).append("<div/>").find("div").applyBlockStyles().attr("id", a).addClass(i).end();
            e !== h && a.cssImportant("left", e);
            d && a.addClass(s);
            return a
        }
        var e = this,
            q = e.$,
            B = q("<div/>").applyBlockStyles().attr("id", F.clipContainer).addClass(m).append(b(F.selectorType, !1).toggleClass(m + " " + F.rectangle)).append(b(F.selectorDropDown, !0).removeClass(m)),
            u = r + r / 3;
        this.$container = q("<div/>").applyBlockStyles().attr("id", F.widget).append("<div/>").find("div:first").applyBlockStyles().attr("id", F.menuContainer).append("<div/>").find("div:first").applyBlockStyles().attr("id", F.menuBackground).append(q("<div/>").applyBlockStyles().attr("id", F.message)).append("<div/>").find("div:eq(1)").width(r + r / 2).applyBlockStyles().attr("id", F.menu).append(B).append(b(F.preferences, !0, u + 0 * r)).append(b(F.help, !0, u + 1 * r)).append(b(F.home, !0, u + 2 * r)).append(b(F.close, !0, u + 3 * r)).append(b(F.expand).find("div").addClass(O).end()).end().end().end().append(q("<div/>").applyBlockStyles().attr("id", F.flyout).hide());
        q("body").append(this.$container);
        q.support.boxModel ? q("#" + F.menuBackground).cssImportant("background-image", 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAsCAYAAACkJ9JhAAAAt0lEQVQImQXBDS8CAQCA4ffnYQwRSQ2lUpfcLleSSulDXcvHGIb5qa/n4e85kd/VXH6WM/lOpvK1GMvn44N8zEbyPrmXt3FfXkc9eRl25WnQkVWvLctuLMnttSw6TZnfRDJrhTKNGzJpXso4CmQU1mQYVmXQKEu/XpJeUJS7WkG61TPpVE6lXcpL6zwncfFY4kJWopNDCfNpucrtSyObkvrRjgSZbakebMlFelMqextSTq1LaXfNf6t8Z14HSskhAAAAAElFTkSuQmCC")') : (q("#" + F.menuBackground).cssImportant({
            "padding-bottom": 0
        }), q("#" + F.flyout).cssImportant({
            position: "relative",
            top: -2,
            left: -1
        }));
        j.util.flagAsUnclippable(this.$container);
        this.$container.data("isLoggedInControl", !0).data("verifiedLogin", a).data("expanded", !1);
        this.$container.cssImportant({
            top: 0,
            right: 20,
            position: "fixed"
        });
        q.support.opacity && this.$container.cssImportant("opacity", 0);
        q("#" + F.selectorType).mousedown(k(e));
        q("#" + F.selectorDropDown).click(function () {
            v.call(e, ba.selectors)
        });
        q("#" + F.home).click(function () {
            e.trigger("navigated", {
                source: "home"
            });
            d.open(e.baseUri, "clipboard_blank")
        });
        q("#" + F.close).click(function () {
            e.trigger("navigated", {
                source: "close"
            })
        });
        q("#" + F.expand).click(N(this));
        q("#" + F.help).click(function () {
            v.call(e, ba.help)
        });
        q("#" + F.preferences).click(function () {
            v.call(e, ba.preferences)
        });
        j.util.assureFixedPositioning(this.$container);
        B = {
            top: "+=" + n
        };
        if (q.support.opacity) B.opacity = aa;
        this.$container.animate(B, 200);
        this.trigger("displayed", {
            status: "loggedIn",
            verified: a
        })
    }
    function S() {
        var a = this.baseUri,
            b = this.$;
        this.$container = b("<div/>").applyBlockStyles().attr("id", F.logout).append(b("<p/>").applyBlockStyles().append("Please ").append(b("<a/>").applyLinkStyles().attr({
            href: a + "login",
            target: "_blank",
            id: F.loginLink
        }).text("login")).append(" to Clipboard to start clipping"));
        j.util.flagAsUnclippable(this.$container);
        this.$container.data("isLoggedOutControl", !0);
        b("body").append(this.$container);
        this.$container.cssImportant({
            top: 0,
            right: 20
        });
        b.support.opacity && this.$container.cssImportant("opacity", 0);
        a = {
            top: "+=" + n
        };
        if (b.support.opacity) a.opacity = aa;
        j.util.assureFixedPositioning(this.$container);
        this.$container.animate(a, 200);
        this.trigger("displayed", {
            status: "loggedOut"
        })
    }
    function K(a) {
        this.initialize();
        this.$container = null;
        this.baseUri = a.baseUri;
        this.$ = a.$;
        this.currentSelectorType = "rectangle";
        this.activeTab = null;
        this.rgbaSupport = a.support.rgba
    }
    var j = d.CLIPBOARD.client,
        n = 20,
        s = a("verboseItem"),
        O = a("expand"),
        u = a("collapse"),
        G = a("inlineIcon"),
        V = a("flyout"),
        T = a("preferencesBlock"),
        U = a("selectedTab"),
        $ = a("selectedTabContainer"),
        wa = a("helpBlock"),
        Z = a("helpText"),
        i = a("menuItemIcon"),
        A = a("menuItemContainer"),
        m = a("menuItemuberContainer"),
        r = 42,
        aa = 0.99,
        ba = {
            help: "help",
            preferences: "preferences",
            selectors: "selectors"
        },
        F = {
            loginLink: a("loginLink"),
            clipContainer: a("clipContainer"),
            selectorType: a("selectorType"),
            rectangle: a("rectangle"),
            home: a("home"),
            close: a("close"),
            bookmark: a("bookmark"),
            text: a("text"),
            help: a("help"),
            preferences: a("preferences"),
            expand: a("expand"),
            message: a("message"),
            logout: a("logout"),
            widget: a("container"),
            selectorDropDown: a("selectorDropDown"),
            menu: a("menu"),
            menuContainer: a("menuContainer"),
            menuBackground: a("menuBackground"),
            flyout: a("flyout"),
            colorRadioList: a("colorRadioList")
        },
        Ea = {
            rectangle: '<p>Go to "clip mode." Just move your mouse around until you find something you like, and click.</p><p>You can also click and drag your mouse to get a better selection, or scroll the mousewheel to zoom in or out.</p><p>If you have text selected, this will automatically put you into "text mode" and extract the selected text.</p>',
            text: '<p>Switch to "text mode." Highlight some text, and it will format it in an easy-to-read fashion.</p>',
            preferences: "<p>Adjust your clipping preferences.</p>",
            home: "<p>Open up your Clipboard home page in a new window.</p>",
            close: "<p>Hide the Clipper.</p>"
        },
        ia = {
            Rectangle: "<p>Select a rectangular region to clip. This is the default setting.</p>",
            Text: "<p>Select a region to clip by highlighting text.</p>"
        },
        Fa = function () {
            function b(a, k, o) {
                var s = this.$;
                s("#" + F.menu).find("." + m + ":first").cssImportant("border-top-left-radius", "0px").cssImportant("border-bottom-left-radius", "0px");
                a = s("#" + F.message).removeClass().addClass(o).html(a);
                o = a.show().width();
                s.support.boxModel ? a.cssImportant("width", 0).animate({
                    width: o
                }, n, "easeOutCubic", function () {
                    s(this).width("auto")
                }) : (a.cssImportant({
                    visibility: "hidden",
                    position: "absolute",
                    width: "auto"
                }).show(), o = a.parent().width() - a.next().width() - a.outerWidth(), a.cssImportant({
                    left: o,
                    visibility: "visible"
                }));
                var v = this,
                    a = k === h ? j : k;
                i = k === h || 0 <= k ? d.setTimeout(function () {
                    e.call(v)
                }, a) : 0
            }
            function e(a) {
                var b = this.$;
                i = d.clearTimeout(i);
                b.support.boxModel ? (b("#" + F.menu).find("." + m + ":first").cssImportant("border-top-left-radius", "4px").cssImportant("border-bottom-left-radius", "4px"), b("#" + F.message).animate({
                    width: 0
                }, n, "easeInCubic", function () {
                    b(this).hide().width("auto");
                    a && a()
                })) : (b("#" + F.message).hide(), a && a())
            }
            var j = 3E3,
                i, n = 200;
            return {
                showMessage: function (d, j) {
                    var i = this;
                    e.call(this, function () {
                        b.call(i, d, j, a("messageSuccess"))
                    })
                },
                hideMessage: e,
                showErrorMessage: function (d, j) {
                    var i = this;
                    e.call(this, function () {
                        b.call(i, d, j, a("messageError"))
                    })
                }
            }
        }();
    j.util.inherit(K, j.ActivatableControl, j.EventEmitter);
    K.prototype.constructor = K;
    K.prototype.enableClipping = function (a) {
        if (this.$container) {
            var b = F[this.currentSelectorType];
            this.$("#" + F.selectorType).removeClass(b).addClass(F[a]).addClass(e(a));
            this.currentSelectorType = a
        }
    };
    K.prototype.doActivate = function () {
        this.initLoggedIn()
    };
    K.prototype.doDeactivate = function () {
        if (this.$container) {
            var a = this,
                b = {
                    top: "-=" + (n + this.$container.height())
                };
            if (this.$.support.opacity) b.opacity = 0;
            this.$container.animate(b, function () {
                a.$container.remove();
                a.$container = null
            })
        }
        this.activeTab = null
    };
    K.prototype.hide = function (a) {
        this.$container && this.$container.fadeOut(300, a)
    };
    K.prototype.show = function () {
        this.$container && this.$container.fadeIn(300)
    };
    K.prototype.initLoggedIn = function (a) {
        a = !! a;
        if (this.$container) {
            if (!0 === this.$container.data("isLoggedInControl")) {
                a && this.$container.data("verifiedLogin", !0);
                return
            }
            this.$container.remove()
        }
        B.call(this, a)
    };
    K.prototype.initLoggedOut = function () {
        var a = this,
            b = this.$container;
        b ? !0 !== b.data("isLoggedOutControl") && b.fadeOut("fast", function () {
            b.remove();
            b = null;
            S.call(a)
        }) : S.call(this)
    };
    K.prototype.showMessage = Fa.showMessage;
    K.prototype.hideMessage = Fa.hideMessage;
    K.prototype.showErrorMessage = Fa.showErrorMessage;
    K.prototype.disableClipping = function () {
        this.hideMessage();
        this.$("#" + F.selectorType).removeClass(b)
    };
    K.prototype.setPreferences = function (b) {
        this.preferences = b;
        b = this.$("#" + a("preferencesReview"));
        b.length && b.prop("checked", this.preferences.reviewClip)
    };
    j.ui.Widget = K
})(window);
(function (d) {
    function h() {
        function a(e) {
            if (!e.hasClass(C.util.rewriteClass)) {
                var h = e[0].childNodes,
                    k, v, q, B;
                if (!(e[0].tagName.toLowerCase() in {
                    head: 1,
                    style: 1,
                    link: 1,
                    meta: 1,
                    title: 1,
                    base: 1,
                    basefont: 1,
                    isindex: 1,
                    textarea: 1,
                    button: 1
                }) && b(h).is(function () {
                    return 3 === this.nodeType
                })) for (k = 0; k < h.length; k++) if (B = h[k], 3 === B.nodeType && (v = B.nodeValue, !(3 >= v.replace(/\s*/, "").length))) {
                    var u = h[k + 1];
                    b(B).remove();
                    if (this.support.regexSplit) B = v.split(/([\r\n]{2,})/);
                    else for (B = []; v;) {
                        q = /^(.+?)([\r\n]{2,})/.exec(v);
                        if (!q) {
                            B.push(v);
                            break
                        }
                        B.push(q[1], q[2]);
                        v = v.substring(q[0].length)
                    }
                    for (v = 0; v < B.length; v++) q = b("<" + d + "/>").addClass(C.util.rewriteClass).text(B[v] + (B[++v] || "")), u ? q.insertBefore(u) : q.appendTo(e)
                }
                for (k = 0; k < h.length; k++) 1 === h[k].nodeType && a.call(this, b(h[k]))
            }
        }
        var b = this.$;
        if (!b.htmlRewritten) {
            var d = "node",
                e = this;
            if (b.browser.msie && (!b.support.boxModel || "8.0" === b.browser.version)) d = "span";
            var h = this.baseData.relativeDir;
            b("object").each(function () {
                var a, d, e;
                a = b(this);
                d = a.attr("classid");
                e = a.attr("type");
                "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" === d && (a.attr("type") || a.attr("type", "application/x-shockwave-flash"), d = b("param[name=movie]", a), d.length && (d = d.attr("value"), a.attr("data") || a.attr("data_clipboard3141592654", d)));
                if (("clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" === e || "application/x-shockwave-flash" === e) && b.support.htmlSerialize) e = b('param[name="wmode"][value="transparent"]', a), 0 === e.length && a.prepend('<param name="wmode" value="transparent">'), b('param[name="base"]', a).remove(), a.prepend('<param name="base" value="' + h + '">')
            });
            b("embed").each(function () {
                var a;
                b(this).attr("base", h);
                a = b(this).attr("wmode");
                if (!a || "transparent" !== a) b(this).attr("wmode", "transparent"), b(this).replaceWith(b(this).clone())
            });
            b("br").wrap("<" + d + ' class="' + C.util.rewriteClass + '">');
            a.call(this, b("body"));
            b("iframe").each(function () {
                try {
                    a.call(e, b(this).contents().find("body"))
                } catch (d) {}
            });
            b.htmlRewritten = !0
        }
    }
    function a(a) {
        return function () {
            if (!a.bookmark) a.dragging = !0
        }
    }
    function b(a) {
        return function (b) {
            if (3 !== b.which) {
                var d = "click";
                a.bookmark ? d = "bookmark" : a.selectionData.startElement !== a.selectionData.endElement ? d = "drag" : a.zoomContext.zooming && (d = "zoom");
                var e = a.bookmark ? "bookmark" : "";
                a.selecting = !1;
                a.dragging = !1;
                E.call(a);
                var h = a.getSelection(),
                    k = setInterval(function () {
                        if (!a.animationContext.animating) clearInterval(k), a.trigger("selectionEnded", {
                            selectionData: h,
                            selectionType: e,
                            extractionContext: {
                                rect: a.$zoomRect.data("dimensions"),
                                extractionType: d
                            }
                        }), a.selecting = !0
                    }, 50)
            }
        }
    }
    function e(a) {
        var b = !1,
            d = 1E3 / N;
        return function (e, h, k, v) {
            if (e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) {
                if (!a.zoomContext.sentMetaEventToTracker) a.trigger("scrolled", {
                    source: "mouseWheelWithMetaKey"
                }), a.zoomContext.sentMetaEventToTracker = !0;
                return !0
            }
            if (b || 0 === v || !a.selectionData.startElement) return !1;
            b = !0;
            if (!a.zoomContext.zooming) a.zoomContext.start.clientX = e.clientX, a.zoomContext.start.clientY = e.clientY;
            0 > v ? a.zoomIn() : a.zoomOut();
            setTimeout(function () {
                b = !1
            }, d);
            return !1
        }
    }
    function k(a) {
        return function (b) {
            b.preventDefault();
            if (a.selecting) {
                var d;
                if (!(d = !a.zoomContext.zooming)) {
                    var e = a.zoomContext;
                    d = e.start.clientX - b.clientX;
                    e = e.start.clientY - b.clientY;
                    d = Math.sqrt(d * d + e * e) >= R
                }
                d && (a.zoomContext.reset(), a.animateTo({
                    clientX: b.clientX,
                    clientY: b.clientY
                }))
            }
        }
    }
    function q() {
        if (!this.bookmark) this.trigger("bookmarkPage"), this.$zoomRect.cssImportant({
            "border-top-width": P,
            "border-bottom-width": P,
            "border-right-width": P,
            "border-left-width": P
        }, !0), w.call(this), this.$canvasOverlay.cssImportant("cursor", "pointer"), this.$bookmark.show().cssImportant({
            left: -80,
            opacity: 0
        }).delay(200).animate({
            left: 20,
            opacity: 1
        }, "fast", "linear"), this.selectionData.startElement = this.selectionData.startElement = null, this.bookmark = !0
    }
    function E(a) {
        var b = this.$;
        this.bookmark = !1;
        this.trigger("notBookmarkPage");
        this.$canvasOverlay.cssImportant("cursor", "default");
        this.$zoomRect.cssImportant({
            "border-top-width": Q,
            "border-bottom-width": Q,
            "border-right-width": Q,
            "border-left-width": Q
        }, !0);
        C.util.retireFixedPositioning(this.$zoomRect);
        this.$bookmark.animate({
            left: -80,
            opacity: 0
        }, "fast", "linear", function () {
            b(this).hide();
            a && a()
        })
    }
    function w() {
        var a = this,
            b = this.$,
            e = b.support.boxModel ? 2 * (P + J) : 0;
        C.util.assureFixedPositioning(this.$zoomRect);
        this.$zoomRect.stop(!0, !1).animate({
            left: 0,
            top: 0,
            width: b(d).width() - e,
            height: b(d).height() - e
        }, 150, "easeOutQuad", function () {
            a.animationContext.animating = !1;
            b(this).cssImportant({
                width: b(d).width() - e,
                height: b(d).height() - e
            })
        })
    }
    function I(a) {
        this.bookmark && E.call(this);
        var b = this.selectionData.endElement;
        if (!(this.selectionData.startElement === a && this.selectionData.endElement === a)) {
            if (this.dragging) {
                if (!this.selectionData.startElement) this.selectionData.startElement = a
            } else this.selectionData.startElement = a;
            this.selectionData.endElement = a;
            this.animationContext.animating = !0;
            this.trigger("selecting");
            var d = this.$,
                a = d(this.selectionData.startElement),
                d = d(this.selectionData.endElement),
                a = C.util.getOuterDimensions(a),
                d = C.util.getOuterDimensions(d),
                a = {
                    top: Math.min(a.top, d.top),
                    left: Math.min(a.left, d.left),
                    bottom: Math.max(a.bottom, d.bottom),
                    right: Math.max(a.right, d.right)
                };
            a.width = a.right - a.left;
            a.height = a.bottom - a.top;
            a.area = a.width * a.height;
            if (a.area > C.util.maxArea) this.selectionData.endElement = b, this.trigger("selectionFailed", {
                reason: C.Selector.failureStatus.maxSizeExceededViaDrag
            });
            else {
                this.$zoomRect.data("dimensions", a);
                var e = this;
                this.$zoomRect.stop(!0, !1).animate({
                    left: a.left - Q - J - this.bodyOffset.left,
                    top: a.top - Q - J - this.bodyOffset.top,
                    width: a.width,
                    height: a.height
                }, 250, "easeOutQuad", function () {
                    e.animationContext.animating = !1
                })
            }
        }
    }
    function D(a) {
        this.initialize();
        this.type = "rectangle";
        this.support = a.support;
        this.bodyOffset = a.bodyOffset;
        this.$ = a.$;
        this.baseUri = a.baseUri;
        this.selecting = !1;
        this.baseData = a.baseData;
        this.document = a.document;
        this.preferences = a.preferences;
        this.getExtractor = function () {
            return new C.extractors.HtmlExtractor(a)
        };
        this.$canvasOverlay = this.$zoomRect = null;
        this.dragging = !1;
        this.zoomContext = {
            zooming: !1,
            noZoomReason: "",
            lastZoom: 0,
            start: {
                clientX: 0,
                clientY: 0
            },
            path: null,
            current: -1,
            reset: function () {
                this.zooming = !1;
                this.lastZoom = 0;
                this.start.clientX = -1;
                this.start.clientY = -1;
                this.path = null;
                this.current = -1;
                this.noZoomReason = "";
                this.sentMetaEventToTracker = !1
            },
            sentMetaEventToTracker: !1
        };
        this.selectionData = {
            startElement: null,
            endElement: null
        };
        this.animationContext = {
            animating: !1,
            timeoutId: 0
        }
    }
    var C = d.CLIPBOARD.client,
        Q = 2,
        J = 2,
        x = "rectangleSelector_" + C.util.idSuffix,
        N = 5,
        R = 15,
        P = 10,
        v = "zoom" + C.util.idSuffix,
        B = "canvas" + C.util.idSuffix,
        S = "bookmarkImage" + C.util.idSuffix,
        K = function () {
            function a(d) {
                var e = this.$;
                if (null === this.zoomContext.path) {
                    var j = !0,
                        h = e(this.selectionData.startElement),
                        k = h;
                    this.zoomContext.path = h.allParents().filter(function () {
                        j = b(e(this), k);
                        !0 === j && (k = e(this));
                        return !0 === j
                    }).map(function () {
                        return e(this)
                    }).toArray();
                    if (!0 === j) j = C.Selector.failureStatus.nowhereToZoom;
                    this.zoomContext.path.unshift(h);
                    this.zoomContext.noZoomReason = j
                }
                if (d) {
                    d = this.zoomContext.path[this.zoomContext.current + 1];
                    if (!d) return this.zoomContext.lastZoom && (new Date).getTime() - this.zoomContext.lastZoom > 2 * (1E3 / N) && this.trigger("selectionFailed", {
                        reason: this.zoomContext.noZoomReason
                    }), this.zoomContext.lastZoom = (new Date).getTime(), [];
                    this.zoomContext.lastZoom = (new Date).getTime();
                    this.zoomContext.current++;
                    return d
                }
                this.zoomContext.current = Math.max(0, this.zoomContext.current - 1);
                return (d = this.zoomContext.path[this.zoomContext.current]) || []
            }
            var b = function () {
                    var a = {
                        head: 1,
                        meta: 1,
                        link: 1,
                        style: 1,
                        script: 1
                    };
                    return function (b, d) {
                        var e;
                        if (!(e = !b[0])) if (!(e = 1 !== b[0].nodeType)) if (!(e = b[0].nodeName.toLowerCase() in a)) {
                            e = C.util.getDimensions(b);
                            var j = C.util.getDimensions(d);
                            e = e.area < 0.95 * j.area ? !1 : C.util.computeOverlap(e, j).area >= 0.95 * j.area;
                            e = !e
                        }
                        return e ? C.Selector.failureStatus.nowhereToZoom : !C.util.shouldInclude(b, {}) ? C.Selector.failureStatus.maxSizeExceededViaZoom : !0
                    }
                }();
            return function (b) {
                var d = a.call(this, b);
                if (d.length) this.zoomContext.zooming = !0, this.trigger("zooming", {
                    direction: b ? "in" : "out"
                }), b = d.trueOffset(), C.util.adjustOffsetForMargins(d, b), d.trueCoordinates(b), this.animateTo(d[0])
            }
        }();
    C.util.inherit(D, C.Selector, C.ActivatableControl, C.EventEmitter);
    D.prototype.constructor = D;
    D.prototype.doActivate = function () {
        var d = this.$;
        if (!this.$zoomRect) h.call(this), this.$zoomRect = d("<div/>").applyBlockStyles().attr("id", v), this.support.rgba ? this.$zoomRect.cssImportant("opacity", 1) : this.$zoomRect.cssImportant("opacity", 0.25), C.util.applyGradient(this.$zoomRect, this.preferences.rectangleColor), this.$bookmark = d("<img/>").applyBlockStyles().attr("id", S).attr("src", this.baseUri + "images/bookmarkLarge.png").click(b(this)), C.util.flagAsUnclippable(this.$zoomRect), this.$canvasOverlay = d("<div/>").applyBlockStyles().attr("id", B).mousedown(a(this)).mousemove(k(this)).mouseup(b(this)).mousewheel(e(this)), C.util.flagAsUnclippable(this.$canvasOverlay), d("body").append(this.$canvasOverlay).append(this.$bookmark).append(this.$zoomRect), C.util.assureFixedPositioning(this.$canvasOverlay), C.util.assureFixedPositioning(this.$bookmark), this.enableGlobalEvents(), this.selecting = !0, this.dragging = !1, this.select()
    };
    D.prototype.doDeactivate = function () {
        this.selecting = !1;
        if (this.$zoomRect && this.$canvasOverlay) {
            if (this.animationContext.timeoutId) this.animationContext.timeoutId = d.clearTimeout(this.animationContext.timeoutId);
            var a = this,
                b = this.$(this.document);
            this.bookmark && E.call(this, function () {
                a.$bookmark.remove();
                a.$bookmark = null
            });
            this.$zoomRect.animate({
                width: 0,
                height: 0,
                left: this.$(d).width() + b.scrollLeft() - 130,
                top: b.scrollTop() + 40,
                opacity: 0
            }, {
                duration: 350,
                easing: "easeInOutQuad",
                complete: function () {
                    C.util.retireFixedPositioning(a.$zoomRect);
                    a.$zoomRect.remove();
                    a.$zoomRect = null
                }
            });
            C.util.retireFixedPositioning(this.$canvasOverlay);
            this.$canvasOverlay.remove();
            this.$canvasOverlay = null;
            this.disableGlobalEvents();
            this.animationContext.animating = !1;
            this.zoomContext.reset()
        }
    };
    D.prototype.disableGlobalEvents = function () {
        this.$(this.document).unbind("keydown." + x)
    };
    D.prototype.enableGlobalEvents = function () {
        var a = this;
        this.$(this.document).bind("keydown." + x, function (b) {
            27 === b.keyCode && (a.deactivate(), a.trigger("canceled", {
                source: "escapeKey"
            }))
        })
    };
    D.prototype.zoomIn = function () {
        K.call(this, !0)
    };
    D.prototype.zoomOut = function () {
        K.call(this, !1)
    };
    D.prototype.animateTo = function (a) {
        var b = this.$;
        if (0 <= this.animationContext.timeoutId) this.animationContext.timeoutId = clearTimeout(this.animationContext.timeoutId);
        var e = null,
            h = this;
        if ("undefined" === typeof a.nodeType) {
            if (!h.dragging) {
                var k = a.clientX,
                    v = a.clientY,
                    B = b(d).width(),
                    b = b(d).height();
                if (20 > k || k > B - 20 || 20 > v || v > b - 20) e = function () {
                    q.call(h)
                }
            }
            e || (e = function () {
                h.$canvasOverlay.hide();
                h.$zoomRect.hide();
                var b = C.util.getElementFromPoint(a.clientX, a.clientY, h.$, h.document);
                h.$canvasOverlay.show();
                h.$zoomRect.show();
                b && I.call(h, b)
            })
        } else e = function () {
            a && I.call(h, a)
        };
        this.animationContext.timeoutId = setTimeout(e, 20)
    };
    D.prototype.getSelection = function () {
        return {
            startElement: this.selectionData.startElement,
            endElement: this.selectionData.endElement
        }
    };
    D.prototype.shouldUseAsDefault = function () {
        return !0
    };
    D.prototype.setPreferences = function (a) {
        this.preferences = a;
        this.$zoomRect && C.util.applyGradient(this.$zoomRect, this.preferences.rectangleColor)
    };
    C.selectors.RectangleSelector = D
})(window);
(function (d) {
    function h(a) {
        return function () {
            b.call(a)
        }
    }
    function a(a) {
        return function (b) {
            27 === b.keyCode && (a.deactivate(), a.trigger("canceled", {
                source: "escapeKey"
            }))
        }
    }
    function b() {
        var a = this.getSelection();
        a.text && this.trigger("selectionEnded", {
            selectionData: a,
            extractionContext: {
                top: a.top,
                left: a.left
            }
        })
    }
    function e(a) {
        this.initialize();
        this.type = "text";
        this.$ = a.$;
        this.document = a.document;
        this.startCoordinates = {
            x: null,
            y: null
        };
        this.activated = !1;
        this.getExtractor = function () {
            return new k.extractors.TextExtractor(a)
        }
    }
    var k = d.CLIPBOARD.client;
    k.util.inherit(e, k.Selector, k.ActivatableControl, k.EventEmitter);
    e.prototype.constructor = e;
    e.prototype.doActivate = function () {
        if (!this.activated) this.activated = !0, this.startCoordinates.x = null, this.startCoordinates.y = null, this.enableGlobalEvents(), this.select()
    };
    e.prototype.doDeactivate = function () {
        this.disableGlobalEvents();
        this.activated = !1
    };
    e.prototype.getSelection = function () {
        var a = k.util.getRangeData(this.document);
        return {
            fragment: a.fragment,
            text: k.util.trim(a.text),
            top: a.offset.top,
            left: a.offset.left
        }
    };
    e.prototype.select = b;
    e.prototype.enableGlobalEvents = function () {
        this.$(this.document).on("mouseup.clipboard_text_selector", h(this)).on("keydown.clipboard_text_selector", a(this))
    };
    e.prototype.disableGlobalEvents = function () {
        this.$(this.document).off(".clipboard_text_selector")
    };
    e.prototype.shouldUseAsDefault = function () {
        return !!k.util.trim(this.getSelection().text)
    };
    k.selectors.TextSelector = e
})(window);
(function (d) {
    function h() {
        var a = this.$,
            b, d = {
                display: "inline",
                left: "-10000px",
                top: "-10000px",
                visibility: "hidden",
                border: "none",
                position: "absolute",
                opacity: 0,
                overflow: "hidden",
                margin: 0,
                padding: 0
            },
            e = !1;
        try {
            b = a("<iframe/>").css(d).attr({
                scrolling: "no",
                frameborder: 0
            }).appendTo("body");
            var j = b.contents()[0];
            j.open();
            j.write("<!doctype html>");
            j.close();
            var h = a("<link/>").attr({
                type: "text/css",
                rel: "stylesheet",
                href: this.baseUri + "css/reset_0.9.97.css"
            });
            b.contents().find("head").append(h).end().find("body").css({
                margin: 0
            });
            e = !0
        } catch (k) {
            d.display = "block", b = a("<div/>").css(d).appendTo("body")
        }
        x.util.flagAsUnclippable(b);
        return {
            getDimensions: function () {
                var a = e ? b.contents().find("body") : b;
                return {
                    width: a.outerWidth(!0),
                    height: a.outerHeight(!0)
                }
            },
            append: function () {
                var a = e ? b.contents().find("body") : b;
                a.append.apply(a, arguments)
            },
            empty: function () {
                (e ? b.contents().find("body") : b).empty()
            },
            $element: b
        }
    }
    function a(a, b, d) {
        function e(a) {
            a.setAttribute(x.util.cullNodeAttributeFlag, !0);
            var b = q(a).allParents().each(function () {
                this.setAttribute(x.util.cullNodeAttributeFlag, !0)
            });
            J.push(a);
            Array.prototype.push.apply(J, b.toArray())
        }
        function j(b) {
            b = x.util.getOuterDimensions(b);
            return 0 < b.area && (b.left > a.right || b.right < a.left || b.top > a.bottom || b.bottom < a.top)
        }
        function h(a) {
            var b = q(a);
            if (!(!b.hasClass(x.util.rewriteClass) && !b.is(":visible") || j(b))) if (b.attr(x.util.cullNodeAttributeFlag, !0), J.push(a), b.children().each(function () {
                h(this)
            }), "iframe" === a.nodeName.toLowerCase()) try {
                h(b.contents()[0].documentElement)
            } catch (d) {}
        }
        function k(a, b) {
            for (var d = a, e = b; d.length && e.length;) {
                d = d.next();
                if (!d.length) {
                    d = b;
                    e = a;
                    break
                }
                if (d[0] === b[0]) {
                    d = a;
                    e = b;
                    break
                }
                e = e.next();
                if (e[0] === a[0]) {
                    d = b;
                    e = a;
                    break
                }
                if (!e.length) {
                    d = a;
                    e = b;
                    break
                }
            }
            do if (h(d[0]), d[0] === e[0]) break;
            while (d = d.next())
        }
        var q = this.$,
            u = this.document,
            w, C, D, E, I, J = [];
        if (b[0] === d[0]) return e(b[0]), J;
        if (b[0] === u.documentElement) w = b[0];
        else if (d[0] === u.documentElement) w = d[0];
        else {
            E = b.allParents().toArray();
            I = d.allParents().toArray();
            E.reverse();
            I.reverse();
            E.push(b[0]);
            I.push(d[0]);
            for (var P = Math.max(E.length, I.length), u = 0; u < P; u++) {
                var i = E[u],
                    A = I[u];
                if (i !== A) {
                    w = E[u - 1];
                    C = q(i);
                    D = q(A);
                    break
                }
            }
            if (!w) return []
        }
        e(w);
        w !== b[0] && w !== d[0] && k(C, D);
        return J
    }
    function b(a, b, d) {
        var e = a.constructor;
        if (a.hasClass(x.util.rewriteClass)) {
            for (var a = a.contents(), j = 0, h = 0; h < a.length; h++) d.firstIteration = !1, j = C.call(this, e(a[h]), b, d) || j;
            return j
        }
        return 0
    }
    function e(a, b) {
        for (var d in b) b.hasOwnProperty(d) && a.css(d) !== b[d] && a.css(d, b[d])
    }
    function k(a, b) {
        var d = {},
            e, j;
        for (e = 0; e < b.length; e++) {
            j = b[e];
            try {
                d[j] = a.css(j)
            } catch (h) {}
        }
        return d
    }
    function q(a, b) {
        function d(b) {
            void 0 === u[b] && (u[b] = a.css(b));
            u[b] && (q[b] = u[b])
        }
        function e(a, b) {
            "border" === a ? 0 !== u[a + b + "Width"] && j.each(["Style", "Width", "Color"], function (e, j) {
                d(a + b + j)
            }) : d(a + b)
        }
        var j = a.constructor,
            h = a.trueOffset(),
            k = {},
            q = {
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0
            },
            u = {
                paddingLeft: parseFloat(a.css("padding-left")),
                paddingRight: parseFloat(a.css("padding-right")),
                paddingTop: parseFloat(a.css("padding-top")),
                paddingBottom: parseFloat(a.css("padding-bottom")),
                marginLeft: parseFloat(a.css("margin-left")),
                marginTop: parseFloat(a.css("margin-top")),
                marginRight: parseFloat(a.css("margin-right")),
                marginBottom: parseFloat(a.css("margin-bottom")),
                borderRightWidth: parseFloat(a.css("border-right-width")),
                borderLeftWidth: parseFloat(a.css("border-left-width")),
                borderTopWidth: parseFloat(a.css("border-top-width")),
                borderBottomWidth: parseFloat(a.css("border-bottom-width"))
            };
        k.borderLeft = h.left;
        k.borderTop = h.top;
        k.paddingLeft = k.borderLeft + u.borderLeftWidth;
        k.paddingRight = k.paddingLeft + a.width() + u.paddingLeft + u.paddingRight;
        k.paddingTop = k.borderTop + u.borderTopWidth;
        k.paddingBottom = k.paddingTop + a.height() + u.paddingTop + u.paddingBottom;
        k.borderRight = k.paddingRight + u.borderRightWidth;
        k.borderBottom = k.paddingBottom + u.borderBottomWidth;
        k.marginLeft = k.borderLeft - u.marginLeft;
        k.marginTop = k.borderTop - u.marginTop;
        k.marginRight = k.borderRight + u.marginRight;
        k.marginBottom = k.borderBottom + u.marginBottom;
        j.each(["Left", "Right", "Top", "Bottom"], function (a, d) {
            var h = "Right" === d || "Bottom" === d;
            j.each(["margin", "border", "padding"], function (a, j) {
                var n = k[j + d];
                h ? n <= b[d.toLowerCase()] && !("margin" !== j ? 0 : 0 > u[j + d]) && e(j, d) : n >= b[d.toLowerCase()] && !("margin" !== j ? 0 : 0 > u[j + d]) && e(j, d)
            })
        });
        return q
    }
    function E(a, b, d) {
        function e(a, d, h) {
            var k = x.util.convertUnitsToPixels(a, parseFloat(b.css("font-size")));
            if (!1 !== k) return k;
            k = a;
            switch (a) {
            case "left":
            case "top":
                return 0;
            case "right":
            case "bottom":
                a = "100%";
                break;
            case "center":
                a = "50%"
            }
            if (!/^-?[\d\.]+%$/.test(a)) return 0;
            a = parseFloat(a);
            d = (d = /url\(['"]?(.+?)['"]?\)/i.exec(d)) && 1 < d.length ? d[1] : null;
            if (!d) return 0;
            var d = j("<img/>").attr("src", d).css({
                left: "-100000px",
                position: "absolute"
            }).appendTo("body"),
                n = d.width(),
                q = d.height();
            d.remove();
            d = "horizontal" === h || k in {
                left: 1,
                right: 1
            } ? n : q;
            h = "horizontal" === h || k in {
                left: 1,
                right: 1
            } ? b.width() : b.height();
            return a / 100 * h - d * (a / 100)
        }
        var j = b.constructor,
            h = b.css("background-image");
        if ("none" !== h) {
            var k = b.bgPosition().split(" ");
            "undefined" === typeof k[1] && (k[1] = "center");
            if (!(3 <= k.length)) {
                k[0] = e(k[0], h, "horizontal");
                k[1] = e(k[1], h, "vertical");
                var q = x.util.getDimensions(b);
                if (q.top < d.top || q.left < d.left) k[0] -= d.left - q.left, k[1] -= d.top - q.top;
                k[0] += "px";
                k[1] += "px";
                a["background-image"] = h;
                a["background-position"] = k.join(" ");
                a["background-attachment"] = "scroll"
            }
        }
    }
    function w(a, b, d) {
        function e(a, j, q) {
            k[a] < d[a] && u[a] < d[a] ? b.css(a, 0) : u[a] >= d[a] && u[a] + q <= d[j] ? b.css(a, h[a]) : b.css(a, h[a] - (d[a] - u[a]))
        }
        if (!a.is("param")) {
            var j = a.css("position");
            if (!("static" === j || "fixed" === j)) if (b.css("position", j), "relative" !== j) {
                var h = a.position();
                if (!("relative" === j && 0 === h.top && 0 === h.left)) {
                    var k = a.trueOffset(),
                        j = a.width() - Math.max(0, k.left + a.width() - d.right),
                        j = Math.min(d.width, j),
                        q = a.height() - Math.max(0, k.top + a.height() - d.bottom),
                        q = Math.min(d.height, q);
                    b.width(j);
                    b.height(q);
                    var u = a.offsetParent().offset();
                    e("left", "right", a.width());
                    e("top", "bottom", a.height())
                }
            }
        }
    }
    function I(b, d) {
        function e() {
            return "none" !== h(this).css("float")
        }
        var h = this.$,
            j = this.document,
            k = h(b.startElement),
            q = h(b.endElement),
            w = (new Date).getTime(),
            u = + !! h.browser.mozilla || + !! h.browser.msie,
            k = a.call(this, d, k, q);
        this.sandbox.$element.css({
            width: d.width + u,
            height: d.height
        });
        u = h("<div/>").addClass(N);
        this.sandbox.append(u);
        q = {
            rect: d,
            firstIteration: !0
        };
        D.call(this, h(this.document.documentElement), u, q, !0);
        u.find(":last-child").each(function () {
            var a = h(this),
                b = a.prev();
            b.length || (b = a);
            b.children().is(e) && a.append(h("<div/>").css("clear", "both"))
        });
        (j = this.domainHackers[j.domain]) && j.hack(u);
        for (j = 0; j < k.length; ++j) k[j].removeAttribute(x.util.cullNodeAttributeFlag);
        return {
            clip: u,
            elapsedTime: (new Date).getTime() - w
        }
    }
    function D(a, b, d) {
        if (!a.attr(x.util.cullNodeAttributeFlag)) return !1;
        var e = x.util.getOuterDimensions(a),
            h = x.util.computeOverlap(e, d.rect);
        return e.area && h.area >= 0.95 * e.area ? C.call(this, a, b, d) : Q.call(this, a, b, d)
    }
    function C(a, d, h) {
        var q = this.$;
        if (3 === a[0].nodeType) return d.append(this.document.createTextNode(a[0].nodeValue)), !0;
        if (b.call(this, a, d, h)) return !0;
        if (!x.util.shouldInclude(a, {
            reason: null
        })) return !1;
        var j = a[0].nodeName.toLowerCase(),
            j = j in x.util.semanticBlockTagNames || "body" === j || "html" === j ? "div" : j;
        if ("style" === j || "fixed" == a.css("position")) return !1;
        var n;
        if ("input" === j) {
            if ("hidden" === a.attr("type")) return !1;
            n = q("<" + j + ' type="' + a.attr("type") + '">')
        } else n = j in x.util.cloneableTags ? x.util.safeClone(a) : "canvas" === j ? q("<img/>").attr("src", a[0].toDataURL("image/png")).attr("alt", "image converted from <canvas>").attr("width", a.width()).attr("height", a.height()).css("display", "inline") : q("<" + j + ">");
        P(a, n);
        var s = R.call(this, a);
        if (d.hasClass(N)) s.position = "static";
        d.append(n);
        e(n, s);
        (d = this.tweakers[j]) && d.tweakFully(a, n);
        if ("iframe" !== j && (j = a.contents(), j.length)) {
            d = 0;
            for (s = j.length; d < s; d++) 3 === j[d].nodeType ? n.append(this.document.createTextNode(j[d].nodeValue)) : 1 === j[d].nodeType && C.call(this, q(j[d]), n, h)
        }
        s = k(a, ["width", "height"]);
        e(n, s);
        w(a, n, h.rect);
        h.firstIteration = !1;
        return !0
    }
    function Q(a, d, h) {
        var C = this.$;
        if (a.attr(x.util.doNotClipAllAttributeName)) return !1;
        if (3 === a[0].nodeType) return d.append(document.createTextNode(a[0].nodeValue)), !0;
        if (b.call(this, a, d, h)) return !0;
        var j = a[0].nodeName.toLowerCase(),
            j = j in x.util.semanticBlockTagNames ? "div" : j,
            n;
        j in x.util.cloneableTags ? (n = x.util.safeClone(a), n.text("")) : n = j in x.util.tagsToConvertToDiv ? C("<div/>") : C("<" + j + ">");
        d.append(n);
        d.hasClass(N) ? (n.width(h.rect.width).height(h.rect.height), n.wrap('<div style="position:relative;z-index:0;overflow:hidden;"><div style="position:relative;z-index:-9999;background-color:#FFF;">')) : "table" === j && n.attr({
            cellpadding: 0,
            cellspacing: 0,
            border: 0
        }).css("border-collapse", "collapse");
        (d = this.tweakers[j]) && d.tweakPartially(a, n);
        e(n, q(a, h.rect));
        var d = n,
            s = h.rect,
            I = k(a, ["background-clip", "background-color", "background-image", "background-origin", "background-repeat"]);
        E(I, a, s);
        e(d, I);
        "fixed" !== a.css("position") && w(a, n, h.rect);
        e(n, k(a, "display,float,clear,font-size,line-height,font-family,color,visibility,white-space".split(",")));
        d = n.is("br");
        if ("iframe" !== j) {
            if (a = a.contents(), a.length) for (var j = 0, u; j < a.length; j++) u = C(a[j]), 1 === u[0].nodeType ? (u.attr(x.util.cullNodeAttributeFlag) || u.is("br") || u.hasClass(x.util.rewriteClass) && u.find("br").length || 0 === x.util.getOuterDimensions(u).area) && D.call(this, u, n, h) && (d = !0) : 3 === u[0].nodeType && (d = Q.call(this, u, n, h) || d)
        } else try {
            u = C(a.contents()[0].documentElement), n.css("display", "inline-block"), d = D.call(this, u, n, h)
        } catch (G) {
            d = !1
        }
        d || n.remove();
        return d
    }
    function J(a) {
        this.initialize();
        this.$ = a.$;
        this.baseUri = a.baseUri;
        this.baseData = a.baseData;
        this.document = a.document;
        this.sandbox = null;
        this.tweakers = {
            a: new J.AnchorTweaker(this.baseData),
            button: new J.ButtonTweaker,
            embed: (new J.EmbedTweaker(this.baseData)).bubble("autoplayDisabled").to(this),
            iframe: (new J.IframeTweaker(this.baseData)).bubble("autoplayDisabled").to(this),
            img: new J.ImageTweaker(this.baseData),
            input: new J.InputTweaker(this.baseData),
            object: (new J.ObjectTweaker(this.baseData)).bubble("autoplayDisabled").to(this),
            param: (new J.ParamTweaker(this.baseData)).bubble("autoplayDisabled").to(this),
            source: new J.SourceTweaker(this.baseData),
            table: new J.TableTweaker(this.baseData),
            video: (new J.VideoTweaker(this.baseData)).bubble("autoplayDisabled").to(this)
        };
        this.domainHackers = {
            "tlc.discovery.com": new J.TlcDiscoveryHacker,
            "www.youtube.com": new J.YouTubeHacker
        }
    }
    var x = d.CLIPBOARD.client,
        N = "clipping_314159265",
        R = function () {
            var a = "-moz-border-bottom-left-radius,-moz-border-bottom-right-radius,-moz-border-top-left-radius,-moz-border-top-right-radius,-moz-box-shadow,-webkit-border-bottom-left-radius,-webkit-border-bottom-right-radius,-webkit-border-top-left-radius,-webkit-border-top-right-radius,-webkit-box-shadow,background-clip,background-color,background-image,background-origin,background-position,background-repeat,border-bottom-color,border-bottom-left-radius,border-bottom-right-radius,border-bottom-style,border-bottom-width,border-collapse,border-left-color,border-left-style,border-left-width,border-right-color,border-right-style,border-right-width,border-spacing,border-top-color,border-top-left-radius,border-top-right-radius,border-top-style,border-top-width,box-shadow,caption-side,clear,clip,color,content,counter-increment,counter-reset,cursor,direction,display,empty-cells,float,font-family,font-size,font-style,font-variant,font-weight,letter-spacing,line-height,list-style-image,list-style-position,list-style-type,margin-bottom,margin-left,margin-right,margin-top,marker-offset,max-height,max-width,min-height,min-width,opacity,outline-color,outline-style,outline-width,overflow-x,overflow-y,padding-bottom,padding-left,padding-right,padding-top,page-break-after,page-break-before,page-break-inside,quotes,table-layout,text-align,text-decoration,text-indent,text-transform,vertical-align,visibility,white-space,word-spacing,z-index".split(",");
            return function (b) {
                for (var d = {}, e, h = this.document, k = 0; k < a.length; k++) {
                    var q = a[k];
                    if ("line-height" === q && b[0].currentStyle) e = b[0].currentStyle.lineHeight;
                    else if ("margin-right" === q && h.defaultView && h.defaultView.getComputedStyle) e = h.defaultView.getComputedStyle(b[0], null).getPropertyValue("margin-right");
                    else if (0 === q.indexOf("background-position")) e = b.bgPosition();
                    else try {
                        e = b.css(q)
                    } catch (w) {
                        e = null
                    }
                    e && (d[q] = e)
                }
                "inline" === d.display && d.clip && delete d.clip;
                return d
            }
        }(),
        P = function () {
            function a(b, d, e) {
                (b = b.attr(e)) && d.attr(e, b)
            }
            return function (b, d) {
                a(b, d, "title");
                a(b, d, "alt");
                a(b, d, "rel")
            }
        }();
    x.util.inherit(J, x.Extractor, x.ActivatableControl, x.EventEmitter);
    x.util.merge(J.prototype, {
        constructor: J,
        tweakers: {},
        domainHackers: {},
        extract: function (a, b) {
            var d = I.call(this, a, b.rect);
            a.startElement = a.endElement = null;
            if (d) {
                var e = d.clip,
                    h = x.util.compactHtml(e.html()),
                    e = e.text().replace(/\s+/gm, " "),
                    k = this.sandbox.getDimensions();
                this.sandbox.empty(); - 1 !== h.indexOf("data_clipboard3141592654") && (h = h.replace("data_clipboard3141592654", "data"), h = h.replace(/classid=['"]?clsid:D27CDB6E-AE6D-11cf-96B8-444553540000['"]?/gi, ""));
                this.trigger("extracted", {
                    elapsedTime: d.elapsedTime,
                    html: h,
                    text: e,
                    dimensions: k,
                    top: b.rect.top,
                    left: b.rect.left,
                    extractionType: b.extractionType
                })
            }
        }
    });
    J.prototype.doActivate = function () {
        if (!this.sandbox) this.sandbox = h.call(this)
    };
    J.prototype.doDeactivate = function () {
        if (this.sandbox) this.sandbox.$element.remove(), this.sandbox = null
    };
    J.prototype.type = "clip";
    x.extractors.HtmlExtractor = J
})(window);
(function (d) {
    function h(a) {
        function d(a, x) {
            if (3 === a.nodeType) 0 < a.nodeValue.length && x.appendChild(a.cloneNode(!0));
            else if (1 === a.nodeType) {
                var v = a.nodeName.toLowerCase();
                if (!q[v]) {
                    e[v] ? (x.appendChild(b.util.safeClone(D(a))[0]), x = x.lastChild, v = x.getAttribute("href"), null !== v && x.setAttribute("href", b.util.normalizeUri(v, h))) : k[v] && x.firstChild && (x.appendChild(Q.createElement("br")), x.appendChild(Q.createElement("br")));
                    for (var v = 0, B = a.childNodes.length; v < B; v++) d(a.childNodes[v], x)
                }
            }
        }
        for (var h = this.baseData, D = this.$, C = this.document.createDocumentFragment(), Q = this.document, J = 0, x = a.childNodes.length, N; J < x; J++) N = a.childNodes[J], d(N, C);
        return C
    }
    function a(a) {
        this.initialize();
        this.$ = a.$;
        this.baseData = a.baseData;
        this.document = a.document
    }
    var b = d.CLIPBOARD.client,
        e = {
            b: 1,
            strong: 1,
            em: 1,
            i: 1,
            code: 1,
            samp: 1,
            kbd: 1,
            tt: 1,
            "var": 1,
            a: 1,
            s: 1,
            del: 1,
            sup: 1,
            sub: 1,
            ins: 1,
            u: 1,
            abbr: 1,
            acronym: 1,
            small: 1,
            big: 1,
            dfn: 1,
            br: 1,
            q: 1,
            cite: 1
        },
        k = {
            p: 1
        },
        q = {
            script: 1,
            noscript: 1,
            noembed: 1,
            embed: 1,
            object: 1,
            meta: 1,
            base: 1,
            head: 1,
            style: 1,
            noframes: 1
        };
    a.prototype.constructor = a;
    b.util.inherit(a, b.Extractor, b.ActivatableControl, b.EventEmitter);
    a.prototype.extract = function (a, b) {
        var d = (new Date).getTime(),
            e = a.text,
            k = h.call(this, a.fragment),
            q = k.ownerDocument.createElement("div");
        q.appendChild(k);
        k = '<blockquote class="clipboard_blockquote_314159265"><p class="clipboard_blockquote_text_314159265">' + q.innerHTML + "</p></blockquote>";
        q = this.$("<div/>").css({
            position: "absolute",
            left: -1E4,
            top: -1E4,
            display: "block",
            width: "auto",
            height: "auto"
        }).appendTo("body").html(k);
        !this.$.support.boxModel && 570 < q.width() && q.width(570);
        var J = {
            width: q.outerWidth(!0),
            height: q.outerHeight(!0)
        };
        q.remove();
        this.trigger("extracted", {
            elapsedTime: (new Date).getTime() - d,
            html: k,
            text: e,
            dimensions: J,
            extractionType: "text",
            left: b.left,
            top: b.top
        })
    };
    a.prototype.getResources = function () {
        return [{
            type: "css",
            url: this.baseUri + "/css/clipText_0.9.97.css"
        }]
    };
    a.prototype.type = "text";
    b.extractors.TextExtractor = a
})(window);
(function (d) {
    function h(a) {
        this.initialize();
        this.$ = a.$;
        this.baseUri = a.baseUri;
        this.baseData = a.baseData
    }
    d = d.CLIPBOARD.client;
    d.util.inherit(h, d.Extractor, d.ActivatableControl, d.EventEmitter);
    d.util.merge(h.prototype, {
        constructor: h,
        extract: function (a, b) {
            this.trigger("extracted", {
                elapsedTime: 0,
                html: "",
                text: "",
                compressedHtml: "",
                dimensions: {
                    width: 1280,
                    height: 1024
                },
                top: 0,
                left: 0,
                extractionType: b.extractionType
            })
        }
    });
    h.prototype.doActivate = function () {};
    h.prototype.doDeactivate = function () {};
    h.prototype.type = "bookmark";
    d.extractors.bookmarkExtractor = h
})(window);
(function (d) {
    function h(a) {
        this.domain = a
    }
    h.prototype = {
        domain: "",
        hack: function () {}
    };
    d.CLIPBOARD.client.extractors.HtmlExtractor.DomainHacker = h
})(window);
(function (d) {
    d.CLIPBOARD.client.extractors.HtmlExtractor.TagTweaker = {
        tweakPartially: function () {},
        tweakFully: function () {}
    }
})(window);
(function (d) {
    function h() {}
    d = d.CLIPBOARD.client.extractors.HtmlExtractor;
    h.prototype = new d.DomainHacker("tlc.discovery.com");
    h.prototype.hack = function (a) {
        a.find('object[name="video-per-page-player"]').each(function () {
            var b = a.constructor(this),
                d = b.find('param[name="flashvars"]').attr("value").match(/clipRefId%22%3A%22(\w+?)%22/);
            d && b.replaceWith('<iframe id="dit-video-embed" width="640" height="360" src="http://static.discoverymedia.com/videos/components/tlc/{refId}/snag-it-player.html?auto=no" frameborder="0" scrolling="no" allowtransparency="true"></iframe>'.replace("{refId}", d[1]))
        })
    };
    d.TlcDiscoveryHacker = h
})(window);
(function (d) {
    function h() {}
    d = d.CLIPBOARD.client.extractors.HtmlExtractor;
    h.prototype = new d.DomainHacker("www.youtube.com");
    h.prototype.hack = function (a) {
        var b = a.find("embed"),
            a = a.constructor;
        if (b.length) for (var d = 0; d < b.length; ++d) {
            var h = a("embed")[0];
            if ((h = (h.outerHTML || (new XMLSerializer).serializeToString(h)).match(/video_id=([^&"]+)/g)) && 1 <= h.length) if ((h = /video_id=([^&"]+)/.exec(h[h.length - 1])) && 2 <= h.length) {
                var q = a(b[d]).width(),
                    E = a(b[d]).height(),
                    h = '<iframe src="http://www.youtube.com/embed/{id}?wmode=transparent" width="{w}" height="{h}" frameborder="0" allowfullscreen></iframe>'.replace("{id}", h[1]).replace("{w}", q).replace("{h}", E);
                a(b[d]).replaceWith(h)
            }
        }
    };
    d.YouTubeHacker = h
})(window);
(function (d) {
    function h(a) {
        this.baseData = a
    }
    function a(a, d) {
        b.util.copyAttributeAndNormalize(a, d, "href", this.baseData)
    }
    var b = d.CLIPBOARD.client,
        d = b.extractors.HtmlExtractor;
    b.util.inherit(h, d.TagTweaker);
    h.prototype.tweakFully = a;
    h.prototype.tweakPartially = a;
    d.AnchorTweaker = h
})(window);
(function (d) {
    function h() {}
    var d = d.CLIPBOARD.client,
        a = d.extractors.HtmlExtractor;
    d.util.inherit(h, a.TagTweaker);
    h.prototype.tweakFully = function (a, d) {
        d.height(a.outerHeight()).width(a.outerWidth())
    };
    a.ButtonTweaker = h
})(window);
(function (d) {
    function h(a) {
        this.initialize();
        this.baseData = a
    }
    var a = d.CLIPBOARD.client,
        d = a.extractors.HtmlExtractor;
    a.util.inherit(h, d.TagTweaker, a.EventEmitter);
    h.prototype.tweakFully = function (b, d) {
        a.util.copyAttributeAndNormalize(b, d, "src", this.baseData) && a.util.disableAutoplayForUrl(d, "src") && this.trigger("autoplayDisabled", {
            source: "embed.src"
        });
        if (a.util.copyAttributeIfExists(b, d, "flashvars")) if (a.util.disableAutoplayForUrl(d, "flashvars")) this.trigger("autoplayDisabled", {
            source: "embed.flashvars"
        });
        else {
            var h = d.attr("flashvars");
            d.attr("flashvars", h + (h.length ? "&" : "") + "autoplay=false")
        }
    };
    d.EmbedTweaker = h
})(window);
(function (d) {
    function h(a) {
        this.initialize();
        this.baseData = a
    }
    var a = d.CLIPBOARD.client,
        d = a.extractors.HtmlExtractor;
    a.util.inherit(h, d.TagTweaker, a.EventEmitter);
    h.prototype.tweakFully = function (b, d) {
        a.util.copyAttributeAndNormalize(b, d, "src", this.baseData) && (a.util.disableAutoplayForUrl(d, "src") ? this.trigger("autoplayDisabled", {
            source: "iframe.src"
        }) : "#" === d.attr("src") && d.attr("src", "about:blank"));
        a.util.copyAttributeIfExists(b, d, "scrolling");
        a.util.copyAttributeIfExists(b, d, "frameborder");
        a.util.copyAttributeIfExists(b, d, "webkitAllowFullScreen");
        a.util.copyAttributeIfExists(b, d, "allowFullScreen");
        var h = d.attr("src");
        /^http:\/\/www\.youtube\.com\/embed\//.test(h) && (h = -1 !== h.indexOf("wmode=") ? h.replace(/\bwmode=.*?([&|$])/i, "wmode=transparent$1") : h + ((-1 === h.indexOf("?") ? "?" : "&") + "wmode=transparent"), d.attr("src", h))
    };
    d.IframeTweaker = h
})(window);
(function (d) {
    function h(a) {
        this.baseData = a
    }
    function a(a, d) {
        b.util.copyAttributeAndNormalize(a, d, "src", this.baseData)
    }
    var b = d.CLIPBOARD.client,
        d = b.extractors.HtmlExtractor;
    b.util.inherit(h, d.TagTweaker);
    h.prototype.tweakFully = function (d, h) {
        a.call(this, d, h);
        b.util.copyAttributeIfExists(d, h, "width");
        b.util.copyAttributeIfExists(d, h, "height")
    };
    h.prototype.tweakPartially = a;
    d.ImageTweaker = h
})(window);
(function (d) {
    function h(a, d) {
        b.util.copyAttributeIfExists(a, d, "value")
    }
    function a() {}
    var b = d.CLIPBOARD.client,
        d = b.extractors.HtmlExtractor;
    b.util.inherit(a, d.TagTweaker);
    a.prototype.tweakFully = h;
    a.prototype.tweakPartially = h;
    d.InputTweaker = a
})(window);
(function (d) {
    function h(a) {
        this.initialize();
        this.baseData = a
    }
    var a = d.CLIPBOARD.client,
        d = a.extractors.HtmlExtractor;
    a.util.inherit(h, d.TagTweaker, a.EventEmitter);
    h.prototype.tweakFully = function (b, d) {
        a.util.copyAttributeAndNormalize(b, d, "data", this.baseData) && a.util.disableAutoplayForUrl(d, "data") && this.trigger("autoplayDisabled", {
            source: "object.data"
        })
    };
    d.ObjectTweaker = h
})(window);
(function (d) {
    function h(a, d) {
        var h = a.attr("name");
        if (h) switch (d.attr("name", h), h = h.toLowerCase(), h) {
        case "flashvars":
            d.attr("value", a.attr("value"));
            b.util.disableAutoplayForUrl(d, "value") && this.trigger("autoplayDisabled", {
                source: "param.flashvars"
            });
            break;
        case "play":
        case "autostart":
            "false" !== d.attr("value") && (d.attr("value", "false"), this.trigger("autoplayDisabled", {
                source: "param." + h
            }));
            break;
        case "movie":
            b.util.copyAttributeAndNormalize(a, d, "value", this.baseData)
        }
    }
    function a(a) {
        this.initialize();
        this.baseData = a
    }
    var b = d.CLIPBOARD.client,
        d = b.extractors.HtmlExtractor;
    b.util.inherit(a, d.TagTweaker, b.EventEmitter);
    a.prototype.tweakFully = h;
    a.prototype.tweakPartially = h;
    d.ParamTweaker = a
})(window);
(function (d) {
    function h(a, d) {
        b.util.copyAttributeAndNormalize(a, d, "src", this.baseData);
        b.util.copyAttributeIfExists(a, d, "type")
    }
    function a(a) {
        this.baseData = a
    }
    var b = d.CLIPBOARD.client,
        d = b.extractors.HtmlExtractor;
    b.util.inherit(a, d.TagTweaker);
    a.prototype.tweakFully = h;
    a.prototype.tweakPartially = h;
    d.SourceTweaker = a
})(window);
(function (d) {
    function h(a) {
        this.baseData = a
    }
    function a(a, d) {
        d.attr("bgcolor") && (d.css("background-color", d.css("background-color")), d.removeAttr("bgcolor"));
        var h = d.attr("background");
        h && (d.removeAttr("background"), d.css("background-image", "url(" + b.util.normalizeUri(h, this.baseData) + ")"))
    }
    var b = d.CLIPBOARD.client,
        d = b.extractors.HtmlExtractor;
    b.util.inherit(h, d.TagTweaker);
    h.prototype.tweakFully = a;
    h.prototype.tweakPartially = a;
    d.TableTweaker = h
})(window);
(function (d, h) {
    function a(a) {
        this.initialize();
        this.baseData = a
    }
    var b = d.CLIPBOARD.client,
        e = b.extractors.HtmlExtractor;
    b.util.inherit(a, e.TagTweaker, b.EventEmitter);
    a.prototype.tweakFully = function (a, d) {
        d.attr("src") && d.attr("src", b.util.normalizeUri(d.attr("src"), this.baseData));
        d.attr("poster") && d.attr("poster", b.util.normalizeUri(d.attr("poster"), this.baseData));
        d.attr("autoplay") !== h && (d.removeAttr("autoplay"), this.trigger("autoplayDisabled", {
            source: "video.autoplay"
        }));
        d.attr("controls", "controls")
    };
    e.VideoTweaker = a
})(window);