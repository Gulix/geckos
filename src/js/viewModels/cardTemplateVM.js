define(["knockout", "utils"], function(ko, utils) {

  function cardTemplateVM(jsonTemplate, updCanvasSize, updCardsOnTemplateChange) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.fields = ko.observableArray();
    self.canvasFields = ko.observableArray();

    self.canvasBackground = ko.observable();
    self.canvasWidth = ko.observable();
    self.canvasHeight = ko.observable();

    self.currentTemplate = ko.observable();
    self.editableTemplate = ko.observable();

    self.sharedConfiguration = { };
    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.updateCanvasSize = updCanvasSize;
    self.updateCards = updCardsOnTemplateChange;

    self.generateTemplate = function(cardVM) {
      var generated = { "objects" : [], "backgroundColor": self.canvasBackground() };

      if (cardVM != null) {
        for (var iObject = 0; iObject < self.canvasFields().length; iObject++) {
          var field = self.canvasFields()[iObject];
          var generatedObject = self.processObject(cardVM, field);
          generated.objects.push(generatedObject);
        }
      }

      return generated;
    }

    self.processObject = function(cardVM, jsonObject) {

      // No card associated : the jsonObject is returned as-is
      if (cardVM == null) {
        return jsonObject;
      }

      // A null value is returned as-is
      if (jsonObject === null) {
        return null;
      }
      // The object is an Array : the Array is rebuilt by processing each element of the Array
      // and then rebuilding the Array
      if (Array.isArray(jsonObject)) {
        var array = [];
        for(var iElement = 0; iElement < jsonObject.length; iElement++) {
          var itemValue = self.processObject(cardVM, jsonObject[iElement]);
          array.push(itemValue);
        }
        return array;
      }
      // The object is a Boolean : he's returned as-is
      if (typeof(jsonObject) == "boolean") {
        return jsonObject;
      }
      // The object is a number : he's returned as-is
      if (utils.isNumber(jsonObject)) {
        return jsonObject;
      }
      // The object is a string : it is processed with card values
      if (typeof(jsonObject) == "string") {
        return cardVM.processString(jsonObject);
      }
      // The object is a JSON object : each key-value is processed recursively
      if (typeof(jsonObject) == "object") {
        var generatedObject = { };
        for(var key in jsonObject) {
          generatedObject[key] = self.processObject(cardVM, jsonObject[key]);
        }
        return generatedObject;
      }

      return jsonObject;
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

      self.fields(self.currentTemplate().fields);

      self.sharedConfiguration.sharedOptions = self.currentTemplate().sharedOptions;

      self.canvasFields(self.currentTemplate().canvasFields);

      self.updateEmbeddedFonts();

      self.canvasBackground(self.currentTemplate().canvasBackground);
      self.canvasWidth(self.currentTemplate().canvasWidth);
      self.canvasHeight(self.currentTemplate().canvasHeight);

      // Updating the cards, the canvas
      self.updateCards();
      self.updateCanvasSize();
    }

    self.setTemplate = function() {
      self.initTemplateFromJson();
    }
    /********************************/
    /* End of Functions declaration */
    /********************************/
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
