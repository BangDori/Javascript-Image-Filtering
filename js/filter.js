// canvas 객체 생성
var canvas = $('#original')[0];
var ctx = canvas.getContext('2d');

// click Load Image Button
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
  fileReader.readAsDataURL(file);
});

// Original Image and Filtered Image Draw
function drawImageData(image) {
  image.height *= canvas.offsetWidth / image.width;
  image.width = canvas.offsetWidth;
  if(image.height > canvas.offsetHeight){
    image.width *= canvas.offsetHeight / image.height;
    image.height = canvas.offsetHeight;
  }

  ctx.drawImage(image, 0, 0, image.width, image.height);

  mean3();
  mean5();
  median3();
  median5();
  laplacian();
}

// Mean filter 3 * 3
const mean3 = function () {
  var canvas_mean3 = $('#mean3')[0];
  var mean3_ctx = canvas_mean3.getContext('2d');

  var pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
  var filteredData = mean3_filtering(pixels, );

  mean3_ctx.putImageData(filteredData, 0 , 0);
}

const mean3_filtering = function (pixels) {
  const k = 1 / 9
  const operator = [k, k, k, k, k, k, k, k, k]

  return convolution(pixels, operator)
}

// Mean filter 5 * 5
const mean5 = function () {
  var canvas_mean5 = $('#mean5')[0];
  var mean5_ctx = canvas_mean5.getContext('2d');

  var pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
  var filteredData = mean5_filtering(pixels, );

  mean5_ctx.putImageData(filteredData, 0 , 0);
}

const mean5_filtering = function (pixels) {
  const k = 1 / 25
  const operator = [k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k]

  return convolution(pixels, operator)
}

// Median filter 3 * 3
const median3 = function () {
  var canvas_median3 = $('#laplacian')[0];
  var median3_ctx = canvas_median3.getContext('2d');

  var pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
  var filteredData = median3_filtering();

  // median3_ctx.putImageData(filteredData, 0 , 0);
}

const median3_filtering = function() {
  let src = cv.imread('original');
  let dst = new cv.Mat();

  cv.medianBlur(src, dst, 3);
  cv.imshow('median3', dst);
  src.delete(); dst.delete();
}

// Median filter 5 * 5
const median5 = function () {
  var canvas_median5 = $('#laplacian')[0];
  var median5_ctx = canvas_median5.getContext('2d');

  var pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
  var filteredData = median5_filtering();

  // median5_ctx.putImageData(filteredData, 0 , 0);
}

const median5_filtering = function() {
  let src = cv.imread('original');
  let dst = new cv.Mat();

  cv.medianBlur(src, dst, 5);
  cv.imshow('median5', dst);
  src.delete(); dst.delete();
};

// Laplacian filter
const laplacian = function () {
  var canvas_laplacian = $('#laplacian')[0];
  var laplacian_ctx = canvas_laplacian.getContext('2d');

  var pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
  var filteredData = laplacian_filtering(pixels, );

  laplacian_ctx.putImageData(filteredData, 0 , 0);
}

const laplacian_filtering = function (pixels) {
  const operator = [0, -1, 0, -1, 4, -1, 0, -1, 0]

  return convolution(pixels, operator)
}

// Convolution
const convolution = function (pixels, kernel) {
  let side = Math.round(Math.sqrt(kernel.length))
  let halfSide = Math.floor(side / 2)
  let src = pixels.data
  let canvasWidth = pixels.width
  let canvasHeight = pixels.height
  let temporaryCanvas = document.createElement('canvas')
  let temporaryCtx = temporaryCanvas.getContext('2d')
  let outputData = temporaryCtx.createImageData(canvasWidth, canvasHeight)

  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      let dstOff = (y * canvasWidth + x) * 4,
        sumReds = 0,
        sumGreens = 0,
        sumBlues = 0

      for (let kernelY = 0; kernelY < side; kernelY++) {
        for (let kernelX = 0; kernelX < side; kernelX++) {
          let currentKernelY = y + kernelY - halfSide,
            currentKernelX = x + kernelX - halfSide

          if (
            currentKernelY >= 0 &&
            currentKernelY < canvasHeight &&
            currentKernelX >= 0 &&
            currentKernelX < canvasWidth
          ) {
            let offset = (currentKernelY * canvasWidth + currentKernelX) * 4,
              weight = kernel[kernelY * side + kernelX]

            sumReds += src[offset] * weight
            sumGreens += src[offset + 1] * weight
            sumBlues += src[offset + 2] * weight
          }
        }
      }

      outputData.data[dstOff] = sumReds
      outputData.data[dstOff + 1] = sumGreens
      outputData.data[dstOff + 2] = sumBlues
      outputData.data[dstOff + 3] = 255
    }
  }
  return outputData
}
