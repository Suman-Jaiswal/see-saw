const initialState = {
    user: {
        uid: '',
        displayName: '',
        photoURL: '',
        email: '',
        admin: null,
    },
    users: [],
    chats: [],
    groups: [],
    authorised: false
}


const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                authorised: true
            }

        case 'CLEAR_USER':
            return {
                ...state,
                user: initialState.user,
                authorised: false
            }

        case 'SET_CHATS':
            return {
                ...state,
                chats: action.payload,
            }
        case 'ADD_CHAT':
            return {
                ...state,
                chats: [...state.chats, action.payload]
            }

        case 'SET_GROUPS':
            return {
                ...state,
                groups: action.payload,
            }
        case 'ADD_GROUP':
            return {
                ...state,
                groups: [...state.groups, action.payload]
            }


        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            }

        default:
            return state
    }
}

export default rootReducer