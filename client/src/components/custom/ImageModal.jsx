import React, { useContext, useEffect, useState } from 'react'
import { motion } from "motion/react"
import { RxCross2 } from "react-icons/rx";
import AppContext from '../../contexts/AppContext/AppContext'
import { assets } from '../../assets/assets';
import UserContext from '../../contexts/UserContext/UserContext';
import { toast } from 'react-toastify';
import Loader from './Loader.jsx';
import axios from 'axios';

const ImageModal = () => {

    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const { setShowImage, imageDetails, scrollbarProperties, viewportWidth, token, backendUrl, navigate } = useContext(AppContext);
    const { _id, authorId, authorProfilePic, authorName, prompt, negative_prompt, imgURL, shared } = imageDetails;

    const toggleSharedStatus = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${backendUrl}/api/image/toggle-share`, { imageId: _id }, {
                headers: { token }
            });

            if (data.success) {
                setShowImage(false);
                if (shared) {
                    toast.success('Successfully removed image');
                    navigate('/profile');
                } else {
                    toast.success('Successfully shared image');
                    navigate('/community');
                }
            } else {
                toast.error(data.message);
            }
            setLoading(false);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const deleteImage = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${backendUrl}/api/image/delete-image`, { imageId: _id }, {
                headers: { token }
            });
            if (data.success) {
                setShowImage(false);
                toast.success(data.message);
                navigate('/profile');
            } else {
                toast.error(data.message);
            }
            setLoading(false);
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

    useEffect(() => {
        if (authorProfilePic) {
            const divSvgContainer = document.getElementById('profile-picture-imageModal');
            divSvgContainer.innerHTML = authorProfilePic;
        }
    }, [authorProfilePic]);

    return (
        <section className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.main className='relative bg-neutral-100 p-7 md:p-8 lg:p-10 rounded-xl w-[80vw] md:w-[60vw] lg:w-[85vw]'
                initial={{ opacity: 0.2, y: 100 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >

                {viewportWidth >= 1024 &&
                    // Visible on large screens
                    <div className='flex justify-center gap-10'>
                        <div className='relative'>
                            <img src={imgURL} alt="image" className='max-w-md h-auto rounded-xl' />
                            {loading &&
                                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                                    <Loader />
                                </div>
                            }

                        </div>

                        <div className='flex-1 flex flex-col text-lg'>
                            <div className='flex-1 flex flex-col justify-center'>
                                <p className='font-bold'>Prompt:</p>
                                <div className={`h-[5rem] overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1.5 ${scrollbarProperties}`}>
                                    <p className='text-zinc-500 text-justify mr-2'>{prompt}</p>
                                </div>
                                {negative_prompt &&
                                    <>
                                        <p className='font-bold mt-4'>Negative Prompt:</p>
                                        <div className={`h-[4rem] overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1.5 ${scrollbarProperties}`}>
                                            <p className='text-zinc-500 text-justify mr-2'>{negative_prompt}</p>
                                        </div>
                                    </>
                                }
                                <div className='mt-8 mb-5'>
                                    <p className='text-stone-400 text-right mb-2'>Generated By</p>
                                    <div className='flex items-center justify-end gap-2'>
                                        <div id='profile-picture-imageModal' className='border-[0.1rem] border-zinc-900 rounded-full w-8'></div>
                                        <p className='text-zinc-700'>{authorName}</p>
                                    </div>
                                </div>
                            </div>

                            {(user && (user.userId === authorId)) &&
                                <div className='flex items-center justify-end gap-5 mb-8 text-sm'>
                                    <button onClick={toggleSharedStatus} className='bg-transparent border border-zinc-900 text-black rounded-full w-56 py-2.5 hover:bg-[#0000000f] hover:scale-105 transition-all duration-200'>
                                        {shared ? 'Remove from Community' : 'Share to Community'}
                                    </button>
                                    <button onClick={deleteImage} className='text-[#e5e5e5] bg-zinc-900 w-36 py-3 rounded-full hover:bg-zinc-700 hover:scale-105 transition-all duration-200'>
                                        Delete
                                    </button>
                                </div>
                            }

                            <div className='flex justify-center'>
                                <img src={assets.logo} alt="logo-icon" width={200} />
                            </div>
                        </div>

                    </div>
                }

                {viewportWidth < 1024 &&
                    // Visible on medium and small screens 
                    <div className='flex flex-col items-center text-sm'>
                        <img src={imgURL} alt="image" className='md:w-[100%] h-auto rounded-xl' />

                        <p className='font-bold mt-4'>Prompt:</p>
                        <div className={`h-[5rem] overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1.5 ${scrollbarProperties}`}>
                            <p className='text-zinc-500 text-justify mr-2'>{prompt}</p>
                        </div>
                        {negative_prompt &&
                            <>
                                <p className='font-bold mt-4'>Negative Prompt:</p>
                                <div className={`h-[5rem] overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1.5 ${scrollbarProperties}`}>
                                    <p className='text-zinc-500 text-justify mr-2'>{negative_prompt}</p>
                                </div>
                            </>
                        }

                        <div className='mt-2 mb-5'>
                            <p className='text-stone-400 text-right mb-2'>Generated By</p>
                            <div className='flex items-center justify-end gap-2'>
                            <div id='profile-picture-imageModal' className='border-[0.1rem] border-zinc-900 rounded-full w-8'></div>
                                <p className='text-zinc-700'>{authorName}</p>
                            </div>
                        </div>

                        {(user && (user.userId === authorId)) &&
                            <div className='flex flex-col items-center justify-end gap-2 mb-8 text-xs'>
                                <button onClick={toggleSharedStatus} className='bg-transparent border border-zinc-900 text-black rounded-full w-44 py-2.5 hover:bg-[#0000000f] hover:scale-105 transition-all duration-200'>
                                    {shared ? 'Remove from Community' : 'Share to Community'}
                                </button>
                                <button onClick={deleteImage} className='text-[#e5e5e5] bg-zinc-900 w-24 py-3 rounded-full hover:bg-zinc-700 hover:scale-105 transition-all duration-200'>
                                    Delete
                                </button>
                            </div>
                        }


                        <div className='flex justify-center'>
                            <img src={assets.logo} alt="logo-icon" width={200} />
                        </div>


                    </div>
                }

                <div onClick={() => setShowImage(false)} className='absolute top-3 right-3 lg:top-5 lg:right-5 cursor-pointer text-zinc-400 border border-transparent p-0.5 hover:border-zinc-600 hover:text-zinc-600 hover:scale-105 rounded-full transition-all duration-150'>
                    <RxCross2 />
                </div>
            </motion.main>
        </section>
    )
}

export default ImageModal