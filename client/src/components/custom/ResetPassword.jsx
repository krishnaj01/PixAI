import React, { useContext, useState } from 'react'

import { motion } from "motion/react"
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FiLock } from "react-icons/fi";

import AppContext from '../../contexts/AppContext/AppContext.js';
import Loader from './Loader';

const ResetPassword = () => {

    const { loading, setLoading, navigate, backendUrl, showPassword, togglePasswordVisibility } = useContext(AppContext);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { resetToken } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const { data } = await axios.post(`${backendUrl}/api/user/reset-password/${resetToken}`, { password });

                if (data.success) {
                    setPassword('');
                    setConfirmPassword('');
                    toast.success(data.message);
                    toast.success('Redirecting to home page...');
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    toast.error(data.message);
                }

            } catch (error) {
                toast.error(error.message);
            }

        }
        setLoading(false);
    }

    const passwordVisibility = (e) => {
        e.preventDefault();
        togglePasswordVisibility();
    }

    return (
        <section className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form className='relative bg-white p-8 rounded-xl min-w-[25vw]'
                onSubmit={handleSubmit}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium mb-1.5'>Reset Password</h1>

                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4 text-slate-500 focus-within:ring-1 focus-within:ring-zinc-600 transition duration-150'>
                    <FiLock />
                    <input onChange={e => setPassword(e.target.value)} type={`${!showPassword ? 'password' : 'text'}`} placeholder='New Password' id='password' value={password} required className='flex-1 outline-none text-sm' />
                    <div onClick={passwordVisibility} className='cursor-pointer hover:scale-110'>
                        {!showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                    </div>
                </div>

                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4 text-slate-500 focus-within:ring-1 focus-within:ring-zinc-600 transition duration-150'>
                    <FiLock />
                    <input onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder='Confirm New Password' id='confirmPassword' value={confirmPassword} required className='outline-none text-sm' />
                </div>

                <button disabled={loading} className={`bg-zinc-700 w-full text-white py-2 mt-4 rounded-full ${!loading ? 'hover:bg-zinc-500 hover:scale-105 transition-all duration-200' : 'bg-zinc-500'}`}>
                    {!loading ? 'Set New Password' : <Loader width={6} />}
                </button>
            </motion.form>
        </section>
    )
}

export default ResetPassword