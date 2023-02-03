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
import { DraftPlan, Plan } from "../model/plan";
import { RecurringPayment } from "../model/recurring-payment";
import { Savings } from "../model/savings";
import { Subcategory } from "../model/subcategory";
import { useSavingPlanContext } from "./context/saving-plan-context";
import { Textfield } from "./textfield";

export type NewProps = { className?: string; fromDraft?: DraftPlan };

export const New: React.FC<NewProps> = ({ className, fromDraft }) => {
  const [recurrings, setRecurrings] = React.useState<RecurringPayment[]>([]);
  const [subcategories, setSubcategories] = React.useState<Subcategory[]>([]);

  const [name, setName] = React.useState<string>(fromDraft?.name || "");
  const [plan, setPlan] = React.useState<Savings>(fromDraft?.savings || []);
  const [target, setTarget] = React.useState<number>(fromDraft?.target || 0);
  const [saving, setSaving] = React.useState<boolean>(false);

  const { createService, goToApprovalPage } = useSavingPlanContext();

  const cumulativeSavingsPerMonth = React.useMemo<number>(
    () =>
      Math.round(
        plan.reduce(
          (accu, current) =>
            accu +
            (current.percentToSave *
              ((current.entity as RecurringPayment).amount ||
                (current.entity as Subcategory).avgAmount)) /
              100,
          0
        ) * 100
      ) / 100,
    [plan]
  );

  React.useEffect(() => {
    setRecurrings(mockedRecurringPayments);
    setSubcategories(mockedSubcategories);
  }, []);

  React.useEffect(() => {
    setName((name) => fromDraft?.name || name);
    setPlan((plan) => fromDraft?.savings || plan);
    setTarget((target) => fromDraft?.target || target);
  }, [fromDraft?.name, fromDraft?.savings, fromDraft?.target]);

  const createDraft = React.useCallback(async () => {
    if (name && plan && createService && goToApprovalPage) {
      setSaving(true);
      const id = await createService({ name, savings: plan, target, id: "" });
      setSaving(false);
      console.log("Created draft", plan);
      goToApprovalPage(id);
    } else {
      console.error(
        "Empty properties",
        name,
        plan,
        createService,
        goToApprovalPage
      );
    }
  }, [createService, goToApprovalPage, name, plan, target]);

  return (
    <div className={className}>
      <Textfield
        placeholder="New Spending Plan"
        defaultValue={name}
        onChange={(value) => setName(value as string)}
      />
      <Chip label="Draft" />
      <Typography variant="h3">I want to save</Typography>
      <Textfield
        defaultValue={target}
        placeholder="00.00"
        type="number"
        onChange={(value) => setTarget(value as number)}
      />
      {Boolean(cumulativeSavingsPerMonth) && (
        <Typography variant="h3">
          In {Math.ceil(target / cumulativeSavingsPerMonth)} months
        </Typography>
      )}

      <Typography variant="h3">
        Which recurring spendings to cut off?
      </Typography>
      <List>
        {recurrings.map((payment) => {
          const savedPayment = plan.find(
            (x) => x.type === "recurring" && x.entity.id === payment.id
          );
          return (
            <ListItem key={payment.id}>
              <ListItemAvatar>
                <Checkbox
                  defaultChecked={plan.some((x) => x.entity.id === payment.id)}
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
                              x.entity.id !== payment.id
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
                  color="success"
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
          return (
            <ListItem key={subcategory.id}>
              <ListItemAvatar>
                <Textfield
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={
                    plan.find((x) => x.entity.id === subcategory.id)
                      ?.percentToSave || 0
                  }
                  placeholder={0}
                  onChange={(value) =>
                    setPlan((plan) => {
                      const savedCategory = plan.find(
                        (x) =>
                          x.type === "subcategory" &&
                          x.entity.id === subcategory.id
                      );
                      return savedCategory
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
                          ];
                    })
                  }
                />{" "}
                <span>%</span>
              </ListItemAvatar>
              <ListItemText
                primary={`${subcategory.name} (AVG: ${subcategory.avgAmount})`}
                secondary={subcategory.category}
              />
              {plan.some(
                (x) =>
                  x.type === "subcategory" && x.entity.id === subcategory.id
              ) &&
                plan.find(
                  (x) =>
                    x.type === "subcategory" && x.entity.id === subcategory.id
                )!.percentToSave !== 0 && (
                  <Chip
                    label={`+ ${
                      (subcategory.avgAmount *
                        plan.find(
                          (x) =>
                            x.type === "subcategory" &&
                            x.entity.id === subcategory.id
                        )!.percentToSave) /
                      100
                    }`}
                    color="success"
                    variant="outlined"
                  />
                )}
            </ListItem>
          );
        })}
      </List>

      {plan.length !== 0 && (
        <>
          <Divider />
          <Typography variant="h3">
            {cumulativeSavingsPerMonth} per month
          </Typography>
        </>
      )}

      <Button
        disabled={saving || plan.length === 0 || !Boolean(name)}
        color="primary"
        variant="contained"
        onClick={createDraft}
      >
        {fromDraft ? "Amend" : "Create"}
      </Button>
    </div>
  );
};

const mockedRecurringPayments: Array<RecurringPayment> = [
  {
    payee: "HBO",
    amount: 29.9,
    subcategory: "VOD / Muzyka",
    id: "test1",
  },
];
const mockedSubcategories: Array<Subcategory> = [
  { avgAmount: 2123, name: "Spozywcze", category: "Dom", id: "test2" },
];
