export function toDateInputValue(value: string | null | undefined) {
  if (!value) return ""
  return value.slice(0, 10)
}

export function toInputNumber(value: string | number | null | undefined) {
  if (value == null || value === "") return ""
  return String(value)
}
