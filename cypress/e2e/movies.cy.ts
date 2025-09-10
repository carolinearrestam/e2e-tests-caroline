describe("MovieApp", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("should load the search form", () => {
    const input = cy.get("input#searchText").should("exist").and("have.attr", "placeholder", "Skriv titel här");
    const button = cy.get("button#search").should("exist").and("have.text", "Sök");
    input.should("exist");
    button.should("exist");
  });

  it("should show movies when searching a valid title-happy flow", () => {
    cy.get("input#searchText").type("Harry Potter");
    cy.get("button#search").click();
    cy.get("div#movie-container").children().should("have.length.greaterThan", 0);
    cy.get("div.movie").first().within(() => {
      cy.get("h3").should("not.be.empty");
      cy.get("img").should("have.attr", "src");
    });
  });

  it("should show message if no movies are found", () => {
    cy.get("input#searchText").type("asdasdasd1234");
    cy.get("button#search").click();
    cy.get("div#movie-container").should("contain.text", "Inga sökresultat att visa");
  });

    it("should show fallback message if API has network error", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { forceNetworkError: true }).as("getMovies");
    cy.get("#searchText").type("Harry Potter");
    cy.get("#search").click();
    cy.wait("@getMovies");
    cy.get("#movie-container").should("contain.text", "Inga sökresultat att visa");
    });

    it("should show fallback message if API returns 500", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { statusCode: 500 }).as("getMovies");
    cy.get("#searchText").type("Harry Potter");
    cy.get("#search").click();
    cy.wait("@getMovies");
    cy.get("#movie-container").should("contain.text", "Inga sökresultat att visa");
    });

  it("Shows mocked data Spiderman", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {
      statusCode: 200,
      fixture: "spiderman.json",
    }).as("getMovies");

    cy.get("input#searchText").type("spiderman");
    cy.get("button#search").click();
    cy.wait("@getMovies");
    cy.get("#movie-container .movie").should("have.length", 2);
    cy.contains("Spiderman").should("exist");
    cy.contains("The Amazing Spiderman").should("exist");
  });

  it("should display movies sorted ascending (A-Ö)", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {
      statusCode: 200,
      fixture: "unsortedMovies.json",
    }).as("getMovies");
    cy.get("#searchText").type("heroes");
    cy.get("#sortOrder").select("true");
    cy.get("#search").click();
    cy.wait("@getMovies");
    cy.get("#movie-container .movie h3").first().should("contain.text", "Avengers");
    cy.get("#movie-container .movie h3").eq(1).should("contain.text", "Batman");
    cy.get("#movie-container .movie h3").last().should("contain.text", "Zorro");
  });

  it("should display movies sorted descending (Ö-A)", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {
      statusCode: 200,
      fixture: "unsortedMovies.json",
    }).as("getMovies");
    cy.get("#searchText").type("heroes");
    cy.get("#sortOrder").select("false");
    cy.get("#search").click();
    cy.wait("@getMovies");
    cy.get("#movie-container .movie h3").first().should("contain.text", "Zorro");
    cy.get("#movie-container .movie h3").eq(1).should("contain.text", "Batman");
    cy.get("#movie-container .movie h3").last().should("contain.text", "Avengers");
  });
});
