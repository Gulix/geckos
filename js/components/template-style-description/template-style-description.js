define([], function(ko) {

  function templateStyleDescription(params) {
    var self = this;

    self.currentTemplate = params.templateVM;
    self.engineVM = params.mainVM;
    self.isActive = false;
    if (params.isActive !== undefined) {
      self.isActive = params.isActive;
    }


    self.quickLoad = function() {
      self.engineVM.loadsaveVM.quickLoad();
    }
    self.showLoadSaveModal = function() {
      self.engineVM.loadsaveVM.showModal();
    }
  }

  return templateStyleDescription;
});
