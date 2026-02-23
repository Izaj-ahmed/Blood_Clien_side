import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import districtsData from '../../../../public/bd-districts.json';
import upazilasData from '../../../../public/bd-upazila.json';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const Profile = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch } = useForm();

    const watchDistrict = watch('district');
    useEffect(() => {
        if (!user?.email) return;

        axiosSecure.get('/users/profile')
            .then(res => {
                const data = res.data;
                setUserData(data);

                reset({
                    name: data.name || '',
                    avatar: data.avatar || '',
                    bloodGroup: data.bloodGroup || '',
                    district: data.district || '',
                    upazila: data.upazila || ''
                });

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user?.email]);

    /* ================= DISTRICT → UPAZILA ================= */
    useEffect(() => {
        if (!watchDistrict) {
            setFilteredUpazilas([]);
            setValue('upazila', '');
            return;
        }

        const list = upazilasData.filter(
            u => u.district_id === watchDistrict
        );
        setFilteredUpazilas(list);
        setValue('upazila', '');
    }, [watchDistrict, setValue]);

    /* ================= SUBMIT ================= */
    const onSubmit = data => {
        axiosSecure
            .patch(`/users/${userData._id}`, data)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Profile Updated!',
                        timer: 1500
                    });
                    setIsEditing(false);
                }
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed'
                });
            });
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset({
            name: userData.name,
            avatar: userData.avatar,
            bloodGroup: userData.bloodGroup,
            district: userData.district,
            upazila: userData.upazila
        });
    };

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Profile</h1>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-error text-white"
                    >
                        <FaEdit /> Edit
                    </button>
                ) : (
                    <div className="space-x-2">
                        <button
                            onClick={handleSubmit(onSubmit)}
                            className="btn btn-success text-white"
                        >
                            <FaSave /> Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn btn-neutral text-white"
                        >
                            <FaTimes /> Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* FORM */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Avatar */}
                <div className="col-span-2 flex justify-center">
                    <div className="relative">
                        <img
                            src={userData.avatar || 'https://via.placeholder.com/150'}
                            className="w-32 h-32 rounded-full border-4 border-red-500"
                        />
                        {isEditing && (
                            <ImageUpload
                                onImageUpload={url => setValue('avatar', url)}
                            />
                        )}
                    </div>
                </div>

                <input
                    {...register('name', { required: true })}
                    disabled={!isEditing}
                    className="input input-bordered"
                    placeholder="Full Name"
                />

                <input
                    value={user.email}
                    disabled
                    className="input input-bordered bg-gray-100"
                />

                <select
                    {...register('bloodGroup', { required: true })}
                    disabled={!isEditing}
                    className="select select-bordered"
                >
                    <option value="">Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b =>
                        <option key={b}>{b}</option>
                    )}
                </select>

                <select
                    {...register('district', { required: true })}
                    disabled={!isEditing}
                    className="select select-bordered"
                >
                    <option value="">District</option>
                    {districtsData.map(d =>
                        <option key={d.id} value={d.id}>{d.name}</option>
                    )}
                </select>

                <select
                    {...register('upazila', { required: true })}
                    disabled={!isEditing}
                    className="select select-bordered"
                >
                    <option value="">Upazila</option>
                    {filteredUpazilas.map(u =>
                        <option key={u.id} value={u.id}>{u.name}</option>
                    )}
                </select>

                <input
                    value={userData.role}
                    disabled
                    className="input input-bordered bg-gray-100 capitalize"
                />
            </form>
        </div>
    );
};

export default Profile;