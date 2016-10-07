define(["knockout", "utils", "viewModels/styleVM", "inheriting-styles"], function(ko, utils, StyleVM, InheritingStyles) {

  function cardTemplateVM(jsonTemplate, updCanvasSize, updCardsOnTemplateChange) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.styleVM = ko.observable();
    self.styles = ko.observableArray([ ]);
    self.selectedStyle = ko.observable();

    self._activeTemplateJson = { }; // The 'active' JSON code of the template

    self.description = ko.observable();

    self.isMultiStyles = ko.pureComputed(function() {
      return (self.styles() != null) && (self.styles().length > 1);
    });

    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.updateCanvasSize = updCanvasSize;
    self.updateCards = updCardsOnTemplateChange;

    self.generateTemplate = function(cardVM) {
      var generated = { "objects" : [] };
      if (self.styleVM() != null) {
        generated = self.styleVM().generateTemplate(cardVM);
      }
      return generated;
    }

    self.saveTemplateAsJson = function() {
      var blob = new Blob([JSON.stringify(self._activeTemplateJson)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "template.json"); // TODO : filename depending of name of template (if provided)
    }
    self.loadTemplate = function() {
      $("#file-load-template").click();
    }
    self.getJson = function() {
      return self._activeTemplateJson;
    }

    /* Remove and Replace the fonts embedded in the template */
    self.updateEmbeddedFonts = function() {
      $('.canvas-fonts').remove();

      if ((self._activeTemplateJson != null) && (self._activeTemplateJson.fonts != null)) {
        var canvasFontsStyle = document.createElement('style');
        canvasFontsStyle.setAttribute('class', 'canvas-fonts');
        for(var iFont = 0; iFont < self._activeTemplateJson.fonts.length; iFont++) {
          var currentFont = self._activeTemplateJson.fonts[iFont];
          if ((currentFont != null) && (currentFont.fontFamily != null) && (currentFont.src != null)) {
            var fontFace = "@font-face { font-family: '" + currentFont.fontFamily + "'; "
              + "src: url(" + currentFont.src + "); "
              + "font-style: " + ((currentFont.fontStyle != undefined) ? currentFont.fontStyle : "normal") + "; "
              + "}";
            var fontNode = document.createTextNode(fontFace);
            canvasFontsStyle.appendChild(fontNode);
          }
        }

        document.head.appendChild(canvasFontsStyle);
      }
    }

    self.initStyleFromCode = function(jsonStyle) {
      if (self.styleVM() != null)
      {
        self.styleVM().initStyleFromCode(jsonStyle);
      }
    }

    self.initTemplateFromJson = function() {
      var jsonStyle = { };

      self.updateEmbeddedFonts();

      if (self._activeTemplateJson.styles != null) {
        self.styles(self._activeTemplateJson.styles);
        jsonStyle = self.getDefaultStyle();
        self.selectedStyle(jsonStyle);
      } else {
        jsonStyle = self.buildStyleFromRoot();
      }

      self.description(self._activeTemplateJson.description);

      self.setStyle(jsonStyle);
    }

    // Create the Style object, getting if needed the SharedConfiguration objects
    // & inheriting values from another style
    self.buildStyleObject = function(jsonStyle) {
      var jsonCompleteStyle = jsonStyle;

      if (jsonCompleteStyle.basedOn != undefined) {
        var baseStyle = self.getStyleFromKey(jsonCompleteStyle.basedOn);
        baseStyle = self.buildStyleObject(baseStyle);

        jsonCompleteStyle = InheritingStyles.getStyleFromBase(jsonCompleteStyle, baseStyle);
      }

      jsonCompleteStyle.sharedOptions = self._activeTemplateJson.sharedOptions;
      jsonCompleteStyle.fields.sort(self.compareFieldOrder);
      jsonCompleteStyle.canvasFields.sort(self.compareFieldOrder);

      return jsonCompleteStyle;
    }
    self.compareFieldOrder = function(fieldA, fieldB) {
      var orderA = (fieldA.order != undefined) ? fieldA.order : 1;
      var orderB = (fieldB.order != undefined) ? fieldB.order : 1;

      if (orderA < orderB)
         return -1;
      if (orderA > orderB)
         return 1;
      return 0;
    }

    self.getStyleFromKey = function(key) {
      var style = null;
      for (var iStyle = 0; iStyle < self.styles().length; iStyle++) {
        if (self.styles()[iStyle].key == key) {
          style = self.styles()[iStyle];
        }
      }
      return style;
    }

    self.getDefaultStyle = function() {
      var selectedStyle = null;
      for (var iStyle = 0; iStyle < self.styles().length; iStyle++) {
        if (selectedStyle == null) {
          selectedStyle = self.styles()[iStyle];
        }
        if (self.styles()[iStyle].isDefault) {
          selectedStyle = self.styles()[iStyle];
          break;
        }
      }

      return selectedStyle;
    }

    self.setStyle = function(jsonStyle) {
      var jsonStyleComplete = self.buildStyleObject(jsonStyle);
      self.initStyleFromCode(jsonStyleComplete);
    }

    /* When there is no list of styles, style is taken from the root of the template */
    self.buildStyleFromRoot = function() {
      var jsonStyle = { };

      jsonStyle.fields = self._activeTemplateJson.fields;
      jsonStyle.canvasFields = self._activeTemplateJson.canvasFields;
      jsonStyle.canvasBackground = self._activeTemplateJson.canvasBackground;
      jsonStyle.canvasWidth = self._activeTemplateJson.canvasWidth;
      jsonStyle.canvasHeight = self._activeTemplateJson.canvasHeight;

      return jsonStyle;
    }

    self.setTemplate = function(jsonCode) {
      self._activeTemplateJson = jsonCode;
      self.initTemplateFromJson();
    }

    self.canvasWidth = function() {
      if (self.styleVM() != null) return self.styleVM().canvasWidth();
      return 0;
    }
    self.canvasHeight = function() {
      if (self.styleVM() != null) return self.styleVM().canvasHeight();
      return 0;
    }

    self.createNewCard = function() {
      return self.styleVM().createNewCard();
    }
    self.updateFieldsOfCard = function(card) {
      self.styleVM().updateFieldsOfCard(card);
    }
    /********************************/
    /* End of Functions declaration */
    /********************************/

    /* Style initialization */
    var styleVM = StyleVM.newStyleVM({ }, self.updateCanvasSize, self.updateCards);
    self.styleVM(styleVM);

    self.selectedStyle.subscribe(function (newValue) {
      self.setStyle(newValue);
    }, self);

    self._activeTemplateJson = jsonTemplate;
    self.initTemplateFromJson();
  }

  return {
    newCardTemplateVM: function(jsonTemplate, updCanvasSize, updCardsOnTemplateChange)
    {
      return new cardTemplateVM(jsonTemplate, updCanvasSize, updCardsOnTemplateChange);
    }
  }
});
