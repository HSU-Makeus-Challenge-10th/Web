import { useCallback, useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...args: any[]) => any>(fn: T, interval: number): (...args: Parameters<T>) => void {
  const shouldWait = useRef(false)
  const fnRef = useRef<T>(fn)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fnRef.current = fn
  })

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return useCallback((...args: Parameters<T>) => {
    if (shouldWait.current) {
      console.log('쓰로틀: 요청 무시됨')
      return
    }
    console.log('✅ 쓰로틀 실행됨: 다음 페이지 요청')
    fnRef.current(...args)
    shouldWait.current = true
    timerRef.current = setTimeout(() => {
      shouldWait.current = false
      timerRef.current = null
    }, interval)
  }, [interval])
}
