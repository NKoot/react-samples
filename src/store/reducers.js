import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import featureLazyLoad from '../helpers/featureLazyLoad';

const reducersFromFeaturesFolder = {};

featureLazyLoad((module, path) => {
    if (!module.moduleName) {
        throw new Error(`Cant find "moduleName" in ${path}`);
    }
    if (!module.default) {
        throw new Error(`Cant find "export default" for combining reducers in ${path}`);
    }

    reducersFromFeaturesFolder[module.moduleName] = module.default;
});

export default history => combineReducers({
    router: connectRouter(history),
    ...reducersFromFeaturesFolder
});
