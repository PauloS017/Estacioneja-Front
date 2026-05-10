import md5 from "md5"

export function getGravatarUrl(email?: string, size = 150): string | undefined {
  if (!email) return

  const hash = md5(email.trim().toLowerCase())
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}
