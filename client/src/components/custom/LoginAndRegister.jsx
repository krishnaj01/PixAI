import React, { useContext, useEffect, useState } from 'react'
import LoginContext from "../../contexts/LoginContext/LoginContext.js";
import AppContext from '../../contexts/AppContext/AppContext.js';
import UserContext from '../../contexts/UserContext/UserContext.js';
import { motion } from "motion/react"
import { FiLock } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { toast } from 'react-toastify';
// axios.defaults.withCredentials = true;

const LoginAndRegister = () => {
    const [currState, setCurrState] = useState('Login')

    const { backendUrl, setToken } = useContext(AppContext);
    const { setShowLogin } = useContext(LoginContext);
    const { setUser } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


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

        try {
            if (currState === 'Login') {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    // localStorage.getItem()
                    setShowLogin(false);
                    setEmail('');
                    setPassword('');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    // localStorage.getItem()
                    setShowLogin(false);
                    setName('');
                    setEmail('');
                    setPassword('');
                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            return document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <section className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='relative bg-white p-8 sm:p-10 rounded-xl'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium mb-1.5'>{currState}</h1>
                <p className='text-sm sm:text-base text-slate-500'>Welcome {currState === 'Login' ? 'back' : 'to PixAI'}! Please {currState === 'Login' ? 'login' : 'register'} to continue</p>

                {currState === 'Login' ?
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
                </div>

                {currState !== 'Login' &&
                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5 text-slate-500'>
                        <FiUser />
                        <input onChange={e => setName(e.target.value)} type="text" placeholder='Full Name' value={name} required className='outline-none text-sm' />
                    </div>
                }
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4 text-slate-500'>
                    <FiMail />
                    <input onChange={e => setEmail(e.target.value)} type="email" placeholder='Email id' value={email} required className='outline-none text-sm' />
                </div>
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4 text-slate-500'>
                    <FiLock />
                    <input onChange={e => setPassword(e.target.value)} type="password" placeholder='Password' value={password} required className='outline-none text-sm' />
                </div>

                {currState === 'Login' &&
                    <p className='text-sm text-blue-600 mt-4 cursor-pointer hover:underline ml-1 '>Forgot password?</p>
                }

                <button className='bg-zinc-600 w-full text-white py-2 mt-4 rounded-full hover:scale-[1.02] hover:bg-zinc-500 transition-all duration-200'>
                    {currState === 'Login' ? 'LOG IN' : 'SIGN UP'}
                </button>

                {currState === 'Login' ?
                    <p className='mt-5 text-center text-slate-500 text-sm'>Don't have an account? <span className='text-blue-600 hover:underline cursor-pointer' onClick={clickOnRegister} >Register</span></p>
                    :
                    <p className='mt-5 text-center text-slate-500 text-sm'>Already have an account? <span className='text-blue-600 hover:underline cursor-pointer' onClick={clickOnLogin} >Login</span></p>
                }

                <div onClick={() => setShowLogin(false)} className='absolute top-5 right-5 cursor-pointer text-zinc-400 border border-transparent p-0.5 hover:border-zinc-600 hover:text-zinc-600 hover:scale-105 rounded-full transition-all duration-150'>
                    <RxCross2 />
                </div>

            </motion.form>
        </section >
    )
}

export default LoginAndRegister