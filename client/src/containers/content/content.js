import React, { Component } from 'react';
import Header from '../../components/header/header.js';
import Sidebar from '../../components/sidebar/sidebar.js';
import ArtworkSidebar from '../../components/sidebar/artworkSidebar.js';
import MainDisplay from '../../components/mainDisplay/mainDisplay.js';
import Footer from '../../components/footer/footer';
import './content.css';
import axios from 'axios';
import qs from 'qs';

class Content extends Component {
  
  constructor(props) {
	  super(props);
	  // Don't call this.setState() here!
	  this.state = {
	  	clothingImageId: 'maskClothingItem',
	  	artworkImageId: 'artworkClothingId',
	  	selectedClothingType: 'Graphic T-Shirt Dress',
	  	selectedArtwork: '1',
	  	generatedClothing: '../../images/Graphic T-Shirt Dress.png',
	  	loading: false,
	  	clothingTypes: {
			'Graphic T-Shirt Dress': require('../../images/Graphic T-Shirt Dress.png'), 
			'A-Line Dress': require('../../images/A-Line Dress.png'), 
			'Men 34 Baseball T-shirt': require('../../images/Men 34 Baseball T-shirt.png'), 
			'Tank Top': require('../../images/Tank Top.png'), 
			'Zipped Hoodie': require('../../images/Zipped Hoodie.png')
		},
		artworkTypes:{
			'1':require("../../images/example1.jpg"),
        	'2':require("../../images/example2.jpg"),
        	'3':require("../../images/example3.jpg"),
        	'4':require("../../images/example4.jpg"),
        	'5':require("../../images/example5.jpg")
		},
		minBox:{
			'Graphic T-Shirt Dress': {x1:281.7389, x2:609.4711, y1:224.0570, y2:631.4013}, 
			'A-Line Dress': {x1:285.5190, x2:598.7344, y1:198.2164, y2:536.2203},
			'Men 34 Baseball T-shirt': {x1:276.6379, x2:660.8602, y1:249.7340, y2:729.2906},
			'Tank Top': {x1:283.6728, x2:645.5862, y1:253.8127, y2:699.4724},
			'Zipped Hoodie': {x1:239.0325, x2:689.6607, y1:281.6818, y2:916.3581}
		},
		maxBox:{
			'Graphic T-Shirt Dress': {x1:369.8255, x2: 706.1047, y1:419.4030, y2:1015.7820}, 
			'A-Line Dress': {x1:441.2362, x2:733.1132, y1:666.2247, y2:1029.2980},
			'Men 34 Baseball T-shirt': {x1:369.2412, x2:748.7792, y1:533.0901, y2:935.9303},
			'Tank Top': {x1:359.9496, x2:712.4583, y1:350.0799, y2:907.7621}, 
			'Zipped Hoodie': {x1:308.6330, x2:770.4471, y1:385.9153, y2:990.3247}
		}
	  };
	  this.changeClothingItem = this.changeClothingItem.bind(this);
	  this.changeArtworkItem = this.changeArtworkItem.bind(this);
	  this.generateClothing = this.generateClothing.bind(this);
  }

  changeClothingItem(newType){
  	this.setState({selectedClothingType: newType})
  }

  changeArtworkItem(newArtwork){
  	this.setState({selectedArtwork: newArtwork})
  }

  generateClothing(){
  	let { 
  		selectedArtwork, 
  		selectedClothingType, 
  		clothingImageId,
  		artworkImageId,
  	} = this.state;

  	let clothing = document.getElementById(clothingImageId).getBoundingClientRect();
  	let artwork = document.getElementById(artworkImageId).getBoundingClientRect();
  	
  	let left = 0
  	let right = clothing.right - clothing.left
  	let top = 0
  	let bottom = clothing.bottom - clothing.top 

  	//1000 - clothing.left/artwork.left * 1000
  	let coordinates = {
  		x1: (artwork.left - clothing.left) * 1000 / right,
  		x2: (artwork.right - clothing.left) * 1000 / right,
  		y1: (artwork.top - clothing.top) * 1000 / bottom,
  		y2: (artwork.bottom - clothing.top) * 1000 / bottom,
  	}

  	console.log(coordinates)

  	let dict = { 
  				artwork:selectedArtwork,
  				type:selectedClothingType,
  				coordinates: JSON.stringify(coordinates)
  			   };

    const options = {
	  method: 'POST',
	  headers: { 'content-type': 'application/x-www-form-urlencoded' },
	  data: qs.stringify(dict),
	  url: 'http://127.0.0.1:8000/generate/'
	};

	this.setState({loading:true})
	let res =axios(options)
    res.then(x => {
    	console.log('x  ', x)
    	this.setState({generatedClothing: ('../../images/generated_images/' + x.data.generated_image), loading:false})
    	console.log('x  ', x)	
    })
  }

  render() {
  	let { 
		clothingTypes, 
		selectedClothingType, 
		selectedArtwork,
		artworkTypes,
		generatedClothing,
		clothingImageId,
		artworkImageId,
		loading
  	} = this.state;
 
    return (
      <div id="content_container">
      	<Header generateF={this.generateClothing} />
      	<div id='wrapper'> 
	      	<Sidebar 
	      		types={clothingTypes}
	      		changeItem={this.changeClothingItem} 
	      		selectedType={selectedClothingType}
	      		idName="clothingSidebar"
	      		selectedTitle="Selected Clothing"
	      		galleryTitle="Clothing Items"
	      		invert={true}
	      	/>
	      	<MainDisplay 
	      		artworkTypes={artworkTypes}
	      		clothingTypes={clothingTypes}
	      		selectedClothingType={selectedClothingType}
	      		generatedClothing={generatedClothing}
	      		selectedArtwork={selectedArtwork}
	      		clothingImageId={clothingImageId}
	      		artworkImageId={artworkImageId}
	      		loading={loading}
	      	/>
	      	<Sidebar 
	      		types={artworkTypes}
	      		changeItem={this.changeArtworkItem} 
	      		selectedType={selectedArtwork}
	      		idName="artworkSidebar"
	      		selectedTitle="Selected Artwork"
	      		galleryTitle="Gallery"
	      		invert={false}

	      	/>
	      	{/*<ArtworkSidebar artwork={selectedArtwork} />*/}
      	</div>
      	<Footer />
      </div>
    );
  }
}

export default Content;
