# aiFA mongo database

## Session collection schema

### `Indexes`
| `_id`     | `exp`           |
| --------- | --------------- |
| MongoDB ID | Expiration time |

### `Columns`
| `Label`         | `Name`     | `Type`   | `Nullable` |
| --------------- | ---------- | -------- | ---------- |
| MongoDB ID      | _id        | ObjectId | `No`       |
| Session ID      | session_id | string   | `No`       |
| Expiration Time | exp        | Date     | `No`       |
