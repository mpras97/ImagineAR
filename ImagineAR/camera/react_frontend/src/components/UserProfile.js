import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Switch, Route, Link } from 'react-router-dom';
import CaptureImage from "./CaptureImage";
import Dropzone from "./FileUpload";
import Home from "./Home";


function UserProfile(props) {

  const navBar = (
    <>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">Imagine AR</Navbar.Brand>
      <Nav className="mr-auto">
          <Nav.Link as={Link} to="/capture" >Capture Image</Nav.Link>
          <Nav.Link as={Link} to="/upload">Upload Templates</Nav.Link>
          <Nav.Link onClick={props.handle_logout}>logout</Nav.Link>
      </Nav>
    </Navbar>
    <Switch>
    <Route exact path='/' component={Home}/>
    <Route path='/capture' component={CaptureImage}/>
    <Route path='/upload' component={Dropzone}/>
    <Route render={function () {
      return <p>Not found</p>
    }} />
    </Switch>
    </>
  )

  return (
    <>
      {navBar}
    </>
  );
}

export default UserProfile;

UserProfile.propTypes = {
  handle_logout: PropTypes.func.isRequired
};