import Navbar from '../../components/common/Navbar';
import AuthImage from '../../assets/auth.png';
import { ArrowRight, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function Register() {
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div>
            <div>
              <div>
                <h1>Create Account</h1>
                <p>Join Quick Bite to start ordering your favorite flavors.</p>
              </div>

              <form>
                <div>
                  <label htmlFor="full-name">Full Name</label>
                  <div>
                    <User size={18} />
                    <input
                      type="text"
                      id="full-name"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email">Email Address</label>
                  <div>
                    <Mail size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="hello@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password">Password</label>
                  <div>
                    <Lock size={18} />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" aria-label="Toggle password visibility">
                      <EyeOff size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div>
                    <Lock size={18} />
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" aria-label="Toggle confirm password visibility">
                      <EyeOff size={18} />
                    </button>
                  </div>
                </div>

                <button type="submit">
                  Register <ArrowRight size={18} />
                </button>
              </form>

              <p>
                Already have an account? <button type="button">Login</button>
              </p>
            </div>

            <div>
              <img src={AuthImage} alt="dining experience" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
