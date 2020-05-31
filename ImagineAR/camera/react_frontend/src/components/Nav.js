import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

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