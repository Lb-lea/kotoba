FROM node:12.10.0

RUN apt-get update
RUN apt-get -y install ffmpeg mongodb

WORKDIR /var
COPY ./node-common ./node-common
COPY ./common ./common
WORKDIR /var/node-common
RUN npm ci

WORKDIR /var/app

COPY ./bot/package.json .
COPY ./bot/package-lock.json .
RUN npm ci

RUN mkdir ../resources
COPY ./resources/dictionaries ./../resources/dictionaries
COPY ./bot/src/common/pronunciation_db.js ./src/common/pronunciation_db.js
COPY ./bot/src/common/mongo_connect.js ./src/common/mongo_connect.js
COPY ./bot/src/build ./src/build
RUN service mongodb start ; sleep 15 && npm run buildpronunciation && npm run buildshiritori

COPY ./resources/quiz_audio ./../resources/quiz_audio

COPY ./resources/fonts ./../resources/fonts
COPY ./bot/src/common/font_helper.js ./src/common/font_helper.js
RUN npm run buildfontcharactermap

COPY ./resources/quiz_data ./../resources/quiz_data
RUN npm run buildquiz

RUN mkdir data

COPY ./bot/start.sh ./start.sh
COPY ./bot/src ./src

RUN chmod +x ./start.sh
CMD ["./start.sh"]
