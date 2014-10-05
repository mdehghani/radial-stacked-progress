Radial = {
radial: function(element, bars, options) {
  
    var twoPi = 2 * Math.PI,
        width = options.width || $(element).width(),
        height = options.height || $(element).height(),
        startAngle = options.startAngle / 360 || 0,
        endAngle = options.endAngle / 360 || 1,
        progress = [],
        start = [],
        stacked = [],
        arcs = [],
        formatPercent = d3.format(".0%"),
        duration = options.duration || 1000;

    var st = 0;

    var scale = function(val) {
      return startAngle + val * (endAngle - startAngle);
    }

    
    var st = 0;
    var stroke = 0;
    for (var i in bars) {
      if (bars[i].stacked === false)
        stacked.push(false);
      else
        stacked.push(true);
      var sti = stacked[i] ? st : 0;
      start.push(scale(sti));
      progress.push(scale(sti + bars[i].val));
      if (stacked[i])
        st += bars[i].val;
      if (bars[i]['stroke-width'] > stroke)
        stroke = bars[i]['stroke-width'];
      
    }

    var outerRad = (width < height ? width : height) / 2;
    outerRad -= stroke;

    thickness = options.thickness || 0.3 * outerRad;
    
    var arc = d3.svg.arc()
      .startAngle(twoPi * startAngle)
      .innerRadius(outerRad - thickness)
      .outerRadius(outerRad);

    for (var i in bars) {
      arcs.push(arc);
      if (bars[i].thickness) {
        arcs[i] = d3.svg.arc()
        .startAngle(twoPi * startAngle)
        .innerRadius(outerRad - (thickness - bars[i].thickness) / 2 - bars[i].thickness)
        .outerRadius(outerRad - (thickness - bars[i].thickness) / 2);
      }
    }
    

    

    var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var meter = svg.append("g")
        .attr("class", "progress-meter");
      

    meter.append("path")
        .attr("class", "background")
        .attr("d", arc.endAngle(twoPi * (endAngle)))
        .style("fill", "#ccc");

    

    var foregrounds = [];
    for (var i in bars) {

      foregrounds[i] = meter.append("path")
          .attr("class", "foreground")
          .style("fill", bars[i].fill || "none")
          .style("stroke", bars[i].stroke || "none");
          if (bars[i]['stroke-width'] != null)
            foregrounds[i].style("stroke-width", bars[i]['stroke-width']);
          if (bars[i].val == 0)
                foregrounds[i].style('display', 'none');
    }

    var text = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");

  return {
  update: function(vals) {
      var total = 0;
      for (var i in vals) {
        var sti = stacked[i] ? total : 0;
        var newStart = scale(sti);
        var newProgress = scale(sti + vals[i]);
        var start_ip = d3.interpolate(start[i], newStart);
        var progress_ip = d3.interpolate(progress[i], newProgress);
        //console.log('S: ' + start[i] + " , " + newStart);
        //console.log('P: ' + progress[i] + " , " + newProgress);

        var func = function() {
          var self = this;
          return function(t) {
            var s = self.start_ip(t);
            var p = self.progress_ip(t);
            foregrounds[self.i].attr("d", arcs[self.i].startAngle(twoPi * s).endAngle(twoPi * p));
            if (t == 1) {
              progress[self.i] = self.newProgress;
              start[self.i] = self.newStart;

              if (self.newProgress == self.newStart)
                foregrounds[self.i].style('display', 'none');
            }
          }
        }

        var obj = {i: i, newStart: newStart, newProgress: newProgress,
          start_ip: start_ip, progress_ip: progress_ip};
        if (newProgress != newStart)
          foregrounds[i].style('display', 'block');  
        foregrounds[i].transition().duration(duration).tween("progress", func.bind(obj));
        /*
        foregrounds[i].transition().tween("progress", function() {
          return function(t) {
            .duration(1000).attrTween("d", arc.startAngle(twoPi * start).endAngle(twoPi * (start+progress)));
          */
        if (stacked[i])
          total += vals[i];
      }
      text.text(formatPercent(total));
    }
  }
}
}

