// import React from 'react';
// import './App.css';
// import Webcam from "react-webcam";
import axios from 'axios';
// import * as THREE from "three";
// // import React3 from "react-three-renderer";
// // import ObjectModel from 'react-three-renderer-objects';
// import batman from './batman.obj'
// import batmanmtl from './batman.mtl'
// import {OBJModel} from 'react-3d-viewer'
// import {Tick,MTLModel} from 'react-3d-viewer'
//
//
// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: "user"
// };
//
// function Threerender() {
//
//   const tick = React.useRef(null)
//   const [rotation, setRotation] = React.useState({x:0,y:0,z:0});
//   React.useEffect( () => {
//
//     tick.current = Tick( ()=> {
//       const _rotation = {...rotation}
//       _rotation.y += 0.005
//       setRotation(_rotation)
//     })
//     },[])
//
//     return(
//       <div>
//         <MTLModel
//           enableZoom = {false}
//           position={{x:0,y:-100,z:0}}
//           rotation={rotation}
//           mtl={batmanmtl}
//           src={batman}
//         />
//       </div>
//     )
// }
//
//
// const WebcamCapture = () => {
//   const webcamRef = React.useRef(null);
//   const [isObject, setIsObject] = React.useState(false);
//
//   const capture = React.useCallback(
//     () => {
//       const imageSrc = webcamRef.current.getScreenshot();
//       console.log(imageSrc)
//
//       axios({
//         method: 'post',
//         url: 'http://localhost:8000/camera/image/',
//         data: {
//           image: imageSrc,
//         }
//       })
//       .then( response => {
//           if ( response.data ) {
//             console.log(response.data);
//             setIsObject(true);
//           }
//         }
//       )
//         .catch( error => console.log(error))
//     },
//     [webcamRef]
//   );
//   console.log(isObject);
//
//   return (
//     <>{
//           isObject ?
//           <>
//             <OBJModel src={batman} texPath="" position={{x:0,y:-1,z:0}}/>
//           {/*<Canvas>*/}
//           {/*  <ambientLight />*/}
//           {/*  <pointLight position={[10, 10, 10]} />*/}
//           {/*  <Box position={[-1.2, 0, 0]} />*/}
//           {/*  <Box position={[1.2, 0, 0]} />*/}
//           {/*</Canvas>*/}
//         </>
//       :
//       <>
//         <Webcam
//         audio={false}
//         height={720}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         width={1280}
//         videoConstraints={videoConstraints}
//         />
//         <button onClick={capture}>Capture photo</button>
//       </>
//     }
//     </>
//       );
// };
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <WebcamCapture />
//       </header>
//     </div>
//   );
// }
//
// export default App;


import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';
import Card from "react-bootstrap/Card";
import UserProfile from "./components/UserProfile";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: ''
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8000/camera/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    axios({
      method: 'POST',
      url: 'http://localhost:8000/token-auth/',
      data: data
    }).then(response => {
        localStorage.setItem('token', response.data.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: response.data.user.username
        });
      })
      .catch(err => console.log(err));
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/camera/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }

    return (
      <div> {this.state.logged_in ?
        <div>
          <UserProfile
            handle_logout={this.handle_logout}
          />
        </div> :
        <div className="container">
          <div className="card">
            <Nav
                logged_in={this.state.logged_in}
                display_form={this.display_form}
                handle_logout={this.handle_logout}
              />
            {form}
          </div>
        </div>
      }
    </div>
    );
  }
}

export default App;