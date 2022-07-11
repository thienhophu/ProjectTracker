import { PropsWithChildren } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

import { LOGIN } from '../app/routes';
import { getCurrentUserData } from '../features/auth/authSlice';

const PrivateRoute = ({
  children,
  ...rest
}: PropsWithChildren<{ exact: boolean; path: string }>) => {
  const currentUser = useAppSelector(getCurrentUserData);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return currentUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: LOGIN,
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
