const csv = require('csv-parser');

function parseCSV(filePath, onRow, onEnd) {
  const fs = require('fs');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', onRow)
    .on('end', onEnd);
}
module.exports = { parseCSV };
