define(['knockout'], function(ko, utils) {

  function inputTextField(editableField) {
    var self = this;

    self.editableField = editableField;

    self.label = editableField.label;
    self.textValue = editableField.textValue;
  }

  return inputTextField;
});
