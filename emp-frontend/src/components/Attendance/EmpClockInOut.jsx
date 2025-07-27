import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

const EmpClockInOut = () => {
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClockIn = async () => {
    if (!loginId || !loginPassword) {
      setStatus('❌ Please enter both Login ID and Password');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulating API call since axios isn't available
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus(`✅ Clocked in at ${new Date().toLocaleTimeString()}`);
      setTimeout(()=>{
        navigate('/Successfull-login');
      }, 500);
    } catch (err) {
      setStatus('❌ Clock in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!loginId || !loginPassword) {
      setStatus('❌ Please enter both Login ID and Password');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulating API call since axios isn't available
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus(`✅ Clocked out at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      setStatus('❌ Clock out failed.');
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    setStatus('🔄 Password reset link sent to your email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Clock</h1>
            <p className="text-gray-600 text-sm">Employee Check In / Check Out</p>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 mb-2">
                Login ID
              </label>
              <input
                id="loginId"
                type="text"
                placeholder="Enter your Login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleClockIn}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Clock In</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleClockOut}
              disabled={isLoading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Clock Out</span>
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-4 rounded-xl text-center font-medium text-sm transition-all duration-300 ${
              status.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : status.includes('❌')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {status}
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="text-center mt-6">
            <button 
              onClick={handleForgotPassword}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 Employee Time Management System</p>
          <p className="mt-1">Secure • Reliable • Easy to Use</p>
        </div>
      </div>
    </div>
  );
};

export default EmpClockInOut;