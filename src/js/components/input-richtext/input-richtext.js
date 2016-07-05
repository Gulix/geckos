define(['knockout'], function(ko, utils) {

  function inputRichtextField(editableField) {
    var self = this;

    self.editableField = editableField;

    self.label = editableField.label;
    self.textValue = editableField.textValue;
  }

  return inputRichtextField;
});
