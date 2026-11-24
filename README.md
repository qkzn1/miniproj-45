# 📚 Bookworm — AI 표지 생성 도서 관리 시스템

> **React와 Vite로 구현한 개인 도서 관리 웹 애플리케이션**  
> 도서 등록·조회·수정·삭제(CRUD)를 비롯해 검색·장르별 필터링·좋아요 기능을 제공하고, **AI Integration** 탭에서 OpenAI 기반 도서 표지를 생성합니다.

## 1. 프로젝트 소개

Bookworm은 사용자가 책의 제목, 저자, 장르, 내용을 직접 등록하고 나만의 서재를 관리할 수 있는 서비스입니다. 등록한 도서의 정보를 바탕으로 **GPT Image 2**를 호출하여 새로운 표지를 만들고, 이를 도서 데이터에 반영하는 기능을 구현했습니다.

- **프로젝트 유형:** React 기반 도서 관리 미니프로젝트
- **개발 환경:** React, Vite, JavaScript, CSS, json-server
- **데이터 관리:** 로컬 `db.json` 기반 REST API
- **AI 활용:** OpenAI 이미지 생성 API (`gpt-image-2`)

> **![메인페이지](miniproj-45/public/cap1.png)**

## 2. 주요 기능

| 기능 | 설명 |
| --- | --- |
| 도서 목록 조회 | 등록된 도서를 카드 형태로 확인하고 표지가 없을 때 기본 표지 표시 |
| 상세 조회 | 제목, 저자, 장르, 내용, 좋아요, 생성일, 수정일 확인 |
| 도서 등록 | 제목·저자·장르·내용을 입력해 새 도서 등록 |
| 도서 수정·삭제 | 기존 정보 수정, 삭제 전 확인 메시지 제공 |
| 검색 및 장르 필터 | 제목·저자 검색 및 도서 종류별 필터링 |
| 좋아요 및 인기 도서 | 좋아요 추가·해제, 좋아요 기준 인기 도서 TOP 3 |
| 페이지네이션 | 도서 목록을 페이지당 8권씩 표시 |
| 다크 모드 | 화면 테마 전환 및 Settings 메뉴 제공 |
| AI 표지 생성 | AI Integration에서 도서를 선택해 표지 이미지 생성 및 미리보기 |
| AI 표지 저장 | 생성 이미지를 선택한 도서의 `coverImageUrl`에 반영하도록 PATCH 요청 |

## 3. 주요 화면

### 3.1 My Library — 도서 목록

상단 검색창과 장르 필터를 이용해 도서를 탐색하고, 등록된 도서를 카드 형태로 확인할 수 있습니다. 좋아요 수를 기준으로 인기 도서 TOP 3도 표시합니다.

> **![Library 탭](miniproj-45/public/cap2)**

### 3.2 도서 등록

`+ New Book` 버튼을 클릭하여 제목, 저자, 장르 및 도서 내용을 입력하고 새 도서를 추가합니다.

> **![도서 등록](miniproj-45/public/cap3)**

### 3.3 도서 상세 조회 및 수정·삭제

도서 카드를 선택하면 상세 모달에서 도서 정보와 표지를 볼 수 있습니다. 수정 기능으로 기존 정보를 변경하거나, 삭제 확인창을 거쳐 도서를 삭제할 수 있습니다.

> **![도서 상세 정보](miniproj-45/public/cap4)**
>
> **![도서 수정](miniproj-45/public/cap5)**

### 3.4 AI Integration — AI 도서 표지 생성

1. **AI Integration** 탭에서 표지를 생성할 도서를 선택합니다.
2. 개인 **OpenAI API Key**를 입력합니다. 입력창은 `type="password"`로 표시됩니다.
3. 이미지 품질(`low`, `medium`, `high`, `auto`)을 선택합니다.
4. **AI 표지 생성하기** 버튼을 눌러 OpenAI 이미지 생성 API를 호출합니다.
5. 생성된 이미지를 오른쪽 **미리보기** 영역에서 확인합니다.
6. 코드에서 `PATCH /books/:id` 요청으로 생성된 표지를 해당 도서에 저장하도록 처리합니다.

