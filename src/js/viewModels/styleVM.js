define(["knockout", "utils", "viewModels/cardVM"], function(ko, utils, CardVM) {

  function styleVM(jsonStyle, updCanvasSize, updCardsOnTemplateChange, cardFieldsUpdate) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.fields = ko.observableArray([ ]);
    self.canvasFields = ko.observableArray([ ]);

    self.canvasBackground = ko.observable();
    self.canvasWidth = null;
    self.canvasHeight = null;

    self.currentTemplate = ko.observable();

    self.sharedConfiguration = { };
    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.updateCanvasSize = updCanvasSize;
    self.updateCards = updCardsOnTemplateChange;
    self.cardFieldsUpdate = cardFieldsUpdate;

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

    self.initStyleFromCode = function(jsonCode) {
      if (jsonCode != null) {
        self.fields(jsonCode.fields);

        self.sharedConfiguration.sharedOptions = jsonCode.sharedOptions;

        if (jsonCode.canvasFields != null) {
          self.canvasFields(jsonCode.canvasFields);
        } else {
          self.canvasFields([ ]);
        }


        self.canvasBackground(jsonCode.canvasBackground);
        self.canvasWidth = jsonCode.canvasWidth;
        self.canvasHeight = jsonCode.canvasHeight;

        // Updating the cards, the canvas
        self.updateCards();
        self.updateCanvasSize();
      }
    }

    self.onCardStyleChanged = function(card) {
      self.cardFieldsUpdate(card);
    }

    self.createNewCard = function() {
      return CardVM.newCardVM(self.fields(), self.sharedConfiguration, self.onCardStyleChanged);
    }
    self.updateFieldsOfCard = function(card) {
      if (card != null) {
        console.log('styleVM.updateFieldsOfCard');
        card.updateFields(self.fields(), self.sharedConfiguration);
      }
    }
    /********************************/
    /* End of Functions declaration */
    /********************************/

    self.initStyleFromCode(jsonStyle);
  }

  return {
    newStyleVM: function(jsonStyle, updCanvasSize, updCardsOnTemplateChange, cardFieldsUpdate)
    {
      return new styleVM(jsonStyle, updCanvasSize, updCardsOnTemplateChange, cardFieldsUpdate);
    }
  }
});
