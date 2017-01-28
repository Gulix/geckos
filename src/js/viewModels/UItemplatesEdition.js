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
    self.uiTemplates = uiTemplatesMain;
    // Compiled template
    self.compiledTemplate = ko.observable(null);

    self._editableJson = ko.observable();
    self.compilingErrors = ko.observableArray([]);

    self.isCompiledTemplateVisible = ko.observable(false);

    self.withCompilingErrors = ko.pureComputed(function() {
      return self.compilingErrors().length > 0;
    })
    /*****************
     *** Functions ***
     *****************/
    // Reset the editable json code to the current template json code
    self.reset = function() {
      if (self.compiledTemplate() != null) {
        self._editableJson(JSON.stringify(self.compiledTemplate().getJson()));
      }
    }
    // Puts the editable code into the current template
    self.validateTemplate = function() {
      self.compilingErrors([]);
      try {
        var jsonTemplate = JSON.parse(self._editableJson());
        var jsonTemplateSchema = Schemas.loadTemplateSchema();
        var ajv = Ajv(); // options can be passed, e.g. {allErrors: true}
        var validate = ajv.compile(jsonTemplateSchema);
        var valid = validate(jsonTemplate);
        if (!valid)
        {
          var errors = [];
          _.forEach(validate.errors, function(error) { errors.push(error.dataPath + ' - ' + error.message); })
          self.compilingErrors(errors);
        } else
        {
          self.compiledTemplate(CardTemplateVM.newCardTemplateVM(jsonTemplate, function() { }, function() { }));
          self.isCompiledTemplateVisible(true);
        }
      }
      catch(e) {
        self.compilingErrors([ e.message ]);
      }
    }

    self.setTemplate = function() {
      self.uiTemplates.setTemplate();
      self.isCompiledTemplateVisible(false);
    }

    self.cancelTemplateCompiledPreview = function()
    {
      self.isCompiledTemplateVisible(false);
    }
    /***************************************************
     *** Methods needed for the calls in UItemplates ***
     ***************************************************/
    // State of the element
    self.isActive = ko.observable(isActive);
    // Current template for displaying Description & Preview
    self.currentTemplate = ko.pureComputed(function() {
      return self.compiledTemplate();
    })

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
