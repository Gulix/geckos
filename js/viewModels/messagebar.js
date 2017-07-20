define(["knockout"], function(ko) {

  /* Class helping to display a message as a top-bar in the UI */
  function messagebar() {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.message = ko.observable('');
    self.isError = ko.observable(false);
    self.isWarning = ko.observable(false);
    self.isInfo = ko.observable(false);
    self.isSuccess = ko.observable(false);

    self.isVisible = ko.observable(false);

    /********************************/
    /* End of Variables declaration */
    /********************************/

    /*************************/
    /* Functions declaration */
    /*************************/
    self.show = function() {
      self.isVisible(true);

      setTimeout(function(){
        self.isVisible(false);
      }, 5000);
    }

    self.showError = function(message) {
      self.message(message);
      self.isError(true);
      self.isWarning(false);
      self.isInfo(false);
      self.isSuccess(false);
      self.show();
    }

    self.showWarning = function(message) {
      self.message(message);
      self.isError(false);
      self.isWarning(true);
      self.isInfo(false);
      self.isSuccess(false);
      self.show();
    }

    self.showInfo = function(message) {
      self.message(message);
      self.isError(false);
      self.isWarning(false);
      self.isInfo(true);
      self.isSuccess(false);
      self.show();
    }

    self.showSuccess = function(message) {
      self.message(message);
      self.isError(false);
      self.isWarning(false);
      self.isInfo(false);
      self.isSuccess(true);
      self.show();
    }

    /********************************/
    /* End of Functions declaration */
    /********************************/


  }

  return {
    getMessageBar: function()
    {
      return new messagebar();
    }
  }
});
