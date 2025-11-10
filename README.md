# 🦉 데스커 AI - 홈페이지 안내원
<img width="80%" alt="information-section-image" src="https://github.com/user-attachments/assets/76bcf1a5-ffc1-4b64-9072-ee294615a50f" />

## **프로젝트 개요 📃**
데스커 AI는 홈페이지 내용기반으로 답변하는 AI 안내원 챗봇입니다. 소상공인 기업의 홈페이지는 방문자가 원하는 정보를 즉시 얻기 어려워 이탈률이 높다는 문제를 확인했습니다. 개발 리소스가 없어도 소상공인 기업들이 `<script>` 한 줄로 간편하게 설치 가능하게 설계했습니다. 웹페이지의 실제 정보를 기반으로 정확한 답변을 제공하고, 방문자가 재방문시에도 대화가 이어지는 지속 대화 가능한 AI 안내원 챗봇입니다.

## **역할 🙋🏻‍♂️**
👉 **AI 챗봇 위젯 아키텍처 설계**
- `<script>` 한 줄 배포가 가능한 Shadow DOM + iframe + Lazy Load 기반 위젯 구조 설계

👉 **RAG 기반 지식 검색 시스템 구축**
- `sitemap.xml` 기반 자동 크롤링 · 정제하여 임베딩 후 벡터 검색을 활용하여 "사이트에 존재하는 정보만" 답변하도록 설계

👉 **홈페이지 방문자를 위한 지속 대화 UX 설계**
- `visitorId`를 localStorage에 저장하여 재방문 시 대화가 계속 이어지도록 UX 구현

## **팀 레포지토리 링크 👬**
<div align="center">

[Desker Team Repository](https://github.com/Team-Desker/inform-me-desker-ai/tree/develop) |
[Desker Team Pull Request](https://github.com/Team-Desker/inform-me-desker-ai/pulls?q=is%3Aopen+is%3Apr)

</div>

## 📆 Schedule

### 프로젝트 기간: 2025.08.18(월) ~ 2025.09.11(목)

* 1주차: 프로젝트 기획 및 설계  
* 2주차: 보일러플레이트, 대시보드 공통 레이아웃 UI, 데이터베이스 설정 및 스키마, AI SDK 설정 및 모델 연동
* 3주차: 챗봇 UI, 채팅방 API 연동, 웹 크롤링 API
* 4주차: 회원가입 API 구현,로그인 API 구현, 회원가입 UI, 로그인 UI
<br>

## Tech Stacks 🛠️

### Frontend
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff)
&nbsp;
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=000)
&nbsp;
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=fff)
&nbsp;
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff)
&nbsp;
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-18181B?style=flat-square&logo=shadcnui&logoColor=fff)
&nbsp;

### Backend  
![Next.js APP Router](https://img.shields.io/badge/Next.js_APP_Router-000000?style=flat-square&logo=nextdotjs&logoColor=fff)
&nbsp;
![Auth.js](https://img.shields.io/badge/Auth.js-3B82F6?style=flat-square&logo=auth0&logoColor=fff)
&nbsp;
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=fff)
&nbsp;
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=fff)
&nbsp;

### AI 
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=fff)
&nbsp;
<br>

# 시연 영상 🎬
<p align="center" style="display: flex; justify-content: center; gap: 60px;">

| 로그인 후 대시보드에서 챗봇을 관리 | 사장님 홈페이지에 챗봇을 꼽아 사용 |
|:--:|:--:|
| <img width="450" height="280" alt="Dashboard" src="https://github.com/user-attachments/assets/88727deb-c4ed-41c4-8fbb-959c82f9fb4a" /> | <img width="450" height="280" alt="Widget" src="https://github.com/user-attachments/assets/80049874-76aa-4712-aee8-327d8dfdc728" /> |

</p>

