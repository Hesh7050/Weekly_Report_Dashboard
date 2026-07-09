const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
          <p className="text-sm text-gray-600">{text}</p>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;