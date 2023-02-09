import { SavingPlanContext } from "../context";
import { useSavingPlan } from "./useSavingPlan";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";

describe("useSavingPlan", () => {
  it("should calculate savings implementation correctly", async () => {
    //Given
    const TestComponent = () => {
      const result = useSavingPlan();
      console.log({ result });
      return (
        <>
          <div data-testid="saved">{result.implementation?.[0]?.saved}</div>
          <div data-testid="willSave">
            {result.cumulativeSavingsChartData?.[0]?.savings}
          </div>
        </>
      );
    };
    const TestWrapper = () => (
      <SavingPlanContext.Provider
        value={{
          today: () => new Date(2023, 1, 9),
          transactionService: {
            getTotalSpentPerMonth: () =>
              Promise.resolve([{ month: new Date(2023, 2, 2), spent: 50 }]),
            getByPayeeAndMonth: () => Promise.resolve([]),
            getBySubcategoryAndMonth: () => Promise.resolve([]),
          },
          plan: {
            id: "testid",
            name: "test",
            started: new Date(2023, 1, 9),
            status: "ongoing",
            target: 1000,
            savings: [
              {
                entity: {
                  id: "testentityid",
                  avgAmount: 1000,
                  category: "Cat",
                  name: "Sub",
                },
                percentToSave: 5,
                type: "subcategory",
              },
            ],
            fromDraft: "draftid",
          },
        }}
      >
        <TestComponent />
      </SavingPlanContext.Provider>
    );

    //When
    await act(async () => render(<TestWrapper />));

    //Then
    expect(screen.getByTestId("saved").innerHTML).toBe("0");
    expect(screen.getByTestId("willSave").innerHTML).toBe("50");
  });
  it("should calculate deadline correctly", async () => {
    //Given
    const TestComponent = () => {
      const result = useSavingPlan();
      return <div data-testid="result">{result.deadline}</div>;
    };
    const TestWrapper = () => (
      <SavingPlanContext.Provider
        value={{
          today: () => new Date(2023, 1, 1),
          transactionService: {
            getTotalSpentPerMonth: () =>
              Promise.resolve([{ month: new Date(2023, 0, 1), spent: 950 }]),
            getByPayeeAndMonth: () => Promise.resolve([]),
            getBySubcategoryAndMonth: () => Promise.resolve([]),
          },
          plan: {
            id: "testid",
            name: "test",
            started: new Date(2023, 0, 1),
            status: "ongoing",
            target: 1000,
            savings: [
              {
                entity: {
                  id: "testentityid",
                  avgAmount: 1000,
                  category: "Cat",
                  name: "Sub",
                },
                percentToSave: 5,
                type: "subcategory",
              },
            ],
            fromDraft: "draftid",
          },
        }}
      >
        <TestComponent />
      </SavingPlanContext.Provider>
    );

    //When
    await act(async () => render(<TestWrapper />));

    //Then
    expect(screen.getByTestId("result").innerHTML).toBe("20");
  });
  [
    { spent: 950, delay: 0 },
    { spent: 1000, delay: 1 },
    { spent: 3000, delay: 41 },
  ].forEach(({ spent, delay }) => {
    it(`should calculate a delay properly - spent: ${spent} expected delay ${delay}`, async () => {
      //Given
      const TestComponent = () => {
        const result = useSavingPlan();
        return <div data-testid="result">{result.delay}</div>;
      };
      const TestWrapper = () => (
        <SavingPlanContext.Provider
          value={{
            today: () => new Date(2023, 1, 1),
            transactionService: {
              getTotalSpentPerMonth: () =>
                Promise.resolve([{ month: new Date(2023, 0, 1), spent }]),
              getByPayeeAndMonth: () => Promise.resolve([]),
              getBySubcategoryAndMonth: () => Promise.resolve([]),
            },
            plan: {
              id: "testid",
              name: "test",
              started: new Date(2023, 0, 1),
              status: "ongoing",
              target: 1000,
              savings: [
                {
                  entity: {
                    id: "testentityid",
                    avgAmount: 1000,
                    category: "Cat",
                    name: "Sub",
                  },
                  percentToSave: 5,
                  type: "subcategory",
                },
              ],
              fromDraft: "draftid",
            },
          }}
        >
          <TestComponent />
        </SavingPlanContext.Provider>
      );

      //When
      await act(async () => render(<TestWrapper />));

      //Then
      expect(screen.getByTestId("result").innerHTML).toBe(delay.toString());
    });
  });
});

export {};
