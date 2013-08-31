var root;

$(document).ready(function(){
	var m = [20, 120, 20, 0],
		w = 1280 - m[1] - m[3],
		h = 650 - m[0] - m[2],
		i = 0;

	var tree = d3.layout.tree()
		.size([h, w]);

	//var 
	diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var vis = d3.select("#body").append("svg:svg")
		.append("svg:g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	function update(source) {
		var duration = d3.event && d3.event.altKey ? 5000 : 500;

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse();

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 300; });

		// Update the nodes…
		var node = vis.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("svg:g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + source.y0 + "," + source.x0 + ")"; 
			});

		tmpl_unit = $("#tmpl_svg [data-tmpl='demo']").flexsvg();

		var nodeEnter = nodeEnter.append(function(p){
			var element = tmpl_unit.getInstance();
			element.object(p);
			return element[0];
		})
		.attr("opacity", 0);

		nodeEnter.select("circle")
		.on("click", function(d) { toggle(d); update(d); });

		nodeEnter.select("text.add")
		.on("click", function(d) {
			var _node = new Object();
			_node.name = "new node";
			_node.children = [];
			_node.parent = d;
			_node.x = d.x;
			_node.y = d.y;
			_node.x0 = d.x;
			_node.y0 = d.y;

			d.children.push(_node);

			update(d);
		});



		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		nodeUpdate.select("g")
			.attr("opacity", 1)
			.select("circle")
			.style("fill", function(d) { return d._children ? "#999" : "#fff"; });


		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			.remove();

		nodeExit.select("g")
			.attr("opacity", 0);


		// Update the links…
		var link = vis.selectAll("path.link")
			.data(tree.links(nodes), function(d) { return d.target.id; });

		// Enter any new links at the parent's previous position.
		link.enter().insert("svg:path", "g")
			.attr("class", "link")
			.attr("d", function(d) { return diagonal({source: d.source, target: d.source}); })
			.transition()
			.duration(duration)
			.attr("d", diagonal);

		// Transition links to their new position.
		link.transition()
			.duration(duration)
			.attr("d", function(d) {
				//diagonal
				var _source = new Object();
				_source.x = d.source.x;
				_source.y = d.source.y + 250;
				return diagonal({source: _source, target: d.target});
			});

		// Transition exiting nodes to the parent's new position.
		link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
			})
			.remove();

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
		});
	}

	// Toggle children.
	function toggle(d) {
		if (d.children) {
		d._children = d.children;
		d.children = null;
		} else {
		d.children = d._children;
		d._children = null;
		}
	}


	root = {
		"name": "Your Mind Here",
		"children": []
	};
		root.x0 = h / 2;
		root.y0 = 0;

	function toggleAll(d) {
		if (d.children) {
			d.children.forEach(toggleAll);
			toggle(d);
		}
	}
	update(root);


});