// frontend/src/hooks/useSocket.js
// Custom React hook untuk mengelola koneksi Socket.IO
// Dipanggil dari komponen manapun yang butuh data realtime

import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

// URL backend
const SOCKET_URL = 'http://localhost:3002'

// Singleton socket — satu koneksi dipakai semua komponen
let socketInstance = null

function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })
  }
  return socketInstance
}

export function useSocket() {
  const socket = useRef(getSocket())

  // Fungsi untuk emit event ke backend
  const emit = useCallback((event, data) => {
    socket.current.emit(event, data)
  }, [])

  // Fungsi untuk listen event dari backend
  const on = useCallback((event, callback) => {
    socket.current.on(event, callback)
    // Return cleanup function
    return () => socket.current.off(event, callback)
  }, [])

  // Fungsi untuk ganti skenario
  const changeScenario = useCallback((scenario) => {
    socket.current.emit('change_scenario', { scenario })
  }, [])

  return {
    socket: socket.current,
    emit,
    on,
    changeScenario,
    connected: socket.current.connected,
  }
}