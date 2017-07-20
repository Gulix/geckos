define(["knockout"], function(ko) {

  /* Class helping to display correctly the menus that go horizontal */
  function menuManager() {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.isCardExportDisplayed = ko.observable(false);
    self.isLoadSaveDisplayed = ko.observable(false);

    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.displayCardExport = function() { self.isCardExportDisplayed(true); }
    self.hideCardExport = function() { self.isCardExportDisplayed(false); }
    self.toggleCardExport = function() { self.isCardExportDisplayed(!self.isCardExportDisplayed()); }
    self.isCardExportHidden = ko.computed(function() { return !self.isCardExportDisplayed(); });

    self.displayLoadSave = function() { self.isLoadSaveDisplayed(true); }
    self.hideLoadSave = function() { self.isLoadSaveDisplayed(false); }
    self.toggleLoadSave = function() { self.isLoadSaveDisplayed(!self.isLoadSaveDisplayed()); }
    self.isLoadSaveHidden = ko.computed(function() { return !self.isLoadSaveDisplayed(); });

    /********************************/
    /* End of Functions declaration */
    /********************************/


  }

  return {
    newMenuManager: function()
    {
      return new menuManager();
    }
  }
});
