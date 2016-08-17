Set objFSO=CreateObject("Scripting.FileSystemObject")

' How to write file
outFile=".\load-templates.js"
Set objFile = objFSO.CreateTextFile(outFile,True)
objFile.Write "define([" & vbCrLf

objStartFolder = "."
Set objFolder = objFSO.GetFolder(objStartFolder)
Set colFiles = objFolder.Files
NbTemplates = 0
For Each objTemplateFile in colFiles
    If LCase(objFSO.GetExtensionName(objTemplateFile.Name)) = "json" Then
        If NbTemplates <> 0 Then
          objFile.Write ", " & vbCrLf
        End If
        objFile.Write "'json!templates/" & objTemplateFile.Name & "'"
        NbTemplates = NbTemplates + 1
    End If
Next

objFile.Write "], " & vbCrLf
objFile.Write " function(" & vbCrLf

For i = 1 To NbTemplates
    IF i <> 1 Then
        objFile.Write ", "
    End If
    objFile.Write "tpl" & i
Next

objFile.Write ") " & vbCrLf & " { return { load: function() {" & vbCrLf

objFile.Write "var list = [ ];" & vbCrLf

For i = 1 To NbTemplates
    objFile.Write "list.push(tpl" & i & ");" & vbCrLf
Next
objFile.Write "return list;" & vbCrLf

objFile.Write vbCrLf & "} }; });"


objFile.Close
