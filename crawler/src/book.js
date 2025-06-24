const fs = require('fs');

async function fetchBooks(ids) {
  return Promise.all(ids.map(async id => {
    const res = await fetch(`https://light.api.limaogushi.com/api/picture-books/${id}`);
    const data = await res.json();
    return data.data;
  }));
}

function partition(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

async function main() {
  const ids = JSON.parse(fs.readFileSync(__dirname + '/../data/ids.json', 'utf8'));
  const idPartitions = partition(ids, 10);
  const bookPath = __dirname + '/../data/books-raw.json';
  fs.appendFileSync(bookPath, '[', 'utf8');
  for (let i = 0; i < idPartitions.length; i++) {
    const books = await fetchBooks(idPartitions[i]);
    const bookStr = JSON.stringify(books);
    fs.appendFileSync(bookPath, bookStr.substring(1, bookStr.length - 1), 'utf8');
    if (i !== idPartitions.length - 1) {
      fs.appendFileSync(bookPath, ',', 'utf8');
    }
    console.log(`Processed ${i + 1}/${idPartitions.length} partitions`);
  }
  fs.appendFileSync(bookPath, ']', 'utf8');
}

main();