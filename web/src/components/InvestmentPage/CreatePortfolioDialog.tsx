import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  DialogActions,
  DialogProps,
  SelectChangeEvent,
} from "@mui/material";
import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";
import { StockType, allStockType } from "../../models/StockType";
import Investment from "../../models/Investment";

interface CreatePortfolioDialogProps {
  open?: boolean;
  onClose?: DialogProps["onClose"];
  onCreatePortfolio: (investment: Investment) => void;
  disabledSymbol?: Array<StockType>;
  maxWeight?: number;
}

const CreatePortfolioDialog: FC<CreatePortfolioDialogProps> = ({
  open,
  onClose,
  onCreatePortfolio,
  disabledSymbol = [],
  maxWeight = 100,
}) => {
  const [symbol, setSymbol] = useState<StockType>();
  const [weight, setWeight] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (open) {
      setSymbol(undefined);
      setWeight(0);
      setPrice(0);
    }
  }, [open]);

  const availableSymbol = useMemo(
    () => allStockType.filter((type) => !disabledSymbol.includes(type)),
    [disabledSymbol]
  );

  const onSymbolChange = useCallback(
    (event: SelectChangeEvent<StockType>) => {
      setSymbol(event.target.value as StockType);
    },
    [setSymbol]
  );

  const onTextFieldChange = useCallback(
    (
      setValue: (value: number) => void
    ): ChangeEventHandler<HTMLInputElement> => {
      return (event) => setValue(event.currentTarget.valueAsNumber);
    },
    []
  );

  const onCraetePortfolioHandler: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      if (symbol && weight && weight <= maxWeight && price) {
        onCreatePortfolio({ symbol, weight, price });
        setSymbol(undefined);
        setWeight(0);
        setPrice(0);
      }
    }, [onCreatePortfolio, price, symbol, weight, maxWeight]);

  return (
    <Dialog open={open ?? false} onClose={onClose}>
      <DialogTitle>Create Portfolio</DialogTitle>
      <DialogContent>
        <DialogContentText component={Typography} paragraph>
          To create your own portfolio, you have to add your investment choices.
          Please create below.
        </DialogContentText>
        <Grid item spacing={2}>
          <FormControl sx={{ minWidth: 170 }}>
            <InputLabel id="symbol">Symbol</InputLabel>
            <Select
              labelId="symbol"
              id="symbol"
              value={symbol}
              label="Symbol"
              onChange={onSymbolChange}
            >
              {availableSymbol.map((stock, index) => {
                return (
                  <MenuItem key={index} value={stock}>
                    {stock}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            id="weight"
            label="Weight"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              inputProps: {
                min: 0,
                max: maxWeight,
                inputmode: "numeric",
                pattern: "^[1-9][0-9]?$|^100$",
              },
            }}
            onChange={onTextFieldChange(setWeight)}
            sx={{ maxWidth: 170 }}
          />
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
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <FormSubmitButton
          disabled={!symbol || !weight || weight > maxWeight || !price}
          onClick={onCraetePortfolioHandler}
          text="Create"
        />
      </DialogActions>
    </Dialog>
  );
};

export default CreatePortfolioDialog;
