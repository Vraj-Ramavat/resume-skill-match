export const roles = ['ADMIN', 'SITE_MANAGER', 'FINANCE', 'RECRUITER'] as const;

export type Role = (typeof roles)[number];

const roleRank: Record<Role, number> = {
  ADMIN: 4,
  SITE_MANAGER: 3,
  FINANCE: 2,
  RECRUITER: 1
};

export function hasMinimumRole(userRole: Role, requiredRole: Role) {
  return roleRank[userRole] >= roleRank[requiredRole];
}
