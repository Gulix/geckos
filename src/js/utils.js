define(['knockout'], function(ko) {

  function isNumber(obj) { return !isNaN(parseFloat(obj)) }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  return {
    isNumber: function(obj) { return isNumber(obj); },
    clone: function(obj) { return clone(obj); }
  }
});
