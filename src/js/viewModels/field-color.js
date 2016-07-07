define(['knockout'], function(ko) {

  function fieldColor(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }
    self.textValue = ko.observable(jsonField.default);

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return self.textValue();
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
        return "input-color";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      if (valueType == 'text') { return self.getTextValue(); }

      return '';
    }
  }

  return {
    build: function(jsonField) { return new fieldColor(jsonField); }
  }
});
