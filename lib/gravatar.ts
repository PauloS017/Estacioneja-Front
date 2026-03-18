import md5 from "md5"

export function getGravatarUrl(email?: string, size = 150): string | undefined {
  if(!email) return;
  
  const trimmedEmail = email.trim().toLowerCase();

  const hash = md5(trimmedEmail)
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}
