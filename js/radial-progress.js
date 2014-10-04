Radial = {
radial: function(element, bars, options) {
  
    var width = options.width || $(element).width(),
        height = options.height || $(element).height(),
        startAngle = options.startAngle,
        endAngle = options.endAngle,
        twoPi = 2 * Math.PI,
        progress = [],
        start = [],
        stacked = [],
        formatPercent = d3.format(".0%"),
        duration = options.duration || 1000;

    var st = 0;

    var scale = function(val) {
      return startAngle + val * (endAngle - startAngle);
    }

    
    var st = 0;
    var stroke = 0;
    for (var i in bars) {
      start.push(scale(st));
      progress.push(scale(st + bars[i].val));
      st += bars[i].val;
      if (bars[i].stacked === false)
        stacked.push(false);
      else
        stacked.push(true);
      if (bars[i]['stroke-width'] > stroke)
        stroke = bars[i]['stroke-width'];
    }
    

    var outerRad = (width < height ? width : height) / 2;
    outerRad -= stroke;
    
    var arc = d3.svg.arc()
      .startAngle(twoPi * startAngle)
      .innerRadius(outerRad * 0.7)
      .outerRadius(outerRad);

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
        var newStart = scale(total);
        var newProgress = scale(total + vals[i]);
        var start_ip = d3.interpolate(start[i], newStart);
        var progress_ip = d3.interpolate(progress[i], newProgress);
        //console.log('S: ' + start[i] + " , " + newStart);
        //console.log('P: ' + progress[i] + " , " + newProgress);

        var func = function() {
          var self = this;
          console.log(self);
          return function(t) {
            var s = self.start_ip(t);
            var p = self.progress_ip(t);
            foregrounds[self.i].attr("d", arc.startAngle(twoPi * s).endAngle(twoPi * p));
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

