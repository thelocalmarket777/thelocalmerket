import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import RemoteServices from '@/RemoteService/Remoteservice';
import GoogleLoginButton from '@/components/ui/GoogleLoginBotton';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const { toast } = useToast();

  // UI state
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(true);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }

    if (!emailRegex.test(loginEmail)) {
      setLoginError('Please enter a valid email address');
      return;
    }

    setIsLoginLoading(true);
    try {
      const response = await RemoteServices.loginPost({
        email: loginEmail,
        password: loginPassword
      });

      if (response.status === 200) {
        const user: User = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name || 'User'}!`,
        });

        setTimeout(() => {
          navigate(from);
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    // Validation
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword || !address || !phoneNumber) {
      setRegisterError('Please fill in all required fields');
      return;
    }

    if (!emailRegex.test(registerEmail)) {
      setRegisterError('Please enter a valid email address');
      return;
    }

    if (registerPassword.length < 8) {
      setRegisterError('Password must be at least 8 characters long');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    setIsRegisterLoading(true);
    try {
      const response = await RemoteServices.register({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
        address,
        phone_number: phoneNumber
      });

      if (response.status === 201) {
        toast({
          title: 'Registration Successful',
          description: `Thank you for registering, ${registerName}!`,
        });

        // Clear form
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setAddress('');
        setPhoneNumber('');

        // Switch to login tab
        setActiveTab('login');
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Handle specific error messages from the backend
      if (error.response?.data?.email) {
        setRegisterError(`Email error: ${error.response.data.email[0]}`);
      } else if (error.response?.data?.detail) {
        setRegisterError(error.response.data.detail);
      } else {
        setRegisterError('Registration failed. Please try again.');
      }

      toast({
        title: "Registration Failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    if (!emailRegex.test(forgotEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsForgotLoading(true);
    try {
      // Send request for OTP
      await RemoteServices.forgottenPassword({ email: forgotEmail });

      setResetSent(true);
      setShowOtpVerification(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Request Failed",
        description: "We couldn't process your request. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    // Validation
    if (!otp) {
      setOtpError('Please enter the verification code');
      return;
    }

    if (!newPassword) {
      setOtpError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setOtpError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setOtpError('Passwords do not match');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      // Send OTP verification request
      await RemoteServices.verfiyOtpPassord({
        email: forgotEmail,
        otp: otp,
        new_password: newPassword
      });

      setResetSuccess(true);
      setShowOtpVerification(false);

      toast({
        title: "Password Reset Successful",
        description: "Your password has been successfully reset. You can now login with your new password.",
      });

      // Reset form fields
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');

      // Give user time to read the success message before redirecting
      setTimeout(() => {
        setActiveTab('login');
        setResetSent(false);
        setResetSuccess(false);
      }, 3000);

    } catch (error: any) {
      console.error('OTP verification error:', error);

      // Handle specific error messages from the backend
      if (error.response?.data?.detail) {
        setOtpError(error.response.data.detail);
      } else {
        setOtpError('Verification failed. Please try again.');
      }

      toast({
        title: "Verification Failed",
        description: "The verification code is invalid or has expired.",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Reset the forgot password flow
  const handleResetPasswordFlow = () => {
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetSent(false);
    setShowOtpVerification(false);
    setResetSuccess(false);
    setOtpError(null);
    setActiveTab('login');
  };



  const handleGoogleLogin = async (credentialResponse) => {
    setIsGoogleLoading(true);
    const id_token = credentialResponse.credential;
    //  const address :'https://backendshop-production-963a.up.railway.app/api/'
    // const address = 'http://localhost:8080/api/'
    const address =    'https://backendshop-production-0a96.up.railway.app/api/'
    try {
      const response = await fetch(`${address}account/auth/google/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token }),
      });

      const data = await response.json(); // Properly parse the JSON body

      if (response.ok) {
        const user = data.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user?.name || 'User'}!`,
        });

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast({
          title: "Login Failed",
          description: data?.error || "Something went wrong during sign-in.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Login Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center text-2xl font-bold text-brand-blue">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Startup <sub> बजार</sub>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {activeTab === 'login' && 'Welcome Back'}
          {activeTab === 'register' && 'Create an Account'}
          {activeTab === 'forgot' && (
            showOtpVerification ? 'Verify Your Identity' : 'Reset Your Password'
          )}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {activeTab === 'login' && 'Sign in to your account or create a new one'}
          {activeTab === 'register' && 'Fill in your details to get started'}
          {activeTab === 'forgot' && (
            showOtpVerification
              ? 'Enter the verification code sent to your email'
              : 'Enter your email to receive reset instructions'
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          {activeTab !== 'forgot' ? (
            <Tabs
              value={activeTab === 'register' ? 'register' : 'login'}
              className="w-full"
              onValueChange={(val) => setActiveTab(val as 'login' | 'register')}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="font-medium">Password</Label>
                      <button
                        type="button"
                        onClick={() => setActiveTab('forgot')}
                        className="text-sm text-brand-blue hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1"
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
                <GoogleLoginButton
                  onGoogleLogin={handleGoogleLogin}
                  isLoading={isGoogleLoading}
                />
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="font-medium">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="John Doe"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-email" className="font-medium">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="register-password" className="font-medium">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirm-password" className="font-medium">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone-number" className="font-medium">Phone Number</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(123) 456-7890"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="font-medium">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, City, State, ZIP"
                      className="mt-1"
                      required
                    />
                  </div>

                  {registerError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? 'Creating account...' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            /* Forgot Password UI */
            <div className="space-y-6">
              {resetSuccess ? (
                /* Password Reset Success */
                <div className="text-center space-y-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Password Reset Successful</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your password has been successfully reset. You can now login with your new password.
                    </p>
                  </div>
                  <Button
                    onClick={handleResetPasswordFlow}
                    className="mt-4"
                  >
                    Back to login
                  </Button>
                </div>
              ) : !resetSent ? (
                /* Email Request Form */
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <Label htmlFor="forgot-email" className="font-medium">Email Address</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      We'll send you a verification code to reset your password
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isForgotLoading}
                  >
                    {isForgotLoading ? 'Sending...' : 'Send Verification Code'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-sm text-gray-600 hover:text-brand-blue"
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              ) : showOtpVerification ? (
                /* OTP Verification Form */
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <Label htmlFor="otp-code" className="font-medium">Verification Code</Label>
                    <Input
                      id="otp-code"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="mt-1"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Enter the verification code sent to {forgotEmail}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="new-password" className="font-medium">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-new-password" className="font-medium">Confirm New Password</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1"
                      required
                    />
                  </div>

                  {otpError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Reset Password'}
                  </Button>

                  <div className="flex justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpVerification(false);
                        setResetSent(false);
                      }}
                      className="text-gray-600 hover:text-brand-blue"
                    >
                      Try another email
                    </button>

                    <button
                      type="button"
                      onClick={() => handleForgotPassword(new Event('click') as any)}
                      className="text-brand-blue hover:underline"
                    >
                      Resend code
                    </button>
                  </div>
                </form>
              ) : (
                /* Email Sent Confirmation */
                <div className="text-center space-y-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      We've sent a verification code to <strong>{forgotEmail}</strong>
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowOtpVerification(true)}
                    className="mt-4 w-full"
                  >
                    Enter verification code
                  </Button>
                  <div className="flex justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setResetSent(false);
                        setActiveTab('login');
                        setForgotEmail('');
                      }}
                      className="text-gray-600 hover:text-brand-blue"
                    >
                      Back to login
                    </button>

                    <button
                      type="button"
                      onClick={() => handleForgotPassword(new Event('click') as any)}
                      className="text-brand-blue hover:underline"
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-gray-600 hover:text-brand-blue">
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
