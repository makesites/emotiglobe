module.exports = config = {
  "name" : "Emotiglobe",

  "port" : 10000,

  "data" : {
	  "track" : [":&#41;", ":&#42;"],
	  "locations" : [-180, -90, 180, 90]
  }, 
  
  "twitter" : {
	  "key" : "",
	  "secret" : "",
	  "token_key" : "",
	  "token_secret" : ""
  }, 
  
  "aws" : {
	  "key" : "",
	  "secret" : "",
	  "bucket" : "s3bucketname",
	  "path" : "/emotiglobe/",
	  "region" : "us-west-1",
	  "acl" : "public-read"
  }
  
}
