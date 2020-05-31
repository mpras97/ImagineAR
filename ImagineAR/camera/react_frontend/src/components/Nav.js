import React from 'react';
import PropTypes from 'prop-types';
import Navbar from "react-bootstrap/Navbar";
import { Switch, Route, Link } from 'react-router-dom';
import { default as NavBootstrap} from "react-bootstrap/Nav";
import '../App.css';
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import {BackgroundImage, Image} from "react-image-and-background-image-fade";
import amsterdam from "../amsterdam-5211981_1920.jpg"




function Nav(props) {

  const logged_out_nav = (
      <div >
          <h1>Imagine AR</h1>
          <ul>
            <li onClick={() => props.display_form('login')}>login</li>
            <li onClick={() => props.display_form('signup')}>signup</li>
          </ul>
      </div>
);
  return <div>{logged_out_nav}</div>;
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};