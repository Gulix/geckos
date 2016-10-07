define(['knockout', 'jQuery'], function(ko) {

  /* Allows to bind a canvas for FabricJS, with the Json Generated template value */
  ko.bindingHandlers.fabric = {

      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var viewModel = bindingContext.$data;
          var jsonValue = viewModel.generatedTemplate();
          var canvas = viewModel.canvas;
          canvas.loadFromJSON(jsonValue, canvas.renderAll.bind(canvas));
      }
  };

});
