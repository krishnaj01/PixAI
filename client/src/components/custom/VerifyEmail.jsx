import React, { useContext, useEffect, useRef, useState } from 'react'

import { motion } from "motion/react"
import { toast } from 'react-toastify';
import axios from 'axios';

import { RxCross2 } from "react-icons/rx";

import AppContext from '../../contexts/AppContext/AppContext.js';
import LoginContext from '../../contexts/LoginContext/LoginContext.js';
import UserContext from '../../contexts/UserContext/UserContext.js';

import Loader from './Loader.jsx';

const VerifyEmail = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);

    // References for the 6 input fields to manipulate their focus programmatically.
    const inputRefs = useRef([]);

    const { loading, setLoading, backendUrl, loadTotalUserData } = useContext(AppContext);

    const { tempUserId, setUser } = useContext(UserContext);

    const { setShowVerifyEmail } = useContext(LoginContext);

    const handleChange = (index, value) => {
        const newCode = [...code];

        // Handle pasted code
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");

            // if lastfilledindex is less than 5 then focus on the next index else focus on the last index
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;

            inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (code.every(digit => digit != '')) {
                const verificationCode = code.join('');
                const { data } = await axios.post(`${backendUrl}/api/user/verify-email`, { userId: tempUserId, code: verificationCode });

                if (data.success) {
                    // setToken(data.token);
                    setUser(data.user);
                    setCode(["", "", "", "", "", ""]);
                    setShowVerifyEmail(false);
                    await loadTotalUserData();
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } else {
                toast.error('All fields are required');
            }

        } catch (error) {
            toast.error(error.message);
        }

        setLoading(false);
    }

    const sendCodeAgain = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/send-code-again`, { userId: tempUserId });
            if(data.success){
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Auto submit when all fields are filled
    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            handleSubmit(new Event('submit'));
        }
    }, [code])

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            return document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <section className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form className='relative bg-white px-8 sm:px-10 pt-8 sm:pt-10 pb-8 rounded-xl'
                onSubmit={handleSubmit}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium mb-1.5'>Verify Your Email</h1>
                <p className='text-sm sm:text-base text-slate-500'>Enter the 6-digit code sent to your email address</p>

                <div className='flex justify-between mt-5'>
                    {code.map((digit, idx) => (
                        <div key={idx} className='rounded-lg focus:ring-1 focus:ring-zinc-600 transition duration-150'>
                            <input type="text" maxLength='6' value={digit}
                                ref={(el) => (inputRefs.current[idx] = el)}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-[#0000000f] border-2 border-zinc-400 text-zinc-800 rounded-lg' />
                        </div>
                    ))}
                </div>

                <button disabled={loading} className={`bg-zinc-700 w-full text-white py-2 mt-4 rounded-full ${!loading ? 'hover:bg-zinc-500 hover:scale-105 transition-all duration-200' : 'bg-zinc-500'}`}>
                    {!loading ? 'Verify' : <Loader width={6} />}
                </button>

                <div onClick={sendCodeAgain} className='flex items-center justify-center text-sm gap-1 text-blue-600 mt-4 cursor-pointer hover:underline ml-1 '>
                    <p>Send code again</p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowVerifyEmail(false)} className='absolute top-5 right-5 cursor-pointer text-zinc-400 border border-transparent p-0.5 hover:border-zinc-600 hover:text-zinc-600 rounded-full transition-all duration-150'>
                    <RxCross2 />
                </motion.div>

            </motion.form>
        </section>
    )
}

export default VerifyEmail