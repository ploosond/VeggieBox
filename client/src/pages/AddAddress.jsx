// Input Field Component

import {useEffect, useState} from 'react';
import {assets} from '../assets/assets';
import {useAppContext} from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const InputField = ({type, placeHolder, name, handleChange, address}) => (
    <input
        className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
        type={type}
        placeholder={placeHolder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
);

const AddAddress = () => {
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const {axios, navigate, user} = useAppContext();

    const handleChange = (event) => {
        setAddress((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const {data} = await axios.post('/api/address/add', {address});
            if (data.success) {
                toast.success(data.message);
                navigate('/cart');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }

    };

    useEffect(() => {
        if (!user) {
            navigate('/cart');
        }
    }, []);
    return (
        <div className="mt-16 pb-16">
            <p className="text-2xl md:text-3xl text-gray-500">
                Add Shipping <span className="font-semibold text-primary">Address</span>
            </p>
            <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
                <div className="flex-1 max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-3 mt-6 text-sm">
                        <div className="grid grid-cols-2 gap-4 ">
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="firstName"
                                type="text"
                                placeHolder="First Name"
                            />
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="lastName"
                                type="text"
                                placeHolder="Last Name"
                            />
                        </div>
                        <InputField
                            handleChange={handleChange}
                            address={address}
                            name="email"
                            type="email"
                            placeHolder="Email address"
                        />
                        <InputField
                            handleChange={handleChange}
                            address={address}
                            name="street"
                            type="text"
                            placeHolder="Street"
                        />
                        <div className="grid grid-cols-2 gap-4 ">
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="city"
                                type="text"
                                placeHolder="City"
                            />
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="state"
                                type="text"
                                placeHolder="State"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 ">
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="zipcode"
                                type="text"
                                placeHolder="Zip code"
                            />
                            <InputField
                                handleChange={handleChange}
                                address={address}
                                name="country"
                                type="text"
                                placeHolder="Country"
                            />
                        </div>
                        <InputField
                            handleChange={handleChange}
                            address={address}
                            name="phone"
                            type="text"
                            placeHolder="Phone"
                        />
                        <button
                            className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
                            Save address
                        </button>
                    </form>
                </div>
                <img
                    className="md:mr-16 mb-16 md:mt-0"
                    src={assets.add_address_iamge}
                    alt="Add Address"
                />
            </div>
        </div>
    );
};

export default AddAddress;
