export default function NotFound() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='text-4xl font-bold text-gray-900'>Not Found</h1>
      <p className='text-gray-500 mt-4'>The page you are looking for does not exist</p>
      <button className='mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer duration-300'>Go to home</button>
    </div>
  )
}