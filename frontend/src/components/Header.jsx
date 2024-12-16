import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({ heading, paragraph, linkName, linkUrl = '#' }) => {
  return (
    <div className='mb-10'>
      <div className='flex justify-center'>

      </div>
      <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
        {heading}
      </h2>
      <p className=' text-center text-m text-gray-600 mt-5'>
        {paragraph}{' '}
        <Link
          to={linkUrl}
          className='font-me dium text-purple-600 hover:text-purple-500'
        >
          {linkName}
        </Link>
      </p>
    </div>
  )
}

export default Header
