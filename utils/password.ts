export function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let s = 0
  if (pwd.length >= 6) s++
  if (pwd.length >= 10) s++
  if (pwd.search(/[A-Z]/) !== -1) s++
  if (pwd.search(/[0-9]/) !== -1) s++
  if (pwd.search(/[^A-Za-z0-9]/) !== -1) s++

  if (s <= 1) return { score: s, label: 'Weak', color: 'bg-red-500' }
  if (s <= 2) return { score: s, label: 'Fair', color: 'bg-orange-500' }
  if (s <= 3) return { score: s, label: 'Good', color: 'bg-yellow-500' }
  if (s <= 4) return { score: s, label: 'Strong', color: 'bg-emerald-500' }
  return { score: s, label: 'Very Strong', color: 'bg-emerald-400' }
}

export function hasUpperCase(str: string): boolean {
  return str.search(/[A-Z]/) !== -1
}

export function hasNumber(str: string): boolean {
  return str.search(/[0-9]/) !== -1
}
