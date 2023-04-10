import { Card, CardContent, Grid, Typography } from "@mui/material";
import { FC } from "react";

interface CardDisplayProps {
  cardName: string;
  cardContent: string | number | undefined;
}

const CardDisplay: FC<CardDisplayProps> = ({ cardName, cardContent }) => {
  return (
    <Grid item xs={2} minWidth={220}>
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

export default CardDisplay;
