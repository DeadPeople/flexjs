/***
	flexjs(srcTmpl).getInstance(object)
	render svg component by template "srcTmpl" bind with data "object".
	object:			null		bind no data.
					
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

			// bind data of object
			for(var _key in data) {
				var _val = data[_key];
				if(typeof _val != 'function') {
					var _ele = _instance.querySelector("[data-bind-target='" + _key + "']");
					if(_ele != null) {
						_ele.textContent = _val;
					}
				}
			}

			return _instance;
		}
		return this;
	}
})();