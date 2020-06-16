import React, { Component } from 'react';
import './mainDisplay.css';
import StylingOverlay from '../stylingOverlay/stylingOverlay.js';
import LoadingOverlay from 'react-loading-overlay';
import { CompactPicker } from 'react-color';
import Collapsible from 'react-collapsible';

class MainDisplay extends Component {

  render() {
  	let { 
      selectedClothingType, 
      clothingTypes, 
      generatedClothing, 
      selectedArtwork, 
      artworkTypes,
      setCoordinates,
      clothingImageId,
      artworkImageId,
      loading
    } = this.props

    return (
      <div id="mainDisplay">
        <div id="clothingDisplay">
         	<div id='pdiv'><h3>{selectedClothingType}</h3></div>
         	<StylingOverlay 
            selectedArtwork={selectedArtwork} 
            artworkTypes={artworkTypes} 
            maskImgId={clothingImageId} 
            pdiv={"pdiv"} 
            setCoordinates={setCoordinates}
            artworkImageId={artworkImageId}
            />
          <img src={clothingTypes[selectedClothingType]} 
         	     alt={"Mask of " + selectedClothingType} 
         	     className="maskImage" 
               id={clothingImageId}/>
            <div>
                <h4>Generation Options</h4>
                <label className='labels'>
                     <Collapsible trigger="Background Colour">
                        <CompactPicker />
                     </Collapsible>  
                </label>
            </div>
        </div>
        <h3>Generated Clothing</h3>
        <div id="generatedDisplay">
        <span>
          <LoadingOverlay
            active={loading}
            spinner
            text='Generating clothing'
            >
            <img src={generatedClothing} 
               alt={"Mask of " + selectedClothingType} 
               className="genImage" />
              <div class='levelDiv'>
                <h4>After effect Options</h4>
                <label className='labels'>
                     <Collapsible trigger="Sleeve Colour">
                        <CompactPicker />
                     </Collapsible>  
                </label>
                <label className='labels'>
                  <Collapsible trigger="Include Model">
                   <input
                    name="isGoing"
                    type="checkbox"
                    checked={false}
                    />
                  </Collapsible>
                </label>
              </div>
          </LoadingOverlay>
        </span>
        </div>
      </div>
    );
  }
}

export default MainDisplay;
