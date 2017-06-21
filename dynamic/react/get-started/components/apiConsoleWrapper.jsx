import React from 'react';
import ApiConsole from '../../shared/components/apiConsole';

/* eslint-disable react/prop-types */
const ApiConsoleWrapper = (props) => {
    return (
        <div className={'tab-pane' + (props.endpoint.id === 0 ? ' active' : '')} id={props.endpoint.name.replace(/\s/g, '')} role='tabpanel' style={{margin: '10px'}}>
            {
                setTimeout(function() {
                    $('.console-tool-tip').tooltip();
                }, 1000)
            }
            <ApiConsole {...props} />
        </div>
    );
};

ApiConsoleWrapper.displayName = 'Api Endpoint - Console Wrapper';

export default ApiConsoleWrapper;

/* eslint-enable react/prop-types */
