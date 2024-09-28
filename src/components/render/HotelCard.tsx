import { GoogleHotelProperty } from "@/types/serp";
import Image from "next/image";

export default function HotelCard(props: {
	hotel: GoogleHotelProperty;
	selected?: boolean;
	onSelect: (hotel: GoogleHotelProperty) => void;
}) {
	const { hotel } = props;

	return (
		<div key={hotel.property_token}>
			<div className="w-[340px] h-[540px] relative overflow-hidden rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
				<div className="w-full h-[200px] aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
					<Image
						src={hotel.images[0].thumbnail}
						alt="thumbnail"
						width={100}
						height={100}
						objectFit="cover"
						className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 h-100 w-full`}
					/>
				</div>
				<div className="flex flex-col h-[340px]">
					<div className="p-4 pb-0 flex-1">
						<h2 className="font-bold my-4 text-lg text-zinc-700">
							{hotel.name}
						</h2>
						<h2 className="font-normal my-4 text-sm text-zinc-500">
							{hotel.description}
						</h2>
						<h2 className="font-normal my-4 text-xs text-zinc-500">
							{hotel.nearby_places.slice(0, 1).map((place) => (
								<div className="flex gap-2 items-center">
									<svg
										width="15"
										height="15"
										viewBox="0 0 15 15"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M7.5 0C7.77614 0 8 0.223858 8 0.5V1.80687C10.6922 2.0935 12.8167 4.28012 13.0068 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H12.9888C12.7094 10.6244 10.6244 12.7094 8 12.9888V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V13.0068C4.28012 12.8167 2.0935 10.6922 1.80687 8H0.5C0.223858 8 0 7.77614 0 7.5C0 7.22386 0.223858 7 0.5 7H1.78886C1.98376 4.21166 4.21166 1.98376 7 1.78886V0.5C7 0.223858 7.22386 0 7.5 0ZM8 12.0322V9.5C8 9.22386 7.77614 9 7.5 9C7.22386 9 7 9.22386 7 9.5V12.054C4.80517 11.8689 3.04222 10.1668 2.76344 8H5.5C5.77614 8 6 7.77614 6 7.5C6 7.22386 5.77614 7 5.5 7H2.7417C2.93252 4.73662 4.73662 2.93252 7 2.7417V5.5C7 5.77614 7.22386 6 7.5 6C7.77614 6 8 5.77614 8 5.5V2.76344C10.1668 3.04222 11.8689 4.80517 12.054 7H9.5C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8H12.0322C11.7621 10.0991 10.0991 11.7621 8 12.0322Z"
											fill="currentColor"
											fill-rule="evenodd"
											clip-rule="evenodd"
										></path>
									</svg>
									Near {place.name}
								</div>
							))}
						</h2>
					</div>
					<div className="flex flex-row justify-between items-center p-4 pt-0 self-baseline w-full">
						<div>
							<div className="flex items-center -ml-1 mb-3">
								{new Array(5).fill(0).map((_, index) => (
									<svg
										className={`w-4 h-4 ms-1 ${
											index < hotel.overall_rating
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
									{hotel.overall_rating} ({hotel.reviews})
								</span>
							</div>
							<span className="text-xs text-gray-500">
								Check-in: {hotel.check_in_time}
							</span>
							<br />
							<span className="text-xs text-gray-500">
								Check-out: {hotel.check_out_time}
							</span>
						</div>
						<div>
							<div className="text-sm text-center mb-2 font-medium text-slate-700">
								{hotel.rate_per_night.lowest} / night
							</div>
							<div
								onClick={() => props.onSelect(hotel)}
								className="relative cursor-pointer z-10 px-6 py-2 bg-black text-white font-bold rounded-xl block text-xs"
							>
								{props.selected ? "Remove" : "Select"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
