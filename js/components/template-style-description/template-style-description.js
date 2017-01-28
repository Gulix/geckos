define([], function(ko) {

  function templateStyleDescription(params) {
    var self = this;

    self.currentTemplate = params.templateVM;
  }

  return templateStyleDescription;
});
