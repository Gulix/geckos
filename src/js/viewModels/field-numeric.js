define(['knockout'], function(ko) {

  function fieldNumeric(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    self.textValue = ko.observable(jsonField.default);

    var defVal = 0;
    if (jsonField.default != undefined)
    {
      defVal = jsonField.default;
    }
    self.numericValue = ko.observable(defVal);

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return self.numericValue().toString();
    }

    /* Value to be exported to be saved */
    self.getJsonValue = function() {
      return self.numericValue();
    }

    /* Setting value from Json stored data */
    self.setValue = function(value) {
      self.numericValue(value);
    }

    self.getComponentName = function() {
      return "input-numeric";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      return '';
    }
  }

  return {
    build: function(jsonField) { return new fieldNumeric(jsonField); }
  }
});
