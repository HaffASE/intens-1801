import {appName} from '../../config'
import {Record} from 'immutable'
import apiService from '../../services/api'

/**
 * Constants
 * */
export const moduleName = ''
const prefix = `${appName}/${moduleName}`

export const SIGN_UP_START = `${prefix}/SIGN_UP_START`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`

export const SIGN_IN_START = `${prefix}/SIGN_IN_START`
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`
export const SIGN_IN_ERROR = `${prefix}/SIGN_IN_ERROR`

/**
 * Reducer
 * */
export const ReducerRecord = Record({
    user: null,
    loading: true,
    error: null
})

export default function reducer(state = new ReducerRecord(), action) {
    const {type, payload, error} = action

    switch (type) {
        case SIGN_IN_START:
        case SIGN_UP_START:
            return state
                .set('loading', true)
                .set('error', null)

        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return state
                .set('loading', false)
                .set('user', payload.user)
                .set('error', null)

        case SIGN_UP_ERROR:
            return state
                .set('error', error.message)

        default:
            return state
    }
}

/**
 * Selectors
 * */

export const userSelector = state => state[moduleName].user
export const errorSelector = state => state[moduleName].error

/**
 * Action Creators
 * */

export function signUp({email, password}) {
    return async (dispatch) => {
        dispatch({
            type: SIGN_UP_START
        })

        try {
            const user = await apiService.signUp(email, password)

            dispatch({
                type: SIGN_UP_SUCCESS,
                payload: {user}
            })
        } catch (error) {
            dispatch({
                type: SIGN_UP_ERROR,
                error
            })
        }
    }
}

/**
 * Init
**/

export function init(store) {
    apiService.onAuthChange((user) => {
        if (user) {
            store.dispatch({
                type: SIGN_IN_SUCCESS,
                payload: { user }
            })
        }
    })
}