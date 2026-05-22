export const calculateTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);

  // 날짜 문자열이 유효하지 않은 경우 원본을 반환합니다.
  if (isNaN(past.getTime())) {
    return dateString;
  }

  const diffInMinutes = Math.floor(
    (now.getTime() - past.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return `방금 전`;
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 24 * 60)
    return `${Math.floor(diffInMinutes / 60)}시간 전`;
  if (diffInMinutes < 30 * 24 * 60)
    return `${Math.floor(diffInMinutes / (24 * 60))}일 전`;

  // 30일 이상이면 간단한 날짜 형식으로 반환 (예시)
  return past.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
