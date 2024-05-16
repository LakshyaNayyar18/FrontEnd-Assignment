import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import 'bootstrap/dist/css/bootstrap.css';

const CropImagePage = () => {
  const location = useLocation();
  const src = location.state.src;
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [assetName, setAssetName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);

  const handleAssetNameChange = (e) => {
    setAssetName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTagsChange = (e) => {
    const newTags = e.target.value.split(',').map(tag => tag.trim());
    setTags(newTags);
  };

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleImageLoaded = (image) => {
    imageRef.current = image;
  };

  const handleImageCrop = () => {
    if (imageRef.current && crop.width && crop.height) {
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        imageRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      setCroppedImage(croppedImageUrl);
    }
  };

  const handleRotate = (degrees) => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imageRef.current.naturalHeight;
    canvas.height = imageRef.current.naturalWidth;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(degrees * (Math.PI / 180));
    ctx.drawImage(imageRef.current, -imageRef.current.width / 2, -imageRef.current.height / 2);

    const rotatedImageUrl = canvas.toDataURL('image/jpeg');
    imageRef.current.src = rotatedImageUrl;
    setCrop({ aspect: 1 });
    setCroppedImage(null);
  };

  const handleHorizontalFlip = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    const flippedImageUrl = canvas.toDataURL('image/jpeg');
    imageRef.current.src = flippedImageUrl;
    setCrop({ aspect: 1 });
    setCroppedImage(null);
  };

  const handleVerticalFlip = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;

    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    const flippedImageUrl = canvas.toDataURL('image/jpeg');
    imageRef.current.src = flippedImageUrl;
    setCrop({ aspect: 1 });
    setCroppedImage(null);
  };

  const handleReplaceImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        imageRef.current.src = reader.result;
        setCrop({ aspect: 1 });
        setCroppedImage(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleSave = () => {
    const savedImageData = {
      assetName,
      description,
      tags,
      croppedImage,
    };
  
    navigate('/view-image', {
      state: { savedImageData }
    });
};
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3 d-flex flex-column">
          <div className="btn-group-vertical">
            <button className="btn btn-secondary mb-2" onClick={handleImageCrop}>Crop Image</button>
            <button className="btn btn-secondary mb-2" onClick={() => handleRotate(90)}>Rotate 90°</button>
            <button className="btn btn-secondary mb-2" onClick={() => handleHorizontalFlip()}>Horizontal Flip</button>
            <button className="btn btn-secondary mb-2" onClick={() => handleVerticalFlip()}>Vertical Flip</button>
          </div>
          <button className="btn btn-secondary mt-auto mb-2" onClick={handleReplaceImage}>Replace Image</button>
          <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
          <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>Go Back</button>
        </div>
        <div className="col-md-6">
          <img src={src} alt="Preview" className="img-fluid mb-3" ref={imageRef} />
          <ReactCrop
            src={src}
            crop={crop}
            onChange={handleCropChange}
            onImageLoaded={handleImageLoaded}
          />
          {croppedImage && <img src={croppedImage} alt="Cropped" className="img-fluid mb-3" />}
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="assetName">Asset Name</label>
            <input type="text" className="form-control" id="assetName" value={assetName} onChange={handleAssetNameChange} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" rows="3" value={description} onChange={handleDescriptionChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input type="text" className="form-control" id="tags" value={tags.join(', ')} onChange={handleTagsChange} />
          </div>
          <div className="col-md-3 d-flex flex-column">
            <button className="btn btn-primary mt-2" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropImagePage;



