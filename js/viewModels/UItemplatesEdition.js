define(['knockout', 'config', 'lodash', 'ajv',
        'templates/load-templates',
        'viewModels/cardTemplateVM',
        'json/load-schemas'],
  function(ko, config, _, Ajv, Templates, CardTemplateVM, Schemas) {
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
    self.compilingErrors = ko.observableArray([]);


    self.withCompilingErrors = ko.pureComputed(function() {
      return self.compilingErrors().length > 0;
    })
    /*****************
     *** Functions ***
     *****************/
    // Reset the editable json code to the current template json code
    self.reset = function() {
      if (self.selectedTemplate() != null) {
        self._editableJson(JSON.stringify(self.selectedTemplate().getJson()));
      }
    }
    // Puts the editable code into the current template
    self.validateTemplate = function() {
      self.compilingErrors([]);
      var jsonTemplate = JSON.parse(self._editableJson());
      var jsonTemplateSchema = Schemas.loadTemplateSchema();
      var ajv = Ajv(); // options can be passed, e.g. {allErrors: true}
      var validate = ajv.compile(jsonTemplateSchema);
      var valid = validate(jsonTemplate);
      if (!valid)
      {
        self.compilingErrors(validate.errors);
      } else
      {
        self.selectedTemplate(CardTemplateVM.newCardTemplateVM(jsonTemplate, function() { }, function() { }));
      }
    }

    self.setTemplate = function() {
      self.uiTemplates.setTemplate();
      $('html, body').animate({
        scrollTop: $("#active-template-description-header").offset().top
      }, 500);
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
     self._editableJson(JSON.stringify(jsonTemplate));
  }

  return {
    getUI: function(uiTemplates, isActive)
      { return new UItemplatesEdition(uiTemplates, isActive); }
  }
});
