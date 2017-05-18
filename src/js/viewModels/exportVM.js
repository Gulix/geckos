define(['jszip',
        'knockout',
        'FileSaver'
      ], function(jszip, ko) {

/***********************************************************************/
/* ViewModel for Exporting the Cards (unique or list, svg or png, ...) */
/***********************************************************************/
  function exportVM(engineVM) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.mainEngineVM = engineVM;

    // Displaying the Modal Export Frame
    self.isModalDisplayed = ko.observable(false);
    self.indexCurrentExportedFile = ko.observable(-1);
    self.totalExportedFiles = ko.observable(-1);

    self.listFileNames = [];

    /********************************/
    /* End of Variables declaration */
    /********************************/
    self.progress = ko.pureComputed(function() {
      return self.indexCurrentExportedFile() + " / " + self.totalExportedFiles();
    });

    /*************************/
    /* Functions declaration */
    /*************************/

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
      self.exportAllToZip(self.exportCurrentCardAsSVG);
    }
    // Get all the cards as a ZIP file of SVG files
    self.exportAllCardsToSvgZip = function() {
      self.exportAllToZip(self.exportCurrentCardAsSVG);
    }

    self.exportAllToZip = function(fnExportType) {
      var zip = new jszip();
      self.isModalDisplayed(true);
      self.indexCurrentExportedFile(0);
      self.totalExportedFiles(self.mainEngineVM.listCards().length);
      self.listFileNames = [];
      self.exportSingleCardToZip(0, fnExportType, zip);
    }

    // Current selected card is exported in PNG
    // Following action with the generated blob depends on parameter
    self.exportCurrentCardAsPNG = function(actionOnBlob) {
      if (self.mainEngineVM.editableCard() != null) {
        var canvas = document.getElementById('fabricjs-canvas');
        canvas.toBlob(function(blob) {
          var cardName = self.getUniqueFileName(self.mainEngineVM.editableCard().cardName());

          actionOnBlob(blob, cardName + ".png");
        });
      }
    }

    // Current selected card is exported in PNG
    // Following action with the generated blob depends on parameter
    self.exportCurrentCardAsSVG = function(actionOnBlob) {
      if (self.mainEngineVM.editableCard() != null) {
        if (self.mainEngineVM.canvas != null) {
          var svg = self.mainEngineVM.canvas.toSVG();
          var blob = new Blob([svg], {type: "image/svg+xml"});
          var cardName = self.getUniqueFileName(self.mainEngineVM.editableCard().cardName());

          actionOnBlob(blob, cardName + ".svg");
        }
      }
    }

    // Save a blob (SVG or PNG) as a file on the computer
    self.saveBlobOnComputer = function(blob, fullCardName) {
      saveAs(blob, fullCardName);
    }


    self.exportSingleCardToZip = function(iCardIndex, exportBlob, zipper) {
      if ((iCardIndex >= 0) && (iCardIndex < self.mainEngineVM.listCards().length)) {

        self.indexCurrentExportedFile(iCardIndex);
        self.mainEngineVM.editableCard(self.mainEngineVM.listCards()[iCardIndex]);

        // Timeout is needed in order to ensure the canvas is fully loaded
        setTimeout(function() {
          exportBlob(function(blob, fullCardName) { self.addBlobFileToZip(blob, iCardIndex, zipper, fullCardName, exportBlob); });
        }, 500); // TODO - Need to find a better way to launch action when the canvas is ready
      } else if (iCardIndex >= self.mainEngineVM.listCards().length) {
        zipper.generateAsync({type:"blob"})
          .then(function(content) {
            saveAs(content, "allMyCards.zip");
            self.isModalDisplayed(false);
        });
      }
    }

    self.addBlobFileToZip = function(blob, iCardIndex, zipper, fullCardName, actionOnBlob) {
      // TODO - Check for 'same name' cards

      zipper.file(fullCardName, blob);
      self.exportSingleCardToZip(iCardIndex + 1, actionOnBlob, zipper);
    };

    self.getUniqueFileName = function(cardName) {
      var currentName = cardName;
      var index = 0;
      while(_.some(self.listFileNames, function(f) {
          return f.toUpperCase() == currentName.toUpperCase();
        })
      )
      {
        index++;
        currentName = cardName + "(" + index + ")";
      }

      self.listFileNames.push(currentName);
      return currentName;
    }

    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    loadExportVM: function(engineVM) { return new exportVM(engineVM); }
  }
});
