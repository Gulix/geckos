define(['knockout', 'config', 'lodash',
        'templates/load-templates',
        'viewModels/cardTemplateVM'],
  function(ko, config, _, Templates, CardTemplateVM) {
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
    // Visibility of the modes
    self.activeMode = ko.observable('');
    self.isListModeActive = ko.pureComputed(function() {
      return self.activeMode() == 'list';
    });
    self.isEditionModeActive = ko.pureComputed(function() {
      return self.activeMode() == 'edition';
    });
    // List of templates
    self.templates = [];
    // Selected / Current template
    self.currentTemplate = ko.observable(null);

    /*****************
     *** Functions ***
     *****************/
    // When selecting via the Carousel, this method is called to load the displayed template
    self.loadTemplateFromIndex = function(index)
    {
      self.currentTemplate().importTemplateFromJson(JSON.stringify(self.templates[index]));
      self.currentTemplate().setTemplate();
    }

    // Modes of the UI
    self.goListMode = function() { self.activeMode('list'); }
    self.goEditionMode = function() { self.activeMode('edition'); }
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
     self.activeMode(defaultMode);

     // List of templates
     if (self.isListModeEnabled) {
       self.templates = Templates.load();
     }

     // The default template
     if (self.isListModeActive()) {
       var jsonTemplate = self.templates[0];
       //self.currentTemplate(CardTemplateVM.newCardTemplateVM(jsonTemplate, self.updateCanvasSize, self.updateCardsFields);
       self.currentTemplate(CardTemplateVM.newCardTemplateVM(jsonTemplate, function() { }, function() { }));
     }
  }

  return {
    getUItemplates: function(engineVM)
      { return new UItemplates(engineVM); }
  }
});
