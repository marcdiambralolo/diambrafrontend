'use client';
import { ReactNode, memo } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    id?: string;
    labelClassName?: string;
    containerClassName?: string;
}

const FormField = memo(({ label, children, id, labelClassName = "", containerClassName = "" }: FormFieldProps) => {
    const defaultLabelStyles = "block text-sm font-semibold text-gray-700 mb-1";

    return (
        <section className={`mb-4 ${containerClassName}`} aria-labelledby={id ? `${id}-label` : undefined}>
            <label id={id ? `${id}-label` : undefined} htmlFor={id}
                className={`${defaultLabelStyles} ${labelClassName}`}
            >
                {label}
            </label>
            {children}
        </section>
    );
});

FormField.displayName = "FormField";

export default FormField;