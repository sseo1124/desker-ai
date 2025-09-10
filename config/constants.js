export const URL_INFO = {
  SERVER_BASE_URL: "http://localhost:3000",
};

export const TTL_INFO = {
  SESSION_STORAGE_VISITOR: 7 * 24 * 60 * 60,
};

export const ERROR_MESSAGE = {
  NOT_FOUND_BOTID_VISITORID: "해당 봇이나 방문객을 찾을 수 없습니다",
  SESSION_NOT_FOUND: "조회한 채팅방이 없습니다",
  INVALID_MESSAGES: "유효하지 않는 채팅 메시지 입니다.",
  INTERNAL_SERVER_ERROR_SESSION: "새로운 채팅방 생성하는데 실패했습니다",
  LOGIN_REQUIRED: "로그인이 필요합니다.",
  CHATBOT_NOT_FOUND: "연결된 해당 챗봇이 존재하지 않습니다.",
  CHAT_LIST_FETCH_FAILURE: "대화목록 조회가 실패하였습니다.",
  MESSAGE_FETCH_FAILURE: "상세 대화 조회가 실패하였습니다.",
};

export const SUCCESS_MESSAGE = {
  MESSAGE_FETCH: "대화 조회하였습니다.",
};
