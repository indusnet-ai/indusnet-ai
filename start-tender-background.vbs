Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
projectRoot = fso.GetParentFolderName(WScript.ScriptFullName)

' Build absolute path to start-tender.bat
batPath = projectRoot & "\start-tender.bat"

' Run start-tender.bat in the background using absolute path (0 = hidden, False = run asynchronously)
WshShell.CurrentDirectory = projectRoot
WshShell.Run "cmd.exe /c """ & batPath & """", 0, False
