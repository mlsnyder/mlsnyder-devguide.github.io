/* Component to render a simple API description, request, and response
 * Features dark color scheme and JSON syntax highlighting
 * Note that the `highlightedInputs` prop is optional and currently only used by the recipe app
 */

import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';


// TODO: Reuse the reducer version of this?
const getPropertyName = (name) => {
    if (name.indexOf('[') !== -1) {
        // accessing an array element
        const index = parseInt(name.substring(1, name.length - 1), 10);

        if (isNaN(index)) {
            throw new Error(`Bad call to accessPropertyByName in recipeForm.js\nExpected: [<int>]\nReceived: ${name}`);
        }
        return index;
    }

    return name;
};

const highlightQueryOrPathParams = (requestString, highlightedInputs) => {
    if (!highlightedInputs) {
        return requestString;
    }
    let retString = requestString;

    highlightedInputs.filter((i) => i.in === 'queryString' || i.in === 'pathParams').forEach((input) => {
        const rgx = input.in === 'queryString' ? new RegExp(`${input.field}=.+`) : new RegExp(`{${input.field}}|${input.value || '888FAIL888'}`);

        retString = retString.replace(rgx, `<span class="highlighted-field">${retString.match(rgx)}</span>`);
    });
    return retString;
};

const addHighlightPlaceholderToPostBody = (propertyPath, data) => {
    const propNameArray = propertyPath.split(':');
    const newData = {...data};
    let currDataSlice = newData;

    propNameArray.forEach((propName, i) => {
        /* Have to check if accessor is the last */
        if (i === propNameArray.length - 1) {
            // TODO: This may error if using an array of primitive values as recipe input
            // Maybe there's a better way? -BJ
            const highlightPropVal = currDataSlice[getPropertyName(propName)] + '__HIGHLIGHT__';

            delete currDataSlice[getPropertyName(propName)];
            currDataSlice[getPropertyName(propName) + '__HIGHLIGHT__'] = highlightPropVal;
        } else {
            currDataSlice = currDataSlice[getPropertyName(propName)];
        }
    });

    return newData;
};

const highlightPunctuation = (str) => {
    return str.replace(/"[^"]*"|([{}\[\],])/g, (m, group1) => {
        if (!group1) {
            return m;
        }

        return '<span class="punctuation">' + m + '</span>';
    });
};

const syntaxHighlight = (jsonObj, highlightedFields) => {
    // Need to prevent changes to our postBody we want to stringify don't affect actual postBody
    let jsonObjCopy;

    if (highlightedFields) {
        jsonObjCopy = R.clone(jsonObj);
        // put highlight keyword in property name?
        highlightedFields.forEach((field) => {
            jsonObjCopy = addHighlightPlaceholderToPostBody(field, jsonObjCopy);
        });
    } else {
        jsonObjCopy = jsonObj;
    }

    let json = JSON.stringify(jsonObjCopy, null, 2);

    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'number';

        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        // if we want to highlight this field, do so now
        if (/__HIGHLIGHT__/.test(match)) {
            return `<span class="${cls} highlighted-field">${match.replace('__HIGHLIGHT__', '')}</span>`;
        }
        return `<span class="${cls}">${match}</span>`;
    });
    return highlightPunctuation(json);
};
function checkFormatting(onRequestChanged, id){
    var text = document.getElementById('console_input');
    onRequestChanged(id, text.value);
};

const PostHelper = ({action, endpoint, request, highlightedInputs, onConsoleToggledFreeEdit, onConsoleToggledReadOnly, onRequestChanged}) => {
    if (typeof request === 'object' || Array.isArray(request)) {
        if (action === 'post') {
            return (
                <div>
                    <ul className={'nav nav-tabs'}>
                        <li className={'nav'} id={'FE'}><a href={'#console_input_freeEdit'} data-toggle={'tab'} onClick={() => {onConsoleToggledFreeEdit(endpoint.id);}}>Editor</a></li>
                        <li className={'nav active'} id={'RO'}><a href={'#console_input_readOnly'} data-toggle={'tab'} onClick={() => {onConsoleToggledReadOnly(endpoint.id);}}>Console</a></li>   
                    </ul>
                    <div className={'tab-content'}>
                        <div id={'console_input_readOnly'} className={'code-snippet-tabcontent active'}><pre dangerouslySetInnerHTML={{ __html: syntaxHighlight(request, highlightedInputs ? highlightedInputs.map((f) => f.field) : null)}}/></div>
                        <div id={'console_input_freeEdit'} className={'code-snippet-tabcontent'}><textarea id={'console_input'} className={'code-snipet-console'} value={endpoint.requestInput} onChange={() => {checkFormatting(endpoint.id, onRequestChanged);}}/></div>                    
                    </div>
                </div>
            );
        } else {
            return (
                <div id={'console_input'} className={'code-snippet'}><pre dangerouslySetInnerHTML={{ __html: syntaxHighlight(request, highlightedInputs ? highlightedInputs.map((f) => f.field) : null)}} /></div>
            );
        }
    } else {
        return (
            <div className={'code-snippet code-snippet-code-text'} dangerouslySetInnerHTML={{ __html: highlightQueryOrPathParams(request, highlightedInputs)}} />
        );
    }
};

