const csv = require('csv-parser');
const fs = require('fs');
const wordlist = require('wordlist-english');
let commonEnglishWords = wordlist['english'];


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
  emails.forEach(email => {
    if (email) {
      let firstPartEmail = email.split('@')[0]
      for (let word in commonEnglishWords) {
        let comparingWord = commonEnglishWords[word]
        // We don't care about really short words
        if (comparingWord.length >= 4) {
          if (firstPartEmail.includes(comparingWord)) {
            if (identifiedWords[comparingWord]) {
              identifiedWords[comparingWord]++;
            } else {
              identifiedWords[comparingWord] = 1;
            }
          }
        }
      }
    }
  })
  console.log(identifiedWords)
});