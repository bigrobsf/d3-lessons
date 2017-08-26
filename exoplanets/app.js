/* jslint esversion:6 */

document.addEventListener("DOMContentLoaded", function() {

  var width = 800;
  var height = 700;
  var padding = 60;

  d3.csv('exomultpars.csv', function(row) {
      return {
        discoveryMethod: row["mpl_discmethod"],
        periodDays: +row["mpl_orbper"],
        distAu: +row["mpl_orbsmax"],
        name: row["mpl_name"],
        massEarths: +row["mpl_masse"],
        radiusEarths: +row["mpl_rade"],
        yearFound: row["mpl_disc"],
        starDist: +row["st_dist"]
      };
    },
      function(error, data) {
      if (error) throw error;
      console.log(data);

      var fillScale = d3.scalePow().exponent(0.5)
                        .domain(d3.extent(data, d => d.massEarths))
                        .range(['black', '#f44336']);

      var radiusScale = d3.scalePow().exponent(0.5)
                          .domain(d3.extent(data, d => d.radiusEarths))
                          .range([2, 15]);

      var xScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.yearFound))
                     .range([padding, width - padding]);

      var yScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.starDist))
                     .range([height - padding, padding]);

      var xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));

      var yAxis = d3.axisLeft(yScale);

      var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

      svg
        .append("text")
          .text("Exoplanets Found by Year")
          .attr("x", width / 2)
          .attr("y", 20)
          .style("text-anchor", "middle")
          .style("font-weight", "bold");

      svg
        .append("text")
          .text("Circle size indicates planet diameter. Black indicates unknown.")
          .attr("x", width / 2)
          .attr("y", 40)
          .style("text-anchor", "middle")
          .style("font-size", "13px");

      svg
        .append("text")
          .text("Data as of 24 August 2017")
          .attr("x", width / 2)
          .attr("y", height - 5)
          .style("text-anchor", "middle")
          .style("font-size", "14px");

      svg
        .append("g")
          .attr("transform", "translate(0, " + (height - padding + 10) + ")")
          .call(xAxis);

      svg
        .append("g")
          .attr("transform", "translate(35, 0)")
          .call(yAxis);

      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cy", d => yScale(d.starDist))
          .attr("cx", d => xScale(d.yearFound))
          .attr("fill", d => fillScale(d.massEarths))
          .on("mousemove", showTooltip)
          .on("touchstart", showTooltip)
          .on("mouseout", function() {
            d3.select(".tooltip")
                .style("opacity", 0);
          })
          .attr("r", 0)
          .transition()
          .duration(1000)
          .attr("r", d => radiusScale(d.radiusEarths));

    function showTooltip(d) {
      d3.select(".tooltip")
          .style("opacity", 1)
          .style("top", d3.event.y + 20 + "px")
          .style("left", d3.event.x - 80 + "px")
          .html(`
            <p>${d.name}</p>
            <p>Year: ${d.periodDays} Earth days</p>
            <p>Max dist from star: ${d.distAu} AU</p>
          `);
    }
  });
});
