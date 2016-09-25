;(function(global, $) {

  // 'new' an object
  var Charts = function() {
    return new Charts.init();
  };

  Charts.prototype = {

    csvToJSON: function(csv, valuePosition) {
      var lines=csv.split("\n");
      lines.pop();

      var result = [];
      var headers=lines[0].split(",");

      for(var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentLine = lines[i].split(",");

        for(var j = 0; j < headers.length; j++) {
          if (j === valuePosition) {
            obj[headers[j]] = parseFloat(currentLine[j]);
          } else {
            obj[headers[j]] = currentLine[j];
          }
        }
        result.push(obj);
      }
      return result; //JavaScript object
      //return JSON.stringify(result); //JSON
    },

    // Bar Chart
    bar: function(data, options) {
      var w = 800;
      var h = 400;

      var longestKey = 0;
      data.forEach(function(item) {
        if (item[options.key].length > longestKey) {
          longestKey = item[options.key].length;
        }
      });

      var margin = {
        top: 58,
        right: 40,
        bottom: 5 * longestKey + 55, // 1-60, 9-100, 27-170
        left: 80
      };

      if (options.dimensions) {
        if (options.dimensions.width) {w = options.dimensions.width;}
        if (options.dimensions.height) {h = options.dimensions.height;}
      }

      var width = w - margin.right - margin.left;
      var height = h - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .domain(data.map(function(entry) {
          return entry[options.key];
        }))
        .rangeBands([0, width]);

      var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d[options.value]
        })])
        .range([height, 0]);

      var linearColorScale = d3.scale.linear()
        .domain([0, data.length])
        .range(["#572500", "#F68026"]);

      var ordinalColorScale = d3.scale.category20b();

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var yGridlines = d3.svg.axis()
        .scale(y)
        .tickSize(-width, 0, 0)
        .tickFormat("")
        .orient("left");

      var svg = d3.select("body").append("svg")
        .attr("id", "bar-chart")
        .attr("width", w)
        .attr("height", h);

      var barChart = svg.append("g")
        .classed("display", true)
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      barChart.append("text")
        .attr("id", "chart-title")
        .attr("x", (width / 8))
        .attr("y", 0 - (margin.top / 2))
        .text(options.title);

      var controls = d3.select('body')
        .append("div")
        .attr("id", "controls");

      var sort_btn = controls.append("button")
        .classed("sort-button", true)
        .html("Sort data: ascending")
        .attr("state", 0);

      function drawAxis(params) {
        if (params.initialize) {
          // Draw the gridlines and axes
          this.append("g")
            .call(params.gridlines)
            .classed("gridline", true)
            .attr("transform", "translate(0, 0)");

          // This is the x axis
          this.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(" + 0 +", " + height + ")")
            .call(params.axis.x)
              .selectAll("text")
                .classed("x-axis-label", true)
                .style("text-anchor", "end")
                .attr("dx", -8)
                .attr("dy", 8)
                .attr("transform", "translate(0,0) rotate(-45)");

          // This is the y axis
          this.append("g")
            .classed("y axis", true)
            .attr("transform", "translate(0, 0)")
            .call(params.axis.y);

          // This is the y label
          this.select(".y.axis")
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(-50, " + height / 2 +") rotate(-90)")
            .text(params.axisLabels.y);

          // This is the x label
          this.select(".x.axis")
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + (width / 2) + "," + (4 * longestKey + 45) + ")")
            .text(params.axisLabels.x);
        } else {
          // Update info
          this.selectAll("g.x.axis")
            .transition()
            .duration(500)
            .ease("bounce")
            .delay(500)
            .call(params.axis.x);

          this.selectAll(".x-axis-label")
            .style("text-anchor", "end")
            .attr("dx", -8)
            .attr("dy", 8)
            .attr("transform", "translate(0,0) rotate(-45)");

          this.selectAll("g.y.axis")
            .transition()
            .duration(500)
            .ease("bounce")
            .delay(500)
            .call(params.axis.y);
        }
      }

      function plot(params) {
        x.domain(data.map(function(entry) {
          return entry[options.key];
        }));

        y.domain([0, d3.max(data, function(d) {
          return d[options.value]
        })]);

        // Draw the axes and axes labels
        drawAxis.call(this, params);

        // enter()
        this.selectAll(".bar")
          .data(params.data)
          .enter()
            .append("rect")
            .classed("bar", true)
            .on("mouseover", function(d, i) {
              d3.select(this)
                .style("fill", "yellow");
            })
            .on("mousemove", function(d, i) {

            })
            .on("mouseout", function(d, i) {
              d3.select(this)
                .style("fill", ordinalColorScale(i));
            });

        this.selectAll(".bar-label")
          .data(params.data)
          .enter()
            .append("text")
            .classed("bar-label", true);

        // update
        this.selectAll(".bar")
          .transition()
          .duration(500)
          .ease("bounce")
          .delay(500)
          .attr("x", function(d, i) {
            return x(d[options.key]);
          })
          .attr("y", function(d, i) {
            return y(d[options.value]);
          })
          .attr("height", function(d, i) {
            return height - y(d[options.value]);
          })
          .attr("width", function(d, i) {
            return x.rangeBand();
          })
          .style("fill", function(d, i) {
            return ordinalColorScale(i);
            //return linearColorScale(i);
          });

        this.selectAll(".bar-label")
          .transition()
          .duration(500)
          .ease("bounce")
          .delay(500)
          .attr("x", function(d, i) {
            return x(d[options.key]) + (x.rangeBand() / 2);
          })
          .attr("dx", 0)
          .attr("y", function(d, i) {
            return y(d[options.value]);
          })
          .attr("dy", -6)
          .text(function(d, i) {
            if (options.showValues) {
              return d[options.value];
            } else {
              return "";
            }

          });

        // exit()
        this.selectAll(".bar")
          .data(params.data)
          .exit()
          .remove();

        this.selectAll(".bar-label")
          .data(params.data)
          .exit()
          .remove();
      }

      sort_btn.on("click", function() {
        var self = d3.select(this);
        var state = +self.attr("state");
        var txt = "Sort data: ";

        var ascending = function(a, b) {
          return a[options.value] - b[options.value];
        };
        var descending = function(a, b) {
          return b[options.value] - a[options.value];
        };

        if (state === 0) {
          data.sort(ascending);
          state = 1;
          txt += "descending"
        } else if (state === 1) {
          data.sort(descending);
          state = 0;
          txt += "ascending";
        }
        self.attr("state", state);
        self.html(txt);

        plot.call(barChart, {
          data: data,
          axis: {
            x: xAxis,
            y: yAxis
          },
          axisLabels: {
            x: options.xLabel,
            y: options.yLabel
          },
          gridlines: yGridlines,
          initialize: false
        });
      });

      plot.call(barChart, {
        data: data,
        axis: {
          x: xAxis,
          y: yAxis
        },
        axisLabels: {
          x: options.xLabel,
          y: options.yLabel
        },
        gridlines: yGridlines,
        initialize: true
      });
    },

    log: function(msg) {
      if (console) {
        console.log(msg);
      }

      // make chainable
      return this;
    }

  };

  // Constructor - the actual object is created here, allowing to 'new' an object without calling 'new'
  Charts.init = function() {
    var self = this;
  };

  // Don't have to use the 'new' keyword
  Charts.init.prototype = Charts.prototype;

  // attach Charts to the global object, and provide a shorthand 'C$'
  global.Charts = global.C$ = Charts;

}(window, jQuery));
