import {
  Alert,
  Button,
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
import { FC, MouseEventHandler, useCallback, useMemo, useState } from "react";
import { StockType } from "../../models/StockType";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";
import { create_portfolio } from "../../services/aifaAPI/stock";
import { getSessionToken } from "../../services/session";
import { AxiosError } from "axios";
import Investment from "../../models/Investment";
import CreatePortfolioDialog from "./CreatePortfolioDialog";

const InvestmentPage: FC = () => {
  const [choice, setChoice] = useState<Array<Investment>>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitDone, setIsSubmitDone] = useState(false);
  const [submitError, setSubmitError] = useState();

  const token = getSessionToken();

  const usedSymbols = useMemo(
    () => choice.map((item) => item.symbol),
    [choice]
  );

  const totalWeight = useMemo(
    () => choice.reduce((sum, item) => sum + item.weight, 0),
    [choice]
  );

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const clickDeleteHandler = useCallback(
    (symbol: StockType) => {
      setChoice(choice.filter((item) => item.symbol !== symbol));
    },
    [setChoice, choice]
  );

  const onCreatePortfolio = useCallback(
    (investment: Investment) => {
      setChoice([...choice, investment]);
      closeDialog();
    },
    [choice, setChoice]
  );

  const clickSubmitHandler: MouseEventHandler<
    HTMLButtonElement
  > = async (): Promise<void> => {
    setIsSubmitting(true);
    setIsSubmitDone(false);
    setSubmitError(undefined);
    try {
      await create_portfolio(token ?? "", choice);
      setIsSubmitting(false);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data.error
          ? error.response.data.error
          : "Unknown error occured.";
      setSubmitError(errorMsg);
      console.error(error);
    }
    setChoice([]);
    setIsSubmitDone(true);
  };
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="left"
      justifyContent="left"
      padding="15px"
    >
      <Typography variant="h3">Investment</Typography>
      <Grid sx={{ maxWidth: 1200, paddingTop: 2 }}>
        <Button variant="outlined" onClick={openDialog}>
          Create Portfolio
        </Button>
        <CreatePortfolioDialog
          open={dialogOpen}
          onClose={closeDialog}
          onCreatePortfolio={onCreatePortfolio}
          disabledSymbol={usedSymbols}
          maxWeight={100 - totalWeight}
        />
        <TableContainer component={Paper} sx={{ maxWidth: 1200 }}>
          <Table aria-label="Investment table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 20 }}>Stock symbol</TableCell>
                <TableCell align="right" sx={{ fontSize: 20 }}>
                  Weight
                </TableCell>
                <TableCell align="right" sx={{ fontSize: 20 }}>
                  Entry Price
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {choice.map((value) => {
                return (
                  <TableRow key={value.symbol}>
                    <TableCell component="th" scope="row" sx={{ fontSize: 18 }}>
                      {value.symbol}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 18 }}>
                      {value.weight}%
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 18 }}>
                      {value.price}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => clickDeleteHandler(value.symbol)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {submitError && (
          <Alert severity="error">
            {submitError ?? "Unknown error occurs."}
          </Alert>
        )}
        {isSubmitDone && (
          <>
            <Alert severity="success">
              Congratulations! Registration complete!
            </Alert>
            <div />
          </>
        )}
        <Grid sx={{ maxWidth: 100, paddingTop: 2 }}>
          <FormSubmitButton
            disabled={choice.length === 0}
            loading={isSubmitting}
            onClick={clickSubmitHandler}
            text="Submit"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InvestmentPage;
