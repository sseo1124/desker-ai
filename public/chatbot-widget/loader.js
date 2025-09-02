(() => {
  const loaderScript = document.currentScript;
  const botId = loaderScript.getAttribute("data-bot-id");

  if (!botId) {
    console.error('AI Chatbot: data-bot-id가 없습니다');
    return;
  }

  window.DESKER_CHATBOT_CONFIG = {
    botId,
    // 배포후 서버 도메인 생기는 경우 변경필요
    apiBaseURL: "http://localhost:3000"
  }

  const container = document.createElement('div');
  container.id = "desker-chatbot-widget-container"
  document.body.appendChild(container);

  const widgetScript =document.createElement("script");
  // 배포후 서버 도메인 생기는 경우 변경필요
  widgetScript.src = "http://localhost:3000/chatbot-widget/widget.js"
  widgetScript.async = true;
  document.body.appendChild(widgetScript);
})();
