const LpDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-72 aspect-square bg-gray-700 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="w-2/3 h-8 bg-gray-700 rounded" />
        <div className="w-1/3 h-4 bg-gray-700 rounded" />
        <div className="w-1/4 h-4 bg-gray-700 rounded" />
        <div className="flex gap-3 pt-4">
          <div className="w-20 h-10 bg-gray-700 rounded" />
          <div className="w-16 h-10 bg-gray-700 rounded" />
          <div className="w-16 h-10 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
    <div className="mt-10 space-y-3">
      <div className="w-32 h-5 bg-gray-700 rounded" />
      <div className="bg-gray-800 rounded p-5 space-y-2">
        <div className="w-full h-4 bg-gray-700 rounded" />
        <div className="w-5/6 h-4 bg-gray-700 rounded" />
        <div className="w-4/5 h-4 bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

export default LpDetailSkeleton;
