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
    fields.push(new editableFieldVM(self.cardTemplate().fields()[iField]));
  }
  self.editableFields = ko.observableArray(fields);

  /* List of Editable Card */
  self.listCards = ko.observableArray([]);
  self.listCards().push(new cardVM(self.editableFields(), self.cardTemplate().fields()));
  self.editableCard = ko.observable(self.listCards()[0]);

  /* Updating all the cards when the template is updated */
  self.cardTemplate().updateCards = function() {
    for(var iCard = 0; iCard < self.listCards().length; iCard++) {
      self.listCards()[iCard].updateFields(self.cardTemplate().fields());
    }
  }

  /* Adding / Removing cards from the list */
  self.addNewCard = function() {
    var newCard = new cardVM(self.editableFields(), self.cardTemplate().fields());
    self.listCards.push(newCard);
    self.editableCard(newCard);
  }
  self.removeSelectedCard = function() {
    if (self.editableCard() != null) {
      self.listCards.remove(self.editableCard());
    }
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
      var card = new cardVM(self.editableFields(), self.cardTemplate().fields());
      card.loadFromJson(jsonData[cardData]);
      cards.push(card);
    }
    self.listCards(cards);
    if (cards.length > 0) {
      self.editableCard(cards[0]);
    }
  }

  /* Visibility of items in the upper part */
  self.upperPartVisible = ko.observable('template');
  self.isCardsListVisible = ko.pureComputed(function() {
    return self.upperPartVisible() == 'cardslist';
  })
  self.isTemplateSelectionVisible = ko.pureComputed(function() {
    return self.upperPartVisible() == 'template';
  })
  self.showTemplateSelection = function() { self.upperPartVisible('template'); }
  self.showCardsList = function() { self.upperPartVisible('cardslist'); }

  /* Header title (depending on what is visible) */
  self.headerSectionTitle = ko.pureComputed(function() {
    if (self.isCardsListVisible()) { return "List of Cards"; }
    if (self.isTemplateSelectionVisible()) { return "Template"; }
    return "Header";
  });

}
