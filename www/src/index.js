

var generateChart = function(graph, dist) {
  var width  = $(window).width() * 0.8,
      height = $(window).height() * 0.8;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(function(d) {
        return dist * d.value;
      })
      .linkStrength(function(d){
        return Math.sqrt(d.value);
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
      .style("stroke-width", function(d) { return d.stroke; });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

    node.append("circle")
      .attr("class", "node")
      .attr("r", 15)
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

var doStuff = function(names) {
  var nodes = _(names).map(function (name) {
    return {name: name, group: 0};
  });

  var links = [];
  _(names).each(function (name, ii) {
    links.push({
      source: ii,
      target: (ii+1)%names.length,
      value: 1,
      stroke: 1.0
    });
  });

  var theta = (2.0 * Math.PI) / names.length;
  if (names.length%2 === 0) {
    _(names).each(function (name, ii) {
      if (ii >= (names.length/2))
        return;

      // diameter = chord / sin(theta/2)
      links.push({
        source: ii,
        target: ii + (names.length/2),
        value:  1.0 / Math.sin(0.5*theta),
        stroke: 0.0
      });
    });

    // _(names).each(function (name, ii) {
    //   links.push({
    //     source: ii,
    //     target: (ii -1 + (names.length/2)) % names.length,
    //     value:  Math.cos((2.0*Math.PI)/names.length) / Math.sin(Math.PI/names.length),
    //     stroke: 0.0
    //   });
    // });
  } else {
    _(names).each(function (name, ii) {
      if (ii >= (names.length/2))
        return;

      // longchord = chord / 2 sin(theta/4)
      links.push({
        source: ii,
        target: (ii + (names.length-1)/2) % names.length,
        value:  0.5 / Math.sin(0.25*theta),
        stroke: 0.0
      });
    });
  }

  generateChart({nodes: nodes, links: links}, 50);
};

// doStuff(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);