# 목차 📖
- [구현 내용 💻](#구현-내용-)
  * [CDN 기반 챗봇 위젯 임베딩 🤖](#cdn-기반-챗봇-위젯-임베딩-)
  * [RAG 파이프라인 설계 및 구현 🦜](#rag-파이프라인-설계-및-구현-)
  * [홈페이지 방문자 세션 관리 및 대화 지속성 🚪](#홈페이지-방문자-세션-관리-및-대화-지속성-)
- [회고 📚](#회고-)
  
# 구현 내용 💻
## 문제
고객사의 웹사이트는 WordPress, React, imWeb, 정적 HTML 등 기술 환경이 모두 다릅니다. 직접적인 SDK 통합은 유지보수가 어렵고, 스타일 충돌이나 렌더링 오류로 이어지기 쉬웠습니다. 또한 가장 중요한 부분은 외부 챗봇 위젯이 고객사의 웹앱에 초기 로딩 성능이 영향을 미치지 않아야 했습니다.

> **목표** <br>
1️⃣ 고객사 페이지의 스타일과 레이아웃에 영향을 주지 않기 <br>
2️⃣ 성능 부담 없이 작동하는 완전 격리형 환경을 구축하기
>

## CDN 기반 챗봇 위젯 임베딩 🤖
### 설계 개요
- **CDN 로드 기반 배포**
    고객사는 `<script data-bot-id="...">` 한 줄만 삽입하면 됩니다. CMS/정적 페이지/SPA 등 **환경과 무관하게 동일 방식**으로 구동됩니다.
    <img width="1558" height="620" alt="script로 설치하는 장면" src="https://github.com/user-attachments/assets/e3eefe76-5a78-40e2-afde-076c62289ce9" />

- **Shadow DOM 격리**
    위젯은 `loader.js`에서 Shadow Root를 생성해 그 안에 렌더링합니다. 이로써 **호스트 페이지의 CSS/DOM과 위젯의 CSS/DOM이 섞이지 않도록** 캡슐화합니다.
    
- **부분적인 iframe 사용 (채팅방만 분리)**
    **메시지창(채팅 영역)만 `<iframe>`** 으로 분리해 **스타일 완전 절연**을 강화합니다. 기존 `loader.js` 챗봇 아이콘 버튼 로직은 그대로 유지하고, **ChatWindow 컴포넌트** 내부만 iframe으로 교체하는 방식이라 변경 범위가 작습니다. 채팅 UI는 서버의 Next.js 페이지에서 독립적으로 렌더링됩니다.
    
- **Self-contained 위젯 구조**
    Next.js 대시보드와 분리된 **독립 React 앱**으로 빌드합니다. 배포·업데이트는 CDN 기준으로 이루어지고, 호스트 앱과 빌드·런타임을 공유하지 않습니다.
    

### 상세 내용

**1) 챗봇 로더 초기화**

1. `<script data-bot-id="...">` 로더가 DOM Ready 이후 실행된다.
2. 로더는 호스트 컨테이너 `div`를 생성하고, `attachShadow({ mode: 'open' })`로 **Shadow Root**를 붙인다.
3. Shadow 내부에 `#app-root`를 생성하고, **React 위젯(버튼/패널 컨테이너)만** 마운트한다.
4. 최초 렌더는 **버튼 아이콘만** 보여준다. (대화창/모델 통신은 아직 미로딩)
5. 사용자가 버튼을 클릭하면 **`ChatWindow` 컴포넌트**를 지연 로딩하고, 이 컴포넌트는 **iframe**으로 채팅 페이지를 렌더링한다.

> 목적: 초기 렌더 부담 최소화 + 이후 자원은 인터랙션 시점에만 로드.
<img width="584" height="420" alt="script가 주입된 사진" src="https://github.com/user-attachments/assets/ae9e7b79-fdcc-47fb-99ee-b7ee720ab836" />

**2) DOM/스타일 격리 (Shadow DOM + 부분적 iframe 적용)**

- **Shadow DOM(컨테이너/버튼/패널)**
    - Tailwind는 **위젯 전용 빌드를 통해** `public/widget.css` 정적 css 파일 생성
    - css 파일을 `<style>` 태그를 주입하여 Shadow DOM 내부에만 적용
    - 컨테이너는 `position: fixed; bottom/right`로 배치해 **호스트 레이아웃에 영향 없음**.

- **iframe(메시지/대화창)**
    - 메시지 영역(채팅방 UI)만 **별도 iframe**으로 분리해 **완전 절연**.
    - iframe 내부는 **Next.js 페이지**가 독립적으로 렌더(스타일/리소스/상태 완전 분리).
    - 입력창, 채팅, 채팅창 UI를 iframe 안에서 자유롭게 제어 가능.
<img width="577" height="397" alt="shadowDOM + iframe" src="https://github.com/user-attachments/assets/1973c0f1-6c85-4e6f-a34c-899668462c57" />

**3) 번들/빌드 & 배포 (Bundle/Build & CDN)**

- **분리 빌드**: Next.js 대시보드와 **위젯 번들**은 분리. 위젯은 `esbuild`로 최소화/트리쉐이킹.
- **CDN 배포**: 위젯 JS/CSS/이미지 등은 CDN에서 제공.
- **에셋 경로 고정**: 로더에서 CDN 절대경로만 사용(호스트 라우팅/빌드에 의존하지 않음).

## RAG 파이프라인 설계 및 구현 🦜

### 문제

이 프로젝트의 챗봇은 단순히 대화형 AI가 아니라, “홈페이지 안내원”이라는 명확한 역할을 가지고 있습니다. 즉, 사용자가 물어보는 내용이 **홈페이지 내 정보와 직접적으로 관련된 경우에만 답변**해야 하고, 사이트와 무관한 질문에는 **“해당 범위를 벗어난 질문”임을 명확히 안내해야** 합니다.
이는 기존 챗봇의 “지식 부족” 문제와는 다릅니다. 핵심은 **모델이 ‘어디까지를 알아야 하는가’의 경계를 명확히 설정하는 것**이었고, 이를 위해 **사이트맵 기반 RAG(Retrieval-Augmented Generation)** 구조를 도입했습니다.

### 설계 개요

- **사이트맵 기반 데이터 수집**
    `sitemap.xml`에서 제공하는 모든 페이지를 탐색하고, 각 페이지의 텍스트를 정제해 RAG 학습용 마크다운 문서로 변환했습니다. 이렇게 확보된 문서 집합이 곧 챗봇이 답변할 수 있는 유효 범위(scope)가 됩니다.
    
- **벡터 임베딩 및 저장**
    각 문서를 의미 단위로 분리(chunking)하고, Google `text-embedding-004` 모델을 이용해 벡터로 변환한 뒤 **Pinecone**에 저장했습니다. 고객사별로 `namespace = botId` 구조를 사용해 데이터가 서로 섞이지 않도록 분리했습니다.
    
- **관련성 판정 및 스코프 게이트**
    사용자의 질문을 임베딩한 후, Pinecone에서 상위 K개의 관련 문서를 검색합니다. 이때 관련성 점수(relevance score)가 기준치 이하이거나, 사이트맵 범위 밖의 내용이 검출되면 해당 질문을 “스코프 외”로 분류하여 답변하지 않습니다.
    
- **프롬프트 가드레일 적용**
    모델 프롬프트에 “사이트에서 수집한 문서에 근거하지 않은 답변은 하지 않는다”는 규칙을 명시적으로 주입했습니다. 이를 통해 추측성 답변이나 일반 지식 기반 응답을 원천적으로 차단했습니다.
    
### 상세 내용

**1) 사이트맵 크롤링과 데이터 정제**

`sitemap.xml` 또는 `sitemap_index.xml`을 기준으로 모든 하위 사이트맵(`page-sitemap.xml`, `post-sitemap.xml` 등)을 재귀적으로 탐색합니다. <br>
각 URL의 HTML을 `cheerio`로 파싱한 뒤, 불필요한 영역(`<header>`, `<footer>`, `<nav>` 등)을 제거하고 `node-html-markdown`을 이용해 구조를 유지한 Markdown 형태로 변환합니다. <br>
이 과정을 통해 모델이 “홈페이지에서 실제로 읽을 수 있는 콘텐츠만” 학습하게 했습니다.
<img width="1196" height="493" alt="site맵 사진" src="https://github.com/user-attachments/assets/906f5e64-1338-4adb-bf71-09023f99a684" />

**2) 벡터 임베딩 및 저장**

