define(['knockout'], function(ko, utils) {

  function inputMultilineField(editableField) {
    var self = this;

    self.editableField = editableField;

    self.label = editableField.label;
    self.textValue = editableField.textValue;
    self.nbLines = editableField.nbLines;
  }

  return inputMultilineField;
});
