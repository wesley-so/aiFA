# `stock` Collection Schema

## Field Definitions

|  Fields  | Data Type  | Required | Description          |
| :------: | :--------: | :------: | :------------------- |
|  `_id`   | `objectid` |    ✅    | MongoDB document ID. |
|  `date`  |  `string`  |    ✅    | Date and Time.       |
|  `open`  |  `double`  |    ✅    | Opening price.       |
|  `low`   |  `double`  |    ✅    | Lowest price.        |
|  `high`  |  `double`  |    ✅    | Highest price.       |
| `close`  |  `double`  |    ✅    | Closing price.       |
| `volume` |   `int`    |    ✅    | Stock price volume.  |
| `symbol` |  `string`  |    ✅    | Stock symbol.        |

## Indexes

### `stock_unique`

Validate the uniqueness of every stock data stored in MongoDB

Fields:

- `date`
- `symbol`