- 문서를 일정 길이 단위로 나누어(`RecursiveCharacterTextSplitter`)의미 단절이 발생하지 않도록 했습니다. 
- 각 청크를 `embedMany`를 통해 임베딩한 후 Pinecone에 저장했으며, 저장 시 고객사별로 namespace를 `botId` 기준으로 분리해 데이터 혼합을 방지했습니다.
- 각 벡터에는 해당 페이지 URL, 제목, 섹션 정보를 메타데이터로 함께 저장했습니다.
<img width="712" height="461" alt="botId 기준으로 Namespace 구별" src="https://github.com/user-attachments/assets/03c37f45-cad8-4fe9-a6b7-d33a2a1fa7c5" />
<img width="1571" height="721" alt="백터DB에 메타데이터 저장된 장면" src="https://github.com/user-attachments/assets/6c90ce3c-ca5a-44a5-b635-2f9c9a8f046f" />

```jsx
const chunks = await splitter.createDocuments(
      crawledData.map((data) => data.content),
      crawledData.map((data) => ({ url: data.url }))
    );

    const embeddingModel = google.textEmbedding("text-embedding-004");

    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const textsToEmbed = batch.map((chunk) => chunk.pageContent);
      const { embeddings } = await embedMany({
        model: embeddingModel,
        values: textsToEmbed,
      });

      const vectors = embeddings.map((embedding, index) => {
        const chunk = batch[index];
        return {
          id: generateId(),
          values: embedding,
          metadata: {
            text: chunk.pageContent,
            url: chunk.metadata.url,
          },
        };
      });

      await pineconeIndex.namespace(botId).upsert(vectors)
```

