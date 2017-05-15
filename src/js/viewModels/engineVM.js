define(['knockout',
        'fabric',
        'jszip',
        'viewModels/field-factory',
        'viewModels/cardTemplateVM',
        'viewModels/UItemplates',
        'FileSaver'
      ], function(ko, fabric, jszip, FieldFactory, CardTemplateVM, UITemplates) {

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

    self.isCardSelected = ko.pureComputed(function() {
      return self.editableCard() != null;
    });

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
    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.changeTemplate = function(newTemplate) {
      self.clearList();
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
      self.editableCard(null);
      self.listCards.removeAll();
    }

    /* ------------------------ */
    /* --- Export functions --- */
    /* ------------------------ */

    /* Export the content of the Canvas as a PNG */
    /* TODO : Getting a dedicated object / function to export a card (template + data) as a PNG */

    // Get the currend card as a PNG file to save on the client computer
    self.exportAsPNG = function() {
      self.exportCurrentCardAsPNG(self.saveBlobOnComputer);
    }
    // Get the currend card as a SVG file to save on the client computer
    self.exportAsSVG = function() {
      self.exportCurrentCardAsSVG(self.saveBlobOnComputer);
    }
    // Get all the cards as a ZIP file of PNG files
    self.exportAllCardsToPngZip = function() {
      var zip = new jszip();
      self.exportSingleCardToZip(0, self.exportCurrentCardAsPNG, zip);
    }
    // Get all the cards as a ZIP file of SVG files
    self.exportAllCardsToSvgZip = function() {
      var zip = new jszip();
      self.exportSingleCardToZip(0, self.exportCurrentCardAsSVG, zip);
    }

    // Current selected card is exported in PNG
    // Following action with the generated blob depends on parameter
    self.exportCurrentCardAsPNG = function(actionOnBlob) {
      if (self.editableCard() != null) {
        var canvas = document.getElementById('fabricjs-canvas');
        canvas.toBlob(function(blob) {
          actionOnBlob(blob, self.editableCard().cardName() + ".png");
        });
      }
    }

    // Current selected card is exported in PNG
    // Following action with the generated blob depends on parameter
    self.exportCurrentCardAsSVG = function(actionOnBlob) {
      if (self.editableCard() != null) {
        if (self.canvas != null) {
          var svg = self.canvas.toSVG();
          var blob = new Blob([svg], {type: "image/svg+xml"});
          actionOnBlob(blob, self.editableCard().cardName() + ".svg");
        }
      }
    }

    // Save a blob (SVG or PNG) as a file on the computer
    self.saveBlobOnComputer = function(blob, fullCardName) {
      saveAs(blob, fullCardName);
    }


    self.exportSingleCardToZip = function(iCardIndex, exportBlob, zipper) {
      if ((iCardIndex >= 0) && (iCardIndex < self.listCards().length)) {
        self.editableCard(self.listCards()[iCardIndex]);

        // Timeout is needed in order to ensure the canvas is fully loaded
        setTimeout(function() {
          exportBlob(function(blob, fullCardName) { self.addBlobFileToZip(blob, iCardIndex, zipper, fullCardName, exportBlob); });
        }, 500); // TODO - Need to find a better way to launch action when the canvas is ready
      } else if (iCardIndex >= self.listCards().length) {
        zipper.generateAsync({type:"blob"})
          .then(function(content) {
            saveAs(content, "allMyCards.zip");
        });
      }
    }

    self.addBlobFileToZip = function(blob, iCardIndex, zipper, fullCardName, actionOnBlob) {
      // TODO - Check for 'same name' cards

      zipper.file(fullCardName, blob);
      self.exportSingleCardToZip(iCardIndex + 1, actionOnBlob, zipper);
    };

    /* ------------------------------- */
    /* --- End of Export functions --- */
    /* ------------------------------- */

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

    /*******************************/
    /*End of Functions declaration */
    /*******************************/

    /* Initialization of the FabricJS canvas object */
    self.canvas = new fabric.StaticCanvas('fabricjs-canvas');

    /* Initialization of the Card Template */
    //var cardTemplateVM = CardTemplateVM.newCardTemplateVM(jsonTemplate, self.updateCanvasSize, self.updateCardsFields);
    //self.cardTemplate(cardTemplateVM);
    //self.updateCanvasSize();

    /* Initializing the list with one item */
    //self.listCards().push(self.createNewCard());
    //self.editableCard(self.listCards()[0]);

    /* Initializing the UI parts */
    self.UItemplates(UITemplates.getUItemplates(self));

  }
  return {
    newEngineVM: function() { return new engineVM(); }
  }
});
