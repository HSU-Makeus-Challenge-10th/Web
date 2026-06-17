export function getRatingColor(voteAverage: number): string {
  if (voteAverage >= 7) return "bg-green-500";
  if (voteAverage >= 5) return "bg-yellow-500";
  return "bg-red-500";
}
