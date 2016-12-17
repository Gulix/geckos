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
    self.jsonTemplates = [];
    self.objTemplates = ko.observableArray([ ]);
    // Selected / Current template
    self.selectedTemplate = ko.observable(null);

    /*****************
     *** Functions ***
     *****************/
    // When selecting via the Carousel, this method is called to load the displayed template
    self.loadTemplateFromIndex = function(index)
    {
      self.selectedTemplate(CardTemplateVM.newCardTemplateVM(self.jsonTemplates[index], function() { }, function() { }));
    }

    self.selectTemplate = function() {
      self.selectedTemplate(this);
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
     self.jsonTemplates = Templates.load();
     self.objTemplates([ ]);
     _.forEach(self.jsonTemplates, function(tpl) {
       self.objTemplates.push(CardTemplateVM.newCardTemplateVM(tpl, function() { }, function() { }));
     });
     var jsonTemplate = self.jsonTemplates[0];
     self.selectedTemplate(CardTemplateVM.newCardTemplateVM(jsonTemplate, function() { }, function() { }));
  }

  return {
    getUI: function(uiTemplates, isActive)
      { return new UItemplatesList(uiTemplates, isActive); }
  }
});
