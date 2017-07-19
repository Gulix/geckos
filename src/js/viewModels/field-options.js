define(['knockout'], function(ko) {

  function fieldOptions(jsonField, sharedOptions) {
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

      // Getting the SharedOptions (if they exist and are defined)
      if ((sharedOptions != undefined) && (sharedOptions.length > 0) && (jsonField.sharedOptions != undefined))
      {
        var sharedOptionsKey = null;
        // SharedOptions can be expressed by a single string or the object { key: key }
        if (jsonField.sharedOptions.key !== undefined) {
          sharedOptionsKey = jsonField.sharedOptions.key;

        } else { // String object
          sharedOptionsKey = jsonField.sharedOptions;
        }

        var foundSharedOption = _.find(sharedOptions, function(o) {
          return o.key == sharedOptionsKey;
        });

        var optionsList = [];

        if (foundSharedOption != null) {

          optionsList = foundSharedOption.options;

          // Filter on the displayed options if the sharedOptions provides a list : { key: key, options: [ "" ] }
          if ((jsonField.sharedOptions.options !== undefined) && Array.isArray(jsonField.sharedOptions.options)
              && (jsonField.sharedOptions.options.length > 0)) {
            optionsList = _.filter(optionsList, function(o) {
              return _.some(jsonField.sharedOptions.options, function(k) {
                return k == o.option;
              });
            });
          }
        }

        self.options = optionsList;
        if (optionsList.length > 0) {
          self.selectedOption = ko.observable(self.options[0]);
        }
      }
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

    /* Value to get the content */
    self.getCodeValue = function() {
      return self.getJsonValue();
    }

    self.getObjectValue = function() {
      var selectedValue = self.selectedOption();
      if ((selectedValue != null) && (selectedValue.content != undefined)) {
        return selectedValue.content;
      } else {
        return { }
      }
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
      var withImages = false;
      for(var iOption = 0; iOption < self.options.length; iOption++) {
        if ((self.options[iOption].image != undefined) || (self.options[iOption].miniature != undefined)) {
          withImages = true;
          break;
        }
      }
      if (withImages) {
        return "input-options-images";
      } else {
        return "input-options";
      }
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      // Two possibilites : displaying the constant value, or the displayed text
      var selectedValue = self.selectedOption();
      if (selectedValue != null) {
        if (valueType == 'text') { return selectedValue.text; }
        if (valueType == 'lower') { return selectedValue.text.toLowerCase(); }
        if (valueType == 'upper') { return selectedValue.text.toUpperCase(); }
        if (valueType == 'value') { return selectedValue.option; }
        if (valueType == 'image') {
          if (selectedValue.image != undefined) { return selectedValue.image; }
          if (selectedValue.miniature != undefined) { return selectedValue.miniature; }
          return '';
        }
        if (valueType == 'miniature') {
          if (selectedValue.miniature != undefined) { return selectedValue.miniature; }
          if (selectedValue.image != undefined) { return selectedValue.image; }
          return '';
        }
      }

      return '';
    }
  }

  return {
    build: function(jsonField, sharedOptions) { return new fieldOptions(jsonField, sharedOptions); }
  }
});
