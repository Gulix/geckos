define(['knockout', 'jQuery'], function(ko) {

  /* Allows to bind a canvas for FabricJS, with the Json Generated template value */
  ko.bindingHandlers.fabric = {

      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var viewModel = bindingContext.$data;
          var jsonValue = viewModel.generatedTemplate();
          var canvas = viewModel.canvas;
          var cardSize = viewModel.canvasSizeForCurrentCard();
          if (viewModel.cardTemplate() != null)
          {
            if ((canvas.width != cardSize.width)
               || (canvas.height != cardSize.height))
            {
              canvas.setWidth(cardSize.width);
              canvas.setHeight(cardSize.height);
            }
          }

          canvas.loadFromJSON(jsonValue, canvas.renderAll.bind(canvas));
      }
  };

});
