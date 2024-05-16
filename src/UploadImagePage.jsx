import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const UploadImagePage = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        navigate('/crop-image', { state: { src: reader.result } });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Upload Image</h5>
              <input type="file" className="form-control mb-3" accept="image/*" onChange={handleFileChange} />
              {image && <img src={image} className="img-fluid" alt="Uploaded" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImagePage;


