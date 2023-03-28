import React from 'react';
import { Card } from '../../components';

const AssetLocator = () => {
  return (
    <>
      <div className='app__header'>
        <h2 className='app__header--title'>Asset Locator</h2>
      </div>
      <Card variant='remove-header' className='locator-card'>
        <div className='asset-locator'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28931.18175141846!2d55.16299701159574!3d24.986598174676935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f72f4b0b690f1%3A0xbe838b0fd118f9d1!2sDubai%20Investments%20Park%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1661161576577!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </Card>
    </>
  )
}

export default AssetLocator