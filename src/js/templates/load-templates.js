define([
'json!templates/dw-acritarche.json'],
 function(
tpl1)
 { return { load: function() {
var list = [ ];
list.push(tpl1);
return list;

} }; });
