import { IonLoading } from '@ionic/react';
import { useDispatch } from 'react-redux';
import { useSigninCheck } from 'reactfire';
import { setAuthListener } from '../services/auth';

const AuthCheck = ({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const dispatch = useDispatch();

  (async () => await dispatch(setAuthListener()))();

  const { status, data: signInCheckResult } = useSigninCheck();

  if (status === 'loading') {
    return <IonLoading isOpen message={'Please wait...'} />;
  }

  if (!children) {
    throw new Error('Children must be provided');
  }

  if (signInCheckResult?.signedIn === true) {
    return children as JSX.Element;
  } else {
    return fallback;
  }
};

export default AuthCheck;
