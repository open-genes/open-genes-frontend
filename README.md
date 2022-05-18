# Open Genes — Frontend

## Before you start

Don't forget to install Angular CLI first

```
npm install -g @angular/cli
```
For more information please visit [https://angular.io/guide/setup-local](Angular official guide)

# Start locally

```
npm i
```

## Frontend

```
npm run start
```

[https://localhost:3000/](https://localhost:3000/)


## Storybook

```
npm run storybook
```

[https://localhost:6006/](https://localhost:6006/)

## IDE settings for development
Please install and set up the following plugins:
- ESLint
- Prettier
- REST Client to support *.http* file extension which is used in a *models* folder ([IDEA](https://plugins.jetbrains.com/plugin/13121-http-client), [VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client))


# Build and deploy

## Build frontend 

- Developers stand test build: `npm run build-dev`
- Demo stand build: `npm run build-demo`
- Production AOT build: `npm run build-prod`

The bundle is being deployed with GitHub Actions. 
Workflow configs for each environment are here:
```
.github/workflows
```

## Build storybook

```
npm run build-storybook
```
Storybook is being deployed with a special GitHub action you can enable in your repository settings.

