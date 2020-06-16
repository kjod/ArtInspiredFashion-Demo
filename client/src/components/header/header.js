import React, { Component } from 'react';
import './header.css';

class Header extends Component {
  render() {
    let { generateF } = this.props;

    return (
      <div id="header">
        <h1>Art Inspired Fashion</h1>
      	<button type="button" onClick={e => generateF(e)}>Generate</button>
      </div>
    );
  }
}

export default Header;
