const LoadingDots = () => {
    return (
        <div className="flex items-center justify-center space-x-2 bg-white p-5">
            <span className="sr-only">Loading...</span>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
    );
};

export default LoadingDots;