export const URL_INFO = {
  SERVER_BASE_URL: "http://localhost:3000",
};

export const TTL_INFO = {
  SESSION_STORAGE_VISITOR: 7 * 24 * 60 * 60,
};

export const RAG_SETTINGS = {
  CHUNK_SIZE: 1000,
  CHUNK_OVERLAP: 200,
  BATCH_SIZE: 100,
};

export const CHATBOT_DFAULT_VALUE = {
  NAME: "데스커 안내원",
  COMPANY_URL: "https://www.naver.com",
  ROLE_DESCRIPTION:
    "데스커는 회사에 관련된 모든 질문에만 답변해주는 안내원이야. 부드럽지만, 자신감있고, 상냥한 말투로 항상 존댓말로 대답해줘.",
  CONVERSATION_RULE:
    "만약 '담당자', '메시지 남겨줘' 와 같은 내용이 질문이 있으면 담당자에게 문의남기기 버튼을 보여줘",
  KEYWORD_REPLY_RULE:
    "회사정보에 벗어난 질문을 하게 되면 '죄송합니다. 자사의 관련된 정보 외에는 답변을 드리기 어렵습니다' 라고 답변해줘",
};

export const ERROR_MESSAGE = {
  NOT_FOUND_BOTID_VISITORID: "해당 봇이나 방문객을 찾을 수 없습니다",
  NOT_FOUND_USERID: "User ID 필수 요청사항 입니다.",
  CHATBOT_NOT_FOUND: "소유한 챗봇을 찾을 수 없습니다",
  SESSION_NOT_FOUND: "조회한 채팅방이 없습니다",
  INVALID_MESSAGES: "유효하지 않는 채팅 메시지 입니다.",
  INTERNAL_SERVER_ERROR_SESSION: "새로운 채팅방 생성하는데 실패했습니다",
  INTERNAL_SERVER_ERROR_CHATBOT: "챗봇 조회하는데 서버 에러가 났습니다",
  INTERNAL_SERVER_ERROR_CHATBOT_CREATION:
    "챗봇 생성하는데 서버 에러가 났습니다",
  INTERNAL_SERVER_ERROR_CHATBOT_UPDATE:
    "챗봇 학습 정보 업데이트하는데 서버 에러가 났습니다",
  LOGIN_REQUIRED: "로그인이 필요합니다.",
  CHAT_LIST_FETCH_FAILURE: "대화목록 조회가 실패하였습니다.",
  MESSAGE_FETCH_FAILURE: "상세 대화 조회가 실패하였습니다.",
};

export const SUCCESS_MESSAGE = {
  MESSAGE_FETCH: "대화 조회하였습니다.",
};
