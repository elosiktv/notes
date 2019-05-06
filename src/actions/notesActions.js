export const getAllNotes = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('users').doc(user.uid).collection('notes').where("trash", "==", false).get().then(snapshot => {
                    let notes = snapshot.docs.map(doc => doc.data());
                    dispatch({
                        type: 'UPDATE_NOTES',
                        notes
                    });
                })
            }
        });
    }
}

export const getStarNotes = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('users').doc(user.uid).collection('notes').where("star", "==", true).where("trash", "==", false).get().then(snapshot => {
                    let notes = snapshot.docs.map(doc => doc.data());
                    dispatch({
                        type: 'UPDATE_NOTES',
                        notes
                    });
                });
            }
        })
    }
}

export const getTrashNotes = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('users').doc(user.uid).collection('notes').where("trash", "==", true).get().then(snapshot => {
                    let notes = snapshot.docs.map(doc => doc.data());
                    dispatch({
                        type: 'UPDATE_NOTES',
                        notes
                    });
                });
            }
        })
    }   
}

export const getTagNotes = tag => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('users').doc(user.uid).collection('notes').where("tag", "==", tag).where("trash", "==", false).get().then(snapshot => {
                    let notes = snapshot.docs.map(doc => doc.data());
                    dispatch({
                        type: 'UPDATE_NOTES',
                        notes
                    });
                });
            }
        })
    }   
}

export const getSpecificNote = id => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        dispatch({
            type: 'ACTIVE_NOTE_START'
        });

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('users').doc(user.uid).collection('notes').doc(id).get().then(snapshot => {
                    dispatch({
                        type: 'SET_ACTIVE_NOTE',
                        data: snapshot.data()
                    })
                });
            }
        })
    }  
}

export const removeNote = (id, activeRoute) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firestore.collection('users').doc(user.uid).collection('notes').doc(id).delete().then(() => {
                    dispatch(clearActiveNote());
                    switch(activeRoute) {
                        case 'all':
                            dispatch(getAllNotes());
                            break;
                        case 'star':
                            dispatch(getStarNotes());
                            break;
                        case 'trash':
                            dispatch(getTrashNotes());
                            break;
                        default: dispatch(getTagNotes(activeRoute));
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }
}

export const clearActiveNote = () => {
    return dispatch => {
        dispatch({
            type: 'CLEAR_ACTIVE_NOTES'
        });
    }
}

//----------------------------------------------------

export const createNewNote = (tag, color, name, activeRoute) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        dispatch({
            type: 'SET_PROCESS',
            data: true
        })

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                let newNote = firestore.collection('users').doc(user.uid).collection('notes').doc();
                newNote.set({
                    tag: tag,
                    color: color,
                    name: name,
                    star: false,
                    value: '',
                    id: newNote.id,
                    trash: false
                }).then(() => {
                    switch(activeRoute) {
                        case 'all':
                            dispatch(getAllNotes());
                            break;
                        case 'star':
                            dispatch(getStarNotes());
                            break;
                        case 'trash':
                            dispatch(getTrashNotes());
                            break;
                        default: dispatch(getTagNotes(activeRoute));
                    }
                    dispatch({
                        type: 'SET_PROCESS',
                        data: false
                    })
                }).catch(err => {
                    console.log(err);
                })
            }
        });
    }
}

export const updateNote = (id, type, newValue, activeRoute, getNewNoteAfter) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        dispatch({
            type: 'SET_PROCESS',
            data: true
        })

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                let noteRef = firestore.collection('users').doc(user.uid).collection('notes').doc(id);
                firestore.runTransaction(transaction => {
                    return transaction.get(noteRef).then(doc => {
                        let update;
                        switch(type) {
                            case 'text':
                                update = doc.data().value = newValue;
                                transaction.update(noteRef, { value: update });
                                break;
                            case 'star':
                                update = doc.data().star = newValue;
                                transaction.update(noteRef, { star: update });
                                break;
                            case 'trash':
                                update = doc.data().trash = newValue;
                                transaction.update(noteRef, { trash: newValue });
                                break;
                            default: break;
                        }
                    }).then(() => {
                        switch(activeRoute) {
                            case 'all':
                                dispatch(getAllNotes());
                                break;
                            case 'star':
                                dispatch(getStarNotes());
                                break;
                            case 'trash':
                                dispatch(getTrashNotes());
                                break;
                            default: dispatch(getTagNotes(activeRoute));
                        }
                        dispatch({
                            type: 'SET_PROCESS',
                            data: false
                        })
                        if (getNewNoteAfter) {
                            dispatch(getSpecificNote(id));
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                })
            }
        });
    }
}