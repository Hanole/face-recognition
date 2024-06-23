import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import React, { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'


  const returnClarifaiRequestOptions = (imageUrl) => {

    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = 'b78a0c00137e49b7a80e293fd733112b';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL,
                    },
                },
            },
        ],
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions
  }

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id


const config = {
    num: [0]
  }

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

loadUser = (data) => {
  this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
}


  calculateFaceLocation =  (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
        fetch('https://api.clarifai.com/v2/models/' + 
          'face-detection' + 
          '/outputs', returnClarifaiRequestOptions(this.state.input))
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response  => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })  
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err)); 
  }

onRouteChange = (route) => {
  if(route === 'signout') {
    this.setState({isSignedIn: false})
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

render() {
  return (
    <div className="App">
        <ParticlesBg config={config} type="cobweb" bg={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }} color="#02AAB0"/>
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
      { this.state.route === 'home' 
        ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} 
          />
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
      : ( 
          this.state.route === 'signin' 
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
     }
    </div>
  );
}}

export default App;
