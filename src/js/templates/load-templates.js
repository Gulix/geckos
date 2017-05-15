define([
'json!templates/dw-lieu.json'],
 function(
tpl1)
 { return { load: function() {
var list = [ ];
list.push(tpl1);
return list;

} }; });
