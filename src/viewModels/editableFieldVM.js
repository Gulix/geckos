/**
 * ViewModel representing a Field that can be edited to set card data.
 * @param  {json table} json description of the Field
 */
function editableFieldVM(jsonField) {
  var self = this;

  self.name = jsonField.name;
  self.label = jsonField.label;

  self.textValue = ko.observable(jsonField.default);
}
