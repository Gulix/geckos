define(['knockout'], function(ko, utils) {

  function inputOptionsField(editableField) {
    var self = this;

    self.editableField = editableField;

    self.label = editableField.label;
    self.options = editableField.options;
    self.selectedOption = editableField.selectedOption;
  }

  return inputOptionsField;
});
