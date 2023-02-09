import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { RecurringPayment } from "../../model/recurring-payment";
import { Subcategory } from "../../model/subcategory";
import { Plan } from "../../model/plan";
import dayjs from "dayjs";
import React from "react";

export type SavingChartProps = {
  className?: string;
  title: string;
  cumulativeSavingsChartData: {
    savings: any;
    months: Date;
  }[];
  implementation?: { month: Date; saved: number }[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const SavingChart: React.FC<SavingChartProps> = ({
  className,
  title,
  cumulativeSavingsChartData,
  implementation = [],
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const labels = cumulativeSavingsChartData.map(
    (x) => `${dayjs(x.months).format("MM/YYYY")}`
  );
  console.log({ implementation });
  const data = {
    labels,
    datasets: [
      ...(implementation.length !== 0
        ? [
            {
              label: "Cumulative savings",
              data: implementation
                .filter((x) =>
                  implementation.length === 0
                    ? true
                    : dayjs(x.month).startOf("month").isBefore(new Date())
                )
                .map((x) => x.saved),
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ]
        : []),
      {
        label: "Predicted savings",
        data: cumulativeSavingsChartData
          .filter((x) =>
            implementation.length === 0
              ? true
              : dayjs(x.months).endOf("month").isAfter(new Date())
          )
          .map((x) => x.savings),
        backgroundColor:
          implementation.length === 0
            ? "rgba(53, 162, 235, 0.5)"
            : "rgb(85, 85, 85)",
      },
    ],
  };

  return (
    <div className={className}>
      <Bar options={options} data={data} />
    </div>
  );
};
