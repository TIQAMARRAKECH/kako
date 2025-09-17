function ajouterCommande() {
  const adresse = document.getElementById("clientAdresse").value;
  const phone = document.getElementById("clientPhone").value;
  const montant = document.getElementById("clientMontant").value;
  const user = auth.currentUser;

  db.ref("commandes").push({
    clientId: user.uid,
    adresse,
    phone,
    montant,
    status: "en attente"
  });

  alert("Commande envoyée !");
}

if (document.getElementById("commandesList")) {
  auth.onAuthStateChanged(u => {
    if (u) {
      db.ref("commandes").orderByChild("clientId").equalTo(u.uid).on("value", snapshot => {
        const list = document.getElementById("commandesList");
        list.innerHTML = "";
        snapshot.forEach(c => {
          const data = c.val();
          list.innerHTML += `<li>${data.adresse} - ${data.status}</li>`;
        });
      });
    }
  });
}

if (document.getElementById("adminCommandes")) {
  db.ref("commandes").on("value", snapshot => {
    const list = document.getElementById("adminCommandes");
    list.innerHTML = "";
    snapshot.forEach(c => {
      const data = c.val();
      list.innerHTML += `<li>${data.adresse} - ${data.montant} MAD - ${data.status}</li>`;
    });
  });
}