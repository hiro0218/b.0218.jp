import 'dotenv/config';

import fs from 'fs-extra';
import fetch from 'node-fetch';

async function getGitHubPinnedItems() {
  return await fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_GRAPHQL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
          user(login: "hiro0218") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ...on RepositoryInfo {
                  name
                  description
                  url
                  createdAt
                  updatedAt
                }
              }
            }
          }
        }`,
    }),
  })
    .then((response) => response.json())
    .then((x) => x.data.user.pinnedItems.nodes);
}

async function main() {
  const data = await getGitHubPinnedItems();
  fs.writeJSONSync(`${process.cwd()}/dist/githubPinnedItems.json`, data);
}

main();
