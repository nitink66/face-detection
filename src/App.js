import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/Signin';
import Register from './components/Register/Register';
import Loading from './components/Loading/Loading'
//import Clarifai from 'clarifai';
import './App.css';
const url = "https://safe-refuge-63628.herokuapp.com";
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



//YOU MUST CREATE YOUR OWN API KEY


 const initialState ={
      input:'',
      imageUrl:'',
      box:[{}],
      route :'signin',
      isSignedIn: localStorage.getItem('isSignedIn') || false,
      disableFind: true,
      loading: false,
      user : JSON.parse(localStorage.getItem('user')) || {
            id:'',
            name:'',
            email:'',
            entries:0,
            joined: ''
      },
      image:''
}

class App extends Component{
  constructor(){
    super();
    this.state= initialState;
  }

  loaduser =(data) =>{
    this.setState ({user :{
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined:  data.joined
    }})
    localStorage.setItem('user', JSON.stringify(this.state.user));
  } 

    calculateFaceLocation = (data) =>{
      if (data === -1 || Object.keys(data.outputs[0].data).length === 0) { return []; }

      var a = data.outputs[0].data.regions;
      var faces = [];
  
      for (var i = 0; i < a.length; i++) {
        faces.push(a[i].region_info.bounding_box);
      }
  
      var image = document.getElementById("inputImage");
      var width = Number(image.width);
      var height = Number(image.height);
  
      var boxes = faces.map(s => {
        return {
          leftCol: s.left_col * width,
          topRow: s.top_row * height,
          rightCol: width - (s.right_col * width),
          bottomRow: height - (s.bottom_row * height)
        }
      });
      return boxes;
    }

    displayFaceBox = (box) => {
      this.setState({ box: box || []});
    }

    onInputChange = (event) => {
      if (event.target.files) {
        this.setState({ loading: true });
        const files = Array.from(event.target.files);
        const formData = new FormData();
        files.forEach((file, i) => {
          formData.append(i, file)
        })
        fetch(`https://facebrain-server.herokuapp.com/image-upload`, {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(images => {
            this.setState({ input: images[0].url, disableFind: false, loading: false });
          })
      } else {
        this.setState({ input: event.target.value, disableFind: false });
      }
  
      this.setState({ box: [{}] });
    }
  
    onInputClear = () => {
      this.setState({ input: '', box: [{}], disableFind: false, loading: false });
    }


    onButtonSubmit = () => {
    this.setState({ loading: true });
    fetch(url + "/imageurl", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch(url + "/image", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }));
          })
          .catch(console.log)
      }
      this.setState({ loading: false });
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
  }



    onRouteChange = (route) => {
      if(route === 'signout'){
          this.setState(initialState);
          localStorage.removeItem('isSignedIn');
      }
      else if(route ==='home'){
        this.setState({ isSignedIn : true});
        localStorage.setItem('isSignedIn', true);
      }
      this.setState({route : route})
    }

    render() {
      let { box, input, route, isSignedIn, disableFind, user, loading } = this.state;
  
      return (
        <div className="App">
          <Particles 
            className="particles" 
            params={ParticleOptions} 
          />
          <Navigation 
            onRouteChange={this.onRouteChange} 
            isSignedIn={isSignedIn} 
          />
          {isSignedIn
            ? <div>
                <div className="logo-rank">
                  <Logo />
                  <Rank name={user.name} entries={user.entries} />
                </div>
                {
                  loading ? <Loading /> :
                  <>
                    <ImageLinkForm 
                      input={input}
                      onInputChange={this.onInputChange} 
                      onButtonSubmit={this.onButtonSubmit} 
                      disableFind={disableFind}
                      onInputClear={this.onInputClear}
                    />
                    {input && <FaceRecognition box={box} imageUrl={input} />}
                  </>
                }
            </div>
            : (route === 'signin' || route === 'signout'
              ? <SignIn 
                  loaduser={this.loaduser} 
                  onRouteChange={this.onRouteChange} 
                  url={url} 
                />
              : <Register 
                  loaduser={this.loaduser} 
                  onRouteChange={this.onRouteChange}  
                  url={url}
                />
              )
          }
        </div>
      );
    }
  }
export default App;
