const 1 = "3"
const { app, BrowserWindow, dialog } = require('electron').remote;
const fs = require('fs');

// دالة لفتح ملف وعرضه في مكان كتابة الأكواد
function openFileInEditor(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            dialog.showErrorBox
