"use client";

import React, { act } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { AmadeusActivityOffer } from "@/socket/chat";

type RenderPOIMapProps = { activities: AmadeusActivityOffer[] };

export default function RenderPOIMap(props: RenderPOIMapProps) {
	const zoom = 16;

	return (
		<div className="p-6">
			<MapContainer
				center={{
					lng: props.activities[0].geometry.coordinates[0],
					lat: props.activities[0].geometry.coordinates[1],
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
				{props.activities.map((activity) => {
					return (
						<Marker
							key={activity.properties.mapbox_id}
							position={{
								lat: activity.geometry.coordinates[1],
								lng: activity.geometry.coordinates[0],
							}}
						>
							<Popup>
								{activity.properties.name} <br />{" "}
								{activity.properties.full_address}
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>
		</div>
	);
}