**3) 관련성 판정 및 컨텍스트 주입**
사용자의 질문을 임베딩한 후, Pinecone에서 상위 K개의 관련 문서를 검색합니다. 이때 관련성 점수(relevance score)가 기준치 이하이거나, 사이트맵 범위 밖의 내용이 검출되면 해당 질문을 “스코프 외”로 분류하여 답변하지 않습니다.

```jsx
    const queryResult = await pineconeNamespace.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });
    
    const qualifyingDocs = matches.filter(
      (match) => match.score && match.score > minScore
    );
```

**4) 응답 처리 및 거절 메시지**

컨텍스트가 없는 경우에는 사전에 정의된 템플릿을 기반으로 정중한 안내 메시지를 반환합니다.

예시 응답: <br>
> “이 질문은 홈페이지 안내 범위를 벗어나 있습니다.
> 
> 
> 관련된 내용은 홈페이지의 ‘회사 소개’ 또는 ‘제품 안내’ 페이지에서 확인하실 수 있습니다.”
> 
이 방식으로 **비즈니스 맥락을 유지한 자연스러운 거절 UX**를 구현했습니다.

## 홈페이지 방문자 세션 관리 및 대화 지속성 🚪

### 문제
방문자가 브라우저를 닫거나 페이지를 새로 고침했을때, 이전 대화가 모두 사라지고 매번 처음부터 대화를 시작해야하는 구조는 **방문자 경험(UX)**를 크게 저해합니다. 특히 기업 소개나 제품 안내 특성상, 방문자는 짧은 시간 간격으로 여러 번 돌아오며 “이전에 물어봤던 대화 내용의 연속성”을 기대합니다. 
그러나, 기존 세션 방식에서는 매 접속마다 새로운 대화 세션이 생성되어 질문 맥락이 단절되고, 이전 대화 내용을 다시 불러올 수 없었습니다. 그래서 브라우저를 닫거나 새로 열어도 대화 맥락이 그대로 유지되는 구조가 필요했습니다.

### 설계 개요

- **VisitorId 기반 식별 구조:**
    
    각 브라우저에 고유한 `visitorId`를 생성하여 `localStorage`에 저장.
    
    사용자가 다시 사이트를 방문했을 때, 이 ID를 기반으로 **마지막 대화 세션을 복원**한다.
    
