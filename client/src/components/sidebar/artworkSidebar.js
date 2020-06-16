import React, { Component } from 'react';
import './sidebar.css';


class ArtworkSidebar extends Component {
  render() {
  	
    return (
      <div id="artworkSidebar">
      	<h2>Selected Artwork</h2>
      	<button type="button">Upload</button>
        <h2>Artwork Gallery</h2>
        <img src={require("../../images/example1.jpg")} alt="Example artwork1" className="images" />
        <img src={require("../../images/example2.jpg")} alt="Example artwork2" className="images" />
        <img src={require("../../images/example3.jpg")} alt="Example artwork3" className="images" />
        <img src={require("../../images/example4.jpg")} alt="Example artwork4" className="images" />
        <img src={require("../../images/example5.jpg")} alt="Example artwork5" className="images" />
      </div>
    );
  }
}

export default ArtworkSidebar;
