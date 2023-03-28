import React from 'react';
import { Button }  from '../../components';
import { images } from '../../constants';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ExpiredLink = () => {
    return (
        <div className='error__wrapper'>
            <div className='error__content'>
                <h3 className='error__title'>Uh-oh</h3>
                <span className='error__subtitle'>Something isn't right.</span>
                <img src={images.expired} alt='error-img' className='error__img' />
                <p className='error__text'>To reset your password, return to the login page and select "Forgot Password" to send a new email.</p>
                <Link to='/login'>
                    <Button variant='click-primary' size='click-xl' className='error__btn'>
                        <FiArrowLeft />
                        <span>Back to Login</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default ExpiredLink;