import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';
import Loader from './Loader';
import React from 'react';

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  // if (loading) {
  //   return (
  //     <main>
  //       {/* <h1>Loading...</h1> */}
  //       <Loader />
  //     </main>
  //   );
  // }

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return children;
};

export default Protected;
