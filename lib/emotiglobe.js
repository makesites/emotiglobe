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
	 dailyData.push( parseFloat(coords[0]), parseFloat(coords[1]), data[i] );
  }
  
  // finalize output
  return '[["'+ date +'", ['+ dailyData.join(",") +']]]';
}

function update_data( tweet, data ){
	
	var str = tweet.text;
	if(tweet.coordinates != null){
		var lat = Math.round(tweet.coordinates.coordinates[1]);
		var lng = Math.round(tweet.coordinates.coordinates[0]);
	}
	if( lat != null && lng != null && (parseFloat(lat) != 0 && parseFloat(lng) != 0) ) {
		var coords = lat+','+lng;
		if( str.search("happy") ) { 
			if( coords in data ){ 
				data[coords] = parseFloat(data[coords]) + 0.0001;
			} else {
				data[coords] = 0;
			}
		} else if( str.search("sad") ) { 
			if( coords in data ){ 
				data[coords] =  parseFloat(data[coords]) - 0.0001;
			} else {
				data[coords] = 0;
			}
		}
	}
	
	return data;
	
}

exports.get_date = get_date;
exports.create_json = create_json;
exports.update_data = update_data;