define(['knockout', 'jQuery', 'owlCarousel'], function(ko) {

  /*******************************************************/
  /* Binding with owl.carousel for the list of templates */
  /*******************************************************/
  ko.bindingHandlers.templatesList = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var UItemplates = ko.utils.unwrapObservable(valueAccessor()) || {};

      // Id of the element (found or generated)
      var id = $(element).attr('id');
      if(id == undefined || id == '') {
        $(element).attr('id','id_' + Math.floor(new Date().valueOf()));
        id = $(element).attr('id');
      }

      $('#' + id).addClass('owl-carousel owl-theme');

      var nbTemplates = UItemplates.templates.length;

      //for (var i = 0; i < 4; i++)
      //{
      for (var iItem = 0; iItem < nbTemplates; iItem++) {
        var item = UItemplates.templates[iItem];
        $('#' + id).append("<div class='template-item'><div class='template-item-img'><img src='"
        + item.description.logo
        + "'></img></div><div class='template-item-title'>"
        + item.description.title
        + "</div><div class='template-item-description'>"
        + item.description.description
        + "</div></div>");
      }
      //}


      //var nbItems = itemsArray.length * 4;

      $('#' + id).owlCarousel(
        {
          center: true,
          loop: nbTemplates > 5,
          margin:10,
          nav:true,
          responsive:{
              0:{
                  items: 1
              },
              600:{
                  items: (3 <= nbTemplates) ? 3 : (nbTemplates - 1)
              },
              1000:{
                  items: (5 <= nbTemplates) ? 5 : (nbTemplates - 1)
              }
          }
        });
        $('#' + id).owlCarousel().on('changed.owl.carousel', function(event) {
          UItemplates.loadTemplateFromIndex(event.item.index);
        });
    }
  };

});
