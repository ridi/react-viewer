import { EpubParser, ComicParser } from '@ridi/content-parser';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const cwd = process.cwd();
const dataPath = './data';
const app = express();
const port = 8080;

const parseEpub = async ({ filePath, unzipPath }) => {
  const parser = new EpubParser(filePath);
  const book = await parser.parse({ unzipPath });

  const options = {
    extractBody: (innerHTML, attrs) => `<article ${attrs.map((attr) => ` ${attr.key}="${attr.value}"`).join(' ')}>${innerHTML}</article>`,
    basePath: unzipPath,
  };
  const results = await parser.readItems(book.spines.concat(book.styles), options);
  const position = book.spines.length;
  const styles = results.slice(position);
  return {
    unzipPath,
    book,
    spines: results.slice(0, position),
    styles,
    fonts: book.fonts.map((font) => ({ ...font, uri: `${unzipPath}/${font.href}` })),
    type: 'epub',
  };
};

const parseComic = async ({ filePath, unzipPath }) => {
  const parser = new ComicParser(filePath);
  const book = await parser.parse({ unzipPath, parseImageSize: 512 });

  return {
    unzipPath,
    book,
    images: book.items.map((image) => ({ ...image, uri: `${unzipPath}/${image.path}` })),
    type: 'comic',
  };
};

const parseBook = (fileName) => {
  const filePath = path.join(dataPath, fileName);
  if (fs.existsSync(filePath)) {
    return Promise.resolve().then(async () => {
      const isEpub = path.extname(fileName).toLowerCase() === '.epub';
      const unzipPath = path.join(dataPath, path.basename(filePath, path.extname(filePath)));
      return isEpub ? parseEpub({ filePath, unzipPath }) : parseComic({ filePath, unzipPath });
    });
  }
  return Promise.reject(`No file exist: ${filePath}`);
};

app.use('/', express.static(path.join(cwd, 'public')));

app.get('/api/book', (request, response) => {
  const fileName = decodeURI(request.query.filename);
  parseBook(fileName).then(book => response.send(book)).catch(() => response.status(404).send());
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
      parseBook(fileName).then(book => response.send(book)).catch(() => response.status(404).send());
    }
  });
});

app.use(function (err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
});

app.listen(port, () => {
  console.log(`Express listening on port ${port}.`);
});
