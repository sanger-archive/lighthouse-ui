FROM node:14.16

WORKDIR /code
ADD . /code/

RUN yarn install

# build for production
RUN yarn build

# generate static project
RUN yarn generate

CMD ["yarn", "start", "--port", "8000", "--hostname", "0.0.0.0"]
