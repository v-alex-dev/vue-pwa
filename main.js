/**
 * Fetches voyage data from the API and updates the DOM elements with the retrieved information.
 * 
 * This function makes an HTTP request to retrieve voyage data, extracts the first voyage item,
 * and populates the corresponding DOM elements with the voyage label, description, and price.
 * 
 * @async
 * @function fetchVoyageData
 * @returns {Promise<void>} A promise that resolves when the data has been fetched and DOM updated
 * @throws {Error} Logs error to console if the fetch operation or DOM manipulation fails
 * 
 * @example
 * // Call the function to fetch and display voyage data
 * await fetchVoyageData();
 */
const fetchVoyageData = async () => {
  try {
    const rep = await fetch(
      "https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/items/voyages"
    );
    const data = await rep.json();
    const voyageElement = document.querySelector(".voyage");
    const descriptionElement = document.querySelector(".description");
    const priceElement = document.querySelector(".price");

    const voyageData = data[0];

    voyageElement.innerHTML = voyageData["voyages-label"];
    descriptionElement.innerHTML = voyageData["voyages-description"];
    priceElement.innerHTML = voyageData["voyages-prix"];
  } catch (error) {
    console.error("Error fetching voyage data:", error);
  }
};

fetchVoyageData();
