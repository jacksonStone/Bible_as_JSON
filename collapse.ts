import fs from 'node:fs';

function convertContentToArray(content: any) {
    return Object.keys(content)
        .filter(key => !isNaN(Number(key)))
        .sort((a, b) => Number(a) - Number(b))
        .map(key => content[key]);
}
function verseToPlainText(verse: any) {
    return verse.verseObjects
        .filter((verseObject: any) => { return verseObject.type === "word" || verseObject.type === "text" })
        .map((verseObject: any) => { return verseObject.text })
        .join('');
}
function chapterVersesToPlainText(bookName: string, chapter: any, index: number) {
    let chapterNumber = index + 1;
    let verses = convertContentToArray(chapter).map((verse: any) => verseToPlainText(verse).trim());
    return verses.map((verse: any, index: number) => { return { book: bookName, chapter: chapterNumber, verse: index + 1, text: verse } })
}
function collapse() {

    const usfmPath = './artifacts/combined.json';
    const bibleJson = JSON.parse(fs.readFileSync(usfmPath, 'utf8'));
    console.log(bibleJson[0].book);
    let betterFormat: any[] = [];
    bibleJson.forEach((book: any) => {
        let bookName = book.book;
        let bookChapters = convertContentToArray(book.content.chapters).map((chapter: any, index: number) => {
            return chapterVersesToPlainText(bookName, chapter, index);
        });
        betterFormat.push({ book: bookName, chapters: bookChapters });
    });
    console.log(betterFormat[0].chapters[1]);
    let outputPath = './bible.json';
    fs.writeFileSync(outputPath, JSON.stringify(betterFormat, null, 2));
    //   const verseContents = genesis1Verses.map((verse: any) => verse.verseObjects.map((verseObject: any) => verseObject.text).join(''));
    //   console.log(verseContents);
    //   console.log(genesisChaptersArray.length);
    //   console.log(genesisChaptersArray[0]);
}


collapse();