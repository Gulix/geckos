define(["knockout", "moment", "viewModels/datastorage/datastorage", "viewModels/messagebar"  ],
  function(ko, moment, DataStorage, MessageBar) {

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

    self.quickSaveDeckId = null;
    self.messageBar = MessageBar.getMessageBar();

    /********************************/
    /* End of Variables declaration */
    /********************************/

    self.showModal = function() {
      self.initModal();
      self.isModalVisible(true);

      self.engineVM.menu.hideLoadSave();
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
      if (self.newDeckName().length <= 0) {
        self.messageBar.showError("You must provide a name to your template.");
      } else {
        var tplKey = engineVM.getActiveTemplateKey();
        var cardsData = self.engineVM.getListOfCardsAsJson();
        var name = self.newDeckName();
        DataStorage.saveDeckAsNew(cardsData, tplKey, self.newDeckName());

        self.initModal();

        var strMessage = "<strong>" + name +"</strong> has been created and saved correctly.<br />";
        self.messageBar.showSuccess(strMessage);
      }
    }

    self.loadSelectedDeck = function() {
      if (self.selectedDeck() != null) {
        if ((self.selectedDeck().cardsData == null) || (self.selectedDeck().cardsData.constructor !== Array)) {
          self.messageBar.showError("Nothing retrieved from the localStorage");
        } else {
          self.engineVM.importList(self.selectedDeck().cardsData);
          self.quickSaveDeckId = self.selectedDeck().uniqueId;

          var nbCards = self.selectedDeck().cardsData.length;
          var strMessage = "<strong>" + self.selectedDeck().name +"</strong> has been loaded correctly.<br />"
            + "This deck contains <strong>" + nbCards + (nbCards > 1 ? " cards" : " card") + "</strong>.";
          self.messageBar.showSuccess(strMessage);
        }
      } else {
        self.messageBar.showWarning("You must select a deck to load.");
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

        return deck.name;
      }

      return "";
    }

    self.quickSave = function() {
      if (self.quickSaveDeckId != null) {
        var name = self.updateDeckWithCurrent(self.quickSaveDeckId);
        if (name == "") {
          name = "'&lt;noname&gt;'";
        }

        var strMessage = "The current cards have been saved as the deck <strong>" + name +"</strong>.";
        self.engineVM.generalMessageBar.showSuccess(strMessage);
      } else {
        var strMessage = "You first need to load a deck in order to quick save it.<br />"
          + "Open up the <em>'Save / Load'</em> box in order to load a deck, or use the <em>'Quick load'</em> action to load the last updated one.";
        self.engineVM.generalMessageBar.showWarning(strMessage);
      }

      self.engineVM.menu.hideLoadSave();
    }

    self.quickLoad = function() {
      self.initModal(); // Maybe restraining to only useful objects ?
      if (self.listOfDecks().length > 0) {
        var loadedDeck = self.listOfDecks()[0];
        self.quickSaveDeckId = loadedDeck.uniqueId;
        self.engineVM.importList(loadedDeck.cardsData);

        var strMessage = "<strong>" + loadedDeck.name +"</strong> has been loaded correctly.<br />";
        if (loadedDeck.lastUpdateTime != null) {
          strMessage += "The deck was last updated on <em>" + moment(loadedDeck.lastUpdateTime).format('DD/MM/YYYY') + "</em>.<br />";
        }
        strMessage += "The deck was created on <em>" + moment(loadedDeck.uniqueId).format('DD/MM/YYYY') + "</em>.";
        self.engineVM.generalMessageBar.showInfo(strMessage);

      } else {
        self.engineVM.generalMessageBar.showWarning("There is no deck to load for this template.");
      }

      self.engineVM.menu.hideLoadSave();
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
