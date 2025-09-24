const fs = require('fs');
const path = require('path');
const categoriesFile = path.join(__dirname, '../data/categories.json');

function readCats() {
  return JSON.parse(fs.readFileSync(categoriesFile));
}
function writeCats(data) {
  fs.writeFileSync(categoriesFile, JSON.stringify(data, null, 2));
}

exports.getAll = (req, res) => {
  res.json(readCats());
};

exports.create = (req, res) => {
  const cats = readCats();
  cats.push(req.body.name);
  writeCats(cats);
  res.status(201).json({ message: 'Category added' });
};

exports.delete = (req, res) => {
  let cats = readCats();
  cats = cats.filter((c, idx) => idx.toString() !== req.params.id);
  writeCats(cats);
  res.json({ message: 'Category deleted' });
};
