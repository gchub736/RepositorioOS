import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from './components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} bg-[var(--background)] text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        <div className="flex h-screen overflow-hidden gap-4 p-4 pr-4">
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 min-h-0 overflow-y-auto bg-[var(--background)] rounded-2xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}