// frontend/src/pages/NotFoundPage.jsx
// Halaman 404 - muncul kalau user akses URL yang tidak ada

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-red-500">404</div>
        <div className="text-white text-xl mt-4">Halaman tidak ditemukan</div>
      </div>
    </div>
  )
}

export default NotFoundPage