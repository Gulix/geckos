define(["knockout", "utils", "viewModels/styleVM", "inheriting-styles", "webfont"],
  function(ko, utils, StyleVM, InheritingStyles, WebFont) {

  function cardTemplateVM(jsonTemplate, updCanvasSize, updCardsOnTemplateChange) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.styleVM = null;

    self.jsonStylesList = ko.observableArray([ ]);
    self.defaultStyle = ko.observable();

    self._activeTemplateJson = { }; // The 'active' JSON code of the template

    self.description = ko.observable();

    self.isMultiStyles = ko.pureComputed(function() {
      return (self.jsonStylesList() != null) && (self.jsonStylesList().length > 1);
    });

    // Selection of the Default template
    self.isStyleSelectionActive = ko.observable(false);
    self.selectedStyle = ko.observable();

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
      var styleForCard = self._styleForCard(cardVM);
      if (styleForCard != null) {
        generated = styleForCard.generateTemplate(cardVM);
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

      // Fonts embedded in the Templates
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

      // Webfonts loaded by TypeKit.Webfont
      if ((self._activeTemplateJson != null) && (self._activeTemplateJson.webfonts != null)) {
        WebFont.load(self._activeTemplateJson.webfonts);
      }
    }

    self.initTemplateFromJson = function() {
      var jsonStyle = { };

      self.updateEmbeddedFonts();

      if (self._activeTemplateJson.styles != null) {
        self.jsonStylesList(self._activeTemplateJson.styles);
        jsonStyle = self.getDefaultStyle();
        self.defaultStyle(jsonStyle);
      } else {
        jsonStyle = self.buildStyleFromRoot();
        self.defaultStyle(jsonStyle);
      }

      self.description(self._activeTemplateJson.description);
    }

    // Create the Style object, getting if needed the SharedConfiguration objects
    // & inheriting values from another style
    self._buildStyleObject = function(jsonStyle) {
      var jsonCompleteStyle = jsonStyle;

      if (jsonCompleteStyle.basedOn != undefined) {
        var baseStyle = self._getStyleFromKey(jsonCompleteStyle.basedOn);
        baseStyle = self._buildStyleObject(baseStyle);

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

    self._getStyleFromKey = function(key) {

      return _.find(self.jsonStylesList(), function(o) {
        return o.key == key;
      });
    }

    self.getDefaultStyle = function() {
      var defaultStyle = null;
      for (var iStyle = 0; iStyle < self.jsonStylesList().length; iStyle++) {
        if (defaultStyle == null) {
          defaultStyle = self.jsonStylesList()[iStyle];
        }
        if (self.jsonStylesList()[iStyle].isDefault) {
          defaultStyle = self.jsonStylesList()[iStyle];
          break;
        }
      }

      return defaultStyle;
    }

    self.stylesForCard = ko.pureComputed(function() {
      var cardStyles = [ ];
      cardStyles.push({ key: '', text: '<Use default style defined for the template>' });
      _.forEach(self.jsonStylesList(), function(stl) {
        cardStyles.push({ key: stl.key, text: stl.name });
      })

      return cardStyles;
    });

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

    //self.setTemplate = function(jsonCode) {
    //  self._activeTemplateJson = jsonCode;
    //  self.initTemplateFromJson();
    //}

    self.canvasWidth = function() {
      var style = self._styleForCard();
      if (style != null) return style.canvasWidth;
      console.log('canvas width accessed');
      return 0;
    }
    self.canvasHeight = function() {
      var style = self._styleForCard();
      if (style != null) return style.canvasHeight;
      return 0;
    }

    self.createNewCard = function() {
      return self._styleForCard().createNewCard();
    }

    self.updateFieldsOfCard = function(card) {
      self._styleForCard(card).updateFieldsOfCard(card);
    }

    /* --- Selection of a Style --- */
    self.activateStyleSelection = function() {
      self.isStyleSelectionActive(true);
    }
    self.cancelStyleSelection = function() {
      self.selectedStyle(self.defaultStyle());
      self.isStyleSelectionActive(false);
    }
    self.confirmStyleSelection = function() {
      self.defaultStyle(self.selectedStyle());
      self.isStyleSelectionActive(false);
    }

    self._styleForCard = function(cardVM) {
      // Object initiatlization
      if (self.styleVM == null) {
        return null;
      }

      // Which style to apply to the card
      if ((cardVM == null) || (cardVM.selectedStyleKey() == null) || (cardVM.selectedStyleKey() == ''))
      {
        var completeJsonStyle = self._buildStyleObject(self.defaultStyle());
        self.styleVM.initStyleFromCode(completeJsonStyle);
      } else {
        // Style from card
        console.log('style from card');
        var jsonCardStyle = self._getStyleFromKey(cardVM.selectedStyleKey());
        if (jsonCardStyle == null) {
          jsonCardStyle = self.defaultStyle();
        }
        var completeJsonStyle = self._buildStyleObject(jsonCardStyle);
        self.styleVM.initStyleFromCode(completeJsonStyle);
      }

      return self.styleVM;
    }

    /********************************/
    /* End of Functions declaration */
    /********************************/

    self.defaultStyle.subscribe(function (newValue) {
      self.selectedStyle(newValue);
    }, self);

    self._activeTemplateJson = jsonTemplate;
    self.styleVM = StyleVM.newStyleVM({ }, self.updateCanvasSize, self.updateCards, self.updateFieldsOfCard);

    self.initTemplateFromJson();
  }

  return {
    newCardTemplateVM: function(jsonTemplate, updCanvasSize, updCardsOnTemplateChange)
    {
      return new cardTemplateVM(jsonTemplate, updCanvasSize, updCardsOnTemplateChange);
    }
  }
});
