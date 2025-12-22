import fs from 'fs';

const moveFileSafe = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.rename(src, dest, (err) => {
      if (!err) return resolve(true);

      // EXDEV: cross-device
      if (err.code === 'EXDEV') {
        const readStream = fs.createReadStream(src);
        const writeStream = fs.createWriteStream(dest);

        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('close', () => fs.unlink(src, resolve));

        readStream.pipe(writeStream);
      } else reject(err);
    });
  });
};

export default moveFileSafe;
