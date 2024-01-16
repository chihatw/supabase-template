import Header from '@/components/header';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='bg-slate-100 min-h-screen'>
        <Header />
        <div className='pt-10 mx-auto max-w-xs'>{children}</div>
      </body>
    </html>
  );
}
