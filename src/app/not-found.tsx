import { ChevronLeftCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-transparent text-white">
      <div className="relative">
        <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 blur-2xl opacity-50"></div>
        <h1 className="relative text-9xl font-extrabold tracking-tight text-white drop-shadow-lg">
          404
        </h1>
      </div>

      <p className="mt-6 text-lg font-medium text-gray-800 dark:text-gray-200">
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <p className="mt-2 text-sm opacity-80 text-gray-800 dark:text-gray-200">
        Kamu mungkin salah alamat web atau halaman sudah dihapus.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="group inline-flex items-center rounded-lg bg-white px-6 py-3 text-indigo-700 shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Kembali ke halaman Home
          <ChevronLeftCircle className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default NotFound
