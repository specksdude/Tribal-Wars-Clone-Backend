# Tribal wars clone - backend

## 1. How to start

### Install dependencies

```shell
npm install / yarn
```

### Prepare environment

```shell
npm run prepare / yarn prepare
chmod +x .husky/pre-commit
```

## 2. How to build

```shell
npm run build / yarn build
```

If you even encounter strange build behavior, tsconfig is set to create build with cache. Set option `incremental` in
tsConfig to false

## 3. Useful information

### 3.1 Logs folder

#### Linux

```text
~/.cache/"package.json -> productName"/logs
```

#### Windows

```text
~/AppData/Roaming/"package.json -> productName"/logs
```

### 3,2 Docs

#### This project is using swagger docs. You can access them by route http://localhost:5008/docs