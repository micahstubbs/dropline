var d3 = require('d3');

module.exports = {
  plot: function(selector, data, options) {
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const parseTime = d3.timeParse('%d-%b-%y');
    const bisectDate = d3.bisector(d => d.date).left;
    const formatValue = d3.format(',.2f');
    const formatCurrency = d => `$${formatValue(d)}`;

    data = data.map(d => type(d));

    d3.select(selector)
      .style('font', '10px sans-serif')

    const x = d3.scaleTime()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    const svg = d3.select(selector).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    data.sort((a, b) => a.date - b.date);

    x.domain([data[0].date, data[data.length - 1].date]);
    y.domain(d3.extent(data, d => d.value));

    svg.append('g')
      .attr('class', 'x axis axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Price ($)');

    // style the axes
    d3.selectAll('.axis path')
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('shape-rendering', 'crispEdges');

    d3.selectAll('.axis line')
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('shape-rendering', 'crispEdges');

    d3.selectAll('.axis--x path')
      .style('display', 'none');

    svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('circle')
      .attr('r', 4.5);

    focus.append('line')
      .classed('x', true);

    focus.append('line')
      .classed('y', true);

    focus.append('text')
      .attr('x', 9)
      .attr('dy', '.35em');

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);

    d3.selectAll('.line')
      .style('fill', 'none')
      .style('stroke', 'steelblue')
      .style('stroke-width', '1.5px');

    d3.selectAll('.overlay')
      .style('fill', 'none')
      .style('pointer-events', 'all');

    d3.selectAll('.focus')
      .style('opacity', 0.7);

    d3.selectAll('.focus circle')
      .style('fill', 'none')
      .style('stroke', 'black');

    d3.selectAll('.focus line')
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '1.5px')
      .style('stroke-dasharray', '3 3');

    function mousemove() {
      const x0 = x.invert(d3.mouse(this)[0]);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.attr('transform', `translate(${x(d.date)}, ${y(d.value)})`);
      focus.select('line.x')
          .attr('x1', 0)
          .attr('x2', -x(d.date))
          .attr('y1', 0)
          .attr('y2', 0);

      focus.select('line.y')
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', height - y(d.value));

      focus.select('text').text(formatCurrency(d.value));
    }

    function type(d) {
      d.date = parseTime(d.date);
      d.value = +d.value;
      return d;
    } 
  }
} 