- **세션 재활용(Get-or-Create):**
    
    서버는 `(botId, visitorId)` 조합으로 가장 최근 세션을 찾아 반환하고,
    
    존재하지 않을 경우 새 세션을 생성한다.
    
- **TTL(Time To Live) 정책:**
    
    7일 이상 방문이 없는 경우, 사용자가 관심을 잃었다고 판단해
    
    기존 대화를 초기화하고 새로운 세션을 시작한다.
    
    (즉, TTL은 “관심 종료”를 판단하는 기준이지, 일반 세션 만료는 아니다.)
    

### 상세 내용

**1) visitorId 기반 세션 연결 요청**

`visitorId`는 브라우저 단위의 익명 식별자로, `localStorage`에 저장되어 대화 세션이 종료되어도 유지된다.

`visitorId` 를 랜덤한 UUID를 생성해서 `{ id, createdAt }` 형태로 localStorage에 저장한다. 이미 저정된 visitorId가 존재하고 TTL이 유효하면 그대로 재사용한다.

```jsx
import { createIdGenerator } from "ai";
import { TTL_INFO } from "@/config/constants";
import ls from "localstorage-slim";

const VISITOR_ID_KEY = "desker-visitor-ai";
const generateVisitorId = createIdGenerator({ prefix: "visitor" });

export const getOrSetVisitorId = () => {
  const existingId = ls.get(VISITOR_ID_KEY);

  if (existingId) {
    ls.set(VISITOR_ID_KEY, existingId, {
      ttl: TTL_INFO.SESSION_STORAGE_VISITOR,
    });
    return existingId;
  }

  const newVisitorId = generateVisitorId();
  ls.set(VISITOR_ID_KEY, newVisitorId, {
    ttl: TTL_INFO.SESSION_STORAGE_VISITOR,
  });

  return newVisitorId;
```

> 이렇게 생성된 visitorId는 “브라우저 단위”로 고유하며, 
동일한 PC/브라우저에서는 탭을 닫거나 재부팅해도 유지된다.
> 

**2) 기존 방문자 식별 및 세션 복원**
`visitorId`와 `botId` 로 서버는 DB에서 세션을 검색한다. 존재하면 해당 `sessionId` 반환을 받아 이전 대화 내용 기록을 받을 수 있다. 만약 존재하지 않으면 `POST` 요청을 해서 해당 방문자 기준으로 새로운 채팅방 세션을 생성을 한다. 

```jsx
const initializeChatSession = async () => {
      try {
        const responseToGetSession = await fetch(
          `${apiBaseURL}/api/chat/session?botId=${botId}&visitorId=${visitorId}`
        );

        if (responseToGetSession.ok) {
          const chatSessionData = await responseToGetSession.json();
          setChatSessionId(chatSessionData.chatSessionId);
          return;
        }

        if (responseToGetSession.status === 404) {
          const responseToCreateSession = await fetch(
            `${apiBaseURL}/api/chat/session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ botId, visitorId }),
            }
          );
```

> 이 구조 덕분에 **방문자는 로그인하지 않아도 자신만의 대화 맥락을 이어갈 수 있다.**
> 

**3) TTL 정책의 의미**

TTL은 “대화 세션 만료”가 아니라, “관심이 완전히 사라졌다고 판단하는 시점”에 맞춰

`visitorId`를 제거하는 **비즈니스 로직용 만료 기준**이다.

- `localStorage`는 브라우저를 닫거나 재부팅해도 데이터가 남는다.
- 따라서 한 달 뒤에 다시 돌아온 사용자의 대화를 유지하는 것은 UX적으로 자연스럽지 않다.
- 이에 따라 **7일간 재방문이 없으면 visitorId가 만료**되어
    
    다음 접속 시 새로운 ID로 새 세션이 생성된다.
    

> TTL은 “관심이 완전히 끊긴 사용자에 대한 자연스러운 초기화 장치”이며,
> 
> 
> 일상적인 브라우저 재방문에서는 전혀 영향을 주지 않는다.
> 

# 회고 📚



