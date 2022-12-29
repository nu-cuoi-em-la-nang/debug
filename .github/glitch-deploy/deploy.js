const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/magical-uttermost-sea|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/miniature-phase-fowl|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/tricky-sassy-distance|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/wooden-elite-need|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/cedar-stream-archaeopteryx|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/immediate-grizzly-puffin|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/sulky-brassy-tamarind|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/unleashed-lake-hardware|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/quintessential-admitted-button|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/amazing-open-mist|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/bouncy-scarce-quark|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/grizzled-prism-measure|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/tested-petalite-medusaceratops|https://c6e40584-99e4-4343-b478-6da9bee2a284@api.glitch.com/git/sparkly-tin-veterinarian`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();