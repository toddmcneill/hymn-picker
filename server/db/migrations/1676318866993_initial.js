/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('user', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    handle: { type: 'string' },
    name: { type: 'string' }
  })
  pgm.createTable('history', {
    id: {
      type: 'uuid',
      primaryKey: true
    },
    userId: { type: 'uuid' },
    year: { type: 'int4' },
    week: { type: 'int4' },
    hymns: { type: 'json' },
  })
};

exports.down = pgm => {
  pgm.dropTable('history')
  pgm.dropTable('user')
};
