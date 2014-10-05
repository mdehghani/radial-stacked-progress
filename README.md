radial-stacked-progress
=======================

(based on this example: http://bl.ocks.org/mbostock/3750941)


A small javascript library to create radial progress bar with the following features:
- Make some bars stacked and some none-stacked
- Indicate position of 0% and 100% on the circle
- Animation transition

###Usage###


    Radial.radial(element, bars, options)
    
  - element: '#id', '.class', ...
  
  - bars: array of objects to set initial value and options for each bar

  [
  	{val: 0, fill: "1bc480"}, 
	{val: 0, fill: "#ffb023", thickness: 20},
	{val: 0, stroke: "#2a62c0", 'stroke-width': 2, stacked: false, thickness: 34}
  ]

  - options: 
  	- startAngle: Start point of the base progress in degree (zero point is located on 12:00)
  	- endAngle: End point of the base progress
  	- thickness: Thickness of the base progress (all bars inherit this value, unless override it)
  	
  {startAngle: 220, endAngle: 500, thickness: 35}
  

Take a look at demo.html
