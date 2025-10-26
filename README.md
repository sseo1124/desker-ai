# 🤖 데스커 AI - 홈페이지 안내원

## **프로젝트 개요 📃**

### 1️⃣ 배경과 문제 정의

대부분의 기업 웹사이트는 이미 충분한 정보를 담고 있습니다. 하지만 대부분의 방문객은 페이지의 내용을 꼼꼼히 읽지 않습니다. 그들은 **일반적인 정보가 아닌, 자신의 상황에 맞는 정보를 즉시 얻고 싶어**하며, 스크롤 몇 번으로 원하는 답을 찾지 못하면 쉽게 이탈합니다.

이 문제는 단순히 “사용자의 인내심 부족”에 그치지 않습니다.

실제 현장에서는 다음과 같은 문제로 이어집니다.

- 고객이 이미 홈페이지에 있는 내용을 다시 문의함
- 반복적인 동일 질문에 **운영자나 대표가 직접 응대해야 하는 피로감 발생**
- FAQ나 게시판이 존재하더라도 사용자는 검색조차 시도하지 않음

### 2️⃣ 해결 방안

이 문제를 해결하기 위해, 웹사이트가 스스로 응답할 수 있는 **AI 홈페이지 안내원**을 설계했습니다. 

방문자는 페이지를 찾지 않아도 질문을 통해 즉시 답을 얻고, 운영자는 반복적인 문의 응대를 줄일 수 있습니다.

기술적으로는 다음 세 가지 축으로 해결했습니다.

- **CDN 기반 챗봇 위젯 임베딩** — `<script>` 한 줄로 모든 사이트에 설치 가능한 AI 안내원
- **방문자 세션 관리 및 대화 지속성** — 비로그인 사용자도 맥락이 유지되는 실시간 대화
- **RAG 파이프라인 설계 및 구현** — 실제 웹사이트 콘텐츠를 학습하는 사실 기반 AI 응답

## CDN 기반 챗봇 위젯 임베딩 🤖

### 문제

고객사의 웹사이트는 WordPress, React, imWeb, 정적 HTML 등 기술 환경이 모두 다릅니다. 직접적인 SDK 통합은 유지보수가 어렵고, 스타일 충돌이나 렌더링 오류로 이어지기 쉬웠습니다. 또한 가장 중요한 부분은 외부 챗봇 위젯이 고객사의 웹앱에 초기 로딩 성능이 영향을 미치지 않아야 했습니다.

> **목표**
1️⃣ 고객사 페이지의 스타일과 레이아웃에 영향을 주지 않기
2️⃣ 성능 부담 없이 작동하는 완전 격리형 환경을 구축하기
> 

### 설계 개요

- **Self-contained 위젯 구조**
    
    Next.js 대시보드와 분리된 **독립 React 앱**으로 빌드합니다. 배포·업데이트는 CDN 기준으로 이루어지고, 호스트 앱과 빌드·런타임을 공유하지 않습니다.
    
- **Shadow DOM 격리**
    
    위젯은 `loader.js`에서 Shadow Root를 생성해 그 안에 렌더링합니다. 이로써 **호스트 페이지의 CSS/DOM과 위젯의 CSS/DOM이 섞이지 않도록** 캡슐화합니다. (Reset CSS, 전역 폰트, z-index 충돌 회피)
    
- **CDN 로드 기반 배포**
    
    고객사는 `<script data-bot-id="...">` 한 줄만 삽입하면 됩니다. CMS/정적 페이지/SPA 등 **환경과 무관하게 동일 방식**으로 구동됩니다.
    
- **지연 로드 & 경량 번들링**
    
    초기에는 **아이콘 버튼만 렌더링**하고, 사용자가 클릭했을 때 **대화창과 AI 통신 모듈을 동적 import**합니다. 불필요한 초기 자원 로딩을 피하는 구조입니다. (esbuild로 트리쉐이킹·압축 적용)
    
- **부분적인 iframe 사용 (채팅방만 분리)**
    
    **메시지창(채팅 영역)만 `<iframe>`** 으로 분리해 **스타일 완전 절연**을 강화합니다. 기존 `loader.js` 챗봇 아이콘 버튼 로직은 그대로 유지하고, **ChatWindow 컴포넌트** 내부만 iframe으로 교체하는 방식이라 변경 범위가 작습니다. 채팅 UI는 서버의 Next.js 페이지에서 독립적으로 렌더링됩니다.
    

