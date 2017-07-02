define(['knockout', 'pdfmake'], function(ko, pdfMake) {

/***********************************************************************/
/* ViewModel for Exporting the Cards (unique or list, svg or png, ...) */
/***********************************************************************/
  function pdfGenerator(engineVM) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.mainEngineVM = engineVM;

    // Displaying the Modal Export Frame
    self.isModalDisplayed = ko.observable(false);
    self.indexCurrentExportedFile = ko.observable(-1);
    self.totalExportedFiles = ko.observable(-1);

    // Export currently in progress
    self.isExportInProgress = ko.observable(false);

    // Construction of PDF
    self.listDataUrls = [];

    /********************************/
    /* End of Variables declaration */
    /********************************/
    self.progressPercentage = ko.pureComputed(function() {
      var val100 = 100 * self.indexCurrentExportedFile() / self.totalExportedFiles();
      if (!Number.isInteger(val100)) {
        return val100.toFixed(2)
      }
      return val100;
    });

    self.exportActive = ko.computed(function() { return self.isExportInProgress(); });
    self.exportInactive = ko.computed(function() { return !self.isExportInProgress(); });
    self.estimatedTime = ko.computed(function() {
      return (self.mainEngineVM.listCards().length * 0.5) + "s";
    });

    /*************************/
    /* Functions declaration */
    /*************************/
    // Opens the Modal Box for Zip Generation
    self.showPdfModal = function() {
      self.mainEngineVM.menu.hideCardExport();
      self.isModalDisplayed(true);
      self.indexCurrentExportedFile(0);
      self.totalExportedFiles(self.mainEngineVM.listCards().length);
      self.isExportInProgress(false);
      self.listDataUrls = [];
    }
    self.cancel = function() {
      self.isModalDisplayed(false);
    }

    self.launchPdfGeneration = function() {
      self.isExportInProgress(true);
      self.exportSingleCardToDataUrl(0);
    }

    self.exportSingleCardToDataUrl = function(iCardIndex) {
      if ((iCardIndex >= 0) && (iCardIndex < self.mainEngineVM.listCards().length)) {

        self.indexCurrentExportedFile(iCardIndex);
        self.mainEngineVM.editableCard(self.mainEngineVM.listCards()[iCardIndex]);

        // Timeout is needed in order to ensure the canvas is fully loaded
        setTimeout(function() {
          self.cardToDataUrl();
          self.addDataUrlToList(iCardIndex);
        }, 500); // TODO - Need to find a better way to launch action when the canvas is ready
      } else if (iCardIndex >= self.mainEngineVM.listCards().length) {
        self.indexCurrentExportedFile(iCardIndex);
        self.integratesCardsIntoPdf();
      }
    }

    self.integratesCardsIntoPdf = function() {
      var docDef = { content: [] };
      _.forEach(self.listDataUrls, function(dataUrl) {
        docDef.content.push({ image: dataUrl, width: 250 });
      })
      pdfMake.createPdf(docDef).download();
      self.cancel();
    }

    self.cardToDataUrl = function() {
      if (self.mainEngineVM.editableCard() != null) {
        //var canvas = document.getElementById('fabricjs-canvas');
        var dataUrl = self.mainEngineVM.canvas.toDataURL({ format: 'png' });
        self.listDataUrls.push(dataUrl);
      }
    }

    self.addDataUrlToList = function(iCardIndex) {
      self.exportSingleCardToDataUrl(iCardIndex + 1);
    };

    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    getPdfGenerator: function(engineVM) {
      return new pdfGenerator(engineVM);
    }
  }
});
