define(['knockout'], function(ko) {

  function fieldNumeric(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    if ((jsonField.min != undefined) && (jsonField.max != undefined) && (jsonField.min < jsonField.max)) {
      self.min = jsonField.min;
      self.max = jsonField.max;
      self.step = 1;
    }
    if (jsonField.step != undefined) {
      self.step = jsonField.step;
    }
    self.is_range = (jsonField.is_range != undefined) ? jsonField.is_range : false;

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
      if (self.is_range)
        return "input-numeric-range";
      if ((self.min != undefined) && (self.max != undefined))
        return "input-numeric-minmax";

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
