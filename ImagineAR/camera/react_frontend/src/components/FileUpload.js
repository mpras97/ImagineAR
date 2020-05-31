import React from 'react';
import {useDropzone} from 'react-dropzone';

function Dropzone(props) {
  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const upload = acceptedFiles.map(file => (
    console.log(file.path)
  ));

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here</p>
              <button type="button" onClick={open}>
                Open File Dialog
              </button>
            </div>
            <aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>
            <button onClick={upload}>upload</button>
          </div>
        </header>
      </div>
    </>
  );
}

export default Dropzone;