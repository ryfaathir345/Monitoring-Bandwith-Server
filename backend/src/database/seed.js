// backend/src/database/seed.js
// Jalankan SEKALI: node src/database/seed.js

import bcrypt from 'bcryptjs'
import { createUser, findUserByUsername } from '../services/dbService.js'

async function seed() {
  try {
    const existing = await findUserByUsername('admin')
    if (existing) {
      console.log('⚠️  User admin sudah ada, skip.')
      process.exit(0)
    }

    const hashed = await bcrypt.hash('admin123', 10)
    await createUser('admin', hashed, 'admin')
    console.log('✅ User admin berhasil dibuat!')
    console.log('   Username: admin')
    console.log('   Password: admin123')
    process.exit(0)
  } catch (err) {
    console.error('❌ Gagal seed:', err.message)
    process.exit(1)
  }
}

seed()