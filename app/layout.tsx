import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'poristiwa.my.id',
  description: 'The ultimate news aggregator for authoritative, engaging, and lightweight news delivery.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        {/* HilltopAds scripts */}
        <script async src="https://js.hilltopads.com/tag.min.js"></script>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
