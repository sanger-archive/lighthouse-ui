FROM node:10

WORKDIR /code
ADD . /code/

RUN yarn install

# build for production
RUN yarn build

# generate static project
RUN yarn generate
