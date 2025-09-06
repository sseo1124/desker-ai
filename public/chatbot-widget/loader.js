(() => {
  const loaderScript = document.currentScript;
  const botId = loaderScript.getAttribute("data-bot-id");

  if (!botId) {
    console.error('AI Chatbot: data-bot-id가 없습니다');
    return;
  }

  const loaderURL = new URL(loaderScript.src);
  const apiBaseURL = loaderURL.origin;

  window.DESKER_CHATBOT_CONFIG = {
    botId,
    apiBaseURL
  }

  const container = document.createElement('div');
  container.id = "desker-chatbot-widget-container"
  document.body.appendChild(container);

  const widgetScript =document.createElement("script");
  widgetScript.src = `${apiBaseURL}/chatbot-widget/widget.js`
  widgetScript.async = true;
  document.body.appendChild(widgetScript);
})();
