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
      console.log("Snippets ? " + ((viewModel != null) ? (viewModel.snippets != null ? "here are snippets !" : "no snippets") : "no viewModel"));
      console.log(JSON.stringify(viewModel));

      var editorElement = CKEDITOR.document.getById(id);
      editorElement.setHtml(modelValue);
      editorElement.setAttribute( 'contenteditable', 'true' );
      // Configuration needed for the EnterMode (not having breakline plus new paragraphs)

      var CKconfig = { };
      // Adding the snippets to the Field
      if ((viewModel != null) && (viewModel.field != null) && (viewModel.field.snippets != null))
      {
        CKconfig.htmlbuttons = viewModel.field.snippets;
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
