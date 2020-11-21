import ApolloBoost from 'apollo-boost';
import {Client, ClientInput, TransactionInput} from "@/types/types";
import firebase from "firebase";


const server = new ApolloBoost({
    uri: 'https://graphql.fauna.com/graphql',
    headers: {
        authorization: 'Bearer fnAD68_IdIACB-05me45fnsuB9KtFTYW-AbG15O_'
    }
});

interface ClientQW {
    clients: { data: Client[] }
}

interface ClientMW {
    createClient: Client
}

interface ClientEditMW {
    updateClient: Client
}

// export function fetchClients(): Promise<ApolloQueryResult<ClientQW>> {
//     return server.query<ClientQW>({query: CLIENTS_QUERY})
// }

// export function addClient(client: ClientInput): Promise<FetchResult<ClientMW>> {
//     return server.mutate<ClientMW>({mutation: addClientTag(client)});
// }

// export function deleteClient(id: string): Promise<FetchResult<ClientMW>> {
//     return server.mutate<ClientMW>({mutation: deleteClientTag(id)});
// }

// export function updateClient(client: ClientDetails): Promise<FetchResult<ClientEditMW>> {
//     return server.mutate<ClientEditMW>({mutation: updateClientTag(client)});
// }


import firestore = firebase.firestore;
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentData = firebase.firestore.DocumentData;
import QuerySnapshot = firebase.firestore.QuerySnapshot;

firebase.initializeApp({
    apiKey: "AIzaSyC3ONUWh0eYRzCzNypTm8uO-PfTYmPW-xc",
    authDomain: "hisaab-b3de7.firebaseapp.com",
    databaseURL: "https://hisaab-b3de7.firebaseio.com",
    projectId: "hisaab-b3de7",
    storageBucket: "hisaab-b3de7.appspot.com",
    messagingSenderId: "980428018683",
    appId: "1:980428018683:web:ebc53f3da69bcd4158f15e"
});
const db = firestore();

const CLIENT = "client";
const TRANSACTION = "transaction";

export function fetchClients() {
    return db.collection(CLIENT).get({source: "server"});
}

export function fetchClient(id: string) {
    return db.collection(CLIENT).doc(id).get({source: "server"});
}

export async function addClient(client: ClientInput): Promise<DocumentReference<any>> {
    return db.collection(CLIENT).add(client);
}

export async function deleteClient(id: string): Promise<void> {
    return db.collection(CLIENT).doc(id).delete();
}

export async function updateClient(id: string, client: ClientInput): Promise<void> {
    return db.collection(CLIENT).doc(id).update(client);
}

export async function addTransaction(transaction: TransactionInput): Promise<DocumentReference<DocumentData>> {
    return db.collection(TRANSACTION).add(transaction);
}

export async function deleteTransaction(id: string): Promise<void> {
    return db.collection(TRANSACTION).doc(id).delete();
}

export async function updateTransaction(id: string, transaction: TransactionInput): Promise<void> {
    return db.collection(TRANSACTION).doc(id).update(transaction);
}

export async function getTransactionOfClient(clientId: string): Promise<QuerySnapshot<DocumentData>> {
    return db.collection(TRANSACTION)
        .where("clientId", "==", clientId)
        .get({source: "server"})
}
