FROM node:13.8
COPY package.json /package.json
COPY package-lock.json /package-lock.json
COPY src /src
COPY server /server
COPY public /public
CMD ["npm", "install"]
CMD ["npm", "run", "build:client"]
CMD ["npm", "run", "server"]
