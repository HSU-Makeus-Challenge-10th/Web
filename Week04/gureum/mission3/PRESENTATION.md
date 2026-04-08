# Week04 Mission2 발표 자료

## 1) 프로젝트 목표
- 로그인/회원가입 화면 구현
- 입력 유효성 검사 및 에러 메시지 표시
- 조건부 버튼 활성화
- `useForm` 커스텀 훅으로 폼 상태 일원화
- `axios` 기반 API 구조 분리(`axios.ts`, `auth.ts`)

---

## 2) 라우팅/레이아웃 구조
- 공통 레이아웃: `Layout` + `Navbar`
- 하위 라우트:
  - `/` → Home
  - `/login` → Login
  - `/signup` → Signup

핵심: 모든 페이지가 같은 내비바를 쓰도록 `Outlet` 구조로 통일.

---

## 3) 폼 아키텍처
### useForm 훅에서 처리하는 것
- `values`: 현재 입력값
- `touched`: 사용자가 건드린 필드 추적
- `errors`: 검증 결과
- `isFormValid`: 제출 가능 여부
- `getFieldProps()`: 입력 컴포넌트 바인딩 단순화

### 페이지에서 처리하는 것
- 로그인/회원가입별 검증 규칙 정의
- 제출 시 API 호출
- 성공/실패 후 화면 이동 및 에러 처리

---

## 4) API 분리 구조
### axios.ts
- `baseURL` 중앙 관리 (`VITE_SERVER_API_URL`)
- 요청 인터셉터에서 토큰 자동 주입

### auth.ts
- `postSignin()`
- `postSignup()`

장점: 페이지는 네트워크 세부 구현을 몰라도 비즈니스 흐름만 작성 가능.

---

## 5) 로그인 페이지 시연 포인트
1. 뒤로가기 버튼(`navigate(-1)`) 동작 확인
2. 이메일 형식 에러 문구 확인
3. 비밀번호 길이 에러 문구 확인
4. 모든 조건 충족 시에만 로그인 버튼 활성화
5. 로그인 성공 시 토큰 저장 후 홈 이동

---

## 6) 개선 포인트 (다음 단계)
- 서버 에러 메시지 매핑(상태코드별 사용자 문구)
- `zod`/`react-hook-form` 확장
- `AuthLayout` 추가로 인증 화면 배경/여백 전용 레이아웃 분리
- E2E 테스트(Cypress/Playwright)로 폼 시나리오 자동화

---

## 7) 코드 설명 파일
- `src/App.tsx`
- `src/hooks/useForm.ts`
- `src/pages/LoginPage.tsx`
- `src/pages/SignupPage.tsx`
- `src/api/axios.ts`
- `src/api/auth.ts`
- `src/constants/loginValidation.ts`
