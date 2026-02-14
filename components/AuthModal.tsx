
import React, { useState, useEffect } from 'react';
import { AuthStage, User, Country } from '../types';

interface AuthModalProps {
  stage: AuthStage;
  onClose: () => void;
  onSuccess: (user: User) => void;
  setStage: (stage: AuthStage) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ stage, onClose, onSuccess, setStage }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    username: '',
    phone: '',
    country: '',
    countryCode: '',
    otp: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch countries from online API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
        const data = await response.json();
        
        const formattedCountries: Country[] = data.map((c: any) => ({
          name: c.name.common,
          code: c.cca2,
          dial_code: c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : ''),
          flag: c.flag
        })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        
        // Set default country if not set
        if (formattedCountries.length > 0) {
          const us = formattedCountries.find(c => c.code === 'US') || formattedCountries[0];
          setFormData(prev => ({
            ...prev,
            country: us.name,
            countryCode: us.dial_code
          }));
        }
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load countries. Please try again.');
      } finally {
        setIsCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'country') {
        const country = countries.find(c => c.name === value);
        return { ...prev, country: value, countryCode: country?.dial_code || prev.countryCode };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API calls
    setTimeout(() => {
      setIsLoading(false);
      if (stage === AuthStage.LOGIN) {
        if (formData.email && formData.password) {
          onSuccess({
            id: 'u1',
            fullName: 'John Doe',
            username: 'johndoe',
            email: formData.email,
            phoneNumber: '+1234567890',
            country: 'United States',
            countryCode: '+1',
            bio: 'Avid music lover and creator.',
            isAuthenticated: true,
            isActivated: true
          });
        } else {
          setError('Please fill in all fields.');
        }
      } else if (stage === AuthStage.REGISTER) {
        if (formData.fullName && formData.username && formData.email && formData.password) {
           setStage(AuthStage.ACTIVATION_PENDING);
        } else {
           setError('All fields are required.');
        }
      } else if (stage === AuthStage.FORGOT_PASSWORD) {
        setStage(AuthStage.VERIFY_OTP);
      } else if (stage === AuthStage.VERIFY_OTP) {
        if (formData.otp === '1234') {
          setStage(AuthStage.RESET_PASSWORD);
        } else {
          setError('Invalid OTP. Hint: 1234');
        }
      } else if (stage === AuthStage.RESET_PASSWORD) {
        setStage(AuthStage.LOGIN);
        alert('Password reset successful! Please log in.');
      }
    }, 1500);
  };

  const renderForm = () => {
    switch (stage) {
      case AuthStage.LOGIN:
        return (
          <form onSubmit={handleAuthAction} className="space-y-4 animate__animated animate__fadeIn">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
            <input 
              name="email" type="email" placeholder="Email Address" required
              className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
              onChange={handleInputChange}
            />
            <input 
              name="password" type="password" placeholder="Password" required
              className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
              onChange={handleInputChange}
            />
            <div className="text-right">
              <button type="button" onClick={() => setStage(AuthStage.FORGOT_PASSWORD)} className="text-xs text-gray-400 hover:text-primary">Forgot Password?</button>
            </div>
            <button disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50">
              {isLoading ? 'Verifying...' : 'Log In'}
            </button>
            <p className="text-center text-sm text-gray-400">
              Don't have an account? <button type="button" onClick={() => setStage(AuthStage.REGISTER)} className="text-primary font-bold">Register</button>
            </p>
          </form>
        );

      case AuthStage.REGISTER:
        return (
          <form onSubmit={handleAuthAction} className="space-y-4 animate__animated animate__fadeIn">
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            
            <input 
              name="fullName" 
              placeholder="Full Name" 
              required 
              className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none" 
              onChange={handleInputChange} 
            />

            <div className="grid grid-cols-2 gap-4">
               <input name="username" placeholder="Username" required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none" onChange={handleInputChange} />
               <input name="email" type="email" placeholder="Email" required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none" onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-3 gap-2">
               <select 
                 name="country" 
                 disabled={isCountriesLoading}
                 className="col-span-1 bg-dark-lighter border border-gray-700 rounded-xl px-2 py-3 focus:border-primary outline-none text-xs"
                 onChange={handleInputChange}
                 value={formData.country}
               >
                 {isCountriesLoading ? (
                   <option>Loading...</option>
                 ) : (
                   countries.map(c => <option key={c.code} value={c.name}>{c.flag} {c.code}</option>)
                 )}
               </select>
               <div className="col-span-2 relative">
                 <span className="absolute left-3 top-3.5 text-xs text-gray-500 font-bold">{formData.countryCode}</span>
                 <input 
                   name="phone" placeholder="Phone Number" required 
                   className="w-full bg-dark-lighter border border-gray-700 rounded-xl pl-12 pr-4 py-3 focus:border-primary outline-none"
                   onChange={handleInputChange} 
                 />
               </div>
            </div>

            <input name="password" type="password" placeholder="Password" required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none" onChange={handleInputChange} />
            
            <button disabled={isLoading || isCountriesLoading} className="w-full bg-primary hover:bg-primary-dark font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
              {isLoading ? 'Processing...' : 'Register'}
            </button>
            <p className="text-center text-sm text-gray-400">
              Already have an account? <button type="button" onClick={() => setStage(AuthStage.LOGIN)} className="text-primary font-bold">Log In</button>
            </p>
          </form>
        );

      case AuthStage.ACTIVATION_PENDING:
        return (
          <div className="text-center space-y-6 animate__animated animate__bounceIn">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl">
              <i className="fas fa-paper-plane"></i>
            </div>
            <h2 className="text-2xl font-bold">Check Your Email</h2>
            <p className="text-gray-400">We've sent an activation link to <span className="text-white font-medium">{formData.email}</span>. Click the link to activate your account.</p>
            <div className="bg-dark-lighter p-4 rounded-xl border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => {
                alert('Account Activated Successfully (Simulation)');
                onSuccess({
                    id: 'u2',
                    fullName: formData.fullName,
                    username: formData.username || 'NewUser',
                    email: formData.email,
                    phoneNumber: formData.phone,
                    country: formData.country,
                    countryCode: formData.countryCode,
                    bio: 'Newly joined VideoMack creator!',
                    isAuthenticated: true,
                    isActivated: true
                });
            }}>
               <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Demo Shortcut</p>
               <p className="text-sm">Click here to simulate clicking the email link</p>
            </div>
            <button onClick={() => setStage(AuthStage.LOGIN)} className="text-sm text-gray-400 hover:text-white underline">Back to Login</button>
          </div>
        );

      case AuthStage.FORGOT_PASSWORD:
        return (
          <form onSubmit={handleAuthAction} className="space-y-4 animate__animated animate__fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">Recover Password</h2>
            <p className="text-gray-400 text-sm text-center mb-6">Enter your email and we'll send you a 4-digit verification code.</p>
            <input 
              name="email" type="email" placeholder="Email Address" required
              className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
              onChange={handleInputChange}
            />
            <button disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            <button type="button" onClick={() => setStage(AuthStage.LOGIN)} className="w-full text-sm text-gray-400 hover:text-white">Cancel</button>
          </form>
        );

      case AuthStage.VERIFY_OTP:
        return (
          <form onSubmit={handleAuthAction} className="space-y-4 animate__animated animate__fadeIn">
            <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>
            <p className="text-gray-400 text-sm text-center mb-6">Code sent to {formData.email}. (Use '1234' for demo)</p>
            <div className="flex justify-center gap-2">
              <input 
                name="otp" maxLength={4} placeholder="####" required
                className="w-32 text-center text-2xl tracking-[1rem] bg-dark-lighter border border-gray-700 rounded-xl px-4 py-4 focus:border-primary outline-none font-black"
                onChange={handleInputChange}
              />
            </div>
            <button disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            <p className="text-center text-xs text-gray-500">Didn't get a code? <button className="text-primary hover:underline">Resend</button></p>
          </form>
        );

      case AuthStage.RESET_PASSWORD:
        return (
          <form onSubmit={handleAuthAction} className="space-y-4 animate__animated animate__fadeIn">
            <h2 className="text-2xl font-bold text-center mb-6">Set New Password</h2>
            <input name="password" type="password" placeholder="New Password" required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none" onChange={handleInputChange} />
            <input type="password" placeholder="Confirm Password" required className="w-full bg-dark-lighter border border-gray-700 rounded-xl px-4 py-3 focus:border-primary outline-none" />
            <button disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-dark-light rounded-3xl p-8 border border-dark-lighter shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl text-xs mb-4 text-center animate__animated animate__shakeX">
            {error}
          </div>
        )}
        {renderForm()}
      </div>
    </div>
  );
};

export default AuthModal;
