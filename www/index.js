

var generateChart = function(graph, radius) {

  var width  = $(window).width() * 0.8,
      height = $(window).height() * 0.8;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(function(d) {
          if (d.value === 0) {
            return radius * Math.sin(Math.PI / 10);
          }
          return radius * d.value;
        })
      .size([width, height]);

 var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return d.value ? 0 : 1; });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

    node.append("circle")
      .attr("class", "node")
      .attr("r", 20)
      .style("fill", function(d) { return color(d.group); })

  node.append("title")
      .text(function(d) { return d.name; });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.name;
        });


  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
};

var doStuff = function() {

  var names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  var nodes = _(names).map(function (name) {
    return {name: name, group: 0};
  });

  var links = [];
  _(names).each(function (name, ii) {
    links.push({
      source: ii,
      target: (ii>=names.length-1 ? 0 : ii+1),
      value: 0
    });
  });

  nodes.push({name: 'M', group: 2});
  _(names).each(function (name, ii) {
    links.push({
      source: ii,
      target: 10,
      value: 1
    });
  });

  _(names).each(function (name, ii) {
    if (ii >= (names.length/2))
      return;

    links.push({
      source: ii,
      target: ii + (names.length/2) ,
      value: 2
    });
  });

  generateChart({nodes: nodes, links: links}, 100);
};

doStuff();