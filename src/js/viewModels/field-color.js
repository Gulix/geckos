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

    self.getComponentName = function() {
        return "input-color";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      if (valueType == 'text') { return self.getTextValue(); }
      if (valueType == 'hexa') { return '#' + self.getTextValue(); }

      // Using tinycolor.js to get specific color values
      var color = tinycolor(self.getTextValue());
      var regexMatch = null;
      var regexType = '';

      // Alpha
      regexType = /^alpha(100|[0-9][0-9]?)$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var coeff = regexMatch[1];
        return color.setAlpha(coeff / 100).toString();
      }

      // R, G, B values
      if (valueType == 'R') {
        return color.toRgb().r;
      } else if (valueType == 'G') {
        return color.toRgb().g;
      } else if (valueType == 'B') {
        return color.toRgb().b;
      }

      // Darken
      regexType = /^darken([0-9][0-9]?)$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var coeff = regexMatch[1];
        return color.darken(coeff).toString();
      } else if (valueType == 'darken') { return color.darken().toString(); }

      // Lighten
      regexType = /^lighten([0-9][0-9]?)$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var coeff = regexMatch[1];
        return color.lighten(coeff).toString();
      } else if (valueType == 'lighten') { return color.lighten().toString(); }

      // Brighten
      regexType = /^brighten([0-9][0-9]?)$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var coeff = regexMatch[1];
        return color.brighten(coeff).toString();
      } else if (valueType == 'brighten') { return color.brighten().toString(); }

      // Desaturate
      regexType = /^desaturate([0-9][0-9]?)$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var coeff = regexMatch[1];
        return color.desaturate(coeff).toString();
      } else if (valueType == 'desaturate') { return color.desaturate().toString(); }

      // Saturate
      regexType = /^saturate([0-9][0-9]?)$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var coeff = regexMatch[1];
        return color.saturate(coeff).toString();
      } else if (valueType == 'saturate') { return color.saturate().toString(); }

      // Greyscale
      if (valueType == 'greyscale') { return color.greyscale().toString(); }

      // Complement
      if (valueType == 'complement') { return color.complement().toString(); }

      // Split-Complement
      regexType = /^splitcomplement([123])$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var index = regexMatch[1];
        return color.splitcomplement()[index - 1].toString();
      }

      // Triad
      regexType = /^triad([123])$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var index = regexMatch[1];
        return color.triad()[index - 1].toString();
      }

      // Tetrad
      regexType = /^tetrad([1234])$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var index = regexMatch[1];
        return color.tetrad()[index - 1].toString();
      }

      // Analogous
      regexType = /^analogous([123456])$/g;
      if ((regexMatch = regexType.exec(valueType)) !== null) {
        var index = regexMatch[1];
        return color.analogous()[index - 1].toString();
      }


      // Need to think about other functions and recursive call
      // For example : $myVariableColor.complement.brighten50$
      // The valueType string has all the variable content behind the first '.'
      // With a while syntax and a regexCall, should be easy to make
      //
      // Also, access to Tinycolor when a variable is with code.
      // Maybe getting the variables BestReadableOnWhite/Black an easy access

      return '';
    }
  }

  return {
    build: function(jsonField) { return new fieldColor(jsonField); }
  }
});
