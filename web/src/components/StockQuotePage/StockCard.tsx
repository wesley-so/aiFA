import { Card, CardContent, Grid, Typography } from "@mui/material";
import { FC } from "react";

interface StockCardProps {
  cardName: string;
  cardContent: string | number | undefined;
  xs?: number;
}

const StockCard: FC<StockCardProps> = ({ cardName, cardContent, xs }) => {
  return (
    <Grid item xs={xs ?? 3} minWidth={300}>
      <Card elevation={4}>
        <CardContent>
          <Typography component="div" variant="subtitle1">
            {cardName}
          </Typography>
          <Typography variant="h4" align="center" fontWeight="bold">
            {cardContent}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default StockCard;
