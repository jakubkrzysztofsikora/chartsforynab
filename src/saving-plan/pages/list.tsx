import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List as MuiList,
  Paper,
  Typography,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import TollIcon from "@mui/icons-material/Toll";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useSavingPlanContext } from "./context";
import { DraftPlan, Plan } from "../model/plan";
import React from "react";
import { useSavingPlan } from "./hooks";
import { useRouter } from "next/router";
import Link from "next/link";

export type ListProps = { className?: string };

export const List: React.FC<ListProps> = ({ className }) => {
  const { goToNewWizard, getSavingPlansList } = useSavingPlanContext();
  const router = useRouter();

  const [plans, setPlans] = React.useState<(Plan | DraftPlan)[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const limit = 100;

  React.useEffect(() => {
    getSavingPlansList?.(page, limit).then((plans) => setPlans(plans));
  }, [getSavingPlansList, page]);

  return (
    <Paper className={className}>
      <div className="header">
        <Typography variant="h1">Your saving plans</Typography>
        <IconButton onClick={goToNewWizard}>
          <AddBoxIcon />
        </IconButton>
      </div>
      <MuiList>
        {plans.map((plan) => {
          return (
            <ListItem
              key={plan.id}
              secondaryAction={
                <Link href={`/saving-plans/${plan.id}`}>
                  <IconButton edge="end" aria-label="open">
                    <LaunchIcon />
                  </IconButton>
                </Link>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <TollIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={plan.name}
                secondary={`Save ${plan.target}`}
              />
            </ListItem>
          );
        })}
      </MuiList>
    </Paper>
  );
};
