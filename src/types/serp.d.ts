export type SerpFlight = GoogleFlightData;

export interface SearchMetadata {
	id: string;
	status: string;
	json_endpoint: string;
	created_at: string;
	processed_at: string;
	google_flights_url: string;
	raw_html_file: string;
	prettify_html_file: string;
	total_time_taken: number;
}

export interface SearchParameters {
	engine: string;
	hl: string;
	gl: string;
	type: string;
	departure_id: string;
	arrival_id: string;
	outbound_date: string;
	currency: string;
}

export interface BestFlight {
	flights: Flight[];
	layovers: Layover[];
	total_duration: number;
	carbon_emissions: CarbonEmissions;
	price: number;
	type: string;
	airline_logo: string;
	booking_token: string;
}

export interface Flight {
	departure_airport: DepartureAirport;
	arrival_airport: ArrivalAirport;
	duration: number;
	airplane: string;
	airline: string;
	airline_logo: string;
	travel_class: string;
	flight_number: string;
	legroom: string;
	extensions: string[];
	ticket_also_sold_by?: string[];
}

export interface DepartureAirport {
	name: string;
	id: string;
	time: string;
}

export interface ArrivalAirport {
	name: string;
	id: string;
	time: string;
}

export interface Layover {
	duration: number;
	name: string;
	id: string;
	overnight?: boolean;
}

export interface CarbonEmissions {
	this_flight: number;
	typical_for_this_route: number;
	difference_percent: number;
}

export interface OtherFlight {
	flights: Flight2[];
	layovers: Layover2[];
	total_duration: number;
	carbon_emissions: CarbonEmissions2;
	price: number;
	type: string;
	airline_logo: string;
	booking_token: string;
}

export interface Flight2 {
	departure_airport: DepartureAirport2;
	arrival_airport: ArrivalAirport2;
	duration: number;
	airplane: string;
	airline: string;
	airline_logo: string;
	travel_class: string;
	flight_number: string;
	ticket_also_sold_by?: string[];
	legroom: string;
	extensions: string[];
	often_delayed_by_over_30_min?: boolean;
}

export interface DepartureAirport2 {
	name: string;
	id: string;
	time: string;
}

export interface ArrivalAirport2 {
	name: string;
	id: string;
	time: string;
}

export interface Layover2 {
	duration: number;
	name: string;
	id: string;
	overnight?: boolean;
}

export interface CarbonEmissions2 {
	this_flight: number;
	typical_for_this_route: number;
	difference_percent: number;
}

export interface PriceInsights {
	lowest_price: number;
	price_level: string;
	typical_price_range: number[];
	price_history: number[][];
}

// Events
interface GoogleEventsResult {
	search_metadata: {
		id: string;
		status: string;
		json_endpoint: string;
		created_at: string;
		processed_at: string;
		google_events_url: string;
		raw_html_file: string;
		total_time_taken: number;
	};
	search_parameters: {
		q: string;
		engine: string;
		hl: string;
		gl: string;
	};
	search_information: {
		events_results_state: string;
	};
	events_results: {
		title: string;
		date: {
			start_date: string;
			when: string;
		};
		address: string[];
		link: string;
		event_location_map: {
			image: string;
			link: string;
			serpapi_link: string;
		};
		description: string;
		ticket_info: {
			source: string;
			link: string;
			link_type: string;
		}[];
		thumbnail: string;
		venue?: {
			name: string;
			rating: number;
			reviews: number;
			link: string;
		};
		image?: string;
	}[];
	serpapi_pagination: {
		next_page_token: string;
		next: string;
	};
}

export interface GoogleFlightData {
	search_metadata: SearchMetadata;
	search_parameters: SearchParameters;
	best_flights: {
		id: string;
		flights: {
			departure_airport: { name: string; id: string; time: string };
			arrival_airport: { name: string; id: string; time: string };
			duration: number;
			airplane: string;
			airline: string;
			airline_logo: string;
			travel_class: string;
			flight_number: string;
			extensions: string[];
			ticket_also_sold_by: string[];
			legroom: string;
			overnight: boolean;
			often_delayed_by_over_30_min: boolean;
		}[];
		layovers: {
			duration: number;
			name: string;
			id: string;
			overnight: boolean;
		}[];
		total_duration: number;
		carbon_emissions: {
			this_flight: number;
			typical_for_this_route: number;
			difference_percent: number;
		};
		price: number;
		type: string;
		airline_logo: string;
		extensions: string[];
		departure_token: string;
		booking_token: string;
	}[];
	other_flights?: GoogleFlightData["best_flights"];
	price_insights?: {
		lowest_price: number;
		price_level: string;
		typical_price_range: [number, number];
		price_history: [number, number][];
	};
	airports: {
		departure: {
			airport: { name: string; id: string };
			city: string;
			country: string;
			country_code: string;
			image: string;
			thumbnail: string;
		}[];
		arrival: {
			airport: { name: string; id: string };
			city: string;
			country: string;
			country_code: string;
			image: string;
			thumbnail: string;
		}[];
	}[];
}

interface GoogleFoodResult {
	title: string;
	rating: number;
	description?: string;
	reviews_original: string;
	reviews: number;
	price: string;
	type: string;
	distance: string;
	address: string;
	hours: string;
	delivery_time: string;
	delivery_fee: string;
	restaurant_id: string;
	images: string[];
	links: {
		order?: string;
		phone?: string;
		directions?: string;
		website?: string;
	};
}

interface GoogleFoodResponse {
	search_metadata: {
		id: string;
		status: string;
		json_endpoint: string;
		created_at: string;
		processed_at: string;
		google_food_url: string;
		raw_html_file: string;
		total_time_taken: number;
	};
	search_parameters: {
		engine: string;
		q: string;
		order_type: number;
		hl: string;
		gl: string;
		lat: string;
		lng: string;
	};
	search_information: {
		local_results_state: string;
	};
	local_results: GoogleFoodResult[];
	serpapi_pagination: {
		next_page_token: string;
		next: string;
	};
}

