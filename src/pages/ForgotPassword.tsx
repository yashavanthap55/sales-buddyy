
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpdatePassword from '@/components/UpdatePassword';
import { ArrowLeft } from 'lucide-react';
import logo from './../../public/logo.jpg';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-[80px] h-[80px]">
                <img src={logo} alt="" />
              </div>
            </div>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdatePassword />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')} 
              className="w-full mt-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
