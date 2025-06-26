import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';

const gqlClient = new SuiGraphQLClient({
  url: 'https://sui-devnet.mystenlabs.com/graphql',
});

const FAUCET_PACKAGE = import.meta.env.VITE_FAUCET_PACKAGE_ID;
const FAUCET_OBJECT = import.meta.env.VITE_FAUCET_OBJECT;

const packageQuery = graphql(`
    query {
        objects(filter: { package: $pkg }) {
            nodes {
                objectId
                type
            }
        }
    }
`);

export function FaucetList() {

    const result = gqlClient.query({
        query: packageQuery,
        variables: { pkg: FAUCET_PACKAGE },
    });
    
    console.log("reault", result);
    return (
        <>
        {FAUCET_OBJECT}
        </>
    )

}