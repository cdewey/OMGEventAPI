# Events API

# Setup

## Node

This project will require node 10 or higher. Node can be installed from https://nodejs.org/en/.

To install necessary dependencies run the following from the root of the project directory.

```
npm install
```

## Postgres

You can use any postgres instance this setup will show how to set up a local instance to serve as the database. The provided scripts can be easily edited for remote instances.

### Install Postgres

Download and install postgres from their website. https://www.postgresql.org/download/

This setup presumes the user has chosen the username "postgres" and password "password" during installation.

### Open Postgres Terminal

Windows users need to launch the psql shell. Mac users may start postgres with

```sh
psql postgres
```

### Create Database

Create the events database (on windows you may have to enter this command twice if the first one errors out, \*insert "it just works" meme\*)

```sh
CREATE DATABASE events;
```

Connect to your new database

```sh
\c events
```

Create the event table by running the create_event_table.sql file in the /db directory. Note Windows users should use Linux path syntax as windows style can cause a permission denied error.

```sh
\i absolute/path/to/data/create_event_table.sql
```

### Populate Database

The event data is provided in the /db/geo-event-data-full.csv file. They can be easily imported using the /db/import_events.js script.

Before running the script edit the connection details for your Postgres instance. If your are doing a default localhost instance you should only need to change your password.

```
  user: 'postgres',
  host: 'localhost',
  database: 'events',
  password: 'password',
  port: 5432,
```

To run the script

```sh
node /path/to/db/import_events.js
```

## Loopback

The last bit of setup requires configuring the loopback datasource to connect to your Postgres instance. Edit the file /src/datsources/events.datasource.ts. If your are doing a default localhost instance you should only need to change your password.

```
  url: 'postgres://postgres:password@localhost:5432/events',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'events'
```

# Start the API

Start your database if it is not running.

Start the API

```
npm start
```

There is a basic ping to test at http://127.0.0.1:3000/ping.

The API can be explored and tested using LoopBack's provided explore page http://127.0.0.1:3000/explorer/.

Replace the IP address if needed for your instance.

# Default Loop Back Advice

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to understand how you can continue to add features to this application.
