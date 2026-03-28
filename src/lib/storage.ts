import { supabase } from './supabase'

const BUCKET_NAME = 'properties'

export async function uploadPropertyImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading image:', uploadError.message)
      return null
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (err) {
    console.error('Unexpected error during upload:', err)
    return null
  }
}

export async function deletePropertyImage(publicUrl: string): Promise<boolean> {
  try {
    const urlParts = publicUrl.split('/')
    // Extract the file path after the bucket name
    const bucketIndex = urlParts.findIndex(part => part === BUCKET_NAME)
    if (bucketIndex === -1) return false
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/')

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('Unexpected error during deletion:', err)
    return false
  }
}
