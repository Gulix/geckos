function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function getCharsTableFromHtml(sHtml) {
  // Using CKEditor, this code needs to be updated.
  // Maybe using a good parser ? jquery.parseHtml ?
  // Special characters also need to be treated : < > &

  // The sHtml variable contains the value returned by the CKEditor
  // Each line is between <p></p> tags, and the styles are defined by <strong> and <em> tags

  // We need to create an array of Lines for the Canvas
  // Each line is an array of characters, those characters specifying their style.

  var parsedHtml = $.parseHTML(sHtml);

  // Split into lines
  var charLines = [ ];
  var currentStyle = {
    "isBold": false,
    "isItalic": false
  };

  for (var iLine = 0; iLine < parsedHtml.length; iLine++) {
    var charLine = [ ];
    var currentLine = parsedHtml[iLine];
    if (currentLine.nodeName == '#text') {
      addCharsFromHtml(currentLine, charLine, currentStyle);
    } else {
      for(var iChild = 0; iChild < currentLine.childNodes.length; iChild++) {
        addCharsFromHtml(currentLine.childNodes[iChild], charLine, currentStyle);
      }
    }

    charLines.push(charLine);
  }

  return charLines;
}

function addCharsFromHtml(html, charsArray, style) {

  var styleBefore = {
    "isBold": style.isBold,
    "isItalic": style.isItalic
   };

  // Text element - Each char is added to charsArray with the current style
  if (html.nodeName == "#text") {
    for(var iChar = 0; iChar < html.nodeValue.length; iChar++) {
      var charToAdd = {
        "char": html.nodeValue[iChar],
        "bold": ((style != null) && (style.isBold != undefined)) ? style.isBold : false,
        "italic": ((style != null) && (style.isItalic != undefined)) ? style.isItalic : false
      };
      charsArray.push(charToAdd);
    }
  } else {

    if (html.nodeName == "STRONG") {
      style.isBold = true;
    } else if (html.nodeName == "EM") {
      style.isItalic = true;
    }

    for(var iChild = 0; iChild < html.childNodes.length; iChild++) {

      var childElement = html.childNodes[iChild];
      addCharsFromHtml(childElement, charsArray, style);
    }
    style.isBold = styleBefore.isBold;
    style.isItalic = styleBefore.isItalic;
  }
}

function getTextFromCharTable(charTable) {
  var text = '';
  for (var iLine = 0; iLine < charTable.length; iLine++) {
    for (var iChar = 0; iChar < charTable[iLine].length; iChar++) {
      text += charTable[iLine][iChar]['char'];
    }
    text += '\n';
  }
  return text;
}

function getStylesTablesFromCharTables(charTables) {
  var stylesTables = { };
  for (var iLine = 0; iLine < charTables.length; iLine++) {
    var stylesLine = { };
    var lineWithStyle = false;
    for (var iChar = 0; iChar < charTables[iLine].length; iChar++) {
      var charElement = charTables[iLine][iChar];
      if (charElement["bold"] || charElement['italic']) {
        var charStyle = { };
        if (charElement["bold"]) {
          charStyle['fontWeight'] = 'bold';
        }
        if (charElement["italic"]) {
          charStyle['fontStyle'] = 'italic';
        }
        stylesLine['' + iChar] = charStyle;
        lineWithStyle = true;
      }
    }
    if (lineWithStyle) {
      stylesTables['' + iLine] = stylesLine;
    }
  }
  return stylesTables;
}
