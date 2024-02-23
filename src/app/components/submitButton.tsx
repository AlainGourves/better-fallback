'use client'
import { forwardRef } from 'react';
import { useFormStatus } from 'react-dom';
import Button from './form-components/button/button';

type Ref = HTMLButtonElement;

const SubmitButton = forwardRef<Ref, any>((props, ref) => {
    const { pending } = useFormStatus();

    const { id, text, ...rest } = props;

    return (

        <Button
            ref={ref}
            id={id}
            type="submit"
            text={pending ? 'Loading...' : text}
            {...rest}
        />
    )
});
// To prevent eslint errors
SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;