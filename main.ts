import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { usfmToJSON } from './parseToJson.js';
// Book name mapping
const bookNames: { [key: string]: string } = {
  'GEN': 'Genesis',
  'EXO': 'Exodus',
  'LEV': 'Leviticus',
  'NUM': 'Numbers',
  'DEU': 'Deuteronomy',
  'JOS': 'Joshua',
  'JDG': 'Judges',
  'RUT': 'Ruth',
  '1SA': '1 Samuel',
  '2SA': '2 Samuel',
  '1KI': '1 Kings',
  '2KI': '2 Kings',
  '1CH': '1 Chronicles',
  '2CH': '2 Chronicles',
  'EZR': 'Ezra',
  'NEH': 'Nehemiah',
  'EST': 'Esther',
  'JOB': 'Job',
  'PSA': 'Psalms',
  'PRO': 'Proverbs',
  'ECC': 'Ecclesiastes',
  'SNG': 'Song of Songs',
  'ISA': 'Isaiah',
  'JER': 'Jeremiah',
  'LAM': 'Lamentations',
  'EZK': 'Ezekiel',
  'DAN': 'Daniel',
  'HOS': 'Hosea',
  'JOL': 'Joel',
  'AMO': 'Amos',
  'OBA': 'Obadiah',
  'JON': 'Jonah',
  'MIC': 'Micah',
  'NAM': 'Nahum',
  'HAB': 'Habakkuk',
  'ZEP': 'Zephaniah',
  'HAG': 'Haggai',
  'ZEC': 'Zechariah',
  'MAL': 'Malachi',
  'MAT': 'Matthew',
  'MRK': 'Mark',
  'LUK': 'Luke',
  'JHN': 'John',
  'ACT': 'Acts',
  'ROM': 'Romans',
  '1CO': '1 Corinthians',
  '2CO': '2 Corinthians',
  'GAL': 'Galatians',
  'EPH': 'Ephesians',
  'PHP': 'Philippians',
  'COL': 'Colossians',
  '1TH': '1 Thessalonians',
  '2TH': '2 Thessalonians',
  '1TI': '1 Timothy',
  '2TI': '2 Timothy',
  'TIT': 'Titus',
  'PHM': 'Philemon',
  'HEB': 'Hebrews',
  'JAS': 'James',
  '1PE': '1 Peter',
  '2PE': '2 Peter',
  '1JN': '1 John',
  '2JN': '2 John',
  '3JN': '3 John',
  'JUD': 'Jude',
  'REV': 'Revelation',
  '1ES': '1 Esdras',
  '2ES': '2 Esdras',
  'TOB': 'Tobit',
  'JDT': 'Judith',
  'ESG': 'Esther (Greek)',
  'WIS': 'Wisdom',
  'SIR': 'Sirach',
  'BAR': 'Baruch',
  'DAG': 'Daniel (Greek)',
  'MAN': 'Prayer of Manasseh',
  '1MA': '1 Maccabees',
  '2MA': '2 Maccabees',
  '3MA': '3 Maccabees',
  '4MA': '4 Maccabees',
  'PS2': 'Psalm 151',
  'GLO': 'Glossary',
  'FRT': 'Front Matter',
};
// Define canonical order with numerical indices
const canonicalOrder: { [key: string]: number } = {
  // Old Testament
  'Genesis': 1,
  'Exodus': 2,
  'Leviticus': 3,
  'Numbers': 4,
  'Deuteronomy': 5,
  'Joshua': 6,
  'Judges': 7,
  'Ruth': 8,
  '1 Samuel': 9,
  '2 Samuel': 10,
  '1 Kings': 11,
  '2 Kings': 12,
  '1 Chronicles': 13,
  '2 Chronicles': 14,
  'Ezra': 15,
  'Nehemiah': 16,
  'Esther': 17,
  'Job': 18,
  'Psalms': 19,
  'Proverbs': 20,
  'Ecclesiastes': 21,
  'Song of Songs': 22,
  'Isaiah': 23,
  'Jeremiah': 24,
  'Lamentations': 25,
  'Ezekiel': 26,
  'Daniel': 27,
  'Hosea': 28,
  'Joel': 29,
  'Amos': 30,
  'Obadiah': 31,
  'Jonah': 32,
  'Micah': 33,
  'Nahum': 34,
  'Habakkuk': 35,
  'Zephaniah': 36,
  'Haggai': 37,
  'Zechariah': 38,
  'Malachi': 39,
  // New Testament
  'Matthew': 40,
  'Mark': 41,
  'Luke': 42,
  'John': 43,
  'Acts': 44,
  'Romans': 45,
  '1 Corinthians': 46,
  '2 Corinthians': 47,
  'Galatians': 48,
  'Ephesians': 49,
  'Philippians': 50,
  'Colossians': 51,
  '1 Thessalonians': 52,
  '2 Thessalonians': 53,
  '1 Timothy': 54,
  '2 Timothy': 55,
  'Titus': 56,
  'Philemon': 57,
  'Hebrews': 58,
  'James': 59,
  '1 Peter': 60,
  '2 Peter': 61,
  '1 John': 62,
  '2 John': 63,
  '3 John': 64,
  'Jude': 65,
  'Revelation': 66,
  // Deuterocanonical/Apocryphal (continuing the numbering)
  'Tobit': 67,
  'Judith': 68,
  '1 Maccabees': 69,
  '2 Maccabees': 70,
  '3 Maccabees': 71,
  '4 Maccabees': 72,
  '1 Esdras': 73,
  '2 Esdras': 74,
  'Prayer of Manasseh': 75,
  'Psalm 151': 76,
  'Wisdom': 77,
  'Sirach': 78,
  'Baruch': 79,
  'Daniel (Greek)': 80,
  'Esther (Greek)': 81,
  // Additional content
  'Front Matter': 82,
  'Glossary': 83
};
export function convert(usfmPath: string): any {
  const usfm = readFileSync(usfmPath, 'utf8');
  const json = usfmToJSON(usfm);
  return json;
}

