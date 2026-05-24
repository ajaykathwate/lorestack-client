import { apiClient } from '@/api/client/axiosInstance'
import type {
  Blog,
  BlogSummary,
  CreateBlogPayload,
  UpdateBlogPayload,
  ScheduleBlogPayload,
  ExploreParams,
  ApiResponse,
  PaginatedResult,
} from '@/types/api'

export const blogService = {
  create: (payload: CreateBlogPayload) =>
    apiClient.post<ApiResponse<Blog>>('/blogs', payload),

  getMyBlogs: () =>
    apiClient.get<ApiResponse<PaginatedResult<BlogSummary>>>('/blogs/me'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Blog>>(`/blogs/${slug}`),

  getMyBlogBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Blog>>(`/blogs/me/${slug}`),

  update: (slug: string, payload: UpdateBlogPayload) =>
    apiClient.patch<ApiResponse<Blog>>(`/blogs/${slug}`, payload),

  delete: (slug: string) =>
    apiClient.delete(`/blogs/${slug}`),

  publish: (slug: string) =>
    apiClient.post<ApiResponse<Blog>>(`/blogs/${slug}/publish`),

  schedule: (slug: string, payload: ScheduleBlogPayload) =>
    apiClient.post<ApiResponse<Blog>>(`/blogs/${slug}/schedule`, payload),

  archive: (slug: string) =>
    apiClient.post<ApiResponse<Blog>>(`/blogs/${slug}/archive`),

  unarchive: (slug: string) =>
    apiClient.post<ApiResponse<Blog>>(`/blogs/${slug}/unarchive`),

  explore: (params?: ExploreParams) =>
    apiClient.get<ApiResponse<PaginatedResult<BlogSummary>>>('/explore', { params }),
}
