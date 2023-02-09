import { Chip, IconButton, Tab, Tabs, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import React from "react";
import { Transaction } from "../model/transaction";
import { useSavingPlanContext } from "./context";
import { useSavingPlan } from "./hooks";
import { useRouter } from "next/router";

export type DetailsProps = {
  className?: string;
};

export const Details: React.FC<DetailsProps> = ({ className }) => {
  const { transactionService } = useSavingPlanContext();
  const {
    name,
    deadline,
    delay,
    planned,
    firstMonthOfPlan,
    status,
    target,
    Chart,
  } = useSavingPlan();
  const [tab, setTab] = React.useState<string>("");
  const [recurringTransactions, setRecurringTransactions] = React.useState<
    Transaction[]
  >([]);
  const [subcategories, setSubcategories] = React.useState<
    { id: string; amountSpent: number }[]
  >([]);
  const now = React.useMemo(() => dayjs(), []);
  const tabs = React.useMemo(
    () =>
      firstMonthOfPlan
        ? Array.from({ length: now.diff(firstMonthOfPlan, "month") }, (_, i) =>
            dayjs(firstMonthOfPlan).add(i, "month")
          )
        : [],
    [firstMonthOfPlan, now]
  );
  const chosenMonth = React.useMemo(() => (tab ? dayjs(tab) : null), [tab]);

  React.useEffect(() => {
    if (!chosenMonth) {
      return;
    }

    Promise.all(
      planned.recurrings.map(async (plannedSaving) => {
        return (
          (await transactionService?.getByPayeeAndMonth(
            plannedSaving.payee,
            chosenMonth.month(),
            chosenMonth.year()
          )) || []
        );
      })
    ).then((x) => setRecurringTransactions(x.flat()));
  }, [transactionService, planned.recurrings, chosenMonth]);

  React.useEffect(() => {
    if (!chosenMonth) {
      return;
    }

    planned.subcategories.map(async (plannedSaving) => {
      const transactions: Transaction[] =
        (await transactionService?.getBySubcategoryAndMonth(
          plannedSaving.name,
          chosenMonth.month(),
          chosenMonth.year()
        )) || [];
      const subcategories = transactions.reduce((accu, current) => {
        if (accu[current.subcategory]) {
          accu[current.subcategory].push({
            id: current.id,
            amount: current.amount,
          });
        } else {
          accu[current.subcategory] = [
            { id: current.id, amount: current.amount },
          ];
        }

        return accu;
      }, {} as { [key: string]: { id: string; amount: number }[] });

      setSubcategories(
        Object.keys(subcategories).map((x) => ({
          id: x,
          amountSpent: subcategories[x].reduce(
            (accu, current) => accu + current.amount,
            0
          ),
        }))
      );
    });
  }, [transactionService, planned.subcategories, chosenMonth]);

  const router = useRouter();

  return (
    <div className={className}>
      <header>
        <IconButton onClick={router.back}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h1">{name}</Typography>
        <Chip variant="outlined" color="info" label={status} />
      </header>
      <Typography variant="h2">
        {target} in {deadline} months ({delay} months of delay)
      </Typography>
      <Chart />
      <Tabs
        value={tab || false}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {tabs.map((month) => {
          return (
            <Tab
              onClick={() => {
                if (chosenMonth !== month) {
                  setTab(month.toISOString());
                }
              }}
              value={month.toISOString()}
              key={month.toISOString()}
              label={month.format("MM/YYYY")}
            />
          );
        })}
      </Tabs>
      {tab && (
        <div>
          <Typography variant="h3">Plan implementation</Typography>
          <ul>
            {planned.recurrings.map((r) => {
              if (
                recurringTransactions.some(
                  (t) => t.payee === r.payee && t.amount === r.amount
                )
              ) {
                return (
                  <li key={r.id} className="negative">
                    Not canceled {r.amount} recurring payment to {r.payee}
                  </li>
                );
              } else if (
                recurringTransactions.some(
                  (t) => t.payee === r.payee && t.amount > r.amount
                )
              ) {
                <li key={r.id} className="negative">
                  Not canceled and increased recurring payment to {r.payee}
                </li>;
              } else if (
                recurringTransactions.some(
                  (t) => t.payee === r.payee && t.amount < r.amount
                )
              ) {
                <li key={r.id} className="neutral">
                  Decreased (but not canceled) recurring payment to {r.payee}
                </li>;
              } else {
                return (
                  <li key={r.id} className="positive">
                    Canceled {r.amount} recurring payment to {r.payee}
                  </li>
                );
              }
            })}
            {planned.subcategories.map((sub) => {
              const actualSpendingPercent =
                (subcategories.find((x) => x.id === sub.id)?.amountSpent || 0) /
                (sub.avgAmount * (100 - sub.percent / 100));

              return (
                <li key={sub.id}>
                  {actualSpendingPercent === 1
                    ? `Limited the spending in ${sub.name} category by ${sub.percent} %`
                    : actualSpendingPercent < 1
                    ? `Managed to limit the spending in ${sub.name} category more than planned (by >${sub.percent} %)`
                    : `Overspent the plan for category ${sub.name}`}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
