var fs = require('fs'), 
	//AWSNode = require(__dirname + '/node-aws/lib/aws.js'), 
	config = require('../config/app.js'),
	data, today;
	
// initialize
reset();


function update( tweet ){
	
	// we have no use for tweets with no coordinates attached to them
	if(tweet.coordinates == null) return;
	
	// reset the data every day
	var now = new Date();
	if( now.getDate() != today.getDate() ) reset();
	
	var lat = Math.round(tweet.coordinates.coordinates[1]);
	var lng = Math.round(tweet.coordinates.coordinates[0]);
	var str = tweet.text;
	
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
	
	//return data;
	
}

function reset(){
	
	// setup the globals
	data = new Array();
	today = new Date();
	
	// construct a json out of the data
	//var day = json();
	// save the json
	//write_file( day );
	
	// return an empty object
	return data;

}

function json() {

	/* Deprecated
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
	*/
	
  var date = format( today );
  
  var daily = new Array();
  
  // JSON.stringify(data)
  for (i in data){
	  var coords = i.split(",");
	  var this_size = size( data[i] );
	  var this_color = color( data[i] );
	 daily.push( parseFloat(coords[0]), parseFloat(coords[1]), this_size, this_color );
  }
  
  // finalize output
  var json = '[["'+ date +'", ['+ daily.join(",") +']]]';
  
  return json;
}

// Helpers
function format( date ) {
	
	// get current date
	var month = date.getMonth() + 1,
		day = date.getDate(),
		year = date.getFullYear();

	return year +"-"+ month +"-"+ day;
  
}

function size( data ){	
	// local variables
	var sample = parseInt(data['sample']);
	var meter = parseInt(data['meter']);
	// only define a size if we have a sample of 10 tweets or more
	if( sample < 10 ) return "0";
	// find the size as a percentage 
	var size = Math.abs( meter / sample );
	return size;
}

function color( data ){	
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

function read_file( date ){
	// Local filesystem version...
	//var data = fs.readFileSync( process.env['APP_DIR'] +'/data/'+date+'.json');
	return data;
}

function write_file( date, json ){

	var file = config.aws_path+date+'.json';

	// Initialiaze AWS 
	/*
	var aws = AWSNode.createClient({
	  accessKeyId: config.aws_key,
	  secretAccessKey: config.aws_secret,
	});

	aws.request('s3', 'putObject', {
	  bucket: config.aws_bucket,
	  key: file,
	  region: "us-west-1",
	  acl: "public-read",
	  content: json,
	  contentType: "text/plain"
	}, function(response) {
	  if (response instanceof Error) {
		// uh oh
		console.log(response.code, response.message);
	  } else {
		// it worked!
	  }
	});
	*/
	
 	/* Local filesystem version...
	var file = process.env['APP_DIR'] +'/data/'+date+'.json';

	fs.open(file, "w", 0666, function(err, fd) {
		if (err) throw err;
		fs.write(fd, json, 0, "utf8", function(err, written) {
			if (err) throw err;
			fs.closeSync(fd);
		});
	});
	// alternate method
	fs.writeFile( file, json, function (err) {
		if (err) throw err;
		console.log('JSON saved!');
	});

	// setup the permisions for later read/write
	fs.chmod( process.env['APP_DIR'] +'/data/'+date+'.json', 0777, function(err) {
		if (err) throw err;
	});
	*/
}

function check_dir(){
	// where are we creating the archive
	var dir = process.env['APP_DIR'] +'/data/';

	fs.chmod(dir, 0755, function(err) {
		if (err){
			console.log("error setting up data folder");
		} else {
			console.log("data folder with right permissions");
		}
	});	
	
}

//exports.check_dir = check_dir;
//exports.date = date;
exports.json = json;
exports.update = update;
//exports.reset = reset;