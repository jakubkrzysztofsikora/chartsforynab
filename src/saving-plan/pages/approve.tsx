import { Button, Typography } from "@mui/material";
import { Plan } from "../model/plan";
import { RecurringPayment } from "../model/recurring-payment";
import { Subcategory } from "../model/subcategory";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSavingPlanContext } from "./context";
import { SavingChart } from "./saving-chart";
import { useSavingPlan } from "./hooks";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type ApproveProps = { className?: string; plan: Plan };

export const Approve: React.FC<ApproveProps> = ({ className, plan }) => {
  const { goBack, approvePlan, goToPlanDetails } = useSavingPlanContext();
  const { deadline, savingsTotal } = useSavingPlan();

  const approve = React.useCallback(() => {
    return approvePlan?.(plan.id).then(() => goToPlanDetails?.(plan.id));
  }, [approvePlan, goToPlanDetails, plan.id]);

  return (
    <div className={className}>
      <Typography variant="h2">{plan.name}</Typography>
      <Typography variant="h3">
        Save {plan.target} in {deadline} months
      </Typography>
      <ol>
        {plan.savings.map((single) => {
          if (single.type === "recurring") {
            const recurring: RecurringPayment =
              single.entity as RecurringPayment;
            return (
              <li key={recurring.id}>
                Cancel {recurring.amount} recurring payment to {recurring.payee}
              </li>
            );
          } else {
            const subcategory: Subcategory = single.entity as Subcategory;
            return (
              <li key={subcategory.id}>
                Assign no more than{" "}
                {Math.round(
                  (100 - single.percentToSave) * subcategory.avgAmount
                ) / 100}{" "}
                per month on {subcategory.name}
              </li>
            );
          }
        })}
      </ol>
      <SavingChart
        plan={plan}
        title="Savings Simulation"
        savingsTotal={savingsTotal}
        deadline={deadline}
      />
      <Button variant="contained" color="info" onClick={goBack}>
        Back
      </Button>
      <Button variant="contained" color="primary" onClick={approve}>
        Approve
      </Button>
    </div>
  );
};
