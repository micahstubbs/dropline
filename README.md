a [ES2015](https://babeljs.io/docs/learn-es2015/) fork of [@micahstubbs](https://twitter.com/micahstubbs)' bl.ock [X-Value Mouseover with Droplines](http://bl.ocks.org/micahstubbs/d9f3cd0d926af7a5a1a8)

this example also converts all CSS styles previously inside of the `<style></style>` HTML tags into inline styles applied in Javascript to d3 selections. 

this CSS that styles the droplines:

```css
.focus line {
  fill: none;
  stroke: black;
  stroke-width: 1.5px;
  stroke-dasharray: 3 3;
}
```

becomes this Javascript that does the same thing:

```Javascript
    d3.selectAll('.focus line')
      .style({
        fill: 'none',
        'stroke': 'black',
        'stroke-width': '1.5px',
        'stroke-dasharray': '3 3'
      })
```

inline styles can make it easier to quickly include d3js examples like this into a larger Javascript project that is automatically built from many source files into one bundle file.