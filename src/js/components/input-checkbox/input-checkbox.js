define(['knockout'], function(ko, utils) {

  function inputCheckboxField(editableField) {
    var self = this;

    self.editableField = editableField;

    self.label = editableField.label;
    self.checkedValue = editableField.checkedValue;
  }

  return inputCheckboxField;
});
