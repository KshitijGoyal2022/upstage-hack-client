"use client";
import { IconSquareRoundedX } from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export const BlurredModal = ({
	open,
	children,
	onClose,
	width = "w-[560px]",
}: {
	open?: boolean;
	children: React.ReactNode;
	onClose?: () => void;
	width?: string;
}) => {
	return (
		<AnimatePresence mode="wait">
			{open && onClose && (
				<button
					onClick={onClose}
					className="fixed top-4 right-4 text-black dark:text-white z-[120]"
				>
					<IconSquareRoundedX className="h-10 w-10" />
				</button>
			)}
			{open && (
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
					}}
					className="w-full  fixed inset-0 z-[100] flex pt-72 justify-center backdrop-blur-2xl overflow-y-auto pb-96"
				>
					<div className={clsx("pb-96", width)}>{children}</div>
					{/* <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" /> */}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
