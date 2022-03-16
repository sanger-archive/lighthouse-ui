FROM node:14.17

WORKDIR /code
ADD . /code/

RUN npm ci

# build for production
RUN npm run build

# generate static project
RUN npm run generate

CMD ["npm", "start", "--", "--port", "8000", "--hostname", "0.0.0.0"]

HEALTHCHECK --interval=1m --timeout=5s \
    CMD curl -f http://localhost:8000/health || exit 1
