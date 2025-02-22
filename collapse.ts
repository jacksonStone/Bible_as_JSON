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
        console.log(bookName, book.category);
        betterFormat.push({ book: bookName, chapters: bookChapters, category: book.category });
    });
    let outputPath = './bible.json';
    fs.writeFileSync(outputPath, JSON.stringify(betterFormat, null, 2));

    // Also produce a version that is just the text of the bible
    let ntText = {content: '', category: 'NT'};
    let otText = {content: '', category: 'OT'};
    let dcText = {content: '', category: 'DC'};
    let otherText = {content: '', category: 'Other'};
    betterFormat.forEach((book: any, index: number) => {
        let bookName = book.book;
        let category = book.category;
        let text = {content: '', category: category};
        console.log(bookName, index, category);

        if (category === 'OT') {
            text = otText;
        } else if (category === 'NT') {
            text = ntText;
        } else if (category === 'DC') {
            text = dcText;
        } else {
            text = otherText;
        }
        text.content += `\n# ${bookName}\n\n`;
        if (!book.chapters) {
            console.log(bookName, index);
            return;
        }
        book.chapters.forEach((chapter: any, index: number) => {
            let chapterNumber = index + 1;
            text.content += `## Chapter ${chapterNumber}\n`;
            let verses = chapter.verses;
            verses.forEach((verse: any) => {
                text.content += `${verse.verse}. ${verse.text}`;
            });
            text.content += '\n';
        });
    });
    fs.writeFileSync("newTestament.md", ntText.content);
    fs.writeFileSync("oldTestament.md", otText.content);
    fs.writeFileSync("deuteroCanonicals.md", dcText.content);
    fs.writeFileSync("other.md", otherText.content);
    fs.writeFileSync("bible.md", `
        # Old Testament

        ${otText.content}

        # Deuterocanonical

        ${dcText.content}

        # New Testament

        ${ntText.content}
    `);
}


collapse();