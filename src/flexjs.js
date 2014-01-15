/***
	flexjs(srcTmpl).getInstance(object)
	render svg component by template "srcTmpl" bind with data "object".
	object:			null			bind no data.
					object			bind object to svg
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
			_instance.object = function(obj) {
				if(obj != null) {
					data = obj;
					_instance.update();
				}
				return data;
			}

			// get & set attr
			_instance.attr = function(key, val) {
				if(val != null) {
					data[key] = val;
					_instance.update();
				}
				return data[key];
			}

			return _instance;
		}
		return this;
	}

	document.addEventListener("click",function(event) {
		var target = event.target;
		if(target.attributes["data-bind-editable"] != null) {
			console.log("editable!!!");
		}
	}, false);
})();