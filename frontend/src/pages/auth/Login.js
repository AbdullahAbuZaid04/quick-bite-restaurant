import Navbar from "../../components/common/Navbar";
import AuthImage from '../../assets/auth.png';
import { ArrowRight, EyeOff, Lock, Mail } from "lucide-react";

export default function Login() {
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div>
            <div>
              <img src={AuthImage} alt="login" />
            </div>

            <div>
              <div>
                <h1>Welcome Back</h1>
                <p>Please enter your details to continue your journey.</p>
              </div>

              <form>
                <div>
                  <label htmlFor="email">Email Address</label>
                  <div>
                    <Mail size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password">Password</label>
                  <div>
                    <Lock size={20} />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" aria-label="Toggle password visibility">
                      <EyeOff size={20} />
                    </button>
                  </div>
                </div>

                <button type="submit">
                  Login <ArrowRight size={20} />
                </button>
              </form>

              <p>
                Don't have an account?{" "}
                <button type="button">Sign up</button>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
