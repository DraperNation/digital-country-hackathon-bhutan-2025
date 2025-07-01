import React from 'react'
import { Github, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <div className='w-full fixed bottom-0 h-8 flex items-center justify-between px-4 bg-blue-100 text-xs'>
            <p className='text-blue-950'>
                Made as a prototype submission for E-Bhutan Hackathon 2025 by Shaan Sundar
            </p>
            <div className='flex h-full items-center justify-center gap-4'>
                <a className='h-full flex items-center justify-center aspect-square bg-blue-300 hover:bg-blue-400 text-blue-800 hover:text-blue-950 transition-colors' href='https://github.com/shaansundar' target='_blank' rel='noopener noreferrer'>
                    <Github className='w-4 h-4' />
                </a>
                <a className='h-full flex items-center justify-center aspect-square bg-blue-300 hover:bg-blue-400 text-blue-800 hover:text-blue-950 transition-colors' href='https://x.com/0xNotthatsundar' target='_blank' rel='noopener noreferrer'>
                    <Twitter className='w-4 h-4' />
                </a>
                <a className='h-full flex items-center justify-center aspect-square bg-blue-300 hover:bg-blue-400 text-blue-800 hover:text-blue-950 transition-colors' href='https://www.linkedin.com/in/notthatsundar/' target='_blank' rel='noopener noreferrer'>
                    <Linkedin className='w-4 h-4' />
                </a>
            </div>
        </div>
    )
}

export default Footer