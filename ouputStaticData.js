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

async function outputCategoryList() {
  const res = await client.get('wp/v2/categories', {
    params: {
      _fields: 'id,count,name,slug',
      order: 'desc',
      orderby: 'count',
      exclude: 16, // conan
    },
  });
  writeJsonFile('categories.json', res.data);
}

// do
prepareDistDirectory();
outputCategoryList();
