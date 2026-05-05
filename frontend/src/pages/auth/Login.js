import { ArrowRight, Mail, Lock, EyeOff, Eye } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import img from "../../assets/auth.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/cartContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { cartItems } = useCart();

  const { formData, errors, showPassword, setShowPassword, handleChange, handleSubmit } = useForm({
    email: "",
    password: ""
  }, onSuccess, "login");

  async function onSuccess() {
    const result = await login(formData.email, formData.password);
    if (result.success) {
      const loggedInUser = result.user;
      if (cartItems.length > 0) {
        navigate("/checkout");
      } else if (loggedInUser.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }



  return (
    <div className="min-h-screen bg-ui-mainBg">
      <Navbar />

      <main className="flex justify-center items-center overflow-hidden p-4">
        <section className="flex bg-ui-white rounded-2xl overflow-hidden max-w-5xl w-full flex-col md:flex-row min-h-[600px]">

          <div className="hidden md:block w-1/2">
            <img src={img} alt="login culinary" className="w-full h-full object-cover" />
          </div>

          <div className="p-8 md:p-16 w-full md:w-1/2 flex flex-col justify-center bg-ui-white">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold text-content-paragraph mb-3 tracking-tighter">
                Welcome Back
              </h1>
              <p className="text-content-subtitle text-sm leading-relaxed">
                Please enter your details to continue your journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-content-subtitle uppercase tracking-[0.2em] ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input
                    className={`w-full bg-ui-mainBg border ${errors.email ? "border-red-500" : "border-ui-border"} rounded-2xl py-4 pl-12 pr-4 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-sm`}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <p className="text-right text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-content-subtitle uppercase tracking-[0.2em]" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input
                    className={`w-full bg-ui-mainBg border ${errors.password ? "border-red-500" : "border-ui-border"} rounded-2xl py-4 pl-12 pr-12 focus:border-brand-primary outline-none transition-all text-sm`}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-content-subtitle hover:text-brand-primary transition-colors">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-right text-red-500 text-sm mt-2">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-hover text-ui-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 mt-8 transform active:scale-[0.98] group"
              >
                Sign In
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-center text-sm text-content-subtitle mt-10">
              Don't have an account?
              <Link to="/register" className="text-brand-primary font-bold hover:underline ml-1">
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}