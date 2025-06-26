import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export function ConnectedAccount() {
  // 연결된 주소 확인
  const account = useCurrentAccount();

  if (!account) return null;

  return (
    <div>
      <div>연결 주소: {account.address}</div>
      <OwnedObjects address={account.address} />
    </div>
  );
}

function OwnedObjects({address}: {address: string}) {
  const { data } = useSuiClientQuery('getOwnedObjects', {
    owner: address,
  });

  if (!data) return null;

  return (
    <ul>
			{data.data.map((object) => (
				<li key={object.data?.objectId}>
					<a href={`https://testnet.suivision.xyz/object/${object.data?.objectId}`}>
						{object.data?.objectId}
					</a>
				</li>
			))}
		</ul>
  )
}