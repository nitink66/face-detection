import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl , box}) => {
    return(
        <div className="center ma">
            <div className="absoulte mt5">
            <img src={ imageUrl } id="inputImage" alt="" width='392px' height='auto'/>
                <div className="bounding_box" style={{top:box.topRow , right:box.rightCol , 
                            bottom : box.bottomRow , left :box.leftCol}}></div>
            </div>
        </div>
    );
}

export default FaceRecognition;