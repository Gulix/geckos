define(['knockout'], function(ko) {

  function fieldCheckbox(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    var defVal = false;
    if (jsonField.default != undefined) { defVal = jsonField.default; } // TODO : ensure that's a boolean
    self.checkedValue = ko.observable(defVal);

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return '';
    }

    /* Value to be exported to be saved */
    self.getJsonValue = function() {
      return self.checkedValue();
    }

    /* Setting value from Json stored data */
    self.setValue = function(value) {
      self.checkedValue(value);
    }

    self.getComponentName = function() {
      return "input-checkbox";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      return '';
    }
  }

  return {
    build: function(jsonField) { return new fieldCheckbox(jsonField); }
  }
});
