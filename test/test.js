/* eslint-env goodeggs/server-side-test */
import 'goodeggs-test-helpers';

import mergeJsonSchemas from '../src';

describe('mergeJsonSchemas', function () {
  it('validates at least one json schema', function () {
    expect(() => mergeJsonSchemas()).to.throw('Must merge at least 1 JSON schema.');
  });

  it('merges different properties', function () {
    const jsonSchema1 = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        birthDay: {
          type: 'string',
          minLength: 1,
        },
      },
    };
    const jsonSchema2 = {
      type: 'object',
      properties: {
        birthDay: {
          type: 'string',
          format: 'date-time',
        },
        gender: {
          type: 'string',
          enum: ['male', 'female'],
        },
      },
    };
    const mergedSchema = mergeJsonSchemas([jsonSchema1, jsonSchema2]);
    expect(mergedSchema).to.deep.equal({
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        birthDay: {
          type: 'string',
          minLength: 1,
          format: 'date-time',
        },
        gender: {
          type: 'string',
          enum: ['male', 'female'],
        },
      },
    });
  });

  it('errors if schemas have key that is not deep equal', function () {
    const jsonSchema1 = {
      type: 'object',
      properties: {
        name: {
          type: ['string', 'boolean'],
        },
      },
    };
    const jsonSchema2 = {
      type: 'object',
      properties: {
        name: {
          type: ['string', 'null'],
        },
      },
    };
    expect(
      () => mergeJsonSchemas([jsonSchema1, jsonSchema2])
    ).to.throw('Failed to merge schemas because "type" has different values: ["string","boolean"] and ["string","null"].');
  });

  it('merges if values are deep equal', function () {
    const jsonSchema1 = {
      type: 'object',
      properties: {
        name: {
          type: ['string', 'null'],
        },
      },
    };
    const jsonSchema2 = {
      type: 'object',
      properties: {
        name: {
          type: ['string', 'null'],
        },
        age: {
          type: 'number',
        },
      },
    };
    const mergedSchema = mergeJsonSchemas([jsonSchema1, jsonSchema2]);
    expect(mergedSchema).to.deep.equal({
      type: 'object',
      properties: {
        name: {
          type: ['string', 'null'],
        },
        age: {
          type: 'number',
        },
      },
    });
  });

  it('combines required fields', function () {
    const jsonSchema1 = {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
        },
        birthDay: {
          type: 'string',
          minLength: 1,
        },
      },
    };
    const jsonSchema2 = {
      type: 'object',
      required: ['gender'],
      properties: {
        birthDay: {
          type: 'string',
          format: 'date-time',
        },
        gender: {
          type: 'string',
          enum: ['male', 'female'],
        },
      },
    };
    const mergedSchema = mergeJsonSchemas([jsonSchema1, jsonSchema2]);
    expect(mergedSchema).to.deep.equal({
      type: 'object',
      required: ['name', 'gender'],
      properties: {
        name: {
          type: 'string',
        },
        birthDay: {
          type: 'string',
          minLength: 1,
          format: 'date-time',
        },
        gender: {
          type: 'string',
          enum: ['male', 'female'],
        },
      },
    });
  });
});
