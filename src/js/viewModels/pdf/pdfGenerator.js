define(['knockout', 'pdfmake', 'viewModels/messagebar', 'viewModels/pdf/pdfConfig'],
  function(ko, pdfMake, MessageBar, pdfConfig) {

/***************************************************/
/* ViewModel for Exporting the Cards as a PDF file */
/***************************************************/
  function pdfGenerator(engineVM) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.mainEngineVM = engineVM;
    self.messageBar = MessageBar.getMessageBar();

    // Displaying the Modal Export Frame
    self.isModalDisplayed = ko.observable(false);
    self.indexCurrentExportedFile = ko.observable(-1);
    self.totalExportedFiles = ko.observable(-1);

    // Export configuration
    self.config = pdfConfig.getPdfConfig();

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
      if (self.mainEngineVM.cardTemplate() != null) {
        self.config.scale(1.0);
        self.config.setCardDimensions(self.mainEngineVM.cardTemplate().canvasWidth(), self.mainEngineVM.cardTemplate().canvasHeight());
      }
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
      var docDef = {  };
      docDef.pageOrientation = self.config.configIsLandscape() ? 'landscape' : 'portrait';
      docDef.pageSize = 'A4';
      docDef.pageMargins = [ 40, 60, 40, 60 ];
      var pageWidthContent = (self.config.configIsLandscape() ? 841.89 : 595.28) - 40*2;
      var pageHeightContent = (self.config.configIsLandscape() ? 595.28 : 841.89) - 60*2;
      var startX = 40;
      var startY = 60;
      var currentX = 0;
      var currentY = 0;
      var maxHeightInRow = 0;
      var margin = self.config.marginInPoints();
      docDef.content = [];

      _.forEach(self.listDataUrls, function(dataUrl) {
        var elementWidth = dataUrl.width * self.config.scale();
        var elementHeight = dataUrl.height * self.config.scale();
        var element = { image: dataUrl.dataUrl, width: elementWidth, height: elementHeight };

        // New Row !
        if ((currentX != 0) && ((currentX + elementWidth) > pageWidthContent)) {
          currentX = 0;
          currentY += margin + maxHeightInRow;
          maxHeightInRow = 0;
        }
        // New Page !
        if ((currentY != 0) && ((currentY + elementHeight) > pageHeightContent)) {
          currentY = 0;
          currentX = 0;
          element.pageBreak = 'before';
        }
        element.absolutePosition =  { x: startX + currentX, y: startY + currentY };
        docDef.content.push(element);

        currentX += margin + elementWidth;        
        maxHeightInRow = Math.max(maxHeightInRow, elementHeight);
      });

      pdfMake.createPdf(docDef).download();
      self.cancel();
    }

    self.cardToDataUrl = function() {
      if (self.mainEngineVM.editableCard() != null) {
        //var canvas = document.getElementById('fabricjs-canvas');
        var dataUrl = self.mainEngineVM.canvas.toDataURL({ format: 'png' });
        self.listDataUrls.push({
          dataUrl: dataUrl,
          width: 340,
          height: 495
        });
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
