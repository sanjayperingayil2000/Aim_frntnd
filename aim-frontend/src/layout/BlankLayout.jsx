import React from 'react';
import { Outlet } from 'react-router-dom';

const BlankLayout = ( ) => {
  return (
    <>
        <main>
            <section className='app__auth'>
                <Outlet/>
            </section>
        </main>
    </>
  )
}

export default BlankLayout