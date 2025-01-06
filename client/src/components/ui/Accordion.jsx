import React from 'react'

import './Accordion.css';

import { guidelines } from '../../assets/assets.js';

import AccordionItem from './AccordionItem';


const Accordion = () => {
    return (
        <div className="w-full max-w-4xl text-base overflow-hidden shadow-md border rounded-lg ">
            {guidelines.map((item, idx) => (
                <AccordionItem key={idx} title={item.title} content={item.content} />
            ))}
        </div>
    );

}

export default Accordion