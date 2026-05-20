export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  blogCount: number
  isApproved: boolean
  createdAt: string
}
