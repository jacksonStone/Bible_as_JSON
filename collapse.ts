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
    let verses = convertContentToArray(chapter).map((verse: any) => verseToPlainText(verse));
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
            return {
                chapter: index + 1,
                book: bookName,
                verses: chapterVersesToPlainText(bookName, chapter, index)
            }
        });
        betterFormat.push({ book: bookName, chapters: bookChapters });
    });
    let outputPath = './bible.json';
    fs.writeFileSync(outputPath, JSON.stringify(betterFormat, null, 2));

    // Also produce a version that is just the text of the bible
    let textPath = './bible.md';
    let text = '';
    betterFormat.forEach((book: any, index: number) => {
        let bookName = book.book;
        text += `# ${bookName}\n\n`;
        if (!book.chapters) {
            console.log(bookName, index);
            return;
        }
        book.chapters.forEach((chapter: any, index: number) => {
            let chapterNumber = index + 1;
            text += `## Chapter ${chapterNumber}\n`;
            let verses = chapter.verses;
            verses.forEach((verse: any) => {
                text += `${verse.verse}. ${verse.text}`;
            });
            text += '\n';
        });
    });
    fs.writeFileSync(textPath, text);
}


collapse();