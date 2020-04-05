import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) =>{
        if(isSignedIn){
            return (
        <nav style={{ display:"flex",justifyContent:"flex-end"}}>
            <p 
             onClick={() => onRouteChange('signout')}
            className="white f3 link dim black underline pa3 pointer">SIGN OUT</p>
        </nav>)
        }else
        {
            return(
            <nav style={{ display:"flex",justifyContent:"flex-end"}}>
            <p 
             onClick={() => onRouteChange('signin')}
            className="white f3 link dim black underline pa3 pointer">SIGN IN</p>
        <p 
             onClick={() => onRouteChange('reigster')}
            className="white f3 link dim black underline pa3 pointer">Register</p>
        </nav>)
        }
    
}

export default Navigation;