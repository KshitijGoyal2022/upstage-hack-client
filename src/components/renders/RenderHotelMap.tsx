"use client";

import React, { act } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { AmadeusActivityOffer, AmadeusHotelOffer } from "@/socket/chat";

type RenderHotelMap = { hotels: AmadeusHotelOffer[] };

export default function RenderHotelMap(props: RenderHotelMap) {
	const zoom = 16;

	return (
		<div className="p-6">
			<MapContainer
				center={{
					lng: props.hotels[0].geoCode.longitude,
					lat: props.hotels[0].geoCode.latitude,
				}}
				style={{
					width: "100%",
					height: "400px",
					borderRadius: 8,
				}}
				zoom={zoom}
				scrollWheelZoom={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{props.hotels.map((hotel) => {
					return (
						<Marker
							key={hotel.hotelId}
							position={{
								lat: hotel.geoCode.latitude,
								lng: hotel.geoCode.longitude,
							}}
						>
							<Popup>
								{hotel.name}
								<br />
								{hotel.address.countryCode}
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>
		</div>
	);
}
