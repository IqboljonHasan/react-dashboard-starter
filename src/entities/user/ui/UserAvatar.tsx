import { UserOutlined } from '@ant-design/icons';
import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'icon'> {
  avatarUrl?: string;
  name?: string;
}

export function UserAvatar({ avatarUrl, name, ...props }: UserAvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : undefined;

  return (
    <Avatar
      src={avatarUrl}
      icon={!avatarUrl && !initials ? <UserOutlined /> : undefined}
      {...props}
    >
      {!avatarUrl && initials}
    </Avatar>
  );
}
