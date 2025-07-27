import React from 'react';

const SuccessfullLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Main Message */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Have a
          </h1>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Great Day!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            You've successfully clocked in. Wishing you a productive and wonderful day ahead!
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4 mb-6">
            <span className="text-2xl animate-bounce" style={{animationDelay: '0s'}}>🌟</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>✨</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>🎉</span>
          </div>

          {/* Current Time */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-green-800 font-semibold">
              Clocked in at: {new Date().toLocaleTimeString()}
            </p>
            <p className="text-green-600 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Ready to make today amazing! 💪</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessfullLogin;