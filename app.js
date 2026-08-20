const PROJECT_ID = '6a86d660001aade838a5';
const DATABASE_ID = '6a86da270020ae728bcd';
const COLLECTION_ID = 'invites';

const client = new Appwrite.Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const databases = new Appwrite.Databases(client);

async function verifierInvite() {
  const documentId = document.getElementById('guestId').value.trim();
  const resultDiv = document.getElementById('result');

  if (!documentId) {
    resultDiv.innerHTML = "<p style='color:#ef4444; font-weight:600;'>Veuillez entrer un ID d'invité valide.</p>";
    return;
  }

  resultDiv.innerHTML = "<p style='color:#64748b;'>Recherche en cours...</p>";

  try {
    const invite = await databases.getDocument(DATABASE_ID, COLLECTION_ID, documentId);
    
    let html = `<div class="guest-info-card">`;
    html += `<p><strong>Nom :</strong> ${invite.Nom || invite.nom || 'N/A'}</p>`;
    html += `<p><strong>Table :</strong> ${invite.num_table || 'Non assignée'}</p>`;
    html += `<p><strong>Statut :</strong> ${invite.statut || 'N/A'}</p>`;
    html += `<p><strong>Boisson :</strong> ${invite.boissons || invite.boisson || 'N/A'}</p>`;
    html += `</div>`;

    if (invite.est_utilise) {
      html += `<div class="status-badge status-used">⚠️ Ce billet a déjà été utilisé !</div>`;
    } else {
      html += `<div class="status-badge status-ok">✅ Billet Valide</div>`;
      html += `<button class="btn-validate" onclick="validerEntree('${invite.$id}')">Marquer comme Présent</button>`;
    }

    resultDiv.innerHTML = html;
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p style='color:#ef4444; font-weight:600;'>❌ Invité introuvable ou code incorrect.</p>";
  }
}

async function validerEntree(documentId) {
  try {
    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, {
      est_utilise: true
    });
    alert("Entrée validée avec succès !");
    verifierInvite();
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la validation du billet.");
  }
}
