;(function(global, $) {

  // 'new' an object
  var Charts = function() {
    return new Charts.init();
  };

  Charts.prototype = {

    plotChart: function(type, options) {
      var self = this;

      var format = options.data.substr(options.data.lastIndexOf('.') + 1);

      if (format === 'csv') {
        d3.csv(options.data, function(error, parsed_data) {
          self[type](parsed_data, options);
        })
      } else if (format === 'json') {
        d3.json(options.data, function(error, parsed_data) {
          self[type](parsed_data, options);
        })
      } else {
        self[type](options.data, options);
      }
    },

    // Bar Chart
    bar: function(data, options) {
      var w = C.w;
      var h = C.h;

      // Get the longest x value to calculate bottom margin
      var longestKey = 0;
      data.forEach(function(item) {
        if (item[options.key].length > longestKey) {
          longestKey = item[options.key].length;
        }
      });

      if (options.dimensions) {
        if (options.dimensions.width) {w = options.dimensions.width;}
        if (options.dimensions.height) {h = options.dimensions.height;}
      }

      var width = w - C.margin.right - C.margin.left;
      //var height = C.h - C.margin.top - C.margin.bottom;
      var height = h - C.margin.top - (5 * longestKey + 55);

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
        .attr("id", "chart")
        .attr("width", w)
        .attr("height", h);

      var barChart = svg.append("g")
        .classed("display", true)
        .attr("transform", "translate(" + C.margin.left + ", " + C.margin.top + ")");

      barChart.append("text")
        .attr("id", "chart-title")
        .attr("x", (width / 8))
        .attr("y", 0 - (C.margin.top / 2))
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

    // Grouped Bar
    grouped: function(data, options) {
      var width = C.w + 250 - C.margin.left - C.margin.right;
      var height = C.h + 100 - C.margin.top - C.margin.bottom;

      var data = [];

      var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
        .range([height, 0]);

      var color = d3.scale.category20();

      var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

      var yGridlines = d3.svg.axis()
        .scale(y)
        .tickSize(-width, 0, 0)
        .tickFormat("")
        .orient("left");

      // Define the div for the tooltip
      var div = d3.select("body").append("div")
        .classed("tooltip small", true)
        .style("opacity", 0);

      var controls = d3.select('body')
        .append("div")
        .attr("id", "controls");

      var sort_ascending_btn = controls.append("button")
        .classed("sort-button", true)
        .html("Ascending")
        .attr("state", 0);

      var sort_descending_btn = controls.append("button")
        .classed("sort-button", true)
        .html("Descending")
        .attr("state", 1);

      var sort_random_btn = controls.append("button")
        .classed("sort-button", true)
        .html("Random")
        .attr("state", 2);

      function plot(data) {
        d3.select('svg').remove();

        var svg = d3.select("body").append("svg")
          .attr("width", width + C.margin.left + C.margin.right)
          .attr("height", height + C.margin.top + C.margin.bottom)
          .append("g")
          .attr("transform", "translate(" + C.margin.left + "," + C.margin.top + ")");

        // Draw the grid lines
        svg.append("g")
          .call(yGridlines)
          .classed("gridline", true)
          .attr("transform", "translate(0, 0)");

        // Set the chart title
        svg.append("text")
          .attr("id", "chart-title")
          .attr("x", (width / 8))
          .attr("y", 0 - (C.margin.top / 2))
          .text(options.title);

        var monthNames = d3.keys(data[0]).filter(function(key) {
          return key !== "name" && key !== "total" && key !== "months";
        });

        data.forEach(function(d) {
          d.months = monthNames.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x0.domain(data.map(function(d) { return d.name; }));
        x1.domain(monthNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.months, function(d) { return d.value; }); })]);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("transform", "translate(" + (width / 2 + 20) + ", 45)")
          .style("text-anchor", "end")
          .text("Sales Person");

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "translate(" + -66 + ", " + (height / 2 - 40) + ") rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Sales($)");

        var salesName = svg.selectAll(".name")
          .data(data)
          .enter().append("g")
          .attr("class", "name")
          .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; });

        salesName.selectAll("rect")
          .data(function(d) { return d.months; })
          .enter().append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .style("fill", function(d) { return color(d.name); })
          .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html( "$"  + d.value)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
          });

        var legend = svg.selectAll(".legend")
          .data(monthNames.slice())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
          .attr("x", width - 15)
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", color);

        legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });
      }

      function getData() {
        // Reformat data into array of objects and add up sales
        var arr = [];
        for (var name in sales) {
          if (sales.hasOwnProperty(name)) {
            var obj = {name};
            var total = 0;
            for (var month in sales[name]) {
              if (sales[name].hasOwnProperty(month)) {
                obj[month] = sales[name][month];
                total += sales[name][month];
              }
            }
            obj.total = total;
            arr.push(obj);
          }
        }
        data = arr;
        return data;
      }

      // Sort actions
      sort_ascending_btn.on("click", function() {
        data.sort(function (a, b) {
          return a['total'] - b['total'];
        });
        plot(data);
      });

      sort_descending_btn.on("click", function() {
        data.sort(function (a, b) {
          return b['total'] - a['total'];
        });
        plot(data);
      });

      sort_random_btn.on("click", function() {
        data.sort(function(a, b) {
          var aRand = Math.random();
          var bRand = Math.random();
          return aRand - bRand;
        });
        plot(data);
      });

      plot(getData());
    },

    // Line Chart
    line: function(data, options) {
      var width = C.w - C.margin.left - C.margin.right;
      var height = C.h - C.margin.top - C.margin.bottom;

      var svg = d3.select("body").append("svg")
        .attr("id", "chart")
        .attr("width", C.w)
        .attr("height", C.h);

      var chart = svg.append("g")
        .classed("display", true)
        .attr("transform", "translate(" + C.margin.left + "," + C.margin.top + ")");

      chart.append("text")
        .attr("id", "chart-title")
        .attr("x", (width / 8))
        .attr("y", 0 - (C.margin.top / 2))
        .text(options.title);

      var dateParser = d3.time.format("%Y/%m/%d").parse;

      var x = d3.time.scale()
        .domain(d3.extent(data, function(d) {
          var date = dateParser(d.date);
          return date;
        }))
        .range([0, width]);

      var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d.value;
        })])
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.days, 7)
        .tickFormat(d3.time.format("%m/%d"));

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);

      var line = d3.svg.line()
        .x(function(d) {
          var date = dateParser(d.date);
          return x(date);
        })
        .y(function(d) {
          return y(d.value);
        })
        .interpolate("cardinal");

      var area = d3.svg.area()
        .x(function(d) {
          var date = dateParser(d.date);
          return x(date);
        })
        .y0(height)
        .y1(function(d) {
          return y(d.value);
        })
        .interpolate("cardinal");

      // Define the div for the tooltip
      var div = d3.select("body").append("div")
        .classed("tooltip large", true)
        .style("opacity", 0);

      function plot(params) {
        this.append("g")
          .classed("x axis", true)
          .attr("transform", "translate(0," + height + ")")
          .call(params.axis.x);
        this.append("g")
          .classed("y axis", true)
          .attr("transform", "translate(0,0)")
          .call(params.axis.y);

        // enter
        this.selectAll(".area")
          .data([params.data])
          .enter()
          .append("path")
          .classed("area", true);

        this.selectAll(".trendline")
          .data([params.data])
          .enter()
            .append("path")
            .classed("trendline", true);

        this.selectAll(".point")
          .data(params.data)
          .enter()
            .append("circle")
            .classed("point", true)
            .attr("r", 2)
            .on("mouseover", function(d) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(dateParser(d.date) + "<br/>"  + d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
            });

        // update
        this.selectAll(".area")
          .attr("d", function(d){
            return area(d);
          });

        this.selectAll(".trendline")
          .attr("d", function(d) {
            return line(d);
          });

        this.selectAll(".point")
          .attr("cx", function(d) {
            var date = dateParser(d.date);
            return x(date);
          })
          .attr("cy", function(d) {
            return y(d.value);
          });

        // exit
        this.selectAll(".area")
          .data([params.data])
          .exit()
            .remove();

        this.selectAll(".trendline")
          .data([params.data])
          .exit()
            .remove();

        this.selectAll(".point")
          .data(params.data)
          .exit()
            .remove();
      }

      plot.call(chart, {
        data: data,
        axis: {
          x: xAxis,
          y: yAxis
        }
      })
    },

    scatter: function(data, options) {
      C.margin.top += 25;
      C.margin.bottom -= 25;
      var width = C.w - C.margin.left - C.margin.right;
      var height = C.h - C.margin.top - C.margin.bottom;

      var svg = d3.select("body").append("svg")
        .attr("id", "chart")
        .attr("width", C.w)
        .attr("height", C.h);

      var chart = svg.append("g")
        .classed("display", true)
        .attr("transform", "translate(" + C.margin.left + "," + C.margin.top + ")");

      chart.append("text")
        .attr("id", "chart-title")
        .attr("x", (width / 8))
        .attr("y", 0 - (C.margin.top / 2))
        .text(options.title);

      var colorScale = d3.scale.category10();

      var x = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
          return d.age;
        }))
        .range([0, width]);

      // Get the highest y value to get y range
      var highestValue = 0;
      data.forEach(function(item) {
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            if (key in options.dataKeys) {
              if (options.dataKeys[key] === true && item[key] > highestValue) {
                highestValue = item[key];
              }
            }
          }
        }
      });
      highestValue = Math.ceil(highestValue);

      var y = d3.scale.linear()
        .domain([1, highestValue])
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues(options.tickValues)
        .orient("bottom");

      var xGridlines = d3.svg.axis()
        .scale(x)
        .tickValues(options.tickValues)
        .tickSize(-height, -height)
        .tickFormat("")
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .tickSize(20)
        .tickFormat(function(d) {
          return d.toFixed(1);
        })
        .orient("left");

      var yGridlines = d3.svg.axis()
        .scale(y)
        .tickSize(-width, 0, 0)
        .tickFormat("")
        .orient("left");

      var responseScale = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
          return d.responses;
        }))
        .range([2, 15]);

      function drawAxis(params) {
        if (params.initialize) {
          this.append("g")
            .classed("axis x", true)
            .attr("transform", "translate(0, " + height + ")")
            .call(params.axis.x);

          this.append("g")
            .classed("axis y", true)
            .attr("transform", "translate(0,0)")
            .call(params.axis.y);

          this.append("g")
            .classed("gridline x", true)
            .attr("transform", "translate(0, " + height + ")")
            .call(params.axis.gridlines.x);

          this.append("g")
            .classed("gridline y", true)
            .attr("transform", "translate(0,0)")
            .call(params.axis.gridlines.y);

          this.select(".x.axis")
            .append("text")
            .classed("x axis-label", true)
            .attr("transform", "translate(" + width / 2 + ", " + 48 + ")")
            .text("Customer Age");

          this.select(".y.axis")
            .append("text")
            .classed("y axis-label", true)
            .attr("transform", "translate(" + -56 + ", " + height / 2 + ") rotate(-90)")
            .text("Rating (1=Low, 5=High)");

          this.append("g")
            .append("text")
            .classed("chart-header", true)
            .attr("transform", "translate(0, -5)")
            .text("");
        }
      }

      function plot(params) {
        var self = this;

        drawAxis.call(self, params);

        var xKey = '',
            yKey = '';

        var types = d3.keys(params.data[0]).filter(function(d) {
          if (params.dataKeys[d] === 'xvalue') {
            xKey = d;
          } else if (params.dataKeys[d] === 'yvalue') {
            yKey = d;
          } else {
            return d;
          }
        });

        // enter for <g>
        this.selectAll(".type")
          .data(types)
          .enter()
            .append("g")
            .attr("class", function(d) {
              return d;
            })
            .classed("type", true);

        // update fo <g>
        this.selectAll(".type")
          .style("fill", function(d, i) {
            return colorScale(i);
          })
          .on("mouseover", function(d, i) {
            d3.select(this)
              .transition()
              .style("opacity", 1)
          })
          .on("mouseout", function(d, i) {
            d3.select(this)
              .transition()
              .style("opacity", 0.25)
          });

        types.forEach(function(type) {
          var g = self.selectAll("g." + type);
          var arr = params.data.map(function(d) {
            return {
              key: type,
              value: d[type],
              xValue: d[xKey],
              yValue: d[yKey]
            };
          });

          // enter
          g.selectAll(".yvalue")
            .data(arr)
            .enter()
              .append("circle")
              .classed("yvalue", true);

          // update
          g.selectAll(".yvalue")
            .attr("r", function(d) {
              return responseScale(d.yValue);
            })
            .attr("cx", function(d) {
              return x(d.xValue);
            })
            .attr("cy", function(d) {
              return y(d.value)
            })
            .on("mouseover", function(d, i) {
              var str = d.key + ": ";
              str += "Age: " + d.xValue + " ";
              str += "Responses: " + d.yValue + " ";
              str += "Average Rating: " + d.value;
              d3.select(".chart-header").text(str);
            })
            .on("mouseout", function(d, i) {
              d3.select(".chart-header").text("");
            });

          // exit
          g.selectAll(".yvalue")
            .data(arr)
            .exit()
            .remove();
        })
      }

      plot.call(chart, {
        data: data,
        dataKeys: options.dataKeys,
        axis: {
          x: xAxis,
          y: yAxis,
          gridlines: {
            x: xGridlines,
            y: yGridlines
          }
        },
        initialize: true
      })
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

    this.w = 800;
    this.h = 400;

    this.margin = {
      top: 58,
      bottom: 100,
      left: 80,
      right: 40
    };
  };

  // Don't have to use the 'new' keyword
  Charts.init.prototype = Charts.prototype;

  // attach Charts to the global object, and provide a shorthand 'C$'
  global.Charts = global.C$ = Charts;

}(window, jQuery));
