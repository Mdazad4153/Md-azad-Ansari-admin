import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { PUBLISHABLE_KEY } from '../../src/lib/neonApiService';

interface LoginViewProps {
  onLoginSuccess: (token: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // This is an insecure, temporary login method.
    // The credentials are hardcoded because the API does not have permissions
    // to fetch user data for authentication from the browser.
    // This should be replaced with a proper server-side authentication flow in a real application.
    setTimeout(() => { // Simulate network delay for UX consistency
        if (email === 'azad79900@gmail.com' && password === 'Nothing@1526') {
            onLoginSuccess(PUBLISHABLE_KEY);
        } else {
            setError('Invalid email or password.');
            setIsLoading(false);
        }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div>
           <h1 className="text-2xl font-bold text-center text-blue-600">MD Azad. Admin</h1>
           <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your portfolio
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full justify-center" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;