"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
	checkIfAllTravelersInfo,
	TravelerInfo,
	updateTravelerInfo,
} from "@/apis";
import { useAuth0 } from "@auth0/auth0-react";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useItinerary } from "@/useItinerary";

export function DatePicker({ date, setDate }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[240px] justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}
				>
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

const PassportForm = ({ params }) => {
	const { id } = params;
	const { user, isLoading: authLoading } = useAuth0();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const { itinerary, isLoading } = useItinerary(id);

	const myTravelerInfo = itinerary?.users?.find(
		(t) => t.user.provider.id === user?.sub
	)?.travelerInfo;
	const [passportData, setPassportData] = useState<
		TravelerInfo["documents"][number]
	>({
		documentType: "PASSPORT", // Default to PASSPORT, can be changed to "ID_CARD", "VISA", or "OTHER"
		birthPlace: "",
		issuanceLocation: "",
		issuanceDate: "",
		number: "",
		expiryDate: "",
		issuanceCountry: "",
		validityCountry: "",
		nationality: "",
		holder: true,
	});

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState<string>("");

	const [phoneNumber, setPhoneNumber] = useState<
		TravelerInfo["contact"]["phones"][number]
	>({
		countryCallingCode: "",
		deviceType: "MOBILE",
		number: "",
	});
	const [gender, setGender] = useState<TravelerInfo["gender"]>("MALE");

	React.useEffect(() => {
		if (myTravelerInfo) {
			setFirstName(myTravelerInfo?.name?.firstName || "");
			setLastName(myTravelerInfo.name.lastName || "");
			setPhoneNumber(
				myTravelerInfo.contact.phones[0] || {
					countryCallingCode: "",
					deviceType: "MOBILE",
					number: "",
				}
			);
			setGender(myTravelerInfo.gender || "MALE");
			setPassportData(
				myTravelerInfo.documents[0] || {
					documentType: "PASSPORT", // Default to PASSPORT, can be changed to "ID_CARD", "VISA", or "OTHER"
					birthPlace: "",
					issuanceLocation: "",
					issuanceDate: "",
					number: "",
					expiryDate: "",
					issuanceCountry: "",
					validityCountry: "",
					nationality: "",
					holder: true,
				}
			);
			setDateOfBirth(myTravelerInfo.dateOfBirth || "");
		}
	}, [myTravelerInfo]);

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setPassportData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) {
			console.error("No file selected");
			return;
		}

		const formData = new FormData();
		formData.append("document", file);

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/ocr`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setPassportData(response.data); // Update the form with the extracted data
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	const checkIfAllTravelerInfoIsFilled = async () => {
		const isFilled = await checkIfAllTravelersInfo(id);
		if (isFilled) {
			// Redirect to the next page
		}
	};

	const handleSave = async () => {
		await updateTravelerInfo(id, user?.sub as string, {
			documents: [passportData],
			contact: {
				emailAddress: user?.email as string,
				phones: [
					{
						...phoneNumber,
						countryCallingCode: phoneNumber.countryCallingCode.replace("+", ""),
					},
				],
			},
			dateOfBirth: dateOfBirth,
			name: {
				firstName: firstName,
				lastName: lastName,
			},
			gender: gender,
		});
	};

	if (authLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-gray-600">Authenticating...</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-gray-600">
					Loading itinerary...
				</p>
			</div>
		);
	}

	if (!itinerary) {
		return (
			<div className="flex flex-col items-center justify-center h-screen space-y-4">
				<h2 className="text-2xl font-semibold text-red-600">
					Itinerary Not Found
				</h2>
				<p className="text-lg text-gray-600">
					We could not find the itinerary with this id.
				</p>
			</div>
		);
	}

	if (
		itinerary?.users?.findIndex((u) => u?.user?.provider?.id === user?.sub) ===
		-1
	) {
		return (
			<div className="flex flex-col items-center justify-center h-screen space-y-4">
				<h2 className="text-2xl font-semibold text-red-600">Not a Member</h2>
				<p className="text-lg text-gray-600">
					You are not a member. You need to have access in order to enter.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-10"
		>
			<h2 className="text-2xl font-semibold mb-4 text-center">
				Booking Information
			</h2>

			<div className="mt-6 grid grid-cols-1 gap-4">
				{/** Divider */}
				<div className="flex flex-col">
					<label htmlFor="number" className="text-gray-700">
						First Name:
					</label>
					<Input
						id="firstName"
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className="mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="number" className="text-gray-700">
						Last Name:
					</label>
					<Input
						id="lastName"
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className="mt-1"
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="number" className="text-gray-700">
						Phone Number:
					</label>
					<div className="flex flex-row gap-4">
						<Input
							id="countryCallingCode"
							type="text"
							value={phoneNumber.countryCallingCode}
							onChange={(e) =>
								setPhoneNumber((prevData) => ({
									...prevData,
									countryCallingCode: e.target.value,
								}))
							}
							placeholder="+1"
							className="mt-1 w-32"
						/>
						<Input
							id="number"
							type="text"
							value={phoneNumber.number}
							onChange={(e) =>
								setPhoneNumber((prevData) => ({
									...prevData,
									number: e.target.value,
								}))
							}
							placeholder="1234567890"
							className="mt-1 flex-8"
						/>
					</div>
				</div>

				<div className="border-b border-gray-300"></div>
				{/* <div className="flex flex-col">
					<label htmlFor="documentType" className="text-gray-700">
						Document Type:
					</label>
					<select
						id="documentType"
						value={passportData.documentType}
						onChange={handleInputChange}
						className="mt-1"
					>
						<option value="PASSPORT">Passport</option>
						<option value="ID_CARD">ID Card</option>
						<option value="VISA">Visa</option>
						<option value="OTHER">Other</option>
					</select>
				</div> */}

				<div className="flex flex-col">
					<label htmlFor="number" className="text-gray-700">
						Passport Number:
					</label>
					<Input
						id="number"
						type="text"
						value={passportData.number}
						onChange={handleInputChange}
						className="mt-1"
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="nationality" className="text-gray-700">
						Nationality:
					</label>
					<Input
						id="nationality"
						type="text"
						value={passportData.nationality}
						onChange={handleInputChange}
						className="mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="dateOfBirth" className="text-gray-700">
						Date of Birth:
					</label>
					<Input
						id="dateOfBirth"
						type="text"
						value={dateOfBirth}
						onChange={(e) => setDateOfBirth(e.target.value)}
						placeholder="YYYY-MM-DD"
						className="mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="birthPlace" className="text-gray-700">
						Place of Birth:
					</label>
					<Input
						id="birthPlace"
						type="text"
						value={passportData.birthPlace}
						onChange={handleInputChange}
						className="mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="issuanceDate" className="text-gray-700">
						Date of Issue:
					</label>
					<Input
						id="issuanceDate"
						type="text"
						value={passportData.issuanceDate}
						onChange={handleInputChange}
						className="mt-1"
						placeholder="YYYY-MM-DD"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="expiryDate" className="text-gray-700">
						Date of Expiry:
					</label>
					<Input
						id="expiryDate"
						type="text"
						value={passportData.expiryDate}
						onChange={handleInputChange}
						className="mt-1"
						placeholder="YYYY-MM-DD"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="issuanceLocation" className="text-gray-700">
						Issuance Location:
					</label>
					<Input
						id="issuanceLocation"
						type="text"
						value={passportData.issuanceLocation}
						onChange={handleInputChange}
						className="mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="issuanceCountry" className="text-gray-700">
						Issuance Country:
					</label>
					<Input
						id="issuanceCountry"
						type="text"
						value={passportData.issuanceCountry}
						onChange={handleInputChange}
						className="mt-1"
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="validityCountry" className="text-gray-700">
						Validity Country:
					</label>
					<Input
						id="validityCountry"
						type="text"
						value={passportData.validityCountry}
						onChange={handleInputChange}
						className="mt-1"
					/>
				</div>

				{/* <div className="flex flex-col">
					<label htmlFor="holder" className="text-gray-700">
						Holder:
					</label>
					<input
						id="holder"
						type="checkbox"
						checked={passportData.holder}
						onChange={(e) =>
							setPassportData((prevData) => ({
								...prevData,
								holder: e.target.checked,
							}))
						}
						className="mt-1"
					/>
				</div> */}

				<div className="flex items-center justify-center gap-x-3">
					<Button onClick={handleButtonClick} className="">
						Upload Passport
					</Button>
					<Input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						className="hidden"
					/>
					<Button type="submit" className="">
						Extract Information
					</Button>
				</div>
				<Button onClick={handleSave}>Save Details</Button>
				<Button>Go to Pricing</Button>
			</div>
		</form>
	);
};

export default PassportForm;
