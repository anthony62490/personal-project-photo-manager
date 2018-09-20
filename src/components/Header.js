import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getSearchResults, resetSearchToggle, setSearchTermsInclusive } from '../redux/generalReducer';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './SearchBar';
import './Header.css';
import SearchBarAutosuggest from './SearchBarAutocomplete';

class Header extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      modal: false,
      tooltipOpen: false,
      searchBarValue: ''
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleSearchError = this.toggleSearchError.bind(this);
    this.setSearchbarValue = this.setSearchbarValue.bind(this);
  }

  toggleModal() 
  {
    this.setState({
      modal: !this.state.modal,
      searchBarValue: ''
    });
  }

  toggleSearchError() 
  {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  setSearchbarValue(value)
  {
    this.setState({searchBarValue: value});
  }

  async normalSearchButtonFn()
  {
    await this.props.setSearchTermsInclusive(this.state.searchBarValue.trim());
    this.toggleModal();
    this.props.getSearchResults(this.props.lastSearchArr);
  }

  render()
  {
    //define shorthand terms for conditional rendering
    const incTermCount = this.props.lastSearchArr.inc.length;
    const excTermCount = this.props.lastSearchArr.exc.length;
    const searchBarIsFilled = this.state.searchBarValue !== '';

    // Define button types
    const normalSearchButton = (<Link to="/" style={{ textDecoration: 'none' }}>
                          <Button className="header-segment" color='primary' 
                          onClick={() => {this.normalSearchButtonFn()}}>
                          Search</Button></Link>);
    // disabledSearchButton does not do anything, but displays a tooltip on mouseover or click
    const disabledSearchButton = (<div><Tooltip placement="top" isOpen={this.state.tooltipOpen} target="TooltipSearchError" toggle={this.toggleSearchError}>
                                  Type in a search term and add it to the query with the plus and minus buttons</Tooltip>
                                  <Button id="TooltipSearchError" className="header-segment"  color='primary'>
                                  Search</Button></div>);    

    return (
      <header>
        <Link to="/" style={{ textDecoration: 'none' }} onClick={() => this.props.resetSearchToggle()}>
          <Button className="header-segment" color='primary'><p>Gallery</p></Button>
        </Link>
        <Link to="/upload" style={{ textDecoration: 'none' }}>
          <Button className="header-segment" color='primary'><p>Upload</p></Button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button className="header-segment" color='primary'><p>Options</p></Button>
        </Link>
        <Button className="header-segment" color="primary" onClick={() => this.toggleModal()}><p>Search</p></Button>

        {/* From here on is the search modal */}

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="search-modal">
          <ModalHeader toggle={this.toggleModal}>
            <p className="modal-title">Press <span style={{color: '#008000'}}>plus</span> to require a term</p>
            <p className="modal-title">Press <span style={{color: '#DD0000'}}>minus</span> to forbid a term</p>
          </ModalHeader>
          <ModalBody>
            {/* <SearchBar/> */}
            <SearchBarAutosuggest 
              setSearchbarValue={this.setSearchbarValue}
              value={this.state.searchBarValue}/>
            <div className="flex-row modal-search-terms">
              <div className="flex-column">
                {this.props.lastSearchArr.inc.map(e => <p className="green">{e.replace(/[_]/g, ' ')}</p>)}
              </div>
              <div className="flex-column">
                {this.props.lastSearchArr.exc.map(e => <p className="red">{e.replace(/[_]/g, ' ')}</p>)}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
              
              {/* // Rendering the Search button //
              // if there are no selected search terms and the user has not typed anything, then the button does nothing
              // if the user has selected terms, the button functions as normal
              // the user has typed something, the button adds the term to the inclusive array before searching */}
              {(incTermCount + excTermCount > 0) || searchBarIsFilled ? 
                normalSearchButton : disabledSearchButton}

            <Button 
              className="header-segment" 
              color="secondary" 
              onClick={() => {
                this.toggleModal();
                this.props.resetSearchToggle();
                this.setState({searchBarValue: ''});
                }}>Cancel & Clear
            </Button>
          </ModalFooter>
        </Modal>
      </header>
    ); //return
  }
};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, { getSearchResults, resetSearchToggle, setSearchTermsInclusive })(Header);