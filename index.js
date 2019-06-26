const csv = require('csv-parser');
const fs = require('fs');
const wordlist = require('wordlist-english'); 

const readOPExport = (filepath, cb) => {
  let emails = []
  fs.createReadStream(filepath) 
    .pipe(csv())
    .on('data', (row) => {
      let objectIDColumn = Object.keys(row)[0]
      emails.push(row[objectIDColumn])
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      cb(emails)
    });
}

readOPExport('./emails/all-emails.csv', async (emails) => {
  console.log(emails)
});