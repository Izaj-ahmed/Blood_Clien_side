import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const SearchDonors = () => {
    const { register, handleSubmit, control, reset } = useForm();
    const axiosSecure = UseAxiosSecure();
    const [searchParams, setSearchParams] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const serviceCenters = useLoaderData();
    const regions = [...new Set(serviceCenters.map(c => c.region))];

    const requestRegion = useWatch({ name: 'searchRegion', control });

    const districtsByRegion = (region) => {
        return serviceCenters
            .filter(c => c.region === region)
            .map(d => d.district);
    };

    const { data: searchResults = [], isLoading } = useQuery({
        queryKey: ['search-donors', searchParams],
        enabled: !!searchParams,
        queryFn: async () => {
            try {
                // Build query string from search parameters
                const queryParams = new URLSearchParams();
                if (searchParams.bloodGroup) queryParams.append('bloodGroup', searchParams.bloodGroup);
                if (searchParams.region) queryParams.append('region', searchParams.region);
                if (searchParams.district) queryParams.append('district', searchParams.district);
                
                // Call backend API with filters
                const res = await axiosSecure.get(`/search-donors?${queryParams.toString()}`);
                return res.data || [];
            } catch (error) {
                console.error('Error fetching donors:', error);
                return [];
            }
        }
    });

    const handleSearch = (data) => {
        setCurrentPage(1);
        setSearchParams({
            bloodGroup: data.bloodGroup || '',
            region: data.searchRegion || '',
            district: data.searchDistrict || ''
        });
    };

    const handleReset = () => {
        reset();
        setSearchParams(null);
        setCurrentPage(1);
    };

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = searchResults.slice(startIndex, endIndex);
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    return (
        <div className='min-h-screen py-10' style={{background: 'linear-gradient(to bottom, rgba(243, 232, 255, 1), white)'}}>
            <div className='max-w-6xl mx-auto px-4'>
                <h1 className='text-4xl md:text-5xl font-bold text-center mb-2'>Search Donors</h1>
                <p className='text-center text-gray-600 mb-8'>Find blood donors near you</p>

                {/* Search Form */}
                <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
                    <form onSubmit={handleSubmit(handleSearch)} className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {/* Blood Group */}
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend'>Blood Group</legend>
                                <select {...register('bloodGroup')} className='select w-full'>
                                    <option value=''>Select Blood Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </fieldset>

                            {/* Region */}
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend'>Region</legend>
                                <select {...register('searchRegion')} className='select w-full'>
                                    <option value=''>Select Region</option>
                                    {regions.map((r, i) => (
                                        <option key={i} value={r}>{r}</option>
                                    ))}
                                </select>
                            </fieldset>

                            {/* District */}
                            <fieldset className='fieldset'>
                                <legend className='fieldset-legend'>District</legend>
                                <select {...register('searchDistrict')} className='select w-full' disabled={!requestRegion}>
                                    <option value=''>Select District</option>
                                    {requestRegion && districtsByRegion(requestRegion).map((d, i) => (
                                        <option key={i} value={d}>{d}</option>
                                    ))}
                                </select>
                            </fieldset>
                        </div>

                        <div className='flex gap-4 justify-center'>
                            <button
                                type='submit'
                                className='btn btn-primary px-8'
                            >
                                Search Donors
                            </button>
                            <button
                                type='button'
                                onClick={handleReset}
                                className='btn btn-outline px-8'
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Search Results */}
                {searchParams && (
                    <div className='bg-white shadow-lg rounded-lg p-8'>
                        {isLoading ? (
                            <div className='text-center py-12'>
                                <div className='loading loading-spinner loading-lg text-primary'></div>
                                <p className='mt-4 text-gray-600'>Searching for donors...</p>
                            </div>
                        ) : paginatedResults.length === 0 ? (
                            <div className='text-center py-12'>
                                <p className='text-gray-600 text-lg'>
                                    No donors found matching your criteria. Please try different filters.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className='text-2xl font-bold mb-6'>
                                    Found {searchResults.length} Donor{searchResults.length !== 1 ? 's' : ''}
                                </h2>

                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                                    {paginatedResults.map((donor) => (
                                        <div key={donor._id} className='card bg-base-100 shadow-md hover:shadow-lg transition'>
                                            <div className='card-body'>
                                                <h3 className='card-title text-lg'>
                                                    {donor.name || 'Anonymous Donor'}
                                                </h3>

                                                <div className='space-y-2 text-sm'>
                                                    <p className='flex justify-between'>
                                                        <span className='font-semibold'>Blood Group:</span>
                                                        <span className='badge badge-primary'>{donor.bloodGroup}</span>
                                                    </p>
                                                    <p className='flex justify-between'>
                                                        <span className='font-semibold'>Region:</span>
                                                        <span>{donor.region}</span>
                                                    </p>
                                                    <p className='flex justify-between'>
                                                        <span className='font-semibold'>District:</span>
                                                        <span>{donor.district}</span>
                                                    </p>
                                                    {donor.phone && (
                                                        <p className='flex justify-between'>
                                                            <span className='font-semibold'>Phone:</span>
                                                            <span>{donor.phone}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div className='card-actions justify-end mt-4'>
                                                    <button className='btn btn-primary btn-sm'>
                                                        Contact Donor
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className='flex justify-center gap-2 mt-8'>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className='btn btn-outline'
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className='btn btn-outline'
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {!searchParams && (
                    <div className='text-center py-12'>
                        <p className='text-gray-600 text-lg'>
                            Use the search form above to find donors matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDonors;
