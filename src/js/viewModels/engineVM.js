define(['knockout',
        'fabric',
        'viewModels/field-factory',
        'viewModels/cardVM'
      ], function(ko, fabric, FieldFactory, CardVM) {

  function engineVM(cardTemplateVM) {
    var self = this;

    self.canvas = new fabric.StaticCanvas('fabricjs-canvas');

    /* Card Template */
    self.cardTemplate = ko.observable(cardTemplateVM);
    self.canvas.setWidth(self.cardTemplate().canvasWidth());
    self.canvas.setHeight(self.cardTemplate().canvasHeight());

    /* Fields to edit the card value */
    var fields = [];
    for (var iField = 0; iField < self.cardTemplate().fields().length; iField++) {
      fields.push(FieldFactory.buildField(self.cardTemplate().fields()[iField]));
    }
    self.editableFields = ko.observableArray(fields);

    /* List of Editable Card */
    self.listCards = ko.observableArray([]);
    self.listCards().push(CardVM.newObject(self.editableFields(), self.cardTemplate().fields()));
    self.editableCard = ko.observable(self.listCards()[0]);
    self.isCardSelected = ko.pureComputed(function() {
      return self.editableCard() != null;
    })

    /* Updating all the cards when the template is updated */
    self.cardTemplate().updateCards = function() {
      for(var iCard = 0; iCard < self.listCards().length; iCard++) {
        self.listCards()[iCard].updateFields(self.cardTemplate().fields());
      }
    }
    self.cardTemplate().updateCanvas = function() {
      self.canvas.setWidth(self.cardTemplate().canvasWidth());
      self.canvas.setHeight(self.cardTemplate().canvasHeight());
    }

    /* Adding / Removing cards from the list */
    self.addNewCard = function() {
      var newCard = CardVM.newObject(self.editableFields(), self.cardTemplate().fields());
      self.listCards.push(newCard);
      self.editableCard(newCard);
    }
    self.removeSelectedCard = function() {
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

    /* Generated template */
    self.generatedTemplate = ko.pureComputed(function() {
      var jsonCanvas = self.cardTemplate().generateTemplate(self.editableCard());

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
        var card = CardVM.newObject(self.editableFields(), self.cardTemplate().fields());
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
    newObject: function(cardTemplate) { return new engineVM(cardTemplate); }
  }
});
