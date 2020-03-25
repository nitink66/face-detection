import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/Signin';
import Register from './components/Register/Register';
import Clarifai from 'clarifai';
import './App.css';

const ParticleOptions ={
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
},
color: {
  value: "#ffffff"
},
  polygon :{ 
    nb_sides :5
  },
  size: {
    value: 6,
    random: true,
    anim: {
      enable: false,
      speed: 4,
      size_min: 0.3,
      sync: false
    }
  },
  opacity: {
    value: 1,
    random: true,
    anim: {
      enable: true,
      speed: 1,
      opacity_min: 0,
      sync: false
    }
  },
  move: {
    enable: true,
    speed: 5,
    direction: "none",
    random: true,
    straight: false,
    out_mode: "out",
    bounce: false,
    attract: {
      enable: false,
      rotateX: 600,
      rotateY: 1200
    }
  },
  line_linked: {
    enable: false,
    distance: 300,
    color: "#ffffff",
    opacity: 0.4,
    width: 2
  }

}
}

const app = new Clarifai.App({
  apiKey: 'API_KEY'   // API KEY is changed here
 });

class App extends Component{
  constructor(){
    super();
    this.state= {
      input:'',
      imageUrl:'',
      box:{},
      route :'signin',
      isSignedIn : false
    }
  }

    calculateFaceLocation = (data) =>{
      const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
       bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

    displayFaceBox = (box) =>{
      this.setState({ box :box});
    }

  onInputChange = (event) => {
    this.setState ({input : event.target.value});
  }

  onButtonSubmit =() =>{
    this.setState({
      imageUrl: this.state.input
    });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response =>
     this.displayFaceBox(this.calculateFaceLocation(response)) )
   
    .catch(err => console.log(err));
  }

    onRouteChange = (route) => {
      if(route === 'signout'){
          this.setState({ isSignedIn : false})
      }
      else if(route ==='home'){
        this.setState({ isSignedIn : true})
      }
      this.setState({route : route})
    }

  render(){
   const { isSignedIn, imageUrl, route, box } = this.state;
    return(
      <div className="App">
      <Particles className="particles"
         params = { ParticleOptions}
         />
         <Navigation isSignedIn={isSignedIn} onRouteChange= {this.onRouteChange}/>
         {
           route ==='home'
           ? 
           <div><Logo />
         <Rank />
         <ImageLinkForm onInputChange= { this.onInputChange }
           onButtonSubmit = {this.onButtonSubmit}
         />
          <FaceRecognition box={box} imageUrl = { imageUrl} />
            </div>
           :(
             route === 'signin' 
             ? <SignIn onRouteChange={this.onRouteChange}/>
             : <Register onRouteChange={this.onRouteChange}/>
           )
           
           
          }
    </div>
  );
  
  }
}
export default App;
