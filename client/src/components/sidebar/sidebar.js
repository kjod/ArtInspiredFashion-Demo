import React, { Component } from 'react';


class Sidebar extends Component {
  render() {
  	let { types, selectedType, changeItem, idName, selectedTitle, galleryTitle, invert } = this.props
  	let ordering = Object.keys(types)
  	let tempIndex = ordering.findIndex(x => x===selectedType);
  	let tempObj = ordering[tempIndex]
  	ordering[tempIndex] = ordering[0]
  	ordering[0] = tempObj

	return (
      	<div id={idName}>
	        
	        { 
	        	ordering.map( o => (
	        		<span>
		        		{o === selectedType &&
					        (<div>
						        <h2>{selectedTitle}</h2>
						        <div className={"img_container selected_image"}> 	
						        	<img
							        	src={types[o]} 
							        	alt={o} 
							        	className={"images " + (invert ? 'sel_invert' : '')}  
						        	/>
				        		</div>
				        		<h2>{galleryTitle}</h2>
							</div>)
			        	}
		        		{o !== selectedType &&
		        			<div 
			    				className={"img_container" }
			    				onClick={e => changeItem(o, e)}>
					        	
					        	<img
						        	src={types[o]} 
						        	alt={o} 
						        	className={"images " + (invert ? 'img_invert' : '') }  
					        	/>
		        			</div>
		        		}
	        		</span>)
			    )
	    	}	
    	</div>
    );
  }
}

export default Sidebar;