현재 업로드된 코드의 모델은 **`gpt-image-2`로 고정**되어 있으며, 이미지 크기는 **`1024×1536` 세로형 고정**입니다. 모델 및 이미지 크기를 직접 선택하는 UI는 구현되어 있지 않습니다.

> **![AI Integration 초기 화면](miniproj-45/public/cap6)**
>
> **![AI 표지 생성 성공 화면](miniproj-45/public/cap7)**
>
> **![AI 생성 표지가 도서 카드에 반영된 모습](miniproj-45/public/cap8)**

**주의:** AI 이미지를 생성하면 실제 API 이용 요금이 발생할 수 있습니다. API 키는 브라우저의 React 상태에서 입력·사용되며 `db.json`에 저장하는 로직은 없지만, **현재 구현은 브라우저에서 OpenAI API를 직접 호출**하므로 공개 배포용 보안 구조는 아닙니다.

### 3.5 Settings — 화면 설정

Settings 탭에서 다크 모드 설정을 변경할 수 있습니다. My Library 상단에서도 테마를 전환할 수 있습니다.

> **![Settings 탭 다크 모드 설정](miniproj-45/public/cap9)**

## 4. 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React 19, JavaScript (JSX), HTML, CSS |
| Build Tool | Vite 8 |
| Data API | json-server, Fetch API |
| AI | OpenAI Images API, GPT Image 2 |
| Data | `db.json` |

## 5. 프로젝트 구조

```text
miniproj-45-main/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── monstera.png
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AiCover.jsx       # AI 이미지 생성 및 미리보기
│   │   ├── BookCreate.jsx    # 도서 등록
│   │   ├── BookDetail.jsx    # 도서 상세 조회
│   │   ├── BookEdit.jsx      # 도서 수정
│   │   ├── BookForm.jsx      # 등록·수정 공통 입력 폼
│   │   └── BookList.jsx      # 도서 카드 목록
│   ├── App.jsx               # 메뉴, 상태 관리, REST API 연동
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── db.json                   # 로컬 도서 데이터
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 6. 실행 방법

### 6.1 사전 준비

- **Node.js**와 **npm** 설치
- OpenAI 표지 생성 기능을 사용할 경우 **개인 OpenAI API 키** 준비
- 터미널에서 `package.json`과 `db.json`이 있는 프로젝트 폴더 열기

```bash
npm install
```

### 6.2 도서 데이터 서버 실행 — 터미널 1

팀에서 사용하는 `json-server` 버전으로 실행합니다.

```bash
npx json-server@0.17.4 --watch db.json --port 3000
```

브라우저에서 `http://localhost:3000/books`를 열어 JSON 데이터가 표시되는지 확인합니다.

> **![JSON 응답 화면](miniproj-45/public/cap10)**

### 6.3 React 실행 — 터미널 2

첫 번째 터미널을 종료하지 않고 새 터미널에서 실행합니다.

```bash
npm run dev
```

Vite가 출력한 주소(일반적으로 `http://localhost:5173`)로 접속합니다.

> **Windows PowerShell에서 실행 정책 오류가 나면** `npm.cmd install`, `npx.cmd json-server@0.17.4 --watch db.json --port 3000`, `npm.cmd run dev`를 사용할 수 있습니다.

### 6.4 AI 표지 생성 사용 방법

1. **Library**에서 도서가 정상적으로 조회되는지 확인합니다.
2. **AI Integration** 탭으로 이동합니다.
3. 도서를 선택하고 개인 OpenAI API 키를 입력합니다.
4. 이미지 품질을 설정한 후 **AI 표지 생성하기**를 클릭합니다.
5. 생성된 표지가 미리보기와 도서 카드에 반영되는지 확인합니다.
6. 저장 결과는 `db.json`의 해당 도서 `coverImageUrl` 값으로 확인합니다.

