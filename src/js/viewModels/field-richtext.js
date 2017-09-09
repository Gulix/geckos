define(['knockout', 'fabricjs-textStyles', 'tinycolor'], function(ko, styles, tinycolor) {

  function fieldRichtext(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    // Filling snippets
    if ((jsonField.snippets != null) && (jsonField.snippets.length > 0)) {
      self.snippets = [];

      _.forEach(jsonField.snippets, function(s) {
        var snip = { };
        snip.name = s.name;
        snip.html = s.value;
        snip.title = s.tooltip;
        if (s.icon != null) {
          snip.icon = "../../../../templates/" + s.icon;
        } else if (s.dataurl != null) {
          snip.icon = s.dataurl;
        }

        self.snippets.push(snip);
      });
    }

    // Filling colored text
    if ((jsonField.colored != null) && jsonField.colored) {
      self.colored = true;
      if ((jsonField.colors != null) && (jsonField.colors.length > 0)) {
        var colors = [];
        _.forEach(jsonField.colors, function(c) {
          var color = tinycolor(c);
          colors.push(color.toHex());
        });

        self.colors = _.join(colors, ',');
      }
    }

    self._textValue = ko.observable(jsonField.default);
    self.textValue = ko.computed({
      read: function () {
        if ((self._textValue() == null) || (self._textValue().length < 1)) {
          return "<p></p>";
        }
        else {
          return self._textValue();
        }
      },
      write: function (value) {
        self._textValue(value);
      }
    })

    self.textDisplayed = ko.observable(function() {
      return styles.generateTextFromHtml(self._textValue());
    });
    self.getObjectValue = function() {
      return styles.generateStylesFromHtml(self._textValue());
    };

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return self.textDisplayed();
    }

    /* Value to be exported to be saved */
    self.getJsonValue = function() {
      return self._textValue();
    }

    /* Setting value from Json stored data */
    self.setValue = function(value) {
      self._textValue(value);
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
