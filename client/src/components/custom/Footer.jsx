import React from 'react'

import { FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { FaGithubSquare } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <footer className='py-3 mt-20 border-t border-solid '>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-center mb-7'>
                {/* Div 1: Visible on all screen sizes */}
                <div className='flex flex-col items-center justify-center mt-10'>
                    <img src={assets.logo_text} alt="logo-text" className='w-72' />
                    <p className='text-base sm:text-lg text-gray-600 my-1'>Transform ideas into stunning visuals.</p>
                    <p className='flex-1 border-t border-gray-300 text-sm text-gray-500 pt-1'>&copy; PixAI Copyrights Reserved 2024</p>
                </div>

                {/* Div 2: Visible only on large screens (lg:grid-cols-3) */}
                <div className='hidden lg:flex items-center justify-center'>
                    <img src={assets.logo_icon} alt="logo-icon" className="rounded-full h-44" />
                </div>

                {/* Div 3: Visible on medium and larger screens (md:grid-cols-2 and lg:grid-cols-3) */}
                <div className='hidden md:flex flex-col gap-1 mt-10'>
                    <h2 className='text-2xl font-medium mb-5'>Contact Me</h2>
                    <div className='flex gap-3 items-center justify-center text-4xl'>
                        <a href='https://www.instagram.com/krishna_jhanwar01/' target="_blank" className='border p-2 rounded-full border-zinc-900'>
                            <FaSquareInstagram className='p-1 hover:p-0.5' />
                        </a>
                        <a href='https://github.com/krishnaj01' target="_blank" className='border p-2 rounded-full border-zinc-900'>
                            <FaGithubSquare className='p-1 hover:p-0.5' />
                        </a>
                        <a href='https://www.linkedin.com/in/krishna-jhanwar-498022290/' target="_blank" className='border p-2 rounded-full border-zinc-900'>
                            <FaLinkedin className='p-1 hover:p-0.5' />
                        </a>
                        <a href='mailto:krishna.jhanwar2005@gmail.com' target="_blank" className='border p-2 rounded-full border-zinc-900'>
                            <IoIosMail className='p-0.5 hover:p-0' />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer