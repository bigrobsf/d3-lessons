/* jslint esversion:6 */

function stackedBar() {

  d3.select('.plot-notes')
    .classed('hidden', true);

  var svg = d3.select("svg"),
    margin = {top: 20, right: 40, bottom: 30, left: 20},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
            .rangeRound([0, width]);

  var y = d3.scaleLinear()
            .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
            .range(["#ff8a80", "#ea80fc", "#b388ff", "#8c9eff", "#80d8ff",
                    "#a7ffeb", "#b9f6ca", "#f4ff81", "#ffd180", "#ff9e80"]);

  d3.csv('detection_data.csv', function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
      // return {
      //   year: row["Year"],
      //   astrometry: +row["Astrometry"],
      //   eclipseTimeVar: +row["Eclipse Timing Variations"],
      //   imaging: +row["Imaging"],
      //   microlensing: +row["Microlensing"],
      //   orbitBrightMod: +row["Orbital Brightness Modulation"],
      //   pulsarTiming: +row["Pulsar Timing"],
      //   pulseTimingVar: +row["Pulsation Timing Variations"],
      //   radialVelocity: +row["Radial Velocity"],
      //   transit: +row["Transit"],
      //   transitTimeVar: +row["Transit Timing Variations"]
      // };
    },

    function(error, data) {
      if (error) throw error;
      console.log(data);

      var keys = data.columns.slice(1);

      x.domain(data.map(function(d) { return d.Year; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
      z.domain(keys);

      g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
          .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
          .attr("x", function(d) { return x(d.data.Year); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width", x.bandwidth());

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(" + width + ", 0)")
              .call(d3.axisRight(y))
            .append("text")
              .attr("x", -80)
              .attr("y", y(y.ticks().pop()) + 0.5)
              .attr("dy", "0.32em")
              .attr("fill", "#000")
              .attr("font-weight", "bold")
              .attr("text-anchor", "start")
              .text("Detections");





    }
  );
}
