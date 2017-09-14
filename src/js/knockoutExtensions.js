define(['knockout', 'jscolor', 'simplecolorpicker', 'ddslick', 'ckeditor', 'jQuery'], function(ko, jscolor, simplecolorpicker) {

  /*************************/
  /* Binding with CKEditor */
  /*************************/
  ko.bindingHandlers.CKEDITOR = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var modelValue = ko.utils.unwrapObservable(valueAccessor()) || {};
      // Id of the element (found or generated)
      var id = $(element).attr('id');
      if(id == undefined || id == '') {
        $(element).attr('id','id_' + Math.floor(new Date().valueOf()));
        id = $(element).attr('id');
      }

      var editorElement = CKEDITOR.document.getById(id);
      editorElement.setHtml(modelValue);
      editorElement.setAttribute( 'contenteditable', 'true' );
      // Configuration needed for the EnterMode (not having breakline plus new paragraphs)

      var CKconfig = { };
      CKconfig.extraPlugins='panel,floatpanel,button,menu,menubutton,dialog,dialogui,panelbutton';

      if ((viewModel != null) && (viewModel.field != null))
      {
        // Adding the snippets to the Field
        if (viewModel.field.snippets != null) {
          CKconfig.extraPlugins += ',htmlbuttons';
          CKconfig.htmlbuttons = viewModel.field.snippets;
        }
        // Adding colors
        if ((viewModel.field.colored != null) && viewModel.field.colored) {

          CKconfig.colorButton_showBackground = false; 

          if ((viewModel.field.colors != null) && (viewModel.field.colors.length > 0)) {
            CKconfig.extraPlugins += ',colorbutton';
            CKconfig.colorButton_colors = viewModel.field.colors;
          } else {
            // All colors accepted
            CKconfig.extraPlugins += ',colorbutton,colordialog';
          }
        }
      }




      var editor = CKEDITOR.replace(id, CKconfig);
      editor.on( 'change', function( evt ) {

        var observable;
        var content = ko.utils.unwrapObservable(valueAccessor()) || {};

        if (content.data != undefined) {
            observable = valueAccessor().data;
        } else {
            observable = valueAccessor();
        }
        observable(evt.editor.getData());
      });


      /* Handle disposal if KO removes an editor
       * through template binding */
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        editor.updateElement();
        editor.destroy();
      });

    }
  };

});
