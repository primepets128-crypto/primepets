const fs = require('fs');
const https = require('https');

function getUrls(file) {
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/https:\/\/images\.unsplash\.com\/[^'\"\s]+/g) || [];
  return [...new Set(matches)];
}

const urls = [
  ...getUrls('src/context/DataContext.jsx'),
  ...getUrls('src/pages/HubPage.jsx'),
  ...getUrls('src/pages/AccountPage.jsx')
];
const uniqueUrls = [...new Set(urls)];

async function checkUrl(url) {
  return new Promise(resolve => {
    https.get(url, (res) => {
      // 404 means broken. Unsplash might return 403 or 401 if it's premium.
      if (res.statusCode !== 200 && res.statusCode !== 302 && res.statusCode !== 301) {
         resolve({url, status: res.statusCode});
      } else {
         resolve(null);
      }
    }).on('error', (e) => resolve({url, error: e.message}));
  });
}

(async () => {
  console.log(`Checking ${uniqueUrls.length} urls...`);
  for (const url of uniqueUrls) {
    const res = await checkUrl(url);
    if (res) console.log('BROKEN:', res);
  }
  console.log('DONE');
})();
