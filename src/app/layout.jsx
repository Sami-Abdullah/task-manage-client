import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata = { title: "TaskFlow" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="taskflow">
      <body>
        <Navbar/>
        {children}</body>
    </html>
  );
}