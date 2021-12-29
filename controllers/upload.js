const path = require('path');
const fileSystem = require('fs');
const {response} = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const {uploadFile} = require('../helpers/common');
const {User, Product} = require('../models');

const loadFile = async(req, res = response) => {  
    try {  
      const name = await uploadFile(req.files, undefined, 'images');
  
      res.json({
        name
      });
    } catch (error) {
      res.status(400).json({
        error
      });
    }
}

// const updateImage = async(req, res = response) => {
//   try {
//     const {id, collection} = req.params;

//     let model;
//     switch (collection) {
//       case 'users':
//           model = await User.findById(id);
//           if(!model){
//             return res.status(400).json({
//               message: `The user with id ${id} does not exist`
//             });
//           }
//         break; 
//       case 'products':
//         model = await Product.findById(id);
//         if(!model){
//           return res.status(400).json({
//             message: `The product with id ${id} does not exist`
//           });
//         }
//         break;
//       default:
//         return res.status(500).json({
//           message: 'There was a problem updating the image'
//         });
//     }

//     if(model.image){
//       const imagePath = path.join(__dirname, '../uploads', collection, model.image);
//       if(fileSystem.existsSync(imagePath)){
//         fileSystem.unlinkSync(imagePath);
//       }
//     }
  
//     model.image = await uploadFile(req.files, undefined, collection);
  
//     await model.save();
//     res.json(model);
//   } catch (error) {
//     res.status(400).json({
//       error
//     });
//   }
// }

const updateCloudinaryImage = async(req, res = response) => {
  try {
    const {id, collection} = req.params;

    let model;
    switch (collection) {
      case 'users':
          model = await User.findById(id);
          if(!model){
            return res.status(400).json({
              message: `The user with id ${id} does not exist`
            });
          }
        break; 
      case 'products':
        model = await Product.findById(id);
        if(!model){
          return res.status(400).json({
            message: `The product with id ${id} does not exist`
          });
        }
        break;
      default:
        return res.status(500).json({
          message: 'There was a problem updating the image'
        });
    }

    if(model.image){
      const nameArray = model.image.split('/');
      const [public_id] = nameArray[nameArray.length - 1].split('.');
      
      cloudinary.uploader.destroy(public_id);
    }

    const{tempFilePath} = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    model.image = secure_url;

    await model.save();

    res.json(model);
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

const showImage = async(req, res = response) => {
  try {
    const {id, collection} = req.params;

    let model;
    switch (collection) {
      case 'users':
          model = await User.findById(id);
          if(!model){
            return res.status(400).json({
              message: `The user with id ${id} does not exist`
            });
          }
        break; 
      case 'products':
        model = await Product.findById(id);
        if(!model){
          return res.status(400).json({
            message: `The product with id ${id} does not exist`
          });
        }
        break;
      default:
        return res.status(500).json({
          message: 'There was a problem updating the image'
        });
    }

    if(model.image){
      const imagePath = path.join(__dirname, '../uploads', collection, model.image);
      if(fileSystem.existsSync(imagePath)){
        return res.sendFile(imagePath);
      }
    }

    const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(noImagePath);
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

module.exports = {
    loadFile,
    // updateImage,
    showImage,
    updateCloudinaryImage
}