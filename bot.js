console.log('The bot is starting');

var Twit = require('twit');

var fs = require('fs');
var path = require('path');
var config = require('./config');
var T = new Twit(config);

function selectImage(images){
	return images[Math.floor(Math.random() * images.length)];
}

fs.readdir(__dirname + '/images', function(err, files) {
  if (err){
    console.log(err);
  }
  else{
    var images = [];
    files.forEach(function(f) {
      images.push(f);
    });

    setInterval(function(){
      uploadImage(images);
    }, 1000 * 43200);
  }
});

function uploadImage(images){
  console.log('Opening an image...');
  var image_path = path.join(__dirname, '/images/' + selectImage(images)),
      b64content = fs.readFileSync(image_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
}