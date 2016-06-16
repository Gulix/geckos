function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function getCharsTableFromHtml(sHtml) {
  // Split into lines, breaking with <br>
  var sLines = sHtml.split("<br>");
  var charLines = [ ];
  var isBold = false;
  var isItalic = false;
  for (var iLine = 0; iLine < sLines.length; iLine++) {
    var charLine = [ ];
    var currentLine = sLines[iLine];
    for (var iChar = 0; iChar < currentLine.length; iChar++) {
      var notAnalysedString = currentLine.substring(iChar);
      if (!isBold && (notAnalysedString.indexOf('<b>') == 0)) {
        isBold = true;
        iChar += 2;
      } else if (!isItalic && (notAnalysedString.indexOf('<i>') == 0)) {
        isItalic = true;
        iChar += 2;
      } else if (isBold && (notAnalysedString.indexOf('</b>') == 0)) {
        isBold = false;
        iChar += 3;
      } else if (isItalic && (notAnalysedString.indexOf('</i>') == 0)) {
        isItalic = false;
        iChar += 3;
      } else {
        var charToAdd = {
          "char": notAnalysedString.substring(0,1),
          "bold": isBold,
          "italic": isItalic
        };
        charLine.push(charToAdd);
      }
    }
    charLines.push(charLine);
  }

  return charLines;
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
