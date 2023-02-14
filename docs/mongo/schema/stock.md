# `stock` Collection Schema

## Field Definitions

|  Fields  | Data Type  | Required | Description         |
| :------: | :--------: | :------: | :------------------ |
|  `_id`   | `objectid` |    ✅    | MongDB document ID. |
|  `date`  |  `string`  |    ✅    | Date and Time.      |
|  `open`  |  `double`  |    ✅    | Opening price.      |
|  `low`   |  `double`  |    ✅    | Lowest price.       |
|  `high`  |  `double`  |    ✅    | Highest price.      |
| `close`  |  `double`  |    ✅    | Closing price.      |
| `volume` |   `int`    |    ✅    | Stock price volume. |
| `symbol` |  `string`  |    ✅    | Stock symbol.       |
