"use client";
import Link from "next/link";
import LoginButton from "./login";
import Profile from "./profile";
import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
	const { isAuthenticated } = useAuth0();
	const pathname = usePathname();

	const isHome = pathname === "/";

	return (
		<div
			className={
				"shadow p-4 flex justify-between " +
				(isHome
					? "bg-transparent absolute top-0 z-10 w-full shadow-none"
					: "bg-white")
			}
		>
			<div>
				<Link href="/" className="flex items-center">
					<Image
						src="/logo.png"
						alt="Travel Application Logo"
						width={60}
						height={60}
						className="rounded-full"
					/>
					<h1 className="font-bold text-2xl">Traventure</h1>
				</Link>
			</div>
			<div className="self-center">
				{!isAuthenticated && <LoginButton />}
				{isAuthenticated && <Profile />}
			</div>
		</div>
	);
}
