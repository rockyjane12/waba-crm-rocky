import React from "react";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface FormProps<TFormValues extends FieldValues> {
  schema: z.ZodType<TFormValues>;
  defaultValues?: DefaultValues<TFormValues>;
  onSubmit: (values: TFormValues) => Promise<void> | void;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  className?: string;
}

const FormComponent = <TFormValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = React.useCallback(
    async (data: TFormValues) => {
      await onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(handleSubmit)}
        noValidate
      >
        {children(methods)}
      </form>
    </FormProvider>
  );
};

export const Form = React.memo(FormComponent) as typeof FormComponent;

interface FormFieldProps {
  name: string;
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ name, label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}

export function FormActions({ children, align = "right" }: FormActionsProps) {
  return (
    <div
      className={`flex items-center gap-4 pt-4 ${
        align === "center"
          ? "justify-center"
          : align === "right"
            ? "justify-end"
            : "justify-start"
      }`}
    >
      {children}
    </div>
  );
}