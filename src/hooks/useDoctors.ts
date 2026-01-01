import { useState, useEffect, useMemo } from 'react';
import { Doctor } from '@/types';
import { mockDoctors } from '@/data/mockData';
import { useDebounce } from './useDebounce';

interface UseDoctorsOptions {
  searchQuery?: string;
  specialization?: string;
  page?: number;
  pageSize?: number;
}

interface UseDoctorsReturn {
  doctors: Doctor[];
  isLoading: boolean;
  totalPages: number;
  totalCount: number;
}

export function useDoctors({
  searchQuery = '',
  specialization = '',
  page = 1,
  pageSize = 6,
}: UseDoctorsOptions = {}): UseDoctorsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [debouncedSearch, specialization, page]);

  const filteredDoctors = useMemo(() => {
    let result = [...mockDoctors];

    // Filter by search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        doctor =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialization.toLowerCase().includes(query) ||
          doctor.hospital.toLowerCase().includes(query)
      );
    }

    // Filter by specialization
    if (specialization && specialization !== 'All Specializations') {
      result = result.filter(
        doctor => doctor.specialization === specialization
      );
    }

    return result;
  }, [debouncedSearch, specialization]);

  const paginatedDoctors = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredDoctors.slice(startIndex, startIndex + pageSize);
  }, [filteredDoctors, page, pageSize]);

  const totalPages = Math.ceil(filteredDoctors.length / pageSize);

  return {
    doctors: paginatedDoctors,
    isLoading,
    totalPages,
    totalCount: filteredDoctors.length,
  };
}
