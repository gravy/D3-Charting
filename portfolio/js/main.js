var formatDate = d3.time.format("%B %-d, %Y"),
  parseDate = d3.time.format.iso.parse,
  page = 0,
  fetching,
  id;

display(null, [
  {
    "id":"0e366778251a62b98826",
    "description":"nvd3 Hot Dog Contest Bar Chart",
    "created_at":"2014-12-20T00:45:41.000Z",
    "updated_at":"2014-12-26T16:18:11.000Z"
  },
  {
    "id":"bdc0474429e6567bc320",
    "description":"D3 Scatterplot of 2014 NCAA Passing Statistics",
    "created_at":"2014-12-15T16:33:03.000Z",
    "updated_at":"2014-12-26T16:18:01.000Z"
  },
  {
    "id":"6185069",
    "description":"D3 Scatterplot Example",
    "created_at":"2013-08-08T14:27:44.000Z",
    "updated_at":"2014-09-24T18:26:09.000Z"
  },
  {
    "id":"6041345",
    "description":"Bar chart practice",
    "created_at":"2013-07-19T18:33:25.000Z",
    "updated_at":"2013-07-19T19:07:28.000Z"
  }
])

d3.select(window)
  .on("scroll", maybeFetch)
  .on("resize", maybeFetch);

function maybeFetch() {
  if (!fetching && page >= 0 && d3.select(".loading").node().getBoundingClientRect().top < innerHeight) {
    ++page;
    fetch();
  }
}

function fetch() {
  fetching = true;
  console.log("/" + encodeURIComponent("weiglemc") + "/" + page + ".json" + (id ? "?" + id : ""));
  d3.json("/" + encodeURIComponent("weiglemc") + "/" + page + ".json" + (id ? "?" + id : ""), display);
}

function display(error, gists) {
  fetching = false;

  if (!gists.length) {
    page = NaN;
    d3.select(".loading").remove();
    return;
  }

  gists.forEach(function (d) {
    d.created_at = parseDate(d.created_at);
    d.updated_at = parseDate(d.updated_at);
  });

  var gistEnter = d3.select(".gists").selectAll(".gist")
    .data(gists, function (d) {
      return d.id;
    })
    .enter().insert("a", "br")
    .attr("class", "gist")
    .attr("href", function (d) {
      return "/weiglemc/" + d.id;
    })
    .style("background-image", function (d) {
      return "url(/weiglemc/raw/" + d.id + "/thumbnail.png)";
    });

  gistEnter.append("span")
    .attr("class", "description")
    .text(function (d) {
      return d.description || d.id;
    });

  gistEnter.append("span")
    .attr("class", "date")
    .text(function (d) {
      return formatDate(d.created_at);
    });

  d3.select(".gists").selectAll(".gist")
    .sort(function (a, b) {
      return b.created_at - a.created_at;
    });

  id = gists[gists.length - 1].id;
  setTimeout(maybeFetch, 50);
}