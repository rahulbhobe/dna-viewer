

var doStuff = function(graph) {

  var width  = $(window).width() * 0.8,
      height = $(window).height() * 0.8;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(function(d) {
          if (d.value === 0) {
            return 200 * Math.sin(Math.PI / 10);
          }
          return 100 * d.value;
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

doStuff({
  "nodes":[
    {"name":"A","group":0},
    {"name":"B","group":1},
    {"name":"C","group":1},
    {"name":"D","group":1},
    {"name":"E","group":1},
    {"name":"F","group":1},
    {"name":"G","group":1},
    {"name":"H","group":1},
    {"name":"I","group":1},
    {"name":"J","group":1},

    {"name":"M","group":2},
  ],

  "links":[
    {"source":0,"target":1,"value":0},
    {"source":1,"target":2,"value":0},
    {"source":2,"target":3,"value":0},
    {"source":3,"target":4,"value":0},
    {"source":4,"target":5,"value":0},
    {"source":5,"target":6,"value":0},
    {"source":6,"target":7,"value":0},
    {"source":7,"target":8,"value":0},
    {"source":8,"target":9,"value":0},
    {"source":9,"target":0,"value":0},

/*

    {"source":0,"target":10,"value":1},
    {"source":1,"target":10,"value":1},
    {"source":2,"target":10,"value":1},
    {"source":3,"target":10,"value":1},
    {"source":4,"target":10,"value":1},
    {"source":5,"target":10,"value":1},
    {"source":6,"target":10,"value":1},
    {"source":7,"target":10,"value":1},
    {"source":8,"target":10,"value":1},
    {"source":9,"target":10,"value":1},
*/


    {"source":0,"target":5,"value":2},
    {"source":1,"target":6,"value":2},
    {"source":2,"target":7,"value":2},
    {"source":3,"target":8,"value":2},
    {"source":4,"target":9,"value":2},

  ]
});