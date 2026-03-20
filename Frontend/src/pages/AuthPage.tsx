import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(error => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Try patient@demo.com / demo123 or admin@demo.com / demo123');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      registerSchema.parse({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
        confirmPassword,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(error => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    const success = await register({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      phone: registerPhone || undefined,
    });

    if (success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error('This email is already registered');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0F1A]">
      {/* Left Panel - 60% with diagonal texture */}
      <div className="hidden lg:flex lg:w-[60%] relative diagonal-lines">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-transparent to-[#0B0F1A]/80" />
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <h1 className="font-['DM_Serif_Display'] text-5xl xl:text-6xl leading-tight text-[#F0F4FF] italic">
            "Healthcare,<br />redesigned for<br />humans."
          </h1>
          <div className="mt-12 flex gap-12">
            <div className="opacity-0 animate-fade-up stagger-1" style={{ animationFillMode: 'forwards' }}>
              <p className="text-3xl font-mono text-[#00C8FF]">12,400+</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mt-1">Patients</p>
            </div>
            <div className="opacity-0 animate-fade-up stagger-2" style={{ animationFillMode: 'forwards' }}>
              <p className="text-3xl font-mono text-[#00C8FF]">340</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mt-1">Doctors</p>
            </div>
            <div className="opacity-0 animate-fade-up stagger-3" style={{ animationFillMode: 'forwards' }}>
              <p className="text-3xl font-mono text-[#00C8FF]">98.2%</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mt-1">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - 40% Form Area */}
      <div className="w-full lg:w-[40%] bg-[#111827] border-l border-[#1E293B] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden mb-8 text-center">
            <span className="font-['DM_Serif_Display'] text-2xl text-[#F0F4FF]">HealthHub</span>
            <span className="text-[#4A5568] mx-1">•</span>
            <span className="text-[#00C8FF] font-light text-2xl">Connect</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-[#1E293B]">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-3 text-sm tracking-[0.15em] uppercase transition-all ${
                activeTab === 'login'
                  ? 'text-[#00C8FF] border-b-2 border-[#00C8FF]'
                  : 'text-[#8A9BB5] hover:text-[#F0F4FF]'
              }`}
              aria-label="Sign in tab"
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`pb-3 text-sm tracking-[0.15em] uppercase transition-all ${
                activeTab === 'register'
                  ? 'text-[#00C8FF] border-b-2 border-[#00C8FF]'
                  : 'text-[#8A9BB5] hover:text-[#F0F4FF]'
              }`}
              aria-label="Register tab"
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="opacity-0 animate-fade-up stagger-1" style={{ animationFillMode: 'forwards' }}>
                <label htmlFor="login-email" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-[#4A5568]"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className="text-sm text-[#FF4D6D] mt-1">{errors.email}</p>}
              </div>

              <div className="opacity-0 animate-fade-up stagger-2" style={{ animationFillMode: 'forwards' }}>
                <label htmlFor="login-password" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-[#4A5568]"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && <p id="password-error" className="text-sm text-[#FF4D6D] mt-1">{errors.password}</p>}
              </div>

              <div className="opacity-0 animate-fade-up stagger-3" style={{ animationFillMode: 'forwards' }}>
                <button
                  type="submit"
                  className="w-full bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoading}
                  aria-label="Sign in"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              <div className="opacity-0 animate-fade-up stagger-4 text-center" style={{ animationFillMode: 'forwards' }}>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#4A5568]">Demo accounts</p>
                <p className="font-mono text-xs text-[#8A9BB5] mt-2">patient@demo.com / demo123</p>
                <p className="font-mono text-xs text-[#8A9BB5]">admin@demo.com / demo123</p>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="opacity-0 animate-fade-up stagger-1" style={{ animationFillMode: 'forwards' }}>
                <label htmlFor="register-name" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                  Full Name
                </label>
                <input
                  id="register-name"
                  placeholder="John Doe"
                  className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-[#4A5568]"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
                {errors.name && <p className="text-sm text-[#FF4D6D] mt-1">{errors.name}</p>}
              </div>

              <div className="opacity-0 animate-fade-up stagger-2" style={{ animationFillMode: 'forwards' }}>
                <label htmlFor="register-email" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-[#4A5568]"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-[#FF4D6D] mt-1">{errors.email}</p>}
              </div>

              <div className="opacity-0 animate-fade-up stagger-3" style={{ animationFillMode: 'forwards' }}>
                <label htmlFor="register-phone" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                  Phone (Optional)
                </label>
                <input
                  id="register-phone"
                  placeholder="+1 234 567 8900"
                  className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-[#4A5568]"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                />
              </div>

              <div className="opacity-0 animate-fade-up stagger-4" style={{ animationFillMode: 'forwards' }}>
                <label htmlFor="register-password" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-[#4A5568]"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                {errors.password && <p className="text-sm text-[#FF4D6D] mt-1">{errors.password}</p>}
              </div>

              <div className="opacity-0 animate-fade-up stagger-5" style={{ animationFillMode: 'forwards' }}>
                <label htmlFor="confirm-password" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-[#4A5568]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p className="text-sm text-[#FF4D6D] mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 opacity-0 animate-fade-up"
                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                disabled={isLoading}
                aria-label="Create account"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
