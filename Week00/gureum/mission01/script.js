/**
 * Navbar 상호작용 스크립트
 * - 언어 스위처 (KO / EN) 활성화 상태 관리
 * - URL 경로를 기반으로 초기 활성 언어 결정
 * - history.pushState로 URL 반영
 */

const langBtns = document.querySelectorAll('.navbar__lang-btn');

/**
 * 현재 URL 경로에서 언어 코드 추출
 * 예: /ko → 'ko', /en → 'en', 그 외 → 기본값 'ko'
 */
function getLangFromPath() {
  const path = window.location.pathname;
  if (path.includes('/en')) return 'en';
  return 'ko';
}

const menuTexts = document.querySelectorAll('.navbar__menu-text');

/**
 * 특정 언어 버튼을 활성화 상태로 변경
 * BEM Modifier: navbar__lang-btn--active
 * @param {string} lang - 'ko' 또는 'en'
 */
function setActiveLang(lang) {
  // 언어 버튼 활성화 상태 토글
  langBtns.forEach((btn) => {
    if (btn.dataset.lang === lang) {
      btn.classList.add('navbar__lang-btn--active');
    } else {
      btn.classList.remove('navbar__lang-btn--active');
    }
  });

  // 메뉴 텍스트를 선택된 언어로 교체
  menuTexts.forEach((span) => {
    const text = span.dataset[lang];
    if (text) span.textContent = text;
  });

  // html lang 속성도 업데이트
  document.documentElement.lang = lang;
}

/**
 * 언어 버튼 클릭 시 활성 상태 변경 + URL 업데이트
 */
langBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    setActiveLang(lang);

    // URL을 /ko 또는 /en 으로 업데이트 (페이지 새로고침 없이)
    const newPath = '/' + lang;
    history.pushState({ lang }, '', newPath);
  });
});

/**
 * 브라우저의 뒤로가기 / 앞으로가기 시 활성 상태 동기화
 */
window.addEventListener('popstate', (e) => {
  const lang = e.state?.lang ?? getLangFromPath();
  setActiveLang(lang);
});

// 페이지 최초 로드 시 URL 경로 기반으로 활성 언어 설정
setActiveLang(getLangFromPath());
