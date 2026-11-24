# Bookworm | 도서 관리 시스템

React와 Vite로 만든 도서 관리 웹 애플리케이션입니다. 도서의 정보를 등록·조회·수정·삭제하고, 검색 및 장르별 필터링을 통해 나만의 서재를 관리할 수 있습니다.

> 이 README는 현재 프로젝트 소스코드를 기준으로 작성했습니다. 별도의 백엔드 서버 대신 `json-server`와 `db.json`을 사용합니다.

## 1. 주요 기능

- **도서 목록 조회**: 등록된 도서를 카드 형태로 표시하고 표지 이미지가 없으면 기본 표지 표시
- **도서 상세 보기**: 제목, 작가, 종류, 내용, 좋아요, 생성일 및 수정일 확인
- **도서 등록**: 제목, 작가, 종류, 내용, 표지 이미지 URL 입력
- **도서 수정 및 삭제**: 기존 정보 수정, 삭제 전 확인창 표시
- **도서 검색 및 필터링**: 책 제목/작가 검색, 종류별 필터
- **좋아요**: 도서별 좋아요 표시 및 해제
- **인기 도서 TOP 3**: 좋아요 수를 기준으로 상위 도서 표시

현재 화면의 **AI Integration** 메뉴는 UI 요소이며, AI 표지 이미지 생성 기능은 아직 연결되어 있지 않습니다. 표지는 현재 이미지 URL을 직접 입력하는 방식입니다.

## 2. 사용 기술

| 구분 | 기술 |
| --- | --- |
| 프론트엔드 | React, JavaScript(JSX), HTML, CSS |
| 개발 도구 | Vite |
| 데이터 저장 및 API | `json-server`, `db.json` |
| 통신 방식 | Fetch API (GET, POST, PATCH, DELETE) |

현재 `package.json`에는 React, Vite 등의 의존성이 포함되어 있습니다. **`json-server`는 `package.json`에 등록되어 있지 않으므로** 아래 실행 방법에서 `npx`로 별도 실행합니다.

## 3. 프로젝트 구조

```text
my-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                 # 이미지 등 정적 리소스
│   ├── components/
│   │   ├── BookList.jsx        # 도서 목록 카드
│   │   ├── BookDetail.jsx      # 도서 상세 모달
│   │   ├── BookCreate.jsx      # 도서 등록 모달
│   │   ├── BookEdit.jsx        # 도서 수정 모달
│   │   └── BookForm.jsx        # 등록/수정 공통 입력 폼
│   ├── App.jsx                 # 화면 구성, 상태 및 API 연동
│   ├── App.css                 # 도서관리 화면 스타일
│   ├── index.css               # 전역 스타일
│   └── main.jsx                # React 진입점
├── db.json                     # 도서 데이터
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 4. 실행 방법

### 4-1. 프로젝트 준비

Node.js와 npm이 설치되어 있어야 합니다. 현재 사용 중인 Vite 8은 **Node.js 20.19 이상(20.x 계열) 또는 22.12 이상** 버전을 요구합니다.

터미널에서 `package.json`이 있는 `my-app` 폴더로 이동한 뒤 의존성을 설치합니다.

```bash
cd my-app
npm install
```

### 4-2. 도서 데이터 서버 실행 (첫 번째 터미널)

```bash
npx json-server db.json --port 3000
```

정상 실행되면 브라우저에서 `http://localhost:3000/books`에 접속해 도서 데이터가 JSON으로 표시되는지 확인합니다. 최초 실행 시 `npx`가 `json-server` 설치 여부를 물어볼 수 있습니다.

### 4-3. React 웹사이트 실행 (두 번째 터미널)

첫 번째 터미널은 종료하지 않고 **새 터미널**을 열어 실행합니다.

```bash
npm run dev
```

터미널에 표시되는 Vite 주소(일반적으로 `http://localhost:5173/`)로 접속합니다.

> **Windows PowerShell 참고:** `npm` 또는 `npx` 실행 정책 오류가 발생하면 `npm.cmd install`, `npx.cmd json-server db.json --port 3000`, `npm.cmd run dev`를 사용해 볼 수 있습니다.

**주의:** 웹사이트는 기본적으로 `http://localhost:3000/books`를 요청하므로, 도서 목록 및 CRUD 기능을 사용하려면 json-server가 실행 중이어야 합니다. 다른 포트를 사용하는 경우 `src/App.jsx`의 `API_URL`도 변경해야 합니다.

## 5. 데이터 구조

`db.json`의 `books` 배열에 각 도서가 저장됩니다. 주요 필드는 다음과 같습니다.

| 필드 | 설명 |
| --- | --- |
| `id` | 도서 고유 ID (문자열) |
| `title` | 제목 |
| `author` | 작가 |
| `type` | 도서 종류/장르 |
| `content` | 책 내용 |
| `coverImageUrl` | 표지 이미지 주소 |
| `likes` | 좋아요 수 |
| `liked` | 좋아요 선택 상태 |
| `createdAt` | 등록 시각 |
| `updatedAt` | 마지막 수정 시각 |

현재 도서 등록 시 `createdAt`, `updatedAt`, `likes`, `liked` 값을 추가하며, 서버가 신규 도서의 `id`를 생성합니다.

## 6. API 구성

기본 주소: `http://localhost:3000/books`

| 기능 | HTTP 메서드 | 주소 |
| --- | --- | --- |
| 도서 목록 조회 | `GET` | `/books` |
| 도서 등록 | `POST` | `/books` |
| 도서 수정 | `PATCH` | `/books/:id` |
| 도서 삭제 | `DELETE` | `/books/:id` |
| 좋아요 변경 | `PATCH` | `/books/:id` |

`App.jsx`의 `fetch()`가 위 API를 호출하며, 응답에 따라 React State를 갱신합니다.

## 7. 화면 구성 및 사용 방법

1. **My Library**: 전체 도서 목록과 좋아요 수 기준 인기 도서 TOP 3를 확인합니다.
2. **검색/필터**: 상단 검색창에 제목 또는 작가를 입력하거나 도서 종류를 선택합니다.
3. **도서 등록**: `Add New Book` 카드를 눌러 도서 정보를 입력합니다.
4. **상세 보기**: 도서 카드의 표지 또는 `상세보기` 버튼을 눌러 상세 정보를 확인합니다.
5. **수정/삭제**: 상세 창에서 수정 또는 삭제 버튼을 사용합니다.
6. **좋아요**: 도서 카드의 하트 버튼을 눌러 좋아요 상태를 변경합니다.

등록, 수정, 삭제 및 좋아요 변경 결과는 실행 중인 json-server를 통해 `db.json`에 반영됩니다.

## 8. 참고 사항

- 실제 데이터 저장은 로컬 `db.json` 기반입니다. 별도의 배포용 데이터베이스나 사용자 계정 기능은 포함되어 있지 않습니다.
- AI 표지 생성 기능은 아직 구현되지 않았으며, 현재는 사용자가 이미지 URL을 입력할 수 있습니다.
- `node_modules`와 `dist`는 Git 관리 대상에서 제외하도록 `.gitignore`에 설정되어 있습니다.
