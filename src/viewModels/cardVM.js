/**
 * ViewModel representing a Card and its data.
 * @param  {editableFieldVM table} List of fields used to create the cards
 */
function cardVM(editableFields, fields) {
  var self = this;

  //self.fields = ko.observableArray(editableFields);
  self.fields = ko.observableArray([]);
  for (var iField = 0; iField < fields.length; iField++) {
    self.fields.push(new editableFieldVM(fields[iField]));
  }

  self.cardName = ko.pureComputed(function() {
    return self.getValue('name');
  });

  self.getValue = function(fieldName) {
    for (var iField = 0; iField < self.fields().length; iField++) {
      var field = self.fields()[iField];
      if (field.name == fieldName) {
        return field.getTextValue();
      }
    }
    return '';
  }
}
