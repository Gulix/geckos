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

    // Step of configuration
    self.currentStep = ko.observable(1);

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
      self.currentStep(1);
      self.totalExportedFiles(self.mainEngineVM.listCards().length);
      self.isExportInProgress(false);
      self.listDataUrls = [];
      if (self.mainEngineVM.cardTemplate() != null) {
        self.config.setCardDimensions(self.mainEngineVM.cardTemplate().canvasWidth(), self.mainEngineVM.cardTemplate().canvasHeight());
      }
    }
    self.cancel = function() {
      self.isModalDisplayed(false);
    }

    /********************/
    /* Steps Management */
    /********************/
    self.nextStep = function() {
      if (self.isFinalStep()) {
        self.launchPdfGeneration();
      } else if (self.currentStep() < 1) {
        self.currentStep(1);
      } else {
        self.currentStep(self.currentStep() + 1);
      }
    }
    self.previousStep = function() {
      if (self.currentStep() <= 1) {
        self.currentStep(1);
      } else {
        self.currentStep(self.currentStep() - 1);
      }
    }
    self.previousIsVisible = ko.computed(function() {
      return self.exportInactive() && (self.currentStep() != 1);
    });
    self.nextButtonTitle = ko.pureComputed(function() {
      return self.isFinalStep() ? "Generate PDF" : "Next";
    });
    self.isFinalStep = ko.pureComputed(function() {
      return self.currentStep() == 4;
    });
    self.isNotFinalStep = ko.pureComputed(function() {
      return !self.isFinalStep();
    });

    /***************************/
    /* End of Steps Management */
    /***************************/

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
      var pageMarginWidth = self.config.pageMarginValue();
      var pageMarginHeight = self.config.pageMarginValue();
      docDef.pageMargins = [ pageMarginWidth, pageMarginHeight, pageMarginWidth, pageMarginHeight ];
      var pageWidthContent = (self.config.configIsLandscape() ? 841.89 : 595.28) - pageMarginWidth*2;
      var pageHeightContent = (self.config.configIsLandscape() ? 595.28 : 841.89) - pageMarginHeight*2;
      var startX = pageMarginWidth;
      var startY = pageMarginHeight;
      var currentX = 0;
      var currentY = 0;
      var maxHeightInRow = 0;
      var paddingBetweenCards = self.config.paddingValue();
      docDef.content = [];

      _.forEach(self.listDataUrls, function(dataUrl) {
        var elementWidth = dataUrl.width * self.config.scaleX();
        var elementHeight = dataUrl.height * self.config.scaleY();
        var element = { image: dataUrl.dataUrl, width: elementWidth, height: elementHeight };

        // New Row !
        if ((currentX != 0) && ((currentX + elementWidth) > pageWidthContent)) {
          currentX = 0;
          currentY += paddingBetweenCards + maxHeightInRow;
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

        currentX += paddingBetweenCards + elementWidth;
        maxHeightInRow = Math.max(maxHeightInRow, elementHeight);
      });

      docDef.footer = "PDF generated by Geckos <http://www.github.com/gulix/geckos>";

      pdfMake.createPdf(docDef).download();
      self.cancel();
    }

    self.cardToDataUrl = function() {
      if (self.mainEngineVM.editableCard() != null) {
        //var canvas = document.getElementById('fabricjs-canvas');
        var dataUrl = self.mainEngineVM.canvas.toDataURL({ format: 'png' });
        self.listDataUrls.push({
          dataUrl: dataUrl,
          width: self.mainEngineVM.canvas.width,
          height: self.mainEngineVM.canvas.height
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
