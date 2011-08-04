var fs = require('fs');

function get_json( data ) {

	var date = get_date();
  	
	try {
		var stats = fs.statSync( process.env['APP_DIR'] +'/data/'+date+'.json');
		// check the date of the json file
		var modified=new Date( stats.mtime );
	} catch (e) {
		var modified=new Date( "September 30, 1978 11:00:00" );
	}
	
	var now = new Date();
	var seconds =  Math.round( (now-modified) / 1000);
	
	// update every minute
	if (seconds > 60){
		// create an new json file
		console.log("created json");
		return create_json( data );
	} else {
		// use the cached one;
		console.log("used cache");
		return read_file( date );
	}

}

function create_json( data ) {

  var date = get_date();
  
  var dailyData = new Array();
  
  // JSON.stringify(data)
  for (i in data){
	  var coords = i.split(",");
	  var size = get_size( data[i] );
	  var color = get_color( data[i] );
	 dailyData.push( parseFloat(coords[0]), parseFloat(coords[1]), size, color );
  }
  
  // finalize output
  var json = '[["'+ date +'", ['+ dailyData.join(",") +']]]';
  // write the new json
  write_file( json );
  
  return json;
}


function get_date() {
	
  // get current date
  var today = new Date()
  var month = today.getMonth() + 1
  var day = today.getDate()
  var year = today.getFullYear()
  
  return year +"-"+ month +"-"+ day;
  
}

function get_size( data ){	
	// local variables
	var sample = parseInt(data['sample']);
	var meter = parseInt(data['meter']);
	// only define a size if we have a sample of 10 tweets or more
	if( sample < 10 ) return "0";
	// find the size as a percentage 
	var size = Math.abs( meter / sample );
	return size;
}

function get_color( data ){	
	// local variables
	var meter = parseInt(data['meter']);
	
	if( meter > 0 ) { 
		return "2";
	} else if ( meter < 0 )    {
		return "1";
	} else  {
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
			if( str.search("[\\:\\-\\;][\\)D]") != -1) { 
				//console.log( "happy? " + str );
				data[coords]['meter'] = parseInt(data[coords]['meter']) + 1;
			} else if( str.search("[\\:\\-\\;][\\(]") != -1 ) { 
				//console.log( "sad? " + str );
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

function read_file( date ){
	var data = fs.readFileSync( process.env['APP_DIR'] +'/data/'+date+'.json');
	return data;
}

function write_file( json ){
	var date = get_date();
 	var file = process.env['APP_DIR'] +'/data/'+date+'.json';
	/*
	fs.open(file, "w", 0666, function(err, fd) {
		if (err) throw err;
		fs.write(fd, json, 0, "utf8", function(err, written) {
			if (err) throw err;
			fs.closeSync(fd);
		});
	});
*/

	fs.writeFile( file, json, function (err) {
		if (err) throw err;
		console.log('JSON saved!');
	});
	/*
	// setup the permisions for later read/write
	fs.chmod( process.env['APP_DIR'] +'/data/'+date+'.json', 0777, function(err) {
		if (err) throw err;
	});
*/
}

function check_dir(){
	// where are we creating the archive
	var dir = process.env['APP_DIR'] +'/data/';

		fs.mkdir(dir, 0777, function(err) {
			if (err){
				fs.chmod(dir, 0777, function(err) {
					if (err) throw err;
					console.log("data folder with right permissions");
				});	
			} else {
				console.log("created the data directory");
			}
		});	
	
}

exports.check_dir = check_dir;
exports.get_date = get_date;
exports.get_json = get_json;
exports.update_data = update_data;