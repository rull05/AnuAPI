FROM node:16
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y \
   libgtk2.0-0 \
   libgtk-3-0 \
   libnotify-dev \
   libgconf-2-4 \
   libnss3 \
   libxss1 \
   libasound2 \
   libxtst6 \
   xauth \
   xvfb \
   libgbm-dev \
   fontconfig \
   fonts-noto-cjk \
 && rm -rf /var/lib/apt/lists/*
RUN fc-list : family

COPY . .

EXPOSE 7070
CMD ["node", "app.js"]