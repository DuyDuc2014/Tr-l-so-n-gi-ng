import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "AI đang tìm kiếm và biên soạn... Vui lòng chờ." }) => {
  return (
    <div className="absolute inset-0 bg-white/75 dark:bg-gray-800/75 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="loader-spin mx-auto"></div>
        <p className="mt-3 text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default Loader;