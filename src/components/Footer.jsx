import React from 'react'

function Footer() {
  return (
    <div className='bg-black text-white mt-8'>

      {/* Main Footer */}
      <div className='px-8 md:px-[200px] py-10 flex flex-col md:flex-row justify-between gap-8'>

        {/* Section 1 */}
        <div>
          <h2 className='font-semibold text-lg mb-3'>Blogs</h2>
          <p className='hover:text-gray-400 cursor-pointer'>Featured Blogs</p>
          <p className='hover:text-gray-400 cursor-pointer'>Most Viewed</p>
          <p className='hover:text-gray-400 cursor-pointer'>Reader’s Choice</p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className='font-semibold text-lg mb-3'>Community</h2>
          <p className='hover:text-gray-400 cursor-pointer'>Forum</p>
          <p className='hover:text-gray-400 cursor-pointer'>Support</p>
          <p className='hover:text-gray-400 cursor-pointer'>Recent Posts</p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className='font-semibold text-lg mb-3'>Company</h2>
          <p className='hover:text-gray-400 cursor-pointer'>Privacy Policy</p>
          <p className='hover:text-gray-400 cursor-pointer'>About Us</p>
          <p className='hover:text-gray-400 cursor-pointer'>Terms & Conditions</p>
        </div>

      </div>

      {/* Bottom Line */}
      <div className='text-center border-t border-gray-700 py-4 text-sm'>
        © 2026 by Raju
      </div>

    </div>
  )
}

export default Footer