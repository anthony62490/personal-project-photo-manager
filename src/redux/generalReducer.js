import axios from 'axios';

//CONSTANTS
const SEND_PIC_TO_DB = 'SEND_PIC_TO_DB';
const GET_ALL_PICS = 'GET_ALL_PICS';
const CLEAR_PREV_UPLOAD_DATA = 'CLEAR_PREV_UPLOAD_DATA';
const GET_PICTURE_BY_ID = 'GET_PICTURE_BY_ID';
const SEND_SEARCH_TERMS = "SEND_SEARCH_TERMS";

//consider moving this to an EditDB reducer to keep things clean
const EDIT_PIC_TITLE = "EDIT_PIC_TITLE";
const EDIT_PIC_TAGS = "EDIT_PIC_TAGS";

// INITIAL APP STATE
const initialState = {
  picsDataObj: [], //holds data returned from the photos table. Currently only for the entire database.
  userNewUploads: [], //Same as before, but specifically for holding the user's newest uploads
  lastSearch: ''
};

//REDUCER
export default function generalReducer(state = initialState, action)
{
  switch(action.type)
  {
    //Sends a URL to the database and recieves an object containing picture details
    case `${SEND_PIC_TO_DB}_FULFILLED`:
      let newPicData = action.payload.data[0]
      console.log("newPicData", newPicData);
      return {
        ...state,
        //Add new picture data to state
        userNewUploads: [
          ...state.userNewUploads, newPicData
        ]
      };
    case `${SEND_PIC_TO_DB}_REJECTED`:
      console.log('Error - SEND_PIC_TO_DB_REJECTED');
      break;
    case `${GET_ALL_PICS}_FULFILLED`:
      //Gets contents of database row and adds it to the picData object. This should overwrite any existing contents
      console.log(action.payload.data)
      return {
        ...state,
        picsDataObj: action.payload.data
      };
    case `${GET_ALL_PICS}_REJECTED`:
      console.log('Error - GET_ALL_PICS_REJECTED');
      break;
    case CLEAR_PREV_UPLOAD_DATA: //When the user uploads a new batch of pictures, clear out the data of the previous batch before uploading
      return {
        ...state,
        userNewUploads: []
      };
    case `${GET_PICTURE_BY_ID}_FULFILLED`: 
      //unused as of 180910
      return {
        ...state,
        picsDataObj:action.payload.data
      };
    case `${GET_PICTURE_BY_ID}_REJECTED`:
      console.log('Error - GET_PICTURE_BY_ID_REJECTED');
      break;
    case `${SEND_SEARCH_TERMS}_FULFILLED`:
      return {
        ...state,
        picsDataObj: action.payload.data
      };
    case `${SEND_SEARCH_TERMS}_REJECTED`:
      console.log('Error - SEND_SEARCH_TERMS_REJECTED');
      break;
    //Consider moving these to another reducer
    case `${EDIT_PIC_TITLE}_FULFILLED`:
    //This doesn't change state. It just polls the db
      console.log("Title changed successfully");
      return {
        ...state
      };
    case `${EDIT_PIC_TITLE}_REJECTED`:
      console.log("Error - EDIT_PIC_TITLE_REJECTED");
      return {
        ...state
      };
    case `${EDIT_PIC_TAGS}_FULFILLED`:
    console.log("Tags updated successfully");
      return {
        ...state
      }
    case `${EDIT_PIC_TAGS}_REJECTED`:
    console.log("Error - EDIT_PIC_TAGS_REJECTED");
      return {
        ...state
      }
    default:
      console.log('reached default state')
      return state;
  }
}

// ACTION CREATORS

export function sendPicToDB(url, uid){ 
  return {
    type: SEND_PIC_TO_DB,
    payload: axios.post('/api/submit', {url, uid}) //post request returns a data object with the pic's pid, url, and title
  }
}

export function getAllPics(){
  return { 
    type: GET_ALL_PICS,
    payload: axios.get('/api/photos')
  }
}

export function clearPrevUploadData(){//doesn't need a payload. It just empties data
  return {
    type: CLEAR_PREV_UPLOAD_DATA,
    payload: true
  };
}

// export function getPicByID() {
//   return {
//     type: GET_PICTURE_BY_ID,
//     payload: axios.get('/api/cart')
//   };
// }

export function sendSearchTerms(terms){
  console.log(`sendSearchTerms(${terms})`);
  return {
    type: SEND_SEARCH_TERMS,
    payload: axios.get(`/api/search?terms=${terms}`)
  };
}

export function editPicTitle(titleObj){//takes in an object with a picture ID and a title
  console.log("Received", (titleObj ? titleObj.title : 'undefined')) //REMOVE: prevents the console for checking an object before it exists
  return {
    type: EDIT_PIC_TITLE,
    payload: axios.put('/api/edit_title', titleObj)
  };
}

export function editPicTags(tagsObj){
  // takes in an object with a picture ID and a string of space-delimited tags
  // splits string into an array of strings (by spaces) and sends the array to the db
  tagsObj ? tagsObj.tags = tagsObj.tags.split(' '): null;
  console.log("Received", (tagsObj ? tagsObj.tags : 'undefined'))
  return {
    type: EDIT_PIC_TAGS,
    payload: axios.put('/api/edit_tags', tagsObj)
  }
}