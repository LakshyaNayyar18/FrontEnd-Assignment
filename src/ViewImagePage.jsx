import  { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewImagePage = ({ savedImages }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerms, setSearchTerms] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAdd = () => {
    if (searchTerm.trim() !== '') {
      setSearchTerms([...searchTerms, searchTerm]);
      setSearchTerm('');
    }
  };

  const filteredImages = savedImages ? savedImages.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="container mt-4">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search term"
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
      <div>
        <h3>Search Terms:</h3>
        <ul className="list-group">
          {searchTerms.map((term, index) => (
            <li key={index} className="list-group-item">
              {term}
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <h3>Saved Images:</h3>
      <div className="row">
        {filteredImages.map((image, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="card">
              <img
                src={image.url}
                className="card-img-top"
                alt={image.name}
              />
              <div className="card-body">
                <h5 className="card-title">{image.name}</h5>
                <p className="card-text">Tags: {image.tags.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ViewImagePage.propTypes = {
  savedImages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

export default ViewImagePage;


