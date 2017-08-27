/* jslint esversion:6 */

document.addEventListener("DOMContentLoaded", function() {

  var width = 800;
  var height = 500;
  var padding = 60;

  d3.tsv('top_shows2.tsv', function(row) {
      return {
        rank: row["Rank"],
        title: row["Title"],
        stars: row["Stars"],
        debut: row["Debut"],
        rating: +row["Rating"],
        numRatings: +row["Num of Ratings"]
      };
    },
      function(error, shows) {
      if (error) throw error;
      console.log(shows);

      var fillScale = d3.scalePow().exponent(0.5)
                        .domain(d3.extent(shows, d => d.numRatings))
                        .range(['black', '#f44336']);

      var radiusScale = d3.scalePow().exponent(0.5)
                          .domain(d3.extent(shows, d => d.numRatings))
                          .range([2, 15]);

      var xScale = d3.scaleLinear()
                     .domain(d3.extent(shows, d => d.debut))
                     .range([padding, width - padding]);

      var yScale = d3.scaleLinear()
                     .domain(d3.extent(shows, d => d.rating))
                     .range([height - padding, padding]);

      var xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));

      var yAxis = d3.axisLeft(yScale);

      var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

      svg
        .append("text")
          .text("Top 250 TV Series - Ratings by Year")
          .attr("x", width / 2)
          .attr("y", 20)
          .style("text-anchor", "middle")
          .style("font-weight", "bold");

      svg
        .append("text")
          .text("Color intensity and circle size increases with the number of ratings.")
          .attr("x", width / 2)
          .attr("y", 40)
          .style("text-anchor", "middle")
          .style("font-size", "13px");

      svg
        .append("text")
          .text("Data as of August 2017")
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
        .data(shows)
        .enter()
        .append("circle")
          .attr("cy", d => yScale(d.rating))
          .attr("cx", d => xScale(d.debut))
          .attr("fill", d => fillScale(d.numRatings))
          .on("mousemove", showTooltip)
          .on("touchstart", showTooltip)
          .on("mouseout", function() {
            d3.select(".tooltip")
                .style("opacity", 0);
          })
          .attr("r", 0)
          .transition()
          .duration(1000)
          .delay((d, i) => i * 10)
          .attr("r", d => radiusScale(d.numRatings));

    function showTooltip(d) {
      d3.select(".tooltip")
          .style("opacity", 1)
          .style("top", d3.event.y + 20 + "px")
          .style("left", d3.event.x - 80 + "px")
          .html(`
            <p>#${d.rank}: ${d.title}</p>
            <p>${d.stars}</p>
          `);
    }
  });
});
