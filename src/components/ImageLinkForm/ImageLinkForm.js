import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange,onButtonSubmit}) => {
    return (
        <div>
            <p className="white f3">This Magic Brain will detect Faces in your Pictures. Give it a try</p>
            <p className="white f3">Use the url address of a image</p>
        
        <div className="center">
        <div className="form center pa4 br3 shadow-5">
            <input className="f4 pa2 w-70 center" type="text" onChange={ onInputChange } />
            <button className="w-30 grow link f4 ph3 pv2 dib white bg-light-purple" 
                    onClick= { onButtonSubmit }>Detect</button>
        </div>
        </div>
        </div>
    );
}

export default ImageLinkForm ;