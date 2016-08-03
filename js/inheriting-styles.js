define(['utils'], function(Utils) {

  // Create a Style object, based on another style
  function getStyleFromBase(heritingStyle, heritedStyle) {
    var builtStyle = { };

    // Basic properties
    builtStyle.name = (heritingStyle.name == undefined) ? heritedStyle.name : heritingStyle.name;
    builtStyle.description = (heritingStyle.description == undefined) ? heritedStyle.description : heritingStyle.description;
    builtStyle.canvasBackground = (heritingStyle.canvasBackground == undefined) ? heritedStyle.canvasBackground : heritingStyle.canvasBackground;
    builtStyle.canvasWidth = (heritingStyle.canvasWidth == undefined) ? heritedStyle.canvasWidth : heritingStyle.canvasWidth;
    builtStyle.canvasHeight = (heritingStyle.canvasHeight == undefined) ? heritedStyle.canvasHeight : heritingStyle.canvasHeight;

    // Fields, identified by 'name'
    builtStyle.fields = [ ]; // TODO : need to think about an 'order of fields' with this inheritance
    // Adding all the fields existing in the heritedStyle (modified by the heritingStyle, if needed)
    for(var iHeritedField = 0; iHeritedField < heritedStyle.fields.length; iHeritedField++) {
      var heritedField = Utils.clone(heritedStyle.fields[iHeritedField]);
      var heritingField = getFieldByName(heritingStyle.fields, heritedField.name);
      if (heritingField == null) {
        // Field not modified by heritingStyle
        builtStyle.fields.push(heritedField);
      } else {
        //builtStyle.fields.push(getFieldFromInheritance(heritingField, heritedField));
        builtStyle.fields.push(Object.assign(heritedField, heritingField));
      }
    }
    // Adding the fields existing only in the heritingStyle
    for (var iHeritingField = 0; iHeritingField < heritingStyle.fields.length; iHeritingField++) {
      var heritingField = Utils.clone(heritingStyle.fields[iHeritingField]);
      var heritedField = getFieldByName(heritedStyle.fields, heritingField.name);
      if (heritedField == null) {
        builtStyle.fields.push(heritingField);
      }
    }

    // Canvas fields, identified by 'id' (if no id, fields always added)
    builtStyle.canvasFields = [ ]; // TODO : need to think about an 'order of fields / z-index' with this inheritance
    // Adding all the canvasFields existing in the heritedStyle (modified by the heritingStyle, if needed)
    for(var iHeritedField = 0; iHeritedField < heritedStyle.canvasFields.length; iHeritedField++) {
      var heritedField = Utils.clone(heritedStyle.canvasFields[iHeritedField]);
      var heritingField = null;
      if (heritedField.id != undefined) {
        heritingField = getCanvasFieldById(heritingStyle.canvasFields, heritedField.id);
      }
      if (heritingField == null) {
        // Field not modified by heritingStyle
        builtStyle.canvasFields.push(heritedField);
      } else {
        //builtStyle.canvasFields.push(getFieldFromInheritance(heritingField, heritedField));
        builtStyle.canvasFields.push(Object.assign(heritedField, heritingField));
      }
    }
    // Adding the canvasFields existing only in the heritingStyle
    for (var iHeritingField = 0; iHeritingField < heritingStyle.canvasFields.length; iHeritingField++) {
      var heritingField = Utils.clone(heritingStyle.canvasFields[iHeritingField]);
      var heritedField = null;
      if (heritingField.id != undefined) {
        heritedField = getCanvasFieldById(heritedStyle.canvasFields, heritingField.id);
      }
      if (heritedField == null) {
        builtStyle.canvasFields.push(heritingField);
      }
    }

    return builtStyle;
  }

  function getFieldFromInheritance(heritingField, heritedField) {
    var field = heritedField;
    for(var key in field) {
      if (heritingField[key] != null) {
        field[key] = heritingField[key];
      }
    }
    return field;
  }

  function getFieldByName(fields, name) {
    var field = null;
    for (var iField = 0; iField < fields.length; iField++) {
      if (fields[iField].name == name) field = fields[iField];
    }

    return field;
  }

  function getCanvasFieldById(canvasFields, id) {
    var field = null;
    for (var iField = 0; iField < canvasFields.length; iField++) {
      if ((canvasFields[iField].id != null) && (canvasFields[iField].id == id)) {
        field = canvasFields[iField];
      }
    }

    return field;
  }

  return {
    getStyleFromBase: function(heritingStyle, heritedStyle) { return getStyleFromBase(heritingStyle, heritedStyle); }
  }
});
