export function LoadingState() {
  return (
    <div className="flex justify-center items-center h-48 space-x-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      <p className="text-lg text-gray-600 dark:text-gray-400">جاري تحميل بيانات الشركات...</p>
    </div>
  )
}
