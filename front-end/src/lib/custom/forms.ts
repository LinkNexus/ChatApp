import { ApiError } from "./fetch"

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