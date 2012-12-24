var fs = require('fs'), 
	path = require('path'), 
	AWSNode = require(__dirname + '/node-aws/lib/aws.js'), 
	config = require( path.join(__dirname, '../config/app.js' ) );
	
	
var Data = function(){
		
	// setup the vars
	this.data = new Array();
	this.today = new Date();
	
	return this;
	
}

Data.prototype = {
	
	update : function( tweet ){
		
		// we have no use for tweets with no coordinates attached to them
		if(tweet.coordinates == null) return;
		
		var data = this.data;
		// reset the data every day
		var now = new Date();
		if( now.getDate() != this.today.getDate() ) reset();
		
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
		
		// update class var
		this.data = data;
		
	}, 
	
	reset : function(){
		
		// construct a json out of the data and save
		this.store( format( today ), this.json() );
		
		// reset the globals
		this.data = new Array();
		this.today = new Date();
		
	}, 
	
	json : function() {
	
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
		
	  var date = format( this.today );
	  var data = this.data;
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
	}, 
	
	store : function( date, json ){
		
		var file = config.aws.path+date+'.json';
	
		// Initialiaze AWS 
		
		var aws = AWSNode.createClient({
		  accessKeyId: config.aws.key,
		  secretAccessKey: config.aws.secret,
		});
	
		aws.request('s3', 'putObject', {
		  bucket: config.aws.bucket,
		  key: file,
		  region: "us-west-1",
		  acl: "public-read",
		  content: json,
		  contentType: "text/plain"
		}, function(response) {
			//console.log(response);
		});
		
	}
	
};


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

/* Deprecated 
function read_file( date ){
	// Local filesystem version...
	//var data = fs.readFileSync( process.env['APP_DIR'] +'/data/'+date+'.json');
	return data;
}
*/


var data = new Data();

module.exports = data;
