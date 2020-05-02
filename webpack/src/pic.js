import animal from './animal.jpg'
console.log(animal); // animal是对图片的一个新的引用，而不是图片本身
let image = new Image();
// image.src = './animal.jpg'; // 不能直接写相对路径，打包后这个文件并不会copy过去，路径将失效
image.src = animal; // import的方式 
document.body.appendChild(image);