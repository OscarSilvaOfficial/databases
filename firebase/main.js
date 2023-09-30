const admin = require('firebase-admin')
const ENV = require('./env.json')
const serviceAccount = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ENV.FIREBASE_URL
});

const db = admin.firestore()

async function readCollectionsTest() {
  console.time('Reading collections')
  const { docs } = await db.collection('commits').get()
  console.log(`Arquivos lidos: ${docs.length}`)
  console.timeEnd('Reading collections')
  console.log('===========================================')
}

async function readSubcollectionsTest() {
  console.time('Reading sub-collections')
  const { docs } = await db.collectionGroup('commit-actor').get()
  console.log(`Arquivos lidos: ${docs.length}`)
  console.timeEnd('Reading sub-collections')
  console.log('===========================================')
}

async function readDocByIdTest() {
  console.time('Reading doc by id')
  const doc = await db.doc('commits/0Fa5zKIKCOjqyRGKx5xu').get()
  console.log(`Arquivo lido com id: ${doc.data().id}`)
  console.timeEnd('Reading doc by id')
  console.log('===========================================')
}

async function readSubcollectionDocByIdTest() {
  console.time('Reading sub-collections doc by group')
  const { docs } = await db.collectionGroup('commit-actor').where('id', '==', 4119857).get()
  console.log(`Arquivo lido com id: ${docs[0].id}`)
  console.timeEnd('Reading sub-collections doc by group')
  console.log('===========================================')
}

readCollectionsTest().then()

readSubcollectionsTest().then()

readDocByIdTest().then()

readSubcollectionDocByIdTest().then()