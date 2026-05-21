import type { PaginatedResponse, User, UserListParams } from './types';

export const fakeUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-02-03T09:30:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2024-02-18T11:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-03-01T14:15:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-03-20T10:45:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eva',
  },
  {
    id: '6',
    name: 'Frank Lee',
    email: 'frank@example.com',
    role: 'viewer',
    status: 'suspended',
    createdAt: '2024-04-05T13:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
  },
  {
    id: '7',
    name: 'Grace Kim',
    email: 'grace@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-04-22T08:30:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
  },
  {
    id: '8',
    name: 'Henry Wilson',
    email: 'henry@example.com',
    role: 'manager',
    status: 'inactive',
    createdAt: '2024-05-10T16:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry',
  },
  {
    id: '9',
    name: 'Iris Chen',
    email: 'iris@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-05-28T09:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iris',
  },
  {
    id: '10',
    name: 'Jack Taylor',
    email: 'jack@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-06-14T11:30:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jack',
  },
  {
    id: '11',
    name: 'Karen Davis',
    email: 'karen@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-07-01T14:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karen',
  },
  {
    id: '12',
    name: 'Leo Garcia',
    email: 'leo@example.com',
    role: 'viewer',
    status: 'suspended',
    createdAt: '2024-07-19T08:45:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leo',
  },
  {
    id: '13',
    name: 'Mia Rodriguez',
    email: 'mia@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-08-05T10:15:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mia',
  },
  {
    id: '14',
    name: 'Noah Anderson',
    email: 'noah@example.com',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2024-08-22T13:30:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noah',
  },
  {
    id: '15',
    name: 'Olivia Thomas',
    email: 'olivia@example.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-09-09T09:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
  },
  {
    id: '16',
    name: 'Paul Jackson',
    email: 'paul@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-09-26T15:45:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=paul',
  },
  {
    id: '17',
    name: 'Quinn Harris',
    email: 'quinn@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-10-14T11:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quinn',
  },
  {
    id: '18',
    name: 'Rachel Clark',
    email: 'rachel@example.com',
    role: 'manager',
    status: 'inactive',
    createdAt: '2024-11-01T08:15:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel',
  },
  {
    id: '19',
    name: 'Sam Lewis',
    email: 'sam@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-11-18T14:30:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam',
  },
  {
    id: '20',
    name: 'Tina Walker',
    email: 'tina@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-12-05T10:00:00Z',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tina',
  },
];

export function applyFakeUserFilters(params: UserListParams): PaginatedResponse<User> {
  let filtered = fakeUsers;

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s),
    );
  }
  if (params.role) filtered = filtered.filter((u) => u.role === params.role);
  if (params.status) filtered = filtered.filter((u) => u.status === params.status);

  if (params.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = String(a[params.sortBy as keyof User] ?? '');
      const bVal = String(b[params.sortBy as keyof User] ?? '');
      const cmp = aVal.localeCompare(bVal);
      return params.sortOrder === 'desc' ? -cmp : cmp;
    });
  }

  const start = (params.page - 1) * params.pageSize;
  return {
    data: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
  };
}
