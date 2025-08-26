//Va permettre d'installer l'app
const installBtn = document.querySelector("#installBtn");

let deferredPrompt = null;

// Cacher le bouton par défaut jusqu'à ce que l'événement beforeinstallprompt se déclenche
installBtn.classList.add("hidden");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installBtn.classList.remove("hidden");
  //On récupère l'évent
  deferredPrompt = e;
});

installBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Vérifier que deferredPrompt est disponible avant de l'utiliser
  if (!deferredPrompt) {
    console.warn("L'installation n'est pas disponible pour le moment");
    return;
  }

  //On utilise le prompt pour lancer l'installation
  deferredPrompt.prompt();

  //Si on a installé l'app, le bouton sera masqué
  const userChoice = await deferredPrompt.userChoice;
  if (userChoice.outcome === "accepted") {
    installBtn.classList.add("hidden");
  }
  deferredPrompt = null;
});
//Event qui dit si mon app est installé
window.addEventListener("appinstalled", (e) => {
  //Alors je n'affiche pas le bouton
  installBtn.classList.add("hidden");
});
