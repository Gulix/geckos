define(['knockout',
        'fabric',
        'viewModels/field-factory',
        'viewModels/cardTemplateVM',
        'viewModels/UItemplates',
        'viewModels/exportVM',
        'viewModels/menuManager',
        'viewModels/datastorage/loadsaveVM',
        'viewModels/messagebar',
        'viewModels/pdf/pdfGenerator',
        'FileSaver'
      ], function(ko, fabric, FieldFactory, CardTemplateVM, UITemplates, Export, MenuManager, LoadSaveVM, MessageBar, PdfGenerator) {

/***************************************/
/* Main entry point of the application */
/***************************************/
  function engineVM() {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.cardTemplate = ko.observable(null);
    self.listCards = ko.observableArray([]);
    self.editableCard = ko.observable(null);
    self.exportVM = Export.loadExportVM(self);
    self.loadsaveVM = LoadSaveVM.getVM(self);
    self.menu = MenuManager.newMenuManager();
    self.generalMessageBar = MessageBar.getMessageBar();
    self.pdfGenerator = PdfGenerator.getPdfGenerator(self);

    self.isCardSelected = ko.pureComputed(function() {
      return self.editableCard() != null;
    });
    self.isTemplateLoaded = ko.pureComputed(function() {
      return self.cardTemplate() != null;
    })

    self.generatedTemplate = ko.pureComputed(function() {
      var jsonCanvas = { };
      if (self.isCardSelected() && (self.cardTemplate() != null)) {
        jsonCanvas = self.cardTemplate().generateTemplate(self.editableCard());
      }

      return jsonCanvas;
    });
    self.canvasSizeForCurrentCard = function() {
      if ((self.cardTemplate() != null) && (self.editableCard() != null)) {
        var cardStyle = self.cardTemplate()._styleForCard(self.editableCard());
        return { height: cardStyle.canvasHeight, width: cardStyle.canvasWidth };
      }
      return { height: 0, width: 0 };
    }

    self.UItemplates = ko.observable(null);

    self.getActiveTemplateKey = ko.computed(function() {
      if ((self.cardTemplate() == null)
         || (self.cardTemplate().description() == null)) {
         return "";
      }
      return self.cardTemplate().description().key;
    });
    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.changeTemplate = function(newTemplate) {
      self.removeAllCardsFromDeck();
      newTemplate.updateCanvasSize = self.updateCanvasSize;
      newTemplate.updateCards = self.updateCardsFields;
      self.cardTemplate(newTemplate);
      self.updateCanvasSize();
    }

    self.updateCanvasSize = function() {
      console.log('engineVM.updateCanvasSize');
      if ((self.canvas != null) && (self.cardTemplate() != null)) {
        self.canvas.setWidth(self.cardTemplate().canvasWidth());
        self.canvas.setHeight(self.cardTemplate().canvasHeight());
      }
    }

    self.updateCardsFields = function() {
      for(var iCard = 0; iCard < self.listCards().length; iCard++) {
        self.cardTemplate().updateFieldsOfCard(self.listCards()[iCard]);
      }
    }

    self.createNewCard = function() {
      if (self.cardTemplate() != null) {
        return self.cardTemplate().createNewCard();
      }
      return null;
    }

    /* Adding / Removing cards from the list */
    self.addNewCard = function() {
      self.editableCard(null);
      var newCard = self.createNewCard();
      self.listCards.push(newCard);
      self.editableCard(newCard);
    }
    self.copyNewCard = function() {
      if (self.editableCard() != null) {
        var jsonCurrentCard = self.editableCard().getSavedData();
        self.editableCard(null);

        var newCard = self.createNewCard();
        newCard.loadFromJson(jsonCurrentCard);

        self.listCards.push(newCard);
        self.editableCard(newCard);
      }
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
      if (self.listCards().length <= 0) {
        self.generalMessageBar.showWarning("There is no cards to remove.");
      } else {
        self.removeAllCardsFromDeck();
        self.generalMessageBar.showInfo("All cards have been removed from the list.");
      }
    }

    self.removeAllCardsFromDeck = function() {
      self.editableCard(null);
      self.listCards.removeAll();
    }

    /* Import / Export data for list of cards */
    self.getListOfCardsAsJson = function() {
      var jsonData = [];
      _.forEach(self.listCards(), function(card) {
        jsonData.push(card.getSavedData());
      })
      return jsonData;
    }

    self.exportListToFile = function() {
      self.menu.hideLoadSave();
      var jsonData = self.getListOfCardsAsJson();
      var blob = new Blob([JSON.stringify(jsonData)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "listCards.json");
    }
    self.loadListFromFile = function() {
      self.menu.hideLoadSave();
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

    /*******************************/
    /*End of Functions declaration */
    /*******************************/

    /* Initialization of the FabricJS canvas object */
    self.canvas = new fabric.StaticCanvas('fabricjs-canvas');

    /* Initializing the UI parts */
    self.UItemplates(UITemplates.getUItemplates(self));

  }
  return {
    newEngineVM: function() { return new engineVM(); }
  }
});
