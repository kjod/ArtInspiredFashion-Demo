import $ from 'jquery'; 

export var resizeableImage = function(image_target, maskImgId, pdiv) {
  // Some variable and settings
  var $container,
      orig_src = new Image(),
      image_target = $(image_target).get(0),
      event_state = {},
      constrain = false,
      min_width = 20, // Change as required
      min_height = 20,
      max_width = 800, // Change as required
      max_height = 900,
      resize_canvas = document.createElement('canvas'),
      maskImg = document.getElementById(maskImgId),
      pdiv = document.getElementById(pdiv),
      boundary = [0,0, 0, 0]//x1, x2, y1, y2

      //image_target.height = 250;
      //image_target.width = 150;

  var init = function(){
    // When resizing, we will always use this copy of the original as the base
    orig_src.src=image_target.src;

    // Wrap the image with the container and add resize handles
    $(image_target).wrap('<div class="resize-container"></div>')
    .before('<span class="resize-handle resize-handle-nw"></span>')
    .before('<span class="resize-handle resize-handle-ne"></span>')
    .after('<span class="resize-handle resize-handle-se"></span>')
    .after('<span class="resize-handle resize-handle-sw"></span>');

    // Assign the container to a variable
    $container =  $(image_target).parent('.resize-container');

    // Add events
    $container.on('mousedown touchstart', '.resize-handle', startResize);
    $container.on('mousedown touchstart', 'img', startMoving);
    $('.js-crop').on('click', crop);

    let loc = maskImg.getBoundingClientRect();
    boundary[0] = loc. left
    boundary[1] = loc.right;
    boundary[2] = loc.top;
    boundary[3] = loc.bottom;
    let parentLoc = maskImg.parentElement.getBoundingClientRect();
    let container = document.getElementsByClassName('resize-container')[0];
    let ploc = pdiv.getBoundingClientRect();

    container.style.zindex = 999;
    container.parentElement.style.position = "absolute";
    container.parentElement.height = maskImg.height + 'px';
    container.parentElement.width = maskImg.width + 'px';
    container.parentElement.style.left = loc.left +'px';
    container.parentElement.style.top =  loc.top - ploc.top +'px';
    
    container.width = maskImg.width + 10;
    container.height = maskImg.height + 10;
    image_target.width = maskImg.width + 10;
    image_target.height = maskImg.height + 10;
    
    //container.style.position = "absolute";
    container.style.left = '0px';
    container.style.top = '0px';
    //image_target.style.position = "absolute";
    image_target.style.left = '0px';
    image_target.style.top = '0px';
    //image_target.height = maskImg.height;

  };
  
  var startResize = function(e){
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', resizing);
    $(document).on('mouseup touchend', endResize);
  };

  var endResize = function(e){
    e.preventDefault();
    $(document).off('mouseup touchend', endResize);
    $(document).off('mousemove touchmove', resizing);
  };

  var saveEventState = function(e){
    // Save the initial event details and container state
    event_state.container_width = $container.width();
    event_state.container_height = $container.height();
    event_state.container_left = $container.offset().left; 
    event_state.container_top = $container.offset().top;
    event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
	
	// This is a fix for mobile safari
	// For some reason it does not allow a direct copy of the touches property
	if(typeof e.originalEvent.touches !== 'undefined'){
		event_state.touches = [];
		$.each(e.originalEvent.touches, function(i, ob){
		  event_state.touches[i] = {};
		  event_state.touches[i].clientX = 0+ob.clientX;
		  event_state.touches[i].clientY = 0+ob.clientY;
		});
	}
    event_state.evnt = e;
  };

  var resizing = function(e){
    
    var mouse={},width,height,left,top,offset=$container.offset();
    mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
    
    // Position image differently depending on the corner dragged and constraints
    if( $(event_state.evnt.target).hasClass('resize-handle-se') ){
      width = mouse.x - event_state.container_left;
      height = mouse.y  - event_state.container_top;
      left = event_state.container_left;
      top = event_state.container_top;
    } else if($(event_state.evnt.target).hasClass('resize-handle-sw') ){
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = mouse.y  - event_state.container_top;
      left = mouse.x;
      top = event_state.container_top;
    } else if($(event_state.evnt.target).hasClass('resize-handle-nw') ){
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = mouse.x;
      top = mouse.y;
      if(constrain || e.shiftKey){
        top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
      }
    } else if($(event_state.evnt.target).hasClass('resize-handle-ne') ){
      width = mouse.x - event_state.container_left;
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = event_state.container_left;
      top = mouse.y;
      if(constrain || e.shiftKey){
        top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
      }
    }
	
    // Optionally maintain aspect ratio
    if(constrain || e.shiftKey){
      height = width / orig_src.width * orig_src.height;
    }

    if(
        width > min_width && height > min_height 
        && width < max_width && height < max_height
        && mouse.y > boundary[2] && mouse.x > boundary[0]
        && mouse.y < boundary[3] && mouse.x < boundary[1]
      ){
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);  
      // Without this Firefox will not re-calculate the the image dimensions until drag end
      $container.offset({'left': left, 'top': top});
    }
  }

  var resizeImage = function(width, height){
    console.log('resizeImage')
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);   
    $(image_target).attr('src', resize_canvas.toDataURL("image/png"));

    let container = document.getElementsByClassName('resize-container')[0];
    container.width = width;
    container.height = height;
    image_target.width = width;
    image_target.height = height;
  };

  var startMoving = function(e){
    console.log('StartMoving')
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', moving);
    $(document).on('mouseup touchend', endMoving);
  };

  var endMoving = function(e){
    console.log('endMoving')
    e.preventDefault();
    $(document).off('mouseup touchend', endMoving);
    $(document).off('mousemove touchmove', moving);
  };

  var moving = function(e){
    console.log('moving')
    var  mouse={}, touches;
    e.preventDefault();
    e.stopPropagation();
    
    touches = e.originalEvent.touches;
    
    mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
    
    //console.log('maskImg.height ', maskImg.offsetHeight)
    //console.log('maskImg.width ', maskImg.offsetWidth)

    let xamount = mouse.x - ( event_state.mouse_x - event_state.container_left )
    let yamount = mouse.y - ( event_state.mouse_y - event_state.container_top )

    let container = document.getElementsByClassName('resize-container')[0];
    
    if( 
      mouse.x - (container.width/2) > boundary[0] && mouse.x + container.width/2 < boundary[1] 
      && mouse.y - container.height/2 > boundary[2] && mouse.y + container.height/2 < boundary[3]
      ){
    

    /*if(Math.abs(yamount) >= boundary[2] || Math.abs(yamount) <= boundary[3] ){
      yamount = event_state.container_top
      console.log("y Boundary hit")
    }*/
    
      $container.offset({
        'left': xamount,
        'top': yamount 
      });
    }
    // Watch for pinch zoom gesture while moving
    /*if(event_state.touches && event_state.touches.length > 1 && touches.length > 1){
      var width = event_state.container_width, height = event_state.container_height;
      var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      a = a * a; 
      var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
      b = b * b; 
      var dist1 = Math.sqrt( a + b );
      
      a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      a = a * a; 
      b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      b = b * b; 
      var dist2 = Math.sqrt( a + b );

      var ratio = dist2 /dist1;

      width = width * ratio;
      height = height * ratio;
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);
    }*/
  };

  var crop = function(){
    //Find the part of the image that is inside the crop box
    var crop_canvas,
        left = $('.overlay').offset().left - $container.offset().left,
        top =  $('.overlay').offset().top - $container.offset().top,
        width = $('.overlay').width(),
        height = $('.overlay').height();
		
    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;
    
    crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
    window.open(crop_canvas.toDataURL("image/png"));
  }

  init();
};