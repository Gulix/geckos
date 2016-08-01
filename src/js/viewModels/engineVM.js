define(['knockout',
        'fabric',
        'viewModels/field-factory',
        'viewModels/cardVM',
        'viewModels/cardTemplateVM',
        'FileSaver'
      ], function(ko, fabric, FieldFactory, CardVM, CardTemplateVM) {

  function engineVM(jsonTemplate) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.cardTemplate = ko.observable(null);
    self.listCards = ko.observableArray([]);
    self.editableCard = ko.observable(null);
    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.updateCanvasSize = function() {
      if ((self.canvas != undefined) && (self.cardTemplate() != undefined)) {
        self.canvas.setWidth(self.cardTemplate().canvasWidth());
        self.canvas.setHeight(self.cardTemplate().canvasHeight());
      }
    }

    self.createNewCard = function() {
      return CardVM.newCardVM(self.cardTemplate().fields(), self.cardTemplate().sharedConfiguration);
    }

    /* Adding / Removing cards from the list */
    self.addNewCard = function() {
      var newCard = self.createNewCard();
      self.listCards.push(newCard);
      self.editableCard(newCard);
    }
    self.removeSelectedCard = function() {

      self.editableCard(self.listCards()[0]);

      if (self.editableCard() != null) {
        self.listCards.remove(self.editableCard());
        if (self.listCards().length > 0) {
          self.editableCard(self.listCards()[0]);
        } else {
          self.editableCard(null);
        }
      }
    }
    self.clearList = function() {
      self.editableCard(null);
      self.listCards.removeAll();
    }

    /*******************************/
    /*End of Functions declaration */
    /*******************************/

    /* Initialization of the FabricJS canvas object */
    self.canvas = new fabric.StaticCanvas('fabricjs-canvas');

    /* Initialization of the Card Template */
    var cardTemplateVM = CardTemplateVM.newObject(jsonTemplate, self.updateCanvasSize);
    self.cardTemplate(cardTemplateVM);
    self.updateCanvasSize();

    /* List of Editable Card */
    self.listCards().push(self.createNewCard());
    self.editableCard(self.listCards()[0]);
    self.isCardSelected = ko.pureComputed(function() {
      return self.editableCard() != null;
    })

    /* Updating all the cards when the template is updated */
    self.cardTemplate().updateCards = function() {
      for(var iCard = 0; iCard < self.listCards().length; iCard++) {
        self.listCards()[iCard].updateFields(self.cardTemplate().fields(), self.cardTemplate().sharedConfiguration);
      }
    }



    /* Generated template */
    self.generatedTemplate = ko.pureComputed(function() {
      var jsonCanvas = { };
      if (self.cardTemplate() != null) {
        jsonCanvas = self.cardTemplate().generateTemplate(self.editableCard());
      }

      return jsonCanvas;
    });

    /* Export of the Canvas */
    self.exportPng = function() {
      if (self.editableCard() != null) {

        var canvas = document.getElementById('fabricjs-canvas');
        canvas.toBlob(function(blob) {
          saveAs(blob, self.editableCard().cardName() + ".png");
        });
      }
    }


    /* Import / Export data for list of cards */
    self.exportList = function() {
      var jsonData = [ ];
      for(var iCard = 0; iCard < self.listCards().length; iCard++) {
        jsonData.push(self.listCards()[iCard].getSavedData());
      }
      var blob = new Blob([JSON.stringify(jsonData)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "listCards.json");
    }
    self.loadList = function() {
      $("#file-load-list").click();
    }
    self.importList = function(jsonData) {

      var cards = [];
      for(var cardData in jsonData) {
        var card = self.createNewCard();
        card.loadFromJson(jsonData[cardData]);
        cards.push(card);
      }
      self.listCards(cards);
      if (cards.length > 0) {
        self.editableCard(cards[0]);
      }
    }

  }
  return {
    newObject: function(jsonTemplate) { return new engineVM(jsonTemplate); }
  }
});
