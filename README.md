# Lighthouse UI

![lint_and_test](https://github.com/sanger/lighthouse-ui/workflows/lint_and_test/badge.svg)
[![codecov](https://codecov.io/gh/sanger/lighthouse-ui/branch/develop/graph/badge.svg)](https://codecov.io/gh/sanger/lighthouse-ui)

A [Nuxt JS](https://nuxtjs.org) application that provides SSRs the ability to interact with the [lighthouse service](https://github.com/sanger/lighthouse) and other LIMS. Some
of the features include:

- Create and download reports which contain the fit to pick samples and their locations
- The ability to scan the barcode of a box or plate and get information about it, such as:
  + whether there is plate map data for the barcode(s)
  + the number of fit to pick samples
  + the number of 'must_sequence' samples
  + the number of 'preferentially_sequence' samples
- Create samples in Sequencescape when scanning in a box? (Sentinel)
- Create a cherrypick batch from Sentinel?
- View the status of the CSV imports from the lighthouse service
- Print labels
- Create and fail plates in the Beckman pipeline

## Table of Contents

<!-- toc -->

- [Requirements for development](#requirements-for-development)
- [Getting started](#getting-started)
  * [Configuring environment](#configuring-environment)
  * [Setup steps](#setup-steps)
- [Running](#running)
- [Testing](#testing)
  * [Running tests](#running-tests)
- [Deployment](#deployment)
- [Miscellaneous](#miscellaneous)
  * [Updating the Table of Contents](#updating-the-table-of-contents)

<!-- tocstop -->

## Requirements for development

The following tools are required for development:

- node (the version used is found in `.nvmrc`)
- yarn

## Getting started

The following services are not required but can be beneficial during development:

- [lighthouse service](https://github.com/sanger/lighthouse)
- [Sequencescape](https://github.com/sanger/sequencescape)

### Configuring environment

Create a `.env` file, or copy the `.env.example`, and update the values to meet your setup.

### Setup steps

Install the require packages:

    yarn install

## Running

To serve the application with hot reloading:

    yarn dev

## Testing

### Running tests

To run the Jest test suite:

    yarn run test

There are also some cypress tests which can be run as follows:

    yarn run cypress run

## Deployment

This project uses a Docker image as the unit of deployment. To create a release for deployment, create a release
in GitHub and wait for the GitHub action to create the Docker image.

The release version should align with the [standards](./standards.md).


## Miscellaneous

### Updating the Table of Contents

To update the table of contents after adding things to this README you can use the [markdown-toc](https://github.com/jonschlinkert/markdown-toc)
node module. To run:

    npx markdown-toc -i README.md
