"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { checkIfAllTravelersInfo } from "@/apis";

const PassportForm = ({ params }) => {
	const { id } = params;
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [passportData, setPassportData] = useState({
		documentType: "PASSPORT", // Default to PASSPORT, can be changed to "ID_CARD", "VISA", or "OTHER"
		birthPlace: "",
		issuanceLocation: "",
		issuanceDate: "",
		number: "",
		expiryDate: "",
		issuanceCountry: "",
		validityCountry: "",
		nationality: "",
		holder: false,
	});
	

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

	return (
		<form
	onSubmit={handleSubmit}
	className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-10"
>
	<h2 className="text-2xl font-semibold mb-4 text-center">
		Passport Information Extraction
	</h2>

	<div className="mt-6 grid grid-cols-1 gap-4">
		<div className="flex flex-col">
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
		</div>

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
			<label htmlFor="surname" className="text-gray-700">
				Name:
			</label>
			<Input
				id="surname"
				type="text"
				value={passportData.surname}
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
				value={passportData.dateOfBirth}
				onChange={handleInputChange}
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

		<div className="flex flex-col">
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
		</div>

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
	</div>
</form>

	);
};

export default PassportForm;
