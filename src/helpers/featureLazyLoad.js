/** Ленивый резолв модулей для удобного подключения фич
 * например, скопом подключить reducer'ы из папки с фичами
 *
 const reducersFromFeaturesFolder = {};
 lazyFeatureLoad(module => {
      reducersFromFeaturesFolder[module.moduleName] = module.reducer;
    });
 */
const featuresContext = require.context(
    '../features',
    true,
    /index\.js$/
);

export default function lazyFeatureLoad(forEachModule) {
    featuresContext.keys().forEach((key) => {
        forEachModule(featuresContext(key), key);
    });
}
