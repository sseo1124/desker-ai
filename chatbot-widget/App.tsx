import React from "react";

interface AppProps {
  config: {
    botId: string;
    apiBaseURL: string;
  };
}

const App = ({ config }: AppProps) => {
  // 테스트 용으로 간단한 위젯 스타일 적용 -> 향후 UI 작업으로 변경할 예정
  const widgetStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    padding: "20px",
    backgroundColor: "gray",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
    zIndex: "9999",
  };

  return (
    <div style={widgetStyle}>
      <h3 style={{ marginTop: 0 }}>챗봇 위젯 로딩 성공!!</h3>
      <p>전달받은 정보:</p>
      <ul>
        <li>Bot ID: {config.botId}</li>
        <li>API URL: {config.apiBaseURL}</li>
      </ul>
    </div>
  );
};

export default App;
