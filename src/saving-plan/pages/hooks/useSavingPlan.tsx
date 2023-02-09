import dayjs from "dayjs";
import React from "react";
import { RecurringPayment } from "../../model/recurring-payment";
import { Subcategory } from "../../model/subcategory";
import { useSavingPlanContext } from "../context";
import { SavingChart } from "../saving-chart";

export const useSavingPlan: () => {
  name?: string;
  status?: string;
  target?: number;
  savingsTotal: number;
  deadline: number;
  delay: number;
  planned: {
    recurrings: RecurringPayment[];
    subcategories: (Subcategory & { percent: number })[];
  };
  firstMonthOfPlan: Date | null;
  currentMonthOfPlan: Date;
  implementation: { month: Date; saved: number }[];
  cumulativeSavingsChartData: {
    savings: number;
    months: Date;
  }[];
  Chart: () => JSX.Element;
} = () => {
  const { plan, transactionService, today } = useSavingPlanContext();
  const [futureSavingsTotalPerMonth, setFutureSavingsTotalPerMonth] =
    React.useState<number>(0);
  const [originalDeadline, setOriginalDeadline] = React.useState<number>(0);
  const [currentDeadline, setCurrentDeadline] = React.useState<number>(0);
  const [delay, setDelay] = React.useState<number>(0);
  const [spentCurrentMonth, setSpentCurrentMonth] = React.useState<number>(0);
  const [implementation, setImplementation] = React.useState<
    { month: Date; saved: number }[]
  >([]);

  const planned = React.useMemo(
    () => ({
      recurrings:
        plan?.savings
          .filter((x) => x.type === "recurring")
          .map((x) => x.entity as RecurringPayment) || [],
      subcategories:
        plan?.savings
          .filter((x) => x.type === "subcategory")
          .map((x) => ({
            ...(x.entity as Subcategory),
            percent: x.percentToSave || 0,
          })) || [],
    }),
    [plan?.savings]
  );
  const firstMonthOfPlan = React.useMemo(
    () => (plan ? dayjs(plan.started).startOf("month").toDate() : null),
    [plan]
  );
  const currentMonthOfPlan = React.useMemo(
    () => dayjs(today()).subtract(1, "month").endOf("month").toDate(),
    [today]
  );

  const runningMonths = React.useMemo(
    () => dayjs(currentMonthOfPlan).diff(firstMonthOfPlan, "month"),
    [currentMonthOfPlan, firstMonthOfPlan]
  );
  const includeCurrentMonth = (numberOfMonths: number) => ++numberOfMonths;

  const cumulativeSavingsChartData = React.useMemo(
    () =>
      Boolean(currentDeadline !== 0 ? currentDeadline : originalDeadline)
        ? Array.from(
            {
              length:
                currentDeadline !== 0 ? currentDeadline : originalDeadline,
            },
            (_, monthRunning) => ({
              savings:
                implementation.reduce(
                  (accu, current) => accu + current.saved,
                  0
                ) +
                includeCurrentMonth(monthRunning) * futureSavingsTotalPerMonth,
              months: dayjs(plan?.started).add(monthRunning, "month").toDate(),
            })
          )
        : [],
    [
      currentDeadline,
      futureSavingsTotalPerMonth,
      implementation,
      originalDeadline,
      plan?.started,
    ]
  );
  console.log({ cumulativeSavingsChartData });

  const supposedToSpentPerMonth = React.useMemo(
    () =>
      plan?.savings.reduce(
        (accu, current) =>
          accu +
          ((100 - current.percentToSave) *
            ((current.entity as RecurringPayment)?.amount ||
              (current.entity as Subcategory).avgAmount)) /
            100,
        0
      ) || 0,
    [plan?.savings]
  );

  const ChartComponent = React.useCallback(
    () =>
      plan ? (
        <SavingChart
          title="Savings Process"
          implementation={[
            ...implementation.filter(
              (x) =>
                dayjs(x.month)
                  .startOf("month")
                  .isBefore(dayjs(today()).startOf("month")) ||
                dayjs(x.month)
                  .endOf("month")
                  .isAfter(dayjs(today()).endOf("month"))
            ),
            {
              month: new Date(),
              saved: supposedToSpentPerMonth - spentCurrentMonth,
            },
          ]}
          cumulativeSavingsChartData={cumulativeSavingsChartData}
        />
      ) : (
        <></>
      ),
    [
      cumulativeSavingsChartData,
      implementation,
      plan,
      spentCurrentMonth,
      supposedToSpentPerMonth,
      today,
    ]
  );

  React.useEffect(() => {
    setFutureSavingsTotalPerMonth(
      Math.round(
        plan?.savings.reduce(
          (sum, single) =>
            sum +
            single.percentToSave *
              ((single.entity as RecurringPayment)?.amount ||
                (single.entity as Subcategory).avgAmount),
          0
        ) || 0
      ) / 100
    );
  }, [plan?.savings]);

  React.useEffect(() => {
    if (futureSavingsTotalPerMonth !== 0) {
      setOriginalDeadline(
        Math.ceil((plan?.target || 0) / futureSavingsTotalPerMonth)
      );
    }
  }, [plan, futureSavingsTotalPerMonth]);

  React.useEffect(() => {
    if (futureSavingsTotalPerMonth === 0) {
      return;
    }

    const supposedSpentByNow =
      (plan?.savings.reduce(
        (accu, current) =>
          accu +
          ((100 - current.percentToSave) *
            ((current.entity as RecurringPayment)?.amount ||
              (current.entity as Subcategory).avgAmount)) /
            100,
        0
      ) || 0) * (runningMonths === 0 ? 1 : runningMonths);
    transactionService
      ?.getTotalSpentPerMonth(
        {
          type: "recurring",
          payees: plan?.savings
            .filter((x) => x.type === "recurring")
            .map((x) => (x.entity as RecurringPayment).payee),
        },
        {
          type: "subcategory",
          subcategories: plan?.savings
            .filter((x) => x.type === "subcategory")
            .map((x) => x.entity.id),
        }
      )
      .then((implementation) => {
        const allSpentByNow = implementation.reduce(
          (accu, current) => accu + current.spent,
          0
        );
        const overspent = allSpentByNow - supposedSpentByNow;

        const newDeadline = Math.ceil(
          ((plan?.target || 0) + overspent) / futureSavingsTotalPerMonth
        );
        const delay = newDeadline - originalDeadline;
        setCurrentDeadline(newDeadline > 0 ? newDeadline : 0);
        setDelay(delay > 0 ? delay : 0);
        setSpentCurrentMonth(
          implementation.find(
            (x) =>
              dayjs(x.month).isAfter(today()) ||
              dayjs(x.month).isBefore(today()) ||
              dayjs(x.month).isSame(today())
          )?.spent || 0
        );
        setImplementation(
          implementation.map((x) => ({
            month: x.month,
            saved:
              dayjs(x.month).isAfter(today()) ||
              dayjs(x.month).isBefore(today()) ||
              dayjs(x.month).isSame(today())
                ? 0
                : futureSavingsTotalPerMonth +
                  supposedToSpentPerMonth -
                  x.spent,
          })) || []
        );
      });
  }, [
    currentMonthOfPlan,
    firstMonthOfPlan,
    futureSavingsTotalPerMonth,
    originalDeadline,
    plan?.savings,
    plan?.started,
    plan?.target,
    runningMonths,
    today,
    transactionService,
  ]);

  return {
    name: plan?.name,
    savingsTotal: futureSavingsTotalPerMonth,
    target: plan?.target,
    status: plan?.status,
    deadline: currentDeadline !== 0 ? currentDeadline : originalDeadline,
    delay,
    planned,
    firstMonthOfPlan,
    currentMonthOfPlan,
    implementation,
    cumulativeSavingsChartData,
    Chart: ChartComponent,
  };
};
