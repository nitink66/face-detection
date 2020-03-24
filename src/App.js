import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
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
  apiKey: '499b6ce27908494eb409769cba86505d'
 });

class App extends Component{
  constructor(){
    super();
    this.state= {
      input:'',
      imageUrl:''
    }
  }

  onInputChange = (event) => {
    this.setState ({input : event.target.value});
  }

  onButtonSubmit =() =>{
    this.setState({
      imageUrl: this.state.input
    });
    app.models.predict(Clarifai.COLOR_MODEL, this.state.imageUrl).then(
    function(response) {
      // do something with response
      console.log(response);
      
    },
    function(err) {
      // there was an error
    }
  );
  }

  render(){
    return(
      <div className="App">
      <Particles className="particles"
         params = { ParticleOptions}
         />
         <Navigation />
         <Logo />
         <Rank />
         <ImageLinkForm onInputChange= { this.onInputChange }
           onButtonSubmit = {this.onButtonSubmit}
         />
          <FaceRecognition imageUrl = { this.state.imageUrl} />
    </div>
  );
  
  }
}
export default App;
