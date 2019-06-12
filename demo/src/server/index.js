import { EpubParser } from '@ridi/epub-parser';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const cwd = process.cwd();
const dataPath = './data';
const app = express();
const port = 8080;

// const getFonts = (styles) => {
//   const regex = /@font-face\{font-family:["]?([\w\s]+)["]?;src:url\(["]?([\w\s\/\.\-_]+)["]?\)\}/g;
//   const fonts = [];
//   styles.forEach(style => {
//     let result;
//     while((result = regex.exec(style)) !== null) {
//       const [mached, name, href] = result;
//       fonts.push({ name, href: `${href}` });
//     }
//   });
//   return fonts;
// };

const fetchBook = (fileName) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dataPath, fileName);
    if (fs.existsSync(filePath)) {
      const unzipPath = path.join(dataPath, path.basename(filePath, path.extname(filePath)));
      const parser = new EpubParser(filePath);
      parser.parse({ unzipPath }).then((book) => {
        const basePath = unzipPath;
        const extractBody = (innerHTML, attrs) => {
          const string = attrs.map((attr) => {
            return ` ${attr.key}="${attr.value}"`;
          }).join(' ');
          return `<article ${string}>${innerHTML}</article>`;
        };
        parser.readItems(book.spines.concat(book.styles), { basePath, extractBody }).then((results) => {
          const position = book.spines.length;
          const styles = results.slice(position);
          resolve({
            unzipPath,
            book,
            spines: results.slice(0, position),
            styles,
            fonts: book.fonts, // getFonts(styles),
          });
        });
      });
    } else {
      reject();
    }
  });
};

app.use('/', express.static(path.join(cwd, 'public')));

app.get('/api/book', (request, response) => {
  const fileName = decodeURI(request.query.filename);
  fetchBook(fileName).then(book => response.send(book)).catch(() => response.status(404).send());
});

app.post('/api/book/upload', (request, response) => {
  const storage = multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, dataPath);
    },
    filename: (request, file, callback) => {
      const fileName = file.originalname;
      file.uploadedFile = { name: fileName, ext: path.extname(fileName) };
      callback(null, fileName);
    },
  });
  const upload = multer({ storage }).single('file');
  upload(request, response, (err) => {
    if (err) {
      response.status(500).send(err);
    } else {
      const fileName = request.file.uploadedFile.name;
      fetchBook(fileName).then(book => response.send(book)).catch(() => response.status(404).send());
    }
  });
});

app.listen(port, () => {
  console.log(`Express listening on port ${port}.`);
});
