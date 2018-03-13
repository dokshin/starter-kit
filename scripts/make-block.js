'use strict';

import fs   from 'fs';
import path from 'path';

// Импорт настроек проекта
import {src as dirs} from  '../projectConfig.json';

// Создание массива с введенными именами блоков
let blockNames = [];

for (let i = 2; i < process.argv.length; i++) {
  blockNames.push(process.argv[i]);
}

// Если ввели имя блока - просходит удаление
if(blockNames[0]) {

  // Беребор массива имён
  for(let i = 0; i < blockNames.length; i++) {

    // Пути к файлам блока
    let blockDirPath =      path.resolve(dirs.blocks + blockNames[i]);
    let blockTemplatePath = path.resolve(blockDirPath + '/' + blockNames[i] +
                                         '.pug');
    let blockStylePath =    path.resolve(blockDirPath + '/' + blockNames[i] +
                                         '.scss');
    let blockScriptPath =   path.resolve(blockDirPath + '/' + blockNames[i] +
                                         '.js');

    // Содержимое фалов блока
    let scriptData =   '{\n\n}';

    // Пути к файлам проекта
    let styleScssPath =    path.resolve(dirs.styles + 'style.scss');
    let appJsPath =        path.resolve(dirs.scripts + 'app.js');

    // Импорт файлов блока в проект
    let styleImport =  '@import \'' + dirs.blocks + blockNames[i] +
                       '/'+blockNames[i] + '\';\n';
    let scriptImport = 'import \'../blocks' + blockNames[i] +
                       '/'+blockNames[i] + '\';\n';

    // Проверка существование блока
    fs.readdir(blockDirPath, (err) => {

      // Если такого блока не существует - происходит создание блока
      if(err) {

        // Создание директории блока
        fs.mkdir(blockDirPath, (err) => {
          if(err) throw err;
        });

        // Создание файла разметки
        fs.writeFile(blockTemplatePath, '', (err) => {
          if(err) throw err;
        });

        // Создание файла стилей
        fs.writeFile(blockStylePath, '', (err) => {
          if(err) throw err;
        });

        // Создание файла скриптов
        fs.writeFile(blockScriptPath, scriptData, (err) => {
          if(err) throw err;
        });

        // Создание подпапки для изображений
        fs.mkdir(blockDirPath + '/img', (err) => {
          if(err) throw err;
        });

        // Импорт в файл подключений стилей
        fs.appendFile(styleScssPath, styleImport, (err) => {
          if(err) throw err;
        });

        // Импорт в файл подключение скриптов
        fs.appendFile(appJsPath, scriptImport, (err) => {
          if(err) throw err;
        });

        console.log('<<< Блок ' + blockNames[i] + ' создан! >>>');

      // Если блок уже существует - происходит предупреждение
      }else {
        console.log('<<< Блок '+ blockNames[i] + ' уже существует! >>>');
      }
    });
  }

// Если имя блока не ввели - происходит предупреждение
}else {
  console.log('<<< Введите имя блока! >>>');
}
