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