// Read all files in the directory
const usfmDir = './engwebu_usfm';
const files = readdirSync(usfmDir);

// Process each USFM file
files.forEach(file => {
  if (file.endsWith('.usfm')) {
    // Extract the three-letter abbreviation (e.g., "GEN" from "02-GENengwebu.usfm")
    const match = file.match(/\d+-(\w{3})engwebu\.usfm/);
    if (match) {
      const bookAbbr = match[1];
      const json = convert(`${usfmDir}/${file}`);
      
      // Save as JSON file
      writeFileSync(`./artifacts/json/${bookAbbr}.json`, JSON.stringify(json, null, 2));
      console.log(`Converted ${file} to ${bookAbbr}.json`);
    }
  }
});

// After processing all individual files, combine them into one JSON object
const jsonFiles = readdirSync('./artifacts/json').filter(file => file.endsWith('.json'));
const booksArray: Array<{ book: string; content: any }> = [];

jsonFiles.forEach(file => {
  const bookAbbr = file.replace('.json', '');
  const fullBookName = bookNames[bookAbbr] || bookAbbr;
  const fileContent = readFileSync('./artifacts/json/' + file, 'utf8');
  const jsonContent = JSON.parse(fileContent);
  
  booksArray.push({
    book: fullBookName,
    content: jsonContent
  });
});

// Sort the array based on canonical order
booksArray.sort((a, b) => {
  const orderA = canonicalOrder[a.book] || Number.MAX_SAFE_INTEGER;
  const orderB = canonicalOrder[b.book] || Number.MAX_SAFE_INTEGER;
  return orderA - orderB;
});


// Save the combined JSON file
writeFileSync('artifacts/combined.json', JSON.stringify(booksArray, null, 2));
console.log('Created combined.json with all books');