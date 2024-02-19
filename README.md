# 0. Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)

- [Docker Compose](https://docs.docker.com/compose/install/)

- (Optional) if you want to run the project locally Node.js and Yarn are required.

  - [NVM](https://github.com/nvm-sh/nvm) / [Node.js](https://nodejs.org/ko/download/)
  - [Yarn2](https://yarnpkg.com/getting-started/install)

  > _**Versions**_
  >
  > - Language: Typescript 5.3.3
  > - Framework: Nest.js 10.3.0
  > - Node Engine: v20.11.1 (Latest LTS: Iron)
  > - Database: sqlite3 5.1.7
  > - Unit Test : jest 29.7.0
  > - Yarn v4.0.2
  > - Docker 25.0.3, build 4debf41
  > - Docker Compose version v2.24.5-desktop.1

빌드 시 혹시 맥이 아닌 운영체제를 고려해야 함???

<br>

## 1. Unzip the repository

```bash
# Unzip the project
unzip project.zip

# .env
cp ./.env.example ./.env
cp ./apps/api/.env.example ./apps/api/.env && vi ./apps/api/.env
```

<br>

## 2. Start the project

```bash
# (Optional) Activate Docker BiuldKit Option
export DOCKER_BUILDKIT=1

# Start the project
docker compose up --build -V [-d]
```

<br>

## 3. test the project

````bash
# Test the project
docker compose exec api yarn test <마이크로서비스명> # ??

단위 테스트 및 빌드는 각 마이크로서비스를 기준으로 실행됩니다.

yarn build <마이크로서비스명> 실행 시 nest build  <마이크로서비스명> 실행됨

yarn test <마이크로서비스명> 실행 시 jest <마이크로서비스명> 실행됨

마이크로서비스명: user(회원), transfer(송금)

## 4. Stop the project

```bash
# Stop all for the project and remove all volumes and orphan containers
docker compose down  -v --rmi all --remove-orphans
````

<br>
