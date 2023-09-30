const serviceAccount = require('./key.json')
const admin = require('firebase-admin')

const ENV = require('./env.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ENV.FIREBASE_URL
});

const db = admin.firestore()

async function main() {
  const commits = require('./fake-db-model.json')
  await Promise.all(commits.map(async (data, index) => {
    const { id, type, public, created_at, actor, repo, payload } = data
    const commit = { id, type, public, created_at }
    const commitActor = actor
    const commitRepository = repo
    const commitPayload = payload

    const commitRef = await db.collection('commits').add(commit)
    await db.collection('commits').doc(commitRef.id).update({ docId: commitRef.id })
    console.log(`Documento com o ID: ${commitRef.id} criado`)

    await Promise.all([
      db.collection('commits').doc(commitRef.id).collection('commit-actor').add(commitActor),
      db.collection('commits').doc(commitRef.id).collection('commit-repository').add(commitRepository),
      db.collection('commits').doc(commitRef.id).collection('commit-payload').add(commitPayload)
    ])

    console.log(`Sub coleções adicionadas`)
  }))
}

main().then()
