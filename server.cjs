const express = require('express');
const fs = require('fs');
const path = require('path');
const exif = require('exif-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const MEMORIES_DIR = 'C:/Users/Hecker/Desktop/College Stuff IIITD/0 sem 6/DIS/Group Project/prototype/memora-journey-pre-final/public/memories';

app.get('/api/memories', (req, res) => {
  const memories = [];

  // Get all folders (memory titles)
  const memoryFolders = fs.readdirSync(MEMORIES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  memoryFolders.forEach(folder => {
    const folderPath = path.join(MEMORIES_DIR, folder);
    const images = fs.readdirSync(folderPath)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .map(file => {
        const filePath = path.join(folderPath, file);
        const buffer = fs.readFileSync(filePath);
        let date = null;
        try {
          const parser = exif.create(buffer);
          const result = parser.parse();
          date = result.tags.DateTimeOriginal || result.tags.CreateDate;
        } catch (e) {
          // fallback: use file's mtime
          date = fs.statSync(filePath).mtime;
        }
        return {
          url: `/memories/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`,
          date: date ? new Date(date).toISOString().slice(0, 10) : null,
        };
      });

    if (images.length > 0) {
      memories.push({
        id: folder,
        title: folder,
        date: images[0].date, // Use the date of the first image as the memory date
        type: 'photo',
        thumbnail: images[0].url,
        isFavorite: false,
        isHighlighted: false,
        tags: [],
        location: '',
        images: images.map(img => img.url),
      });
    }
  });

  res.json(memories);
});

app.use('/memories', express.static(MEMORIES_DIR));

app.listen(4001, () => {
  console.log('Server running on http://localhost:4001');
});