define(['knockout', 'viewModels/field-text'], function(ko, fieldText) {

  function fieldMultiline(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }
    self.textValue = ko.observable(jsonField.default);
    self.nbLines = 4;
    if (jsonField.lines != undefined) {
      self.nbLines = jsonField.lines;
    }

    /* Value to be used in the templates */
    self.getTextValue = function() {
      var value = self.textValue();
      if ((value == null) || (value == undefined)) {
        value = '';
      }
      return value;
    }

    /* Value to be exported to be saved */
    self.getJsonValue = function() {
      return self.textValue();
    }

    /* Setting value from Json stored data */
    self.setValue = function(value) {
      self.textValue(value);
    }

    self.getComponentName = function() {
      return "input-multiline";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      var value = fieldText.getTextAdvancedValue(valueType, self.getTextValue());

      return value;
    }
  }

  return {
    build: function(jsonField) { return new fieldMultiline(jsonField); }
  }
});
