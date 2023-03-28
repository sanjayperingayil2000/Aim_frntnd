import React from 'react';
import { images } from '../../constants';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='error__wrapper'>
            <div className='error__content'>
                <img src={images.NotFound} alt='error-img' className='error__img' />
                <h3 className='error__title' style={{ marginBottom: '10px' }}>Page Not Found</h3>
                <p className='error__text'>Sorry, we couldn't find the page you are looking for.</p>
                <Link to='/dashboard/inspection-overview' className='error__link'>
                    <FiArrowLeft />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;