import React, { Component } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';

import { updateNote, clearActiveNote, getSpecificNote, removeNote } from '../../actions/notesActions';

import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import ProcessLoader from '../ProcessLoader/ProcessLoader';

const EditorContainer = styled.div`
    width: 67%;
    height: 100vh;
    background: #21242A;
    position: relative;

    @media (max-width: 1110px) {
        width: calc(100% - 250px);
        margin-left: auto;
    }

    @media (max-width: 700px) {
        width: calc(100% - 200px);
    }

    @media (max-width: 650px) {
        width: 100%;
    }
`

const EditorNav = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 50px;
`

const EditorTitle = styled.p`
    font-family: 'PT Serif', serif;
    color: #ffffff;
    font-size: 26px;
    letter-spacing: 1px;
    cursor: default;

    @media (max-width: 860px) {
        font-size: 20px;
    }
`

const EditorButtonsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
`

const EditorButtonsItem = styled.li`
    margin-left: 10px;

    @media (max-width: 860px) {
        margin: 0;
    }
`

const EditorButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
`

const StyledIcon = styled(Icon)`
    font-size: 26px;
`

const EditorTextArea = styled.textarea`
    margin: 25px 50px;
    resize: none;
    width: calc(100% - 100px);
    height: calc(100% - 150px);
    background: none;
    border: none;
    outline: none;
    color: #ffffff;
    font-family: 'PT Serif', serif;
    font-size: 16px;
    box-shadow: ${({editorOff}) => ( editorOff ? 'auto' : '0px 0px 15px 0px #000000' )};
    cursor: ${({editorOff}) => ( editorOff ? 'default' : 'auto' )};
`

const EditorWordsLength = styled.p`
    color: #8D8E91;
    font-family: 'PT Serif', serif;
    font-style: italic;
    position: absolute;
    bottom: 10px;
    right: 40px;
    font-size: 14px;
    cursor: default;
    user-select: none;
`

const EditorTagName = styled.p`
    color: #8D8E91;
    font-family: 'PT Serif', serif;
    font-style: italic;
    position: absolute;
    bottom: 10px;
    left: 40px;
    font-size: 14px;
    cursor: default;
    border: 1px solid #8D8E91;
    padding: 2px 15px 4.5px 15px;
    border-radius: 20px;
    user-select: none;
`

const EditorNoNote = styled.p`
    width: 100%;
    height: 100%;
    color: #545962;
    font-size: 18px;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'PT Serif', serif;
    user-select: none;
`

const StyledLoader = styled(Loader)`
    position: absolute
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
`

const StyledProcessLoader = styled(ProcessLoader)`
  opacity: ${({process}) => ( process ? '1' : '0' )};
  visibility: ${({process}) => ( process ? 'visible' : 'hidden' )}; 
  transition: opacity .3s, visibility .3s;
