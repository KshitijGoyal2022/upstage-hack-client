import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShareModal({ shareLink }: { shareLink: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(shareLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="rounded-full">+</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share Itinerary</DialogTitle>
					<DialogDescription>
						Copy and share the link below to invite others to this itinerary.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<Input value={shareLink} readOnly className="flex-1" />
					<Button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
