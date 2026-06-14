import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (user?.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-ui-mainBg'>
      <h1 className='text-6xl font-black text-brand-primary mb-4'>403</h1>
      <h2 className='text-2xl font-bold text-content-paragraph mb-2'>Access Denied</h2>
      <p className='text-content-subtitle mb-8'>You don't have permission to view this page.</p>
      <button
        onClick={handleGoBack}
        className='bg-brand-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-hover transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand-primary/20'
      >
        Go Back Home
      </button>
    </div>
  )
}