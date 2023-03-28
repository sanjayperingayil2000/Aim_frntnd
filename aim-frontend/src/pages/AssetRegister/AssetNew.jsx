import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Stepper } from '../../components';
import { getLookup , getSubLookup } from '../../Redux/Actions/lookupActions';

const AssetNew = () => {
  const [stopswipe,setStopSwipe]=useState(false)

  const dispatch = useDispatch();

//should be deleted
  useEffect(() => {
    dispatch(getLookup());
    dispatch(getSubLookup());
    setStopSwipe(true)
    // dispatch({type : "GET_LOOKUP_DATA"});
    // dispatch({type : "GET_SUB_LOOKUP_DATA"});
  },[]);

  // const lookupData = useSelector( ( state ) => state.lookupData);
  // const subLookupData = useSelector( ( state ) => state.subLookupData);

  return (
    <>
      <div className='app__header'>
        <h2 className='app__header--title'>Asset Register</h2>
      </div>
      <Stepper stopswipe={stopswipe}/>
    </>
  )
}

export default AssetNew