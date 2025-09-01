import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface Company {
  id: number
  name: string
  logo: string
}

interface CompaniesGridProps {
  companies: Company[]
  onCardClick: (id: number) => void
}

export function CompaniesGrid({ companies, onCardClick }: CompaniesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {companies.map((company) => (
        <Card
          key={company.id}
          className="cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          onClick={() => onCardClick(company.id)}
        >
          <CardHeader>
            <CardTitle className="flex justify-center">
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src={`/images/${company.logo}`}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center font-semibold text-lg">
            {company.name}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
