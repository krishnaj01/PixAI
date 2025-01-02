import React from 'react'
import { assets } from '../../assets/assets'
import { motion } from "motion/react"

const HomeDescription = () => {
    return (
        <motion.section
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='flex flex-col items-center justify-center my-24 p-6 md:px-28'>
            <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Create AI Images</h1>
            <p className='text-lg text-gray-600 mb-8 text-center'>From Thoughts to Masterpieces in Seconds</p>

            <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
                <img src={assets.sample_img_1} alt="sample-image" className='w-80 xl:w-96 rounded-lg' />
                <div>
                    <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing the AI-Powered Text to Image Generator</h2>
                    <p className='text-gray-600 mb-4 text-justify'>Effortlessly transform your ideas into reality with PixAI image generator. Whether you need striking visuals or one-of-a-kind designs, just describe it, and watch as your text becomes captivating images in an instant. Imagine, create, and amaze.</p>

                    <p className='text-gray-600 text-justify'>Just enter a text prompt, and our cutting-edge AI will generate high-quality images in seconds. Whether it's product visuals, character designs, portraits, or concepts yet to be imagined, our technology brings your ideas to life effortlessly. The creative possibilities are endless!</p>
                </div>
            </div>
        </motion.section>
    )
}

export default HomeDescription