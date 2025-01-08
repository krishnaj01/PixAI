import React, { useContext, useEffect, useState } from 'react'

import { motion } from "motion/react"
import { toast } from 'react-toastify';
import axios from 'axios';
axios.defaults.withCredentials = true;

import { FiLock, FiUser, FiMail } from "react-icons/fi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

import AppContext from '../../contexts/AppContext/AppContext.js';
import UserContext from '../../contexts/UserContext/UserContext.js';
import LoginContext from "../../contexts/LoginContext/LoginContext.js";

import PasswordStrengthMeter from './PasswordStrengthMeter.jsx';
import Loader from './Loader.jsx';

const LoginAndRegister = () => {
    const [currState, setCurrState] = useState('Login')

    const { backendUrl, setLoading, loading, showPassword, togglePasswordVisibility, loadTotalUserData } = useContext(AppContext);
    const { setShowLogin, setShowVerifyEmail, setShowForgotPassword } = useContext(LoginContext);
    const { setTempUserId, setUser } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const clickOnForgotPassword = () => {
        setShowLogin(false);
        setShowForgotPassword(true);
    }

    const clickOnRegister = () => {
        setCurrState('Register');
        setEmail('');
        setPassword('');
    }

    const clickOnLogin = () => {
        setCurrState('Login');
        setEmail('');
        setName('');
        setPassword('');
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            if (currState === 'Login') {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });

                if (data.success) {
                    // setToken(data.token);
                    setUser(data.user);
                    setEmail('');
                    setPassword('');
                    setShowLogin(false);
                    loadTotalUserData();
                    toast.success(data.message);
                } else {
                    if (data.message === 'Verify Yourself First') {
                        setTempUserId(data.userId);
                        setShowLogin(false);
                        setShowVerifyEmail(true);
                    }
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });

                if (data.success) {
                    // setToken(data.token);
                    setTempUserId(data.userId);
                    setName('');
                    setEmail('');
                    setPassword('');
                    setShowLogin(false);
                    setShowVerifyEmail(true);
                } else {
                    toast.error(data.message);
                }
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
            <motion.form className='relative bg-white p-8 sm:p-10 rounded-xl'
                key={currState}
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium mb-1.5'>{currState}</h1>
                <p className='text-sm sm:text-base text-slate-500'>Welcome {currState === 'Login' ? 'back' : 'to PixAI'}! Please {currState === 'Login' ? 'login' : 'register'} to continue</p>

                {/* {currState === 'Login' ?
                    <div className='flex gap-4 items-center justify-center text-xl mt-3 text-gray-500'>
                        <a href="#" className='border p-2 rounded-full border-zinc-700 hover:scale-110 hover:text-zinc-800 transition-all duration-200'>
                            <FaGithub />
                        </a>
                        <a href="#" className='border p-2 rounded-full border-zinc-700 hover:scale-110 hover:text-zinc-800 transition-all duration-200'>
                            <FaGoogle />
                        </a>
                        <a href="#" className='border p-2 rounded-full border-zinc-700 hover:scale-110 hover:text-zinc-800 transition-all duration-200'>
                            <FaXTwitter />
                        </a>
                    </div>
                    :
                    <div className='flex gap-4 items-center justify-center text-xl mt-3 text-gray-500'>
                        <a href="#" className='border p-2 rounded-full border-zinc-700 hover:scale-110 hover:text-zinc-800 transition-all duration-200'>
                            <FaGithub />
                        </a>
                        <a href="#" className='border p-2 rounded-full border-zinc-700 hover:scale-110 hover:text-zinc-800 transition-all duration-200'>
                            <FaGoogle />
                        </a>
                        <a href="#" className='border p-2 rounded-full border-zinc-700 hover:scale-110 hover:text-zinc-800 transition-all duration-200'>
                            <FaXTwitter />
                        </a>
                    </div>
                }

                <div className="flex items-center mt-3">
                    <div className="flex-grow border-t border-gray-300 mt-0.5"></div>
                    <span className="mx-4 text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300 mt-0.5"></div>
                </div> */}

                {currState !== 'Login' &&
                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5 text-slate-500 focus-within:ring-1 focus-within:ring-zinc-600 transition duration-150'>
                        <FiUser />
                        <input onChange={e => setName(e.target.value)} type="text" placeholder='Full Name' id='name' value={name} required className='outline-none text-sm' />
                    </div>
                }
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4 text-slate-500 focus-within:ring-1 focus-within:ring-zinc-600 transition duration-150'>
                    <FiMail />
                    <input onChange={e => setEmail(e.target.value)} type="email" placeholder='Email Address' id='email' value={email} required className='outline-none text-sm' />
                </div>
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4 text-slate-500 focus-within:ring-1 focus-within:ring-zinc-600 transition duration-150'>
                    <FiLock />
                    <input onChange={e => setPassword(e.target.value)} type={`${!showPassword ? 'password' : 'text'}`} placeholder='Password' id='password' value={password} required className='flex-1 outline-none text-sm' />
                    <div onClick={togglePasswordVisibility} className='cursor-pointer hover:scale-110'>
                        {!showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </div>
                </div>

                <div>
                    {currState === 'Login' ?
                        <p onClick={clickOnForgotPassword} className='inline-block text-sm text-blue-600 mt-4 cursor-pointer hover:underline ml-1 '>Forgot password?</p>
                        :
                        <PasswordStrengthMeter password={password} />
                    }
                </div>

                <button disabled={loading} className={`bg-zinc-700 w-full text-white py-2 mt-4 rounded-full ${!loading ? 'hover:bg-zinc-500 hover:scale-105 transition-all duration-200' : 'bg-zinc-500'}`}>
                    {!loading ? `${currState === 'Login' ? 'LOG IN' : 'SIGN UP'}` : <Loader width={6} />}
                </button>

                {currState === 'Login' ?
                    <p className='mt-5 text-center text-slate-500 text-sm'>Don't have an account? <span className='text-blue-600 hover:underline cursor-pointer' onClick={clickOnRegister} >Register</span></p>
                    :
                    <p className='mt-5 text-center text-slate-500 text-sm'>Already have an account? <span className='text-blue-600 hover:underline cursor-pointer' onClick={clickOnLogin} >Login</span></p>
                }

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogin(false)} className='absolute top-5 right-5 cursor-pointer text-zinc-400 border border-transparent p-0.5 hover:border-zinc-600 hover:text-zinc-600 rounded-full transition-all duration-150'>
                    <RxCross2 />
                </motion.div>

            </motion.form>
        </section >
    )
}

export default LoginAndRegister