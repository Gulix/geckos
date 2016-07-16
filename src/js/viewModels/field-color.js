define(['knockout', 'tinycolor'], function(ko, tinycolor) {

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

    /* Object to be used with a Code Variable */
    self.getCodeValue = function() {
      var color = tinycolor(self.getTextValue());
      return color;
    }

    self.getComponentName = function() {
        return "input-color";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      if (valueType == 'text') { return self.getTextValue(); }
      if (valueType == 'hexa') { return '#' + self.getTextValue(); }

      // Using tinycolor.js to get specific color values
      var color = tinycolor(self.getTextValue());

      var transformations = valueType.split('.');
      for (iTransformation = 0; iTransformation < transformations.length; iTransformation++) {
        var currentTransformation = transformations[iTransformation];

        // R, G, B values (final value, no transformation on it)
        if (currentTransformation == 'R') {
          return color.toRgb().r;
        } else if (currentTransformation == 'G') {
          return color.toRgb().g;
        } else if (currentTransformation == 'B') {
          return color.toRgb().b;
        }

        // Consecutive calls of transformations
        color = recursiveColorTransformation(color, currentTransformation);
      }

      return color.toString();

      // Need to think about other functions and recursive call
      // For example : $myVariableColor.complement.brighten50$
      // The valueType string has all the variable content behind the first '.'
      // With a while syntax and a regexCall, should be easy to make
      //
      // Also, access to Tinycolor when a variable is with code.
      // Maybe getting the variables BestReadableOnWhite/Black an easy access
    }
  }

  self.recursiveColorTransformation = function(currentColor, transformationKey) {

    // The function will return a Tinycolor object
    // The TransformationKey will define what operation will be performed
    // on the currentColor object (also a Tinycolor object)
    var regexMatch = null;
    var regexType = '';

    // Alpha
    regexType = /^alpha(100|[0-9][0-9]?)$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var coeff = regexMatch[1];
      return currentColor.setAlpha(coeff / 100);
    }

    // Darken
    regexType = /^darken([0-9][0-9]?)$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var coeff = regexMatch[1];
      return currentColor.darken(coeff);
    } else if (transformationKey == 'darken') { return currentColor.darken(); }

    // Lighten
    regexType = /^lighten([0-9][0-9]?)$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var coeff = regexMatch[1];
      return currentColor.lighten(coeff);
    } else if (transformationKey == 'lighten') { return currentColor.lighten(); }

    // Brighten
    regexType = /^brighten([0-9][0-9]?)$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var coeff = regexMatch[1];
      return currentColor.brighten(coeff);
    } else if (transformationKey == 'brighten') { return currentColor.brighten(); }

    // Desaturate
    regexType = /^desaturate([0-9][0-9]?)$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var coeff = regexMatch[1];
      return currentColor.desaturate(coeff);
    } else if (transformationKey == 'desaturate') { return currentColor.desaturate(); }

    // Saturate
    regexType = /^saturate([0-9][0-9]?)$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var coeff = regexMatch[1];
      return currentColor.saturate(coeff);
    } else if (transformationKey == 'saturate') { return currentColor.saturate(); }

    // Greyscale
    if (transformationKey == 'greyscale') { return currentColor.greyscale(); }

    // Complement
    if (transformationKey == 'complement') { return currentColor.complement(); }

    // Split-Complement
    regexType = /^splitcomplement([123])$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var index = regexMatch[1];
      return currentColor.splitcomplement()[index - 1];
    }

    // Triad
    regexType = /^triad([123])$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var index = regexMatch[1];
      return currentColor.triad()[index - 1];
    }

    // Tetrad
    regexType = /^tetrad([1234])$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var index = regexMatch[1];
      return currentColor.tetrad()[index - 1];
    }

    // Analogous
    regexType = /^analogous([123456])$/g;
    if ((regexMatch = regexType.exec(transformationKey)) !== null) {
      var index = regexMatch[1];
      return currentColor.analogous()[index - 1];
    }

    return currentColor;
  }

  return {
    build: function(jsonField) { return new fieldColor(jsonField); }
  }
});
