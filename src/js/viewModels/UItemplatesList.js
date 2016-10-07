define(['knockout', 'config', 'lodash',
        'templates/load-templates',
        'viewModels/cardTemplateVM'],
  function(ko, config, _, Templates, CardTemplateVM) {
  /**
   * Used to manage the "List of Templates" part of the UI
   * Stored as an object in the UItemplates object
   */
  function UItemplatesList(uiTemplatesMain, isActive) {
    var self = this;

    /****************************
     *** Variables Definition ***
     ****************************/
    // Parent object
    self.uiTemplates = uiTemplatesMain; // TODO : Remove if not used (currently not used)
    // List of templates
    self.templates = [];
    // Selected / Current template
    self.selectedTemplate = ko.observable(null);

    /*****************
     *** Functions ***
     *****************/
    // When selecting via the Carousel, this method is called to load the displayed template
    self.loadTemplateFromIndex = function(index)
    {
      self.selectedTemplate(CardTemplateVM.newCardTemplateVM(self.templates[index], function() { }, function() { }));
    }

    /***************************************************
     *** Methods needed for the calls in UItemplates ***
     ***************************************************/
    // State of the element
    self.isActive = ko.observable(isActive);
    // Current template for displaying Description & Preview
    self.currentTemplate = ko.pureComputed(function() {
      return self.selectedTemplate();
    })
    // Returns the JSON of the selected template
    self.getCurrentJSON = function() {
      if (self.selectedTemplate() != null) {
        return self.selectedTemplate().getJson();
      }
      return { };
    }

    /*****************************
     *** Object Initialization ***
     *****************************/

     // List of templates
     self.templates = Templates.load();
     var jsonTemplate = self.templates[0];
     self.selectedTemplate(CardTemplateVM.newCardTemplateVM(jsonTemplate, function() { }, function() { }));
  }

  return {
    getUI: function(uiTemplates, isActive)
      { return new UItemplatesList(uiTemplates, isActive); }
  }
});
