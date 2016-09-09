define(['knockout', 'config', 'lodash',
        'templates/load-templates',
        'viewModels/cardTemplateVM',
        'viewModels/UItemplatesList',
        'viewModels/UItemplatesEdition'],
  function(ko, config, _, Templates, CardTemplateVM, uiList, uiEdition) {
  /**
   * Used to manage the "Templates" part of the UI
   * Stored as an object in the EngineVM main object
   * List & Edition modes are set here
   * This part will also set the current template used in the other parts of the application
   */
  function UItemplates(engineVM) {
    var self = this;

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
    self.goListMode = function() { if (self.uiList() != null) self.uiList().isActive(true); }
    self.goEditionMode = function() { if (self.uiEdition() != null) self.uiEdition().isActive(true); }
    self.isGoListModeVisible = ko.pureComputed(function() {
      return self.isListModeEnabled && !self.isListModeActive();
    });
    self.isGoEditionModeVisible = ko.pureComputed(function() {
      return self.isEditionModeEnabled && !self.isEditionModeActive();
    });

    // Set the currentTemplate as the one being used in the Engine
    self.setTemplate = function() {
      self.engineVM.cardTemplate().editableTemplate(self.currentTemplate().editableTemplate());
      self.engineVM.cardTemplate().setTemplate();
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
        // Do something
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
     if (!_.includes(['list', 'edition'], config.templates.defaultMode)) {
       defaultMode = self.isEditionModeEnabled ? 'edition' : 'list';
     }
     // The two modes
     self.uiList(uiList.getUI(self, defaultMode == 'list'));
  }

  return {
    getUItemplates: function(engineVM)
      { return new UItemplates(engineVM); }
  }
});
