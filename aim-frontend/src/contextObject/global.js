import React from 'react';
import { createContext } from 'react';
import TokenService from '../services/tokenService';


const currentUser = TokenService.getUser();
let userContext;
let isAuthenticated = false;
if(currentUser !== null) {
    const userName = currentUser.firstName;     
    userContext = createContext({user:userName, isAuthenticated:isAuthenticated})
    isAuthenticated = true;
 }
export const SidebarContext = createContext(false);
export default userContext;



