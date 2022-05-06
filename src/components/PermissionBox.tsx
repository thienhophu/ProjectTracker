import { useAppSelector, usePermissions } from '../app/hooks';

const PermissionBox = ({
  children,
  has,
}: React.PropsWithChildren<{ has: string }>): JSX.Element | null => {
  const user = useAppSelector((state) => state.auth.userData);
  const hasPermission = usePermissions({ permission: has, user });

  if (!hasPermission) {
    return null;
  }

  return children as JSX.Element;
};

export default PermissionBox;
