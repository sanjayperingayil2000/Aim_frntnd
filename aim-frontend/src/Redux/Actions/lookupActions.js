import axios from '../../axios';

export const setLookup = ( lookup) => {
    return {
        type: 'SET_LOOKUP',
        payload: lookup
    }
}

export const setSubLookup = ( sublookup) => {
    return {
        type: 'SET_SUB_LOOKUP',
        payload: sublookup
    }
}

export const getLookup = ( ) => {
    return(dispatch) => {
        axios.get('/lookupItems')
        .then(res => {
            dispatch(setLookup(res.data))
        })
        .catch(error => console.log(error))
    }
}

export const getSubLookup = ( ) => {
    return(dispatch) => {
        axios.get('/lookupSubItems')
        .then(res => {
            dispatch(setSubLookup(res.data))
        })
        .catch(error=>console.log(error))
    }
}