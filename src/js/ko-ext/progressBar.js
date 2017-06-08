define(['knockout', 'jQuery'], function(ko) {

ko.bindingHandlers.progressBar = {
    init: function(element) {
      return { controlsDescendantBindings: true };
    },
    update : function(element, valueAccessor, bindingContext) {
      var options = ko.unwrap(valueAccessor());

      var value = options.value();

      var width = value + "%";

      $(element).addClass("progressBar");

      ko.applyBindingsToNode(element, {
        html : '<div data-bind="style: { width: \'' + width + '\' }"></div><div class="progressText" data-bind="text: \'' + value + ' %\'"></div>'
      });

      ko.applyBindingsToDescendants(bindingContext, element);
    }
  };

});
