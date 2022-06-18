import { zodResolver } from '@hookform/resolvers/zod';
import {
	useForm as useReactHookFormForm,
	UseFormProps as UseReactHookFormFormProps,
	FieldValues,
	UseFormReturn as UseReactHookFormFormReturn,
	UseFormHandleSubmit,
} from 'react-hook-form';
import type { ZodType, ZodTypeDef } from 'zod';

export interface UseFormProps<
	TFieldValues extends FieldValues = FieldValues,
	TContext = any,
	TSchema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
		unknown,
		ZodTypeDef,
		unknown
	>
> extends Omit<UseReactHookFormFormProps<TFieldValues, TContext>, 'resolver'> {
	schema?: TSchema;
}

export interface UseFormCreateSubmitHandler<
	TFieldValues extends FieldValues = FieldValues
> extends UseFormHandleSubmit<TFieldValues> {}

export interface UseFormReturn<
	TFieldValues extends FieldValues = FieldValues,
	TContext = any
> extends Omit<
		UseReactHookFormFormReturn<TFieldValues, TContext>,
		'handleSubmit'
	> {
	createSubmitHandler: UseFormCreateSubmitHandler<TFieldValues>;
}

const useForm = <
	TFieldValues extends FieldValues = FieldValues,
	TContext = any,
	TSchema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
		unknown,
		ZodTypeDef,
		unknown
	>
>({
	schema,
	...props
}: UseFormProps<TFieldValues, TContext, TSchema>): UseFormReturn<
	TFieldValues,
	TContext
> => {
	const { handleSubmit, ...methods } = useReactHookFormForm({
		...props,
		resolver: schema && zodResolver(schema),
	});

	return { ...methods, createSubmitHandler: handleSubmit };
};

export default useForm;
