define(['knockout', 'config', 'lodash',
        'templates/load-templates',
        'viewModels/cardTemplateVM'],
  function(ko, config, _, Templates, CardTemplateVM) {
  /**
   * Used to manage the "List of Templates" part of the UI
   * Stored as an object in the UItemplates object
   */
  function UItemplatesEdition(uiTemplatesMain, isActive) {
    var self = this;

    /****************************
     *** Variables Definition ***
     ****************************/
    // Parent object
    self.uiTemplates = uiTemplatesMain; // TODO : Remove if not used (currently not used)
    // Selected / Current template
    self.selectedTemplate = ko.observable(null);

    self._editableJson = ko.observable();

    /*****************
     *** Functions ***
     *****************/
    // Reset the editable json code to the current template json code
    self.reset = function() {
       self._editableJson(JSON.stringify(self.selectedTemplate().getJson()));
    }
    // Puts the editable code into the current template
    self.useEditableCode = function() {
      // TODO : add tests on the code to check integrity
      self.selectedTemplate().setTemplate(JSON.parse(self._editableJson()));
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
     self.reset();
  }

  return {
    getUI: function(uiTemplates, isActive)
      { return new UItemplatesEdition(uiTemplates, isActive); }
  }
});
