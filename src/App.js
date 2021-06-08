import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

// react grabs it from an external .env file with an access key
const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  // an array of images from the API
  const [images, setImages] = useState([]);
  // current page number for a new images fetching
  const [page, setPage] = useState(1);

  // fetch new images when the page number changes
  useEffect(() => {
    getPhotos();
  }, [page]);

  // fetching process here
  function getPhotos() {
    // page numbers are important for the unsplash API to send a new set of images
    fetch(`https://api.unsplash.com/photos/?client_id=${accessKey}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        // append new images
        setImages(images => [...images, ...data])
      });
  }

  // return an error if there is no access key
  if (!accessKey) {
    return (
      <a href="https://unsplash.com/developers"
      className="error"
      >
        Required: Get Your Unsplash API Key First
      </a>
    )
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form>
        <input type="text" placeholder="Search Unsplash..." />
        <button>Search</button>
      </form>

      {/* imported component for an infinite scroll */}
      <InfiniteScroll
        // an array of images
        dataLength={images.length}
        // update a page number each scroll to fetch new data through useEffect
        next={() => setPage(page => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        {/* to display images */}
        <div className="image-grid">
          {images.map((image, index) => (
            <a
              className="image"
              key={index}
              href={image.links.html}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={image.urls.regular}
                alt={image.alt_description}
              />
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
