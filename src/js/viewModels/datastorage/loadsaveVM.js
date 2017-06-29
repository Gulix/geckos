define(["knockout", "viewModels/datastorage/datastorage"  ], function(ko, DataStorage) {

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
      self.listOfDecks(DataStorage.getDecksForTemplate(tplKey));
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
        }
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
