'use client'

import { useFormStatus } from 'react-dom';
import Button from './form-components/button/button';

export default function SubmitButton(props: any) {
    const { pending } = useFormStatus();

    const {id, text, ...rest} = props;

    return (

            <Button
                id={id}
                type="submit"
                text={pending ? 'Loading...' : text}
                {...rest}
            />
    )
}