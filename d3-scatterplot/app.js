/* jslint esversion:6 */

document.addEventListener("DOMContentLoaded", function() {

  var width = 600;
  var height = 600;
  var padding = 50;

d3.csv('./all_data.csv', function(row) {
    return {
      region: row["Country or Area"],
      births: +row["Births"],
      population: +row["Population"],
      area: +row["Land Area"],
      lifeExpectancy: +row["Life Expectancy"]
    };
  },
    function(error, data) {
    if (error) throw error;
    console.log(data);

    data = data.filter(region => region.area > 2000);

    var fillScale = d3.scaleLinear()
                      .domain(d3.extent(data, d => d.births / d.population))
                      .range(['black', 'blue']);

    var xScale = d3.scaleLinear()
                   .domain(d3.extent(data, d => d.lifeExpectancy))
                   .range([padding, width - padding]);

    var yScale = d3.scaleLinear()
                   .domain(d3.extent(data, d => d.population / d.area))
                   .range([height - padding, padding]);

    var xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale);

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    svg
      .append("g")
        .attr("transform", "translate(0, " + (height - padding + 10) + ")")
        .call(xAxis);

    svg
      .append("text")
        .text("Life Expectancy")
        .attr("x", width / 2)
        .attr("y", height - padding + 40)
        .style("text-anchor", "middle");

    svg
      .append("g")
        .call(yAxis)
        .attr("transform", "translate(35, 0)");

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cy", d => yScale(d.population / d.area))
        .attr("cx", d => xScale(d.lifeExpectancy))
        .attr("r", 10)
        .attr("fill", d => fillScale(d.births / d.population));
  });
});
