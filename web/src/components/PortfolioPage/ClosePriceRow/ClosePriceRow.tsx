import { CircularProgress, TableCell, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import useClosePrice from "../../../hooks/useClosePrice";
import { getSessionToken } from "../../../services/session";

interface ClosePriceRowProps {
  symbol: string;
}

const ClosePriceRow: FC<ClosePriceRowProps> = (props) => {
  const { close, isCloseLoading, fetchClose, closeError, closeSuccess } =
    useClosePrice();
  const token = getSessionToken();
  useEffect(() => {
    fetchClose(token ?? "", props.symbol);
  }, [fetchClose, props.symbol, token]);
  return (
    <>
      {isCloseLoading && <CircularProgress />}
      {!isCloseLoading && !closeSuccess && (
        <Typography variant="body1">{closeError}</Typography>
      )}
      {closeSuccess &&
        Object.keys(close).map((value, index) => {
          return (
            <TableCell key={index} align="right" sx={{ fontSize: 16 }}>
              {value}
            </TableCell>
          );
        })}
    </>
  );
};

export default ClosePriceRow;
