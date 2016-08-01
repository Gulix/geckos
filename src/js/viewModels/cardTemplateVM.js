define(["knockout", "utils", "viewModels/styleVM"], function(ko, utils, StyleVM) {

  function cardTemplateVM(jsonTemplate, updCanvasSize, updCardsOnTemplateChange) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.styleVM = ko.observable();

    self.currentTemplate = ko.observable();
    self.editableTemplate = ko.observable();
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

    self.resetTemplateCode = function() {
      self.editableTemplate(JSON.stringify(self.currentTemplate()));
    }
    self.saveTemplateAsJson = function() {
      var blob = new Blob([JSON.stringify(self.currentTemplate())], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "template.json"); // TODO : filename depending of name of template (if provided)
    }
    self.loadTemplate = function() {
      $("#file-load-template").click();
    }
    self.importTemplateFromJson = function(data) {
      self.editableTemplate(data);
    }

    /* Remove and Replace the fonts embedded in the template */
    self.updateEmbeddedFonts = function() {
      $('.canvas-fonts').remove();

      if ((self.currentTemplate() != null) && (self.currentTemplate().fonts != null)) {
        var canvasFontsStyle = document.createElement('style');
        canvasFontsStyle.setAttribute('class', 'canvas-fonts');
        for(var iFont = 0; iFont < self.currentTemplate().fonts.length; iFont++) {
          var currentFont = self.currentTemplate().fonts[iFont];
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

    self.initTemplateFromJson = function() {
      self.currentTemplate(JSON.parse(self.editableTemplate()));

      var jsonStyle = { };

      self.updateEmbeddedFonts();

      jsonStyle.fields = self.currentTemplate().fields;
      jsonStyle.sharedOptions = self.currentTemplate().sharedOptions;
      jsonStyle.canvasFields = self.currentTemplate().canvasFields;
      jsonStyle.canvasBackground = self.currentTemplate().canvasBackground;
      jsonStyle.canvasWidth = self.currentTemplate().canvasWidth;
      jsonStyle.canvasHeight = self.currentTemplate().canvasHeight;

      if (self.styleVM() != null)
      {
        self.styleVM().initStyleFromCode(jsonStyle);
      }
    }

    self.setTemplate = function() {
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

    self.editableTemplate(JSON.stringify(jsonTemplate));
    self.initTemplateFromJson();
  }

  return {
    newCardTemplateVM: function(jsonTemplate, updCanvasSize, updCardsOnTemplateChange)
    {
      return new cardTemplateVM(jsonTemplate, updCanvasSize, updCardsOnTemplateChange);
    }
  }
});
