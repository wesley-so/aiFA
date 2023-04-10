import { CircularProgress, TableCell, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import usePredict from "../../../hooks/usePredict";
import { getSessionToken } from "../../../services/session";

interface PredictRowProps {
  symbol: string;
}

const PredictRow: FC<PredictRowProps> = (props) => {
  const {
    predict,
    isPredictLoading,
    fetchPredict,
    predictError,
    predictSuccess,
  } = usePredict();
  const token = getSessionToken();
  useEffect(() => {
    fetchPredict(token ?? "", props.symbol);
  }, [fetchPredict, props.symbol, token]);
  return (
    <>
      {isPredictLoading && <CircularProgress />}
      {!isPredictLoading && !predictSuccess && (
        <Typography variant="body1">{predictError}</Typography>
      )}
      {predictSuccess &&
        Object.keys(predict).map((value, index) => {
          return (
            <TableCell key={index} align="right" sx={{ fontSize: 16 }}>
              {value}
            </TableCell>
          );
        })}
    </>
  );
};

export default PredictRow;
