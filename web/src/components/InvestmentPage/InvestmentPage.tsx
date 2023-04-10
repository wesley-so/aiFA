import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, FC, MouseEventHandler, useState } from "react";
import StockType from "../../models/StockType";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";
import { create_portfolio } from "../../services/aifaAPI/stock";
import { getSessionToken } from "../../services/session";
import { AxiosError } from "axios";

interface Investment {
  symbol: string;
  weight: number;
  price: number;
}

const InvestmentPage: FC = () => {
  const [choice, setChoice] = useState<Array<Investment>>([]);
  const [symbol, setSymbol] = useState<StockType>();
  const [weight, setWeight] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [buttonOpen, setButtonOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitDone, setIsSubmitDone] = useState(false);
  const [submitError, setSubmitError] = useState();

  const symbolList = [
    "AAPL",
    "AMZN",
    "BABA",
    "CSCO",
    "GOOG",
    "META",
    "MSFT",
    "NVDA",
    "ORCL",
    "TSLA",
  ];
  const token = getSessionToken();
  const handleClickOpen = () => {
    setButtonOpen(true);
  };
  const handleClickClose = () => {
    setButtonOpen(false);
  };
  const handleSelectItem = (event: SelectChangeEvent<StockType>) => {
    setSymbol(event.target.value as StockType);
  };
  const onTextFieldChange = (
    setValue: (value: number) => void
  ): ChangeEventHandler<HTMLInputElement> => {
    return (event) => setValue(event.currentTarget.valueAsNumber);
  };
  const clickCreateHandler: MouseEventHandler<HTMLButtonElement> = () => {
    if (symbol && weight && price) {
      const item: Investment = { symbol, weight, price };
      setChoice([...choice, item]);
      console.log(choice);
      setSymbol(undefined);
      setWeight(0);
      setPrice(0);
      handleClickClose();
    }
  };
  // const clickDeleteHandler = (choiceIndex: number) => {
  //   setChoice((choice) => {
  //     choice.filter((_, index) => index !== choiceIndex);
  //   });
  // };
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
        <Button variant="outlined" onClick={handleClickOpen}>
          Create Portfolio
        </Button>
        <Dialog open={buttonOpen} onClose={handleClickClose}>
          <DialogTitle>Create Portfolio</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To create your own portfolio, you have to add your investment
              choices. Please create below.
            </DialogContentText>
            <br />
            <FormControl sx={{ minWidth: 170 }}>
              <InputLabel id="symbol">Symbol</InputLabel>
              <Select
                labelId="symbol"
                id="symbol"
                value={symbol}
                label="Symbol"
                onChange={handleSelectItem}
              >
                {symbolList.map((stock, index) => {
                  return (
                    <MenuItem key={index} value={stock}>
                      {stock}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {"      "}
            <TextField
              id="weight"
              label="Weight"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: {
                  min: 0,
                  max: 100,
                  inputmode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              onChange={onTextFieldChange(setWeight)}
              sx={{ maxWidth: 170 }}
            ></TextField>
            {"      "}
            <TextField
              id="price"
              label="Purchase Price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              onChange={onTextFieldChange(setPrice)}
              value={price}
              sx={{ maxWidth: 170 }}
            ></TextField>
          </DialogContent>
          <DialogActions>
            <FormSubmitButton
              disabled={!symbol || !weight || !price}
              onClick={clickCreateHandler}
              text="Create"
            />
          </DialogActions>
        </Dialog>
        <br />
        <br />
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
              {choice.map((value, index) => {
                return (
                  <>
                    <TableRow>
                      <TableCell
                        key={index}
                        component="th"
                        scope="row"
                        sx={{ fontSize: 18 }}
                      >
                        {value.symbol}
                      </TableCell>
                      <TableCell
                        key={index}
                        align="right"
                        sx={{ fontSize: 18 }}
                      >
                        {value.weight}%
                      </TableCell>
                      <TableCell
                        key={index}
                        align="right"
                        sx={{ fontSize: 18 }}
                      >
                        {value.price}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          // onClick={() => clickDeleteHandler(index)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  </>
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
