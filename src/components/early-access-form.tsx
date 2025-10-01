'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { signUpForEarlyAccess, type FormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

const initialState: FormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent animate-button-pulse w-48"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Joining...' : 'Get Early Access'}
      {!pending && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}

export default function EarlyAccessForm() {
  const [state, formAction] = useActionState(signUpForEarlyAccess, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      formRef.current?.reset();
    } else {
      toast({
        title: 'Oops!',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="flex w-full items-start space-x-2">
      <div className="flex-1">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="max-w-lg flex-1"
          aria-label="Email for early access"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
