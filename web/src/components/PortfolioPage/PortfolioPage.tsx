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
import { FC, useEffect } from "react";
import usePortfolio from "../../hooks/usePortfolio";
import { getSessionToken } from "../../services/session";
import usePredict from "../../hooks/usePredict";

const PortfolioPage: FC = () => {
  const { portfolio, isLoading, fetchPortfolio, error, success } =
    usePortfolio();
  const {
    predict,
    isPredictLoading,
    fetchPredict,
    predictError,
    predictSuccess,
  } = usePredict();
  const token = getSessionToken();
  useEffect(() => {
    fetchPortfolio(token ?? "");
    fetchPredict(token ?? "", portfolio[0].symbol);
  }, [fetchPortfolio, fetchPredict, portfolio, token]);
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
            {isLoading && <CircularProgress />}
            {!isLoading && !success && (
              <Typography variant="body1">{error}</Typography>
            )}
            {success &&
              portfolio.map((value, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: 16 }}>{value.symbol}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 16 }}>
                      {value.weight}%
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 16 }}>
                      ${value.price}
                    </TableCell>
                  </TableRow>
                );
              })}
            {/* {predictSuccess &&
              predict.map((value, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="right" sx={{ fontSize: 16 }}>
                      {value}
                    </TableCell>
                  </TableRow>
                );
              })} */}
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
          <TableBody>{}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default PortfolioPage;
