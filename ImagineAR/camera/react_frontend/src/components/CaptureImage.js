import React from 'react';
import Webcam from "react-webcam";
import axios from 'axios';
import batman from '../batman.obj'
import {OBJModel} from 'react-3d-viewer'
import 'react-html5-camera-photo/build/css/index.css';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const [isObject, setIsObject] = React.useState(false);

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

    const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc)
        axios({
          method: 'post',
          url: 'http://localhost:8000/camera/image/',
          data: {
          image: imageSrc,
        }
      })
      .then( response => {
          if ( response.data ) {
            console.log(response.data);
            setIsObject(true);
          }
        }
      )
        .catch( error => console.log(error))
    },
    [webcamRef]
  );
  console.log(isObject);


  return (
    <>{isObject ?
      <>
        <OBJModel src={batman} texPath="" position={{x:0,y:-1,z:0}}/>
        </> :
      <>
        <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        />
        <button onClick={capture}>Capture photo</button>
      </>
    }
    </>
      );
};

function CaptureImage() {
  return (
    <div className="App">
      <header className="App-header">
        <WebcamCapture />
      </header>
    </div>
  );
}

export default CaptureImage;
