/***
		para:	 _init		Default: true. It will auto init _data object when true; 
***/
$.fn.extend({
	flexsvg:function(options){
		var _INLINE_BIND_FORMAT = "data-bind-target";

		var _my = $(this);
		_my.getInstance = function(_init) {
			var _com = _my.clone();
			var _data = new Object();

			// init data object 
			if(_init == null) _init = true;
			if(_init == true) {
				var _inline_bind = "[" + _INLINE_BIND_FORMAT + "]";
				_com.find(_inline_bind).each(function(){
					var _key = $(this).attr(_INLINE_BIND_FORMAT);
					var _value = $(this).text();
					_data[_key] = _value;
				});
			}

			// Update svg with given object
			_com.updateSVG = function() {
				for(var i in _data) {
					if(typeof(options) != 'function') {
						var _key = i;
						var _value = _data[i];
						var _inline_bind = "[" + _INLINE_BIND_FORMAT + "='" + _key + "']";
						_com.find(_inline_bind).text(_value);
					}
				}
				return _com;
			}

			// set bind object
			_com.object = function(obj) {
				if(obj != null) {
					_data = obj;
					_com.updateSVG();
				}
				return _data;
			}

			// Set the attr of component
			_com.set = function(key, value) {
				_data[key] = value;
				var _inline_bind = "[" + _INLINE_BIND_FORMAT + "='" + key + "']";
				_com.find(_inline_bind).text(value);
				return value;
			}
			// Get the attr of component
			_com.get = function(key, value) {
				return _data[key];
			}

			// svg prop
			function getTans() {
				var _SPLIT = "_FLEX_JS_SPLIT_";
				var trans_lst = new Object();
				var _trans = _com.attr("transform");
				if(_trans != null) {
					_trans = _trans.trim().replace(new RegExp("\\) +", "g"), ")" + _SPLIT);
					_trans = _trans.trim().replace(new RegExp(_SPLIT + "$", "g"), "");
					var _lst = _trans.split(_SPLIT);
					for(var i in _lst) {
						var _str = _lst[i];
						var _key = _str.replace(new RegExp("(.*)\\(.*\\)", "g"), "$1");
						var _value = _str.replace(new RegExp(".*\\((.*)\\)", "g"), "$1");
						trans_lst[_key] = _value;
					}
				}
				trans_lst.renderAttr = function() {
					var str = "";
					for(var i in trans_lst) {
						var _value = trans_lst[i];
						if(typeof(_value) != 'function') {
							str += i + "(" + _value + ") ";
						}
					}
					return str;
				}
				return trans_lst;
			}
			_com.transform = function(_key, _value) {
				var _trans = getTans();
				_trans[_key] = _value;
				_com.attr("transform", _trans.renderAttr());
			}

			return _com;
		}
		return _my;
	}
});

/*!function ($) {
	$(document).on("mousedown.bootstrapcomponent.slider", "button[data-toggle='slider']", function(event){
	});
}(window.jQuery);*/