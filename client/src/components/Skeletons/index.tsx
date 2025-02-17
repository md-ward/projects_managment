export const BarSkeletonComponent = () => {
  return (
    <div
      role="status"
      className="w-full animate-pulse rounded-sm border border-gray-200 shadow-sm dark:border-gray-700"
    >
      <div className="flex items-baseline space-x-6 p-4">
        <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-64 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PieSkeletonComponent = () => {
  return (
    <div
      role="status"
      className="h-full w-full animate-pulse rounded-sm border border-gray-200 shadow-sm dark:border-gray-700"
    >
      <div className="flex place-content-center space-x-6 p-4">
        <div className="aspect-square size-60 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
