// canvas 객체 생성
var canvas = $('#canvas')[0];var ctx = canvas.getContext('2d');

function drawImageData(image) {
  image.height *= canvas.offsetWidth / image.width;
  image.width = canvas.offsetWidth;
  if(image.height > canvas.offsetHeight){
    image.width *= canvas.offsetHeight / image.height;
    image.height = canvas.offsetHeight;
  }

  ctx.drawImage(image, 0, 0, image.width, image.height);
  console.log(ctx.getImageData(0,0, canvas.width, canvas.height));
}

// click input button
$('#loadButton').on('change', function (e) {
  var file = e.target.files[0];
  var fileReader = new FileReader();
  fileReader.onload = function (e) {
    var image = new Image();
    image.src = e.target.result;
    image.onload = function () {
      drawImageData(image);
    }
  };
  fileReader.readAsDataURL(file);}
);

$('#filterButton').on('click', function () {
  // imageData를 가져온다.
  var pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
  // image processing
  var filteredData = invertFilter(pixels);
  // Canvas에 다시 그린다.
  ctx.putImageData(filteredData, 0 , 0);}
);

// Filters
function invertFilter(pixels) {
  var d = pixels.data;
  for(var i=0; i<pixels.data.length; i+=4){
    d[i] = 255 - d[i];     // R
    d[i+1] = 255 - d[i+1]; // G
    d[i+2] = 255 - d[i+2]; // B
    d[i+3] = 255;          // Alpha
  }
  return pixels;
}

function handleFiles(file) {
  console.log(file[0])
  console.log(file[0].name);

  document.querySelector("#original_image").src = `./${file[0].name}`;

  document.querySelector("#mean_image").src = `./${file[0].name}`;
  document.querySelector("#median_image").src = `./${file[0].name}`;
  document.querySelector("#laplacian_image").src = `./${file[0].name}`;
}
