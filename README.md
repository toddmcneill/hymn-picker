# hymn-picker

Pick hymns

Run `yan && yarn workspace server pick`

## Scripts

### migrate
Used to handle database migrations.
* `yarn migrate create ______` creates a new schema migration file with the given name.
* `yarn migrate up` applies existing schema migrations.
* `yarn migrate down` rolls back the more recent schema migration (if a `down` function is defined in that migration)
