import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import CardDisplay from "../CardDisplay/CardDisplay";
import useStockData from "../../hooks/useStockData";
import StockType from "../../models/StockType";

const StockQuotePage: FC = () => {
  const [symbol, setSymbol] = useState<StockType>("AAPL");
  const handleChange = (event: SelectChangeEvent<StockType>) => {
    setSymbol(event.target.value as StockType);
  };
  const symbolList: Record<StockType, string> = {
    AAPL: "Apple Inc.",
    AMZN: "Amazon.com Inc.",
    BABA: "Alibaba Group Holdings Ltd.",
    CSCO: "Cisco Systems, Inc.",
    GOOG: "Alphabet Inc. (Google)",
    META: "Meta Platforms, Inc.",
    MSFT: "Microsoft Corporation",
    NVDA: "Nvidia Corporation",
    ORCL: "Oracle Corporation",
    TSLA: "Tesla, Inc.",
  };
  const { stockInfo, isLoading, fetch, error, success } = useStockData(symbol);
  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="left"
      justifyContent="left"
      padding="15px"
    >
      {isLoading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
      {!isLoading && !success && (
        <Grid item>
          <Typography variant="h5">{error}</Typography>
        </Grid>
      )}
      {success && (
        <>
          <Typography variant="h3">Stock Quote</Typography>
          <Box sx={{ maxWidth: 250, paddingTop: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="symbol">Stock Symbol</InputLabel>
              <Select
                labelId="symbol"
                id="symbol"
                value={symbol}
                label="Stock Symbol"
                onChange={handleChange}
              >
                {Object.keys(symbolList).map((symbols, index) => {
                  return (
                    <MenuItem key={index} value={symbols}>
                      {symbols}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Grid container spacing={3} paddingTop={2}>
            <CardDisplay
              cardName="Stock Name"
              cardContent={symbolList[symbol]}
            />
            <CardDisplay cardName="Open Price" cardContent={stockInfo?.open} />
            <CardDisplay
              cardName="Highest Price"
              cardContent={stockInfo?.high}
            />
            <CardDisplay cardName="Lowest Price" cardContent={stockInfo?.low} />
            <CardDisplay
              cardName="Close Price"
              cardContent={stockInfo?.close}
            />
            <CardDisplay
              cardName="Total Volume"
              cardContent={stockInfo?.volume}
            />
          </Grid>
          <Typography variant="body1">
            Information may not be most updated!
          </Typography>
          <Grid container paddingTop={2}></Grid>
        </>
      )}
    </Grid>
  );
};

export default StockQuotePage;
