import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './DefaultImageGallery.css';

//pass in an array of objects containing AT LEAST an ID, title and URL
//Optionally pass in the user's last search terms. If search terms are supplied, they will show up in the gallery header
const DefaultImageGallery = (props) => 
{
  let numPosTerms = props.searchArr.inc.length;
  let numNegTerms = props.searchArr.exc.length;
  let numOfSearchTerms = props.searchArr.inc.length + props.searchArr.exc.length;
  let searchTermsStr = //build a string of search terms for display above the gallery
    (numPosTerms > 0 ? props.searchArr.inc.join(' +').replace(/[_]/g, ' ') : 'everything') +
    (numNegTerms > 0 ? ' -' + props.searchArr.exc.join(' -').replace(/[_]/g, ' ') : '')
  
  return (
    <div className="gallery-container">
      <div className="gallery-title">
        {(numOfSearchTerms > 0 && props.viewingSearchResults) ?
          <p>Search Results for "{searchTermsStr}"</p> 
          :<p>Image Gallery</p>}
      </div>
      <div className="image-gallery">
        {props.picData.length > 0 ? //PicData changes based on whether the user is viewing search results or not
          //picData is populated
          props.picData.map((e) => 
          {
            return (
              <div key={e.pid} id={e.pid} >
                <Link to={`/pic/${e.pid}`} style={{ textDecoration: 'none' }}>
                  {/* assign url to each card, but insert a '-small' after the filename */}
                  <img className="single-image" src={e.url.replace(/(\?alt)/,'-small?alt')} alt={e.title}/>
                </Link>
              </div>
            )
          })
          //picData is an empty array
          : props.viewingSearchResults ? // If user has just searched for something, then picData is coming from state.searchResults
            <h4>Oops! Your search results came up empty! Try checking your spelling or removing some restrictions</h4>
          : <h3>There doesn't seem to be anything in this gallery. Try uploading some pictures!</h3> //should only show up if the gallery is barren of images
        }
      </div>
    </div>
  );
}

export default DefaultImageGallery;