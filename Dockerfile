FROM node:14.17

WORKDIR /code
ADD . /code/

RUN npm ci

# build for production
RUN npm run build

# generate static project
RUN npm run generate

CMD ["npm", "start", "--", "--port", "8000", "--hostname", "0.0.0.0"]
