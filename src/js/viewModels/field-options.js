define(['knockout'], function(ko) {

  function fieldOptions(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    if ((jsonField.options != undefined) && (jsonField.options.length > 0)) {

      self.options = jsonField.options;
      self.selectedOption = ko.observable(self.options[0]);
    } else {
      self.options = [];
    }
    self.setOptionFromText = function(textOption) {
      for (var iOption = 0; iOption < self.options.length; iOption++) {
        if (self.options[iOption].option == textOption) {
          self.selectedOption(self.options[iOption]);
        }
      }
    }
    self.setOptionFromText(jsonField.default);

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return self.selectedOption().text;
    }

    /* Value to be exported to be saved */
    self.getJsonValue = function() {
      return self.selectedOption().option;
    }

    /* Setting value from Json stored data */
    self.setValue = function(value) {
      self.setOptionFromText(value);
    }

    self.getComponentName = function() {
      return "input-options";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      // Two possibilites : displaying the constant value, or the displayed text
      var selectedValue = self.selectedOption();
      if (selectedValue != null) {
        if (valueType == 'text') { return selectedValue.text; }
        if (valueType == 'value') { return selectedValue.option; }
      }

      return '';
    }
  }

  return {
    build: function(jsonField) { return new fieldOptions(jsonField); }
  }
});
