import { ZeroAddress, truncateEthAddress } from '@betfinio/abi';
import { useCustomUsername, useUsername } from 'betfinio_context/lib/query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

function PlayerAddress(props: { address: Address }) {
	const { address: me = ZeroAddress } = useAccount();
	const { data: username = '' } = useUsername(props.address);
	const { data: customUsername = '' } = useCustomUsername(me, props.address);

	return <>{customUsername || username || truncateEthAddress(props.address)}</>;
}
export default PlayerAddress;
