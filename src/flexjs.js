/***
		args:
			init		boolean		default is true. It will auto init _data object when true;.
			object		object		default is null. Init component with given object.
			objects		array		default is null. It will return svg array which are inited if is not null.
***/
$.fn.extend({
	flexsvg:function(options){
		var _INLINE_BIND_FORMAT = "data-bind-target";

		var _my = $(this);
		_my.getInstance = function(args) {
			var _com = _my.clone();
			var _data = new Object();

			// init data object 
			if(args == null) args = new Object();

			if(args.init == null) args.init = true;
			if(args.init == true) {
				var _inline_bind = "[" + _INLINE_BIND_FORMAT + "]";
				_com.find(_inline_bind).each(function(){
					var _key = $(this).attr(_INLINE_BIND_FORMAT);
					var _value = $(this).text();
					_data[_key] = _value;
				});
			}

			if(args.object != null) _data = args.object;

			if(args.objects != null) {
				var _svg_lst = new Array();
				var _args = jQuery.extend({}, args);
				_args.objects = null;

				for(var i in args.objects) {
					var _object = args.objects[i];
					_args.object = _object;
					var _svg = _my.getInstance(_args);
					_svg_lst.push(_svg);
				}
				return _svg_lst;
			}

			// Update svg with given object
			_com.updateSVG = function() {
				// set data into target svg text field
				for(var i in _data) {
					if(typeof(options) != 'function') {
						var _key = i;
						var _value = _data[i];
						var _inline_bind = "[" + _INLINE_BIND_FORMAT + "='" + _key + "']";
						_com.find(_inline_bind).text(_value);
					}
				}
				// call the function if it has update function
				var _callback = args.update;
				if(_callback != null && typeof(_callback) == 'function') {
					_callback.call(_com, _data);
				}
				return _com;
			}
			_com.updateSVG();

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
				_com.updateSVG();
				return value;
			}
			// Get the attr of component
			_com.get = function(key, value) {
				return _data[key];
			}

			// svg prop
			_com.transform = function(para) {
				if(para == null) {
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
							var _values = _str.replace(new RegExp(".*\\((.*)\\)", "g"), "$1").split(",");
							var _value = new Array();
							for(var j in _values) {
								_value.push(parseInt(_values[j]));
							}
							trans_lst[_key] = _value;
						}
					}
					return trans_lst;
				} else if(typeof(para) == 'object') {
					var str = "";
					for(var i in para) {
						var _value = para[i];
						if(typeof(_value) != 'function') {
							if(typeof(_value) == 'string') {
								str += i + "(" + _value + ") ";
							} else if(typeof(_value) == 'array') {
								str += i + "(" + _value.join(",") + ") ";
							}
						}
					}
					_com.attr("transform", str);
				} else if(typeof(para) == 'string') {
					_com.attr("transform", para);
				}
			};

			_com.addTransform = function(_key, _value) {
				var _para = _com.transform();
				_para[_key] = _value;
				_com.transform(_para);
			};

			return _com;
		}
		return _my;
	}
});

/*!function ($) {
	$(document).on("mousedown.bootstrapcomponent.slider", "button[data-toggle='slider']", function(event){
	});
}(window.jQuery);*/