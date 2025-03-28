import { type UseBoundStore } from 'zustand/react';
import { type StoreApi } from 'zustand/vanilla';
import type { ApiError } from './fetch';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

export const isWindowDefined = () => typeof window !== 'undefined'

export function formErrors(error: ApiError | null, setError: (error: ApiError | null) => void) {
  const violations = error?.data.violations as Record<string, string>[]

  return {
    getError: (name: string) => violations?.find(v => v.propertyPath === name)?.message,
    hasError: (name: string) => !!violations?.find(v => v.propertyPath === name),
    clearError: function (name: string) {
      if (!violations) return
      const index = violations.findIndex(v => v.propertyPath === name)
      if (index !== -1) {
        violations.splice(index, 1)
        if (error) 
          setError({ ...error, data: { violations } })
      }
    }
  }
}