export type GoogleHotelsParams = {
	q: string;
	gl?: string; // country code
	check_in_date: string;
	check_out_date: string;
	adults: number;
	children?: number;
	rating?: number;
	amenities?: string;
	min_price?: number;
	max_price?: number;
	currency?: string;
	hotel_class?: number;
	bedrooms?: number;
	bathrooms?: number;
};

interface GoogleHotelProperty {
	type: string; // Type of property (e.g. hotel or vacation rental)
	name: string; // Name of the property
	description: string; // Description of the property
	link: string; // URL of the property's website
	logo: string; // URL of the property's logo
	sponsored: boolean; // Indicates if the property result is sponsored
	eco_certified: boolean; // Indicates if the property is Eco-certified
	gps_coordinates: {
		latitude: number; // Latitude of the GPS Coordinates
		longitude: number; // Longitude of the GPS Coordinates
	};
	check_in_time: string; // Check-in time of the property (e.g. 3:00 PM)
	check_out_time: string; // Check-out time of the property (e.g. 12:00 PM)
	rate_per_night: {
		lowest: string; // Lowest rate per night formatted with currency
		extracted_lowest: number; // Extracted lowest rate per night
		before_taxes_fees: string; // Rate per night before taxes and fees formatted with currency
		extracted_before_taxes_fees: number; // Extracted rate per night before taxes and fees
	};
	total_rate: {
		lowest: string; // Lowest total rate for the entire trip formatted with currency
		extracted_lowest: number; // Extracted lowest total rate for the entire trip
		before_taxes_fees: string; // Total rate before taxes and fees for the entire trip formatted with currency
		extracted_before_taxes_fees: number; // Extracted total rate before taxes and fees for the entire trip
	};
	prices: {
		source: string; // Source of the site that lists the price
		logo: string; // URL of the source's logo
		rate_per_night: {
			lowest: string; // Lowest rate per night formatted with currency
			extracted_lowest: number; // Extracted lowest rate per night
			before_taxes_fees: string; // Rate per night before taxes and fees formatted with currency
			extracted_before_taxes_fees: number; // Extracted rate per night before taxes and fees
		};
	}[];
	nearby_places: {
		name: string;
		transportations: {
			type: string;
			duration: string;
		}[];
	}[];
	hotel_class: string;
	extracted_hotel_class: number;
	images: {
		thumbnail: string;
		original_image: string;
	}[];
	overall_rating: number;
	reviews: number;
	ratings: {
		stars: number;
		count: number;
	}[];
	location_rating: number;
	reviews_breakdown: {
		name: string;
		description: string;
		total_mentioned: number;
		positive: number;
		negative: number;
		neutral: number;
	}[];
	amenities: string[];
	excluded_amenities: string[];
	essential_info: string[];
	property_token: string;
	serpapi_property_details_link: string;
}

interface GoogleHotels {
	brands: {
		id: number;
		name: string;
		children?: {
			id: number;
			name: string;
		}[];
	}[];
	properties: GoogleHotelProperty[];
	serpapi_pagination: {
		current_from: number;
		current_to: number;
		next_page_token: string;
		next: string;
	};
}

export interface GooglePlacesResult {
	search_metadata: {
		id: string;
		status: string;
		json_endpoint: string;
		created_at: string;
		processed_at: string;
		google_url: string;
		raw_html_file: string;
		total_time_taken: number;
	};
	search_parameters: {
		engine: string;
		q: string;
		location_requested: string;
		location_used: string;
		google_domain: string;
		hl: string;
		gl: string;
		device: string;
	};
	search_information: {
		query_displayed: string;
		total_results: number;
		time_taken_displayed: number;
		organic_results_state: string;
	};
	top_sights?: {
		sights: {
			title: string;
			description: string;
			rating: number;
			reviews: number;
			price?: string;
			extracted_price?: number;
			thumbnail: string;
		}[];
	};
	local_results?: {
		places?: {
			position: number;
			rating: number;
			reviews_original: string;
			reviews: number;
			description: string;
			lsig: string;
			thumbnail: string;
			title: string;
			type: string;
			phone?: string;
			address: string;
			hours: string;
			place_id: string;
			place_id_search: string;
			gps_coordinates: {
				latitude: number;
				longitude: number;
			};
		}[];
		more_locations_link: string;
	};
	knowledge_graph?: {
		title: string;
		type: string;
		entity_type: string;
		kgmid: string;
		knowledge_graph_search_link: string;
		serpapi_knowledge_graph_search_link: string;
		image: string;
		description: string;
		source: { name: string; link: string };
		max_length: string;
		max_width: string;
		weather: string;
		weather_links: { text: string; link: string }[];
		area: string;
		coordinates: string;
		hangul: string;
		hanja: string;
	};
	related_questions?: {
		question: string;
		snippet: string;
		title: string;
		link: string;
		displayed_link: string;
		thumbnail?: string;
		source_logo?: string;
		next_page_token?: string;
		serpapi_link: string;
	}[];
	organic_results?: {
		position: number;
		title: string;
		link: string;
		redirect_link?: string;
		displayed_link: string;
		thumbnail?: string;
		favicon?: string;
		snippet: string;
		snippet_highlighted_words: string[];
		sitelinks?: { inline: { title: string; link: string }[] };
		source?: string;
	}[];
	shopping_results: {
		price: string;
		extracted_price: number;
		block: string;
		link: string;
		position: number;
		rating: number;
		reviews: number;
		source: string;
		thumbnail: string;
		title: string;
		extensions: string[];
	}[];
}
