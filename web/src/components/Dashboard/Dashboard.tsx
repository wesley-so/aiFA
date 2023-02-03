import { Typography } from "@mui/material";
import { FC } from "react";
import DashboardNavigationBar from "../DashboardNavigationBar/DashboardNavigationBar";

const Dashboard: FC = () => {
  return (
    <>
      <DashboardNavigationBar />
      <Typography
        variant="h3"
        component="h1"
        style={{ paddingTop: "5vh", marginLeft: "15px" }}
      >
        Dashboard
      </Typography>
    </>
  );
};

export default Dashboard;
