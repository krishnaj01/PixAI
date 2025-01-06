import React, { useState } from 'react'

import './Accordion.css'

import { FaAngleDown, FaAngleUp } from "react-icons/fa6";


const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-item border-b border-[#ccc]">
            <div className="bg-white/20 p-5 text-xl font-medium cursor-pointer flex justify-between items-center" onClick={toggleAccordion}>
                <h2>{title}</h2>
                <span>{isOpen ? <FaAngleUp /> : <FaAngleDown />}</span>
            </div>
            {isOpen &&
                <div className="flex flex-col justify-center gap-2 p-4 text-base bg-black/10 text-zinc-700">
                    {content.map((point, idx) => (
                        <p key={`${title}-${idx}`}>
                            {idx + 1}. {point}
                        </p>
                    ))}
                </div>
            }
        </div>
    );
}

export default AccordionItem