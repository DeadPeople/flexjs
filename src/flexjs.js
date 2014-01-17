/***
	flexjs(srcTmpl).getInstance(arg)
	render svg component by template "srcTmpl" bind with data "object".
	arg:			null			bind no data.
					object			bind object to svg
					array			return list of binded objects

	instance.transform(arg)			get & set transform attr.
	arg:			object/string	transform content
***/

(function() {
	flexjs = function(element) {
		var _elment = element.cloneNode(true);
		_elment.removeAttribute("id");

		this.__element__ = _elment;

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

			// update data to svg
			_instance.update = function() {
				for(var _key in data) {
					var _val = data[_key];
					if(typeof _val != 'function') {
						var _eles = _instance.querySelectorAll("[data-bind-target='" + _key + "']");
						for(var i in _eles) {
							_eles[i].textContent = _val;
						}
					}
				}
			}

			// bind data of object
			_instance.update();

			// get & set binded object
			_instance.object = function(arg) {
				if(arg != null) {
					data = arg;
					_instance.update();
				}
				return data;
			}

			// get & set object attr
			_instance.objAttr = function(key, val) {
				if(val != null) {
					data[key] = val;
					_instance.update();
				}
				return data[key];
			}

			// ================================ SVG function ======================================
			// get & set svg attr
			_instance.attr = function(key, val) {
				if(val != null) {
					_instance.setAttribute(key, val);
				}
				return _instance.getAttribute(key);
			}

			// get & set svg transform
			_instance.trans = function(arg) {
				var _transform = "transform";
				if(typeof arg === "string") {
					_instance.attr(_transform, arg);
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
					_instance.attr(_transform, str);
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
			_instance.setTrans = function(key, val) {
				var _trans = _instance.trans();
				if(val != null) {
					_trans[key] = val;
				} else {
					delete _trans[key];
				}
				_instance.trans(_trans);
				return val;
			}

			// remove trans
			_instance.removeTrans = function(key) {
				return _instance.setTrans(key, null);
			}

			// transform: enhancement
			{
				_instance.move = function(tx, ty) {
					if(ty == null) ty = 0;
					_instance.setTrans("translate", [tx, ty]);
				}
				_instance.scale = function(sx, sy) {
					if(sy == null ) sy = sx;
					_instance.setTrans("scale", [sx, sy]);
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