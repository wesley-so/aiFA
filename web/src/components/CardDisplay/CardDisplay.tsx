import { Card, CardContent, Grid, Typography } from "@mui/material";
import { FC } from "react";

interface CardDisplayProps {
  cardName: string;
  cardContent: string | number | undefined;
}

const CardDisplay: FC<CardDisplayProps> = ({ cardName, cardContent }) => {
  return (
    <Grid item xs={2} minWidth={220} sx={{ justifyItems: "center" }}>
      <Card
        variant="outlined"
        sx={{
          border: 1,
          borderRadius: "16px",
          backgroundColor: "#eaecee",
          minHeight: 130,
        }}
      >
        <CardContent>
          <Typography variant="h5">{cardName}</Typography>
          <br />
          <Typography variant="h5" alignItems="right">
            {cardContent}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CardDisplay;
