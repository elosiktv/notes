const initState = {
    notes: null,
    activeNote: null,
    noteGetting: false,
    process: false,
    removingTag: false
}

const notesReducer = (state = initState, action) => {
    switch(action.type) {
        case 'UPDATE_NOTES':
            return {
                ...state,
                notes: action.notes
            }
        case 'CLEAR_NOTES':
            return {
                ...state,
                notes: null
            }
        case 'CLEAR_ACTIVE_NOTES':
            return {
                ...state,
                activeNote: null
            }
        case 'ACTIVE_NOTE_START':
            return {
                ...state,
                activeNote: null,
                noteGetting: true
            }
        case 'SET_ACTIVE_NOTE':
            return {
                ...state,
                activeNote: action.data,
                noteGetting: false
            }
        case 'SET_PROCESS':
            return {
                ...state,
                process: action.data
            }
        case 'SET_REMOVING_TAG':
            return {
                ...state,
                removingTag: action.data
            }
        default: return state;
    }
}

export default notesReducer;