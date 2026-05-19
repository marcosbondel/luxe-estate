"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const PropertyMap = dynamic(() => import('@/src/components/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-100 flex items-center justify-center animate-pulse rounded-lg">Loading map...</div>
})
import { type Property, type PropertyType, type PropertyCategory } from '@/src/types/property'
import { type Locale } from '@/src/lib/i18n'

interface PropertyFormProps {
  lang: Locale
  initialData?: Property | null
  dict: Record<string, Record<string, any>>
}

export default function PropertyForm({ lang, initialData, dict }: PropertyFormProps) {
  const router = useRouter()
  const t = dict.admin.propertyForm
  const isEdit = !!initialData

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '')
  const [priceLabel, setPriceLabel] = useState(initialData?.price_label ?? '')
  const [status, setStatus] = useState<PropertyType>(initialData?.type ?? 'sale')
  const [category, setCategory] = useState<PropertyCategory | 'commercial'>(initialData?.category ?? 'apartment')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(initialData?.location ?? '')
  const [latitude, setLatitude] = useState(initialData?.latitude?.toString() ?? '')
  const [longitude, setLongitude] = useState(initialData?.longitude?.toString() ?? '')
  const [area, setArea] = useState(initialData?.area?.toString() ?? '')
  const [yearBuilt, setYearBuilt] = useState('')
  const [beds, setBeds] = useState(initialData?.beds ?? 3)
  const [baths, setBaths] = useState(initialData?.baths ?? 2)
  const [parking, setParking] = useState(1)
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false)
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [tag, setTag] = useState(initialData?.tag ?? '')

  const [amenities, setAmenities] = useState({
    swimmingPool: false,
    garden: true,
    airConditioning: false,
    smartHome: false,
  })

  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const files = Array.from(e.target.files)
    const newUrls: string[] = []
    for (const file of files) {
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target?.result as string)
        reader.readAsDataURL(file)
      })
      newUrls.push(url)
    }
    setImages(prev => [...prev, ...newUrls])
    e.target.value = ''
  }

  const handleDeleteImage = (_url: string, index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = async (e: React.FormEvent, _isDraft: boolean = false) => {
    e.preventDefault()
    if (!title || !price) {
      alert("Missing required fields")
      return
    }
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 500))
    setIsSubmitting(false)
    alert(isEdit ? t.successUpdate : t.successCreate)
    router.push(`/${lang}/admin/properties`)
    router.refresh()
  }

  const toggleAmenity = (key: keyof typeof amenities) => {
    setAmenities(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const adjustCount = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
    setter(prev => Math.max(0, prev + delta))
  }

  return (
    <div className="bg-clear-day text-nordic min-h-screen selection:bg-hint-green selection:text-nordic pt-6 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="space-y-4">
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
                <li><button onClick={() => router.push(`/${lang}/admin/properties`)} className="hover:text-mosque transition-colors">{dict.admin.sidebar.properties}</button></li>
                <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
                <li aria-current="page" className="text-nordic">{isEdit ? t.editTitle : t.addTitle}</li>
              </ol>
            </nav>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">
                {isEdit ? t.editTitle : t.addTitle}
              </h1>
              <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
                {isEdit ? t.editSubtitle : t.addSubtitle}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${lang}/admin/properties`)}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sf-pro text-sm disabled:opacity-50"
            >
              <span className="material-icons text-sm">{isSubmitting ? 'hourglass_empty' : 'save'}</span>
              {isSubmitting ? t.saving : (isEdit ? t.updateProperty : t.saveProperty)}
            </button>
          </div>
        </header>

        <form className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 space-y-8">

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">info</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">{t.basicInfo}</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="title">
                    {t.titleLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full text-base px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro"
                    id="title"
                    placeholder={t.titlePlaceholder}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="price">
                      {t.priceLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                      <input
                        className="w-full pl-7 pr-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro"
                        id="price"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="priceLabel">
                      {t.priceLabelInput}
                    </label>
                    <input
                      className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro"
                      id="priceLabel"
                      placeholder={t.priceLabelPlaceholder}
                      type="text"
                      value={priceLabel ?? ''}
                      onChange={(e) => setPriceLabel(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="status">{t.statusLabel}</label>
                    <select
                      className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PropertyType)}
                    >
                      <option value="sale">{dict.admin.properties.forSale}</option>
                      <option value="rent">{dict.admin.properties.forRent}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="type">{t.typeLabel}</label>
                    <select
                      className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                      id="type"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                    >
                      <option value="apartment">{dict.hero.categories.apartment}</option>
                      <option value="house">{dict.hero.categories.house}</option>
                      <option value="villa">{dict.hero.categories.villa}</option>
                      <option value="penthouse">{dict.hero.categories.penthouse}</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer group pt-8">
                    <input
                      type="checkbox"
                      className="w-5 h-5 border-gray-300 rounded focus:ring-mosque text-mosque"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span className="text-sm font-bold sm:whitespace-nowrap text-nordic font-sf-pro">Active</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group pt-8">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-mosque border-gray-300 rounded focus:ring-mosque"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    <span className="text-sm font-bold text-nordic font-sf-pro sm:whitespace-nowrap">{t.isFeatured}</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="tag">{t.tagLabel}</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro"
                      id="tag"
                      placeholder={t.tagPlaceholder}
                      type="text"
                      value={tag ?? ''}
                      onChange={(e) => setTag(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">description</span>
                </div>
                <h2 className="text-xl font-bold text-nordic">{t.description}</h2>
              </div>
              <div className="p-8">
                <textarea
                  className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]"
                  id="description"
                  placeholder={t.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                    <span className="material-icons text-lg">image</span>
                  </div>
                  <h2 className="text-xl font-bold text-nordic">{t.gallery}</h2>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
              </div>
              <div className="p-8">
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group">
                  <input
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                      <span className="material-icons text-2xl">cloud_upload</span>
                    </div>
                    <p className="text-base font-medium text-nordic font-sf-pro">{t.galleryDrag}</p>
                    <p className="text-xs text-gray-400 font-sf-pro">{t.gallerySize}</p>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                        <img alt={`Property image ${idx}`} className="w-full h-full object-cover" src={img} />
                        <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img, idx)}
                            className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                          >
                            <span className="material-icons text-sm">delete</span>
                          </button>
                        </div>
                        {idx === 0 && <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-8">
            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">place</span>
                </div>
                <h2 className="text-lg font-bold text-nordic">{t.location}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="location">{t.locationLabel}</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro"
                    id="location"
                    placeholder={t.locationPlaceholder}
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="latitude">Latitude</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro"
                      id="latitude"
                      placeholder="e.g. 37.4419"
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="longitude">Longitude</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro"
                      id="longitude"
                      placeholder="e.g. -122.1430"
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
                {latitude && longitude ? (
                  <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                    <PropertyMap lat={Number(latitude)} lng={Number(longitude)} popupText={title || "Property Location"} />
                  </div>
                ) : (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-600">
                      <span className="bg-white/90 text-nordic px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold font-sf-pro flex items-center gap-1">
                        <span className="material-icons text-sm text-mosque">map</span> Enter coordinates to {t.previewMap.toLowerCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">straighten</span>
                </div>
                <h2 className="text-lg font-bold text-nordic">{t.details}</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">{t.areaLabel}</label>
                    <input
                      className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm"
                      id="area"
                      placeholder="0"
                      type="number"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year">Year Built</label>
                    <input
                      className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm"
                      id="year"
                      placeholder="YYYY"
                      type="number"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">bed</span> {t.bedroomsLabel}
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button type="button" onClick={() => adjustCount(setBeds, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                      <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={beds} />
                      <button type="button" onClick={() => adjustCount(setBeds, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">shower</span> {t.bathroomsLabel}
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button type="button" onClick={() => adjustCount(setBaths, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                      <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={baths} />
                      <button type="button" onClick={() => adjustCount(setBaths, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                      <button type="button" onClick={() => adjustCount(setParking, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                      <input className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={parking} />
                      <button type="button" onClick={() => adjustCount(setParking, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="text-sm font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">Amenities</h3>
                  <div className="space-y-2">
                    {(['swimmingPool', 'garden', 'airConditioning', 'smartHome'] as const).map((key) => (
                      <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                          checked={amenities[key]}
                          onChange={() => toggleAmenity(key)}
                        />
                        <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${lang}/admin/properties`)}
              className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? t.saving : t.saveProperty}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
