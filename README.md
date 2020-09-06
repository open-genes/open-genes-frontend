# Open Genes — Frontend

Local JIT build: `npm run start`

Dev. stand test build: `npm run build`

Staging stand build: `npm run build-staging`

Prod. AOT build: `npm run build-prod`

---

All builds include the Angular app bundle and static pages.

Static pages are located in `/assets/static` folder and use the same basic styles and resources 
in `/assets` folder.

The main difference between the app and static pages styles is that an app uses Angular CLI 
to include SASS styles in the bundle while static pages use already compiled CSS file.

> TODO: If you find a more reliable way to compile SASS into a separate CSS file in `/assets` folder, please improve this part.

Now CSS for static pages is being compiled by `node-sass`. 
Its task is already included in all previously mentioned build tasks.

It's not a brilliant solution, because we also use PostCSS CLI, Nodemon, and autoprefixer as dev. 
dependencies.

When styles are compiled, Post CSS runs `autoprefixer` which adds cross-browser properties into the compiled 
styles. 

---

If you need to generate CSS again, use:
`npm run static`

To watch changes, use:
`npm run static-w`
