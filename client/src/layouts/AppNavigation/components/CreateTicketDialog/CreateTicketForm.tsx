import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { nanoid } from 'nanoid';
import { Controller, FieldPath } from 'react-hook-form';
import { z } from 'zod';

import type { PendingTicket } from '@/api/types';
import OrganizationMembershipPicker from '@/common/components/OrganizationMembershipPicker';
import { useAuth } from '@/common/context/AuthProvider';
import useOrganizationMemberships from '@/common/hooks/useOrganizationMemberships';
import useProjects from '@/common/hooks/useProjects';
import useStoppableEffect from '@/common/hooks/useStoppableEffect';
import assertIsNonNullable from '@/common/utils/assertIsNonNullable';
import getWrongTypeMessage from '@/common/utils/getWrongTypeMessage';
import {
	MAX_ATTACHMENT_SIZE,
	REQUIRED_FIELD_ERROR_MESSAGE,
	TICKET_PRIORITY_OPTIONS,
	TICKET_TYPE_OPTIONS,
} from '@/constants';
import {
	TextFieldElement,
	RichTextEditorElement,
	AutocompleteElement,
	useForm,
} from '@/modules/react-hook-form';
import {
	ticketSchema,
	ticketTypeAutocompleteSchema,
	ticketPendingAttachmentSchema,
	ticketPriorityAutocompleteSchema,
} from '@/validation';

import DropZone, { OnFileAttached } from './DropZone';
import PendingAttachmentsList from './PendingAttachmentsList';

export interface CreateTicketFormProps {
	organizationId: string;
	id?: string;
	selectedProjectId?: string;
	onSubmit: (pendingTicket: PendingTicket) => void;
	resetOnSubmit?: boolean;
}

interface CreateTicketFormValues
	extends Omit<PendingTicket, 'project' | 'type' | 'priority'> {
	project: PendingTicket['project'] | null;
	type: PendingTicket['type'] | null;
	priority: PendingTicket['priority'] | null;
}

const formSchema = z.object({
	name: ticketSchema.shape.name.min(1, REQUIRED_FIELD_ERROR_MESSAGE),
	project: z.object(
		{ ...ticketSchema.shape.project.shape },
		{ invalid_type_error: REQUIRED_FIELD_ERROR_MESSAGE }
	),
	description: ticketSchema.shape.description,
	assignees: ticketSchema.shape.assignees,
	attachments: z.array(ticketPendingAttachmentSchema),
	type: ticketTypeAutocompleteSchema,
	priority: ticketPriorityAutocompleteSchema,
});

const ticketTypeArray = Object.values(TICKET_TYPE_OPTIONS);

const ticketPriorityArray = Object.values(TICKET_PRIORITY_OPTIONS);

