import React, { Component } from 'react';
import { resizeableImage } from './component.js'
import './component.css'

class StylingOverlay extends Component {

   constructor(props) {
	  super(props);
	  this.state = { 
	  	
	  };
  }

  componentDidMount(){
  	let { maskImgId, pdiv } = this.props;
  	resizeableImage('.appliedArtwork', maskImgId, pdiv);
  }

  componentWillReceiveProps(nextProps){
  if(nextProps.selectedArtwork!==this.props.selectedArtwork){
    //Perform some operation
    console.log('Change')
    let { maskImgId, pdiv } = this.props;
    //resizeableImage('.appliedArtwork', maskImgId, pdiv);
  }
}

  render() {
  	let { artworkTypes, selectedArtwork, artworkImageId } = this.props;

    return (
	   <div id="stylingOverlay">	     
       	<img src={artworkTypes[selectedArtwork]} 
         	 alt={"Example " + selectedArtwork} 
         	 className="appliedArtwork"
        	 id={artworkImageId}
        />
       	<canvas id="canvas" width={150} height={250}></canvas>
       </div>
    );
  }
}

export default StylingOverlay;
