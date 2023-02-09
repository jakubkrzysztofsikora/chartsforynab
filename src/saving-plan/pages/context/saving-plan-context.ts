import React, { useContext } from "react";
import { DraftPlan, Plan } from "../../model/plan";
import { CreateDraft } from "../../ports";
import { TransactionService } from "../../ports/transaction.service";

type SavingPlanContextType = {
  createService?: CreateDraft;
  goToApprovalPage?: (id: string) => void;
  goToNewWizard?: () => void;
  goBack?: () => void;
  goToPlanDetails?: (id: string) => void;
  approvePlan?: (id: string) => Promise<string>;
  getSavingPlansList?: (
    page: number,
    limit: number
  ) => Promise<(Plan | DraftPlan)[]>;
  transactionService?: TransactionService;
  plan?: Plan;
  today: () => Date;
};

export const SavingPlanContext = React.createContext<SavingPlanContextType>({
  today: () => new Date(),
});

export const useSavingPlanContext = () => useContext(SavingPlanContext);
