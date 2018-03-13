'use strict';

import del  from 'del';
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
    let blockDirPath =  path.resolve(dirs.blocks + blockNames[i]);

    // Пути к файлам проекта
    let styleScssPath = path.resolve(dirs.styles + 'style.scss');
    let appJsPath =     path.resolve(dirs.scripts + 'app.js');

    // Импорт файлов блока в проект
    let styleImport =  '@import \'' + dirs.blocks + blockNames[i] +
                        '/'+blockNames[i] + '\';\n';
    let scriptImport = 'import \'../blocks' + blockNames[i] +
                       '/'+blockNames[i] + '\';\n';

    // Проверка существование блока
    fs.readdir(blockDirPath, (err) => {

      // Если такого блока не существует - происходит предупреждение
      if(err) {
        console.log('<<< Блок '+ blockNames[i] + ' не существует! >>>');

      // Если блок существует - выполняется удаление
      }else {

        // Удаление папки блока
        del(blockDirPath);

        // Удаление импорта блока из файла style.scss
        try {

          // Содержимое файла style.scss
          let data = fs.readFileSync(styleScssPath, 'utf-8');

          // Удаление импорта блока
          data = data.replace(styleImport, '');

          // Перезапись с изменениями
          fs.writeFileSync(styleScssPath, data);
        }catch(err) {
          if(err) throw err;
        }

        // Удаление импорта блока из файла app.js
        try {

          // Содержимое файла app.js
          let data = fs.readFileSync(appJsPath, 'utf-8');

          // Удаление импорта блока
          data = data.replace(appJsPath, '');

          // Перезапись с изменениями
          fs.writeFileSync(appJsPath, data);
        }catch(err) {
          if(err) throw err;
        }

        console.log('<<< Блок ' + blockNames[i] + ' удалён! >>>');
      }
    });
  }

// Если имя блока не ввели - происходит предупреждение
}else {
  console.log('<<< Введите имя блока! >>>');
}
