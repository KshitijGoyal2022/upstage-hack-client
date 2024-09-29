import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/navbar";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Auth from "@/components/Auth";
import TranslationChat from "@/components/TranslationChat";
import Head from "next/head"; // Import Head
import { ToastProvider } from "@/components/ui/toast";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FloatButton } from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Itinerar",
	description: "Ready, set, go anywhere!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Head>
				{/* If you're using another file format like .png or .svg */}
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
			</Head>
			<body className={inter.className}>
				<AuthProvider>
					<AntdRegistry>
						<ToastProvider>
							<Auth />
							<Navbar />
							{children}
							<TranslationChat />
						</ToastProvider>
					</AntdRegistry>
				</AuthProvider>
			</body>
		</html>
	);
}
