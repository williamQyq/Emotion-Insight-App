describe("voice particle app test", () => {
	const port = 5173;
	beforeEach(() => {
		// Cypress starts out with a blank slate for each test
		// so we must tell it to visit our website with the `cy.visit()` command.
		// Since we want to visit the same URL at the start of all our tests,
		// we include it in our beforeEach function so that it runs before each test
		cy.visit(`http://localhost:${port}`);
	});

	it("text area should take input", () => {
		cy.get("textarea").type("hello").should("have.text", "hello");
	});

	it("list should have one item", () => {
		cy.get(".list-group-item").should("have.length", 1);
	});

	it("list should be able to add items", () => {
		cy.get("textarea").type("lucky day{cmd}{enter}");
		cy.get("li.list-group-item").should("have.length", 2);
	});

	it("list should show text", () => {
		cy.get("textarea").type("lucky day{cmd}{enter}");
		cy.get("li.list-group-item").should("contain", "Sentiment");
	});

	it("div should show duration", () => {
		cy.get("div.rec-duration").should("contain", "duration");
	});
});