const CreateTicketForm = ({
	id,
	organizationId,
	selectedProjectId,
	onSubmit,
	resetOnSubmit,
}: CreateTicketFormProps) => {
	const {
		data: organizationMemberships = [],
		isLoading: isLoadingOrganizationMemberships,
		isLoadingError: organizationMembershipsCouldntBeLoaded,
	} = useOrganizationMemberships(organizationId, {
		useErrorBoundary: false, // disable the error boundary, because `assignees` is an optional field and the form can be submitted even if this field is empty.
	});

	const { data: projects = [], isLoading: isLoadingProjects } =
		useProjects(organizationId);

	const {
		control,
		createSubmitHandler,
		setValue,
		getValues,
		setFocus,
		setError,
		formState: { isSubmitted },
		reset: resetForm,
	} = useForm<CreateTicketFormValues>({
		defaultValues: {
			name: '',
			project:
				(selectedProjectId &&
					// try to set the value as soon as possible in the case that projects has data cached on first render.
					projects.find((project) => project.id === selectedProjectId)) ||
				null,
			description: '',
			assignees: [],
			type: TICKET_TYPE_OPTIONS['BUG'],
			priority: TICKET_PRIORITY_OPTIONS['HIGH'],
			attachments: [],
		},
		schema: formSchema,
	});

	const { currentOrganizationMembership } = useAuth({
		assertMode: 'everything',
	});

	useStoppableEffect(
		(stopRunningEffect) => {
			if (!selectedProjectId || isLoadingProjects) return;

			const projectAlreadySet = getValues('project') !== null;

			// in case there was data cahed for `projects` and the default value for `project` was set succesfully then we just stop the effect, there's nothing else to do.
			if (projectAlreadySet) {
				stopRunningEffect();
				return;
			}

			const selectedProject = projects.find(
				(project) => project.id === selectedProjectId
			);

			if (!selectedProject) {
				console.error(
					`Couldn't find project with the id \`${selectedProjectId}\` inside \`projects\`.`
				);
				return;
			}

			setValue('project', selectedProject, { shouldValidate: isSubmitted });

			// if we set the value succesfully, then that's it, mark the effect as stopped.
			stopRunningEffect();
		},
		[
			selectedProjectId,
			setValue,
			projects,
			isSubmitted,
			isLoadingProjects,
			getValues,
		]
	);

	/* 
		There are a few values that are required and have an initial value of `null`. Because of our schema, the form shouldn't be submitable if these values are `null`, so we don't really need to use this function to assert their value, but typescript	doesn't know this and still complains about the posibility of these values being `null`. So that's why this function exists, to act as a type guard. It'll probably never have to execute the onError callback unless either the user somehow hacks the app and tries to submit the form with a null value, or I make a change to the schema in the future and I screw up and forget to check that autocomplete values are non-nullable.
	*/
	function assertRequiredValueIsNonNullable<T>(
		value: T,
		fieldPath: FieldPath<CreateTicketFormValues>
	): asserts value is NonNullable<T> {
		//todo maybe make this use formSchema.shape instead? we could do something like: formSchema.shape[fieldPath].parse(value)
		assertIsNonNullable(value, {
			message: getWrongTypeMessage(fieldPath, value),
			onError: () => {
				setError(
					fieldPath,
					{ type: 'required', message: REQUIRED_FIELD_ERROR_MESSAGE },
					{ shouldFocus: true }
				);
			},
		});
	}

	const handleSubmit = ({
		type,
		priority,
		project,
		...restOfTicketData
	}: CreateTicketFormValues) => {
		assertRequiredValueIsNonNullable(type, 'type');

		assertRequiredValueIsNonNullable(priority, 'priority');

		assertRequiredValueIsNonNullable(project, 'project');

		const pendingTicket: PendingTicket = {
			type,
			priority,
			project,
			...restOfTicketData,
		};

		onSubmit(pendingTicket);

		if (resetOnSubmit) {
			resetForm();
		}
	};

	const isAssignedToCurrentUser = (
		assignees: CreateTicketFormValues['assignees']
	) =>
		assignees.findIndex(
			(assignee) => assignee.id === currentOrganizationMembership.id
		) !== -1;

	const assignToCurrentUser = () => {
		const assigneesPath = 'assignees';

		const currentAssignees = getValues(assigneesPath);

		setFocus(assigneesPath);

		if (isAssignedToCurrentUser(currentAssignees)) return;

		setValue(
			assigneesPath,
			[...currentAssignees, currentOrganizationMembership],
			{ shouldValidate: isSubmitted }
		);
	};

	const setAttachmentsValue = (
		newValueOrUpdater:
			| CreateTicketFormValues['attachments']
			| ((
					prevValue: CreateTicketFormValues['attachments']
			  ) => CreateTicketFormValues['attachments'])
	) => {
		const attachmentsPath = 'attachments';

		const newValue =
			typeof newValueOrUpdater !== 'function'
				? newValueOrUpdater
				: newValueOrUpdater(getValues(attachmentsPath));

		setValue(attachmentsPath, newValue, { shouldValidate: isSubmitted });
	};

	const handleFileAttached: OnFileAttached = (event, attachedFiles) => {
		const newAttachments = attachedFiles.map((attachedFile) => ({
			file: attachedFile,
			id: nanoid(),
		}));
		setAttachmentsValue((previousAttachments) => [
			...previousAttachments,
			...newAttachments,
		]);
	};

	const removeAttachment = (indexOfAttachmentToBeRemoved: number) =>
		setAttachmentsValue((previousAttachments) =>
			previousAttachments.filter(
				(attachment, index) => index !== indexOfAttachmentToBeRemoved
			)
		);

	return (
		<form id={id} onSubmit={createSubmitHandler(handleSubmit)} noValidate>
			<AutocompleteElement
				name="project"
				control={control}
				options={projects}
				loading={isLoadingProjects}
				getOptionLabel={(project) => project.name}
				isOptionEqualToValue={(project, selectedProject) =>
					project.id === selectedProject.id
				}
				TextFieldProps={{
					label: 'Project',
					margin: 'normal',
					required: true,
				}}
			/>
			<Divider />
			<TextFieldElement
				name="name"
				control={control}
				label="Name"
				margin="normal"
				fullWidth
				required
			/>
			<RichTextEditorElement
				name="description"
				control={control}
				label="Description"
				margin="normal"
			/>
			<Controller
				name="assignees"
				control={control}
				render={({
					field: { onChange, onBlur, ref, value, name },
					fieldState: { error },
				}) => {
					const currentUserIsAssigned = isAssignedToCurrentUser(value);

					const errorMessage = error
						? error.message
						: organizationMembershipsCouldntBeLoaded
						? 'There was a problem trying to load users'
						: undefined;

					return (
						<>
							<OrganizationMembershipPicker
								multiple
								value={value}
								organizationMemberships={organizationMemberships}
								onBlur={onBlur}
								onChange={(event, value) => onChange(value)}
								TextFieldProps={{
									label: 'Assignees',
									margin: 'normal',
									name,
									inputRef: ref,
									error: Boolean(errorMessage),
									helperText: errorMessage,
								}}
								loading={isLoadingOrganizationMemberships}
								disabled={Boolean(organizationMembershipsCouldntBeLoaded)}
							/>
							{!currentUserIsAssigned && (
								<Button size="small" onClick={assignToCurrentUser}>
									Assign to me
								</Button>
							)}
						</>
					);
				}}
			/>
			<AutocompleteElement
				name="type"
				options={ticketTypeArray}
				control={control}
				TextFieldProps={{ label: 'Type', margin: 'normal', required: true }}
			/>
			<AutocompleteElement
				name="priority"
				control={control}
				options={ticketPriorityArray}
				TextFieldProps={{
					label: 'Priority',
					required: true,
					margin: 'normal',
				}}
			/>
			<Controller
				name="attachments"
				control={control}
				render={({ field: { value } }) => (
					<>
						<DropZone
							label="Attachments"
							onFileAttached={handleFileAttached}
							maxSize={MAX_ATTACHMENT_SIZE}
							sx={{ marginBottom: 1 }}
						/>
						{value.length > 0 && (
							<PendingAttachmentsList
								pendingAttachments={value}
								onAttachmentRemoved={removeAttachment}
							/>
						)}
					</>
				)}
			/>
		</form>
	);
};

export default CreateTicketForm;
