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

    self.loadDefaultTemplate = function(key) {
      var tpl = _.find(self.objTemplates(), function(t) {
        if ((t != null) && (t.description() != null) && (t.description().key != null)) {
          return t.description().key == key;
        }
      });
      if (tpl != null) {
        self.selectedTemplate(tpl);
        self.setTemplate();
      }
    }

    self.selectTemplate = function() {
      self.selectedTemplate(this);
    }
    self.hasSelectedTemplate = ko.pureComputed(function() {
      return self.selectedTemplate() != null;
    });
    self.cancelSelectedTemplate = function() {
      self.selectedTemplate(null);
    }

    self.setTemplate = function() {
      self.uiTemplates.setTemplate();
      self.cancelSelectedTemplate();
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

    /*****************************
     *** Object Initialization ***
     *****************************/

     // List of templates
     self.jsonTemplates = Templates.load();
     self.objTemplates([ ]);
     _.forEach(self.jsonTemplates, function(tpl) {
       self.objTemplates.push(CardTemplateVM.newCardTemplateVM(tpl, function() { }, function() { }));
     });
  }

  return {
    getUI: function(uiTemplates, isActive)
      { return new UItemplatesList(uiTemplates, isActive); }
  }
});
