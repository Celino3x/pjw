// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center">
          <span className="text-white font-bold text-3xl">JW</span>
        </div>
        <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
          Portal JW
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Sistema de gestão congregacional
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}