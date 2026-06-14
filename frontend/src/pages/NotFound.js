import { useNavigate } from 'react-router-dom';
import Navbar from "./../components/common/Navbar";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-ui-mainBg">
      <Navbar />
      <main id="main-content" className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)]">
        <h1 className="text-4xl font-bold text-content-paragraph">Not Found</h1>
        <p className="text-content-subtitle mt-4">The page you are looking for does not exist</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-brand-primary text-white px-4 py-2 rounded-2xl font-bold hover:bg-brand-hover transition-colors cursor-pointer duration-300 active:scale-95"
        >
          Go to home
        </button>
      </main>
    </div>
  )
}