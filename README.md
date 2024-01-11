# Hello World!

This is a simple url shortener app built to explore [Remix](https://remix.run) world.

## Technologies

- (Remix)[https://remix.run]
- (Tailwind CSS)[https://tailwindcss.com/]
- (Drizzle ORM)[https://orm.drizzle.team/]
- (routes-zen)[https://github.com/sandulat/routes-gen]

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
