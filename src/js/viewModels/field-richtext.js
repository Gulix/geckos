define(['knockout', 'fabricjs-textStyles'], function(ko, styles) {

  function fieldRichtext(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    self.textValue = ko.observable(jsonField.default);

    self.textDisplayed = ko.observable(function() {
      return styles.generateTextFromHtml(self.textValue());
    });
    self.getObjectValue = function() {
      return styles.generateStylesFromHtml(self.textValue());
    };

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return self.textDisplayed();
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
      return "input-richtext";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      // Two possibilites : displaying the constant value, or the displayed text
      if (valueType == 'text') { return self.textDisplayed(); }
      if (valueType == 'html') { return self.textValue(); }

      return '';
    }
  }



  return {
    build: function(jsonField) { return new fieldRichtext(jsonField); }
  }
});
