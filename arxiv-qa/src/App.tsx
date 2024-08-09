import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { InputPrompt } from "./components/InputPrompt";
import { Instructions } from "./components/Instructions";
import { usePappers

 } from "./hooks/usePappers";
export default function App() {
	const { data: pappersData, ...papperUtils } = usePappers();

	const [isLoading, setIsLoading] = useState(false);

	const pappers = useMemo(() => pappers?.data ?? null, [pappers]);
	const loadPappers = useCallback(async () => {
		setIsLoading(true);
		papperUtils.invalidateData();
		await papperUtils.fetch();
		setIsLoading(false);
	});

	const loadMorePappers = useCallback(async () => {
		await papperUtils.fetch();
	}, [papperUtils]);

	// change view more button style
	const handleViewMoreButtonStyle = useCallback(() => {
		// hide the view more button if there are no more transactions to load or an employee is selected
		if (pappers?.nextPage === null) {
			return "RampButton--invisible";
		}
		return "RampButton";
	}, [pappers]);

	return (
		<Fragment>
			<main className="MainContainer">
				<Instructions />

				<hr className="RampBreak--l" />
				<InputPrompt onReceiveUserInput={loadPappers} />
				<div className="RampBreak--l" />
				<div className="RampGrid">
					{pappers !== null &&
						pappers.map((papper) => (
							<PapperCard key={papper.id} papper={papper} />
						))}
				<div className="RampGrid">
					{pappers !== null && (
						<button
							className={handleViewMoreButtonStyle()}
							disabled={isLoading}
							onClick={async () => {
								await loadMorePappers();
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
