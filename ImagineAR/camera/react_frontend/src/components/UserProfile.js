import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Switch, Route, Link } from 'react-router-dom';
import NavItem from "react-bootstrap/NavItem";
import CaptureImage from "./CaptureImage";
import Dropzone from "./FileUpload";


function UserProfile(props) {

  const navBar = (
    <>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Imagine AR</Navbar.Brand>
      <Nav className="mr-auto">
        {/*<NavItem eventkey={1} href="/">*/}
          <Nav.Link as={Link} to="/capture" >Capture Image</Nav.Link>
          <Nav.Link href="/upload">Upload Templates</Nav.Link>
          <Nav.Link onClick={props.handle_logout}>logout</Nav.Link>
        {/*</NavItem>*/}
      </Nav>
    </Navbar>
    <Switch>
    <Route exact path='/' />
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