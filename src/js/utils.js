define(['knockout'], function(ko) {

  function isNumber(obj) { return !isNaN(parseFloat(obj)) }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getFromUrl(name) {
     if( name = (new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
  }

  return {
    isNumber: function(obj) { return isNumber(obj); },
    clone: function(obj) { return clone(obj); },
    getFromUrl: function(obj) { return getFromUrl(obj); }
  }
});
