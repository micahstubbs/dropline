var d3 = require('d3');

module.exports = {
  plot: function(selector, data, options) {
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const parseDate = d3.time.format('%d-%b-%y').parse;
    const bisectDate = d3.bisector(d => d.date).left;
    const formatValue = d3.format(',.2f');
    const formatCurrency = d => `$${formatValue(d)}`;

    d3.select(selector)
      .style('font', '10px sans-serif')

    const x = d3.time.scale()
      .range([0, width]);

    const y = d3.scale.linear()
      .range([height, 0]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    const line = d3.svg.line()
      .x(d => x(d.date))
      .y(d => y(d.close));

    const svg = d3.select(selector).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    data.forEach(d => {
      d.date = parseDate(d.date);
      d.close = +d.close;
    });

    data.sort((a, b) => a.date - b.date);

    x.domain([data[0].date, data[data.length - 1].date]);
    y.domain(d3.extent(data, d => d.close));

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Price ($)');

    // style the axes
    d3.selectAll('.axis path')
      .style({
        fill: 'none',
        stroke: '#000',
        'shape-rendering': 'crispEdges'
      })

      d3.selectAll('.axis line')
        .style({
          fill: 'none',
          stroke: '#000',
          'shape-rendering': 'crispEdges'
        })

      d3.selectAll('.x.axis path')
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
        .style({
          fill: 'none',
          stroke: 'steelblue',
          'stroke-width': '1.5px'
        });

      d3.selectAll('.overlay')
        .style({
          fill: 'none',
          'pointer-events': 'all'
        });

      d3.selectAll('.focus')
        .style('opacity', 0.7);

      d3.selectAll('.focus circle')
        .style({
          fill: 'none',
          stroke: 'black'
        })

      d3.selectAll('.focus line')
        .style({
          fill: 'none',
          'stroke': 'black',
          'stroke-width': '1.5px',
          'stroke-dasharray': '3 3'
        })

      function mousemove() {
        const x0 = x.invert(d3.mouse(this)[0]);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr('transform', `translate(${x(d.date)}, ${y(d.close)})`);
        focus.select('line.x')
            .attr('x1', 0)
            .attr('x2', -x(d.date))
            .attr('y1', 0)
            .attr('y2', 0);

        focus.select('line.y')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height - y(d.close));

        focus.select('text').text(formatCurrency(d.close));
      }
    }
} 