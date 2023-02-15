# `session` Collection Schema

## Field Definitions

|    Field     | Data Type  | Required | Description                                        |
| :----------: | :--------: | :------: | :------------------------------------------------- |
|    `_id`     | `objectid` |    ✅    | MongoDB document ID.                               |
| `session_id` |  `string`  |    ✅    | Randomly generated Session ID.                     |
|    `exp`     |   `int`    |    ✅    | Expire timestamp in milliseconds since Unix Epoch. |

## Indexes

### `session_expire`

Auto-expire documents when it reaches the token expiration time.

Fields:

- `exp`

Configurations:

|      Attribute       | Value |
| :------------------: | :---: |
| `expireAfterSeconds` |  `0`  |
