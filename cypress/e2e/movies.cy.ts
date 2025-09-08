describe("MovieApp tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5175/");
  });

  it("should load the search form", () => {
    // Assign
    const input = cy.get("input#searchText").should("exist").and("have.attr", "placeholder", "Skriv titel här");
    const button = cy.get("button#search").should("exist").and("have.text", "Sök");

    // Assert
    input.should("exist");
    button.should("exist");
  });

  it("should show movies when searching a valid title", () => {
    // Assign
    const input = cy.get("input#searchText").should("exist");
    const button = cy.get("button#search").should("exist");

    // Act
    input.type("Harry Potter");
    button.click();

    // Assert
    cy.get("div#movie-container").children().should("have.length.greaterThan", 0);
    cy.get("div.movie").first().within(() => {
      cy.get("h3").should("not.be.empty");
      cy.get("img").should("have.attr", "src");
    });
  });

  it("should show message if no movies are found", () => {
    // Assign
    const input = cy.get("input#searchText").should("exist");
    const button = cy.get("button#search").should("exist");

    // Act
    input.type("asdasdasd1234");
    button.click();

    // Assert
    cy.get("div#movie-container").should("contain.text", "Inga sökresultat att visa");
  });

  it("should show fallback message if API fails", () => {
    // Arrange - mockat API
    cy.intercept("GET", "http://omdbapi.com/*", { forceNetworkError: true }).as("getMovies");

    const input = cy.get("input#searchText").should("exist");
    const button = cy.get("button#search").should("exist");

    // Act
    input.type("Harry Potter");
    button.click();

    cy.wait("@getMovies");

    // Assert
    cy.get("div#movie-container").should("contain.text", "Inga sökresultat att visa");
  });
});
