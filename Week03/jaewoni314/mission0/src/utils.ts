export const getCurrentPath = (): string => window.location.pathname;

export const navigateTo = (path: string): void => {
  // 주소창만 변경
  window.history.pushState({}, '', path);
  // 'pushstate'라는 커스텀 이벤트를 발생시켜 앱이 이를 감지하도록 함
  window.dispatchEvent(new Event('pushstate'));
};