> **API 호출 비용 주의:** 버튼을 다시 누르면 새 이미지 생성을 요청하므로 추가 요금이 발생할 수 있습니다. API 키가 화면·영상·스크린샷·GitHub 커밋에 노출되지 않도록 주의하세요.

## 7. REST API

**Base URL:** `http://localhost:3000/books`

| 기능 | HTTP 메서드 | Endpoint |
| --- | --- | --- |
| 도서 목록 조회 | `GET` | `/books` |
| 도서 상세 조회 | `GET` | `/books/:id` |
| 도서 등록 | `POST` | `/books` |
| 도서 수정 | `PATCH` | `/books/:id` |
| 도서 삭제 | `DELETE` | `/books/:id` |
| 좋아요 변경 | `PATCH` | `/books/:id` |
| AI 표지 저장 | `PATCH` | `/books/:id` |

### 데이터 필드

| 필드 | 설명 |
| --- | --- |
| `id` | 도서 고유 ID |
| `title` | 도서 제목 |
| `author` | 저자 |
| `type` | 장르 |
| `content` | 도서 내용 |
| `coverImageUrl` | 표지 이미지 URL 또는 Base64 Data URL |
| `likes`, `liked` | 좋아요 수와 선택 상태 |
| `createdAt`, `updatedAt` | 등록·수정 시각 |

## 8. 구현 시 고려사항 및 개선 방향

- **이미지 저장 용량:** 생성 이미지를 Base64 Data URL로 `db.json`에 저장하는 방식은 이미지 크기에 따라 요청 크기 제한 및 파일 크기 문제가 발생할 수 있습니다. 향후 이미지를 별도 파일 저장소에 저장하고 URL만 관리하도록 개선할 수 있습니다.
- **저장 성공 검증:** 현재 `App.jsx`의 AI 표지 저장 함수가 오류를 내부에서 처리하기 때문에, 미리보기 성공이 곧 서버 저장 성공을 뜻하지는 않습니다. 실제 PATCH 응답과 `db.json`을 함께 확인해야 합니다.
- **API 키 보안:** 현재 API 키는 브라우저에서 OpenAI로 직접 전송됩니다. 실제 서비스 배포 시 백엔드로 호출을 이전하고, 키는 서버 측에서 안전하게 관리해야 합니다.
- **AI 옵션 확장:** 현재 코드에는 품질 선택만 있으며 모델과 이미지 크기는 고정되어 있습니다. 향후 선택 기능을 추가할 수 있습니다.

## 9. 테스트 체크리스트

- [ ] 도서 목록 및 상세 정보 조회
- [ ] 도서 신규 등록
- [ ] 도서 정보 수정 및 삭제 확인창
- [ ] 제목·저자 검색 및 장르 필터
- [ ] 좋아요 및 인기 도서 TOP 3
- [ ] 페이지네이션 및 다크 모드
- [ ] AI 이미지 생성 및 미리보기
- [ ] PATCH 표지 저장 및 Library 반영
- [ ] 브라우저 새로고침 후 저장 데이터 유지
- [ ] API 오류 메시지 및 로딩 표시

---

### 스크린샷 정리 팁

실제 이미지를 추가할 때 `docs/screenshots/` 폴더를 만든 뒤, 위의 `[스크린샷 삽입: ...]` 문구를 다음처럼 교체하면 GitHub README에서 이미지가 표시됩니다.

```markdown
![Bookworm 메인 화면](./docs/screenshots/01-library.png)
```

**최소 권장 스크린샷 5장:** My Library 전체, 도서 등록, 도서 상세, AI Integration 설정, AI 생성 표지 결과. 추가로 도서 수정 및 Settings 화면을 넣으면 전체 기능을 더 잘 보여줄 수 있습니다.
