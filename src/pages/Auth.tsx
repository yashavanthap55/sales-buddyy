import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { validateMobileFormat, useMobileValidation } from '@/utils/mobileValidation';
import logo from './../../public/logo.jpg'

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { validateNumber, isValidating, validationResult } = useMobileValidation();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (!error) {
      navigate('/');
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSendOtp = async () => {
    if (!mobileNumber.trim()) {
      alert('Please enter a valid mobile number');
      return;
    }
    
    // Validate mobile number format first
    if (!validateMobileFormat(countryCode, mobileNumber)) {
      alert('Please enter a valid mobile number for the selected country');
      return;
    }
    
    setOtpLoading(true);
    
    try {
      // Validate mobile number using API
      console.log('Validating mobile number...');
      const validation = await validateNumber(countryCode, mobileNumber);
      
      if (!validation.isValid) {
        alert(validation.error || 'Invalid mobile number');
        setOtpLoading(false);
        return;
      }
      
      // Send OTP API integration here - integrate with your SMS service provider
      // Example with Twilio:
      /*
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${mobileNumber}`,
          message: `Your verification code is: ${generatedOTP}`
        })
      });
      */
      
      // Simulate API call
      setTimeout(() => {
        setOtpLoading(false);
        setShowOtpStep(true);
        console.log(`OTP would be sent to: ${countryCode}${mobileNumber}`);
        console.log('Mobile validation result:', validation);
      }, 2000);
      
    } catch (error) {
      console.error('Error during mobile validation:', error);
      alert('Failed to validate mobile number. Please try again.');
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    // Verify OTP API integration here - validate the OTP with your service provider
    // Example with Twilio Verify:
    /*
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: `${countryCode}${mobileNumber}`,
        code: otp
      })
    });
    
    const result = await response.json();
    if (!result.valid) {
      alert('Invalid OTP. Please try again.');
      return;
    }
    */
    
    // Simulate OTP verification
    console.log(`Verifying OTP: ${otp} for number: ${countryCode}${mobileNumber}`);
    
    // If OTP is valid, proceed with account creation
    handleSignUp();
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
  };

  const handleInitialSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim() || !password.trim() || !mobileNumber.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Start the OTP verification process
    handleSendOtp();
  };

  const countryCodes = [
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+81', country: 'Japan' },
    { code: '+61', country: 'Australia' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-[80px] h-[80px]">
              <img src={logo} alt="" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              {!showOtpStep ? (
                <form onSubmit={handleInitialSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-mobile">Mobile Number</Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map(({ code, country }) => (
                            <SelectItem key={code} value={code}>
                              {code} ({country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-1 relative">
                        <Input
                          id="signup-mobile"
                          type="tel"
                          placeholder="Enter mobile number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          required
                          className="flex-1"
                        />
                        {validationResult && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            {validationResult.isValid ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {validationResult && !validationResult.isValid && (
                      <p className="text-sm text-red-600">{validationResult.error}</p>
                    )}
                    {validationResult && validationResult.isValid && (
                      <p className="text-sm text-green-600">Mobile number validated successfully</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={otpLoading || isValidating}>
                    {otpLoading ? 'Sending OTP...' : isValidating ? 'Validating...' : 'Send OTP'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center">
                      <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Verify Mobile Number</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a 6-digit code to {countryCode}{mobileNumber}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleVerifyOtp} 
                      className="w-full" 
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? 'Creating account...' : 'Verify & Create Account'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSendOtp} 
                      className="w-full" 
                      disabled={otpLoading}
                    >
                      {otpLoading ? 'Resending...' : 'Resend OTP'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowOtpStep(false)} 
                      className="w-full"
                    >
                      Back to Sign Up
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