<<<<<<< HEAD
const ConsoleLiveData = ({action, consoleLoading, highlightedInputs, path, request, response, onConsoleToggledFreeEdit, onConsoleToggledReadOnly, onRequestChanged, endpoint}) => {
=======
function checkFormatting(onRequestChanged, id) {
    var text = document.getElementById('console_input');
    onRequestChanged(id, text.value);
};

const ConsoleLiveData = ({ action, highlightedInputs, path, request, response, onRequestChanged, endpoint, onConsoleToggledFreeEdit, onConsoleToggledReadOnly}) => {
>>>>>>> parent of 5c41df3... API CONSOLE DONE
    return (
        <div>
            <h5 className={'console-output-header'}>{'API Endpoint'}</h5>
            <div className={'code-snippet-plaintext'}>{path}</div>
            <h5 className={'console-output-header'}>{'Method'}</h5>
            <div className={'code-snippet-plaintext'}>{action.toUpperCase()}</div>
            {request ?
                <div className={'row'} style={{marginBottom: '8px'}}>
                    <div className={'col-md-6 console-req-container'}>
                        <h5 className={'console-output-header'}>{'Request'}</h5>
                        {/* eslint-disable react/no-danger */}
                        <PostHelper action={action} 
                                    request={request} 
                                    highlightedInputs={highlightedInputs} 
                                    onConsoleToggledFreeEdit={onConsoleToggledFreeEdit}
                                    onConsoleToggledReadOnly={onConsoleToggledReadOnly} 
                                    onRequestChanged={onRequestChanged} 
                                    endpoint = {endpoint}/>
                    </div>
                    <div className={'col-md-6 console-res-container'}>
                        <h5 className={'console-output-header'}>{'Response'}</h5>
                        {endpoint.consoleError ? 
                        <div className={'json_error'}>
                            <h5>{'Incorrect JSON format'}</h5>
                        </div>: null}
                                <div className={'code-snippet'}>{endpoint.consoleLoading ? <div className={'loading-pulse'}></div> : <pre dangerouslySetInnerHTML={{__html: response ? syntaxHighlight(response.body) : ' '}} />}</div>
                    </div>
                </div> :
                <div>
                    <h5 className={'console-output-header'}>{'Response'}</h5>
                            <div className={'code-snippet'}>{endpoint.consoleLoading ? <div className={'loading-pulse'}></div> : <pre dangerouslySetInnerHTML={{__html: response ? syntaxHighlight(response.body) : ' '}} />}</div>
                    {/* eslint-enable react/no-danger */}
                </div>
            }
        </div>
    );
};

ConsoleLiveData.displayName = 'Console Live Data';
ConsoleLiveData.propTypes = {
    action: PropTypes.string.isRequired,
    consoleLoading: PropTypes.bool.isRequired,
    highlightedInputs: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired,
        in: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        enum: PropTypes.array
    })),
    path: PropTypes.string.isRequired,
    /* Not required, as a GET might not require any input (e.g. LandedCost `validateCredentials` route) */
    request: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    /* Not required, as a blank response might visually indicate that a request hasn't been sent yet */
    response: PropTypes.shape({
        status: PropTypes.string.isRequired,
        statusMessage: PropTypes.string.isRequired,
        body: PropTypes.oneOfType([
            PropTypes.object, PropTypes.array
        ]).isRequired
    }),
    onRequestChanged: PropTypes.func.isRequired,
    endpoint: PropTypes.object.isRequired,
    onConsoleToggledFreeEdit: PropTypes.func.isRequired,
    onConsoleToggledReadOnly: PropTypes.func.isRequired
};

export default ConsoleLiveData;
