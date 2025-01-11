import React, { useContext, useState, useEffect } from 'react'

import { motion } from "motion/react"
import { toast } from 'react-toastify';
import axios from 'axios'

import { FiMail } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

import AppContext from '../../contexts/AppContext/AppContext.js';
import LoginContext from '../../contexts/LoginContext/LoginContext.js';

import Loader from './Loader.jsx';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { loading, setLoading, backendUrl } = useContext(AppContext);
    const { setShowLogin, setShowForgotPassword } = useContext(LoginContext);

    const clickOnBackToLogin = () => {
        setShowForgotPassword(false);
        setShowLogin(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });

            if (data.success) {
                setIsSubmitted(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            return document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <section className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form className='relative bg-white p-8 rounded-xl'
                key={isSubmitted}
                onSubmit={handleSubmit}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium mb-1.5'>Forgot Password</h1>
                {!isSubmitted ?
                    <>
                        <p className='text-sm sm:text-base w-80 text-center text-slate-500'>Enter your email and we'll send you a link to reset your password</p>

                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4 text-slate-500 focus-within:ring-1 focus-within:ring-zinc-600 transition duration-150'>
                            <FiMail />
                            <input onChange={e => setEmail(e.target.value)} type="email" placeholder='Email Address' id='email' value={email} required className='flex-1 outline-none text-sm' />
                        </div>

                        <button disabled={loading} className={`bg-zinc-700 w-full text-white py-2 mt-4 rounded-full ${!loading ? 'hover:bg-zinc-500 hover:scale-105 transition-all duration-200' : 'bg-zinc-500'}`}>
                            {!loading ? 'Send Reset Link' : <Loader width={6}/>}
                        </button>
                    </>

                    :

                    <>
                    <div className='flex flex-col items-center justify-center gap-2 mt-3'>
                        <div className='p-3 border-2 border-zinc-900 bg-[#0000000c] rounded-full'>
                            <FiMail size={25}/>
                        </div>
                        <p className='text-sm sm:text-base w-96 text-center text-slate-500'>If account exists for {email}, you will receive a password reset link shortly</p>
                    </div>
                    </>
                }

                <div onClick={clickOnBackToLogin} className='flex items-center justify-center text-sm gap-1 text-blue-600 mt-4 cursor-pointer hover:underline ml-1 '>
                    <FaArrowLeft />
                    <p>Back to Login</p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForgotPassword(false)} className='absolute top-5 right-5 cursor-pointer text-zinc-400 border border-transparent p-0.5 hover:border-zinc-600 hover:text-zinc-600 rounded-full transition-all duration-150'>
                    <RxCross2 />
                </motion.div>

            </motion.form>
        </section>
    )
}

export default ForgotPassword