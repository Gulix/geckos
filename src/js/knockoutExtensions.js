/*******************************************************************************/
/* wysihtml5 allows to bind a textarea to a text value, using wysihtml5 editor */
/* Based on https://github.com/nicholasjackson/knockoutjs-wysihtml5            */
/*******************************************************************************/
ko.bindingHandlers.wysihtml5 = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

        var options = {};
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};

       if (value.options) {
            ko.utils.extend(options, value.options);
            delete value.options;
        }

        // if the textarea has no id, generate one to keep wysihtml5 happy
        if($(element).attr('id') == undefined || $(element).attr('id') == '')
            $(element).attr('id','id_' + Math.floor(new Date().valueOf()));
        var idValue = $(element).attr('id');
        // toolbar creation
        var toolbarItem = document.createElement('div');
        toolbarItem.id = 'toolbar_' + idValue;
        toolbarItem.className = 'richtext-toolbar';
        // Bold action
        var boldItem = document.createElement('a');
        boldItem.setAttribute('data-wysihtml5-command', 'bold');
        boldItem.setAttribute('class', 'bold-command');
        toolbarItem.appendChild(boldItem);
        // Italic action
        var italicItem = document.createElement('a');
        italicItem.setAttribute('data-wysihtml5-command', 'italic');
        italicItem.setAttribute('class', 'italic-command');
        toolbarItem.appendChild(italicItem);

        options['toolbar'] = 'toolbar_' + idValue;
        $(element).parent().prepend(toolbarItem);

        // Creation of the control
        var editor = new wysihtml5.Editor(idValue, options);
        $(element).data("wysihtml5", editor);


        editor.on('change', function() {
          var observable;
          var content = ko.utils.unwrapObservable(valueAccessor()) || {};

          if (content.data != undefined) {
              observable = valueAccessor().data;
          } else {
              observable = valueAccessor();
          }
          var control = $(element).data("wysihtml5");
          if (control != undefined) {
            observable(control.getValue());
          }
        });

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        //
        var control = $(element).data("wysihtml5");
        if (control != undefined) {
          var content = ko.utils.unwrapObservable(valueAccessor()) || {};

          if (content.data != undefined) {
              control.setValue(valueAccessor().data(), false);
          } else {
              control.setValue(valueAccessor()(), false);
          }
        }

    }
};

/* Allows to bind a canvas for FabricJS, with the Json Generated template value */
ko.bindingHandlers.fabric = {

    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var viewModel = bindingContext.$data;
        var jsonValue = viewModel.generatedTemplate();
        var canvas = viewModel.canvas;
        canvas.loadFromJSON(jsonValue, canvas.renderAll.bind(canvas));
    }
};
