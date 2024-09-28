import { GoogleFoodResult } from "@/types/serp";
import Image from "next/image";

export default function RestaurantCard(props: {
	restaurant: GoogleFoodResult;
}) {
	const { restaurant } = props;
	return (
		<div
			className="flex w-[500px] flex-row gap-4 border-box p-3 hover:bg-slate-50 cursor-pointer rounded-2xl"
			style={{ flex: "0 0 auto" }}
		>
			<Image
				src={restaurant.images[0]}
				alt={restaurant.restaurant_id}
				width={144}
				height={144}
				objectFit="cover"
				className="rounded-xl w-[144px] shrink-0 h-[144px] bg-cover"
			/>
			<div>
				<h2 className="font-medium text-lg">{restaurant.title}</h2>
				<div className="flex items-center -ml-2 mt-0.5">
					<span className="text-xs ml-2 text-slate-600">
						{restaurant.rating}
					</span>
					{new Array(5).fill(0).map((_, index) => (
						<svg
							className={`w-3.5 h-3.5 ms-1 -mt-0.5 ${
								index < restaurant.rating
									? "text-yellow-300"
									: "text-gray-300 dark:text-gray-500" // text-yellow-500
							}`}
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 22 20"
						>
							<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
						</svg>
					))}{" "}
					<span className="text-xs ml-2 text-slate-600">
						({restaurant.reviews}){" "}
						{restaurant.price ? "· " + restaurant.price : ""}{" "}
						{restaurant.type ? "· " + restaurant.type : ""}{" "}
					</span>
				</div>
				<h2 className="text-sm text-slate-500 mt-1">{restaurant.address}</h2>
				<h2 className="text-sm  text-slate-500 line-clamp-2">
					{restaurant.description}
				</h2>
				<h2 className="text-sm  text-slate-500 mt-1">
					{restaurant.distance} - {restaurant.hours}
				</h2>
			</div>
		</div>
	);
}
