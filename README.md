# merge-json-schemas

Intended for [consumer driven contracts](http://martinfowler.com/articles/consumerDrivenContracts.html). Define a [JSON schema](http://json-schema.org/documentation.html) for each consumer of a service, then merge those schemas into a single schema that can be used for validating the service provider.

`mergeJsonSchemas` will:
- merge keys in all schemas
- error if keys are incompatible
- create a union of "required" values

## Usage


```js
import mergeJsonSchemas from 'merge-json-schemas'

const consumer1Schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      maxLength: 20,
    },
  },
};

const consumer2Schema = {
  type: 'object',
  required: ['gender'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    gender: {
      type: 'string',
      enum: ['male', 'female'],
    },
  },
};

mergeJsonSchemas([consumer1Schema, consumer2Schema]);
```

Creates a merged schema of:
```js
{
  type: 'object',
  required: ['name', 'gender'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 20,
    },
    gender: {
      type: 'string',
      enum: ['male', 'female'],
    },
  },
}
```

## mergeJsonShemas vs allOf

JSON schema supports an `allOf` option, which validates against multiple schemas.
```js
const providerSchema = {
  allOf: [consumer1Schema, consumer2Schema]
};
```

However, `mergeJsonSchemas` has a few advantages:
- checks compatability - it validates that the schemas are compatible with each other
- faster validation - it generates a smaller provider schema for faster validation
- easier provider design - it provides wholistic representation of what the provider should give to the consumers
- test factories - using a test factory tool like [JSON Schema Factory](https://github.com/goodeggs/unionized), you can derive factories from the provider schema for testing all of the consumers (rather than duplicating factories for each consumer).

## Contributing

This module is written in ES2015 and converted to node-friendly CommonJS via
[Babel](http://babeljs.io/).

To compile the `src` directory to `build`:

```
npm run build
```

## Deploying a new version

```
npm version [major|minor|patch]
npm run build
npm publish build # publish the build directory instead of the main directory
git push --follow-tags # update github
```
