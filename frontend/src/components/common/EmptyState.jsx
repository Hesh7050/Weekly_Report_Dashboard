const EmptyState = ({ title = "No data found", message = "There is nothing to show yet." }) => {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
      </div>
    );
  };
  
  export default EmptyState;