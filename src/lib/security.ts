// src/lib/security.ts
import crypto from 'crypto'

// Plain !== on a secret comparison leaks timing information proportional to how many
// leading characters match, which can (in theory) help an attacker guess a secret
// faster than brute force alone. crypto.timingSafeEqual runs in constant time for
// equal-length inputs — length itself is checked first since timingSafeEqual throws
// (rather than returning false) when given buffers of different lengths.
export function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}
