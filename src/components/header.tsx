export function DashboardHeader({ title }: { title: string }) {
  return (
    <div className="flex justify-center mb-6">
      <h2 className="scroll-m-20 text-3xl font-bold tracking-tight text-gray-800">
        {title}
      </h2>
    </div>
  )
}
