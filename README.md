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

## 4. test the project

````bash
# Test the project
# test user service
docker compose exec user yarn test user
# test transfer service
docker compose exec transfer yarn test transfer # 난리남 ㅠㅠ
```
You can also test the project by browsing to 
http://localhost:4000/api-docs


## 5. Stop the project
```bash
# Stop the project
docker compose down

# Stop all for the project and remove all volumes and orphan containers
docker compose down  -v --rmi all --remove-orphans
````

<br>

## 6. About the project
### 마이크로서비스 아키텍처 구현
  - Nats Message Server를 사용한 이벤트 기반 마이크로서비스
  - 각 마이크로서비스 독립적으로 배포 가능
  
### Monorepo 구조
  - Nest.js 프레임워크를 사용한 Monorepo
  - 공통 모듈을 사용한 코드 재사용

###  Docker & docker-compose 로컬 개발환경
 - 일관된 개발환경을 위해 도커 컴포즈 사용
 - 도커 이미지를 사용한 배포 & 운영 고려

### Yarn berry 로 빌드 생산성 향상
  - Zero-Instalation로 종속성 install 시간 단축
  - Plug'n'Play로 유령 종속성 제거

### 테스트 코드 작성
  - 유닛 테스트 코드 작성
  - 통합 테스트 코드 일부 작성

### API 문서화 & 테스트
  - Swagger를 사용한 API 문서화 및 테스트

### 확장을 고려한 설계
  - 확장을 고려한 데이터베이스 스키마 설계


## 7. 요구사항 관련
