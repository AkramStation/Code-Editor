const { app, BrowserWindow, dialog } = require('electron').remote;
const fs = require('fs');

// دالة لفتح ملف وعرضه في مكان كتابة الأكواد
function openFileInEditor(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            dialog.showErrorBox('File Read Error', err.message);
            return;
        }

        monacoEditor.setValue(data);
    });
}

// الدالة التي تستدعى عند تحديث قائمة الملفات في الـ Explorer
function updateFileList() {
    const fileListElement = document.getElementById('file-list');
    fileListElement.innerHTML = '';

    fs.readdir('.', (err, files) => {
        if (err) {
            dialog.showErrorBox('Directory Read Error', err.message);
            return;
        }

        files.filter(file => file.endsWith('.py')).forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file;
            listItem.addEventListener('click', () => {
                openFileInEditor(file);
            });

            fileListElement.appendChild(listItem);
        });
    });
}

// ابدأ عرض محتوى المجلد عند تحميل الصفحة
window.onload = () => {
    updateFileList();

    const createFileButton = document.querySelector('.create-file-button');
    const createFolderButton = document.querySelector('.create-folder-button');
    const openFolderButton = document.querySelector('.open-folder-button');

    // إضافة معالج للأزرار
    createFileButton.addEventListener('click', () => {
        dialog.showSaveDialog({ filters: [{ name: 'Python', extensions: ['py'] }] })
            .then(result => {
                if (!result.canceled && result.filePath) {
                    fs.writeFile(result.filePath, '', (err) => {
                        if (err) {
                            dialog.showErrorBox('File Creation Error', err.message);
                        } else {
                            updateFileList();
                        }
                    });
                }
            });
    });

    createFolderButton.addEventListener('click', () => {
        dialog.showOpenDialog({ properties: ['createDirectory'] })
            .then(result => {
                if (!result.canceled && result.filePaths.length > 0) {
                    updateFileList();
                }
            });
    });

    openFolderButton.addEventListener('click', () => {
        dialog.showOpenDialog({ properties: ['openDirectory'] })
            .then(result => {
                if (!result.canceled && result.filePaths.length > 0) {
                    fs.readdir(result.filePaths[0], (err, files) => {
                        if (!err) {
                            const fileListElement = document.getElementById('file-list');
                            fileListElement.innerHTML = '';

                            files.filter(file => file.endsWith('.py')).forEach(file => {
                                const listItem = document.createElement('li');
                                listItem.textContent = file;
                                listItem.addEventListener('click', () => {
                                    openFileInEditor(result.filePaths[0] + '/' + file);
                                });

                                fileListElement.appendChild(listItem);
                            });
                        }
                    });
                }
            });
    });
};

// اشتراك في حدث عند تغيير محتوى مكان الكتابة
monacoEditor.onDidChangeModelContent(() => {
    const code = monacoEditor.getValue();
    console.log('Current Code: ', code);
});


const explorerHeader = document.querySelector('.explorer-header');
const explorerOptions = document.getElementById('explorer-options');
const explorerMenu = document.getElementById('explorer-menu');
const openFileBtn = document.getElementById('open-file');
const openFolderBtn = document.getElementById('open-folder');
const createFileBtn = document.getElementById('create-file');

explorerHeader.addEventListener('click', () => {
  explorerMenu.style.display = 'block';
});

explorerOptions.addEventListener('mouseleave', () => {
  explorerMenu.style.display = 'none';
});

openFileBtn.addEventListener('click', () => {
  // افتح ملف
});

openFolderBtn.addEventListener('click', () => {
  // افتح مجلد
});

createFileBtn.addEventListener('click', () => {
  // أنشئ ملف بلغة بايثون
  const fileName = 'new_file.py';
  const code = `# New Python File\nprint('Hello, World!')`;

  // هنا قم بإضافة الكود لإنشاء الملف بالبايثون

  // ثم قم بإضافة الملف إلى الـ Explorer
  const explorerBody = document.querySelector('.explorer-body');
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  fileItem.textContent = fileName;
  fileItem.addEventListener('click', () => {
    // افتح الملف
  });
  explorerBody.appendChild(fileItem);
});

function createTab(fileName) {
    const tabBar = document.getElementById('editor-tabs');
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.textContent = fileName;
    tab.onclick = () => {
        const fileIndex = openedFiles.findIndex((f) => f.name === fileName);
        openFileByIndex(fileIndex);
    };
    tabBar.appendChild(tab);
    tabBar.scrollLeft = tabBar.scrollWidth; // نضمن ظهور التبويب الجديد بجوار التبويبات الحالية
}

// ... الأكواد السابقة

// استمع لحدث إدخال الأوامر في الطرفية
const terminalInput = document.getElementById('terminal');
terminalInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleCommand();
  }
});

// معالجة الأمر وتنفيذه باستخدام eval()
function handleCommand() {
  const terminalInput = document.getElementById('terminal');
  const command = terminalInput.value.trim();
  terminalInput.value = ''; // استعادة القيمة الافتراضية للطرفية

  // تنفيذ الأمر باستخدام eval()
  try {
    const result = eval(command);
    if (result !== undefined) {
      // عرض النتيجة في الطرفية
      appendToTerminal(`> ${command}\n${result}\n`);
    }
  } catch (error) {
    // إذا حدث خطأ، عرضه في الطرفية
    appendToTerminal(`> ${command}\nError: ${error.message}\n`);
  }
}

// إضافة نص إلى الطرفية
function appendToTerminal(text) {
  const terminalOutput = document.getElementById('terminal');
  terminalOutput.value += text;
  terminalOutput.scrollTop = terminalOutput.scrollHeight; // التمرير لأسفل عند إضافة نص جديد
}


// استمع لحدث إدخال الأوامر في الطرفية
const terminalInput = document.getElementById('terminal');
terminalInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleCommand();
  }
});

// معالجة الأمر وتنفيذه باستخدام eval()
function handleCommand() {
  const terminalInput = document.getElementById('terminal');
  const command = terminalInput.value.trim();
  terminalInput.value = ''; // استعادة القيمة الافتراضية للطرفية

  // تنفيذ الأمر باستخدام eval()
  try {
    const result = eval(command);
    if (result !== undefined) {
      // عرض النتيجة في الطرفية
      appendToTerminal(`> ${command}\n${result}\n`);
    }
  } catch (error) {
    // إذا حدث خطأ، عرضه في الطرفية
    appendToTerminal(`> ${command}\nError: ${error.message}\n`);
  }
}

// إضافة نص إلى الطرفية
function appendToTerminal(text) {
  const terminalOutput = document.getElementById('terminal');
  terminalOutput.value += text;
  terminalOutput.scrollTop = terminalOutput.scrollHeight; // التمرير لأسفل عند إضافة نص جديد
}
