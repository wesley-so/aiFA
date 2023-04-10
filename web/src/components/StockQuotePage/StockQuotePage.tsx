/* eslint-disable jsx-a11y/iframe-has-title */
import {
  Box,
  CardMedia,
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
import useStockGraph from "../../hooks/useStockGraph";
import { getSessionToken } from "../../services/session";

const StockQuotePage: FC = () => {
  const [symbol, setSymbol] = useState<StockType>();
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
  const { stockInfo, isLoading, fetch, error, success } = useStockData();
  const { graph, isGraphLoading, fetchGraph, graphError, graphSuccess } =
    useStockGraph();
  const token = getSessionToken();
  useEffect(() => {
    if (symbol) {
      fetch(token ?? "", symbol);
      fetchGraph(token ?? "", symbol);
    }
  }, [fetch, fetchGraph, symbol, token]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="left"
      justifyContent="left"
      padding="15px"
      overflow="scroll"
    >
      {!isLoading && !success && (
        <Grid item>
          <Typography variant="h5">{error}</Typography>
        </Grid>
      )}
      <Typography variant="h3">Stock Quote</Typography>
      <Box maxWidth={250} paddingTop={2}>
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

      {isLoading && (
        <Grid item paddingTop={2}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        </Grid>
      )}

      {symbol && success && (
        <>
          <Grid container spacing={3} paddingTop={2} justifyContent="center">
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
          <Typography variant="subtitle2" paddingTop={2}>
            Information may not be most updated!
          </Typography>
          <Grid container paddingTop={2} alignItems="center">
            {isGraphLoading && (
              <Grid item>
                <CircularProgress />
              </Grid>
            )}
            {!isGraphLoading && !graphSuccess && (
              <Grid item>
                <Typography variant="h5">{graphError}</Typography>
              </Grid>
            )}
            {graphSuccess && (
              <CardMedia
                component="img"
                src={`data:image/png;base64, ${graph}`}
              />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default StockQuotePage;
