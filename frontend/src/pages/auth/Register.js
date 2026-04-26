import { ArrowRight, User, Mail, Lock, EyeOff } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import img from "../../assets/auth.png";

export default function Register() {
  return (
    <div className="min-h-screen bg-ui-mainBg">
      <Navbar />

      <main className="flex flex-1 justify-center items-center overflow-hidden p-4">
        <section className="flex bg-ui-white rounded-2xl overflow-hidden max-w-5xl w-full flex-col md:flex-row min-h-[600px]">

          <div className="p-8  w-full md:w-1/2 flex flex-col justify-center bg-ui-white">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold text-content-paragraph mb-3 tracking-tighter">
                Create Account
              </h1>
              <p className="text-content-subtitle text-sm leading-relaxed">
                Join Quick Bite to start ordering your favorite flavors.
              </p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-content-subtitle uppercase tracking-[0.2em] ml-1" htmlFor="full-name">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input
                    className="w-full bg-ui-mainBg border border-ui-border rounded-2xl py-4 pl-12 pr-4 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-gray-400"
                    type="text"
                    id="full-name"
                    placeholder="e.g. Ahmad Hassan"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-content-subtitle uppercase tracking-[0.2em] ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input
                    className="w-full bg-ui-mainBg border border-ui-border rounded-2xl py-4 pl-12 pr-4 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-gray-400"
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-content-subtitle uppercase tracking-[0.2em] ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input
                    className="w-full bg-ui-mainBg border border-ui-border rounded-2xl py-4 pl-12 pr-12 focus:border-brand-primary outline-none transition-all text-sm"
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-content-subtitle hover:text-brand-primary transition-colors">
                    <EyeOff size={18} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-hover text-ui-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 mt-8 transform active:scale-[0.98] group"
              >
                Create Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-center text-sm text-content-subtitle mt-10 font-medium">
              Already have an account?{" "}
              <button className="text-brand-primary font-bold hover:underline ml-1">
                Log in
              </button>
            </p>
          </div>

          <div className="hidden md:block w-1/2">
            <img
              src={img}
              alt="Culinary experience"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </main>
    </div>
  );
}