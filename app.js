// Fonction pour ajouter une commande
function ajouterCommande() {
  const adresse = document.getElementById("clientAdresse").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const montant = document.getElementById("clientMontant").value;
  const user = auth.currentUser;

  // Validation
  if (!adresse || !phone || !montant) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  if (isNaN(montant) || parseFloat(montant) <= 0) {
    alert("Veuillez entrer un montant valide");
    return;
  }

  db.ref("commandes").push({
    clientId: user.uid,
    clientName: user.displayName || "Client",
    adresse,
    phone,
    montant: parseFloat(montant),
    status: "en attente",
    createdAt: firebase.database.ServerValue.TIMESTAMP
  })
  .then(() => {
    alert("Commande envoyée !");
    // Effacer le formulaire
    document.getElementById("clientAdresse").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("clientMontant").value = "";
  })
  .catch(error => {
    console.error("Erreur:", error);
    alert("Erreur lors de l'envoi de la commande");
  });
}

// Charger les commandes pour le client
if (document.getElementById("commandesList")) {
  auth.onAuthStateChanged(user => {
    if (user) {
      db.ref("commandes")
        .orderByChild("clientId")
        .equalTo(user.uid)
        .on("value", snapshot => {
          const list = document.getElementById("commandesList");
          list.innerHTML = "";
          
          if (!snapshot.exists()) {
            list.innerHTML = "<li>Aucune commande</li>";
            return;
          }
          
          snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            const key = childSnapshot.key;
            const statusClass = "status-" + data.status.replace(" ", "-");
            list.innerHTML += `
              <li>
                <strong>Adresse:</strong> ${data.adresse}<br>
                <strong>Téléphone:</strong> ${data.phone}<br>
                <strong>Montant:</strong> ${data.montant} MAD<br>
                <strong>Statut:</strong> <span class="status-badge ${statusClass}">${data.status}</span>
              </li>`;
          });
        });
    }
  });
}

// Charger toutes les commandes pour l'admin
if (document.getElementById("adminCommandes")) {
  db.ref("commandes").on("value", snapshot => {
    const list = document.getElementById("adminCommandes");
    list.innerHTML = "";
    
    if (!snapshot.exists()) {
      list.innerHTML = "<li>Aucune commande</li>";
      return;
    }
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      const key = childSnapshot.key;
      const statusClass = "status-" + data.status.replace(" ", "-");
      list.innerHTML += `
        <li>
          <strong>Commande ID:</strong> ${key}<br>
          <strong>Client:</strong> ${data.clientName}<br>
          <strong>Adresse:</strong> ${data.adresse}<br>
          <strong>Montant:</strong> ${data.montant} MAD<br>
          <strong>Statut:</strong> <span class="status-badge ${statusClass}">${data.status}</span>
        </li>`;
    });
  });
}

// Charger les commandes assignées pour le livreur
if (document.getElementById("livreurCommandes")) {
  auth.onAuthStateChanged(user => {
    if (user) {
      // Cette requête suppose que vous ajouterez un champ "livreurId" aux commandes lorsqu'elles sont assignées
      db.ref("commandes")
        .orderByChild("livreurId")
        .equalTo(user.uid)
        .on("value", snapshot => {
          const list = document.getElementById("livreurCommandes");
          list.innerHTML = "";
          
          if (!snapshot.exists()) {
            list.innerHTML = "<li>Aucune commande assignée</li>";
            return;
          }
          
          snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            const key = childSnapshot.key;
            const statusClass = "status-" + data.status.replace(" ", "-");
            list.innerHTML += `
              <li>
                <strong>Adresse:</strong> ${data.adresse}<br>
                <strong>Client:</strong> ${data.clientName}<br>
                <strong>Téléphone:</strong> ${data.phone}<br>
                <strong>Montant:</strong> ${data.montant} MAD<br>
                <strong>Statut:</strong> <span class="status-badge ${statusClass}">${data.status}</span><br>
                <button onclick="changerStatut('${key}', 'en cours')">Commencer livraison</button>
                <button onclick="changerStatut('${key}', 'livrée')">Marquer comme livrée</button>
              </li>`;
          });
        });
    }
  });
}
