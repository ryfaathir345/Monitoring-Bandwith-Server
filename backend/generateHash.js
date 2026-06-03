// backend/generateHash.js
// File sementara untuk generate hash password
// Jalankan sekali lalu hapus

import bcrypt from 'bcryptjs'

const passwords = ['admin123', 'operator123']

for (const pwd of passwords) {
  const hash = await bcrypt.hash(pwd, 10)
  console.log(`${pwd} → ${hash}`)
}