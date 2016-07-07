## dropline

the #d3js bl.ock [ES2015 X-Value Mouseover with Droplines](http://bl.ocks.org/micahstubbs/d66a1662fd64a08051dc473f0d1f956e) packaged up as an node module.  a learning exercise for me that just might be useful to the wider world.

the `data` parameter to `dropline.plot()` should be an array of objects that each have a `date` and `value` property.

#### example  


install `dropline` from the terminal:  


```
$ npm i dropline d3 --save
```

then, in your project:

```
import dropline from 'dropline';

document.body.innerHTML += '<div id="vis"></div>';

const data = [
  { date: '1-May-12', value: 582.13 },
  { date: '30-Apr-12', value: 583.98 },
  { date: '27-Apr-12', value: 603.00 },
  { date: '26-Apr-12', value: 607.70 }
];

dropline.plot('#vis', data);
```

![dropline-3](http://i.giphy.com/3o6Zt38IvnsZFnDPMY.gif)