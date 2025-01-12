import React, { useContext, useState, useEffect } from 'react'

import { motion } from "motion/react"
import { toast } from 'react-toastify'
import axios from 'axios'
axios.defaults.withCredentials = true;

import UserContext from '../contexts/UserContext/UserContext.js'
import AppContext from '../contexts/AppContext/AppContext'

import Loader from '../components/custom/Loader.jsx'
import RenderImages from '../components/custom/RenderImages'


const ProfilePage = () => {

  const { user } = useContext(UserContext);
  const { credit, backendUrl, scrollbarProperties, viewportWidth, loading, setLoading, resetImageData } = useContext(AppContext);

  const [userSavedImages, setUserSavedImages] = useState([]);
  const [userSharedImages, setUserSharedImages] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchedSavedImages, setSearchedSavedImages] = useState([]);
  const [searchedSharedImages, setSearchedSharedImages] = useState([]);

  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const sharedSearchResults = userSharedImages.filter((image) =>
          (image.prompt.toLowerCase().includes(searchText.toLowerCase())) && image.shared);

        const savedSearchResults = userSavedImages.filter((image) =>
          (image.prompt.toLowerCase().includes(searchText.toLowerCase())) && !image.shared);

        setSearchedSharedImages(sharedSearchResults);
        setSearchedSavedImages(savedSearchResults);

      }, 500)
    );
  }

  useEffect(() => {
    if (user) {
      const divSvgContainer = document.getElementById('profile-picture-profilepage');
      divSvgContainer.innerHTML = user.profilePicture;
    }
  }, [user]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/image/get-user-images`);
        if (data.success) {
          const sharedUserImages = data.images.filter((image) => image.shared).reverse();
          const savedUserImages = data.images.filter((image) => !image.shared).reverse();

          setUserSharedImages(sharedUserImages);
          setUserSavedImages(savedUserImages);

        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    }

    fetchImages();
    resetImageData();
  }, []);


  return (
    <motion.main
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='pt-10 mb-8 flex flex-col items-center justify-center'>
      <h1 className='text-center text-3xl font-medium mb-3'>Dashboard</h1>
      <p className='text-center text-base text-zinc-500 mb-6 sm:mb-10'>Welcome to your dashboard! Track, manage, and explore all in one place.</p>

      {viewportWidth >= 1024 &&

        <div className='flex justify-center items-center gap-8 customScreen2:gap-16 h-[85vh] mt-10'>
          <section className='flex flex-col items-center justify-center h-full bg-black/20 py-16 px-4 customScreen3:px-8 rounded-xl'>
            <div className='w-64 mb-7 border-[0.2rem] border-zinc-800 rounded-full' id='profile-picture-profilepage'></div>
            <h1 className='text-3xl font-semibold mb-3 text-zinc-800'>{user.name}</h1>
            <p className='text-xl text-neutral-700 font-medium mb-7'>Credits Left: {credit}</p>

            <p className='text-lg text-neutral-700 mb-1'>
              <span className='font-semibold'>#</span> Images generated: <span className='font-medium'>{user.numberGenerated}</span>
            </p>
            <p className='text-lg text-neutral-700 mb-1'>
              <span className='font-semibold'>#</span> Images shared: <span className='font-medium'>{user.numberShared}</span>
            </p>
            <p className='text-lg text-neutral-700'>
              <span className='font-semibold'>#</span> Images saved: <span className='font-medium'>{user.numberSaved}</span>
            </p>
          </section>

          <section className='py-3 justify-start w-[50vw] h-[85vh]'>
            <div className='flex items-center justify-center'>
              <div className='bg-neutral-500 flex-1 px-4 py-2.5 rounded-md mb-5 focus-within:ring-2 focus-within:ring-stone-950 transition duration-150'>
                <input onChange={handleSearch} type="text" name="searchImages" id="search-images" value={searchText} placeholder='Search Images' className='bg-transparent outline-none w-full placeholder:text-[#e0e0e087] text-[#e0e0e0]' />
              </div>
            </div>

            <div className='mt-5'>
              {loading ?
                <div className='flex justify-center items-center'>
                  <Loader />
                </div>
                :
                <div>
                  {searchText &&
                    <h2 className='text-xl mb-8 customScreen3:mb-12 text-center'>
                      Showing results for "<span className='font-semibold'>{searchText}</span>"
                    </h2>
                  }
                  <div className='flex gap-8 min-w-[50vw] max-h-[72vh]'>
                    <div className='flex-1 flex flex-col gap-2 items-center justify-start'>
                      <h2 className='text-xl customScreen3:text-2xl font-medium'>Shared Images</h2>
                      <div className={`flex flex-wrap gap-2.5 lg:gap-4 items-start justify-center overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 ${scrollbarProperties}`}>
                        {searchText ?
                          <RenderImages images={searchedSharedImages} title="No search results found" imgWidth={true} />
                          :
                          <RenderImages images={userSharedImages} title="No posts found" imgWidth={true} />
                        }
                      </div>
                    </div>
                    <div className='flex-1 flex flex-col gap-2 items-center justify-start'>
                      <h2 className='text-xl customScreen3:text-2xl font-medium'>Saved Images</h2>
                      <div className={`flex flex-wrap gap-2.5 lg:gap-4 items-start justify-center overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 ${scrollbarProperties}`}>
                        {searchText ?
                          <RenderImages images={searchedSavedImages} title="No search results found" imgWidth={true} />
                          :
                          <RenderImages images={userSavedImages} title="No posts found" imgWidth={true} />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        </div>
      }
      {viewportWidth < 1024 &&
        <>
          <section className='flex flex-col customScreen5:flex-row items-center customScreen4:w-[80vw] justify-center gap-4 customScreen5:gap-8 bg-black/20 py-4 px-8 customScreen4:px-4 rounded-xl mb-7'>
            <div className='w-20 customScreen5:w-40 border-[0.2rem] border-zinc-800 rounded-full' id='profile-picture-profilepage'></div>
            <div>
              <h1 className='text-2xl font-semibold mb-1 text-zinc-800'>{user.name}</h1>
              <p className='text-lg text-neutral-700 font-medium mb-4 customScreen4:mb-7'>Credits Left: {credit}</p>
              <div className='flex flex-col customScreen4:flex-row gap-2 customScreen4:gap-8 text-sm customScreen4:text-base text-neutral-700 '>
                <p>
                  <span className='font-semibold'>#</span> Images generated: <span className='font-medium'>{user.numberGenerated}</span>
                </p>
                <p>
                  <span className='font-semibold'>#</span> Images shared: <span className='font-medium'>{user.numberShared}</span>
                </p>
                <p>
                  <span className='font-semibold'>#</span> Images saved: <span className='font-medium'>{user.numberSaved}</span>
                </p>
              </div>
            </div>
          </section>

          <div className='flex items-center justify-center'>
            <div className='bg-neutral-500 w-[75vw] flex-1 px-4 py-2.5 rounded-md mb-5 focus-within:ring-2 focus-within:ring-stone-950 transition duration-150'>
              <input onChange={handleSearch} type="text" name="searchImages" id="search-images" value={searchText} placeholder='Search Images' className='bg-transparent outline-none w-full placeholder:text-[#e0e0e087] text-[#e0e0e0]' />
            </div>
          </div>

          <div className='mt-5'>
            {loading ?
              <div className='flex justify-center items-center'>
                <Loader />
              </div>
              :
              <div>
                {searchText &&
                  <h2 className='text-xl mb-8 customScreen3:mb-12 text-center'>
                    Showing results for "<span className='font-semibold'>{searchText}</span>"
                  </h2>
                }
                <div className='flex gap-8 min-w-[80vw] sm:min-w-[50vw] max-h-[45vh]'>
                  <div className='flex-1 flex flex-col gap-2 items-center justify-center'>
                    <h2 className='text-xl customScreen3:text-2xl font-medium'>Shared Images</h2>
                    <div className={`flex-1 flex flex-wrap gap-2.5 lg:gap-4 items-start justify-center overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 ${scrollbarProperties}`}>
                      {searchText ?
                        <RenderImages images={searchedSharedImages} title="No search results found" imgWidth={true} />
                        :
                        <RenderImages images={userSharedImages} title="No posts found" imgWidth={true} />
                      }
                    </div>
                  </div>
                  <div className='flex-1 flex flex-col gap-2 items-center justify-center'>
                    <h2 className='text-xl customScreen3:text-2xl font-medium'>Saved Images</h2>
                    <div className={`flex flex-1 flex-wrap gap-2.5 lg:gap-4 items-start justify-center overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 ${scrollbarProperties}`}>
                      {searchText ?
                        <RenderImages images={searchedSavedImages} title="No search results found" imgWidth={true} />
                        :
                        <RenderImages images={userSavedImages} title="No posts found" imgWidth={true} />
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

        </>
      }
    </motion.main>

  )
}

export default ProfilePage