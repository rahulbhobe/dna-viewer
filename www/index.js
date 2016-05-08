

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
      .style("stroke-width", function(d) { return d.stroke ? 1 : 0; });

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
      stroke: true
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
        stroke: false
      });
    });

    // _(names).each(function (name, ii) {
    //   links.push({
    //     source: ii,
    //     target: (ii -1 + (names.length/2)) % names.length,
    //     value:  Math.cos((2.0*Math.PI)/names.length) / Math.sin(Math.PI/names.length),
    //     stroke: false
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
        stroke: false
      });
    });
  }

  generateChart({nodes: nodes, links: links}, 50);
};

doStuff(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

var getSubstructureName = function (level) {
  var name = 'root';
  for (var ii=0; ii<level.length-1; ii++) {
    name += '_' + level[ii];
  }
  return name;
}

var getSubStructuresFromSequence = function(seq, dbn) {
  assert(seq.length===dbn.length, "Sequence has invalid length");

  var trackNodesInSubStructure = {'root': []}; // Keeps track of which nodes can 'possibly' go to a structure.
  var curStructureLevel = [-1]; // Keeps track of nesting.
  for (var ii=0; ii<seq.length; ii++) {
    var dnaType = seq.charAt(ii);
    var dbnType = dbn.charAt(ii);

    assert(['A', 'C', 'G', 'T', 'N'].indexOf(dnaType.toUpperCase())!==-1);
    assert(['.', '(', ')'].indexOf(dbnType)!==-1);

    // Add one
    curStructureLevel[curStructureLevel.length-1]++;

    // Add current node to possibl
    trackNodesInSubStructure[getSubstructureName(curStructureLevel)].push(ii);
    if (dbnType === '(') {
      // Add another level.
      curStructureLevel.push(0);

      // Since it is connected to the next structure:
      trackNodesInSubStructure[getSubstructureName(curStructureLevel)] = []; // Created after creating new level.
      trackNodesInSubStructure[getSubstructureName(curStructureLevel)].push(ii); // Add current node
    } else if (dbnType === ')') {
      // Remove current level.
      curStructureLevel.pop();
      curStructureLevel[curStructureLevel.length-1]++;

      // Since it is connected to the next structure:
      trackNodesInSubStructure[getSubstructureName(curStructureLevel)].push(ii); // Add current node
    }
  }

  var validSubStructures = {};

  _(trackNodesInSubStructure).each(function (val, name) {
    var hasAtleast = 5;
    if (name === 'root') {
      hasAtleast = 3;
    }
    if (val.length >= hasAtleast){
      validSubStructures[name] = val;
    }
  });
  return validSubStructures;
};

console.log(getSubStructuresFromSequence('TTGGGCTTGGGGCTCCCAGAATTT', '.((((((...))((...)))))).'));
