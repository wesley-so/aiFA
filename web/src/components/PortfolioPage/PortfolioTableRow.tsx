import { FC, useEffect } from "react";
import Investment from "../../models/Investment";
import { getSessionToken } from "../../services/session";
import useClosePrice from "../../hooks/useClosePrice";
import usePredict from "../../hooks/usePredict";
import {
  CircularProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

interface PortfolioTableRowProps {
  investment: Investment;
}

const PortfolioTableRow: FC<PortfolioTableRowProps> = ({
  investment: { symbol, weight, price },
}) => {
  const token = getSessionToken();

  const { close, isCloseLoading, fetchClose, closeError, closeSuccess } =
    useClosePrice();
  const {
    predict,
    isPredictLoading,
    fetchPredict,
    predictError,
    predictSuccess,
  } = usePredict();

  useEffect(() => {
    fetchPredict(token ?? "", symbol);
  }, [fetchPredict, symbol, token]);

  useEffect(() => {
    fetchClose(token ?? "", symbol);
  }, [fetchClose, symbol, token]);

  return (
    <TableRow>
      <TableCell sx={{ fontSize: 16 }}>{symbol}</TableCell>
      <TableCell align="right" sx={{ fontSize: 16 }}>
        {weight}%
      </TableCell>
      <TableCell align="right" sx={{ fontSize: 16 }}>
        ${price}
      </TableCell>
      <TableCell align="right" sx={{ fontSize: 16 }}>
        {isCloseLoading && <CircularProgress />}
        {!isCloseLoading && !closeSuccess && (
          <Typography variant="body1" color="red">
            {closeError}
          </Typography>
        )}
        {closeSuccess && close?.close}
      </TableCell>

      {isPredictLoading && (
        <TableCell align="center" colSpan={3}>
          <CircularProgress />
        </TableCell>
      )}
      {!isPredictLoading && !predictSuccess && (
        <TableCell align="center" colSpan={3}>
          <Typography variant="body1" color="red">
            {predictError}
          </Typography>
        </TableCell>
      )}
      {predictSuccess && predict && (
        <>
          <TableCell align="right" sx={{ fontSize: 16 }}>
            {predict?.predict_1}
          </TableCell>
          <TableCell align="right" sx={{ fontSize: 16 }}>
            {predict?.predict_3}
          </TableCell>
          <TableCell align="right" sx={{ fontSize: 16 }}>
            {predict?.predict_5}
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export default PortfolioTableRow;
