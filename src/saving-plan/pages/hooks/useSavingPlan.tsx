import dayjs from "dayjs";
import React from "react";
import { Plan } from "../../model/plan";
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
  Chart: () => JSX.Element;
} = () => {
  const { plan, transactionService } = useSavingPlanContext();
  const [futureSavingsTotalPerMonth, setFutureSavingsTotal] =
    React.useState<number>(0);
  const [originalDeadline, setOriginalDeadline] = React.useState<number>(0);
  const [currentDeadline, setCurrentDeadline] = React.useState<number>(0);
  const [delay, setDelay] = React.useState<number>(0);
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
    () =>
      plan ? dayjs(plan.started).endOf("month").add(1, "day").toDate() : null,
    [plan]
  );
  const currentMonthOfPlan = React.useMemo(
    () => dayjs().subtract(1, "month").endOf("month").toDate(),
    []
  );
  const ChartComponent = React.useCallback(
    () =>
      plan ? (
        <SavingChart
          plan={plan}
          title="Savings Process"
          deadline={currentDeadline !== 0 ? currentDeadline : originalDeadline}
          savingsTotal={futureSavingsTotalPerMonth}
          implementation={implementation}
        />
      ) : (
        <></>
      ),
    [
      currentDeadline,
      futureSavingsTotalPerMonth,
      implementation,
      originalDeadline,
      plan,
    ]
  );

  React.useEffect(() => {
    setFutureSavingsTotal(
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
      plan?.savings
        .slice(
          0,
          Math.min(
            dayjs(currentMonthOfPlan).diff(firstMonthOfPlan, "month"),
            plan.savings.length
          )
        )
        .reduce(
          (accu, current) =>
            accu +
            (100 - current.percentToSave) *
              ((current.entity as RecurringPayment)?.amount ||
                (current.entity as Subcategory).avgAmount),
          0
        ) || 0;
    transactionService?.getTotalSpentPerMonth().then((implementation) => {
      const allSpentByNow = implementation.reduce(
        (accu, current) => accu + current.spent,
        0
      );
      const overspent = allSpentByNow - supposedSpentByNow;

      const newDeadline = Math.ceil(
        ((plan?.target || 0) + overspent) / futureSavingsTotalPerMonth
      );
      const delay = newDeadline - originalDeadline;
      const supposedToSpentPerMonth =
        plan?.savings.reduce(
          (accu, current) =>
            accu +
            ((100 - current.percentToSave) *
              ((current.entity as RecurringPayment)?.amount ||
                (current.entity as Subcategory).avgAmount)) /
              100,
          0
        ) || 0;
      setCurrentDeadline(newDeadline);
      setDelay(delay > 0 ? delay : 0);
      setImplementation(
        implementation.map((x) => ({
          month: x.month,
          saved: futureSavingsTotalPerMonth + supposedToSpentPerMonth - x.spent,
        })) || []
      );
    });
  }, [
    currentMonthOfPlan,
    firstMonthOfPlan,
    futureSavingsTotalPerMonth,
    originalDeadline,
    plan?.savings,
    plan?.target,
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
    Chart: ChartComponent,
  };
};
