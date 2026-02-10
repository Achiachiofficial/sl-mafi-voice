import "./globals.css";
export const metadata = { title: "Gemini AI Live" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="si">
      <body>{children}</body>
    </html>
  );
}
