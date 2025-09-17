// Vérifier l'état d'authentification au chargement de la page
function checkAuthState() {
  auth.onAuthStateChanged(user => {
    if (user) {
      db.ref("users/" + user.uid).once("value", snapshot => {
        const data = snapshot.val();
        if (data) {
          const currentPage = window.location.pathname.split('/').pop();
          const rolePage = data.role + '.html';
          
          // Rediriger si l'utilisateur est sur la mauvaise page
          if (currentPage !== rolePage && currentPage !== 'index.html') {
            window.location.href = rolePage;
          }
        }
      });
    } else if (window.location.pathname.split('/').pop() !== 'index.html') {
      window.location.href = 'index.html';
    }
  });
}

// Vérifier l'authentification au chargement de la page
checkAuthState();

function signup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  // Validation de base
  if (!name || !email || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  if (password.length < 6) {
    alert("Le mot de passe doit contenir au moins 6 caractères");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return db.ref("users/" + user.uid).set({ 
        name, 
        email, 
        role,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      });
    })
    .then(() => {
      alert("Inscription réussie !");
      // Effacer le formulaire
      document.getElementById("signupName").value = "";
      document.getElementById("signupEmail").value = "";
      document.getElementById("signupPassword").value = "";
    })
    .catch(error => {
      console.error("Erreur d'inscription:", error);
      alert("Erreur: " + error.message);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return db.ref("users/" + user.uid).once("value");
    })
    .then(snapshot => {
      const data = snapshot.val();
      if (data) {
        window.location.href = data.role + ".html";
      }
    })
    .catch(error => {
      console.error("Erreur de connexion:", error);
      alert("Erreur: " + error.message);
    });
}

function logout() {
  auth.signOut()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => {
      console.error("Erreur de déconnexion:", error);
    });
}
