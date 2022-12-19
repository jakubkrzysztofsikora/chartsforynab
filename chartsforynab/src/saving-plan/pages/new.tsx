import {
  Button,
  Checkbox,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { RecurringPayment } from "../model/recurring-payment";
import { SavingPlan } from "../model/saving-plan";
import { Subcategory } from "../model/subcategory";
import { Textfield } from "./Textfield";

export type NewProps = { className?: string };

export const New: React.FC<NewProps> = ({ className }) => {
  const [plan, setPlan] = React.useState<SavingPlan>([]);
  const [target, setTarget] = React.useState<number>(0);
  const cumulativeSavingsPerMonth = React.useMemo<number>(
    () =>
      plan.reduce(
        (accu, current) =>
          accu +
          (current.percentToSave *
            ((current.entity as RecurringPayment).amount ||
              (current.entity as Subcategory).avgAmount)) /
            100,
        0
      ),
    [plan]
  );
  const recurrings = mockedRecurringPayments;
  const subcategories = mockedSubcategories;

  return (
    <div className={className}>
      <Textfield defaultValue="New Spending Plan" />
      <Chip label="Draft" />
      <Typography variant="h3">I want to save</Typography>
      <Textfield
        defaultValue={target}
        type="number"
        onChange={(value) => setTarget(value as number)}
      />
      {Boolean(cumulativeSavingsPerMonth) && (
        <Typography variant="h3">
          In {target / cumulativeSavingsPerMonth} months
        </Typography>
      )}

      <Typography variant="h3">
        Which recurring spendings to cut off?
      </Typography>
      <List>
        {recurrings.map((payment) => {
          const savedPayment = plan.find(
            (x) =>
              x.type === "recurring" &&
              (x.entity as RecurringPayment).recurringPaymentId ===
                payment.recurringPaymentId
          );
          return (
            <ListItem key={payment.recurringPaymentId}>
              <ListItemAvatar>
                <Checkbox
                  onChange={(_, checked) =>
                    checked
                      ? setPlan((plan) => [
                          ...plan,
                          {
                            type: "recurring",
                            percentToSave: 100,
                            entity: payment,
                          },
                        ])
                      : setPlan((plan) =>
                          plan.filter(
                            (x) =>
                              x.type !== "recurring" ||
                              (x.entity as RecurringPayment)
                                .recurringPaymentId !==
                                payment.recurringPaymentId
                          )
                        )
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${payment.amount} to ${payment.payee}`}
                secondary={payment.subcategory}
              />
              {savedPayment && (
                <Chip
                  label={`+ ${
                    (payment.amount * savedPayment.percentToSave) / 100
                  }`}
                  color="primary"
                  variant="outlined"
                />
              )}
            </ListItem>
          );
        })}
      </List>

      <Typography variant="h3">Which categories to reduce?</Typography>
      <List>
        {subcategories.map((subcategory) => {
          const savedCategory = plan.find(
            (x) =>
              x.type === "subcategory" &&
              (x.entity as Subcategory).id === subcategory.id
          );
          return (
            <ListItem key={subcategory.id}>
              <ListItemAvatar>
                <Textfield
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={0}
                  onChange={(value) =>
                    setPlan((plan) =>
                      savedCategory
                        ? [
                            ...plan.filter((x) => x !== savedCategory),
                            {
                              ...savedCategory,
                              percentToSave: value as number,
                            },
                          ]
                        : [
                            ...plan,
                            {
                              type: "subcategory",
                              entity: subcategory,
                              percentToSave: value as number,
                            },
                          ]
                    )
                  }
                />{" "}
                <span>%</span>
              </ListItemAvatar>
              <ListItemText
                primary={`${subcategory.name} (AVG: ${subcategory.avgAmount})`}
                secondary={subcategory.category}
              />
              {savedCategory && savedCategory.percentToSave !== 0 && (
                <Chip
                  label={`+ ${
                    (subcategory.avgAmount * savedCategory.percentToSave) / 100
                  }`}
                  color="primary"
                  variant="outlined"
                />
              )}
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Typography variant="h3">
        {cumulativeSavingsPerMonth} per month
      </Typography>

      <Button color="primary" variant="contained">
        Create
      </Button>
    </div>
  );
};

const mockedRecurringPayments: Array<RecurringPayment> = [
  {
    payee: "HBO",
    amount: 29.9,
    subcategory: "VOD / Muzyka",
    recurringPaymentId: "test",
  },
];
const mockedSubcategories: Array<Subcategory> = [
  { avgAmount: 2123, name: "Spozywcze", category: "Dom", id: "test" },
];
