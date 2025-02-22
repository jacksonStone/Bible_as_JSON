# Bible.json (and bible.md)

This uses USFM files of the World English Bible as of 2025-02-01, converts them to JSON (`main.ts`) and then can collapse them into a single array of verses (`collapse.ts`).

## Output Format of bible.json

The JSON file includes the deuterocanonical books. It is formatted like so:

```json
[
  {
    "book": "Genesis",
    "chapters": [
      {
        "chapter": 1,
        "book": "Genesis",
        "verses": [
          {
            "book": "Genesis",
            "chapter": 1,
            "verse": 1,
            "text": "In the beginning, God created the heavens and the earth.  \n"
          },
          {
            "book": "Genesis",
            "chapter": 1,
            "verse": 2,
            "text": "The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.   \n"
          },
          // ...
        ]
      },
      // ...
    ]
  },
  // ...
]
```

## Output Format of bible.md

The `bible.md` file is a markdown file that includes the text of the bible in one markdown file. It is formatted like so:

```markdown
# Genesis


## Chapter 1

1. In the beginning, God created the heavens and the earth.
2. The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.
etc.
```




## Reconstruction

I used Deno to run the scripts. To reconstruct the `bible.json` file, run the following commands:

```bash
mkdir artifacts
deno run --allow-read=. --allow-write=. main.ts
deno run --allow-read=. --allow-write=. collapse.ts
```

Now you have a `bible.json` file that you can use to do whatever you want.