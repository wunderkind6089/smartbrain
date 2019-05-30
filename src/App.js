import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import './App.css';

const particlesOption = {
  particles: {
    number : {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
 apiKey: 'a197edb4093c44f3a3ad0b4fabfdcfbf'
});
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'SignIn',
      isSignedIn: false

    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
  }

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit= () =>{
  const {input} = this.state;
  this.setState({imageUrl: input});
  app.models
  .predict(
    Clarifai.FACE_DETECT_MODEL, 
    input)
  .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(err => console.logo(err));   
}

onRouteChange = (route) => {
  if (route === 'signOut'){
    this.setState({isSignedIn: false})
  }else if (route === 'home' ) {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

  render() {
    const { route, isSignedIn, box, imageUrl} = this.state;
    return (
      <div className="App">
        <Particles className= 'particles'
          params={particlesOption}
        />
      <Navigation isSignedIn= { isSignedIn } onRouteChange= {this.onRouteChange}/>
      { route === 'home'
      ?
      <div>
      <Logo/>
      <Rank/>
      <ImageLinkForm 
        onInputChange={this.onInputChange}
         onButtonSubmit={ this.onButtonSubmit }/>
      <FaceRecognition box={ box } imageUrl = { imageUrl }/>  
      </div>
   : (
        this.state.route === 'SignIn' 
        ?<SignIn onRouteChange= {this.onRouteChange}/>
        :<Register onRouteChange= {this.onRouteChange}/>
      )
      }
      </div>
    );
  }
}

export default App;


