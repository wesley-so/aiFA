# aiFA Website

A frontend web UI interacts with backend server, built with
[React](https://reactjs.org/) and
[TypeScript](https://www.typescriptlang.org/).

## Prerequisite

- [NodeJS](https://nodejs.org/en/download/) v16 or above
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) v1

## Development quick Start

1. [Start the backend server](../README.md).

2. Copy `.env/sample` to `.env`, and edit necessary environment variables.

3. Install dependency packages:

   ```bash
   yarn install
   ```

4. Start the development server:

   ```bash
   yarn start
   ```

5. apply code styling, linting and unit-testing:

   ```bash
   yarn format
   yarn lint
   yarn test
   ```

## Production build

1. Copy `.env/sample` to `.env`, and edit necessary environment variables.

2. Generate a production build:

   ```bash
   yarn build
   ```

3. The build output will be in `build/` directory.
   Deploy it with web server e.g. Apache, Nginx, etc.
