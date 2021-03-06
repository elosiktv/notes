import React, { useState } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';

import { createNewNote } from '../../actions/notesActions';  
import { showModal } from '../../actions/modalActions';

import Icon from '../Icon/Icon';

const NavContainer = styled.div`
    width: 100%;
    height: 130px;
    border-bottom: 2px solid #17181D;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`

const NavWrapper = styled.div`
    width: 90%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &:first-of-type {
        margin-top: 4px;
    }
`

const NavTitle = styled.p`
    font-family: 'PT Serif', serif;
    color: #ffffff;
    font-size: 20px;
    cursor: default;
    user-select: none;
`

const NavNumber = styled.p`
    font-family: 'PT Serif', serif;
    color: #84878C;
    font-size: 20px;
    margin-left: 10px;
    cursor: default;
    min-width: 10px;
    user-select: none;
`

const NavAddButton = styled.button`
    border: none;
    background: none;
    position: absolute;
    right: 0;
    top: 6px;
    cursor: pointer;
    outline: none;
    transform: ${({isAddClicked}) => ( isAddClicked ? 'rotate(45deg)' : 'auto' )};
    transition: transform .3s ease-in-out;

    @media (max-width: 650px) {
        right: auto;
        left: 0;
    }
`

const NavInput = styled.input`
    width: 100%;
    height: 100%;
    background: none;
    border: 3px solid #2B2F37;
    font-family: 'PT Serif', serif;
    border-radius: 8px;
    outline: none;
    text-align: center;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    left: 0;
    top: 0;
    user-select: none;
`

const NavInputSearch = styled(NavInput)`
    transform: ${({isAddClicked}) => ( isAddClicked ? 'translateY(-15px)' : 'auto' )};
    opacity: ${({isAddClicked}) => ( isAddClicked ? '0' : '1' )};
    visibility: ${({isAddClicked}) => ( isAddClicked ? 'hidden' : 'visible' )};
    transition: transform .3s, opacity .3s, visibility .3s;
`

const NavInputAdd = styled(NavInput)`
    transform: ${({isAddClicked}) => ( isAddClicked ? 'auto' : 'translateY(-15px)' )};
    visibility: ${({isAddClicked}) => ( isAddClicked ? 'visible' : 'hidden' )};
    opacity: ${({isAddClicked}) => ( isAddClicked ? '1' : '0' )};
    transition: transform .3s, opacity .3s, visibility .3s;
`

const NavTagAdd = styled.button`
    border: none;
    background: none;
    position: absolute;
    left: 0;
    top: 6px;
    cursor: pointer;
    outline: none;

    @media (max-width: 1110px) {
        right: 30px;
        left: auto;
    }

    @media (max-width: 650px) {
        right: auto;
        left: 30px;
    }
`

const Nav = ({activeRoute, number, tag, createNewNote, showModal, handleSearch}) => {
    const [isAddClick, setAddClickState] = useState(false);
    const [newNoteName, setNewNote] = useState(null);
    const [searchValue, setSearchValue] = useState(null);

    const toggleAddClick = () => {
        setAddClickState(!isAddClick);
    }

    const handleNewNote = e => {
        setNewNote(e.target.value);
    }

    const createNote = e => {
        if (e.key === 'Enter') {
            if (newNoteName) {
                if (newNoteName.length > 15) {
                    alert('Maxium note name is 15 characters!');
                } else {
                    e.target.value = '';
                    if (tag) {
                        createNewNote(activeRoute, tag.color, newNoteName, activeRoute);   
                    } else {
                        createNewNote(null, '#000000', newNoteName, activeRoute);
                    }
                }
            }
        }
    }

    const addTag = () => {
        showModal('tag');
    }

    const handleSearchInput = e => {
        setSearchValue(e.target.value);
    }

    return (
        <NavContainer>
            <NavWrapper>
                <NavTagAdd data-tip="Create tag" onClick={addTag}>
                    <Icon color="#545962" type="tags" />
                </NavTagAdd>
                <NavTitle>{activeRoute}</NavTitle>
                <NavNumber>{number}</NavNumber>
                <NavAddButton data-tip={isAddClick ? 'Search' : 'Add note'} isAddClicked={isAddClick} onClick={toggleAddClick}>
                    <Icon color="#3599DE" type="add" />
                </NavAddButton>
            </NavWrapper>
            <NavWrapper>
                <NavInputSearch onKeyPress={e => e.key === 'Enter' ? handleSearch(searchValue) : ''} onChange={handleSearchInput} isAddClicked={isAddClick} placeholder="Search" />
                <NavInputAdd onKeyPress={createNote} onChange={handleNewNote} isAddClicked={isAddClick} placeholder="Note name"/>
            </NavWrapper>
            <ReactTooltip type="dark" effect="solid"/>
        </NavContainer>
    );
};

export default connect(null, { createNewNote, showModal })(Nav);