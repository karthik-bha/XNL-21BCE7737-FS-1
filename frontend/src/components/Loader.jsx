import React from 'react';

const Loader = () => {
  return (
    <div className="justify-center items-center h-screen flex flex-col">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p>Loading, Please wait...</p>
    </div>
  );
};

export default Loader;
