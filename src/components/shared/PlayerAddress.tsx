import { ZeroAddress } from '@betfinio/abi';
import { useUsername } from 'betfinio_context/lib/query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

function PlayerAddress(props: { address: Address }) {
	const { address: me = ZeroAddress } = useAccount();
	const { data: username = '' } = useUsername(props.address, me);

	return <>{username}</>;
}
export default PlayerAddress;
