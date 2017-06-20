import queryStringReducer from './queryStringReducer';
import actionTypes from '../../shared/actionTypes';
import {
    buildQueryString,
    reduceParamsToKeyValuePair,
    buildCurl,
    fillOrRemoveSampleData,
    buildInitialPostBodyData
} from '../helpers';

// Method traverses a `requestSchema` endpoint property by colon-separated name and returns the
// innermost property described by the propertyPath
const traversePropertyPath = (propertyPath, state) => {
    if (propertyPath === '') {
        return state;
    }
    const pathArray = propertyPath.split(':');

    return pathArray.reduce((accum, paramName) => {
        if (paramName.indexOf('[') !== -1) {
            const index = parseInt(paramName.slice(paramName.indexOf('[') + 1, paramName.indexOf(']')), 10);

            return accum.items[index];
        }
        return accum[paramName];
    }, state);
};

const traversePostBodyData = (propertyPath, state) => {
    if (propertyPath === '') {
        return state;
    }
    const pathArray = propertyPath.split(':');

    return pathArray.reduce((accum, paramName) => {
        if (paramName.indexOf('[') !== -1) {
            const index = parseInt(paramName.slice(paramName.indexOf('[') + 1, paramName.indexOf(']')), 10);

            return accum[index];
        }
        return accum[paramName];
    }, state);
};

// Stricter parse float, also doesn't match if a value ends with .0+ (otherwise parseFloat will strip the zero which we want to keep)
const parseFloatStrict = (value) => {
    if (/^\-?[0-9]+(\.[0-9]*[^0]+)?$/.test(value)) {
        return parseFloat(value);
    }
    return NaN;
};

const updateDataAtProperty = (propertyPath, newVal, postBody) => {
    if (propertyPath === '') {
        return;
    }
    const pathArray = propertyPath.split(':');

    let nestedObj = postBody;
    pathArray.forEach((nestedParam, i) => {
        if (i === pathArray.length - 1) {
            if (nestedParam.indexOf('[') !== -1) {
                const index = parseInt(nestedParam.slice(nestedParam.indexOf('[') + 1, nestedParam.indexOf(']')), 10);

                nestedObj[index] = newVal;
                return;
            }

            nestedObj[nestedParam] = newVal;
            return;
        }

        if (nestedParam.indexOf('[') !== -1) {
            const index = parseInt(nestedParam.slice(nestedParam.indexOf('[') + 1, nestedParam.indexOf(']')), 10);

            nestedObj = nestedObj[index];
        } else {
            nestedObj = nestedObj[nestedParam];
        }
    });

    nestedObj = newVal;
};

export default (state, action) => {
    let newState = { ...state
    };
    switch (action.type) {
        case actionTypes.RESET_CONSOLE:
            if (newState.consoleViewFreeEdit) {
                newState.requestInput = "{}";
            }
            newState = fillOrRemoveSampleData(newState, true);
            newState.qsPath = buildQueryString(reduceParamsToKeyValuePair(newState.queryString));
            newState.curl = buildCurl(newState.sampleAuthHeader, newState);
            newState.apiResponse = undefined;
            break;
        case actionTypes.SUBMIT_DONE:
            newState.consoleError = false;
            newState.apiResponse = action.apiResponse;
            if (action.error) {
                newState.error = action.error;
            }
            break;
        case actionTypes.FILL_REQUEST_SAMPLE_DATA:
            newState = fillOrRemoveSampleData(newState);
            newState.qsPath = buildQueryString(reduceParamsToKeyValuePair(newState.queryString));
            newState.curl = buildCurl(newState.sampleAuthHeader, newState);
            newState.requestInput = JSON.stringify(newState.postBody);
            break;
        case actionTypes.QUERY_STRING_CHANGED:
            newState = { ...newState,
                queryString: queryStringReducer(newState.queryString, action)
            };
            newState.qsPath = buildQueryString(reduceParamsToKeyValuePair(newState.queryString));
            newState.curl = buildCurl(newState.sampleAuthHeader, newState);
            break;
        case actionTypes.PATH_PARAM_CHANGED:
            newState.pathParams[action.paramName].value = action.newValue;
            newState.curl = buildCurl(newState.sampleAuthHeader, newState);
            break;
        case actionTypes.POST_BODY_CHANGED:
            // If any changed PostBodyForm input was an array item, need to access its `items`
            // schema to determine its fieldType. With that in hand, we can directly update it at its index in our postBody
            const accessorName = action.postBodyParamName.replace(/\[\d+\]/g, 'items');
            const newStateProperty = traversePropertyPath(accessorName, newState.requestSchema);
            let castedValue;
            if (action.newValue === '') {
                castedValue = undefined;
            } else {
                castedValue = newStateProperty.fieldType === 'number' ? (parseFloatStrict(action.newValue) || action.newValue) : action.newValue;
            }
            updateDataAtProperty(action.postBodyParamName, castedValue, newState.postBody);
            break;
        case actionTypes.REQUEST_CHANGED:
            if (newState.consoleViewFreeEdit) {
                newState.requestInput = action.newValue;
                try {
                    var postBody = JSON.parse(action.newValue);
                    newState.postBody = postBody;
                    newState.consoleError = false;
                } catch (e) {
                    newState.consoleError = true;
                }
            }
            break;
        case actionTypes.CONSOLE_TOGGLED_READ_ONLY:
            newState.consoleViewFreeEdit = false;
            break;
        case actionTypes.CONSOLE_TOGGLED_FREE_EDIT:
            newState.consoleViewFreeEdit = true;
            newState.requestInput = JSON.stringify(newState.postBody, null, 2);
            break;
        case actionTypes.CONSOLE_ERROR:
            newState.consoleError = true;
            newState.apiResponse = undefined;
            break;
        case actionTypes.ADD_ITEM_TO_POST_BODY_COLLECTION:
            const newArrObj = buildInitialPostBodyData(action.itemSchema, newState.showExcludedPostBodyFields);

            traversePostBodyData(action.postBodyParamName, newState.postBody).push(newArrObj);
            break;
        case actionTypes.REMOVE_ITEM_FROM_POST_BODY_COLLECTION:
            const itemToRemove = action.postBodyParamName.substr(0, action.postBodyParamName.lastIndexOf(':'));
            const indexToRemove = parseInt(action.postBodyParamName.substr(action.postBodyParamName.lastIndexOf(':')).replace(/\D/g, ''), 10);
            const newStatePropertyToRemove = traversePostBodyData(itemToRemove, newState.postBody);

            newStatePropertyToRemove.splice(indexToRemove, 1);
            newState.curl = buildCurl(newState.sampleAuthHeader, newState);

            break;
        case actionTypes.TOGGLE_SHOW_EXCLUDED_POST_BODY_PROPS:
            newState.showExcludedPostBodyFields = !newState.showExcludedPostBodyFields;
            newState.postBody = buildInitialPostBodyData(newState.requestSchema, newState.showExcludedPostBodyFields);
            break;
        default:
    }


    return newState;
};