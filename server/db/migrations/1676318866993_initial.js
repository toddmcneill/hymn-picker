/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('account', {
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
    account_id: { type: 'uuid' },
    year: { type: 'int4' },
    week: { type: 'int4' },
    hymns: { type: 'json' },
  })

  pgm.createTable('hymn', {
    id: {
      type: 'uuid',
      primaryKey: true
    },
    number: { type: 'int4' },
    title: { type: 'string' },
    mood: { type: 'string' },
    length: { type: 'int4' },
    familiarity: { type: 'int4' },
    limited: { type: 'boolean' },
    easter: { type: 'boolean' },
    patriotic: { type: 'boolean' },
    pioneer: { type: 'boolean' },
    thanksgiving: { type: 'boolean' },
    christmas: { type: 'boolean' },
    newyear: { type: 'boolean' },
    sacrament: { type: 'boolean' },
    fasting: { type: 'boolean' },
    closing: { type: 'boolean' },
    dismiss: { type: 'boolean' },
  })

  pgm.createTable('hymn_history', {
    id: {
      type: 'uuid',
      primaryKey: true
    },
    hymnId: { type: 'uuid' },
    history_id: { type: 'uuid' },
    purpose: { type: 'string' },
  })
};

exports.down = pgm => {
  pgm.dropTable('hymn_history')
  pgm.dropTable('hymn')
  pgm.dropTable('history')
  pgm.dropTable('account')
};
