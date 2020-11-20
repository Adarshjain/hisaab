import ApolloBoost, {ApolloQueryResult, FetchResult} from 'apollo-boost';
import {addClientTag, CLIENTS_QUERY, deleteClientTag, updateClientTag} from './types/gqlVars';
import {Client, ClientInput} from "@/types/types";


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

export function fetchClients(): Promise<ApolloQueryResult<ClientQW>> {
    return server.query<ClientQW>({query: CLIENTS_QUERY})
}

export function addClient(client: ClientInput): Promise<FetchResult<ClientMW>> {
    return server.mutate<ClientMW>({mutation: addClientTag(client)});
}

export function deleteClient(id: string): Promise<FetchResult<ClientMW>> {
    return server.mutate<ClientMW>({mutation: deleteClientTag(id)});
}

export function updateClient(client: Client): Promise<FetchResult<ClientEditMW>> {
    return server.mutate<ClientEditMW>({mutation: updateClientTag(client)});
}