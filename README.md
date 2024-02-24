# About Project

## 특징

### 마이크로서비스 아키텍처 구현

    - Nats provider, consumer 패턴을 사용한 이벤트 기반 마이크로서비스
    - 각 마이크로서비스를 독립적으로 배포 가능

### Monorepo 구조

    - Nest.js 프레임워크를 사용한 Monorepo
    - 공통 모듈을 사용한 코드 재사용

### Docker & docker-compose 로컬 개발환경

    - 일관된 개발환경을 위해 도커 컴포즈 사용
    - 도커 이미지를 사용한 배포 & 운영 고려

### Yarn berry 로 빌드 생산성 향상

    - Zero-Instalation로 종속성 install 시간 단축
    - Plug'n'Play로 유령 종속성 제거

### 테스트 코드 작성 (User service에 한함)

    - 유닛 테스트 코드 작성
    - 통합 테스트 코드 작성

### API 문서화 & 테스트

    - Swagger를 사용한 API 문서화 및 테스트

### 운영 & 확장을 고려한 설계

    - test, development, production 데이터베이스 분리
    - 종속성 분리로 서비스 증가 시 유연하게 확장 가능

<br>

## 요구사항 관련

### database 테이블 스키마 id 부여

- 각 테이블에 id를 부여하여 데이터를 식별할 수 있도록 함
- id는 primary key로 자동으로 증가하도록 설정
- 요구사항 중 userId (이메일) 컬럼에 경우
  userId 컬럼과 user.id 의 혼동을 방지하기 위해 id pk로 유지하고 이메일 값을 받아 해당 유저의 식별자로 사용하도록 함 (별도의 userId 컬럼을 추가하지 않음)

### 성공메시지 resultCode 형식 통일

```typescript
// resultCode를 "200 (HttpStatus.OK)" 형식으로 통일
{
  "resultCode": "200 (HttpStatus.OK)",  // <-- resultCode: HttpStatus.OK
  "resultMsg": "OK"
  ...
}
```

### transfer 서비스 중 quota 관련 기능 추가

```typescript
// transfer.service quoteLimitCheck 함수
// quota의 usdAmont 가 1일 한도를 초과할 경우 에러를 반환하도록 함
{
  "resultCode": 400 (HttpStatus.BAD_REQUEST),
  "resultMsg": "오늘 송금 한도 초과 입니다.",
}
```

<br>
<br>

# Project Guide

## 0. Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)

- [Docker Compose](https://docs.docker.com/compose/install/)

- (Optional) if you want to run the project locally Node.js and Yarn are required.

  - [NVM](https://github.com/nvm-sh/nvm) / [Node.js](https://nodejs.org/ko/download/)
  - [Yarn2](https://yarnpkg.com/getting-started/install)

- **Versions**
  > - Language: Typescript 5.3.3
  > - Framework: Nest.js 10.3.0
  > - Node Engine: v20.11.1 (Latest LTS: Iron)
  > - Database: sqlite3 5.1.7
  > - Unit Test : jest 29.7.0
  > - Yarn v4.0.2
  > - Docker 25.0.3, build 4debf41
  > - Docker Compose version v2.24.5-desktop.1

<br>

## 1. Unzip the repository

```bash
# Unzip the project
unzip project.zip

# .env
cp ./.env.example ./.env
cp ./apps/api/.env.example ./apps/api/.env && vi ./apps/api/.env # edit JWT_SECRET
```

<br>

## 2. Start the project

```bash
# (Optional) Activate Docker BiuldKit Option
export DOCKER_BUILDKIT=1

# (Optional) build the project
docker compose build  # 전체 빌드
docker compose build <마이크로서비스명>  # 마이크로서비스별 빌드(api, user, transfer)

# Start the project
docker compose up --build -V [-d]
# -d : Run the project in the background
# -V : Rebuild the project from scratch
```

<br>

## 3. (Optional) Load the fixtures

```bash
# sqlite db is already exsits in the project
cd databases/sqlite/development && ls -al

# (Optional) Load the fixtures
docker-compose exec transfer sh -c "apk --no-cache add sqlite && sqlite3 /usr/src/app/databases/sqlite/development/transfer.sqlite < /usr/src/app/databases/sqlite/init-sqlite.sql"
```

<br>

## 4. test the project

```bash
# test user service
yarn test user # on local
docker compose exec user yarn test user # on docker

# test transfer service (테스트 생략)
yarn test transfer # on local
docker compose exec transfer yarn test transfer # on docker
```

<br>

You can also test the project by browsing to Swagger API \
http://localhost:4000/api-docs

<br>

## 5. Stop the project

```bash
# Stop the project
docker compose down

# Stop all for the project and remove all volumes and orphan containers
docker compose down  -v --rmi all --remove-orphans
```
