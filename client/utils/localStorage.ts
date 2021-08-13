export const localStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage
  }
  return { 
    setItem: () => null,
    getItem: () => null,
    removeItem: () => null,
  }
}