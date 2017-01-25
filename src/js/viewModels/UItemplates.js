define(['knockout', 'config', 'lodash',
        'viewModels/cardTemplateVM',
        'viewModels/UItemplatesList',
        'viewModels/UItemplatesEdition'],
  function(ko, config, _, CardTemplateVM, uiList, uiEdition) {
  /**
   * Used to manage the "Templates" part of the UI
   * Stored as an object in the EngineVM main object
   * List & Edition modes are set here
   * This part will also set the current template used in the other parts of the application
   */
  function UItemplates(engineVM) {
    var self = this;

    /****************************
     *** Constants Definition ***
     ****************************/
    var _EDITION_MODE_KEY = 'edition';
    var _LIST_MODE_KEY = 'list';

    /****************************
     *** Variables Definition ***
     ****************************/
    // Geckos Engine
    self.engineVM = engineVM;
    // General configuration
    self.isListModeEnabled = config.templates.listMode;
    self.isEditionModeEnabled = config.templates.editionMode;
    // The modes
    self.uiList = ko.observable(null);
    self.uiEdition = ko.observable(null);
    self.updateCanvasSize = engineVM.updateCanvasSize;

    /*****************
     *** Functions ***
     *****************/
    self.getActiveMode = ko.pureComputed(function() {
      if ((self.uiList() != null) && self.uiList().isActive())
        return self.uiList();
      if ((self.uiEdition() != null) && self.uiEdition().isActive())
        return self.uiEdition();
      return null;
    });
    self.currentTemplate = ko.pureComputed(function() {
      if (self.getActiveMode() != null)
        return self.getActiveMode().currentTemplate();
      return null;
    });

    // Visibility of the modes
    self.isListModeActive = ko.pureComputed(function() {
      return (self.uiList() != null) && self.uiList().isActive();
    });
    self.isEditionModeActive = ko.pureComputed(function() {
      return (self.uiEdition() != null) && self.uiEdition().isActive();
    });

    // Modes of the UI
    self.goMode = function(keyMode) {
      if (self.uiList() != null) {
        self.uiList().isActive(keyMode == _LIST_MODE_KEY);
      }
      if (self.uiEdition() != null) {
        self.uiEdition().isActive(keyMode == _EDITION_MODE_KEY);
      }
    }
    self.goListMode = function() { self.goMode(_LIST_MODE_KEY); }
    self.goEditionMode = function() { self.goMode(_EDITION_MODE_KEY); }
    self.isGoListModeVisible = ko.pureComputed(function() {
      return self.isListModeEnabled && !self.isListModeActive();
    });
    self.isGoEditionModeVisible = ko.pureComputed(function() {
      return self.isEditionModeEnabled && !self.isEditionModeActive();
    });

    // Set the currentTemplate as the one being used in the Engine
    self.setTemplate = function() {
      self.engineVM.changeTemplate(self.currentTemplate());
      self.currentTemplate().updateEmbeddedFonts();
    }
    self.loadTemplate = function() {
      if ((self.uiEdition() != null) && self.uiEdition().isActive()) {
        // Do something
      }
    }
    self.saveTemplateAsJson = function() {
      if ((self.uiEdition() != null) && self.uiEdition().isActive()) {
        // Do something
      }
    }
    self.resetTemplateCode = function() {
      if ((self.uiEdition() != null) && self.uiEdition().isActive()) {
        self.uiEdition().reset();
      }
    }
    self.validateTemplateCode = function() {
      if ((self.uiEdition() != null) && self.uiEdition().isActive()) {
        self.uiEdition().validateTemplate();
      }
    }

    /*****************************
     *** Object Initialization ***
     *****************************/
     // We need that at least one of the modes is enabled
     if (!self.isListModeEnabled && !self.isEditionModeEnabled) {
       self.isEditionModeEnabled = true;
     }
     // Mode displayed by default
     var defaultMode = config.templates.defaultMode;
     if (!_.includes([_LIST_MODE_KEY, _EDITION_MODE_KEY], config.templates.defaultMode)) {
       defaultMode = self.isEditionModeEnabled ? _EDITION_MODE_KEY : _LIST_MODE_KEY;
     }
     // The two modes
     self.uiList(uiList.getUI(self, defaultMode == _LIST_MODE_KEY));
     self.uiEdition(uiEdition.getUI(self, defaultMode == _EDITION_MODE_KEY));
  }

  return {
    getUItemplates: function(engineVM)
      { return new UItemplates(engineVM); }
  }
});
