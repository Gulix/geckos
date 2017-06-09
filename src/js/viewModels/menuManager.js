define(["knockout"], function(ko) {

  /* Class helping to display correctly the menus that go horizontal */
  function menuManager() {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.isCardExportDisplayed = ko.observable(false);

    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.displayCardExport = function() { self.isCardExportDisplayed(true); }
    self.hideCardExport = function() { self.isCardExportDisplayed(false); }
    self.toggleCardExport = function() { self.isCardExportDisplayed(!self.isCardExportDisplayed()); }

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
