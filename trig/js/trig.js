;(function(global, $) {

  // 'new' an object
  var Trig = function() {
    return new Trig.init();
  };

  Trig.prototype = {

    lengthOfOppositeSide: function(type, angle, sideLength) {
      var result;
      //var c = Math.sin(angle/180*Math.PI) * (sideHeight/Math.sin(90/180*Math.PI));
      if (type === 'sin') {
        result = Math.sin(angle/180*Math.PI) * sideLength;
      } else if (type === 'tan') {
        result = Math.tan(angle/180*Math.PI) * sideLength;
      } else {
        result = 'Illegal trig function for opposite side'
      }
      this.log(result);
    },

    lengthOfAdjacentSide: function(type, angle, sideLength) {
      var result;

      if (type === 'cos') {
        result = Math.cos(angle/180*Math.PI) * sideLength;
      } else if (type === 'sin') {
        result = sideLength / Math.sin(angle/180*Math.PI);
      } else {
        result = 'Illegal trig function for adjacent side'
      }
      this.log(result);
    },

    lengthOfHypotenuse: function(type, angle, sideLength) {
      var result;

      if (type === 'cos') {
        result = sideLength / Math.cos(angle/180*Math.PI);
      } else if (type === 'sin') {
        result = sideLength / Math.sin(angle/180*Math.PI);
      } else {
        result = 'Illegal trig function for adjacent side'
      }
      this.log(result);
    },

    log: function(msg) {
      if (console) {
        console.log(msg);
      }
      // make chainable
      return this;
    }

  };

  // Constructor - the actual object is created here, allowing to 'new' an object without calling 'new'
  Trig.init = function() {
    var self = this;

    this.foo = 11;
  };

  // Don't have to use the 'new' keyword
  Trig.init.prototype = Trig.prototype;

  // attach Trig to the global object, and provide a shorthand 'T$'
  global.Trig = global.T$ = Trig;

}(window, jQuery));
