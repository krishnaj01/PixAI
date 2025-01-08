import React, { useContext, useEffect } from 'react'
import AppContext from '../../contexts/AppContext/AppContext.js';

const Card = ({ _id, authorProfilePic, authorId, authorName, prompt, negative_prompt, imgURL, shared, imgWidth }) => {

  const { setShowImage, setImageDetails, scrollbarProperties } = useContext(AppContext);

  const handleClick = (imgDetails) => {
    setShowImage(true);
    setImageDetails(imgDetails);
  }

  useEffect(() => {
    if (authorProfilePic && !imgWidth) {
      const divSvgContainer = document.getElementById(`profile-picture-card-${_id}`);
      divSvgContainer.innerHTML = authorProfilePic;
    }
  }, [authorProfilePic]);

  return (
    <div onClick={() => handleClick({_id, authorProfilePic, authorId, authorName, prompt, negative_prompt, imgURL, shared})} className={`rounded-xl group relative shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 ${imgWidth ? 'w-[7rem] customScreen2:w-[10rem]' : 'card'}`}>
      <img src={imgURL} alt={prompt} className='w-full h-auto object-cover rounded-xl' />

      <div className='group-hover:flex flex-col max-h-[90%] hidden absolute bottom-0 left-0 right-0 bg-[#0000007d] m-2 p-4 rounded-md'>
        <p className={`text-white text-left text-md overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1 ${scrollbarProperties}`}>
          {prompt}
        </p>

        {!imgWidth &&
          <div className='mt-5 flex justify-between items-center gap-2'>
            <div className='flex items-center gap-2'>
              <div className='border-[0.1rem] border-zinc-900 rounded-full w-8' id={`profile-picture-card-${_id}`}></div>
              <p className='text-white text-sm'>{authorName}</p>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Card