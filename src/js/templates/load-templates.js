define([
'json!templates/arabesque-event.json', 
'json!templates/basic-effects.json'], 
 function(
tpl1, tpl2) 
 { return { load: function() {
var list = [ ];
list.push(tpl1);
list.push(tpl2);
return list;

} }; });