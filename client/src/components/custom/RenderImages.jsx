import React from 'react'
import Card from './Card'

const RenderImages = ({ images, title, imgWidth }) => {
    if (images.length > 0) {
        return images.map((image) => {
            return <Card key={image._id} {...image} imgWidth={imgWidth} />
        })
    } else {
        return (
            <h2 className='font-medium text-center text-zinc-800 text-lg'>{title}</h2>
        )
    }
}

export default RenderImages