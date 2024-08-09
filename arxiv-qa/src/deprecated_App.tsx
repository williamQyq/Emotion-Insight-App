import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { InputSelect } from "./components/InputSelect";
import { Instructions } from "./components/Instructions";
import { Transactions } from "./components/Transactions";
import { useEmployees } from "./hooks/useEmployees";
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions";
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee";
import { EMPTY_EMPLOYEE } from "./utils/constants";
import { Employee } from "./utils/types";
import { InputPrompt } from "./components/InputPrompt";

export default function App() {
	const { data: employees, ...employeeUtils } = useEmployees();
	const { data: paginatedTransactions, ...paginatedTransactionsUtils } =
		usePaginatedTransactions();
	const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } =
		useTransactionsByEmployee();
	const [isLoading, setIsLoading] = useState(false);

	//selected employee id
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<Employee["id"]>("");

	const transactions = useMemo(
		() => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
		[paginatedTransactions, transactionsByEmployee],
	);

	const loadAllTransactions = useCallback(async () => {
		setIsLoading(true);
		transactionsByEmployeeUtils.invalidateData();

		await employeeUtils.fetchAll();

		// load employees finished
		setIsLoading(false);

		await paginatedTransactionsUtils.fetchAll();
	}, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils]);

	//load transactions by employee
	const loadTransactionsByEmployee = useCallback(
		async (employeeId: string) => {
			paginatedTransactionsUtils.invalidateData();
			await transactionsByEmployeeUtils.fetchById(employeeId);
		},
		[paginatedTransactionsUtils, transactionsByEmployeeUtils],
	);

	//TODO: Implement the loadMoreTransactions function
	const loadMoreTransactions = useCallback(
		async (employeeId: string) => {
			// load more transactions for all employees or the selected employee
			if (employeeId === "") {
				// await employeeUtils.fetchAll()
				await paginatedTransactionsUtils.fetchAll();
			} else {
				await transactionsByEmployeeUtils.fetchById(employeeId);
			}
		},
		[paginatedTransactionsUtils, transactionsByEmployeeUtils],
	);

	// change view more button style
	const handleViewMoreButtonStyle = useCallback(() => {
		// hide the view more button if there are no more transactions to load or an employee is selected
		if (paginatedTransactions?.nextPage === null || selectedEmployeeId !== "") {
			return "RampButton--invisible";
		}
		return "RampButton";
	}, [paginatedTransactions, selectedEmployeeId]);

	useEffect(() => {
		if (employees === null && !employeeUtils.loading) {
			loadAllTransactions();
		}
	}, [employeeUtils.loading, employees, loadAllTransactions]);

	return (
		<Fragment>
			<main className="MainContainer">
				<Instructions />

				<hr className="RampBreak--l" />

				<InputSelect<Employee>
					isLoading={isLoading}
					defaultValue={EMPTY_EMPLOYEE}
					items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
					label="Filter by category"
					loadingLabel="Loading categories..."
					parseItem={(item) => ({
						value: item.id,
						label: `${item.firstName} ${item.lastName}`,
					})}
					onChange={async (newValue) => {
						if (newValue === null) {
							return;
						}
						// load all transactions if the user selects the default value
						newValue.id === ""
							? await loadAllTransactions()
							: await loadTransactionsByEmployee(newValue.id);

						setSelectedEmployeeId(newValue.id);
					}}
				/>

				<div className="RampBreak--l" />

				<div className="RampGrid">
					<Transactions transactions={transactions} />

					{transactions !== null && (
						<button
							className={handleViewMoreButtonStyle()}
							disabled={paginatedTransactionsUtils.loading}
							onClick={async () => {
								await loadMoreTransactions(selectedEmployeeId);
							}}
						>
							View More
						</button>
					)}
				</div>
			</main>
		</Fragment>
	);
}
