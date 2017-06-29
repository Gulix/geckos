define(["knockout", "moment", "viewModels/datastorage/datastorage"  ], function(ko, moment, DataStorage) {

/*****************************************/
/* ViewModel for the Load/Save Modal Box */
/*****************************************/
  function loadsaveVM(engineVM) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.engineVM = engineVM;

    self.isModalVisible = ko.observable(false);
    self.listOfDecks = ko.observableArray([]);
    self.newDeckName = ko.observable('');
    self.selectedDeck = ko.observable(null);

    self.autoSaveDeckId = null;

    /********************************/
    /* End of Variables declaration */
    /********************************/

    self.showModal = function() {
      self.initModal();
      self.isModalVisible(true);
    }
    self.hideModal = function() {
      self.isModalVisible(false);
    }

    /*************************/
    /* Functions declaration */
    /*************************/
    self.initModal = function() {
      var tplKey = self.engineVM.getActiveTemplateKey();
      var decks = DataStorage.getDecksForTemplate(tplKey);
      decks = _.sortBy(decks, function(d) { return (d.lastUpdateTime != null) ? -d.lastUpdateTime : -d.uniqueId; });
      self.listOfDecks(decks);
      self.newDeckName('');
      self.selectedDeck(null);
    }

    self.saveCurrentDeckAsNew = function() {
      var tplKey = engineVM.getActiveTemplateKey();
      var cardsData = self.engineVM.getListOfCardsAsJson();
      DataStorage.saveDeckAsNew(cardsData, tplKey, self.newDeckName());

      self.initModal();
    }

    self.loadSelectedDeck = function() {
      if (self.selectedDeck() != null) {
        if ((self.selectedDeck().cardsData == null) || (self.selectedDeck().cardsData.constructor !== Array)) {
          alert("Nothing retrieved from the localStorage");
        } else {
          self.engineVM.importList(self.selectedDeck().cardsData);
          self.autoSaveDeckId = self.selectedDeck().uniqueId;
        }
      }
    }

    self.removeSelectedDeck = function() {
      if (self.selectedDeck() != null) {
        DataStorage.removeDeck(self.selectedDeck().uniqueId);

        self.initModal();
      }
    }

    self.updateSelectedDeckWithCurrent = function() {
      if (self.selectedDeck() != null) {

        self.updateDeckWithCurrent(self.selectedDeck().uniqueId);

        self.initModal();
      }
    }

    self.updateDeckWithCurrent = function(deckId) {
      var deck = _.find(self.listOfDecks(), function(d) { return d.uniqueId == deckId; });
      if (deck != null) {
        var cardsData = self.engineVM.getListOfCardsAsJson();
        deck.cardsData = cardsData;
        deck.lastUpdateTime = moment().valueOf();
        DataStorage.updateDeck(deck);
      }
    }

    self.autoSave = function() {
      if (self.autoSaveDeckId != null) {
        self.updateDeckWithCurrent(self.autoSaveDeckId);
      }
    }

    self.autoLoad = function() {
      self.initModal(); // Maybe restraining to only useful objects ?
      if (self.listOfDecks().length > 0) {
        self.autoSaveDeckId = self.listOfDecks()[0].uniqueId;
        self.engineVM.importList(self.listOfDecks()[0].cardsData);
      }
    }

    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    getVM: function(engineVM) {
      return new loadsaveVM(engineVM);
    }
  }
});
