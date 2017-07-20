define([], function(ko) {

  function modalPdfExport(params) {
    var self = this;

    self.viewModel = params.pdfGenerator;
  }

  return modalPdfExport;
});
