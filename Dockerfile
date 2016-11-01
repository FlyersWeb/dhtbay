FROM node:6

RUN groupadd -r app && useradd -r -g app app

ADD . /var/www
WORKDIR /var/www

RUN npm install --no-optional
CMD ["npm", "start"]
