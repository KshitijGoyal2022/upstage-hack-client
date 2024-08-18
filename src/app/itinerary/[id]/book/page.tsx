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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ocr`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPassportData(response.data); // Update the form with the extracted data
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-10'
    >
      <h2 className='text-2xl font-semibold mb-4 text-center'>
        Passport Information Extraction
      </h2>

      <div className='mt-6 grid grid-cols-1 gap-4'>
        <div className='flex flex-col'>
          <label className='text-gray-700'>Passport Number:</label>
          <Input
            type='text'
            value={passportData.passportNumber}
            readOnly
            className='mt-1'
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-gray-700'>Name:</label>
          <Input
            type='text'
            value={passportData.surname}
            readOnly
            className='mt-1'
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-gray-700'>Nationality:</label>
          <Input
            type='text'
            value={passportData.nationality}
            readOnly
            className='mt-1'
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-gray-700'>Date of Birth:</label>
          <Input
            type='text'
            value={passportData.dateOfBirth}
            readOnly
            className='mt-1'
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-gray-700'>Date of Issue:</label>
          <Input
            type='text'
            value={passportData.dateOfIssue}
            readOnly
            className='mt-1'
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-gray-700'>Date of Expiry:</label>
          <Input
            type='text'
            value={passportData.dateOfExpiry}
            readOnly
            className='mt-1'
          />
        </div>

        <div className='flex items-center justify-center gap-x-3'>
          <Button onClick={handleButtonClick} className=''>
            Upload Passport
          </Button>
          <Input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
          <Button type='submit' className=''>
            Extract Information
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PassportForm;
