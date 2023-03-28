export default (state = {lookupData:[], subLookupData:[]}, action) => {
  switch (action.type) {
    case 'SET_LOOKUP':
      return { ...state, lookupData: action.payload }
    
    case 'SET_SUB_LOOKUP':
      return { ...state, subLookupData: action.payload }

    default:

    return state
  }
}