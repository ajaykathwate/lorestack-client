import { useAuthStore } from '@/store/authStore'
import { useCompanyMembers } from '@/api/hooks/useCompanyQueries'

export function usePermissions(companyHandle?: string) {
  const { user, authorProfile } = useAuthStore()
  const { data: members } = useCompanyMembers(companyHandle ?? '')

  const isPlatformAdmin = user?.platformRole === 'platform_admin'

  const companyRole = companyHandle && members
    ? members.find((m) => m.userId === user?.id)?.role ?? null
    : null

  const isCompanyOwner = companyRole === 'owner'
  const isCompanyAuthor = companyRole === 'author'
  const isCompanyMember = isCompanyOwner || isCompanyAuthor

  return {
    isPlatformAdmin,
    isCompanyOwner,
    isCompanyAuthor,
    isCompanyMember,
    canPublish: !!authorProfile,
    canSchedule: !!authorProfile,
    canDeleteBlog: !!authorProfile,
    canManageTeam: isCompanyOwner || isPlatformAdmin,
    canManageCompany: isCompanyOwner || isPlatformAdmin,
    canInviteAuthors: isCompanyOwner || isPlatformAdmin,
  }
}
