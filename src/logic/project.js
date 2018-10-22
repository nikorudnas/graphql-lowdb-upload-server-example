/* eslint no-bitwise: 0 */
import fs, { createWriteStream } from 'fs';
import mkdirp from 'mkdirp';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

// Create database -folder if not exist
const DATABASE_DIR = './database';

mkdirp.sync(DATABASE_DIR);

const adapter = new FileSync('./database/db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)

db.defaults({ files: [] }).write();

// Create uploads -folder if not exist
const UPLOAD_DIR = './uploads';

mkdirp.sync(UPLOAD_DIR);

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;

    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const logic = {
  // Get resources from selected phase and path of a project
  getfiles: async () => {
    const resources = await db.get('files').value();
    return resources;
  },
  // Uploads new resources (files)
  uploadfiles: async args => {
    const newResources = await db.get('files').value();

    const uploads = args.files.map(async file => {
      try {
        const { stream, filename } = await file;

        // Check that required data exists
        if (!stream || !filename) {
          return new Error('File is invalid!');
        }

        // Remove if exists with same name
        db.get('files')
          .remove({ filename })
          .write();

        const fullPath = `http://localhost:4000/uploads/${filename}`;

        // Store the upload to disk
        await new Promise((resolve, reject) =>
          stream
            .pipe(createWriteStream(`./uploads/${filename}`))
            .on('finish', () => resolve())
            .on('error', reject),
        );

        const newResource = {
          _id: uuidv4(),
          filename,
          url: fullPath,
          createdAT: new Date(Date.now()),
        };

        return newResources.push(newResource);
      } catch (e) {
        throw new Error(e);
      }
    });

    return Promise.all(uploads).then(() => {
      db.defaults({ files: newResources }).write();

      return true;
    });
  },
  // Remove resources from a path or entire folder recursively
  removefile: async args => {
    const { filename } = args;
    fs.unlink(`./uploads/${filename}`, err => {
      if (err) throw err;
      console.log('File was deleted');
    });

    db.get('files')
      .remove({ filename })
      .write();

    return true;
  },
};

export default logic;
