import { useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '@/api/services/blogService'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { CreateBlogPayload, UpdateBlogPayload, ScheduleBlogPayload } from '@/types/api'

export function useCreateBlog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBlogPayload) =>
      blogService.create(payload).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.MINE })
    },
  })
}

export function useUpdateBlog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: UpdateBlogPayload }) =>
      blogService.update(slug, payload).then((r) => r.data.data),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.MINE })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.BY_SLUG(blog.slug) })
    },
  })
}

export function useDeleteBlog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogService.delete(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.MINE })
    },
  })
}

export function usePublishBlog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogService.publish(slug).then((r) => r.data.data),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.MINE })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.BY_SLUG(blog.slug) })
    },
  })
}

export function useScheduleBlog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: ScheduleBlogPayload }) =>
      blogService.schedule(slug, payload).then((r) => r.data.data),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.MINE })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.BY_SLUG(blog.slug) })
    },
  })
}

export function useArchiveBlog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogService.archive(slug).then((r) => r.data.data),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.MINE })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.BY_SLUG(blog.slug) })
    },
  })
}

export function useUnarchiveBlog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogService.unarchive(slug).then((r) => r.data.data),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.MINE })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BLOGS.BY_SLUG(blog.slug) })
    },
  })
}
