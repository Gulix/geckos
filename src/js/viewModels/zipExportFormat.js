define(['knockout'], function(ko) {

/***********************************************************************/
/* ViewModel for Exporting the Cards (unique or list, svg or png, ...) */
/***********************************************************************/
  function zipExportFormat(description, key, func) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/

    self.description = description;
    self.key = key;
    self.func = func;
    self.isSelected = ko.observable(false);

    /********************************/
    /* End of Variables declaration */
    /********************************/


    /*************************/
    /* Functions declaration */
    /*************************/
    self.attrCss = ko.computed(function() {
      var css = key;
      if (self.isSelected()) {
        css += " selected";
      }
      return css;
    })

    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    getFormat: function(description, key, func) {
      return new zipExportFormat(description, key, func);
    }
  }
});
