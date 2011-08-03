function get_date() {
	
  // get current date
  var today = new Date()
  var month = today.getMonth() + 1
  var day = today.getDate()
  var year = today.getFullYear()
  
  return day +"-"+ month +"-"+ year;
  
}

function create_json( data ) {

  var date = get_date();
  
  var dailyData = new Array();
  
  // JSON.stringify(data)
  for (i in data){
	  var coords = i.split(",");
	  var size = getSize( data[i] );
	  var color = getColor( data[i] );
	 dailyData.push( parseFloat(coords[0]), parseFloat(coords[1]), size, color );
  }
  
  // finalize output
  return '[["'+ date +'", ['+ dailyData.join(",") +']]]';
}

function getSize( data ){	
	// local variables
	var sample = parseInt(data['sample']);
	var meter = parseInt(data['meter']);
	// only define a size if we have a sample of 10 tweets or more
	if( sample < 10 ) return "0";
	// find the size as a percentage 
	var size = Math.abs( meter / sample ) *0.001;
	return size;
}

function getColor( data ){	
	// local variables
	var meter = parseInt(data['meter']);
	
	if( meter > 0 ) { 
		return "1";
	} else {
		return "0";
	}
	
}

function update_data( tweet, data ){
	
	var str = tweet.text;
	if(tweet.coordinates != null){
		var lat = Math.round(tweet.coordinates.coordinates[1]);
		var lng = Math.round(tweet.coordinates.coordinates[0]);
	}
	if( lat != null && lng != null && (parseFloat(lat) != 0 && parseFloat(lng) != 0) ) {
		var coords = lat+','+lng;
		if( coords in data ){ 
			data[coords]['sample'] = parseInt(data[coords]['sample']) + 1;
			if( str.search("happy") ) { 
				data[coords]['meter'] = parseInt(data[coords]['meter']) + 1;
			} else if( str.search("sad") ) { 
				data[coords]['meter'] =  parseInt(data[coords]['meter']) - 1;
			}
		} else {
			data[coords] = new Array();
			data[coords]['sample'] = 0;
			data[coords]['meter'] = 0;
		}
	}
	
	return data;
	
}

exports.get_date = get_date;
exports.create_json = create_json;
exports.update_data = update_data;