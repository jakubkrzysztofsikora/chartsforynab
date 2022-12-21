import { Button, Typography } from "@mui/material";
import { Plan } from "../model/plan";
import { RecurringPayment } from "../model/recurring-payment";
import { Subcategory } from "../model/subcategory";
import dayjs from "dayjs";

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
  const savingsTotal =
    Math.round(
      plan.savings.reduce(
        (sum, single) =>
          sum +
          single.percentToSave *
            ((single.entity as RecurringPayment)?.amount ||
              (single.entity as Subcategory).avgAmount),
        0
      )
    ) / 100;
  const deadline = Math.ceil(plan.target / savingsTotal);
  const includeCurrentMonth = (numberOfMonths: number) => ++numberOfMonths;
  const cumulativeSavingsChartData = Array.from(
    { length: includeCurrentMonth(deadline) },
    (_, i) => ({
      savings: i * savingsTotal,
      months: dayjs().add(i, "month").toDate(),
    })
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Saving Simulation",
      },
    },
  };

  const labels = cumulativeSavingsChartData.map(
    (x) => `${x.months.getMonth() + 1}/${x.months.getFullYear()}`
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Cumulative savings",
        data: cumulativeSavingsChartData.map((x) => x.savings),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

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
      <Bar options={options} data={data} />

      <Button variant="contained" color="info">
        Back
      </Button>
      <Button variant="contained" color="primary">
        Approve
      </Button>
    </div>
  );
};
