export function ErrorMessage() {
  return (
    <div className="text-center p-12 bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-700 rounded-xl">
      <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
        خطأ في الاتصال ⚠️
      </h3>
      <p className="text-red-600 dark:text-red-400">
        عذراً، لم نتمكن من جلب بيانات الشركات. يرجى التحقق من اتصال الشبكة وإعادة المحاولة.
      </p>
    </div>
  )
}
