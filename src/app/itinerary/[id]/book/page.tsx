'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const PassportForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [passportData, setPassportData] = useState({
    passportNumber: '',
    surname: '',
    nationality: '',
    dateOfBirth: '',
    placeOfBirth: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    authority: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/ocr`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPassportData(response.data); // Update the form with the extracted data

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button onClick={handleButtonClick}>
        Upload Passport
      </Button>
      <Input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the input element
      />
      <Button type="submit" className="mt-2">Extract Information</Button>

      {/* Auto-fill form fields with extracted passport data */}
      <div className="mt-4">
        <label>
          Passport Number:
          <Input type="text" value={passportData.passportNumber} readOnly />
        </label>
        <label>
          Surname:
          <Input type="text" value={passportData.surname} readOnly />
        </label>
        <label>
          Nationality:
          <Input type="text" value={passportData.nationality} readOnly />
        </label>
        <label>
          Date of Birth:
          <Input type="text" value={passportData.dateOfBirth} readOnly />
        </label>
        <label>
          Place of Birth:
          <Input type="text" value={passportData.placeOfBirth} readOnly />
        </label>
        <label>
          Date of Issue:
          <Input type="text" value={passportData.dateOfIssue} readOnly />
        </label>
        <label>
          Date of Expiry:
          <Input type="text" value={passportData.dateOfExpiry} readOnly />
        </label>
        <label>
          Authority:
          <Input type="text" value={passportData.authority} readOnly />
        </label>
      </div>
    </form>
  );
};

export default PassportForm;
