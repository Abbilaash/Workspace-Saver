import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'Workspace Saver — Save your browser workspace. Restore your context.',
  description: 'Workspace Saver is a browser extension that allows users to save their workspace context (tabs, tab groups, windows, scroll, notes) and restore it later with one click.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
