/** biome-ignore-all lint/a11y/useValidAnchor: <explanation> */
'use client';

import type React from 'react';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setUserGlobal } from '@/services/api-service';
import logo from '../logo.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { loginUser, registerUser } from '@/services/user-api-service';
import { getAccountDetails } from '@/services/account-api-service';

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await loginUser(loginForm);
      const profileCompleted = result?.hasBetaAccount ?? false;

      if (profileCompleted) {
        try {
          const betaAccount = await getAccountDetails();
          const user = result.user;
          if (user) {
            setUserGlobal({ ...user, account: betaAccount });
          }
        } catch (e) {
          console.error('Erro ao buscar detalhes da subconta Beta após login:', e);
        }
        toast.success('Login successful!');
        router.push('/');
      } else {
        toast.success('Login successful! Redirecting to dashboard...');
        router.push('/profile');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (registerForm.password.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await registerUser({
        ...registerForm,
        hasBetaAccount: false,
      });

      toast.success('Account created successfully!');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#e6f2f2] via-[#f8fafc] to-[#e6f2f2] p-4'>
      <div className='mb-3'>
        <Image
          src={logo}
          alt='WAV3 Logo'
          width={96}
          height={96}
          priority
          className='mx-auto md:w-24 md:h-24 lg:w-32 lg:h-32'
        />
      </div>

      <Card
        className={`glass-card shadow-xl border border-primary/20 backdrop-blur-md p-6 transition-all duration-300 w-full max-w-md md:max-w-lg lg:max-w-xl`}
      >
        <Tabs
          value={tab}
          onValueChange={setTab}
          className='w-full transition-transform duration-300'
        >
          <TabsList className='flex mb-4'>
            <TabsTrigger
              value='login'
              className='flex-1 py-2 text-center text-sm font-medium text-primary border-b-2 border-transparent hover:text-primary/80 hover:border-primary/40 data-[state=active]:text-primary data-[state=active]:border-primary'
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value='register'
              className='flex-1 py-2 text-center text-sm font-medium text-primary border-b-2 border-transparent hover:text-primary/80 hover:border-primary/40 data-[state=active]:text-primary data-[state=active]:border-primary'
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value='login'>
            <motion.div
              key='login'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleLogin} className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='login-email' className='text-sm font-medium text-primary'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/80' />
                    <Input
                      id='login-email'
                      type='email'
                      placeholder='Enter your email'
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className='pl-10 glass-input h-11 rounded-xl text-primary bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='login-password' className='text-sm font-medium text-primary'>
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/80' />
                    <Input
                      id='login-password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className='pl-10 pr-10 glass-input h-11 rounded-xl text-primary bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                      required
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='w-4 h-4 text-primary/80' />
                      ) : (
                        <Eye className='w-4 h-4 text-primary/80' />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base tracking-wide'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </motion.div>
          </TabsContent>

          <TabsContent value='register'>
            <motion.div
              key='register'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleRegister} className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='register-name' className='text-sm font-medium text-primary'>
                    Full Name
                  </Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/80' />
                    <Input
                      id='register-name'
                      type='text'
                      placeholder='Enter your full name'
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className='pl-10 glass-input h-11 rounded-xl text-primary bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='register-email' className='text-sm font-medium text-primary'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/80' />
                    <Input
                      id='register-email'
                      type='email'
                      placeholder='Enter your email'
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className='pl-10 glass-input h-11 rounded-xl text-primary bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='register-password' className='text-sm font-medium text-primary'>
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/80' />
                    <Input
                      id='register-password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Create a password'
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className='pl-10 pr-10 glass-input h-11 rounded-xl text-primary bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='register-confirm-password' className='text-sm font-medium text-primary'>
                    Confirm Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/80' />
                    <Input
                      id='register-confirm-password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Confirm your password'
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className='pl-10 pr-10 glass-input h-11 rounded-xl text-primary bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                      required
                    />
                  </div>
                </div>

                {registerError && (
                  <div className='text-red-600 text-sm font-medium mt-2 animate-fade-in'>
                    {registerError}
                  </div>
                )}

                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base tracking-wide'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </motion.div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
