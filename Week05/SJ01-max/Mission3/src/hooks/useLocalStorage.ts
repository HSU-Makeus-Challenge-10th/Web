import { useState } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T) | null) => void
type RemoveValue = () => void

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, SetValue<T>, RemoveValue] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue: SetValue<T> = (value) => {
    try {
      const next = value instanceof Function ? value(state) : value
      setState(next as T)
      if (next == null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(next))
      }
    } catch (error) {
      console.error(`useLocalStorage setValue error [${key}]:`, error)
    }
  }

  const removeValue: RemoveValue = () => {
    setState(defaultValue)
    localStorage.removeItem(key)
  }

  return [state, setValue, removeValue]
}
