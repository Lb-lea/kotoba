[![Discord Bots](https://discordbots.org/api/widget/251239170058616833.png)](https://discordbots.org/bot/251239170058616833)

# Kotoba

Kotoba is a project with several semi-independent pieces. Those are:

* [Kotoba Discord Bot](https://github.com/mistval/kotoba/tree/master/bot)
* [Kotobaweb.com frontend (React)](https://github.com/mistval/kotoba/tree/master/kotobaweb)
* [Kotobaweb API (Express)](https://github.com/mistval/kotoba/tree/master/api)

In addition to the three main projects there are a few other directories:

* [/common](https://github.com/mistval/kotoba/tree/master/common) - Common code that is intended to be shared between node processes and browser.
* [/node-common](https://github.com/mistval/kotoba/tree/master/node-common) - Common code that is intended to be shared between node processes but not browser.
* [/nginx](https://github.com/mistval/kotoba/tree/master/nginx) - An nginx configuration for proxying HTTP requests to the [frontend](https://github.com/mistval/kotoba/tree/master/kotobaweb) and [API](https://github.com/mistval/kotoba/tree/master/api).
* [/backup](https://github.com/mistval/kotoba/tree/master/backup) - Tools for backing up user data to Google Cloud Storage.
* [/worker](https://github.com/mistval/kotoba/tree/master/worker) - A worker process for doing some heavy lifting for other processes whose event loops should not be blocked.

## Configuration

After cloning the repo, fill out [config/config_sample.js](https://github.com/mistval/kotoba/blob/master/config/config_sample.js) and rename it to **config.js**. You only have to fill out the sections for the components you want to run. For example if you're only going to run the bot, you only have to fill out the **bot** section.

## Self-hosting the bot

After following the configuration instructions:

```sh
sudo apt install docker docker-compose
sudo docker-compose up kotoba-bot kotoba-worker mongo_readwrite
```

The bot will take some time to build and should then come online. Note that it will be missing some fonts and features that are not in this repo. These instructions are for Ubuntu Linux.

## Developing

**Node v12 is recommended**

### Discord bot

```sh
cd ./bot
npm install
npm start
```

The bot will start and come online. Some commands won't work. There are additional steps required to make certain commands work:

* Quiz command
    1. In the ./bot directory, run `npm run buildquiz`.
    2. In the ./bot directory, run `npm run buildfontcharactermap`.
* Pronunciation command
    1. Install **MongoDB** and start it on port 27017 (the default port). You can install it using the instructions for your operating system [here](https://docs.mongodb.com/manual/installation/).
    2. In the ./bot directory, run `npm run buildpronunciation`.
* Shiritori command
    1. Install **MongoDB** and start it on port 27017 (the default port). You can install it using the instructions for your operating system [here](https://docs.mongodb.com/manual/installation/).
    2. In the ./bot directory, run `npm run buildshiritori`.

### KotobaWeb

1. Install **cairo** and **pango**. You can install them using the instructions for your operating system [here](https://github.com/Automattic/node-canvas/wiki/_pages).
2. Install **MongoDB** and start it on port 27017 (the default port). You can install it using the instructions for your operating system [here](https://docs.mongodb.com/manual/installation/).

```sh
cd ./api
npm install
npm run buildall
npm run startdev_nix # Or on Windows: npm run startdev_win

cd ../kotobaweb
npm install
npm start
```

The API will start on port 3000 and the React dev server will start on port 3001. You'll need to setup a reverse proxy server to forward to them appropriately. You can use nginx with a configuration like this:

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;

        location /api {
            client_max_body_size 4M;
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }

        location / {
            proxy_pass http://localhost:3001;
        }
    }
}
```

### Worker process

The worker process handles some heavy lifting so that the event loop doesn't have to block in the bot or API. The bot and API communicate with it via HTTP. It doesn't do much at the moment, and most features work without it, so you can probably ignore it until you're working with a feature that requires it and you notice that HTTP requests to it are failing.

```
cd ./worker
npm install
npm start
```

## Help

[Support](https://discord.gg/f4Gkqku)

## Third party links

Data from the following third parties has been used in Kotoba.

[Jisho.org](https://jisho.org/about)  
[Princeton University Japanese WordNet](http://compling.hss.ntu.edu.sg/wnja/index.en.html)  
[KanjiVG](http://kanjivg.tagaini.net/)  
[Forvo](https://forvo.com/)  
[Merriam-Webster](https://www.merriam-webster.com)  
[Oxford Dictionaries](https://www.oxforddictionaries.com/)  
[Japanese Wiktionary](https://ja.wiktionary.org)  
[EDICT](http://www.edrdg.org/jmdict/edict.html)  
[ENAMDICT](https://www.edrdg.org/enamdict/enamdict_doc.html)  
[Kanjimaji](https://github.com/maurimo/kanimaji)  
[Google Translate](https://translate.google.com/)  
[YouTube](https://www.youtube.com/)  
[Jonathan Waller's site](http://www.tanos.co.uk/)  

In addition various people have contributed quiz data and are credited in the relevant quiz descriptions.

## Child libraries

The following other codebases were written in the course of this project:

* **fpersist** - On disk persistence with safer writes. [GitHub](https://github.com/mistval/fpersist) [NPM](https://www.npmjs.com/package/fpersist)
* **unofficial-jishi-api** - Encapsulates the official Jisho.org API and also provides kanji and example search. [GitHub](https://github.com/mistval/unofficial-jisho-api) [NPM](https://www.npmjs.com/package/unofficial-jisho-api)
* **render-furigana** - Render Japanese text with furigana into a PNG buffer. [GitHub](https://github.com/mistval/render-furigana) [NPM](https://www.npmjs.com/package/render-furigana)
* **monochrome** - A flexible node.js Discord bot core based on Eris. [GitHub](https://github.com/mistval/monochrome) [NPM](https://www.npmjs.com/package/monochrome)
* **jp-verb-deconjugator** - Unconjugate conjugated Japanese verbs. [GitHub](https://github.com/mistval/jp-verb-deconjugator) [NPM](https://www.npmjs.com/package/jp-verbs)
* **shiritori** - A backend engine for playing shiritori. [GitHub](https://github.com/mistval/shiritori) [NPM](https://www.npmjs.com/package/shiritori)
* **array-on-disk** - A module for storing and accessing large arrays on disk. [GitHub](https://github.com/mistval/array-on-disk) [NPM](https://www.npmjs.com/package/disk-array)
