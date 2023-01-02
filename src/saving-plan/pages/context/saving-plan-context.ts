import React, { useContext } from "react";
import { Plan } from "../../model/plan";
import { CreateDraft } from "../../ports";
import { TransactionService } from "../../ports/transaction.service";

type SavingPlanContextType = {
  createService?: CreateDraft;
  goToApprovalPage?: (id: string) => void;
  goToNewWizard?: () => void;
  goBack?: () => void;
  goToPlanDetails?: (id: string) => void;
  approvePlan?: (id: string) => Promise<void>;
  transactionService?: TransactionService;
  plan?: Plan;
};

export const SavingPlanContext = React.createContext<SavingPlanContextType>({});

export const useSavingPlanContext = () => useContext(SavingPlanContext);
