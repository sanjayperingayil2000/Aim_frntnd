import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';

import { Stepper } from '../../components';
import { getLookup , getSubLookup } from '../../Redux/Actions/lookupActions';

const AssetEdit = () => {

  const id = useParams();
  const assetId = (id._id);

  const dispatch = useDispatch();

  //should be deleted
  // useEffect(() => {
  //   dispatch(getLookup());
  //   dispatch(getSubLookup());
  //   // dispatch({type : "GET_LOOKUP_DATA"});
  //   // dispatch({type : "GET_SUB_LOOKUP_DATA"});
  // },[]);

  return (
    <>
      <div className='app__header'>
        <h2 className='app__header--title'>Asset Register</h2>
      </div>
      <Stepper assetId={assetId}/>
    </>
  )
}

export default AssetEdit;