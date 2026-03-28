import { getDictionary } from '@/src/lib/dictionaries'
import { type Locale } from '@/src/lib/i18n'
import PropertyForm from '@/src/components/admin/PropertyForm'

interface CreatePropertyPageProps {
  params: Promise<{ lang: string }>
}

export default async function CreatePropertyPage({ params }: CreatePropertyPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return <PropertyForm lang={lang as Locale} dict={dict} />
}
