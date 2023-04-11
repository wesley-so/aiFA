import {
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import usePortfolio from "../../hooks/usePortfolio";
import { getSessionToken } from "../../services/session";
import PortfolioTableRow from "./PortfolioTableRow";

const PortfolioPage: FC = () => {
  const token = getSessionToken();

  const { portfolios, isLoading, fetchPortfolio, error, success } =
    usePortfolio();

  useEffect(() => {
    fetchPortfolio(token ?? "");
  }, [fetchPortfolio, token]);

  const [currentPortfolio, historyPortfolios] = useMemo(() => {
    const sortedPortfolios = portfolios.sort((a, b) => {
      return a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
    });
    return [sortedPortfolios.at(-1), sortedPortfolios.slice(0, -1).reverse()];
  }, [portfolios]);
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="left"
      justifyContent="left"
      padding="15px"
      sx={{ overflow: "scroll" }}
    >
      <Typography variant="h3">My Portfolio</Typography>
      <TableContainer component={Paper} sx={{ paddingTop: 2, maxWidth: 1600 }}>
        <Table aria-label="Portfolio table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 20 }}>Symbol</TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                Weight
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                Entry Price
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                Latest Price
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                1-Day Predict
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                3-Day Predict
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                5-Day Predict
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !success && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="red">
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {success && !currentPortfolio && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No portfolio found.
                </TableCell>
              </TableRow>
            )}
            {success &&
              currentPortfolio &&
              currentPortfolio.portfolio.map((investment) => (
                <PortfolioTableRow
                  key={investment.symbol}
                  investment={investment}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <Typography variant="h5">Past Portfolio</Typography>
      <TableContainer component={Paper} sx={{ paddingTop: 2, maxWidth: 1000 }}>
        <Table aria-label="Past portfolio table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 20 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                Symbol
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                Weight
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 20 }}>
                Entry Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !success && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="red">
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {success && historyPortfolios.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No portfolio history.
                </TableCell>
              </TableRow>
            )}
            {success &&
              historyPortfolios.flatMap(({ portfolio, timestamp }) => {
                return portfolio.map(({ symbol, weight, price }, index) => (
                  <TableRow key={`${timestamp}-${symbol}`}>
                    {index === 0 && (
                      <TableCell
                        sx={{ fontSize: 20 }}
                        rowSpan={portfolio.length}
                      >
                        {new Date(timestamp * 1000).toString()}
                      </TableCell>
                    )}
                    <TableCell align="right" sx={{ fontSize: 20 }}>
                      {symbol}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 20 }}>
                      {weight}%
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 20 }}>
                      ${price}
                    </TableCell>
                  </TableRow>
                ));
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default PortfolioPage;
