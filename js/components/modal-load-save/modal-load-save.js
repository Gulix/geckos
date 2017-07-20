define([], function(ko) {

  function modalLoadSave(params) {
    var self = this;

    self.viewModel = params.loadSaveVM;
  }

  return modalLoadSave;
});
