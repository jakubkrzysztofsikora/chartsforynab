import React, { useContext } from "react";
import { CreateDraft } from "../../ports";

type SavingPlanContextType = {
  createService?: CreateDraft;
  goToApprovalPage?: (id: string) => void;
  goToNewWizard?: () => void;
  goBack?: () => void;
  goToPlanDetails?: (id: string) => void;
  approvePlan?: (id: string) => Promise<void>;
};

export const SavingPlanContext = React.createContext<SavingPlanContextType>({});

export const useSavingPlanContext = () => useContext(SavingPlanContext);
