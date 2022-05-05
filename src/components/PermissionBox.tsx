import { useAppSelector, usePermissions } from '../app/hooks';

const PermissionBox = ({
  children,
  has,
}: React.PropsWithChildren<{ has: string }>): JSX.Element => {
  const user = useAppSelector((state) => state.auth.userData);
  console.log('🚀 ~ file: PermissionBox.tsx ~ line 8 ~ user', user);
  const hasPermission = usePermissions({ permission: has, user });

  if (!hasPermission) {
    return <></>;
  }

  return children as JSX.Element;
};

export default PermissionBox;
