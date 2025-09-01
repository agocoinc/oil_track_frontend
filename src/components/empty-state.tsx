import { Button } from "@/components/ui/button"

export function EmptyState({ handleAdd }: { handleAdd: () => void }) {
  return (
    <div className="text-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        لم يتم إضافة أي شركات بعد
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        ابدأ بإضافة أول شركة لإدارة بياناتك.
      </p>
      <Button size="lg" onClick={handleAdd}>
        + إضافة شركة الآن
      </Button>
    </div>
  )
}
