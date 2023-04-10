# `portfolio` Collection Schema

## Field Definitions

|    Field    | Data Type  | Required | Description                         |
| :---------: | :--------: | :------: | :---------------------------------- |
|    `_id`    | `objectid` |    ✅    | MongoDB document ID.                |
|   `stock`   |  `string`  |    ✅    | Stock symbols.                      |
|  `weight`   |   `int`    |    ✅    | Weighting of stock investments.     |
|   `price`   |  `double`  |    ✅    | Purchase price of stock investment. |
| `timestamp` |   `int`    |    ✅    | Unix epoch time stamp.              |