`

class Editor extends Component {
    constructor() {
        super();
        this.state ={
            isEditorOff: true,
            editorValue: '',
            editorStar: null,
            texting: false
        }
    }

    componentDidMount() {
        if (this.editor) {
            this.editor.addEventListener('keydown', this.keyShortcut)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.activeNote) {
            if (prevProps.activeNote !== this.props.activeNote) {
                this.setState({ editorValue: this.props.activeNote.value, editorStar: this.props.activeNote.star });
            }
        }
    }

    toggleEdit = () => {
        this.setState({ isEditorOff: !this.state.isEditorOff });
    }

    toggleStar = () => {
        if (!this.props.process) {
            this.setState({
                editorStar: !this.state.editorStar
            }, () => {
                this.props.updateNote(this.props.activeNote.id, 'star', this.state.editorStar, this.props.activeRoute);
            })
        }
    }

    handleEditorText = e => {
        this.setState({ editorValue: e.target.value, texting: true });
    }

    saveButton = () => {
        this.props.updateNote(this.props.activeNote.id, 'text', this.state.editorValue, this.props.activeRoute);
        this.setState({ texting: false });
    }

    trashHandler = () => {
        if (this.props.activeNote.trash === false) {
            this.props.updateNote(this.props.activeNote.id, 'trash', true, this.props.activeRoute);
            this.props.clearActiveNote();
        } else {
            this.props.updateNote(this.props.activeNote.id, 'trash', false, this.props.activeRoute, true);
            this.props.clearActiveNote();
        }
    }

    removeForever = () => {
        this.props.removeNote(this.props.activeNote.id, this.props.activeRoute);
    }

    keyShortcut = e => {
        if ((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey)) {
            if (!this.state.isEditorOff) {
                e.preventDefault();
                this.props.updateNote(this.props.activeNote.id, 'text', this.state.editorValue, this.props.activeRoute);
                this.setState({ texting: false });
            }
        }
        if (e.keyCode === 112) {
            e.preventDefault();
            this.setState({ isEditorOff: !this.state.isEditorOff });
        }
    }

    isFullScreen() {
        return document.fullscreenElement ||
                document.mozfullScreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement;
    }

    toggleFullscreen = () => {
        if (!this.isFullScreen()) {
            if (this.editor.requestFullscreen) {
                this.editor.requestFullscreen();
            } else if (this.editor.webkitRequestFullscreen) {
                this.editor.webkitRequestFullscreen();
            } else if (this.editor.mozRequestFullscreen) {
                this.editor.mozRequestFullscreen();
            } else if (this.editor.msRequestFullscreen) {
                this.editor.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscren) {
                document.webkitExitFullscren();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    render() {
        const { activeNote, noteGetting, process } = this.props;
        const { isEditorOff, editorValue, editorStar, texting } = this.state;

        return (
            <EditorContainer ref={r => this.editor = r}>
                {
                    activeNote ? (
                        <>
                            <EditorNav>
                            <EditorTitle>{activeNote.name}</EditorTitle>
                            <EditorButtonsList  >
                                <EditorButtonsItem>
                                    <EditorButton data-tip={isEditorOff ? "Edit mode (F1)" : "Read mode (F1)"} onClick={this.toggleEdit}>
                                        <StyledIcon color={isEditorOff ? "#545962" : "#767984"} type="edit" />
                                    </EditorButton>
                                </EditorButtonsItem>
                                <EditorButtonsItem>
                                    <EditorButton data-tip={editorStar ? 'Unstar' : 'Star it!'} onClick={this.toggleStar}>
                                        <StyledIcon color={editorStar ? '#F1C200' : "#545962"} type="star" />
                                    </EditorButton>
                                </EditorButtonsItem>
                                <EditorButtonsItem>
                                    <EditorButton data-tip="Fullscreen" onClick={this.toggleFullscreen}>
                                        <StyledIcon color="#545962" type="resize" />
                                    </EditorButton>
                                </EditorButtonsItem>
                                <EditorButtonsItem>
                                    <EditorButton data-tip="Save (CTRL + S)" onClick={this.saveButton}>
                                        <StyledIcon color={texting ? "#3599DE" : "#545962"} type="save" />
                                    </EditorButton>
                                </EditorButtonsItem>
                                <EditorButtonsItem>
                                    <EditorButton data-tip={activeNote.trash ? "Restore" : "Move to trash"} onClick={this.trashHandler}>
                                        <StyledIcon color={activeNote.trash ? "#E04E38" : "#545962"} type={activeNote.trash ? "restore" : "trash"} />
                                    </EditorButton>
                                </EditorButtonsItem>
                                {
                                    activeNote.trash ? (
                                        <EditorButtonsItem>
                                            <EditorButton data-tip="Remove forever!" onClick={this.removeForever}>
                                                <StyledIcon color="#545962" type="forever" />
                                            </EditorButton>
                                        </EditorButtonsItem>
                                    ) : (
                                        ''
                                    )
                                }
                            </EditorButtonsList>
                            </EditorNav>
                            <EditorTextArea onChange={this.handleEditorText} editorOff={isEditorOff} spellCheck="false" readOnly={isEditorOff} value={editorValue}></EditorTextArea>
                            {
                                activeNote.tag ? (
                                    <EditorTagName>{activeNote.tag}</EditorTagName>
                                ) : (
                                    ''
                                )
                            }
                            <EditorWordsLength>{`${editorValue.length} words`}</EditorWordsLength>
                            <ReactTooltip type="dark" effect="solid"/>
                        </>
                    ) : (
                        noteGetting ? (
                            <StyledLoader />
                        ) : (
                            <EditorNoNote>Nothing here ;(</EditorNoNote>
                        )
                    )
                }
            <StyledProcessLoader process={process}/>
            </EditorContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        activeNote: state.notesReducer.activeNote,
        noteGetting: state.notesReducer.noteGetting,
        activeRoute: state.routesReducer.activeRoute,
        process: state.notesReducer.process
    }
}

export default connect(mapStateToProps, { updateNote, clearActiveNote, getSpecificNote, removeNote })(Editor);