import { Schema } from 'jsonschema';

export const parsedCommand: Schema = {
  type: 'object',
  properties: {
    name: { type: 'string', required: true },
    arguments: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', required: true },
          type: {
            type: 'string',
            required: true,
            enum: ['string', 'number', 'string?', 'number?', 'string[]', 'number[]']
          },
          array: { type: 'boolean', required: true },
          required: { type: 'boolean', required: true }
        }
      }
    },
    handler: { type: 'function' }
  }
};
