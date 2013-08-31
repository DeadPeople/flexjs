/***
		args:
			init		boolean		default is true. It will auto init _data object when true;.
			object		object		default is null. Init component with given object.
			objects		array		default is null. It will return svg array which are inited if is not null.
			update		function	you can update your element if any changes happen. Use $(this) to call the element.
***/
$.fn.extend({
	flexsvg:function(options){
		var _INLINE_BIND_FORMAT = "data-bind-target";

		var _my = $(this);
		
		var _events = new Array();

		_my.on = function(event, target, func) {
			var _event = new Object();
			_event.event = event;
			if(typeof(target) == "string") {
				_event.target = target;
				_event.func = func;
			} else {
				_event.func = target;
			}
			_events.push(_event);
			return _my;
		}

		_my.getInstance = function(args) {
			var _com = _my.clone();
			var _data = new Object();

			// init data object 
			if(args == null) args = new Object();

			if(args.init == null) args.init = false;
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

			// create instance & init attr
			_com.data("flexjs", _com);
			_com.attr("data-flexjs-object", "");

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
							if(typeof(_value) == 'string' || typeof(_value) == 'number') {
								str += i + "(" + _value + ") ";
							} else if($.isArray(_value)) {
								str += i + "(" + _value.join(",") + ") ";
							}
						}
					}
					_com.attr("transform", str);
				} else if(typeof(para) == 'string') {
					_com.attr("transform", para);
				}
			};

			// add transform
			_com.addTransform = function(_key, _value) {
				var _para = _com.transform();
				_para[_key] = _value;
				_com.transform(_para);
			};

			// remove transform
			_com.removeTransform = function(_key) {
				var _para = _com.transform();
				_para[_key] = null;
				_com.transform(_para);
			}

			// add event listener
			for(var i in _events) {
				var _event = _events[i];
				if(_event.target == null) {
					_com.on(_event.event, function(event){
						_event.func.call($(this), event, _com);
					});
				} else {
					_com.on(_event.event, _event.target, function(event){
						_event.func.call($(this), event, _com);
					});
				}
			}

			return _com;
		}
		return _my;
	}
});

!function ($) {
	var $input = null;
	var $text = null;
	$(document).on("click.flexjs.svg.text.editable", "[data-flexjs-object] text[data-bind-editable]", function(event){
		var _my = $(this);
		$text = _my;
		$input = $("<input type='text' data-flexjs-input>");
		$("body").append($input);
		$input.css("position", "absolute");
		$input.offset(_my.offset());
		$input.css("font-size",_my.css("font-size"));
		$input.val(_my.text());
		$input.select();
		
		$input.keyup(function(event) {
			if(event.which == 13) {
				updateInput();
			}
		});
	});

	function updateInput() {
		if($input != null) {
			var $unit = $text.closest("[data-flexjs-object]");
			var unit = $unit.data("flexjs");
			var _value = $input.val();
			var _key = $text.attr("data-bind-target");
			unit.set(_key, _value);

			try {
				$input.remove();
			} catch(e) {}
			$input = null;
		}
	}
	$(document).on("blur.flexjs.svg.text.editable", "input[data-flexjs-input]", function(event){
		updateInput();
	});
}(window.jQuery);