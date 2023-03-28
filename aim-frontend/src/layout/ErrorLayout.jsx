import React from 'react';
import { Outlet } from 'react-router-dom';

const ErrorLayout = () => {
  return (
    <main className='app__errors'>
        <Outlet/>
    </main>
  );
}

export default ErrorLayout;