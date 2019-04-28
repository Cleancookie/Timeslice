# Timeslice ⏰

A final year project by Alex Law. 🎓

## Prerequisites 🚚

This project requires [Node.js](https://nodejs.org/en/download/) and
[Yarn](https://yarnpkg.com/lang/en/docs/install/). NPM can also be used instead of Yarn.

Versions used during development:

```sh
> node -v
v11.6.0

> yarn -v
1.13.0

> npm -v
6.7.0
```

This project also requires a separate MySQL server. For development,
[Laragon](https://laragon.org/) was used but any MySQL server should work.

## Setup 🛠

When running for the first time, you will need to create a `.env` file. Do this by
copying the contents from `.env.example` found in the [root](./.env.example). 🚨 Make sure your `.env` is not committed! 🚨

Create an empty MySQL database and enter the details inside the `.env` file we just created.

Afterwards, install all dependencies using yarn.

```sh
> yarn install
```

Next you will need to globally install [AdonisJs](https://adonisjs.com).

```sh
> npm i -g @adonisjs/cli
```

Create the tables by running the [migration files](./database/migrations/).

```sh
> adonis migration:run
```

Lastly you can compile front end assets by running [webpack](https://webpack.js.org/)

```sh
> yarn build
```

Optionally, you can database [seeding script](./database/seeds/AlexSeeder.js) however this will require the a username of `Alex` to already exist.

```sh
> adonis seed
```

## Running 🚀

Make sure the code-base is up to date

```sh
> git pull origin master
> yarn install
```

Run the development server by using the [included scripts](./package.json).

```sh
> yarn serve
```

The server will now be accessible at http://127.0.0.1:3333/
