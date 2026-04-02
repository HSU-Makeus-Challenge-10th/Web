export default function HomePage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-3xl font-bold text-zinc-50">TMDB 영화 라우팅 미션</h1>
      <p className="text-zinc-300">
        상단 메뉴에서 인기 영화, 상영 중, 평점 높은, 개봉 예정 카테고리를 선택해 보세요.
      </p>
    </section>
  );
}

