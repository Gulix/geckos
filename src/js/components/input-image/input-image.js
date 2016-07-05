define(['knockout'], function(ko, utils) {

  function inputImageField(editableField) {
    var self = this;

    self.editableField = editableField;

    self.label = editableField.label;
    self.uploadImage = function(file) { editableField.uploadImage(file); };    
  }

  return inputImageField;
});
