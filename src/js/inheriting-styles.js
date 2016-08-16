define(['utils'], function(Utils) {

  // Create a Style object, based on another style
  function getStyleFromBase(parentStyle, childStyle) {
    var builtStyle = { };

    // Basic properties
    builtStyle.name = (parentStyle.name == undefined) ? childStyle.name : parentStyle.name;
    builtStyle.description = (parentStyle.description == undefined) ? childStyle.description : parentStyle.description;
    builtStyle.canvasBackground = (parentStyle.canvasBackground == undefined) ? childStyle.canvasBackground : parentStyle.canvasBackground;
    builtStyle.canvasWidth = (parentStyle.canvasWidth == undefined) ? childStyle.canvasWidth : parentStyle.canvasWidth;
    builtStyle.canvasHeight = (parentStyle.canvasHeight == undefined) ? childStyle.canvasHeight : parentStyle.canvasHeight;

    // Fields, identified by 'name'
    builtStyle.fields = [ ]; // TODO : need to think about an 'order of fields' with this inheritance
    // Adding all the fields existing in the childStyle (modified by the parentStyle, if needed)
    for(var iChildField = 0; iChildField < childStyle.fields.length; iChildField++) {
      var childField = Utils.clone(childStyle.fields[iChildField]);
      var parentField = getFieldByName(parentStyle.fields, childField.name);
      if (parentField == null) {
        // Field not modified by parentStyle
        builtStyle.fields.push(childField);
      } else if (heri) {
        builtStyle.fields.push(Object.assign(childField, parentField));
      }
    }
    // Adding the fields existing only in the parentStyle
    for (var iParentField = 0; iParentField < parentStyle.fields.length; iParentField++) {
      var parentField = Utils.clone(parentStyle.fields[iParentField]);
      var childField = getFieldByName(childStyle.fields, parentField.name);
      if (childField == null) {
        builtStyle.fields.push(parentField);
      }
    }

    // Canvas fields, identified by 'id' (if no id, fields always added)
    builtStyle.canvasFields = [ ]; // TODO : need to think about an 'order of fields / z-index' with this inheritance
    // Adding all the canvasFields existing in the childStyle (modified by the parentStyle, if needed)
    for(var iChildField = 0; iChildField < childStyle.canvasFields.length; iChildField++) {
      var childField = Utils.clone(childStyle.canvasFields[iChildField]);
      var parentField = null;
      if (childField.id != undefined) {
        parentField = getCanvasFieldById(parentStyle.canvasFields, childField.id);
      }
      if (parentField == null) {
        // Field not modified by parentStyle
        builtStyle.canvasFields.push(childField);
      } else {
        builtStyle.canvasFields.push(Object.assign(childField, parentField));
      }
    }
    // Adding the canvasFields existing only in the parentStyle
    for (var iParentField = 0; iParentField < parentStyle.canvasFields.length; iParentField++) {
      var parentField = Utils.clone(parentStyle.canvasFields[iParentField]);
      var childField = null;
      if (parentField.id != undefined) {
        childField = getCanvasFieldById(childStyle.canvasFields, parentField.id);
      }
      if (childField == null) {
        builtStyle.canvasFields.push(parentField);
      }
    }

    return builtStyle;
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
    getStyleFromBase: function(parentStyle, childStyle) { return getStyleFromBase(parentStyle, childStyle); }
  }
});
