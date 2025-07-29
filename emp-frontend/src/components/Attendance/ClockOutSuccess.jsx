import React from 'react';

const ClockOutSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Main Message */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Well Done!
          </h1>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-700 to-slate-700 bg-clip-text text-transparent mb-6">
            Time to Rest
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            You've successfully clocked out. Thank you for your hard work today. Enjoy your well-deserved break!
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4 mb-6">
            <span className="text-2xl animate-bounce" style={{animationDelay: '0s'}}>🎯</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>👏</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>🌙</span>
          </div>

          {/* Current Time */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-800 font-semibold">
              Clocked out at: {new Date().toLocaleTimeString()}
            </p>
            <p className="text-gray-600 text-sm mt-1">
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
          <p>Great job today! See you tomorrow! 👋</p>
        </div>
      </div>
    </div>
  );
};

export default ClockOutSuccess;