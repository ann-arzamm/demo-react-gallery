import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

// react grabs it from an external .env file with an access key
const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  // an array of images from the API
  const [images, setImages] = useState([]);
  // current page number for a new images fetching
  const [page, setPage] = useState(1);
  // search query
  const [query, setQuery] = useState('');

  // fetching process here
  // useCallback is needed to inform react that this function
  // does not change any component (useEffect dependency)
  const getPhotos = useCallback(() => {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;

    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;

    // page numbers are important for the unsplash API to send a new set of images
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        // check if it's a search results or not and take that data
        const imagesFromApi = data.results ? data.results : data;
        // if page is 1 → new array of images
        if (page === 1) setImages(imagesFromApi);
        // if page > 1 → append new
        setImages((images) => [...images, ...imagesFromApi]);
      })
  }, [page, query]);

  // fetch new images when the page number changes
  useEffect(() => {
    getPhotos();
  }, [page]);

    // search
    function searchPhotos(e) {
      e.preventDefault();
      setPage(1);
      getPhotos();
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

      {/* search photos form */}
      <form onSubmit={searchPhotos}>
        <input
          type="text"
          placeholder="Search Unsplash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
                src={image.urls.small}
                alt={image.alt_description}
              />
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
