import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';

import { signOut } from '../../actions/authActions';
import { showModal } from '../../actions/modalActions';

const FooterContainer = styled.div`
    width: 100%;
    height: 130px;
    border-top: 2px solid #333840;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #21242A;

    @media (max-height: 580px) {
        position: relative;
    }

    @media (max-width: 650px) {
        width: ${({menuActive}) => ( menuActive ? '100%' : '0' )};
        position: ${({dropdownActive}) => ( dropdownActive ? 'relative' : 'absolute' )}
        overflow: hidden;
    }
`

const FooterAvatar = styled.img`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid #ffffff;
    user-select: none;

    @media (max-width: 1490px) {
        display: none;
    }

`

const FooterWrapper = styled.div`
    font-family: 'PT Serif', serif;
    margin-left: 20px;
    cursor: default;
`

const FooterNick = styled.p`
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 1px;
    margin: 0;
    max-width: 68px;
    height: 22px;
    user-select: none;
`

const FooterSaveStatus = styled.p`
    color: #5F6165;
    margin: 0;
    letter-spacing: 1px;
    width: 76px;
    user-select: none;
`

const FooterWrapperButtons = styled.div`
    margin-left: 40px;

    @media (max-width: 1490px) {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
    }
`

const FooterButton = styled.button`
    background: none;
    cursor: pointer;
    border: none;
    font-size: 20px;
    color: #4D4F54;
    outline: none;
`

const Footer = ({avatar, nick, menuActive, dropdownActive, process, signOut, showModal}) => {
    
    const handleSignOut = () => {
        signOut();
    }

    const handleAvatarChange = () => {
        showModal('avatar');
    }

    return (
        <FooterContainer menuActive={menuActive} dropdownActive={dropdownActive}>
            <FooterAvatar src={avatar ? avatar : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} />
            <FooterWrapper>
                <FooterNick >{nick}</FooterNick>
                <FooterSaveStatus>{process ? 'Saving...' : 'Saved'}</FooterSaveStatus>
            </FooterWrapper>
            <FooterWrapperButtons>
                <FooterButton onClick={handleAvatarChange} data-tip="Change avatar">
                    <span className="fa fa-user-circle"></span>
                </FooterButton>
                <FooterButton onClick={handleSignOut} data-tip="Sign out">
                    <span className="fa fa-sign-out-alt"></span>
                </FooterButton>
                <ReactTooltip type="dark" effect="solid"/>
            </FooterWrapperButtons>
        </FooterContainer>
    );
};

const mapStateToProps = state => {
    return {
        process: state.notesReducer.process,
    }
}

export default connect(mapStateToProps, { signOut, showModal })(Footer);