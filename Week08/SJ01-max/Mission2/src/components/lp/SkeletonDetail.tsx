function SkeletonDetail() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] justify-center px-4 py-8">
      <div className="w-full max-w-[760px] animate-pulse rounded-xl bg-[#292c34] p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-700" />
            <div className="h-5 w-24 rounded bg-gray-700" />
          </div>
          <div className="h-4 w-14 rounded bg-gray-700" />
        </div>
        <div className="mb-10 h-7 w-44 rounded bg-gray-700" />
        <div className="mx-auto mb-8 aspect-square w-full max-w-[420px] rounded bg-gray-800" />
        <div className="mx-auto space-y-2">
          <div className="h-4 w-full rounded bg-gray-700" />
          <div className="h-4 w-4/5 rounded bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonDetail