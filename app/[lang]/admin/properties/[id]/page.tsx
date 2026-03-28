import { getDictionary } from '@/src/lib/dictionaries'
import { type Locale } from '@/src/lib/i18n'
import PropertyForm from '@/src/components/admin/PropertyForm'
import { supabase } from '@/src/lib/supabase'
import { notFound } from 'next/navigation'

interface EditPropertyPageProps {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { lang, id } = await params
  const dict = await getDictionary(lang as Locale)

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !property) {
    console.error('Error fetching property:', error)
    notFound()
  }

  return <PropertyForm lang={lang as Locale} initialData={property} dict={dict} />
}
