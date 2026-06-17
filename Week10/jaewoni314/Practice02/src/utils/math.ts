export function isPrime(num: number): boolean {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

export function findPrimeNumbers(max: number): (number | null)[] {
  if (!Number.isFinite(max)) return []; 
  const safeMax = Math.floor(max);
  if (safeMax < 2) return [];

  const sieve = new Array<boolean>(safeMax + 1).fill(true); 
  sieve[0] = false;
  sieve[1] = false;

for (let i = 2; i * i <= safeMax; i++) {
  if (sieve[i]) {
    for (let j = i * i; j <= safeMax; j += i) {
      sieve[j] = false;
    }
  }
}

  return sieve.map((isPrimeValue, num) => (isPrimeValue ? num : null));
}
