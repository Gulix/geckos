define(['knockout'], function(ko, utils) {

  function inputNumericField(editableField) {
    var self = this;

    self.editableField = editableField;

    self.label = editableField.label;
    self.numericValue = editableField.numericValue;
  }

  return inputNumericField;
});
