# `user` Collection Schema

## Field Definitions

|      Field      | Data Type  | Required | Description                       |
| :-------------: | :--------: | :------: | :-------------------------------- |
|      `_id`      | `objectid` |    ✅    | MongoDB document ID.              |
|   `username`    |  `string`  |    ✅    | Username.                         |
|     `email`     |  `string`  |    ✅    | User email address.               |
| `password_hash` |  `string`  |    ✅    | User password with bcrypt hashed. |
