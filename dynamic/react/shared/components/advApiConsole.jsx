import React from 'react';

const AdvApiConsole = (props) => {
    return (
        <body ng-app="ramlConsoleApp" ng-cloak class="raml-console-body">
  {/*<!-- if we change the src of the raml-console-loader then we change what api is showing -->*/}
  <raml-console-loader src="../dist/api.raml" options="{ disableTitle: true, disableThemeSwitcher: true, disableRamlClientGenerator: true, documentationCollapsed: true, disableTitle: true, disableDiscription: true, singleView: true }"></raml-console-loader>
  <script src="../dist/scripts/api-console-vendor.js"></script>
  <script src="../dist/scripts/api-console.js"></script>
  <script>
    $.noConflict();
    
  </script>
</body>
    );
};

AdvApiConsole.displayName = 'Advanced API Console';
AdvApiConsole.propTypes = {
    endpoint: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        apiResponse: React.PropTypes.shape({
            status: React.PropTypes.string.isRequired,
            statusMessage: React.PropTypes.string.isRequired,
            body: React.PropTypes.oneOfType([
                React.PropTypes.object, React.PropTypes.array
            ]).isRequired
        }),
        name: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        curl: React.PropTypes.string.isRequired,
        sampleAuthHeader: React.PropTypes.string,
        path: React.PropTypes.string.isRequired,
        action: React.PropTypes.string.isRequired,
        queryString: React.PropTypes.objectOf(
            React.PropTypes.shape({
                description: React.PropTypes.string,
                example: React.PropTypes.any,
                required: React.PropTypes.bool,
                value: React.PropTypes.any.isRequired
            })
        ),
        pathParams: React.PropTypes.objectOf(
            React.PropTypes.shape({
                description: React.PropTypes.string,
                example: React.PropTypes.any,
                required: React.PropTypes.bool,
                value: React.PropTypes.any.isRequired
            })
        ),
        requestSchema: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
        showExcludedPostBodyFields: React.PropTypes.bool.isRequired
    }).isRequired,
    onAddItemToPostbodyCollection: React.PropTypes.func.isRequired,
    onFillConsoleSampleData: React.PropTypes.func.isRequired,
    onPathParamChanged: React.PropTypes.func.isRequired,
    onPostBodyInputChanged: React.PropTypes.func.isRequired,
    onQueryParamChanged: React.PropTypes.func.isRequired,
    onRemovePostbodyCollectionItem: React.PropTypes.func.isRequired,
    onResetConsole: React.PropTypes.func.isRequired,
    onSubmitConsoleRequest: React.PropTypes.func.isRequired,
    onToggleShowExcludedPostBodyProps: React.PropTypes.func.isRequired
};

export default AdvApiConsole;
