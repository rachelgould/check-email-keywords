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

const listMostCommonOccurrences = (objectWithMatches, threshold) => {
  console.log("Compiling the most common words...")
  let newObject = {}
  for (let word in objectWithMatches) {
    if (objectWithMatches[word] >= threshold) {
      newObject[word] = objectWithMatches[word];
    }
  }
  return newObject;
}

readCSVExport('./emails/all-emails.csv', async (emails) => {
  let identifiedWords = {}; // Start with an empty object, where each word identified becomes its own key
  let totalCount = emails.length;
  let currentCount = 1;
  let lastProgress = 0;
  console.log("Now checking for word occurrences...")
  emails.forEach(email => {
    let newProgress = Math.floor((currentCount/totalCount)*100);
    if (newProgress !== lastProgress) {
      console.log(`${newProgress} % Complete!`)
    }
    lastProgress = newProgress;
    currentCount++;
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
  console.log(listMostCommonOccurrences(identifiedWords, 15))
});
