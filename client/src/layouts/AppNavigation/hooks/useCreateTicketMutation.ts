import { useMutation, UseMutationOptions } from 'react-query';

import { createTicket } from '@/api';
import type { PendingTicket, Ticket } from '@/api/types';

const useCreateTicketMutation = <TContext = unknown>(
	options?: Omit<
		UseMutationOptions<Ticket, unknown, PendingTicket, TContext>,
		'mutationFn'
	>
) => {
	return useMutation((ticketData: PendingTicket) => createTicket(ticketData), {
		...options,
		onSuccess: async (data, variables, context) => {
			//todo invalidate `tickets` query.
			return await options?.onSuccess?.(data, variables, context);
		},
	});
};

export default useCreateTicketMutation;
