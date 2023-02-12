# aiFA mongo database

## User collection schema

### `Indexes`
| `_id`     |
| --------- |
| Object ID |

### `Columns`
| `Label`         | `Name`        | `Type`   | `Nullable` |
| --------------- | ------------- | -------- | ---------- |
| User ID         | _id           | ObjectId | `No`       |
| Username        | username      | string   | `No`       |
| User Email      | email         | string   | `No`       |
| Hashed Password | password_hash | string   | `No`       |