import assert from 'assert';
import mergeWith from 'lodash.mergewith';
import isNil from 'lodash.isnil';
import isArray from 'lodash.isarray';
import uniq from 'lodash.uniq';
import isPlainObject from 'lodash.isplainobject';

export default function (jsonSchemas) {
  assert(isArray(jsonSchemas) && jsonSchemas.length >= 1, 'Must merge at least 1 JSON schema.');
  return mergeWith({}, ...jsonSchemas, (mergedValue, newValue, key) => {
    if (isNil(mergedValue)) {
      return;
    }
    if (key === 'required') {
      return uniq(mergedValue.concat(newValue));
    }
    if (isPlainObject(mergedValue)) {
      if (!isPlainObject(newValue)) {
        throw new Error(`Failed to merge schemas because "${key}" has different values.`);
      }
      return;
    }
    assert.deepEqual(mergedValue, newValue, `Failed to merge schemas because "${key}" has different values: ${JSON.stringify(mergedValue)} and ${JSON.stringify(newValue)}.`);
  });
}
