FROM node:10

WORKDIR /code
ADD . /code/

RUN yarn install

# build for production
RUN yarn build

# generate static project
RUN yarn generate

RUN yarn start --port 8000 --hostname 0.0.0.0
