import 'dotenv/config';

import fs from 'fs-extra';
import fetch from 'node-fetch';

const path = {
  dist: `${process.cwd()}/dist`,
} as const;

async function getGitHubPinnedItems() {
  return await fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_GRAPHQL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      {
        user(login: "hiro0218") {
          pinnedItems(first: 6, types: REPOSITORY) {
            edges {
              node {
                ... on Repository {
                  name
                  description
                  updatedAt
                  createdAt
                  homepageUrl
                  url
                  stargazerCount
                  forkCount
                  languages(first: 1) {
                    nodes {
                      color
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
      `,
    }),
  })
    .then((response) => response.json())
    .then((x) => {
      return x?.data?.user?.pinnedItems?.edges?.map((x) => {
        const { languages, ...rest } = x.node;
        return { ...rest, languages: languages.nodes.at(0) };
      });
    });
}

async function main() {
  const data = await getGitHubPinnedItems();

  if (data) {
    fs.ensureDirSync(`${path.dist}`);
    fs.writeJSONSync(`${path.dist}/githubPinnedItems.json`, data);
    console.log('Write dist/githubPinnedItems.json');
  }
}

main();
