import { all } from 'redux-saga/effects';
import lazyFeatureLoad from '../helpers/featureLazyLoad';

const sagasFromFeaturesFolder = [];
lazyFeatureLoad((module) => {
    if (module.saga) {
        sagasFromFeaturesFolder.push(module.saga());
    }
});

export default function* () {
    yield all(sagasFromFeaturesFolder);
}