### 상세 내용

**1) 로더 초기화 시퀀스 (Loader Init Sequence)**

1. `<script data-bot-id="...">` 로더가 DOM Ready 이후 실행된다.
2. 로더는 호스트 컨테이너 `div`를 생성하고, `attachShadow({ mode: 'open' })`로 **Shadow Root**를 붙인다.
3. Shadow 내부에 `#app-root`를 생성하고, **React 위젯(버튼/패널 컨테이너)만** 마운트한다.
4. 최초 렌더는 **버튼 아이콘만** 보여준다. (대화창/모델 통신은 아직 미로딩)
5. 사용자가 버튼을 클릭하면 **`ChatWindow` 컴포넌트**를 지연 로딩하고, 이 컴포넌트는 **iframe**으로 채팅 페이지를 렌더링한다.

> 목적: 초기 렌더 부담 최소화 + 이후 자원은 인터랙션 시점에만 로드.
> 

**2) DOM/스타일 격리 (Shadow DOM + 부분적 iframe 적용)**

- **Shadow DOM(컨테이너/버튼/패널)**
    - Tailwind는 **위젯 전용 빌드를 통해** `public/widget.css` 정적 css 파일 생성
    - css 파일을 `<style>` 태그를 주입하여 Shadow DOM 내부에만 적용
    - 컨테이너는 `position: fixed; bottom/right`로 배치해 **호스트 레이아웃에 영향 없음**.

- **iframe(메시지/대화창)**
    - 메시지 영역(채팅방 UI)만 **별도 iframe**으로 분리해 **완전 절연**.
    - iframe 내부는 **Next.js 페이지**가 독립적으로 렌더(스타일/리소스/상태 완전 분리).
    - 입력창, 채팅, 채팅창 UI를 iframe 안에서 자유롭게 제어 가능.

**3) 번들/빌드 & 배포 (Bundle/Build & CDN)**

- **분리 빌드**: Next.js 대시보드와 **위젯 번들**은 분리. 위젯은 `esbuild`로 최소화/트리쉐이킹.
- **CDN 배포**: 위젯 JS/CSS/이미지 등은 CDN에서 제공.
- **에셋 경로 고정**: 로더에서 CDN 절대경로만 사용(호스트 라우팅/빌드에 의존하지 않음).

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

## RAG 파이프라인 설계 및 구현 🦜

### 문제

이 프로젝트의 챗봇은 단순히 대화형 AI가 아니라, **“홈페이지 안내원”**이라는 명확한 역할을 가지고 있습니다.

즉, 사용자가 물어보는 내용이 **홈페이지 내 정보와 직접적으로 관련된 경우에만 답변**해야 하고, 사이트와 무관한 질문에는 **“해당 범위를 벗어난 질문”임을 명확히 안내해야** 합니다.

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

`sitemap.xml` 또는 `sitemap_index.xml`을 기준으로 모든 하위 사이트맵(`page-sitemap.xml`, `post-sitemap.xml` 등)을 재귀적으로 탐색합니다. 

각 URL의 HTML을 `cheerio`로 파싱한 뒤, 불필요한 영역(`<header>`, `<footer>`, `<nav>` 등)을 제거하고 `node-html-markdown`을 이용해 구조를 유지한 Markdown 형태로 변환합니다.

이 과정을 통해 모델이 “홈페이지에서 실제로 읽을 수 있는 콘텐츠만” 학습하게 했습니다.

**2) 사이트맵 크롤링과 데이터 정제**

- 문서를 일정 길이 단위로 나누어(`RecursiveCharacterTextSplitter`)
    
    의미 단절이 발생하지 않도록 했습니다.
    
- 각 청크를 `embedMany`를 통해 임베딩한 후 Pinecone에 저장했으며, 저장 시 고객사별로 namespace를 `botId` 기준으로 분리해 데이터 혼합을 방지했습니다.
- 각 벡터에는 해당 페이지 URL, 제목, 섹션 정보를 메타데이터로 함께 저장했습니다.

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

예시 응답:

> “이 질문은 홈페이지 안내 범위를 벗어나 있습니다.
> 
> 
> 관련된 내용은 홈페이지의 ‘회사 소개’ 또는 ‘제품 안내’ 페이지에서 확인하실 수 있습니다.”
> 

이 방식으로 **비즈니스 맥락을 유지한 자연스러운 거절 UX**를 구현했습니다.
