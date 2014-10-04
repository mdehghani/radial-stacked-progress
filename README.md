radial-stacked-progress
=======================

(based on this example: http://bl.ocks.org/mbostock/3750941)


A small javascript library to create radial progress bar with the following features:
- Make some bars stacked and some none-stacked
- Indicate position of 0% and 100% on the circle
- Animation transition

###Usage###


    Radial.radial(element, vals)
    
  - element: '#id', '.class', ...
  
  - vals: array of objects to set initial value and options for each bar
  
  [{val: 0.5, stroke: '#ff0000', 'stroke-width': 2, stacked: false},
  {val: 0.2, fill: '#00ff00'}]

Take a look at demo.html
