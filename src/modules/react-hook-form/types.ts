import type { ControllerProps, FieldValues, FieldError } from 'react-hook-form';

export interface ElementsBaseProps<TFieldValues extends FieldValues>
	extends Omit<ControllerProps<TFieldValues>, 'render'> {
	parseError?: (error: FieldError) => string;
}
