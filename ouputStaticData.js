const fs = require('fs');
const mkdirp = require('mkdirp');
const consola = require('consola');

// constant
const ENDPOINT = 'https://content.b.0218.jp/wp-json/';
const DIST_DIRECTRY = './static/api/';

// axios setting
const axios = require('axios');
const client = axios.create({
  baseURL: ENDPOINT,
});

// functions
const prepareDistDirectory = async () => {
  await mkdirp(DIST_DIRECTRY);
};

const writeJsonFile = (filename, data) => {
  fs.writeFile(DIST_DIRECTRY + filename, JSON.stringify(data), err => {
    if (err) {
      consola.error(err);
    } else {
      consola.success(filename);
    }
  });
};

async function outputArchive() {
  const res = await client.get('0218/v1/archive');
  writeJsonFile('archive.json', res.data);
}

async function outputCategoryList() {
  const res = await client.get('wp/v2/categories', {
    params: {
      order: 'desc',
      orderby: 'count',
    },
  });
  writeJsonFile('categories.json', res.data);
}

// do
prepareDistDirectory();
outputArchive();
outputCategoryList();
