import React, { useState, useContext } from 'react'
import "./PlaygroundPage.css"
import { assets } from '../assets/assets.js'
import { motion } from "motion/react"
import AppContext from '../contexts/AppContext/AppContext.js';
import { toast } from 'react-toastify';
import Loader from '../components/custom/Loader.jsx';
import { getRandomPrompt } from '../utils/index.js'

const PlaygroundPage = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [input, setInput] = useState({ prompt: '', negative_prompt: '' });

  const { generateImage, image, setImage, isImageLoaded, setIsImageLoaded, viewportWidth, saveImageToCloudinary, navigate, loadTotalUserData } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input.prompt) {
      // await checkPrompt(input.prompt, input.negative_prompt);
      const image = await generateImage(input.prompt, input.negative_prompt);
      if (image) {
        setIsImageLoaded(true);
        setImage(image);
      }
    } else {
      toast.error('Prompt Missing')
    }
    setLoading(false);
  }

  const handleInput = (evt) => {
    const changedField = evt.target.name;
    const newVal = evt.target.value;
    setInput((currInput) => {
      return {
        ...currInput,
        [changedField]: newVal
      };
    })
  }

  const saveImage = async (e) => {
    e.preventDefault();
    setUploading(true);
    const shared = false;
    const savedImage = await saveImageToCloudinary(input.prompt, input.negative_prompt, image, shared);
    if(savedImage){
      toast.success('Image saved successfully');
      loadTotalUserData();
      navigate('/profile');
    }
    setUploading(false);
  }

  const shareImage = async (e) => {
    e.preventDefault();
    setUploading(true);
    const shared = true;
    const savedImage = await saveImageToCloudinary(input.prompt, input.negative_prompt, image, shared);
    if(savedImage){
      toast.success('Image shared successfully');
      loadTotalUserData();
      navigate('/community');
    }
    setUploading(false);
  }

  const modifyImage = () => {
    setIsImageLoaded(false);
  }

  const generateAnother = () => {
    setIsImageLoaded(false);
    setInput({ prompt: '', negative_prompt: '' });
    setImage(assets.sample_img_1);
  }

  const surpriseMe = (e) => {
    e.preventDefault();
    const randomPrompt = getRandomPrompt(input.prompt);
    setInput({ prompt: randomPrompt, negative_prompt: '' });
  }

  return (
    <motion.main className='min-h-[80vh] pt-8 mb-10'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h1 className='text-center text-3xl font-medium mb-3'>Playground</h1>
      <p className='text-base text-center text-zinc-500 mb-6 sm:mb-12'>Create imaginative & visually stunning images through PixAI and share them with the community</p>

      {viewportWidth >= 1300 &&
        // Visible on large screens
        <form onSubmit={onSubmitHandler} className='flex flex-row gap-10 justify-between items-center sm:px-10'>
          <section className='w-full flex flex-col justify-center max-w-xl text-white text-base'>
            {!isImageLoaded &&
              <>
                <label htmlFor="prompt" className='text-black mb-1'>Prompt:</label>
                <div className='bg-neutral-500 p-4 rounded-lg mb-4 focus-within:ring-2 focus-within:ring-stone-950 transition duration-150'>
                  <textarea value={input.prompt} onChange={handleInput} rows={5} name="prompt" id="prompt" placeholder='Describe your vision, and let us create it for you' className='bg-transparent outline-none w-full placeholder:text-[#e0e0e087] text-color' />
                </div>

                <label htmlFor="negative-prompt" className='text-black mb-1'>Negative Prompt:</label>
                <div className='bg-neutral-500 p-4 rounded-lg mb-4 focus-within:ring-2 focus-within:ring-stone-950 transition duration-150'>
                  <textarea value={input.negative_prompt} onChange={handleInput} rows={2} name="negative_prompt" id="negative-prompt" placeholder='Define things that you do not want in your image' className='bg-transparent outline-none w-full placeholder:text-[#e0e0e087] text-color' />
                </div>

                <div className='flex gap-5 mb-5'>
                  <button type='submit' className='text-[#e5e5e5] bg-zinc-900 w-36 py-3 rounded-full hover:bg-zinc-700 hover:scale-105 transition-all duration-200'>
                    Generate
                  </button>
                  <button onClick={surpriseMe} className='bg-transparent border border-zinc-900 text-black rounded-full w-36 py-2.5 hover:bg-[#0000000f] hover:scale-105 transition-all duration-200'>
                    Surprise Me!
                  </button>
                </div>
                <p className='text-zinc-600 text-sm'>(Need inspiration? Try the "Surprise Me" option for a random, stunning image!)</p>
              </>
            }
            {isImageLoaded &&
              <div className='flex flex-col justify-center items-center'>
                <div className='text-black mb-5'>
                  <p><span className='font-semibold'>Prompt: </span>{input.prompt}</p>
                  {input.negative_prompt &&
                    <p className='mt-3'><span className='font-semibold'>Negative Prompt: </span>{input.negative_prompt}</p>
                  }
                </div>
                <div className='mb-5 flex items-center justify-center gap-5'>
                  <a href={image} download>
                    <div className='bg-[#b0296e] inline-block py-3 w-36 text-center rounded-full hover:bg-[#b0296fc0] hover:scale-105 transition-all duration-200'>
                      Download
                    </div>
                  </a>

                  <button onClick={shareImage} className='bg-[#f0ba58] py-3 w-52 rounded-full hover:bg-[#f0bb58c6] hover:scale-105 transition-all duration-200'>
                    Share with Community
                  </button>

                  <button onClick={saveImage} className='bg-[#266bb6] py-3 w-36 rounded-full hover:bg-[#266cb6bd] hover:scale-105 transition-all duration-200'>
                    Save to Profile
                  </button>
                </div>
                <div className='flex items-center justify-center gap-5 mb-7'>
                  <button onClick={modifyImage} className='bg-transparent border border-zinc-900 text-black rounded-full w-40 py-2.5 hover:bg-[#0000000f] hover:scale-105 transition-all duration-200'>
                    Modify Prompt
                  </button>
                  <button onClick={generateAnother} className='text-[#e5e5e5] bg-zinc-900 rounded-full w-44 py-2.5 hover:bg-zinc-700 hover:scale-105 transition-all duration-200'>
                    Generate Another
                  </button>
                </div>
                <p className='text-sm text-neutral-500'>(Note: Sharing the image with community automatically saves it to your profile)</p>
              </div>
            }
          </section>

          <section>
            <div className='relative'>
              <img src={image} alt="generated-image" className='max-w-lg rounded' />
              {/* <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} /> */}
              {(loading || uploading) &&
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                  <Loader />
                </div>
              }
            </div>
            <p className={!loading ? 'hidden' : ''}>Loading...</p>
          </section>
        </form>
      }

      {viewportWidth < 1300 &&
        // Visible on medium and small screens 
        <form onSubmit={onSubmitHandler} className='flex flex-col justify-center items-center'>
          <section>
            <div className='relative'>
              <img src={image} alt="generated-image" className='max-w-xs sm:max-w-md md:max-w-lg rounded' />
              {/* <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} /> */}
              {(loading || uploading) &&
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                  <Loader />
                </div>
              }
            </div>
            <p className={!loading ? 'hidden' : ''}>Loading...</p>
          </section>

          <section className={`w-full flex flex-col justify-center max-w-xl text-white text-sm mt-10 ${!isImageLoaded ? '' : 'items-center'}`}>
            {!isImageLoaded &&
              <>
                <label htmlFor="prompt" className='text-black mb-1'>Prompt:</label>
                <div className='bg-neutral-500 p-4 rounded-lg mb-4'>
                  <textarea value={input.prompt} onChange={handleInput} rows={4} name="prompt" id="prompt" placeholder='Describe your vision, and let us create it for you' className='bg-transparent outline-none w-full text-color' />
                </div>

                <label htmlFor="negative-prompt" className='text-black mb-1'>Negative Prompt:</label>
                <div className='bg-neutral-500 p-4 rounded-lg mb-4'>
                  <textarea value={input.negative_prompt} onChange={handleInput} rows={2} name="negative_prompt" id="negative-prompt" placeholder='Define things that you do not want in your image' className='bg-transparent outline-none w-full text-color' />
                </div>

                <div className='flex justify-center items-center gap-3 mb-5'>
                  <button type='submit' className='text-[#e5e5e5] bg-zinc-900 w-36 py-3 rounded-full hover:bg-zinc-700 hover:scale-105 transition-all duration-200'>
                    Generate
                  </button>
                  <button onClick={surpriseMe} className='bg-transparent border border-zinc-900 text-black rounded-full w-32 py-2.5 hover:bg-[#0000000f] hover:scale-105 transition-all duration-200'>
                    Surprise Me!
                  </button>
                </div>
                <p className='text-zinc-600 text-xs text-center'>(Need inspiration? Try the "Surprise Me" option for a random, stunning image!)</p>
              </>
            }
            {isImageLoaded &&
              <>
                <div className='text-black mb-5'>
                  <p><span className='font-semibold'>Prompt: </span>{input.prompt}</p>
                  {input.negative_prompt &&
                    <p className='mt-2'><span className='font-semibold'>Negative Prompt: </span>{input.negative_prompt}</p>
                  }
                </div>
                <div className='flex justify-center items-center mb-3 gap-3'>
                  <a href={image} download>
                    <div className='bg-[#b0296e] py-3 w-24 inline-block text-center rounded-full hover:bg-[#b0296fc0] hover:scale-105 transition-all duration-200'>
                      Download
                    </div>
                  </a>

                  <button onClick={shareImage} className='bg-[#f0ba58] py-3 w-24 rounded-full hover:bg-[#f0bb58c6] hover:scale-105 transition-all duration-200'>
                    Share
                  </button>

                  <button onClick={saveImage} className='bg-[#266bb6] py-3 w-24 rounded-full hover:bg-[#266cb6bd] hover:scale-105 transition-all duration-200'>
                    Save
                  </button>
                </div>
                <div className='sm:text-base flex items-center justify-center gap-3 mb-5'>
                  <button onClick={modifyImage} className='bg-transparent border border-zinc-900 text-black rounded-full w-32 sm:w-40 py-2.5 hover:bg-[#0000000f] hover:scale-105 transition-all duration-200'>
                    Modify Prompt
                  </button>
                  <button onClick={generateAnother} className='text-[#e5e5e5] bg-zinc-900 rounded-full w-36 sm:w-44 py-2.5 hover:bg-zinc-700 hover:scale-105 transition-all duration-200'>
                    Generate Another
                  </button>
                </div>
                <p className='text-xs text-center text-neutral-500'>(Note: Sharing the image with community automatically saves it to your profile)</p>
              </>
            }
          </section>
        </form>
      }
    </motion.main>
  )


}

export default PlaygroundPage