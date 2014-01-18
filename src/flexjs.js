/***
	flexjs(srcTmpl).getInstance(arg)
	render svg component by template "srcTmpl" bind with data "object".
	arg:			null			bind no data.
					object			bind object to svg
					array			return list of binded objects

	instance.transform(arg)			get & set transform attr.
	arg:			object/string	transform content

	instance.update()				refresh svg
	instance.object(object)			get & set binded object
	instance.objAttr(key, val)		get & set object attribute
	instance.find(query)			find sub svg element of instance
	instance.addClass(cls)			add class
	instance.removeClass(cls)		remove class
	instance.attr(key, val)			get & set svg attribute
	instance.trans(arg)				get & set transform (get as object contains sperate transform)
	arg:			string/object
	instance.addTrans
***/

(function() {
	flexjs = function(element) {
		var _elment = element.cloneNode(true);
		_elment.removeAttribute("id");

		this.__element__ = _elment;

		function __each(ary, callback) {
			for(var i = 0; i < ary.length ; i+= 1) {
				if(callback(i, ary[i]) === false) break;
			}
		}

		function __val(data, key) {
			return val = key.match(/^\!/) == null ? data[key] : !data[key.substr(1)];
		}

		function __addStr(str, key) {
			var has = false;
			if(str == null) str = "";
			__each(str.trim().split(/\s+/), function(i, e) {
				if(e == key) {
					has = true;
					return false;
				}
			});
			if(!has) {
				str += " " + key;
			}
			return str;
		}

		function __removeStr(str, key) {
			if(str == null) str = "";
			return str.trim().split(/\s+/).filter(function(e) {
				return e != key;
			}).join(" ");
			return str;
		}

		this.getInstance = function(data) {
			// init para
			if(data == null) {
				data = {};
			} else if(Array.isArray(data)) {
				return data.map(function(e) {
					return this.getInstance(e);
				});
			}

			var _instance = _elment.cloneNode(true);

			// =============================== Object function ====================================
			// get & set binded object
			_instance.object = function(arg) {
				if(arg != null) {
					data = arg;
					_instance.update();
					return _instance;
				}
				return data;
			}

			// get & set object attr
			_instance.objAttr = function(key, val) {
				if(val != null) {
					data[key] = val;
					_instance.update();
					return _instance;
				}
				return data[key];
			}

			// ================================ SVG function ======================================
			// update svg
			_instance.update = function() {
				var _BIND_TARGET = "flexjs-bind-target";
				var _BIND_DISPLAY = "flexjs-bind-display";
				var _BIND_CLASS = "flexjs-bind-class";

				// update bind target content
				var bindTargets = _instance.querySelectorAll("[" + _BIND_TARGET + "]");
				__each(bindTargets, function(i, ele) {
					var key = ele.getAttribute(_BIND_TARGET);
					ele.textContent = data[key];
				});

				// update bind display content
				var bindDisplays = _instance.querySelectorAll("[" + _BIND_DISPLAY + "]");
				__each(bindDisplays, function(i, ele) {
					var key = ele.getAttribute(_BIND_DISPLAY);
					var val = __val(data, key);
					ele.style.display = val === false ? "none" : "block";
				});

				// update bind class content
				var bindClasses = _instance.querySelectorAll("[" + _BIND_CLASS + "]");
				__each(bindClasses, function(i, ele) {
					var str = ele.getAttribute(_BIND_CLASS);
					__each(str.split(/\s+/), function(j, str) {
						var lst = str.match(/[^\(\) ,]+/g);
						var flag = __val(data, lst[0]);
						var cls = lst[1];
						var attr = ele.getAttribute("class");
						if(flag)
							ele.setAttribute("class", __addStr(attr, cls));
						else
							ele.setAttribute("class", __removeStr(attr, cls));
					});
				});

				return _instance;
			}

			// bind data of object
			_instance.update();

			// find subelement
			_instance.find = function(str) {
				var ret = [];
				var lst = _instance.querySelectorAll(str);
				__each(lst, function(i, obj) {
					ret.push(obj);
				});
				return ret;
			}

			// add svg class
			_instance.addClass = function(cls) {
				return _instance.attr("class", __addStr(_instance.attr("class"), cls));
			}

			// remove svg class
			_instance.removeClass = function(cls) {
				return _instance.attr("class", __removeStr(_instance.attr("class"), cls));
			}

			// get & set svg attr
			_instance.attr = function(key, val) {
				if(val != null) {
					_instance.setAttribute(key, val);
					return _instance;
				}
				return _instance.getAttribute(key);
			}

			// get & set svg transform
			_instance.trans = function(arg) {
				var _transform = "transform";
				if(typeof arg === "string") {
					return _instance.attr(_transform, arg);
				} else if(typeof arg === "object") {
					var str = "";
					for(var _key in arg) {
						var _val = arg[_key];
						if(typeof(_val) != 'function') {
							if(typeof(_val) == 'string' || typeof(_val) == 'number') {
								str += _key + "(" + _val + ") ";
							} else if(Array.isArray(_val)) {
								str += _key + "(" + _val.join(",") + ") ";
							}
						}
					}
					return _instance.attr(_transform, str);
				}

				// parse transform as array
				var trans_lst = {};
				var content = _instance.attr(_transform);
				if(content != null) {
					var lst = content.match(/\w+\s*\([^\)]+\)/g);
					for(var i in lst) {
						var args = lst[i].match(/[^\(\) ,]+/g);
						trans_lst[args[0]] = args.slice(1);
					}
				}
				return trans_lst;
			}

			// add trans
			_instance.addTrans = function(key, val) {
				var _trans = _instance.trans();
				if(val != null) {
					_trans[key] = val;
				} else {
					delete _trans[key];
				}
				return _instance.trans(_trans);
			}

			// remove trans
			_instance.removeTrans = function(key) {
				return _instance.addTrans(key, null);
			}

			// transform: enhancement
			{
				_instance.move = function(tx, ty) {
					if(ty == null) ty = 0;
					return _instance.addTrans("translate", [tx, ty]);
				}
				_instance.scale = function(sx, sy) {
					if(sy == null) sy = sx;
					return _instance.addTrans("scale", [sx, sy]);
				}
				_instance.rotate = function(angle, cx, cy) {
					var lst = [angle];
					if(cx != null && cy != null) lst = lst.concat(cx, cy);
					return _instance.addTrans("rotate", lst);
				}
				_instance.skew = function(ax, ay) {
					_instance.addTrans("skewX", ax);
					if(ay != null) _instance.addTrans("skewY", ay);
					return  _instance;
				}
				_instance.matrix = function(a, b, c, d, e, f) {
					return _instance.addTrans("matrix", [a, b, c, d, e, f]);
				}
			}

			return _instance;
		}
		return this;
	}

	/*document.addEventListener("click",function(event) {
		var target = event.target;
		if(target.attributes["data-bind-editable"] != null) {
			console.log("editable!!!");
		}
	}, false);*/
})();