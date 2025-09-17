function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      db.ref("users/" + user.uid).set({ name, email, role });
      alert("Inscription réussie !");
    })
    .catch(error => alert(error.message));
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      db.ref("users/" + user.uid).once("value", snapshot => {
        const data = snapshot.val();
        if (data.role === "client") window.location.href = "client.html";
        else if (data.role === "livreur") window.location.href = "livreur.html";
        else if (data.role === "admin") window.location.href = "admin.html";
      });
    })
    .catch(error => alert(error.message));
}