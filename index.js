const csv = require('csv-parser');
const fs = require('fs');
const wordlist = require('wordlist-english');
let commonEnglishWords = wordlist['english/10'];

const readCSVExport = (filepath, cb) => {
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

readCSVExport('./emails/all-emails.csv', async (emails) => {
  let identifiedWords = {}; // Start with an empty object, where each word identified becomes its own key
  let firstPartEmail = [];
  emails.forEach(email => {
    if (email) {
      firstPartEmail.push(email.split('@')[0])
    }
  })
  firstPartEmail.forEach(email => {

  })
});