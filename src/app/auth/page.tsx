/** biome-ignore-all lint/a11y/useValidAnchor: <explanation> */
'use client';

import type React from 'react';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginUser, registerUser } from '@/services/api-service';
import logo from '../logo.svg';
import Image from 'next/image';

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
        // Busca detalhes da subconta Beta e atualiza Zustand/localStorage
        try {
          const { getBetaAccountDetail, setUserGlobal } = await import(
            '@/services/api-service'
          );
          const betaAccount = await getBetaAccountDetail();
          // Atualiza Zustand/localStorage com o novo account
          const user = result.user;
          if (user) {
            setUserGlobal({ ...user, account: betaAccount });
          }
        } catch (e) {
          console.error(
            'Erro ao buscar detalhes da subconta Beta após login:',
            e,
          );
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
    <div className='fixed inset-0 w-screen h-screen bg-gradient-to-br from-[#e6f2f2] via-[#f8fafc] to-[#e6f2f2] flex items-center justify-center p-2 md:p-4 overflow-hidden'>
      <div className='w-full max-w-md mx-auto'>
        {/* Logo */}
        <div className='flex items-center justify-center h-40 p-4'>
          <div
            className='flex items-center justify-center overflow-hidden w-64 h-64'
            style={{ width: '128px', height: '128px' }}
          >
            <Image
              src={logo}
              alt='WAV3 Logo'
              className='object-contain'
              style={{ width: '100%', height: '100%' }}
              priority
            />
          </div>
        </div>

        <Card className='glass-card-enhanced shadow-xl border border-white/10 backdrop-blur-md animate-fade-in-up'>
          <CardHeader className='text-center pb-2'>
            <CardTitle className='text-2xl font-bold text-main'>
              Welcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className='w-full'>
              <TabsList className='glass-tabs mb-6 w-full flex rounded-lg overflow-hidden shadow border border-primary/10 bg-white/80'>
                <TabsTrigger
                  value='login'
                  className='flex-1 font-semibold text-base py-2 transition-all duration-200 rounded-none border-none bg-transparent text-main data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow data-[state=active]:scale-105 data-[state=active]:z-10 data-[state=active]:border-b-2 data-[state=active]:border-primary/80'
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value='register'
                  className='flex-1 font-semibold text-base py-2 transition-all duration-200 rounded-none border-none bg-transparent text-main data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow data-[state=active]:scale-105 data-[state=active]:z-10 data-[state=active]:border-b-2 data-[state=active]:border-primary/80'
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value='login'>
                <form
                  onSubmit={handleLogin}
                  className='space-y-5 animate-fade-in'
                >
                  <div className='space-y-1'>
                    <Label
                      htmlFor='login-email'
                      className='text-sm font-medium muted-text'
                    >
                      Email
                    </Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70' />
                      <Input
                        id='login-email'
                        type='email'
                        placeholder='Enter your email'
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        className='pl-10 glass-input h-11 rounded-xl text-main bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                        required
                        autoComplete='username'
                      />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <Label
                      htmlFor='login-password'
                      className='text-sm font-medium muted-text'
                    >
                      Password
                    </Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70' />
                      <Input
                        id='login-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        className='pl-10 pr-10 glass-input h-11 rounded-xl text-main bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                        required
                        autoComplete='current-password'
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
                          <EyeOff className='w-4 h-4 text-primary/70' />
                        ) : (
                          <Eye className='w-4 h-4 text-primary/70' />
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
              </TabsContent>

              <TabsContent value='register'>
                <form
                  onSubmit={handleRegister}
                  className='space-y-5 animate-fade-in'
                >
                  <div className='space-y-1'>
                    <Label
                      htmlFor='register-name'
                      className='text-sm font-medium muted-text'
                    >
                      Full Name
                    </Label>
                    <div className='relative'>
                      <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70' />
                      <Input
                        id='register-name'
                        type='text'
                        placeholder='Enter your full name'
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            name: e.target.value,
                          })
                        }
                        className='pl-10 glass-input h-11 rounded-xl text-main bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                        required
                        autoComplete='name'
                      />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <Label
                      htmlFor='register-email'
                      className='text-sm font-medium muted-text'
                    >
                      Email
                    </Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70' />
                      <Input
                        id='register-email'
                        type='email'
                        placeholder='Enter your email'
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            email: e.target.value,
                          })
                        }
                        className='pl-10 glass-input h-11 rounded-xl text-main bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                        required
                        autoComplete='email'
                      />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <Label
                      htmlFor='register-password'
                      className='text-sm font-medium muted-text'
                    >
                      Password <span className="text-xs text-muted">(min. 6 characters)</span>
                    </Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70' />
                      <Input
                        id='register-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Create a password'
                        value={registerForm.password}
                        minLength={6}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            password: e.target.value,
                          })
                        }
                        className='pl-10 pr-10 glass-input h-11 rounded-xl text-main bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                        required
                        autoComplete='new-password'
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
                          <EyeOff className='w-4 h-4 text-primary/70' />
                        ) : (
                          <Eye className='w-4 h-4 text-primary/70' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <Label
                      htmlFor='register-confirm-password'
                      className='text-sm font-medium muted-text'
                    >
                      Confirm Password
                    </Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70' />
                      <Input
                        id='register-confirm-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Confirm your password'
                        value={registerForm.confirmPassword}
                        minLength={6}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className='pl-10 pr-10 glass-input h-11 rounded-xl text-main bg-white/80 border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition'
                        required
                        autoComplete='new-password'
                      />
                    </div>
                  </div>

                  {registerError && (
                    <div className="text-red-600 text-sm font-medium mt-2 animate-fade-in">
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className='text-center mt-6 animate-fade-in-up'>
          <p className='text-sm muted-text'>
            By continuing, you agree to our{' '}
            <a
              href='#'
              className='underline text-primary/80 hover:text-primary font-medium transition'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='#'
              className='underline text-primary/80 hover:text-primary font-medium transition'
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
